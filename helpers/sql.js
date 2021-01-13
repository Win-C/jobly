const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// Inputs received:
// Data may include:
//   { firstName:, lastName, password, email, isAdmin }
// jsToSql = {firstName: "first_name",
//            lastName: "last_name",
//            isAdmin: "is_admin",
//            }
// Data sent:
// {firstName: 'Aliya', age: 32}
//
// Returning:
// {
//  setCols: ['"first_name"=$1', '"age"=$2'],
//  values: ['Aliya', 32],
// }

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
