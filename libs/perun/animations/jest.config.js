module.exports = {
  name: 'perun-animations',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/perun/animations',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
