const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("returns setCols and values in correct format for 1 item", function () {
    const dataToUpdate = { firstName: 'Aliya'};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: "\"first_name\"=$1",
      values: ['Aliya'],
    });
  });

  test("returns setCols and values in correct format for 2 items", function () {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: "\"first_name\"=$1, \"age\"=$2",
      values: ['Aliya', 32],
    });
  });

  test("returns a BadRequestError if no data", function () {
    const dataToUpdate = {};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    
    // Thunk - delay evaluation of a function
    expect(() => (sqlForPartialUpdate(dataToUpdate, jsToSql))).toThrow(BadRequestError);
  });
});