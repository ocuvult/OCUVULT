angular.module('managementController', [])

.controller('managementCtrl', function(User) {
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 5;

    function getUsers() {
        User.getUsers().then(function(data) {
            if (data.data.success) {
                if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                    app.users = data.data.users;
                    app.loading = false;
                    app.accessDenied = false;
                    if(data.data.permission === 'admin') {
                       app.editAccess = true;
                       app.deleteAccess = true;
                    } else if (data.data.permission === 'moderator') {
                        app.editAccess = true;
                    }
                } else {
                    app.errorMsg = 'Insufficient Permissions';
                    app.loading = false;
                }
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getUsers();

    app.showMore = function(number) {
        app.showMoreError = false;

        if(number > 0) {
           app.limit = number;
        } else {
           app.showMoreError = 'Please enter a valid number';
        }

    };

    app.showAll = function() {
        app.limit = undefined;
        app.showMoreError = false;

    };

    app.deleteUser = function(username) {
        User.deleteUser(username).then(function(data) {
            if (data.data.success) {
                getUsers();
            } else {
               app.showMoreError = data.data.message;
            }
        });

    };

})

.controller('editCtrl', function($scope, $routeParams, User, $timeout) {
    var app = this;
    $scope.nameTab = 'active';
    app.phase1 = true;

    User.getUser($routeParams.id).then(function(data) {
        if (data.data.success) {
            $scope.newName = data.data.user.name;
            $scope.newEmail = data.data.user.email;
            $scope.newUsername = data.data.user.username;
            $scope.newPermission = data.data.user.permission;
            $scope.newOcuvult = data.data.user.ocuvult;
            app.currentUser = data.data.user._id;
        } else {
            app.errorMsg = data.data.message;
        }
    });



    app.namePhase = function() {

        $scope.nameTab = 'active';
        $scope.usernameTab = 'default';
        $scope.emailTab = 'default';
        $scope.ocuvultTab = 'default';
        $scope.permissionsTab = 'default';
        app.phase1 = true;
        app.phase2 = false;
        app.phase3 = false;
        app.phase4 = false;
        app.phase5 = false;
        app.errorMsg = false;

    };

    app.emailPhase = function() {

        $scope.nameTab = 'default';
        $scope.usernameTab = 'default';
        $scope.emailTab = 'active';
        $scope.ocuvultTab = 'default';
        $scope.permissionsTab = 'default';
        app.phase1 = false;
        app.phase2 = true;
        app.phase3 = false;
        app.phase4 = false;
        app.phase5 = false;
        app.errorMsg = false;

    };

    app.usernamePhase = function() {

        $scope.nameTab = 'default';
        $scope.usernameTab = 'active';
        $scope.emailTab = 'default';
        $scope.ocuvultTab = 'default';
        $scope.permissionsTab = 'default';
        app.phase1 = false;
        app.phase2 = false;
        app.phase3 = true;
        app.phase4 = false;
        app.phase5 = false;
        app.errorMsg = false;

    };

    app.ocuvultPhase = function() {

        $scope.nameTab = 'default';
        $scope.usernameTab = 'default';
        $scope.emailTab = 'default';
        $scope.ocuvultTab = 'active';
        $scope.permissionsTab = 'default';
        app.phase1 = false;
        app.phase2 = false;
        app.phase3 = false;
        app.phase4 = true;
        app.phase5 = false;
        app.errorMsg = false;

    };

    app.permissionsPhase = function() {

        $scope.nameTab = 'default';
        $scope.usernameTab = 'default';
        $scope.emailTab = 'default';
        $scope.ocuvultTab = 'default';
        $scope.permissionsTab = 'active';
        app.phase1 = false;
        app.phase2 = false;
        app.phase3 = false;
        app.phase4 = false;
        app.phase5 = true;
        app.disableUser = false;
        app.disableModerator = false;
        app.disableAdmin = false;
        app.errorMsg = false;

        if ($scope.newPermission === 'user') {
            app.disableUser = true;
        } else if ($scope.newPermission === 'moderator') {
            app.disableModerator = true;
        } else if ($scope.newPermission === 'admin') {
            app.disableAdmin = true;
        }

    };

    app.updateName = function(newName, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var userObject = {};

        if (valid) {
            userObject._id = app.currentUser;
            userObject.name = $scope.newName;
            User.editUser(userObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.nameForm.name.$setPristine();
                        app.nameForm.name.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }

            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly';
            app.disabled = false;
        }

    };

    app.updateEmail = function(newEmail, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var userObject = {};

        if (valid) {
            userObject._id = app.currentUser;
            userObject.email = $scope.newEmail;
            User.editUser(userObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.emailForm.email.$setPristine();
                        app.emailForm.email.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }

            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly';
            app.disabled = false;
        }

    };

    app.updateUsername = function(newUsername, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var userObject = {};

        if (valid) {
            userObject._id = app.currentUser;
            userObject.username = $scope.newUsername
            User.editUser(userObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.usernameForm.username.$setPristine();
                        app.usernameForm.username.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }

            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly';
            app.disabled = false;
        }

    };

    app.updateOcuvult = function(newOcuvult, valid) {
        app.errorMsg = false;
        app.disabled = true;
        var userObject = {};

        if (valid) {
            userObject._id = app.currentUser;
            userObject.username = $scope.newOcuvult
            User.editUser(userObject).then(function(data) {
                if (data.data.success) {
                    app.successMsg = data.data.message;
                    $timeout(function() {
                        app.usernameForm.username.$setPristine();
                        app.usernameForm.username.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }

            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly';
            app.disabled = false;
        }

    };



    app.updatePermissions = function(newPermission) {
        app.errorMsg = false; // Clear any error messages
        app.disableUser = true; // Disable button while processing
        app.disableModerator = true; // Disable button while processing
        app.disableAdmin = true; // Disable button while processing
        var userObject = {}; // Create the user object to pass to function
        userObject._id = app.currentUser; // Get the user _id in order to edit
        userObject.permission = newPermission; // Set the new permission to the user
        // Runs function to udate the user's permission
        User.editUser(userObject).then(function(data) {
            // Check if was able to edit user
            if (data.data.success) {
                app.successMsg = data.data.message; // Set success message
                // Function: After two seconds, clear and re-enable
                $timeout(function() {
                    app.successMsg = false; // Set success message
                    $scope.newPermission = newPermission; // Set the current permission variable
                    // Check which permission was assigned to the user
                    if (newPermission === 'user') {
                        app.disableUser = true; // Lock the 'user' button
                        app.disableModerator = false; // Unlock the 'moderator' button
                        app.disableAdmin = false; // Unlock the 'admin' button
                    } else if (newPermission === 'moderator') {
                        app.disableModerator = true; // Lock the 'moderator' button
                        app.disableUser = false; // Unlock the 'user' button
                        app.disableAdmin = false; // Unlock the 'admin' button
                    } else if (newPermission === 'admin') {
                        app.disableAdmin = true; // Lock the 'admin' buton
                        app.disableModerator = false; // Unlock the 'moderator' button
                        app.disableUser = false; // unlock the 'user' button
                    }
                }, 2000);
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.disabled = false; // Enable form for editing
            }
        });
    };
});
