const minimatch = require('minimatch');
const { curry } = require('omnibelt');
const { experience: { apiType, commandType, localStatusParams, remoteStatusParams } } = require('../../lib/constants');
const getData = async (view) => {
  return view.body;
};

const curriedFilterFunc = curry((pattern, view) => {
  return minimatch(view.name, pattern);
});

const helpLines = [
  'Download all experience views (components, layouts and pages)',
  '$ losant experience download',
  'Download component views',
  '$ losant experience download components/*',
  'Force a download of all views overwriting local modifications'
];


module.exports = (program) => {
  require('../utils/download')(program, {
    getData, curriedFilterFunc, apiType, commandType, localStatusParams, remoteStatusParams
  });

  return helpLines;
};
