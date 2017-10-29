const debug = require('debug')('yeps:body:text');

const raw = require('raw-body');
const inflate = require('inflation');

module.exports = async (req, opts = {}) => {

  debug(opts);

  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '1mb';
  opts.length = req.headers['content-length'];

  debug(opts);

  return raw(inflate(req), opts);
};
