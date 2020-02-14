module.exports = {
  name: 'statistics',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/statistics',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
