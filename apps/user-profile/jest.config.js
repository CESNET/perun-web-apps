module.exports = {
  name: 'user-profile-page',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/user-profile-page',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
