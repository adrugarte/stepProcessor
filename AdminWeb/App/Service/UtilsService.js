var Service;
(function (Service) {
    var Utils = (function () {
        function Utils() {
            var _sources = ['Flyer', 'Clarin', 'Facebook', 'Volantes ', 'Referido', 'American Travel', 'DMC Travel Agency', 'Otros'];
            this.Sources = _sources;
            this.virtualpath = $("#virtualpath").attr("href");
        }
        return Utils;
    })();
    Service.Utils = Utils;
})(Service || (Service = {}));
//# sourceMappingURL=UtilsService.js.map