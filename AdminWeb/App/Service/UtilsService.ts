module Service {

    export class Utils{
        public Sources: Array<any>;
        constructor() {
            var _sources: Array<string> = ['Flyer', 'Clarin', 'Facebook', 'Volantes ','Otros'];
            this.Sources = _sources;
        }
    }
} 