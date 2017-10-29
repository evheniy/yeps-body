const debug = require('debug')('yeps:body:form');

const raw = require('raw-body');
const inflate = require('inflation');
const qs = require('qs');

module.exports = async (req, opts = {}) => {

  debug(opts);

  const queryString = opts.queryString || {};

  if (queryString.allowDots === undefined) {
    queryString.allowDots = true;
  }

  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '56kb';
  opts.length = req.headers['content-length'];

  return qs.parse(await raw(inflate(req), opts), queryString);
};
