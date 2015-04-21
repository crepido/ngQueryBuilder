/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/linq/linq.d.ts" />

module tsApp {
    export class Operator {
        public name: string;
        public operator: string;
        public description: string;
        
        constructor(name: string, operator: string, description: string) {
            this.name = name;
            this.operator = operator;
            this.description = description;
        }
    }
    
    
    export interface TreeNode {

    }

    export class Rule implements TreeNode {
        public parent: Group;
        public field: Field = null;
        public comparison: Operator = null;
        public value: string = "";
        
        public validationMessage: string = "";
        public fieldError: boolean = false;
        public comparisonError: boolean = false;
        public valueError: boolean = false;

        constructor(parent: Group) {
            this.parent = parent;
        }

        remove() {
            this.parent.removeChild(this);
        }
        
        isValid() : boolean {
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
            if (this.field.type === FieldTypes.int) {
                var intValue = parseInt(val);
                if(!isNaN(intValue)) return true;
                
                this.validationMessage = "Integer is Required!"
                this.valueError = true;
                return false;
            }
            else if (this.field.type === FieldTypes.float && !$.isNumeric(val)) {
                //if($.isNumeric(val)) return true;
                var intValue = parseFloat(val);
                if(!isNaN(intValue)) return true;
                
                this.validationMessage = "Float is Required!"
                this.valueError = true;
                return false;
            }
            else if (this.field.type === FieldTypes.bool) {
                if("true" === this.value.toLowerCase() || "false" === this.value.toLowerCase())
                    return true;
                    
                this.validationMessage = "Bool is Required!"
                this.valueError = true;
                return false;
            }
            
            return true;
        }
        
        getConvertedValue() : any {
            if (this.field.type === FieldTypes.int) {
                return parseInt(this.value);
            }
            else if (this.field.type === FieldTypes.float) {
                return parseFloat(this.value);
            }
            else if (this.field.type === FieldTypes.bool) {
                return "true" === this.value.toLowerCase();
            }
            else {
                return this.value;
            }
        }
        
    }

    export class Group implements TreeNode {
        public parent: Group;
        public logicalOperator: Operator = null;
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
    
    export class DocumentType {
        name: string;
        fields: Array<Field>;

        constructor(name: string, fields?: Array<Field>) {
            this.name = name;
            this.fields = fields;
        }
    }

    export enum FieldTypes {
        string,
        int,
        float,
        bool
    }

    export class Field {
        name: string;
        type: FieldTypes;
        displayName: string;

        constructor(name: string, type: FieldTypes) {
            this.name = name;
            this.type = type;
            this.displayName = name + "(" + FieldTypes[type] + ")";
        }
    }
}