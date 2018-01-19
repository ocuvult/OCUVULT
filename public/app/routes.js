var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

     $routeProvider

     .when('/', {
         templateUrl: 'app/views/pages/home.html'
     })

     .when('/about', {
         templateUrl: 'app/views/pages/about.html'
     })

     .when('/register', {
         templateUrl: 'app/views/pages/users/register.html',
         controller: 'regCtrl',
         controllerAs: 'register',
         authenticated: false
     })

     .when('/login', {
         templateUrl: 'app/views/pages/users/login.html',
         authenticated: false
     })

     .when('/loans', {
         templateUrl: 'app/views/pages/users/loans.html',
         authenticated: true
     })

     // .when('/mining', {
     //     templateUrl: 'app/views/pages/users/mining.html',
     //     authenticated: false
     // })

     .when('/whitepaper', {
         templateUrl: 'app/views/pages/whitepaper.html',
     })

     .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
     })

     .when('/profile', {
         templateUrl: 'app/views/pages/users/profile.html',
         controller: 'managementCtrl',
         controllerAs: 'management',
         authenticated: true
     })

     .when('/management', {
         templateUrl: 'app/views/pages/management/management.html',
         controller: 'managementCtrl',
         controllerAs: 'management',
         // permission: ['user', 'admin', 'moderator']
     })

     .when('/edit/:id', {
         templateUrl: 'app/views/pages/management/edit.html',
         controller: 'editCtrl',
         controllerAs: 'edit',
         authenticated: true,
     })


     .when('/createtoken', {
         templateUrl: 'app/views/pages/users/createtoken.html',
         controller: 'managementCtrl',
         controllerAs: 'management',
     })


    //  .when('/facebook/:token', {
    //      templateUrl: 'app/views/pages/users/social/social.html',
    //      controller: 'facebookCtrl',
    //      controllerAs: 'facebook'
    //  })
    //
    //  .when('/twitter/:token', {
    //      templateUrl: 'app/views/pages/users/social/social.html',
    //      controller: 'twitterCtrl',
    //      controllerAs: 'twitter'
    //  })
    //
    //  .when('/facebookerror', {
    //      templateUrl: 'app/views/pages/users/login.html',
    //      controller: 'facebookCtrl',
    //      controllerAs: 'facebook'
    //  })
    //
    //  .when('/twittererror', {
    //      templateUrl: 'app/views/pages/users/login.html',
    //      controller: 'twitterCtrl',
    //      controllerAs: 'twitter'
    //  })

     .otherwise({ redirectTo: '/'});

     $locationProvider.html5Mode({ enabled: true, requireBase: false });
});

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

   $rootScope.$on('$routeChangeStart', function(event, next, current) {

        if (next.$$route !== undefined) {

            if (next.$$route.authenticated === true) {

                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                 } else if (next.$$route.permission){

                     User.getOcuvult().then(function(data) {

                     });

                     User.getPermission().then(function(data) {
                         if (next.$$route.permission[0] !== data.data.permission) {
                             if (next.$$route.permission[1] !== data.data.permission) {
                                 event.preventDefault();
                                 $location.path('/');
                             }
                          }
                     });
                 }

             } else if (next.$$route.authenticated === false) {

                 if(Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                 }
             }
        }
    });
}]);
