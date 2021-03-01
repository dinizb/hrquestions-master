(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);
    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", "$rootScope", controller],
            link: link
        };

        function controller($scope, $http, $rootScope) { // example controller creating the scope bindings
            $scope.todos = [];
            // example of xhr call to the server's 'RESTful' api
            let page = 1;
            let size = 10;
            let nItem = 0;
            $scope.propertyName = "creationDate";
            $scope.reOrderBy = true;
            
            $http.get("api/Todo/Todos")
                .then(function (response) {
                    nItem = response.data.length;
                    $rootScope.$broadcast("loadData", { len: nItem, size: size });

                    $http.get("api/Todo/todoListPaginated/", {
                        params: {
                            size: size
                           ,page: page
                           ,orderBy: $scope.propertyName
                           ,reOrderBy: $scope.reOrderBy
                        }
                    }).then(function (response) {
                        $scope.todos = response.data;
                    });
                });
            $scope.sortBy = function (propertyName) {
                $scope.reOrderBy = (propertyName !== null && $scope.propertyName === propertyName)
                    ? !$scope.reOrderBy : false;
                $scope.propertyName = propertyName;
                $http.get("api/Todo/todoListPaginated/", {
                    params: {
                        size: size
                       ,page: page
                       ,orderBy: $scope.propertyName
                       ,reOrderBy: $scope.reOrderBy
                    }
                }).then(
                    function (response) {
                        $scope.todos = response.data;
                    }
                );
            };
            $rootScope.$on("changeItemsPerPage", function (ev, args) {
                if (args.val == "all") {
                    $http.get("api/Todo/Todos")
                        .then(function (response) {
                            $scope.todos = response.data;
                            $rootScope.$broadcast("loadData", { len: nItem, size: nItem });
                        });
                } else {
                    size = args.val;
                    $http.get("api/Todo/todoListPaginated/", {
                        params: {
                            size: size
                           ,page: 1 //ToDo: RETURN TO FIRST PAGE TO AVOID SHOWING MSG LIKE PAGE 5 of 3
                           ,orderBy: $scope.propertyName
                           ,reOrderBy: $scope.reOrderBy
                        }
                    }).then(function (response) {
                        $scope.todos = response.data;
                        $rootScope.$broadcast("loadData", { len: nItem, size: size });
                    });
                }
            });
            $rootScope.$on("changePage", function (ev, args) {
                page = args.val;
                $http.get("api/Todo/todoListPaginated/", {
                    params: {
                        size: size
                       ,page: page
                       ,orderBy: $scope.propertyName
                       ,reOrderBy: $scope.reOrderBy
                    }
                }).then(function (response) {
                    $scope.todos = response.data;
                });
            }
            );
        }

        function link(scope, element, attrs) { }
        return directive;
    }
    /**
     * Directive definition function of 'pagination' directive.
     * 
     * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", "$rootScope", controller],
            link: link
        };
        function controller($scope, $http, $rootScope) {
            $scope.paginationController = {}; 
            $rootScope.$on("loadData", function (ev, args) {
                $scope.paginationController.nItem = args.len;
                $scope.paginationController.nPage = Math.ceil($scope.paginationController.nItem / args.size);
            });
            $scope.changeItemsPerPage = function () {
                $rootScope.$broadcast("changeItemsPerPage", { val: $scope.paginationController.pageRow });
            }
            $scope.changePage = function () {
                if ($scope.paginationController.page > 0 && $scope.paginationController.page <= $scope.paginationController.nPage) {
                    $rootScope.$broadcast("changePage", { val: $scope.paginationController.page });
                }
            }
            $scope.firstPage = function () {
                $scope.paginationController.page = 1;
                $rootScope.$broadcast("changePage", { val: 1 });
            }
            $scope.previousPage = function () {
                if ($scope.paginationController.page > 1) {
                    $scope.paginationController.page = $scope.paginationController.page - 1;
                    $rootScope.$broadcast("changePage", { val: $scope.paginationController.page });
                }
            }
            $scope.nextPage = function () {
                if ($scope.paginationController.page < $scope.paginationController.nPage) {
                    $scope.paginationController.page = $scope.paginationController.page + 1;
                    $rootScope.$broadcast("changePage", { val: $scope.paginationController.page });
                }
            }
            $scope.lastPage = function () {
                $scope.paginationController.page = $scope.paginationController.nPage;
                $rootScope.$broadcast("changePage", { val: $scope.paginationController.page });
            }
        }

        function link(scope, element, attrs) { }
        return directive;
    }

})(angular);

