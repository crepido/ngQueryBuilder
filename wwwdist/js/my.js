"use strict";angular.module("testAppApp",["ngRoute","ui.bootstrap","ui.tree","kendo.directives"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/queryBuilder.html",controller:"QueryBuilderController"}).otherwise({redirectTo:"/error"})}]);var tsApp;!function(a){var b=function(){function a(a,b,c){this.name=a,this.operator=b,this.description=c}return a}();a.Operator=b;var c=function(){function a(a){this.field=null,this.comparison=null,this.value="",this.validationMessage="",this.fieldError=!1,this.comparisonError=!1,this.valueError=!1,this.parent=a}return a.prototype.remove=function(){this.parent.removeChild(this)},a.prototype.isValid=function(){if(this.validationMessage="",this.fieldError=!1,this.comparisonError=!1,this.valueError=!1,!this.field)return this.validationMessage="Field is mandatory!",this.fieldError=!0,!1;if(!this.comparison)return this.validationMessage="Comparison is mandatory!",this.comparisonError=!0,!1;if(!this.value)return this.validationMessage="Value is mandatory!",this.valueError=!0,!1;var a=this.value;if(1===this.field.type){var b=parseInt(a);return isNaN(b)?(this.validationMessage="Integer is Required!",this.valueError=!0,!1):!0}if(2===this.field.type&&!$.isNumeric(a)){var b=parseFloat(a);return isNaN(b)?(this.validationMessage="Float is Required!",this.valueError=!0,!1):!0}return 3===this.field.type?"true"===this.value.toLowerCase()||"false"===this.value.toLowerCase()?!0:(this.validationMessage="Bool is Required!",this.valueError=!0,!1):4===this.field.type?this.value instanceof Date?!0:(this.validationMessage="Date & Time is Required!",this.valueError=!0,!1):!0},a.prototype.getConvertedValue=function(){return 1===this.field.type?parseInt(this.value):2===this.field.type?parseFloat(this.value):3===this.field.type?"true"===this.value.toLowerCase():4===this.field.type?this.value.toISOString():this.value},a}();a.Rule=c;var d=function(){function a(a){this.logicalOperator=null,this.items=[],this.parent=a}return a.prototype.addGroup=function(){var b=new a(this);b.addRule(),this.items.push(b)},a.prototype.addRule=function(){this.items.push(new c(this))},a.prototype.removeChild=function(a){var b=$.inArray(a,this.items);this.items.splice(b,1),this.parent&&0===this.items.length&&this.parent.removeChild(this)},a}();a.Group=d;var e=function(){function a(a,b){this.name=a,this.fields=b}return a}();a.DocumentType=e,function(a){a[a.string=0]="string",a[a["int"]=1]="int",a[a["float"]=2]="float",a[a.bool=3]="bool",a[a.dateTime=4]="dateTime"}(a.FieldTypes||(a.FieldTypes={}));var f=a.FieldTypes,g=function(){function a(a,b){this.name=a,this.type=b,this.displayName=a+"("+f[b]+")"}return a}();a.Field=g}(tsApp||(tsApp={}));var tsApp;!function(a){var b=function(){function b(b){this.comparisonOperators=[new a.Operator("==","$eq","Matches values that are equal to a specified value."),new a.Operator(">","$gt","Matches values that are greater than a specified value."),new a.Operator(">=","$gte","Matches values that are greater than or equal to a specified value."),new a.Operator("<","$lt","Matches values that are less than a specified value."),new a.Operator("<=","$lte","Matches values that are less than or equal to a specified value."),new a.Operator("!=","$ne","Matches all values that are not equal to a specified value."),new a.Operator("In","$in","Matches any of the values specified in an array."),new a.Operator("Not In","$nin","Matches none of the values specified in an array.")],this.logicalOperators=[new a.Operator("Or","$or","Joins query clauses with a logical OR returns all documents that match the conditions of either clause."),new a.Operator("And","$and","Joins query clauses with a logical AND returns all documents that match the conditions of both clauses."),new a.Operator("Not","$not","Inverts the effect of a query expression and returns documents that do not match the query expression."),new a.Operator("Nor","$nor","Joins query clauses with a logical NOR returns all documents that fail to match both clauses.")],this.knownDocuments=this.getKnownDocuments()}return b.prototype.getKnownDocuments=function(){return[new a.DocumentType("Glenn Test Doc",[new a.Field("Id",1),new a.Field("System",0),new a.Field("LogTime",4),new a.Field("Data.Severity",1)]),new a.DocumentType("Document Type 1",[new a.Field("Field1",0),new a.Field("Field2",0),new a.Field("Field3",1),new a.Field("Field4",1),new a.Field("Field5",3),new a.Field("Field6",2)]),new a.DocumentType("2Document Type 2",[new a.Field("2Field1",0),new a.Field("2Field2",0),new a.Field("2Field3",1),new a.Field("2Field4",1),new a.Field("2Field5",3),new a.Field("2Field6",2)])]},b.prototype.generatePlain=function(b){var c=this;if(!b.logicalOperator)throw"Logical Operator is mandatory!";var d=[],e=[];$.each(b.items,function(b,f){if(f instanceof a.Group)d.push(c.generatePlain(f));else if(f instanceof a.Rule){var g=c.generateRulePain(f);g&&e.push(g)}});var f={operator:b.logicalOperator.operator,subGroups:d,rules:e};return f},b.prototype.generateRulePain=function(a){if(a.isValid()){var b={field:a.field.name,type:a.field.type,operator:a.comparison.operator,value:a.getConvertedValue()};return b}return null},b.prototype.generate=function(b){var c=this;if(!b.logicalOperator)throw"Logical Operator is mandatory!";var d=[];$.each(b.items,function(b,e){if(e instanceof a.Group)d.push(c.generate(e));else if(e instanceof a.Rule){var f=c.generateRule(e);f&&d.push(f)}});var e={};return e[b.logicalOperator.operator]=d,e},b.prototype.generateRule=function(a){if(a.isValid()){var b={};return b[a.field.name]={},b[a.field.name][a.comparison.operator]=a.getConvertedValue(),b}return null},b.prototype.generateReadable=function(b){var c=this;if(!b.logicalOperator)throw"Logical Operator is mandatory!";var d=new Array;$.each(b.items,function(b,e){if(e instanceof a.Group)d.push(c.generateReadable(e));else if(e instanceof a.Rule){var f=c.generateReadableRule(e);f&&d.push(f)}});var e="",f="?";return"$and"==b.logicalOperator.operator?f="&&":"$or"==b.logicalOperator.operator?f="||":"$not"==b.logicalOperator.operator?(e="!",f="&&"):"$nor"==b.logicalOperator.operator?(e="!",f="||"):f=b.logicalOperator.name,e+"("+d.join(" "+f+" ")+")"},b.prototype.generateReadableRule=function(a){if(a.isValid()){var b=a.getConvertedValue();return 0===a.field.type&&(b='"'+a.value+'"'),a.field.name+" "+a.comparison.name+" "+b}return null},b}();a.MongoService=b,b.$inject=["$http"]}(tsApp||(tsApp={}));var app=angular.module("testAppApp");app.service("queryService",tsApp.MongoService),angular.module("testAppApp").controller("QueryBuilderController",["$scope","queryService",function(a,b){function c(){var c=a.selectedDocumentType.fields,d=b.comparisonOperators,e=new tsApp.Group;return e.logicalOperator=b.logicalOperators[1],e.addRule(),e.addRule(),e.items[0].field=c[0],e.items[0].comparison=d[4],e.items[0].value="5",e.items[1].field=c[1],e.items[1].comparison=d[0],e.items[1].value="System",[e]}a.str,a.obj,a.restRoot="https://logger-glenngbg-1.c9.io/",a.queryService=b,a.queryName="Some Query",a.isGroup=function(a){return a instanceof tsApp.Group},a.isRule=function(a){return a instanceof tsApp.Rule},a.selectedDocumentType=b.knownDocuments[0],a.jsonQuery="",a.jsonQueryPlain="",a.jsonData="",a.readable="",a.queryString="",a.$watch(function(){function c(a,b){return b&&"parent"===a?b.title:b}a.jsonData=JSON.stringify(a.data,c,4);try{var d=b.generate(a.data[0]);a.jsonQuery=a.queryName+"\n"+a.selectedDocumentType.name+"\n"+JSON.stringify(d,null,4);var e=b.generatePlain(a.data[0]);a.jsonQueryPlain=JSON.stringify(e,null,4),a.readable=b.generateReadable(a.data[0]),a.queryString=$.param(d)}catch(f){a.jsonQuery=f}}),a.treeOptions={accept:function(a,b,c){return b.$nodeScope?!0:!1},dropped:function(a){var b=a.source.nodeScope,c=b.$modelValue,d=b.$parentNodeScope,e=d.$modelValue;if(d&&0==e.items.length){var f=d.$parentNodeScope,g=f.$modelValue;g.removeChild(e)}var h=a.dest.nodesScope.$nodeScope.$modelValue;c.parent=h}},a.queryResult="",a.executeQuery=function(){$.getJSON("/executeQuery",b.generatePlain(a.data[0])).done(function(b){a.queryResult=JSON.stringify(b,null,4),a.$$phase||a.$apply()})},a.testQueryResult="",a.testQuery=function(){$.getJSON(a.restRoot+"logdata?callback=?",{advanceQuery:b.generatePlain(a.data[0])}).done(function(b){a.testQueryResult=JSON.stringify(b,null,4),a.$$phase||a.$apply()}).always(function(){console.log(arguments)})},a.data=c()}]).directive("ngQueryBuilder",function(){return{templateUrl:"views/ngQueryBuilder.html"}});