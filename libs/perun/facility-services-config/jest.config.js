module.exports = {
  name: 'perun-facility-services-config',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/perun/facility-services-config',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
