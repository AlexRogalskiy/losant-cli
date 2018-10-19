const path = require('path');
const ssLog = require('single-line-log');
const c = require('chalk');
const pad = require('pad');
const { sinon, nock } = require('../common');
const utils = require('../../lib/utils');
const { defer } = require('omnibelt');
let spy;
const { remove, writeFile } = require('fs-extra');

const downloadLog = (msg) => { return `${pad(c.green('downloaded'), 13)}\t${msg}`; };
const unmodifiedLog = (msg) => { return `${`${pad(c.gray('unmodified'), 13)}\t${msg}`}`; };
const modifiedLog = (msg) => { return `${`${pad(c.yellow('modified'), 13)}\t${msg}`}`; };
const deletedLog = (msg) => { return `${`${pad(c.redBright('deleted'), 13)}\t${msg}`}`; };

describe('Experiene Commands', () => {

  it('should log an error if configure was not run first', async () => {
    const deferred = defer();
    spy = sinon.stub(ssLog, 'stdout').callsFake((message) => {
      deferred.resolve(message);
    });

    require('../../commands/experience').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-experience.js'),
      'status'
    ]);
    const msg = await deferred.promise;
    msg.should.equal(`${c.redBright('Error')} Configuration file losant.yml does not exist, run losant configure to generate this file.`);
  });
  it('should run get status', async () => {
    await utils.saveConfig('losant.yml',
      {
        applicationId: '568beedeb436ab01007be53d',
        apiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWE1OGNmOWU4ZmM5YTAwMDc1NTk4ODkiLCJzdWJ0eXBlIjoidXNlciIsInNjb3BlIjpbImFsbC5Vc2VyIl0sImlhdCI6MTUzOTgwODQ1NSwiaXNzIjoiYXBpLmxvc2FudC5zcGFjZSJ9.YMqAa5u4FOsIas4Wy0q3ZWZIf-P0vHzpA8kkZbTKARs'
      }
    );
    const deferred = defer();
    spy = sinon.stub(ssLog, 'stdout').callsFake((message) => {
      deferred.resolve(message);
    });

    require('../../commands/experience').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-experience.js'),
      'status'
    ]);
    const msg = await deferred.promise;
    msg.should.equal('No local experiences found');
  });
  it('should run get status, download, upload, and version', async function() {
    this.timeout(10000);
    nock('https://api.losant.space:443', { encodedQueryParams: true })
      .get('/applications/568beedeb436ab01007be53d/experience/views')
      .query({ _actions: 'false', _links: 'true', _embedded: 'true' })
      .reply(200, {
        count: 10,
        items: [{
          name: 'Dashboard Stream Only', viewType: 'page', layoutId: '59f201ed95c9e70007b7ffc3', body: '{{ element "dashboard" dashboardId=(template "56e1f44adf5a100100d943bc") ctx=(obj string-0=(template "{{pageData.deviceId}}") string-1=(template "def")) theme=(template "dark") time=(template "1516044628000") }}', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-12-15T16:14:32.516Z', lastUpdated: '2018-10-15T17:08:04.289Z', viewTags: {}, description: '', lastUpdatedById: '56c7420e63b022010029fcd3', lastUpdatedByType: 'user', experienceViewId: '5a33f4e847308400073d07f4', id: '5a33f4e847308400073d07f4', version: 'develop', layoutName: 'Example Layout', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/5a33f4e847308400073d07f4' } }
        }, {
          name: 'Dashboard Transferred', viewType: 'page', body: "{{ element \"dashboard\" dashboardId=(template \"{{'5a37d72d47308400073d07f6'}}\") ctx=(obj deviceId-0=(template \"59021caf9e2a180001268984\")) theme=(template \"light\") time=(template \"\") }}", applicationId: '568beedeb436ab01007be53d', creationDate: '2017-12-18T16:16:34.640Z', lastUpdated: '2018-10-15T17:07:28.168Z', viewTags: {}, description: 's', lastUpdatedById: '56c7420e63b022010029fcd3', lastUpdatedByType: 'user', experienceViewId: '5a37e9e247308400073d07fb', id: '5a37e9e247308400073d07fb', version: 'develop', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/5a37e9e247308400073d07fb' } }
        }, {
          name: 'Example Layout', description: 'Example layout using Twitter Bootstrap v3 scripts, stylesheets and scaffolding. You may create any number of layouts and reference them when rendering your pages, and you can include any common CSS or JavaScript in the layout.', viewType: 'layout', body: '<!doctype html>\n<!--[if lt IE 7]>      <html class="lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->\n<!--[if IE 7]>         <html class="lt-ie9 lt-ie8" lang=""> <![endif]-->\n<!--[if IE 8]>         <html class="lt-ie9" lang=""> <![endif]-->\n<!--[if gt IE 8]><!--> <html lang=""> <!--<![endif]-->\n  <head>\n    <meta charset="utf-8">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n    <title>{{ experience.page.name }} | My Experience</title>\n    <meta name="description" content="">\n    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n    <link rel="icon" type="image/x-icon" href="http://localapp.losant.space:8080/images/embree/favicon.ico" />\n    <!-- Latest compiled and minified CSS -->\n    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">\n  </head>\n  <body>\n    <!--[if lt IE 8]>\n      <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>\n    <![endif]-->\n    <nav class="navbar navbar-default" role="navigation" style="border-width: 0 0 1px; border-radius: 0; -webkit-border-radius:0;">\n      <div class="container-fluid">\n        <div class="navbar-header">\n          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">\n            <span class="sr-only">Toggle navigation</span>\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n            <span class="icon-bar"></span>\n          </button>\n          <a class="navbar-brand" href="/home-H1gSgMYkCZ" style="padding-top:0; padding-bottom:0;">\n            <img alt="Logo" style="margin-top:13px; height: 24px;" src="http://localapp.losant.space:8080/images/embree/embree_sm.png">\n          </a>\n        </div>\n        <div id="navbar" class="navbar-collapse collapse">\n          <ul class="nav navbar-nav navbar-left">\n            <li><a href="#">Link</a></li>\n            <li><a href="#">Link</a></li>\n            <li><a href="#">Link</a></li>\n            <li><a href="#">Link</a></li>\n          </ul>\n          {{component "userIndicator"}}\n        </div>\n      </div>\n    </nav>\n    {{ page }}\n    <hr>\n    <footer>\n      <p style="text-align:center">&copy; 2017. All rights reserved.</p>\n    </footer>\n    <!-- Bootstrap core JavaScript\n    ================================================== -->\n    <!-- Placed at the end of the document so the pages load faster -->\n    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>\n    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>\n    {{component "gaTracking" "UA-XXXXX-X"}}\n  </body>\n</html>', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:29.160Z', lastUpdated: '2018-10-12T23:01:04.713Z', viewTags: {}, lastUpdatedById: '56c7420e63b022010029fcd3', lastUpdatedByType: 'user', experienceViewId: '59f201ed95c9e70007b7ffc3', id: '59f201ed95c9e70007b7ffc3', version: 'develop', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201ed95c9e70007b7ffc3' } }
        }, {
          name: 'Home Page', description: 'Here is an example home page, which renders only for logged-in users. Within the workflow that renders this template, we redirect to the Login page if the experience user is not signed in. This page renders within your Example Layout at the position of the {{ page }} tag.', viewType: 'page', layoutId: '59f201ed95c9e70007b7ffc3', body: "<div class=\"container\">\n  <div class=\"jumbotron\">\n    <h1>Your Experience View!</h1>\n    <p class=\"lead\">\n      This is an example <a href=\"https://docs.losant.com/experiences/views/\">Experience View</a> we've built for you. It provides many of the common\n      components that most web pages have, like a header, footer, and navigation. You can use this\n      as a launching point for your own custom user interfaces.\n    </p>\n  </div>\n  <p>\n    All Experiences Views start with a <a href=\"https://docs.losant.com/experiences/views/#layouts\">Layout</a>. The layout includes common items found on\n    all pages, like a header and footer. <a href=\"https://docs.losant.com/experiences/views/#pages\">Pages</a> are then rendered inside\n    the layout.\n  </p>\n  <p>There are two types of pages available: <a href=\"https://docs.losant.com/experiences/views/#custom-pages\">Custom</a> and <a href=\"https://docs.losant.com/experiences/views/#dashboard-pages\">Dashboard</a>.\n    What you're reading now is an example of a custom page. Dashboard pages allow you to embed an\n    existing dashboard, which is a fast way to publish data to your Experience Users.\n  </p>\n  <p>\n    For additional information, please read the <a href=\"https://docs.losant.com/experiences/view-walkthrough/\">Experience View Walkthrough</a>, which includes\n    detailed instructions for how to build a complete example that includes both custom and\n    dashboard pages.\n  </p>\n  <p>\n    This example is created using <a href=\"https://getbootstrap.com/docs/3.3/\" target=\"_blank\">Twitter Bootstrap</a>, which\n    provides many components, styles, and utilities that make building web pages simple.\n  </p>\n</div>", applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:29.586Z', lastUpdated: '2018-09-18T21:45:59.899Z', viewTags: {}, experienceViewId: '59f201ed95c9e70007b7ffc5', id: '59f201ed95c9e70007b7ffc5', version: 'develop', layoutName: 'Example Layout', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201ed95c9e70007b7ffc5' } }
        }, {
          name: 'Log In', description: 'Users who are not signed in will be redirected to this page when they try to visit the home page. This is a simple login form; when the user submits the form, it will hit the POST /login-H1gSgMYkCZ endpoint with the email and password submitted by the user. If the credentials are valid, the user will get an authentication cookie and will be redirected to the Home page.', viewType: 'page', layoutId: '59f201ed95c9e70007b7ffc3', body: '{{#fillSection "foo"}}sdsds{{/fillSection}}\n\n<div class="container-fluid">\n  <div class="row">\n    <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">\n      <div style="max-width: 300px; margin: 0 auto 20px; text-align: center;">\n        <img class="img-responsive" src="http://localapp.losant.space:8080/images/embree/embree_full.png" alt="Big Logo">\n      </div>\n      <div class="well">\n        <p>\n          Welcome to your example Experience View! The above logos and this content\n          can be customized by editing the example Layout, Pages, and Components\n          that were automatically generated for you.\n        </p>\n        <p>\n          Log in below with your example user to see the next page with\n          additional information.\n        </p>\n      </div>\n      {{#if pageData.loginFailure}}\n        {{component "errorAlert" "Incorrect email or password."}}\n      {{/if}}\n      <form method="post">\n        <div class="form-group">\n          <label for="email" id="email">Email address</label>\n          <input autofocus value="{{ pageData.email }}" type="email" class="form-control" name="email" id="email" placeholder="e.g. test.user@example.com">\n        </div>\n        <div class="form-group">\n          <label for="password">Password</label>\n          <input type="password" class="form-control" id="password" name="password">\n        </div>\n        <button type="submit" class="btn btn-success">Sign In</button>\n      </form>\n    </div>\n  </div>\n</div>', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:29.322Z', lastUpdated: '2018-09-18T21:45:59.888Z', viewTags: {}, experienceViewId: '59f201edf21ee00007a93a94', id: '59f201edf21ee00007a93a94', version: 'develop', layoutName: 'Example Layout', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201edf21ee00007a93a94' } }
        }, {
          name: 'dash', viewType: 'page', layoutId: '59f201ed95c9e70007b7ffc3', body: '{{ element "dashboard" dashboardId=(template "58ebd885e326860001a6699f") ctx=(obj devId=(template "{{request.query.deviceId}}")) theme=(template "light") time=(template "") }}', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T20:54:13.012Z', lastUpdated: '2018-09-18T21:46:00.140Z', viewTags: {}, description: '', experienceViewId: '59f24b75ae64aa0007e7618a', id: '59f24b75ae64aa0007e7618a', version: 'develop', layoutName: 'Example Layout', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f24b75ae64aa0007e7618a' } }
        }, {
          name: 'default auto set', viewType: 'page', layoutId: '59f201ed95c9e70007b7ffc3', body: 'sd', createdById: '56c7420e63b022010029fcd3', createdByType: 'user', applicationId: '568beedeb436ab01007be53d', creationDate: '2018-10-09T00:23:55.322Z', lastUpdated: '2018-10-09T00:23:55.327Z', viewTags: {}, lastUpdatedById: '56c7420e63b022010029fcd3', lastUpdatedByType: 'user', experienceViewId: '5bbbf51b1785cf0006a9e8ec', id: '5bbbf51b1785cf0006a9e8ec', version: 'develop', layoutName: 'Example Layout', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/5bbbf51b1785cf0006a9e8ec' } }
        }, {
          name: 'errorAlert', description: 'A simple helper component for rendering an "error bar". In the example login page, this is used to alert the user that their credentials are invalid when they attempt to log in and the request fails.', viewType: 'component', body: '<div class="alert alert-danger">\n  {{.}}\n</div>', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:29.781Z', lastUpdated: '2018-09-18T21:45:59.909Z', viewTags: {}, experienceViewId: '59f201edf21ee00007a93a96', id: '59f201edf21ee00007a93a96', version: 'develop', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201edf21ee00007a93a96' } }
        }, {
          name: 'gaTracking', description: 'An example tracking script block which is referenced in the Example Layout. If you wish to enable Google Analytics, set your ID where the component is placed within the layout.', viewType: 'component', body: "<script>\n  (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=\n  function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;\n  e=o.createElement(i);r=o.getElementsByTagName(i)[0];\n  e.src='//www.google-analytics.com/analytics.js';\n  r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));\n  ga('create','{{.}}','auto');ga('send','pageview');\n</script>", applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:29.963Z', lastUpdated: '2018-09-18T21:45:59.919Z', viewTags: {}, experienceViewId: '59f201ed95c9e70007b7ffc7', id: '59f201ed95c9e70007b7ffc7', version: 'develop', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201ed95c9e70007b7ffc7' } }
        }, {
          name: 'userIndicator', description: 'An indicator for whether the user is logged in; this resides in the top right corner of the layout. When logged in, this becomes a dropdown with a "Log Out" option. When not logged in, this is a link to the Log In page.', viewType: 'component', body: '<ul class="nav navbar-nav navbar-right">\n  {{#if experience.user}}\n    <li class="dropdown">\n      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{experience.user.firstName}} <span class="caret"></span></a>\n      <ul class="dropdown-menu">\n        <li><a href="/logout-H1gSgMYkCZ">Log Out</a></li>\n      </ul>\n    </li>\n  {{else}}\n    <li><a href="/login-H1gSgMYkCZ">Log In</a></li>\n  {{/if}}\n</ul>', applicationId: '568beedeb436ab01007be53d', creationDate: '2017-10-26T15:40:30.111Z', lastUpdated: '2018-09-18T21:45:59.929Z', viewTags: {}, experienceViewId: '59f201eef21ee00007a93a98', id: '59f201eef21ee00007a93a98', version: 'develop', _type: 'experienceView', _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views/59f201eef21ee00007a93a98' } }
        }],
        applicationId: '568beedeb436ab01007be53d',
        version: 'develop',
        perPage: 100,
        page: 0,
        sortField: 'name',
        sortDirection: 'asc',
        totalCount: 10,
        _type: 'experienceViews',
        _links: { self: { href: '/applications/568beedeb436ab01007be53d/experience/views' } }
      }, [ 'Date',
        'Thu, 18 Oct 2018 19:37:34 GMT',
        'Content-Type',
        'application/json',
        'Content-Length',
        '15063',
        'Connection',
        'close',
        'Pragma',
        'no-cache',
        'Cache-Control',
        'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options',
        'nosniff',
        'X-XSS-Protection',
        '1; mode=block',
        'Content-Security-Policy',
        'default-src \'none\'; style-src \'unsafe-inline\'',
        'Access-Control-Allow-Origin',
        '*',
        'Strict-Transport-Security',
        'max-age=31536000' ]);
    await utils.saveConfig('losant.yml',
      {
        applicationId: '568beedeb436ab01007be53d',
        apiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWE1OGNmOWU4ZmM5YTAwMDc1NTk4ODkiLCJzdWJ0eXBlIjoidXNlciIsInNjb3BlIjpbImFsbC5Vc2VyIl0sImlhdCI6MTUzOTgwODQ1NSwiaXNzIjoiYXBpLmxvc2FudC5zcGFjZSJ9.YMqAa5u4FOsIas4Wy0q3ZWZIf-P0vHzpA8kkZbTKARs'
      }
    );
    const deferred = defer();
    const messages = [];
    spy = sinon.stub(ssLog, 'stdout').callsFake((message) => {
      messages.push(message);
      if (messages.length === 10) {
        deferred.resolve(messages);
      }
    });

    require('../../commands/experience').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-experience.js'),
      'download'
    ]);
    const msgs = await deferred.promise;
    msgs.length.should.equal(10);
    msgs.sort().should.deepEqual([
      downloadLog('experience/components/errorAlert.hbs'),
      downloadLog('experience/components/gaTracking.hbs'),
      downloadLog('experience/components/userIndicator.hbs'),
      downloadLog('experience/layouts/Example Layout.hbs'),
      downloadLog('experience/pages/Dashboard Stream Only.hbs'),
      downloadLog('experience/pages/Dashboard Transferred.hbs'),
      downloadLog('experience/pages/Home Page.hbs'),
      downloadLog('experience/pages/Log In.hbs'),
      downloadLog('experience/pages/dash.hbs'),
      downloadLog('experience/pages/default auto set.hbs')
    ]);
    await spy.restore();
    let statusDeferred = defer();
    let statusMessages = [];
    spy = sinon.stub(ssLog, 'stdout').callsFake((message) => {
      statusMessages.push(message);
      if (statusMessages.length === 10) {
        statusDeferred.resolve();
      }
    });
    require('../../commands/experience').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-experience.js'),
      'status'
    ]);
    await statusDeferred.promise;
    statusMessages.sort().should.deepEqual([
      unmodifiedLog('experience/components/errorAlert.hbs'),
      unmodifiedLog('experience/components/gaTracking.hbs'),
      unmodifiedLog('experience/components/userIndicator.hbs'),
      unmodifiedLog('experience/layouts/Example Layout.hbs'),
      unmodifiedLog('experience/pages/Dashboard Stream Only.hbs'),
      unmodifiedLog('experience/pages/Dashboard Transferred.hbs'),
      unmodifiedLog('experience/pages/Home Page.hbs'),
      unmodifiedLog('experience/pages/Log In.hbs'),
      unmodifiedLog('experience/pages/dash.hbs'),
      unmodifiedLog('experience/pages/default auto set.hbs')
    ]);
    await spy.restore();

    await remove('./experience/components/errorAlert.hbs');
    await remove('./experience/components/gaTracking.hbs');
    await writeFile('./experience/pages/dash.hbs', 'hello world...');
    statusDeferred = defer();
    statusMessages = [];
    spy = sinon.stub(ssLog, 'stdout').callsFake((message) => {
      statusMessages.push(message);
      if (statusMessages.length === 10) {
        statusDeferred.resolve();
      }
    });
    require('../../commands/experience').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-experience.js'),
      'status'
    ]);
    await statusDeferred.promise;
    statusMessages.sort().should.deepEqual([
      modifiedLog('experience/pages/dash.hbs'),
      unmodifiedLog('experience/components/userIndicator.hbs'),
      unmodifiedLog('experience/layouts/Example Layout.hbs'),
      unmodifiedLog('experience/pages/Dashboard Stream Only.hbs'),
      unmodifiedLog('experience/pages/Dashboard Transferred.hbs'),
      unmodifiedLog('experience/pages/Home Page.hbs'),
      unmodifiedLog('experience/pages/Log In.hbs'),
      unmodifiedLog('experience/pages/default auto set.hbs'),
      deletedLog('experience/components/errorAlert.hbs'),
      deletedLog('experience/components/gaTracking.hbs')
    ]);
  });
});