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

params may include:
  { name, minEmployees, maxEmployees }

  
  EXAMPLE:
    params = { name: 'bau', minEmployees: 500 }
    
    Returning: 'WHERE name ILIKE '%bau%' AND minEmployees >= 500'
  
Warning: params must be validated prior to entering this function. 
Name filter should not contain any ";" and min/maxEmployees must be integer.   
*/


function sqlForFilter(searchQuery) {
  const { name, minEmployees, maxEmployees } = searchQuery;
  // console.log("params = ", params);

  // If no filter parameters, returns an empty string (i.e. no WHERE clause)
  if (Object.keys(searchQuery).length === 0) return "";
  
  // Makes sure that min/max num of employees is a number
  // if ((minEmployees && isNaN(Number(minEmployees))) && 
  //   (maxEmployees && isNaN(Number(maxEmployees)))) {
  //   throw new BadRequestError("Min/max number of employees must be a number");
  // }  
  
  // Makes sure that min num of employees not greater than max
  if (minEmployees && maxEmployees && (minEmployees > maxEmployees)) {
    throw new BadRequestError("Min number of employees cannot be greater than max");
  }

  let filterConditions = [];

  // checks for "name" filter 
  if (name) {
    filterConditions.push(`name ILIKE '%${name}%'`);
  }

  // checks for "minEmployees" filter 
  if (minEmployees) {
    filterConditions.push(`num_employees >= ${minEmployees}`);
  }

  // checks for "maxEmployees" filter 
  if (maxEmployees) {
    filterConditions.push(`num_employees <= ${maxEmployees}`);
  }

  return "WHERE " + filterConditions.join(" AND ");
}

module.exports = {
  sqlForPartialUpdate,
  sqlForFilter,
};
