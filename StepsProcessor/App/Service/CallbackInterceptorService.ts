
module Service {
    export interface ICallBackInterceptorService {
        request: (config: any) => ng.IPromise<{}>;
        responseError: (rejection: any) => any;
    }

    export class CallBackInterceptorService implements ICallBackInterceptorService {
        static $inject = ['$q', '$location', '$injector', 'settingService'];
        request: (config: any) => ng.IPromise<{}>;
        responseError: (rejection: any) => ng.IPromise<void>;

        constructor($q: ng.IQService, $location: ng.ILocationService, $injector, settingService:Service.ISettingService) {
            function url_domain(data:string):string {
                var a = document.createElement('a');
                a.href = data;
                return a.hostname;
            }                   

            this.request = function (config): ng.IPromise<{}> {
                if (config.url.match("^/token|.html")) return config; //|| config.url.match("$.html")
                var deferred = $q.defer();
                //console.info("Token is Refreshing.? " + IsTokenRefreshing + " | " + config.url)
                config.headers = config.headers || {};
                //if its an api call we check for a ApiBaseURL, it returns something only in case Api is hosted in a diferent site
                if (config.url.match("^/api")) config.url = settingService.apiBaseUrl("") + config.url;
                // if url starts with / then use $location.absUrl() to get domain
                var domain = (config.url.match("^/")) ? $location.absUrl() : (config.url.match("^http") ? config.url : null);
                // if there is a valid URL
                if (domain) domain = url_domain(domain);
                var logedSites: Service.ILogedSites = $injector.get('logedSites');
                // Check if token exist for the domain and refresh it
                if (domain && logedSites.contain(domain) && logedSites.authdata(domain).useRefreshToken) {
                    var authService:Service.IauthService = $injector.get('authService');
                    authService.refreshToken(domain).then(function () {
                        config.headers.Authorization = 'Bearer ' + logedSites.authdata(domain).token;
                        deferred.resolve(config);
                    });
                } else deferred.resolve(config);

                config.domain = domain;
                return deferred.promise;

            }

            this.responseError = function (rejection: any): ng.IPromise<void> {
                if (rejection.status === 401) {
                    var authService: Service.IauthService = $injector.get('authService');
                    authService.logOut("");
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }

        }

    }
}

//AppoinmentApp.service('AuthInterceptorService', ['$q', '$location', '$injector', 'settingService', site.authInterceptorService]);
 