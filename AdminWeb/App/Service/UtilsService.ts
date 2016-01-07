module Service {

    export class Utils{
        public Sources: Array<any>;
        public virtualpath: string;
        constructor() {
            var _sources: Array<string> = ['Flyer', 'Clarin', 'Facebook', 'Volantes ','Referido','Otros'];
            this.Sources = _sources;
            this.virtualpath = $("#virtualpath").attr("href");
        }
    }
} 