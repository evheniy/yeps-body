const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');
const zlib = require('zlib');
const parse = require('..');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('parse.any(req, opts)', async () => {
  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test request without body', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .get('/')
      .set('content-type', 'application/json')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse valid form body', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('form')
      .send({ foo: { bar: 'baz' } })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"foo":{"bar":"baz"}}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse valid json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .send({ foo: 'bar' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"foo":"bar"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse valid text', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .set('content-type', 'text/plain')
      .send('plain text')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('"plain text"');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse application/json-patch+json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('application/json-patch+json')
      .send(JSON.stringify([{ op: 'replace', path: '/foo', value: 'bar' }]))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('[{"op":"replace","path":"/foo","value":"bar"}]');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse application/vnd.api+json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('application/vnd.api+json')
      .send(JSON.stringify({ posts: '1' }))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"posts":"1"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse application/csp-report', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('application/csp-report')
      .send(JSON.stringify({ posts: '1' }))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"posts":"1"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse application/ld+json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('application/ld+json')
      .send(JSON.stringify({ posts: '1' }))
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"posts":"1"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse html as text', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req, { textTypes: 'text/html' })));
    });

    await chai.request(server)
      .post('/')
      .set('Content-Type', 'text/html')
      .send('<h1>html text</ht>')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('"<h1>html text</ht>"');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse graphql as text', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const graphql = '{\n  user(id: 4) {\n    name\n  }\n}';

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(await parse.any(ctx.req, { textTypes: ['application/graphql', 'text/html'] }));
    });

    await chai.request(server)
      .post('/')
      .set('Content-Type', 'application/graphql')
      .send(graphql)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal(graphql);
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should fail with 415', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      try {
        await parse.any(ctx.req);
      } catch (err) {
        ctx.res.statusCode = err.status;
        ctx.res.end(err.message);
      }
    });

    await chai.request(server)
      .post('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(415);
        expect(err.message).to.be.equal('Unsupported Media Type');
        expect(err.response.text).to.be.equal('Missing content-type');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should fail with 415', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      try {
        await parse.any(ctx.req);
      } catch (err) {
        ctx.res.statusCode = err.status;
        ctx.res.end(err.message);
      }
    });

    await chai.request(server)
      .post('/')
      .type('')
      .send()
      .catch((err) => {
        expect(err).to.have.status(415);
        expect(err.message).to.be.equal('Unsupported Media Type');
        expect(err.response.text).to.be.equal('Unsupported content-type: application/octet-stream');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should inflate gzip', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const json = JSON.stringify({ foo: 'bar' });

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    const request = new Promise((resolve, reject) => {
      const req = chai.request(server)
        .post('/')
        .type('json')
        .set('Content-Encoding', 'gzip');

      req.write(zlib.gzipSync(json));
      req.end((err, res) => {
        isTestFinished2 = true;
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    const res = await request;
    expect(res).to.have.status(200);
    expect(res.text).to.be.equal('{"foo":"bar"}');

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should inflate deflate', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const json = JSON.stringify({ foo: 'bar' });

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    const request = new Promise((resolve, reject) => {
      const req = chai.request(server)
        .post('/')
        .type('json')
        .set('Content-Encoding', 'deflate');

      req.write(zlib.deflateSync(json));
      req.end((err, res) => {
        isTestFinished2 = true;
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    const res = await request;
    expect(res).to.have.status(200);
    expect(res.text).to.be.equal('{"foo":"bar"}');

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should pass-through identity', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .set('Content-Encoding', 'identity')
      .send({ foo: 'bar' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"foo":"bar"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });
});
