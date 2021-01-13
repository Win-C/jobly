const { BadRequestError } = require("../expressError");

/* Helper function for mapping data into SQL format for SET clause 
in SQL UPDATE queries. Used in User and Company models.

dataToUpate may include:
  { firstName, lastName, password, email, isAdmin }

  
  EXAMPLE:
    dataToUpdate = {firstName: 'Aliya', age: 32}
    
    jsToSql = {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin",
            }
    
    Returning:
      {
        setCols: '"first_name"=$1', '"age"=$2',
        values: ['Aliya', 32],
      }
  */

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

/* Helper function for mapping data into SQL format for WHERE clause 
in SQL SELECT queries. Used in Company models.
Returns WHERE clause.

dataToFilter may include:
  { name, minEmployees, maxEmployees }

  
  EXAMPLE:
    dataToFilter = { name: 'bau', minEmployees: 500}
    
    jsToSql = {
                name: "name",
                minEmployees: "employees",**
                maxEmployees: "employees",**
            }

    Returning: 'WHERE '
  */

 function sqlForFilter(dataToFilter, jsToSql) {
  const keys = Object.keys(dataToFilter);

  

  // {name: 'bau', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToFilter),
  };
}

module.exports = { 
  sqlForPartialUpdate,
  sqlForFilter,
 };
