"use strict";

/**
 * @author EmmanuelOlaojo
 * @since 6/22/16
 */

var chai = require("chai");
var expect = chai.expect;
var Promise = require("bluebird");
chai.use(require("chai-as-promised"));

var config = require("../test_conf");
var Lint = require("../lib/lint");
var DB = "test";
var TASKS = "LINT";
var TEST_COLLECTION_A = "humans";
var TEST_COLLECTION_B = "animals";
var testMdlA;
var testMdlB;
var taskMdl;
var task;
var Task;

describe("Task", function(){
  before(function(){
    var lint = new Lint(config.db + DB, TASKS);
    Task = lint.Task;
    task = new Task();
    testMdlA = task.getCollection(TEST_COLLECTION_A);
    testMdlB = task.getCollection(TEST_COLLECTION_B);
    taskMdl = task.getTaskCollection();
  });

  after(function(){
    return Promise.all([
      task.dropCollection(TEST_COLLECTION_A)
      , task.dropCollection(TEST_COLLECTION_B)
    ]);
  });

  describe("#run", function(){
    // Might come up with tests later
  });

  describe("#save", function(){
    it("should save successfully", function(){
      task.save(TEST_COLLECTION_B, {name: "T-REX", age: 50000000});
      task.save(TEST_COLLECTION_A, {name: "Emmanuel Olaojo", age: 20});
      task.save(TEST_COLLECTION_A, {name: "John Damos", age: 26});
      task.save(TEST_COLLECTION_B, {name: "Brian Griffin", age: 18});

      return task.run();
    });

    it("should have Emmanuel Olaojo in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "Emmanuel Olaojo", age: 20})).to.eventually.have.length(1);
    });

    it("should have John Damos in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "John Damos", age: 26})).to.eventually.have.length(1);
    });

    it("should have T-REX in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "T-REX", age: 50000000})).to.eventually.have.length(1);
    });

    it("should have Brian Griffin in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "Brian Griffin", age: 18})).to.eventually.have.length(1);
    });
    
    it(TEST_COLLECTION_A + " should have length 2", function(){
      return expect(testMdlA.find()).to.eventually.have.length(2);
    });

    it(TEST_COLLECTION_B + " should have length 2", function(){
      return expect(testMdlB.find()).to.eventually.have.length(2);
    });
  });

  describe("#update", function(){
    it("should update successfully", function(){
      task.update(TEST_COLLECTION_A, {name: "John Damos"}, {name: "John Snow"});
      task.update(TEST_COLLECTION_B, {name: "Brian Griffin"}, {name: "Yo momma"});

      return task.run();
    });

    it("should have Emmanuel Olaojo in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "Emmanuel Olaojo"})).to.eventually.have.length(1);
    });

    it("should have John Snow in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "John Snow"})).to.eventually.have.length(1);
    });

    it("should have Yo momma in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "Yo momma"})).to.eventually.have.length(1);
    });

    it("should have T-REX in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "T-REX"})).to.eventually.have.length(1);
    });

    it(TEST_COLLECTION_A + " should have length 2", function(){
      return expect(testMdlA.find()).to.eventually.have.length(2);
    });

    it(TEST_COLLECTION_B + " should have length 2", function(){
      return expect(testMdlB.find()).to.eventually.have.length(2);
    });
  });

  describe("#remove", function(){
    it("should remove successfully", function(){
      task.remove(TEST_COLLECTION_A, {name: "John Snow"});
      task.remove(TEST_COLLECTION_B, {name: "Yo momma"});

      return task.run();
    });

    it("should not have John Snow in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "John Snow"})).to.eventually.have.length(0);
    });

    it("should have Emmanuel Olaojo in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "Emmanuel Olaojo"})).to.eventually.have.length(1);
    });

    it("should not have Yo momma in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "Yo momma"})).to.eventually.have.length(0);
    });

    it("should have T-REX in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "T-REX"})).to.eventually.have.length(1);
    });

    it(TEST_COLLECTION_A + " should have length 1", function(){
      return expect(testMdlA.find()).to.eventually.have.length(1);
    });

    it(TEST_COLLECTION_B + " should have length 1", function(){
      return expect(testMdlB.find()).to.eventually.have.length(1);
    });
  });

  describe("allTogetherNow", function(){
    it("should save, update and remove successfully", function(){
      task.save(TEST_COLLECTION_A, {name: "John Snow", age: 26});
      task.update(TEST_COLLECTION_B, {name: "T-REX"}, {name: "Pegasus"});
      task.update(TEST_COLLECTION_A, {name: "Emmanuel Olaojo"}, {name: "OJ"});
      task.save(TEST_COLLECTION_A, {name: "unimportant", age: 50});
      task.remove(TEST_COLLECTION_A, {name: "unimportant"});
      task.save(TEST_COLLECTION_B, {name: "Brian Griffin", age: 18});
      task.save(TEST_COLLECTION_B, {name: "Yo momma", age: 18});
      task.remove(TEST_COLLECTION_B, {name: "Yo momma"});

      return task.run();
    });

    it("should have John Snow in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "John Snow"})).to.eventually.have.length(1);
    });

    it("should have OJ in " + TEST_COLLECTION_A, function(){
      return expect(testMdlA.find({name: "OJ"})).to.eventually.have.length(1);
    });

    it("should have Pegasus in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "Pegasus"})).to.eventually.have.length(1);
    });

    it("should have Brian Griffin in " + TEST_COLLECTION_B, function(){
      return expect(testMdlB.find({name: "Brian Griffin"})).to.eventually.have.length(1);
    });

    it(TEST_COLLECTION_A + " should have length 2", function(){
      return expect(testMdlA.find()).to.eventually.have.length(2);
    });

    it(TEST_COLLECTION_B + " should have length 2", function(){
      return expect(testMdlB.find()).to.eventually.have.length(2);
    });
  });
});

