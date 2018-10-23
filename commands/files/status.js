const { files: { apiType, commandType, localStatusParams, remoteStatusParams } } = require('../../lib/constants');
const params = {
  apiType,
  commandType,
  localStatusParams,
  remoteStatusParams,
  getQuery: { type: 'file' }
};
module.exports = (program) => {
  require('../utils/status')(program, 'files', params);
};
