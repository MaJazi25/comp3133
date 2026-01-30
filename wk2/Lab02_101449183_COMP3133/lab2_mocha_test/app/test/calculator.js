const expect = require("chai").expect;
const calc = require("../calculator");

describe("Calculator Tests", function () {
  describe("Addition", function () {
    it("PASS: add(5,2) should be 7", function () {
      console.log("PASS test: add(5,2) expected 7");
      expect(calc.add(5, 2)).to.equal(7);
    });

    it("FAIL: add(5,2) should be 8", function () {
      console.log("FAIL test: add(5,2) expected 8");
      expect(calc.add(5, 2)).to.equal(8);
    });
  });

  describe("Subtraction", function () {
    it("PASS: sub(5,2) should be 3", function () {
      console.log("PASS test: sub(5,2) expected 3");
      expect(calc.sub(5, 2)).to.equal(3);
    });

    it("FAIL: sub(5,2) should be 5", function () {
      console.log("FAIL test: sub(5,2) expected 5");
      expect(calc.sub(5, 2)).to.equal(5);
    });
  });

  describe("Multiplication", function () {
    it("PASS: mul(5,2) should be 10", function () {
      console.log("PASS test: mul(5,2) expected 10");
      expect(calc.mul(5, 2)).to.equal(10);
    });

    it("FAIL: mul(5,2) should be 12", function () {
      console.log("FAIL test: mul(5,2) expected 12");
      expect(calc.mul(5, 2)).to.equal(12);
    });
  });

  describe("Division", function () {
    it("PASS: div(10,2) should be 5", function () {
      console.log("PASS test: div(10,2) expected 5");
      expect(calc.div(10, 2)).to.equal(5);
    });

    it("FAIL: div(10,2) should be 2", function () {
      console.log("FAIL test: div(10,2) expected 2");
      expect(calc.div(10, 2)).to.equal(2);
    });
  });
});
