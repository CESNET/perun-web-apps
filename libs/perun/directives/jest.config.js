module.exports = {
  name: 'perun-directives',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/perun/directives',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
