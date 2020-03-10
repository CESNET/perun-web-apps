module.exports = {
  name: 'perun-components',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/perun/components',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
