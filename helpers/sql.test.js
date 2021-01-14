const { sqlForPartialUpdate, sqlForFilter } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("returns setCols and values in correct format", function () {
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

describe("sqlForFilter", function () {
  test("returns WHERE clause for SQL query", function () {
    const searchQuery = { 
      name: 'c', 
      minEmployees: 2
    };

    expect(sqlForFilter(searchQuery))
      .toEqual("WHERE name ILIKE '%c%' AND num_employees >= 2");
  });

  test("returns empty '' for SQL query", function () {
    const searchQuery = {};

    expect(sqlForFilter(searchQuery)).toEqual('');
  });

  test("returns WHERE clause with valid min and max employees", function () {
    const searchQuery = { 
      minEmployees: 1,
      maxEmployees: 2
    };

    expect(sqlForFilter(searchQuery))
      .toEqual('WHERE num_employees >= 1 AND num_employees <= 2');
  });

  test("throws error with invalid min and max employees", function () {
    const searchQuery = { 
      minEmployees: 3,
      maxEmployees: 1
    };

    expect(() => sqlForFilter(searchQuery)).toThrow(BadRequestError);
  });
});