/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
var tsApp;
(function (tsApp) {
    var MongoService = (function () {
        function MongoService($http) {
            this.comparisonOperators = [
                new tsApp.Operator("==", "$eq", "Matches values that are equal to a specified value."),
                new tsApp.Operator(">", "$gt", "Matches values that are greater than a specified value."),
                new tsApp.Operator(">=", "$gte", "Matches values that are greater than or equal to a specified value."),
                new tsApp.Operator("<", "$lt", "Matches values that are less than a specified value."),
                new tsApp.Operator("<=", "$lte", "Matches values that are less than or equal to a specified value."),
                new tsApp.Operator("!=", "$ne", "Matches all values that are not equal to a specified value."),
                new tsApp.Operator("In", "$in", "Matches any of the values specified in an array."),
                new tsApp.Operator("Not In", "$nin", "Matches none of the values specified in an array.")
            ];
            this.logicalOperators = [
                new tsApp.Operator("Or", "$or", "Joins query clauses with a logical OR returns all documents that match the conditions of either clause."),
                new tsApp.Operator("And", "$and", "Joins query clauses with a logical AND returns all documents that match the conditions of both clauses."),
                new tsApp.Operator("Not", "$not", "Inverts the effect of a query expression and returns documents that do not match the query expression."),
                new tsApp.Operator("Nor", "$nor", "Joins query clauses with a logical NOR returns all documents that fail to match both clauses.")
            ];
            this.knownDocuments = this.getKnownDocuments();
        }
        MongoService.prototype.getKnownDocuments = function () {
            //Load with from REST service
            return [
                new tsApp.DocumentType("Document Type 1", [
                    new tsApp.Field("Field1", 0 /* string */),
                    new tsApp.Field("Field2", 0 /* string */),
                    new tsApp.Field("Field3", 1 /* int */),
                    new tsApp.Field("Field4", 1 /* int */),
                    new tsApp.Field("Field5", 3 /* bool */),
                    new tsApp.Field("Field6", 2 /* float */),
                ]),
                new tsApp.DocumentType("2Document Type 2", [
                    new tsApp.Field("2Field1", 0 /* string */),
                    new tsApp.Field("2Field2", 0 /* string */),
                    new tsApp.Field("2Field3", 1 /* int */),
                    new tsApp.Field("2Field4", 1 /* int */),
                    new tsApp.Field("2Field5", 3 /* bool */),
                    new tsApp.Field("2Field6", 2 /* float */),
                ])
            ];
        };
        MongoService.prototype.generate = function (group) {
            // if (!this.selectedDocumentType)
            //     throw "Document Type is mandatory!";
            var _this = this;
            if (!group.logicalOperator)
                throw "Logical Operator is mandatory!";
            var subQueries = [];
            $.each(group.items, function (i, item) {
                if (item instanceof tsApp.Group) {
                    subQueries.push(_this.generate(item));
                }
                else if (item instanceof tsApp.Rule) {
                    var ruleData = _this.generateRule(item);
                    if (ruleData)
                        subQueries.push(ruleData);
                }
            });
            var query = {};
            query[group.logicalOperator.operator] = subQueries;
            return query;
        };
        MongoService.prototype.generateRule = function (rule) {
            if (rule.isValid()) {
                var query = {};
                query[rule.field.name] = {};
                query[rule.field.name][rule.comparison.operator] = rule.getConvertedValue();
                return query;
            }
            return null;
        };
        MongoService.prototype.generateReadable = function (group) {
            // if (!this.selectedDocumentType)
            //     throw "Document Type is mandatory!";
            var _this = this;
            if (!group.logicalOperator)
                throw "Logical Operator is mandatory!";
            var subQueries = new Array();
            $.each(group.items, function (i, item) {
                if (item instanceof tsApp.Group) {
                    subQueries.push(_this.generateReadable(item));
                }
                else if (item instanceof tsApp.Rule) {
                    var ruleData = _this.generateReadableRule(item);
                    if (ruleData)
                        subQueries.push(ruleData);
                }
            });
            var invert = "";
            var operator = "?";
            if (group.logicalOperator.operator == "$and")
                operator = "&&";
            else if (group.logicalOperator.operator == "$or")
                operator = "||";
            else if (group.logicalOperator.operator == "$not") {
                invert = "!";
                operator = "&&";
            }
            else if (group.logicalOperator.operator == "$nor") {
                invert = "!";
                operator = "||";
            }
            else
                operator = group.logicalOperator.name;
            return invert + "(" + subQueries.join(" " + operator + " ") + ")";
        };
        MongoService.prototype.generateReadableRule = function (rule) {
            if (rule.isValid()) {
                var value = rule.getConvertedValue();
                if (rule.field.type === 0 /* string */) {
                    value = "\"" + rule.value + "\"";
                }
                return rule.field.name + " " + rule.comparison.name + " " + value;
            }
            return null;
        };
        return MongoService;
    })();
    tsApp.MongoService = MongoService;
    MongoService.$inject = ['$http'];
})(tsApp || (tsApp = {}));
var app = angular.module('testAppApp');
app.service('queryService', tsApp.MongoService);
