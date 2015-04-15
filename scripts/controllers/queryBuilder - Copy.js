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
        
        $scope.logicalOperators = app.logicalOperators;
        $scope.comparisonOperators = app.comparisonOperators;

        $scope.jsonQuery = "";
        $scope.$watch(function () {
            $scope.jsonQuery = JSON.stringify($scope.query, null, 4);
        });

        $scope.jsonData = "";
        $scope.$watch(function () {
            //console.log($scope.data);
            $scope.jsonData = JSON.stringify($scope.data, null, 4);
        });

        //$scope.data = [
        //    new app.Node(
        //        {
        //            title: "Root",
        //            nodes: [{
        //                title: "Node 1",
        //                nodes: [
        //                    { title: "Node 1.1", nodes: [] },
        //                    { title: "Node 1.2", nodes: [] },
        //                    { title: "Node 1.3", nodes: [] },
        //                ]
        //            },
        //            {
        //                title: "Node 2",
        //                nodes: [
        //                    { title: "Node 2.1", nodes: [] },
        //                    { title: "Node 2.2", nodes: [] },
        //                    { title: "Node 2.3", nodes: [] },
        //                ]
        //            },
        //            {
        //                title: "Node 3",
        //                nodes: [
        //                    { title: "Node 3.1", nodes: [] },
        //                    { title: "Node 3.2", nodes: [] },
        //                    { title: "Node 3.3", nodes: [] },
        //                ]
        //            }]
        //        }
        //    )
        //];

        //$scope.data = [
        //    new app.Node({
        //        title: "Node 1",
        //        nodes: [
        //            { title: "Node 1.1", nodes: [] },
        //            { title: "Node 1.2", nodes: [] },
        //            { title: "Node 1.3", nodes: [] },
        //        ]
        //    }),
        //    new app.Node({
        //        title: "Node 2",
        //        nodes: [
        //            { title: "Node 2.1", nodes: [] },
        //            { title: "Node 2.2", nodes: [] },
        //            { title: "Node 2.3", nodes: [] },
        //        ]
        //    }),
        //    new app.Node({
        //        title: "Node 3",
        //        nodes: [
        //            { title: "Node 3.1", nodes: [] },
        //            { title: "Node 3.2", nodes: [] },
        //            { title: "Node 3.3", nodes: [] },
        //        ]
        //    })
        //];

        $scope.treeOptions = {
            accept: function (sourceNodeScope, destNodesScope, destIndex) {
                console.log(arguments);
                return true;
            },
            dropped: function (event) {
                console.log($scope.data);
            }
        };

        $scope.data = [
            new app.Node(
                {
                    title: "Root",
                    nodes: [{
                        title: "Node 1",
                        nodes: [
                            {
                                title: "Node 1.1",
                                nodes: []
                            },
                            {
                                title: "Node 1.2",
                                nodes: []
                            }
                        ]
                    },
                    {
                        title: "Node 2",
                        nodes: [
                            {
                                title: "Node 2.1",
                                nodes: []
                            },
                        ]
                    }]
                }
            )
        ];
    });

(function ($scope, $) {

    $scope.Node = function (obj) {
        var self = this;
        self.title = obj.title;
        self.nodes = [];

        self.hasChildren = function () {
            return self.nodes.length > 0;
        };

        self.logicalOperator = "And";

        $.extend(self, {
            logical: "$and",
            field: "",
            comparison: "$eq",
            value: ""
        });

        $.each(obj.nodes, function (i, item) {
            self.nodes.push(new app.Node(item));
        });

        self.add = function () {
            self.nodes.push(new app.Node({
                title: "New Node",
                nodes: []
            }));
        };
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