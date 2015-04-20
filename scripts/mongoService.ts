/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />

module tsApp {
    export interface IQueryService  {
        knownDocuments: Array<DocumentType>;
        comparisonOperators: Array<Operator>;
        logicalOperators: Array<Operator>;
        
        generate(queryRoot: Group): any;
        generateReadable(group: Group) : string;
    }
    
    export class MongoService implements IQueryService {
        public knownDocuments: Array<DocumentType>;
        
        public comparisonOperators: Array<Operator> = [
            new Operator("==", "$eq", "Matches values that are equal to a specified value."),
            new Operator(">", "$gt", "Matches values that are greater than a specified value."),
            new Operator(">=", "$gte", "Matches values that are greater than or equal to a specified value."),
            new Operator("<", "$lt", "Matches values that are less than a specified value."),
            new Operator("<=", "$lte", "Matches values that are less than or equal to a specified value."),
            new Operator("!=", "$ne", "Matches all values that are not equal to a specified value."),
            new Operator("In", "$in", "Matches any of the values specified in an array."),
            new Operator("Not In", "$nin", "Matches none of the values specified in an array.")
        ];

        public logicalOperators: Array<Operator> = [
            new Operator("Or", "$or", "Joins query clauses with a logical OR returns all documents that match the conditions of either clause."),
            new Operator("And", "$and", "Joins query clauses with a logical AND returns all documents that match the conditions of both clauses."),
            new Operator("Not", "$not", "Inverts the effect of a query expression and returns documents that do not match the query expression."),
            new Operator("Nor", "$nor", "Joins query clauses with a logical NOR returns all documents that fail to match both clauses.")
        ];
        
        constructor($http: ng.IHttpService) {
            this.knownDocuments = this.getKnownDocuments();
        }
        
        getKnownDocuments() : Array<DocumentType> {
            //Load with from REST service
            return [
                new DocumentType("Document Type 1", [
                    new Field("Field1", FieldTypes.string),
                    new Field("Field2", FieldTypes.string),
                    new Field("Field3", FieldTypes.int),
                    new Field("Field4", FieldTypes.int),
                    new Field("Field5", FieldTypes.bool),
                    new Field("Field6", FieldTypes.string),
                ]),
                new DocumentType("2Document Type 2", [
                    new Field("2Field1", FieldTypes.string),
                    new Field("2Field2", FieldTypes.string),
                    new Field("2Field3", FieldTypes.int),
                    new Field("2Field4", FieldTypes.int),
                    new Field("2Field5", FieldTypes.bool),
                    new Field("2Field6", FieldTypes.string),
                ])
            ];
        }
        
        
        generate(group: Group) {
            // if (!this.selectedDocumentType)
            //     throw "Document Type is mandatory!";

            if (!group.logicalOperator)
                throw "Logical Operator is mandatory!";
            
            var subQueries = [];
            $.each(group.items,(i, item) => {
                if (item instanceof Group) {
                    subQueries.push(this.generate(item));
                }
                else if (item instanceof Rule) {
                    subQueries.push(this.generateRule(item));
                }
            });

            var query = {};
            query[group.logicalOperator.operator] = subQueries;
            return query;
        }

        generateRule(rule: Rule) {
            if (!rule.field) {
                throw "Field is mandatory!";
            }

            //var selectedField = super.getField(rule.field);

            if (!rule.comparison)
                throw "Comparison is mandatory!";

            if (!rule.value)
                throw "Value is mandatory!";


            var value: any = rule.value;
            if (rule.field.type === FieldTypes.int) {
                value = parseInt(rule.value);
            }
            else if (rule.field.type === FieldTypes.bool) {
                value = "true" === rule.value.toLowerCase();
            }

            var query = {};
            query[rule.field.name] = {};
            query[rule.field.name][rule.comparison.operator] = value;
            return query;
        }
        
        generateReadable(group: Group) : string {
            // if (!this.selectedDocumentType)
            //     throw "Document Type is mandatory!";

            if (!group.logicalOperator)
                throw "Logical Operator is mandatory!";
            
            var subQueries = new Array<string>();
            $.each(group.items,(i, item) => {
                if (item instanceof Group) {
                    subQueries.push(this.generateReadable(item));
                }
                else if (item instanceof Rule) {
                    subQueries.push(this.generateReadableRule(item));
                }
            });
            
            var operator = "?";
            $.each(this.logicalOperators, (i, item) => {
                if(item.operator === group.logicalOperator.operator) {
                    if(item.name == "And") 
                        operator = "&&";
                    else if(item.name == "Or") 
                        operator = "||";
                    else
                        operator = item.name;
                    
                    return false;
                } 
                return true;
            });

            return "(" + subQueries.join(" " + operator + " ") + ")";
        }
        
        generateReadableRule(rule: Rule) : string {
            if (!rule.field) {
                throw "Field is mandatory!";
            }

            if (!rule.comparison)
                throw "Comparison is mandatory!";

            if (!rule.value)
                throw "Value is mandatory!";


            var value: any = rule.value;
            if (rule.field.type === FieldTypes.int) {
                value = parseInt(rule.value);
            }
            else if (rule.field.type === FieldTypes.bool) {
                value = "true" === rule.value.toLowerCase();
            }

            var operator = "?";
            $.each(this.comparisonOperators, (i, item) => {
                if(item.operator === rule.comparison.operator) {
                    operator = item.name;
                    return false;
                } 
                return true;
            });
            
            return rule.field.name + " " + operator + " " + value;
        }
        
    }
    MongoService.$inject = ['$http'];
}

var app: ng.IModule = angular.module('testAppApp');
app.service('queryService', tsApp.MongoService);