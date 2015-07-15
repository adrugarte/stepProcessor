module Service {


    export class Uploader {
        public uploadFileToUrl: (file, uploadUrl) => void;
        constructor($http:ng.IHttpService) {
            this.uploadFileToUrl = function (files, uploadUrl) {
                var fd = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    fd.append('file', file);
                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                        .success(function (response) {
                        alert("It worked");
                    })
                        .error(function () {
                        alert("It didn't work");
                    });
                }
                    
             }

        }
    }


} 