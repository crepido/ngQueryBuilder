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

        constructor(parent: Group) {
            this.parent = parent;
        }

        remove() {
            this.parent.removeChild(this);
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