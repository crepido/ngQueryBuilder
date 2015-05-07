QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "hello test2", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("Basic Query Translation", function( assert ) {
  var testQuery = {
    "operator": "$and",
    "subGroups": [
    
    ],
    "rules": [
      {
        "field": "Id",
        "type": 1,
        "operator": "$lte",
        "value": "5"
      },
      {
        "field": "System",
        "type": 0,
        "operator": "$eq",
        "value": "System"
      }
    ]
  };
  var actual = Mongo.translate(testQuery);
  
  assert.ok(actual["$and"][0]["Id"]["$lte"] === 5, "Passed!" );
  assert.ok(actual["$and"][1]["System"]["$eq"] === "System", "Passed!" );
});

function print(data) {
  if($.isPlainObject(data)) {
    console.log(JSON.stringify(data, null, 4));
  }
  else {
    console.log(data);
  }
}