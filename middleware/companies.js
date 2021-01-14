"use strict";

// /** Convenience middleware to handle common validation cases in routes. */

// const { BadRequestError } = require("../expressError");
// const { VALID_SEARCH_QUERY } = require("../config");


// /** Companies: Ensures valid search parameters where
//  *    name = string with no ";"
//  *    minEmployees (if exists) is an integer
//  *    maxEmployees (if exists) is an integer
//  */

// function validateSearchQuery(req, res, next) {
//   const { name, minEmployees, maxEmployees } = req.query;
//   console.log("req.query = ", req.query);

//   // for (let key in req.query){
//   //   if (VALID_SEARCH_QUERY.includes(key) !== true){
//   //     throw new BadRequestError('Invalid request');
//   //   }
//   // }

//   // if(name && ((typeof name !== "string" ) || name.includes(';'))) {
//   //   throw new BadRequestError('Invalid company name search');
//   // }

//   // if((minEmployees && isNaN(minEmployees)) ||
//   //   (maxEmployees && isNaN(maxEmployees))) {
//   //   throw new BadRequestError('Employee number must be an integer');
//   // }

//   return next();
// }

// module.exports = {
//   validateSearchQuery,
// };
