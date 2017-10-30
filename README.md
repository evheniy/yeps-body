# YEPS body

Parse request bodies with async / await

[![NPM](https://nodei.co/npm/yeps-body.png)](https://npmjs.org/package/yeps-body)

[![npm version](https://badge.fury.io/js/yeps-body.svg)](https://badge.fury.io/js/yeps-body)
[![Build Status](https://travis-ci.org/evheniy/yeps-body.svg?branch=master)](https://travis-ci.org/evheniy/yeps-body)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-body/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-body?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-body/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-body/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-body)

[![Dependency Status](https://david-dm.org/evheniy/yeps-body.svg)](https://david-dm.org/evheniy/yeps-body)
[![devDependency Status](https://david-dm.org/evheniy/yeps-body/dev-status.svg)](https://david-dm.org/evheniy/yeps-body#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-body)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-body/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-body.svg)](https://github.com/evheniy/yeps-body/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-body.svg)](https://github.com/evheniy/yeps-body/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-body.svg)](https://github.com/evheniy/yeps-body/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-body.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-body
  
## How to use

    const App = require('yeps');
    const parse = require('yeps-body');
    const app = new App();
    
    app.then(async (ctx) => {
        ctx.res.statusCode = 200;
        ctx.res.end(JSON.stringify(await parse.any(ctx.req)));
    });
    
## Text

    parse.text(ctx.req)
    
## JSON

    parse.json(ctx.req)
    
    parse.json(ctx.req, { strict: true })
    
## Form

    parse.form(ctx.req)
    
    parse.form(ctx.req, { queryString: { depth: 1 }})
    
    parse.form(ctx.req, { queryString: { allowDots: false }})
    
See [queryString](https://github.com/ljharb/qs) parameters.
            
            
#### [YEPS documentation](http://yeps.info/)


#### Dependencies:

* [qs](https://github.com/ljharb/qs) - A querystring parsing and stringifying library with some added security
* [inflation](https://github.com/stream-utils/inflation) - Automatically unzip an HTTP stream
* [raw-body](https://github.com/stream-utils/raw-body) -  Parsing request bodies
* [type-is](https://github.com/jshttp/type-is) - Infer the content-type of a request
