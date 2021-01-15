"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getJobIds,
  u1Token,
  a1Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: 'NewJob',
    salary: 100000,
    equity: '0.002',
    companyHandle: 'c1',
  };

  test("works for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
        companyHandle: 'c1',
      }
    });
  });

  test("Unauth for non-admin users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("Unauth for anon", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data: title", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        salary: 100000,
        equity: '0.002',
        companyHandle: 'c1'
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing data: companyHandle", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "newJob",
        salary: -1000,
        equity: '1.5',
        companyHandle: 'c1'
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    await getJobIds();
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
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
        ],
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
      .get("/jobs")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("ok for anon", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app).get(`/jobs/${testJobId}`);
    expect(resp.body).toEqual({
      job: {
        id: testJobId,
        title: 'job1',
        salary: 1,
        equity: '0.001',
        companyHandle: 'c1',
      }
    });
  });

  test("not found for no such job", async function () {
    await getJobIds();

    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for admins", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .patch(`/jobs/${testJobId}`)
      .send({
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      job: {
        id: testJobId,
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
        companyHandle: 'c1',
      },
    });
  });

  test("fails for non-admin users", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .patch(`/jobs/${testJobId}`)
      .send({
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .patch(`/jobs/${testJobId}`)
      .send({
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
      });

    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    await getJobIds();
    
    const resp = await request(app)
      .patch(`/jobs/0`)
      .send({
        title: 'NewJob',
        salary: 100000,
        equity: '0.002',
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on invalid data", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .patch(`/jobs/${testJobId}`)
      .send({
        title: 'NewJob',
        salary: -1000,
        equity: '1.5',
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on missing data", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .patch(`/jobs/${testJobId}`)
      .send({
        salary: 100000,
        equity: '0.002',
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works for admins", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .delete(`/jobs/${testJobId}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({ deleted: `${testJobId}` });
  });

  test("fails for non-admin users", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .delete(`/jobs/${testJobId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const jobIds = await getJobIds();
    const testJobId = jobIds[0];

    const resp = await request(app)
      .delete(`/jobs/${testJobId}`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    await getJobIds();

    const resp = await request(app)
      .delete(`/jobs/0`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});