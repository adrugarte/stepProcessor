
module Service {
    export interface IauthService {
        login: (logData: Models.ILoginData) => ng.IPromise<any>;
        hasRole: (role: string) => boolean;
        logOut: (domain?: string) => void;
        saveRegistration: (registrationData: Models.Iregistration) => any;
        roles: () => void;
        refreshToken: (domain: string) => ng.IPromise<any>;
        fillAuthData: () => void;
        authentication: Models.IAuthentication;
        requireLogin: (path:string) => boolean;
    }

    export class authService implements IauthService {
        //static $inject = ['$window', '$http', '$q', '$location', 'logedSites', '$timeout'];
        login: (logData: Models.ILoginData) => ng.IPromise<any>;
        hasRole: (role: string) => boolean;
        logOut: (domain: string) => void;
        saveRegistration: (registrationData: Models.Iregistration) => any;
        roles: () => void;
        refreshToken: (domain: string) => ng.IPromise<any>;
        fillAuthData: () => void;
        authentication: Models.IAuthentication = { isAuth: false, isAdmin: false, userName: "", roles: [], redirectTo: "" };
        requireLogin: (path:string) => boolean;

        constructor($window: ng.IWindowService, $http: ng.IHttpService, $q: ng.IQService, $location: ng.ILocationService, logedSites: Service.ILogedSites, $timeout: ng.ITimeoutService) {
            var self = this;
            var _useRefreshTokens: boolean = true;
            var _clientId: string = "stepProcessor";
            var serviceBase: string = "/";
            var timeAboutToExpire: number = 60000;
            var secondToMilisecond: number = 1000;
            var diff: number = -1;
            var _refreshTokenTimeOut = {};
            var refreshTokenPromise: any;
            var pathThatRequireLogin = ["/form", ""];

            var domainParser = function (url: string) {
                var parser = document.createElement('a');
                parser.href = url;
                return parser.hostname;
            }



            var url_domain = (data: string) => {
                var a = document.createElement('a');
                a.href = data;
                return a.hostname;
            }

            this.requireLogin = (path) => {
                return pathThatRequireLogin.indexOf(path) >= 0;
            }

            this.fillAuthData = () => {
                var authData = null;
                var hostName = null;
                var url = serviceBase.match("^/") ? $location.absUrl() : serviceBase.match("^http") ? serviceBase : null;
                if (url) hostName = url_domain(url);

                if (hostName) authData = logedSites.authdata(hostName);
                //var authData = localStorageService.get('authorizationData');

                if (authData) {
                    if (!_refreshTokenTimeOut[hostName]) _refreshTokenTimer(new Date().getTime() - new Date(authData.tokenExpires).getTime() - timeAboutToExpire, hostName);
                    self.authentication.isAuth = true;
                    self.authentication.userName = authData.userName;
                    self.roles();
                }

            }

            this.saveRegistration = (registration: Models.Iregistration) => {

                //_logOut();

                return $http.post(serviceBase + 'api/account/register', registration).then((response: any) => {
                    return response;
                });

            };


            this.login = function (loginData: Models.ILoginData): ng.IPromise<{}> {
                var hostName = null;
                var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

                if (_useRefreshTokens) {
                    data = data + "&client_id=" + _clientId;
                }

                var deferred = $q.defer();

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success((response: any) => {
                    var url = serviceBase.match("^/") ? $location.absUrl() : serviceBase.match("^http") ? serviceBase : null;
                    if (url) hostName = domainParser(url);
                    // Save the returned token for future use
                    //Add the host to the list of loged sites if does not exist
                    if (hostName && !logedSites.contain(hostName)) logedSites.add({ domain: hostName, token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: JSON.parse(response.roles) });
                    //If domain uses refreshtoken then start the refreshToken service
                    if (logedSites.authdata(hostName).useRefreshToken) _refreshTokenTimer((response.expires_in * secondToMilisecond) - timeAboutToExpire, hostName);

                    //localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
                    self.authentication.roles = JSON.parse(response.roles);
                    self.authentication.isAuth = true;
                    self.authentication.userName = loginData.userName;
                    self.authentication.isAdmin = self.hasRole("1");
                    deferred.resolve(response);
                }).error((err, status) => {
                    self.logOut("");
                    deferred.reject(err);
                });

                return deferred.promise;

            };

            this.roles = function () {
                self.authentication.isAdmin = false;
                $http.get("/api/account/roles").success((response: any) => {
                    var roles = [];
                    self.authentication.roles = response.$values;
                    for (var i = 0; i < self.authentication.roles.length; i++) {
                        if (self.authentication.roles[i].id == '1') {
                            self.authentication.isAdmin = true;
                            break;
                        }
                    }
                }).error((err: any, status: any) => {
                    self.logOut("");
                });
            };


            this.hasRole = (role: string) => {
                var hasrole = false;
                for (var i = 0; i < self.authentication.roles.length; i++) {
                    if (self.authentication.roles[i].id == role) {
                        hasrole = true;
                        break;
                    };
                }
                return hasrole;
            };

            this.logOut = (domain?:string) => {
                //If domain is undefined use ServiceBase
                var _domain = !domain ? serviceBase : domain
                //If url starts with / its a relative route base on $location
                _domain = url_domain(_domain.match("^/") ? $location.absUrl() : _domain);
                //Remove domain & token from LogedSites
                if (_refreshTokenTimeOut[_domain]) $timeout.cancel(_refreshTokenTimeOut[_domain]);

                if (_domain) logedSites.remove(_domain);
                self.authentication.isAuth = false;
                self.authentication.userName = "";
                self.authentication.isAdmin = false;

            };

            var _refreshTokenTimer = (time: number, domain: string) => {
                if (_refreshTokenTimeOut[domain]) $timeout.cancel(_refreshTokenTimeOut[domain]);
                _refreshTokenTimeOut[domain] = $timeout(() => {
                    var data = "grant_type=refresh_token&refresh_token=" + logedSites.authdata(domain).refreshToken + "&client_id=" + _clientId;
                    _refrehsTokenServerCall(data).success((response: any) => {
                        var _newData: Models.ILogedSite = { domain: domain, token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: response.roles };
                        _setNewToken(domain, _newData);
                        _refreshTokenTimer((response.expires_in * secondToMilisecond) - timeAboutToExpire, domain)
                    });
                }, time)
            };


            this.refreshToken = function (domain: string): ng.IPromise<{}> {
                var authData = null;
                var deferred = $q.defer();
                // if a refreshtoken service is running for this domain
                if (_refreshTokenTimeOut[domain]) {
                    deferred.resolve();
                } else { //if no refreshtoken serv is running we have to check for token expiration on each call
                    if (domain) authData = logedSites.authdata(domain);
                    if (authData && authData.useRefreshToken) {
                        var expirationTime = new Date(new Date(authData.tokenExpires).getTime() + diff * 60000).toISOString(); //Set expiration time a minute before token expire 
                        if (expirationTime <= new Date().toISOString()) { //if it's about a minute to expire expirationTime <= new Date().toISOString()
                            if (!refreshTokenPromise) {
                                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + _clientId;
                                refreshTokenPromise = _refrehsTokenServerCall(data);
                            }
                            refreshTokenPromise.success((response: any) => {
                                var _newData: Models.ILogedSite = { domain: domain, token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshToken: true, tokenExpires: response['.expires'], roles: response.roles };
                                _setNewToken(domain, _newData);
                                refreshTokenPromise = null;
                                deferred.resolve();
                            }).error(() => { refreshTokenPromise = null; deferred.resolve(); });
                        } else deferred.resolve();
                    } else deferred.resolve();
                }
                return deferred.promise;
            };

            function _setNewToken(domain: string, newData: Models.ILogedSite) {
                if (newData) {
                    var _userName = logedSites.authdata(domain).userName;
                    logedSites.remove(domain);
                    newData.userName = _userName;
                    logedSites.add(newData);
                    self.authentication.roles = JSON.parse(newData.roles);
                    self.authentication.isAdmin = self.hasRole("1");
                }

            }

            function _refrehsTokenServerCall(data: string): ng.IHttpPromise<{}> {
                return $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }


        }
    }
}


//AppoinmentApp.service('authService', ['$window', '$http', '$q', '$location','logedSites','$timeout', site.authService]);
 