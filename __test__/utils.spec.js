import { objToStr } from "../utils.js";


describe("objToStr", function() {

  it("should return boolean type when passing a boolean", function() {
    var boolType = objToStr(true);
    expect("[object Boolean]").toBe(boolType);

    boolType = objToStr(false);
    expect("[object Boolean]").toBe(boolType);

    boolType = objToStr(new Boolean());
    expect("[object Boolean]").toBe(boolType);
  });

  it("should return number type when passing a number", function() {
    var numType = objToStr(2);
    expect("[object Number]").toBe(numType);

    numType = objToStr(NaN);
    expect("[object Number]").toBe(numType);

    numType = objToStr(Infinity);
    expect("[object Number]").toBe(numType);

    numType = objToStr(new Number(3));
    expect("[object Number]").toBe(numType);

    numType = objToStr(4.1);
    expect("[object Number]").toBe(numType);

    var numType = objToStr(new Object(12));
    expect("[object Number]").toBe(numType);
  });

  it("should return string type when passing a string", function() {
    var strType = objToStr("obito");
    expect("[object String]").toBe(strType);

    strType = objToStr(new String());
    expect("[object String]").toBe(strType);
  });

  it("should return function type when passing a function", function() {
    var funType = objToStr(() => {});
    expect("[object Function]").toBe(funType);

    var funType = objToStr(function() {});
    expect("[object Function]").toBe(funType);

    var funType = objToStr(function uta() {});
    expect("[object Function]").toBe(funType);

    var funType = objToStr(new Function());
    expect("[object Function]").toBe(funType);
  });

  it("should return object type when passsing an object", function() {
    var objType = objToStr({});
    expect("[object Object]").toBe(objType);

    objType = objToStr(new Object(null));
    expect("[object Object]").toBe(objType);

    objType = objToStr(Object.create(null));
    expect("[object Object]").toBe(objType);
  });

  it("should return null type when passing a null", function() {
    var nullType = objToStr(null);
    expect("[object Null]").toBe(nullType);
  });

  it("should return undefined type when passing an undefined", function() {
    var nullType = objToStr(undefined);
    expect("[object Undefined]").toBe(nullType);
  });
});

