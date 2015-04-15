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

        $scope.data = app.createTestData();


    });

(function ($scope, $) {
    
    $scope.createTestData = function() {
        var group = new tsApp.QueryRoot();
        group.addRule();

        //var sub = [
        //    new tsApp.Rule({
        //        title: "Rule 1",
        //        field: "Field1",
        //        value: "Value1",
        //        parent: group
        //    }),
        //    new tsApp.Group({
        //        title: "Group 2",
        //        parent: group,
        //        items: []
        //    }),
        //    new tsApp.Rule({
        //        title: "Rule 2",
        //        field: "Field2",
        //        value: "Value2",
        //        parent: group
        //    })
        //];
        //group.items = sub;

        //var subRule = new tsApp.Rule({
        //    title: "Rule 2.1",
        //    field: "Field2.1",
        //    value: "Value2.1",
        //    parent: sub[1]
        //});
        //sub[1].items.push(subRule);

        return [
            group
        ];
    };
    
}(window.app = window.app || {}, jQuery))