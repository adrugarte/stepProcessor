module Controller {
    export interface ImainScope extends ng.IScope {
        texto: string;
    }

    export class main{
        scope: ImainScope;
        constructor(scope: ImainScope ) {
            var self = this;
            self.scope = scope;
            self.scope.texto = "Hello People";
        }
    }

 
} 