const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');
const parse = require('..');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('parse.form(req, opts)', async () => {
  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should parse valid form', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.form(ctx.req)));
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

  it('should not parse full depth', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const data = { level1: { level2: { level3: { level4: { level5: { level6: { level7: 'Hello' } } } } } } };

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.form(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('form')
      .send(data)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"level1":{"level2":{"level3":{"level4":{"level5":{"level6":{"[level7]":"Hello"}}}}}}}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should not parse full depth', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.form(ctx.req, { queryString: { depth: 1 } })));
    });

    await chai.request(server)
      .post('/')
      .type('form')
      .send({ level1: { level2: { level3: { level4: { level5: { level6: { level7: 'Hello' } } } } } } })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"level1":{"level2":{"[level3][level4][level5][level6][level7]":"Hello"}}}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse with allowDots default to true', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.form(ctx.req)));
    });

    await chai.request(server)
      .post('/')
      .type('form')
      .send('a.b=1&a.c=2')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"a":{"b":"1","c":"2"}}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should parse with allowDots = false', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(JSON.stringify(await parse.form(ctx.req, { queryString: { allowDots: false } })));
    });

    await chai.request(server)
      .post('/')
      .type('form')
      .send('a.b=1&a.c=2')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{"a.b":"1","a.c":"2"}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });
});
