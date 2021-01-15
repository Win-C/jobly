"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
  test("works", async function () {
    const newJob = {
      title: 'NewJob',
      salary: 100000,
      equity: '0.002',
      companyHandle: 'c1',
    };
  
    let job = await Job.create(newJob);
    let job_id = job.id;

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
           [ job_id ]
      );

    expect(result.rows[0]).toEqual(
      {
        id: job_id,
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
        companyHandle: 'c1',
      },
    );
  });

  test("fails: company_handle does not exist", async function () {
    const newJob = {
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
        companyHandle: 'nope',
    };

    try {
      await Job.create(newJob);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */
// Tests include
// 1. works: valid job created
// 2. fail: missing data
// 3. fail: equity check is greater than 1 or less than 0
// 4. fail: salary is less than 0
// 5. fail: company_handle does not exist

/************************************** get */

/************************************** update */

/************************************** delete */