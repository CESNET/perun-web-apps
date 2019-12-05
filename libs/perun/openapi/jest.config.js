module.exports = {
  name: 'perun-openapi',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/perun/openapi',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
