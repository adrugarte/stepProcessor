
module Service {
    export interface ILogedSites {
        add: (logedSite: Models.ILogedSite) => void;
        contain: (domain: string) => boolean;
        token: (domain: string) => string;
        authdata: (domain: string) => Models.ILogedSite;
        remove: (domain: string) => void;
    }

    export class logedSites implements ILogedSites {
        static $inject = ['$window', '$http'];
        add: (logedSite: Models.ILogedSite) => void;
        contain: (domain: string) => boolean;
        token: (domain: string) => string;
        authdata: (domain: string) => Models.ILogedSite;
        remove: (domain: string) => void;


        constructor($window: ng.IWindowService, $http: ng.IHttpService) {
            var logSite = {};
            var logSites = [];

            this.add = (logedSite: Models.ILogedSite) => {
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (!logedSites) logedSites = [];
                logedSites.push(logedSite);
                $window.localStorage.setItem("logedSites", JSON.stringify(logedSites));
                logSites = JSON.parse($window.localStorage.getItem("logedSites"));
            }

            this.contain = (domain: string) => {
                var exist: boolean = false;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            exist = true;
                            break;
                        };
                    };
                };
                return exist;
            }

            this.token = (domain: string) => {
                var token: string = null;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            token = logedSites[i].token;
                            break;
                        };
                    };
                };
                return token;
            }

            this.authdata = (domain: string) => {
                var data: Models.ILogedSite = null;
                var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                if (logedSites) {
                    for (var i = 0; i < logedSites.length; i++) {
                        if (logedSites[i].domain === domain) {
                            data = logedSites[i];
                            break;
                        };
                    };
                };
                return data;
            }


            this.remove = (domain: string) => {
                if (this.contain(domain)) {
                    var node = null;
                    var logedSites = JSON.parse($window.localStorage.getItem("logedSites"));
                    if (logedSites) {
                        for (var i = logedSites.length - 1; i >= 0; i--) {
                            if (logedSites[i].domain === domain) {
                                node = i;
                                break;       //<-- Uncomment  if only the first term has to be removed
                            };
                        };
                        logedSites.splice(node, 1);
                        $window.localStorage.setItem("logedSites", JSON.stringify(logedSites));
                        logSites = JSON.parse($window.localStorage.getItem("logedSites"));
                    };
                }
            }
        }
    }
}

//AppoinmentApp.service('logedSites', ['$window', '$http', '$q', '$location', site.logedSites]);

 