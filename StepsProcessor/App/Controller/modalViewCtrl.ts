module Controller {

    export class AlertModalView {
        scope: Models.IModalViewScope;
        constructor($scope:Models.IModalViewScope,modals:Service.IModalWindowService) {
            var self = this;
            self.scope = $scope;

            // Setup default values using modal params.
            self.scope.message = (modals.params().message || "Whoa!");
            // ---
            // PUBLIC METHODS.
            // ---
            // Wire the modal buttons into modal resolution actions.
            self.scope.close = modals.resolve;


            self.scope.jumpToConfirm = ()=> {
                // We could have used the .open() method to jump from one modal
                // to the next; however, that would have implicitly "rejected" the
                // current modal. By using .proceedTo(), we open the next window, but
                // defer the resolution of the current modal until the subsequent
                // modal is resolved or rejected.
                modals.proceedTo(
                    "confirm",
                    {
                        message: "I just came from Alert - doesn't that blow your mind?",
                        confirmButton: "Eh, maybe a little",
                        denyButton: "Oh please"
                    }
                    )
                    .then(
                    function handleResolve() {
                        console.log("Piped confirm resolved.");
                    },
                    function handleReject() {
                        console.warn("Piped confirm rejected.");
                    }
                    );
            };


        }
    }

}