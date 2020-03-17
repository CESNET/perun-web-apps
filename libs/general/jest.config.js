module.exports = {
  name: 'general',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/general',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
