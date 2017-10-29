const debug = require('debug')('yeps:body:any');

const is = require('type-is');
const json = require('./json');
const form = require('./form');
const text = require('./text');

const jsonTypes = ['json', 'application/*+json', 'application/csp-report'];
const formTypes = ['urlencoded'];
const textTypes = ['text'];

module.exports = async (req, opts = {}) => {

  debug(opts);

  if (is(req) === null) {
    return Promise.resolve();
  }

  // json
  const jsonType = opts.jsonTypes || jsonTypes;

  if (is(req, jsonType)) {
    debug('json');
    return json(req, opts);
  }

  // form
  const formType = opts.formTypes || formTypes;

  if (is(req, formType)) {
    debug('form');
    return form(req, opts);
  }

  // text
  const textType = opts.textTypes || textTypes;

  if (is(req, textType)) {
    debug('text');
    return text(req, opts);
  }

  // invalid
  const type = req.headers['content-type'] || '';

  const message = type ? `Unsupported content-type: ${type}` : 'Missing content-type';

  const err = new Error(message);

  err.status = 415;

  debug(err);

  return Promise.reject(err);
};
