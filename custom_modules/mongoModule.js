var module = module || {};
var Mongo;
(function (Mongo) {
    var FieldTypes;
    (function (FieldTypes) {
        FieldTypes[FieldTypes["string"] = 0] = "string";
        FieldTypes[FieldTypes["int"] = 1] = "int";
        FieldTypes[FieldTypes["float"] = 2] = "float";
        FieldTypes[FieldTypes["bool"] = 3] = "bool";
        FieldTypes[FieldTypes["dateTime"] = 4] = "dateTime";
    })(FieldTypes || (FieldTypes = {}));
    var Translator = (function () {
        function Translator() {
        }
        Translator.prototype.translateGroup = function (group) {
            var subQueries = [];
            if (group.subGroups) {
                for (var i in group.subGroups) {
                    var subQuery = this.translateGroup(group.subGroups[i]);
                    if (subQuery)
                        subQueries.push(subQuery);
                }
            }
            if (group.rules) {
                for (var i in group.rules) {
                    var rule = this.translateRule(group.rules[i]);
                    if (rule)
                        subQueries.push(rule);
                }
            }
            var query = {};
            query[group.operator] = subQueries;
            return query;
        };
        Translator.prototype.translateRule = function (rule) {
            var query = {};
            query[rule.field] = {};
            query[rule.field][rule.operator] = this.convertValue(rule);
            return query;
        };
        Translator.prototype.convertValue = function (rule) {
            var type = parseInt(rule.type);
            switch (type) {
                case 0 /* string */:
                    return rule.value;
                case 1 /* int */:
                    return parseInt(rule.value);
                case 2 /* float */:
                    return parseFloat(rule.value);
                case 3 /* bool */:
                    return "true" === rule.value.toLowerCase();
                case 4 /* dateTime */:
                    return new Date(rule.value);
            }
        };
        return Translator;
    })();
    function translate(query) {
        var translator = new Translator();
        return translator.translateGroup(query);
    }
    Mongo.translate = translate;
})(Mongo || (Mongo = {}));
module.exports = Mongo;
