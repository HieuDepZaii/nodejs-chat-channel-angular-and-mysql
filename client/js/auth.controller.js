/**
* Real Time chatting app
* @author Shashank Tiwari
*/

'user strict';

app.controller('authController', function ($scope, $location, $timeout, appService) {

    $scope.data = {
        regEmail : '',
        regPassword : '',
        EmailAvailable : false,
        loginEmail : '',
        loginPassword : ''
    };

    /* usernamme check variables starts*/
    let TypeTimer;
    const TypingInterval = 800;
    /* usernamme check variables ends*/

    $scope.initiateCheckEmail = () => {
        $scope.data.EmailAvailable = false;
        $timeout.cancel(TypeTimer);
        TypeTimer = $timeout( () => {
            appService.httpCall({
                url: '/emailCheck',
                params: {
                    'email': $scope.data.regEmail
                }
            })
            .then((response) => {
                $scope.$apply( () =>{
                    $scope.data.emailAvailable = response.error ? true : false;
                });
            })
            .catch((error) => {
                $scope.$apply(() => {
                    $scope.data.emailAvailable = true;
                });

            });
        }, TypingInterval);
    }

    $scope.clearCheckEmail = () => {
        $timeout.cancel(TypeTimer);
    }

    $scope.registerUser = () => {
        appService.httpCall({
            url: '/registerUser',
            params: {
                'email': $scope.data.regEmail,
                'password': $scope.data.regPassword
            }
        })
        .then((response) => {
            $location.path(`/home/${response.userId}`);
            $scope.$apply();
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    $scope.loginUser = () => {
        appService.httpCall({
            url: '/login',

            params: {
                'email': $scope.data.loginEmail,
                'password': $scope.data.loginPassword
            }
        })
        .then((response) => {
            $location.path(`/home/${response.userId}`);
            $scope.$apply();
        })
        .catch((error) => {
            alert(error.message);
        });
    }
});
