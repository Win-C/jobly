"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for companies. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, companyHandle }) {
    const companyCheck = await db.query(
      `SELECT handle
           FROM companies
           WHERE handle = $1`,
      [ companyHandle]);

    if (companyCheck.rows.length === 0) {
      throw new BadRequestError(`No company found for: ${companyHandle}`);
    }

    const result = await db.query(
      `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [
        title, 
        salary,
        equity, 
        companyHandle,
      ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{  }, ...]
   * */

  // static async findAll() {

  // }
  
  /** Given a job id, return data about job.
   *
   * Returns [{ }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  // static async get() {

  // }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { }
   *
   * Returns { }
   *
   * Throws NotFoundError if not found.
   */

  // static async update() {
  
  // }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  // static async remove() {
  
  // }

}


module.exports = Job;