/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />

module tsApp {
    interface TreeNode {

    }

    export class Rule implements TreeNode {
        public parent: Group;
        public field: Field = null;
        public comparison: string = "$eq";
        public value: string = "";
        public validationMessage: string = "";

        constructor(parent: Group) {
            this.parent = parent;
        }

        remove() {
            this.parent.removeChild(this);
        }
    }

    export class Group implements TreeNode {
        public parent: Group;
        public logicalOperator: string = "$and";
        public items: Array<TreeNode> = [];

        constructor(parent: Group) {
            this.parent = parent;
        }

        addGroup() {
            var group = new Group(this);
            group.addRule();
            this.items.push(group)
        }

        addRule() {
            this.items.push(new Rule(this));
        }

        removeChild(item: TreeNode) {
            var index = $.inArray<TreeNode>(item, this.items);
            this.items.splice(index, 1);

            if (this.parent && this.items.length === 0) {
                this.parent.removeChild(this);
            }
        }
    }

    export class QueryRoot extends Group {
        public queryName: string = "asdg";
        constructor() {
            super(null);
            this.queryName = "asdf23456";
        }
    }

    class Generator {
        generate(queryRoot: Group): any { throw "Not Implemented!" }

        public knownDocuments: Array<DocumentType> = [
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
        
        selectedDocumentType: DocumentType = this.knownDocuments[0];   

        constructor() {
        }    

        getField(name: string): void {
            /*
            return Enumerable.From<Field>(this.selectedDocumentType.fields)
                .Where(x => x.name == name)
                .FirstOrDefault(null);       
            */         
        }
    }

    export class MongoGenerator extends Generator {
        self: MongoGenerator = this;

        public comparisonOperators: Array<any> = [
            { name: "==", operator: "$eq", desc: "Matches values that are equal to a specified value." },
            { name: ">", operator: "$gt", desc: "Matches values that are greater than a specified value." },
            { name: ">=", operator: "$gte", desc: "Matches values that are greater than or equal to a specified value." },
            { name: "<", operator: "$lt", desc: "Matches values that are less than a specified value." },
            { name: "<=", operator: "$lte", desc: "Matches values that are less than or equal to a specified value." },
            { name: "!=", operator: "$ne", desc: "Matches all values that are not equal to a specified value." },
            { name: "In", operator: "$in", desc: "Matches any of the values specified in an array." },
            { name: "Not In", operator: "$nin", desc: "Matches none of the values specified in an array." }
        ];

        public logicalOperators: Array<any> = [
            { name: "Or", operator: "$or", desc: "Joins query clauses with a logical OR returns all documents that match the conditions of either clause." },
            { name: "And", operator: "$and", desc: "Joins query clauses with a logical AND returns all documents that match the conditions of both clauses." },
            { name: "Not", operator: "$not", desc: "Inverts the effect of a query expression and returns documents that do not match the query expression." },
            { name: "Nor", operator: "$nor", desc: "Joins query clauses with a logical NOR returns all documents that fail to match both clauses." }
        ];

        generate(group: Group) {
            if (!this.selectedDocumentType)
                throw "Document Type is mandatory!";

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
            query[group.logicalOperator] = subQueries;
            return query;
        }

        generateRule(rule: Rule) {
            if (!rule.field) {
                throw "Field wwis mandatory!";
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
            query[rule.field.name][rule.comparison] = value;
            return query;
        }
    }

    class DocumentType {
        name: string;
        fields: Array<Field>;

        constructor(name: string, fields?: Array<Field>) {
            this.name = name;
            this.fields = fields;
        }
    }

    enum FieldTypes {
        string,
        int,
        bool
    }

    class Field {
        name: string;
        type: FieldTypes;

        constructor(name: string, type: FieldTypes) {
            this.name = name;
            this.type = type;
        }
    }

    
}