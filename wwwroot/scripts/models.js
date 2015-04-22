/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />
var tsApp;
(function (tsApp) {
    var Operator = (function () {
        function Operator(name, operator, description) {
            this.name = name;
            this.operator = operator;
            this.description = description;
        }
        return Operator;
    })();
    tsApp.Operator = Operator;
    var Rule = (function () {
        function Rule(parent) {
            this.field = null;
            this.comparison = null;
            this.value = "";
            this.validationMessage = "";
            this.fieldError = false;
            this.comparisonError = false;
            this.valueError = false;
            this.parent = parent;
        }
        Rule.prototype.remove = function () {
            this.parent.removeChild(this);
        };
        Rule.prototype.isValid = function () {
            this.validationMessage = "";
            this.fieldError = false;
            this.comparisonError = false;
            this.valueError = false;
            if (!this.field) {
                this.validationMessage = "Field is mandatory!";
                this.fieldError = true;
                return false;
            }
            if (!this.comparison) {
                this.validationMessage = "Comparison is mandatory!";
                this.comparisonError = true;
                return false;
            }
            if (!this.value) {
                this.validationMessage = "Value is mandatory!";
                this.valueError = true;
                return false;
            }
            var val = this.value;
            if (this.field.type === 1 /* int */) {
                var intValue = parseInt(val);
                if (!isNaN(intValue))
                    return true;
                this.validationMessage = "Integer is Required!";
                this.valueError = true;
                return false;
            }
            else if (this.field.type === 2 /* float */ && !$.isNumeric(val)) {
                //if($.isNumeric(val)) return true;
                var intValue = parseFloat(val);
                if (!isNaN(intValue))
                    return true;
                this.validationMessage = "Float is Required!";
                this.valueError = true;
                return false;
            }
            else if (this.field.type === 3 /* bool */) {
                if ("true" === this.value.toLowerCase() || "false" === this.value.toLowerCase())
                    return true;
                this.validationMessage = "Bool is Required!";
                this.valueError = true;
                return false;
            }
            else if (this.field.type === 4 /* dateTime */) {
                if (this.value instanceof Date)
                    return true;
                this.validationMessage = "Date & Time is Required!";
                this.valueError = true;
                return false;
            }
            return true;
        };
        Rule.prototype.getConvertedValue = function () {
            if (this.field.type === 1 /* int */) {
                return parseInt(this.value);
            }
            else if (this.field.type === 2 /* float */) {
                return parseFloat(this.value);
            }
            else if (this.field.type === 3 /* bool */) {
                return "true" === this.value.toLowerCase();
            }
            else if (this.field.type === 4 /* dateTime */) {
                return "ISODate(\"" + this.value.toISOString() + "\")";
            }
            else {
                return this.value;
            }
        };
        return Rule;
    })();
    tsApp.Rule = Rule;
    var Group = (function () {
        function Group(parent) {
            this.logicalOperator = null;
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
    var DocumentType = (function () {
        function DocumentType(name, fields) {
            this.name = name;
            this.fields = fields;
        }
        return DocumentType;
    })();
    tsApp.DocumentType = DocumentType;
    (function (FieldTypes) {
        FieldTypes[FieldTypes["string"] = 0] = "string";
        FieldTypes[FieldTypes["int"] = 1] = "int";
        FieldTypes[FieldTypes["float"] = 2] = "float";
        FieldTypes[FieldTypes["bool"] = 3] = "bool";
        FieldTypes[FieldTypes["dateTime"] = 4] = "dateTime";
    })(tsApp.FieldTypes || (tsApp.FieldTypes = {}));
    var FieldTypes = tsApp.FieldTypes;
    var Field = (function () {
        function Field(name, type) {
            this.name = name;
            this.type = type;
            this.displayName = name + "(" + FieldTypes[type] + ")";
        }
        return Field;
    })();
    tsApp.Field = Field;
})(tsApp || (tsApp = {}));
