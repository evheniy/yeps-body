const debug = require('debug')('yeps:body:json');

const raw = require('raw-body');
const inflate = require('inflation');

// Allowed whitespace is defined in RFC 7159
// http://www.rfc-editor.org/rfc/rfc7159.txt
const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

const parse = (str, strict) => {

  debug(str);

  if (!strict) {
    return str ? JSON.parse(str) : str;
  }

  if (!strictJSONReg.test(str)) {
    throw new Error('invalid JSON, only supports object and array');
  }

  return JSON.parse(str);
};

module.exports = async (req, opts = {}) => {

  debug(opts);

  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '1mb';
  opts.length = req.headers['content-length'];

  debug(opts);

  try {
    return parse(await raw(inflate(req), opts), !!opts.strict);
  } catch (err) {
    err.status = 400;
    throw err;
  }
};
