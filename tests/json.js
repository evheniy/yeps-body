const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const parse = require('..');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('parse.json(req, opts)', async () => {

    beforeEach(() => {
        app = new App();
    });

    it('should parse valid json', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            ctx.res.statusCode = 200;
            ctx.res.setHeader('Content-Type', 'application/json');
            ctx.res.end(JSON.stringify(await parse.json(ctx.req)));
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send({ foo: 'bar' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.foo).to.be.equal('bar');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse valid json and strict = false', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            ctx.res.statusCode = 200;
            ctx.res.setHeader('Content-Type', 'application/json');
            ctx.res.end(JSON.stringify(await parse.json(ctx.req, { strict: true })));
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send({ foo: 'bar' })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.foo).to.be.equal('bar');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse empty request', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            ctx.res.statusCode = 200;
            ctx.res.setHeader('Content-Type', 'application/json');
            ctx.res.end(JSON.stringify(await parse.json(ctx.req)));
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse with content-length = 0 and strict = false', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            const body = await parse.json(ctx.req, { strict: false });
            expect(body).to.be.equal('');

            ctx.res.statusCode = 200;
            ctx.res.setHeader('Content-Type', 'application/json');
            ctx.res.end('{}');
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).is.a('object');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse with content-length = 0 and strict = true', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            try {
                await parse.json(ctx.req, { strict: true });
                ctx.res.statusCode = 200;
                ctx.res.end('');
            } catch (err) {
                ctx.res.statusCode = err.status;
                ctx.res.end(err.message);
            }
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(400);
                expect(err.message).to.be.equal('Bad Request');
                expect(err.response.text).to.be.equal('invalid JSON, only supports object and array');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse error', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            try {
                await parse.json(ctx.req);
            } catch (err) {
                ctx.res.statusCode = err.status;
                ctx.res.end(err.message);
            }
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .set('content-type', 'application/json')
            .send('{"foo": "bar')
            .catch(err => {
                expect(err).to.have.status(400);
                expect(err.message).to.be.equal('Bad Request');
                expect(err.response.text).to.be.equal('Unexpected end of JSON input');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse non-object json and strict = false', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            try {
                await parse.json(ctx.req, { strict: false });
                ctx.res.statusCode = 200;
                ctx.res.end('');
            } catch (err) {
                ctx.res.statusCode = err.status;
                ctx.res.end(err.message);
            }
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .set('content-type', 'application/json')
            .send('foo')
            .catch(err => {
                expect(err).to.have.status(400);
                expect(err.message).to.be.equal('Bad Request');
                expect(err.response.text).to.be.equal('Unexpected token o in JSON at position 1');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should parse non-object json and strict = true', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            try {
                await parse.json(ctx.req, { strict: true });
                ctx.res.statusCode = 200;
                ctx.res.end('');
            } catch (err) {
                ctx.res.statusCode = err.status;
                ctx.res.end(err.message);
            }
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .set('content-type', 'application/json')
            .send('foo')
            .catch(err => {
                expect(err).to.have.status(400);
                expect(err.message).to.be.equal('Bad Request');
                expect(err.response.text).to.be.equal('invalid JSON, only supports object and array');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

});
