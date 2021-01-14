"use strict";

const { search } = require("../app");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM companies
           WHERE handle = $1`,
      [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
      `INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
      [
        handle,
        name,
        description,
        numEmployees,
        logoUrl,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(searchQuery = {}) {
    const query = this._sqlForFilter(searchQuery);

    const companiesRes = await db.query(query.query, query.whereValues);
    
    return companiesRes.rows;
  }

  /** Helper function for mapping data into SQL format for WHERE clause 
   *  in SQL SELECT queries. Used in Company models.
   *  Returns WHERE clause.

      searchQuery may include:
        { name, minEmployees, maxEmployees }
    
      EXAMPLE:
        searchQuery = { name: 'bau', minEmployees: 500 }
        
        Returning: 'WHERE name ILIKE '%bau%' AND minEmployees >= 500'
  */
  static _sqlForFilter(searchQuery) {
    let { name, minEmployees, maxEmployees } = searchQuery;
    minEmployees = +minEmployees;
    maxEmployees = +maxEmployees;
    let query = `SELECT handle,
                      name,
                      description,
                      num_employees AS "numEmployees",
                      logo_url AS "logoUrl"
                    FROM companies`;

    // If no query string parameters, return unfiltered SQL
    if (Object.keys(searchQuery).length === 0) {
      return {
        query: query + " ORDER BY name",
        whereValues: []
      };
    }

    // Makes sure that min num of employees not greater than max
    if (minEmployees && maxEmployees && (minEmployees > maxEmployees)) {
      throw new BadRequestError("Min number of employees cannot be greater than max");
    }

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
    if (!isNaN(minEmployees)) {
      whereClauses.push(`num_employees >= $${idx}`);
      whereValues.push(searchQuery.minEmployees);
      idx++;
    }

    // checks for "maxEmployees" filter 
    if (!isNaN(maxEmployees)) {
      whereClauses.push(`num_employees <= $${idx}`);
      whereValues.push(searchQuery.maxEmployees);
      idx++;
    }
    query = query + " WHERE " + whereClauses.join(" AND ") + " ORDER BY name";

    return { query, whereValues };
  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
      `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
      [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
      [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
