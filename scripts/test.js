/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tsApp;
(function (tsApp) {
    var Rule = (function () {
        function Rule(parent) {
            this.field = null;
            this.comparison = "$eq";
            this.value = "";
            this.validationMessage = "";
            this.parent = parent;
        }
        Rule.prototype.remove = function () {
            this.parent.removeChild(this);
        };
        return Rule;
    })();
    tsApp.Rule = Rule;
    var Group = (function () {
        function Group(parent) {
            this.logicalOperator = "$and";
            this.items = [];
            this.parent = parent;
        }
        Group.prototype.addGroup = function () {
            var group = new Group(this);
            group.addRule();
            this.items.push(group);
        };
        Group.prototype.addRule = function () {
            this.items.push(new Rule(this));
        };
        Group.prototype.removeChild = function (item) {
            var index = $.inArray(item, this.items);
            this.items.splice(index, 1);
            if (this.parent && this.items.length === 0) {
                this.parent.removeChild(this);
            }
        };
        return Group;
    })();
    tsApp.Group = Group;
    var QueryRoot = (function (_super) {
        __extends(QueryRoot, _super);
        function QueryRoot() {
            _super.call(this, null);
            this.queryName = "asdg";
            this.queryName = "asdf23456";
        }
        return QueryRoot;
    })(Group);
    tsApp.QueryRoot = QueryRoot;
    var Generator = (function () {
        function Generator() {
            this.knownDocuments = [
                new DocumentType("Document Type 1", [
                    new Field("Field1", 0 /* string */),
                    new Field("Field2", 0 /* string */),
                    new Field("Field3", 1 /* int */),
                    new Field("Field4", 1 /* int */),
                    new Field("Field5", 2 /* bool */),
                    new Field("Field6", 0 /* string */),
                ]),
                new DocumentType("2Document Type 2", [
                    new Field("2Field1", 0 /* string */),
                    new Field("2Field2", 0 /* string */),
                    new Field("2Field3", 1 /* int */),
                    new Field("2Field4", 1 /* int */),
                    new Field("2Field5", 2 /* bool */),
                    new Field("2Field6", 0 /* string */),
                ])
            ];
            this.selectedDocumentType = this.knownDocuments[0];
        }
        Generator.prototype.generate = function (queryRoot) {
            throw "Not Implemented!";
        };
        Generator.prototype.getField = function (name) {
            /*
            return Enumerable.From<Field>(this.selectedDocumentType.fields)
                .Where(x => x.name == name)
                .FirstOrDefault(null);
            */
        };
        return Generator;
    })();
    var MongoGenerator = (function (_super) {
        __extends(MongoGenerator, _super);
        function MongoGenerator() {
            _super.apply(this, arguments);
            this.self = this;
            this.comparisonOperators = [
                { name: "==", operator: "$eq", desc: "Matches values that are equal to a specified value." },
                { name: ">", operator: "$gt", desc: "Matches values that are greater than a specified value." },
                { name: ">=", operator: "$gte", desc: "Matches values that are greater than or equal to a specified value." },
                { name: "<", operator: "$lt", desc: "Matches values that are less than a specified value." },
                { name: "<=", operator: "$lte", desc: "Matches values that are less than or equal to a specified value." },
                { name: "!=", operator: "$ne", desc: "Matches all values that are not equal to a specified value." },
                { name: "In", operator: "$in", desc: "Matches any of the values specified in an array." },
                { name: "Not In", operator: "$nin", desc: "Matches none of the values specified in an array." }
            ];
            this.logicalOperators = [
                { name: "Or", operator: "$or", desc: "Joins query clauses with a logical OR returns all documents that match the conditions of either clause." },
                { name: "And", operator: "$and", desc: "Joins query clauses with a logical AND returns all documents that match the conditions of both clauses." },
                { name: "Not", operator: "$not", desc: "Inverts the effect of a query expression and returns documents that do not match the query expression." },
                { name: "Nor", operator: "$nor", desc: "Joins query clauses with a logical NOR returns all documents that fail to match both clauses." }
            ];
        }
        MongoGenerator.prototype.generate = function (group) {
            var _this = this;
            if (!this.selectedDocumentType)
                throw "Document Type is mandatory!";
            if (!group.logicalOperator)
                throw "Logical Operator is mandatory!";
            var subQueries = [];
            $.each(group.items, function (i, item) {
                if (item instanceof Group) {
                    subQueries.push(_this.generate(item));
                }
                else if (item instanceof Rule) {
                    subQueries.push(_this.generateRule(item));
                }
            });
            var query = {};
            query[group.logicalOperator] = subQueries;
            return query;
        };
        MongoGenerator.prototype.generateRule = function (rule) {
            if (!rule.field) {
                throw "Field is mandatory!";
            }
            //var selectedField = super.getField(rule.field);
            if (!rule.comparison)
                throw "Comparison is mandatory!";
            if (!rule.value)
                throw "Value is mandatory!";
            var value = rule.value;
            if (rule.field.type === 1 /* int */) {
                value = parseInt(rule.value);
            }
            else if (rule.field.type === 2 /* bool */) {
                value = "true" === rule.value.toLowerCase();
            }
            var query = {};
            query[rule.field.name] = {};
            query[rule.field.name][rule.comparison] = value;
            return query;
        };
        return MongoGenerator;
    })(Generator);
    tsApp.MongoGenerator = MongoGenerator;
    var DocumentType = (function () {
        function DocumentType(name, fields) {
            this.name = name;
            this.fields = fields;
        }
        return DocumentType;
    })();
    var FieldTypes;
    (function (FieldTypes) {
        FieldTypes[FieldTypes["string"] = 0] = "string";
        FieldTypes[FieldTypes["int"] = 1] = "int";
        FieldTypes[FieldTypes["bool"] = 2] = "bool";
    })(FieldTypes || (FieldTypes = {}));
    var Field = (function () {
        function Field(name, type) {
            this.name = name;
            this.type = type;
        }
        return Field;
    })();
})(tsApp || (tsApp = {}));
