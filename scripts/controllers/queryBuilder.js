'use strict';

/**
 * @ngdoc function
 * @name testAppApp.controller:CreatequeryCtrl
 * @description
 * # CreatequeryCtrl
 * Controller of the testAppApp
 */
angular.module('testAppApp')
    .controller('QueryBuilderController', function ($scope) {
        var generator = new tsApp.MongoGenerator();
        $scope.generator = generator;
        $scope.queryName = "";
        
        $scope.isGroup = function (item) {
            return item instanceof tsApp.Group || item instanceof tsApp.QueryRoot;
        };
        $scope.isRule = function (item) {
            return item instanceof tsApp.Rule;
        };
        
        $scope.logicalOperators = generator.logicalOperators;
        $scope.comparisonOperators = generator.comparisonOperators;

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
                var query = generator.generate($scope.data[0]);
                $scope.jsonQuery = $scope.queryName + "\n" +
                    $scope.generator.selectedDocumentType.name + "\n" +
                    JSON.stringify(query, null, 4);
                    
                $scope.readable = generator.generateReadable($scope.data[0]);
                
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
                console.log(event);
                console.log(event.source.nodeScope.siblings());
                console.log(event.source.nodeScope.item);

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
        
        function createTestData() {
            var fields = generator.selectedDocumentType.fields;
            var group = new tsApp.QueryRoot();
            group.addRule();
            group.addRule();
            group.addGroup();
            group.addRule();
            
            group.items[0].field = fields[0];
            group.items[0].comparison = "$ne";
            group.items[0].value = "Some Text";
            
            group.items[1].field = fields[1];
            group.items[1].comparison = "$eq";
            group.items[1].value = "5";
            
            group.items[3].field = fields[4];
            group.items[3].comparison = "$eq";
            group.items[3].value = "true";
            
            var subGroup = group.items[2];
            subGroup.addRule();
            
            subGroup.items[0].field = fields[2];
            subGroup.items[0].comparison = "$gt";
            subGroup.items[0].value = "321";
            
            subGroup.items[1].field = fields[3];
            subGroup.items[1].comparison = "$lte";
            subGroup.items[1].value = "123";
    
            return [
                group
            ];
        }

        $scope.data = createTestData();
    })
    .directive('ngQueryBuilder', function() {
        return {
            templateUrl: 'views/ngQueryBuilder.html'
        };
    });
