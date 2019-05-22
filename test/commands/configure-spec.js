const path = require('path');
const {
  sinon,
  nock

} = require('../common');
const { saveUserConfig } = require('../../lib/utils');
const { defer } = require('omnibelt');
const inquirer = require('inquirer');


describe('Configure Commands', () => {
  it('should prompt the user if there are multiple config urls', async () => {
    nock('https://api.losant.space:443', { encodedQueryParams: true })
      .get('/whitelabels/domain')
      .reply(200,
        {
          appUrl: 'https://app.losant.com',
          endpointDomain: 'onlosant.com'
        });
    nock('https://api.losant.space:443', { encodedQueryParams: true })
      .get('/applications')
      .query(true)
      .reply(200,
        {
          count: 1,
          items:
           [ {
             name: 'CSV',
             ownerType: 'user',
             ownerId: '5c6d7bebdbea67000759190f',
             creationDate: '2019-02-20T16:27:56.033Z',
             lastUpdated: '2019-05-22T14:15:28.450Z',
             globals: [],
             ftueTracking: [Array],
             _etag: '"161-phJIoO/+IK5AKBgVOfxofb7mS00"',
             applicationId: '5c6d800c8f3e0c000945c135',
             summary: [Object],
             endpointDefaultCors: true,
             id: '5c6d800c8f3e0c000945c135',
             endpointSlug: '5c6d800c8f3e0c000945c135',
             _currentRole: 'admin',
             _type: 'application',
             _links: [Object]
           } ],
          filter: 'CSV',
          filterField: 'name',
          perPage: 100,
          page: 0,
          sortField: 'name',
          sortDirection: 'asc',
          totalCount: 1,
          _type: 'applications',
          _links: { self: { href: '/applications' } }
        }
      );
    nock('https://api.losant.space:443', { encodedQueryParams: true })
      .get('/applications/5c6d800c8f3e0c000945c135/experience/views')
      .query({ _actions: 'false', _links: 'true', _embedded: 'true', page: 0, perPage: 1000 })
      .reply(200,
        {
          count: 2,
          items: [
            {
              name: 'Home Page',
              description: 'Here is an example home page, which renders only for logged-in users. Within the workflow that renders this template, we redirect to the Login page if the experience user is not signed in. This page renders within your Example Layout at the position of the {{ page }} tag.',
              viewType: 'page',
              layoutId: '5b92975dc2f8de0006e2ca93',
              body: "{{#fillSection \"metaDescription\"}}This is an example home page for your application experience.{{/fillSection}}\n<div class=\"container\">\n  <div class=\"jumbotron\">\n    <h1>Your Experience View!</h1>\n    <p class=\"lead\">\n      This is an example of a change and back down <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/\">Experience View</a> we've built for you. It provides many of the common\n      components that most web pages have, like a header, footer, and navigation. You can use this\n      as a launching point for your own custom user interfaces.\n    </p>\n  </div>\n  <p>\n    All Experiences Views start with a <a href=\"https://docs.losant.com/experiences/views/#layouts\">Layout</a>. The layout includes common items found on\n    all pages, like a header and footer. <a href=\"https://docs.losant.com/experiences/views/#pages\">Pages</a> are then rendered inside\n    the layout.\n  </p>\n  <p>There are two types of pages available: <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/#custom-pages\">Custom</a> and <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/#dashboard-pages\">Dashboard</a>.\n    What you're reading now is an example of a custom page. Dashboard pages allow you to embed an\n    existing dashboard, which is a fast way to publish data to your Experience Users.\n  </p>\n  <p>\n    For additional information, please read the <a target=\"_blank\" href=\"https://docs.losant.com/experiences/walkthrough/views/overview/\">Experience View Walkthrough</a>, which includes\n    detailed instructions for how to build a complete example that includes both custom and\n    dashboard pages.\n  </p>\n  <p>\n    This example is created using <a href=\"https://getbootstrap.com/docs/3.3/\" target=\"_blank\">Twitter Bootstrap</a>, which\n    provides many components, styles, and utilities that make building web pages simple.\n  </p>\n</div>",
              applicationId: '5b9297591fefb200072e554d',
              creationDate: '2018-09-07T15:21:01.465Z',
              lastUpdated: '2018-09-07T20:31:57.217Z',
              viewTags: {},
              experienceViewId: '5b92975d376bb800087d1f50',
              id: '5b92975d376bb800087d1f50',
              version: 'develop',
              layoutName: 'Example Layout',
              _type: 'experienceView',
              _links: { self: { href: '/applications/5b9297591fefb200072e554d/experience/views/5b92975d376bb800087d1f50' } }
            },
            {
              name: 'Log In',
              viewType: 'page',
              layoutId: '5b92975dc2f8de0006e2ca93',
              body: "{{#fillSection \"metaDescription\"}}This is an example home page for your application experience.{{/fillSection}}\n<div class=\"container\">\n  <div class=\"jumbotron\">\n    <h1>Your Experience View!</h1>\n    <p class=\"lead\">\n      This is an example of a change and back down <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/\">Experience View</a> we've built for you. It provides many of the common\n      components that most web pages have, like a header, footer, and navigation. You can use this\n      as a launching point for your own custom user interfaces.\n    </p>\n  </div>\n  <p>\n    All Experiences Views start with a <a href=\"https://docs.losant.com/experiences/views/#layouts\">Layout</a>. The layout includes common items found on\n    all pages, like a header and footer. <a href=\"https://docs.losant.com/experiences/views/#pages\">Pages</a> are then rendered inside\n    the layout.\n  </p>\n  <p>There are two types of pages available: <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/#custom-pages\">Custom</a> and <a target=\"_blank\" href=\"https://docs.losant.com/experiences/views/#dashboard-pages\">Dashboard</a>.\n    What you're reading now is an example of a custom page. Dashboard pages allow you to embed an\n    existing dashboard, which is a fast way to publish data to your Experience Users.\n  </p>\n  <p>\n    For additional information, please read the <a target=\"_blank\" href=\"https://docs.losant.com/experiences/walkthrough/views/overview/\">Experience View Walkthrough</a>, which includes\n    detailed instructions for how to build a complete example that includes both custom and\n    dashboard pages.\n  </p>\n  <p>\n    This example is created using <a href=\"https://getbootstrap.com/docs/3.3/\" target=\"_blank\">Twitter Bootstrap</a>, which\n    provides many components, styles, and utilities that make building web pages simple.\n  </p>\n</div>",
              applicationId: '5b9297591fefb200072e554d',
              creationDate: '2018-09-07T15:21:01.465Z',
              lastUpdated: '2018-09-07T20:31:57.217Z',
              viewTags: {},
              experienceViewId: '5b92975d376bb800087d1f50',
              id: '5b92975dc2f8de0006e2ca94',
              version: 'develop',
              layoutName: 'Example Layout',
              _type: 'experienceView',
              _links: { self: { href: '/applications/5b9297591fefb200072e554d/experience/views/5b92975d376bb800087d1f50' } }
            }
          ]
        });

    const conf1 = {};
    const conf2 = {};
    conf1['https://api.losant.space'] = { apiToken: 'token' };
    conf2['https://api.losant.com'] = { apiToken: 'token' };
    await saveUserConfig(conf1);
    await saveUserConfig(conf2);

    const deferred = defer();
    let urls = [];

    let counter = 0;
    sinon.stub(inquirer, 'prompt').callsFake((data) => {
      let res;
      switch (counter) {
        case 0:
          urls = data[0].choices;
          res = Promise.resolve({ url: 'https://api.losant.space' });
          break;
        case 1:
          res = Promise.resolve({ filter: 'help' });
          break;
        case 2:
          res = Promise.resolve({ shouldBootstrap: true });
          deferred.resolve();
          break;
        default:
          break;
      }
      counter++;
      return res;
    });

    require('../../commands/configure').parse([
      '/bin/node',
      path.resolve(__dirname, '/bin/losant-configure.js')]);

    await deferred.promise;
    urls.should.deepEqual(['https://api.losant.space', 'https://api.losant.com']);
  });
});
