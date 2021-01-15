"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
// const jobUpdateSchema = require("../schemas/jobUpdate.json");
// const jobsFilterSchema = require("../schemas/jobsFilter.json");
const e = require("express");

const router = new express.Router();


/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, jobNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const job = await Job.create(req.body);
  return res.status(201).json({ job });
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const jobs = await Job.findAll();
  return res.json({ jobs });
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

// router.get("/:handle", async function (req, res, next) {
//   const company = await Company.get(req.params.handle);
//   return res.json({ company });
// });

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

// router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
//   const validator = jsonschema.validate(req.body, companyUpdateSchema);
//   if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
//   }

//   const company = await Company.update(req.params.handle, req.body);
//   return res.json({ company });
// });

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

// router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
//   await Company.remove(req.params.handle);
//   return res.json({ deleted: req.params.handle });
// });


module.exports = router;