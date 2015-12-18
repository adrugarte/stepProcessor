module Service {

    export class Utils{
        public Sources: Array<any>;
        constructor() {
            var _sources: Array<string> = ['Flyer', 'Clarin', 'Facebook', 'Volantes ','Referido','Otros'];
            this.Sources = _sources;
        }
    }
} 