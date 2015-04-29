var module = module || {};

module Mongo {
    enum FieldTypes {
        string,
        int,
        float,
        bool,
        dateTime
    }
    
    class Translator {
        
        translateGroup(group: any) : any {
            var subQueries = [];
            
            if(group.subGroups) {
                for(var i in group.subGroups) {
                    
                    var subQuery = this.translateGroup(group.subGroups[i]);
                    
                    if(subQuery)
                        subQueries.push(subQuery);
                }
            }
            
            if(group.rules) {
                for(var i in group.rules) {
                    
                    var rule = this.translateRule(group.rules[i]);
                    
                    if(rule)
                        subQueries.push(rule);
                }
            }
            
            var query = {};
            query[group.operator] = subQueries;
            return query;
        }
        
        translateRule(rule: any) : any {
            var query = {};
            query[rule.field] = {};
            query[rule.field][rule.operator] = this.convertValue(rule);
            return query;
        }
        
        convertValue(rule: any) : any {
            var type = parseInt(rule.type);
            switch(type) {
                case FieldTypes.string:
                    return rule.value;
                case FieldTypes.int:
                    return parseInt(rule.value);
                case FieldTypes.float:
                    return parseFloat(rule.value);
                case FieldTypes.bool:
                    return "true" === rule.value.toLowerCase();
                case FieldTypes.dateTime:
                    return new Date(rule.value);
            }
        }
    }
    
    export function translate (query: any) {
        var translator = new Translator();
        return translator.translateGroup(query);
    }
    
    
}

module.exports = Mongo;