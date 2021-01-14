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

searchQuery may include:
  { name, minEmployees, maxEmployees }
  
  EXAMPLE:
    searchQuery = { name: 'bau', minEmployees: 500 }
    
    Returning: 'WHERE name ILIKE '%bau%' AND minEmployees >= 500'

*/

// TODO: Move into class method for Company model to preserve encapsulation
function sqlForFilter(searchQuery) {
  const { name, minEmployees, maxEmployees } = searchQuery;

  const keys = Object.keys(searchQuery);

  // If no filter parameters, returns an empty string (i.e. no WHERE clause)
  // if (Object.keys(searchQuery).length === 0) return "";

  // Makes sure that min num of employees not greater than max
  if (minEmployees && maxEmployees && (minEmployees > maxEmployees)) {
    throw new BadRequestError("Min number of employees cannot be greater than max");
  }

  let query = `SELECT handle,
                    name,
                    description,
                    num_employees AS "numEmployees",
                    logo_url AS "logoUrl"
                  FROM companies` 

  let whereClauses = [];
  let whereValues = [];
  let idx = 1;

  // checks for "name" filter 
  if (name !== undefined) {
    whereClauses.push(`name ILIKE $${idx}`);
    whereValues.push(`%${name}%`);
    idx++;
  }

  // checks for "minEmployees" filter 
  if (minEmployees !== undefined) {
    whereClauses.push(`num_employees >= $${idx}`);
    whereValues.push(searchQuery.minEmployees);
    idx++;
  }

  // checks for "maxEmployees" filter 
  if (maxEmployees !== undefined) {
    whereClauses.push(`num_employees <= $${idx}`);
    whereValues.push(searchQuery.maxEmployees);
    idx++;
  }

  if (whereClauses.length === 0) {
    query = query + " ORDER BY name";
  } else {
    query = query + " WHERE " + whereClauses.join(" AND ") + " ORDER BY name";
  }

  return { query, whereValues };
}

module.exports = {
  sqlForPartialUpdate,
  sqlForFilter,
};
