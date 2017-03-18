const App = require('yeps');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const parse = require('..');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('parse.text(req, opts)', async () => {

    beforeEach(() => {
        app = new App();
    });

    it('should parse', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            isTestFinished1 = true;

            ctx.res.statusCode = 200;
            ctx.res.end(await parse.text(ctx.req));
        });

        await chai.request(http.createServer(app.resolve()))
            .post('/')
            .send('Hello World!')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.equal('Hello World!');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

});
