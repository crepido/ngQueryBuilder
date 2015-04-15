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
        $scope.query = new app.Query();

        $scope.isGroup = function (item) {
            return item instanceof app.Group;
        };
        $scope.isRule = function (item) {
            return item instanceof app.Rule;
        };
        
        $scope.logicalOperators = app.logicalOperators;
        $scope.comparisonOperators = app.comparisonOperators;

        $scope.jsonQuery = "";
        $scope.$watch(function () {
            $scope.jsonQuery = JSON.stringify($scope.query, null, 4);
        });

        $scope.jsonData = "";
        $scope.$watch(function () {
            function skipParent(key, value) {
                if (value && key === "parent")
                    return value.title;
                return value;
            }

            $scope.jsonData = JSON.stringify($scope.data, skipParent, 4);

            var query = $scope.data[0].createQuery();
            $scope.jsonQuery = JSON.stringify(query, null, 4);
        });
    
        $scope.treeOptions = {
            accept: function (sourceNodeScope, destNodesScope, destIndex) {
                if (!destNodesScope.$nodeScope)
                    return false;
                //console.log(arguments);
                return true;
            },
            //beforeDrag: function (sourceNodeScope) {
            //    console.log(arguments);
            //    return true;
            //},
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
            },
            //dragStart: function (event) {

            //}
        };

        $scope.data = app.createTestData();


    });

(function ($scope, $) {

    $scope.Group = function (obj) {
        var self = this;
        self.type = "group";
        self.title = obj.title;
        self.items = [];
        self.parent = obj.parent;
        
        $.extend(self, {
            logical: "$and"
        });

        $.each(obj.items, function (i, item) {
            self.items.push(item);
        });

        self.addGroup = function () {
            var group = new app.Group({
                title: "New Group",
                parent: self,
                items: []
            });
            group.addRule();
            self.items.push(group);
        };
        self.addRule = function () {
            self.items.push(new app.Rule({
                title: "New Rule",
                parent: self
            }));
        };
        self.removeChild = function (rule) {
            var index = $.inArray(rule, self.items);
            self.items.splice(index, 1);

            if (self.parent && self.items.length === 0) {
                self.parent.removeChild(self);
            }
        };

        self.createQuery = function () {
            var subQueries = [];
            $.each(self.items, function (i, item) {
                var subQuery = item.createQuery();
                subQueries.push(subQuery);
            });

            var query = {};
            query[self.logical] = subQueries;

            

            return query;
        };
    };

    $scope.Rule = function (obj) {
        var self = this;
        self.type = "rule";
        self.title = obj.title;
        self.parent = obj.parent;

        $.extend(self, {
            field: "",
            comparison: "$eq",
            value: ""
        }, obj);

        self.remove = function () {
            self.parent.removeChild(self);
        };

        self.createQuery = function () {
            var query = {};
            query[self.field] = {};
            query[self.field][self.comparison] = self.value
            return query;
        };
    };

    $scope.createTestData = function() {
        var group = new app.Group({
            title: "Group 1",
            items: []
        });

        var sub = [
            new app.Rule({
                title: "Rule 1",
                field: "Field1",
                value: "Value1",
                parent: group
            }),
            new app.Group({
                title: "Group 2",
                parent: group,
                items: []
            }),
            new app.Rule({
                title: "Rule 2",
                field: "Field2",
                value: "Value2",
                parent: group
            })
        ];
        group.items = sub;

        var subRule = new app.Rule({
            title: "Rule 2.1",
            field: "Field2.1",
            value: "Value2.1",
            parent: sub[1]
        });
        sub[1].items.push(subRule);

        return [
            group
        ];
    };

    $.extend($scope, {
        comparisonOperators: [
			{ name: "==", operator: "$eq", desc: "Matches values that are equal to a specified value." },
			{ name: ">", operator: "$gt", desc: "Matches values that are greater than a specified value." },
			{ name: ">=", operator: "$gte", desc: "Matches values that are greater than or equal to a specified value." },
			{ name: "<", operator: "$lt", desc: "Matches values that are less than a specified value." },
			{ name: "<=", operator: "$lte", desc: "Matches values that are less than or equal to a specified value." },
			{ name: "!=", operator: "$ne", desc: "Matches all values that are not equal to a specified value." },
			{ name: "In", operator: "$in", desc: "Matches any of the values specified in an array." },
			{ name: "Not In", operator: "$nin", desc: "Matches none of the values specified in an array." }
        ],

        logicalOperators: [
			{ name: "Or", operator: "$or", desc: "Joins query clauses with a logical OR returns all documents that match the conditions of either clause." },
			{ name: "And", operator: "$and", desc: "Joins query clauses with a logical AND returns all documents that match the conditions of both clauses." },
			{ name: "Not", operator: "$not", desc: "Inverts the effect of a query expression and returns documents that do not match the query expression." },
			{ name: "Nor", operator: "$nor", desc: "Joins query clauses with a logical NOR returns all documents that fail to match both clauses." }
        ],


    });

    $scope.Query = function () {
        var self = this;

        $.extend(self, {
            rules: [new $scope.QueryRule()],
            name: "Query1",
        });

        self.addRule = function () {
            self.rules.push(new $scope.QueryRule());
        };
    };

    $scope.QueryRule = function () {
        var self = this;
        $.extend(self, {
            logical: "$and",
            field: "FieldName",
            comparison: "$eq",
            value: "Value1"
        });
    };

}(window.app = window.app || {}, jQuery))