'use strict';

/**
 * @ngdoc function
 * @name testAppApp.controller:CreatequeryCtrl
 * @description
 * # CreatequeryCtrl
 * Controller of the testAppApp
 */
angular.module('testAppApp')
    .controller('QueryBuilderController', ['$scope', 'queryService', 
    function ($scope, queryService) {
        
        $scope.queryService = queryService;
        $scope.queryName = "Some Query";
        
        $scope.isGroup = function (item) {
            return item instanceof tsApp.Group;
        };
        $scope.isRule = function (item) {
            return item instanceof tsApp.Rule;
        };
        
        $scope.selectedDocumentType = queryService.knownDocuments[0];

        $scope.jsonQuery = "";
        $scope.jsonData = "";
        $scope.readable = "";
        $scope.queryString = "";
        $scope.$watch(function () {
            function skipParent(key, value) {
                if (value && key === "parent")
                    return value.title;
                return value;
            }

            $scope.jsonData = JSON.stringify($scope.data, skipParent, 4);

            try {
                var query = queryService.generate($scope.data[0]);
                $scope.jsonQuery = $scope.queryName + "\n" +
                    $scope.selectedDocumentType.name + "\n" +
                    JSON.stringify(query, null, 4);
                    
                $scope.readable = queryService.generateReadable($scope.data[0]);
                
                $scope.queryString = $.param(query);
            }
            catch (e) {
                $scope.jsonQuery = e;
            }
        });
    
        $scope.treeOptions = {
            accept: function (sourceNodeScope, destNodesScope, destIndex) {
                if (!destNodesScope.$nodeScope)
                    return false;
                return true;
            },
            dropped: function (event) {
                //Get Moved Object
                var scope = event.source.nodeScope;
                var movedObject = scope.$modelValue;

                //Get Source Parent
                var parentScope = scope.$parentNodeScope;
                var parent = parentScope.$modelValue;

                //If last rule is moved from group, lets remove the group
                if (parentScope && parent.items.length == 0) {
                    //Get Source Grand Parent
                    var grandParentScope = parentScope.$parentNodeScope;
                    var grandParent = grandParentScope.$modelValue;

                    grandParent.removeChild(parent);
                }

                //Update parent reference
                //Get Destination Parent
                var destParent = event.dest.nodesScope.$nodeScope.$modelValue;
                movedObject.parent = destParent;
            }
        };
        
        $scope.queryResult = "";
        $scope.executeQuery = function () {
            $.getJSON('/executeQuery', 
                queryService.generate($scope.data[0])
            ).done(function(data) {
                $scope.queryResult = JSON.stringify(data, null, 4);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
        
        function createTestData() {
            var fields = $scope.selectedDocumentType.fields;
            var operators = queryService.comparisonOperators;
            var group = new tsApp.Group();
            group.logicalOperator = queryService.logicalOperators[1];
            group.addRule();
            group.addRule();
            group.addGroup();
            group.addRule();
            
            group.items[0].field = fields[0];
            group.items[0].comparison = operators[5];
            group.items[0].value = "Some Text";
            
            group.items[1].field = fields[1];
            group.items[1].comparison = operators[0];
            group.items[1].value = "5";
            
            group.items[3].field = fields[4];
            group.items[3].comparison = operators[0];
            group.items[3].value = "true";
            
            var subGroup = group.items[2];
            subGroup.logicalOperator = queryService.logicalOperators[1];
            subGroup.addRule();
            
            subGroup.items[0].field = fields[2];
            subGroup.items[0].comparison = operators[1];
            subGroup.items[0].value = "321";
            
            subGroup.items[1].field = fields[5];
            subGroup.items[1].comparison = operators[4];
            subGroup.items[1].value = "10.5";
    
            return [
                group
            ];
        }

        $scope.data = createTestData();
    }])
    .directive('ngQueryBuilder', function() {
        return {
            templateUrl: 'views/ngQueryBuilder.html'
        };
    });
