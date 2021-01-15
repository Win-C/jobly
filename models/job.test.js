"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getJobIds
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
      [job_id]
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
describe("findAll", function () {
  test("works: no filter", async function () {


    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: 'job1',
        salary: 1,
        equity: '0.001',
        companyHandle: 'c1',
      },
      {
        id: expect.any(Number),
        title: 'job2',
        salary: 2,
        equity: '0.002',
        companyHandle: 'c2',
      },
      {
        id: expect.any(Number),
        title: 'job3',
        salary: 3,
        equity: '0.003',
        companyHandle: 'c3',
      },
    ]);
  });
});

/************************************** get */
describe("get", function () {
  test("works", async function () {
    let testJobId = (await getJobIds())[0];
    let job = await Job.get(testJobId);

    expect(job).toEqual(
      {
        id: testJobId,
        title: 'job1',
        salary: 1,
        equity: '0.001',
        companyHandle: 'c1',
      }
    );
  });

  test("not found if no such job id", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

});



/************************************** update */

describe("update", function () {
  const updateData = {
    title: 'new',
    salary: 2,
    equity: '0.002',
  };
  
  test("works", async function () {

    const testJobId = (await getJobIds())[0];
    const job = await Job.update(testJobId, updateData);

    expect(job).toEqual({
      id: testJobId,
      ...updateData,
      companyHandle: "c1"
    });

    const result = await db.query(
      `SELECT id, 
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`, [testJobId]);

    expect(result.rows).toEqual([{
      id: testJobId,
      title: 'new',
      salary: 2,
      equity: '0.002',
      companyHandle: "c1"
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: 'new',
      salary: null,
      equity: null,
    };

    const testJobId = (await getJobIds())[0];
    const job = await Job.update(testJobId, updateDataSetNulls);
    
    expect(job).toEqual({
      id: testJobId,
      ...updateDataSetNulls,
      companyHandle: "c1"
    });

    const result = await db.query(
      `SELECT id, 
            title,
            salary,
            equity,
            company_handle AS "companyHandle"
         FROM jobs
         WHERE id = $1`, [testJobId]);

    expect(result.rows).toEqual([{
      id: testJobId,
      title: 'new',
      salary: null,
      equity: null,
      companyHandle: "c1"
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      const testJobId = (await getJobIds())[0];

      await Job.update(testJobId, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});



/************************************** delete */

describe("remove", function () {
  test("works", async function () {
    const testJobId = (await getJobIds())[0];

    await Job.remove(testJobId);
    const res = await db.query(
      "SELECT id FROM jobs WHERE id=$1", [testJobId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});