Upgrade notes

## [14.4.0](https://github.com/CESNET/perun-web-apps/compare/v14.3.1...v14.4.0) (2023-11-07)


### Features

* added type to dialog config ([760f8df](https://github.com/CESNET/perun-web-apps/commit/760f8df5213545920329d6720116b6de079c8e04))
* **admin:** color of block destinations ([5ff7566](https://github.com/CESNET/perun-web-apps/commit/5ff7566be7678e407bec780d110e1e9f3e019a66))
* **admin:** filter groups by role ([a4f529b](https://github.com/CESNET/perun-web-apps/commit/a4f529b9aee17b0385a33bc82a316a7f085e5bea))
* merge configs on initialization ([962926a](https://github.com/CESNET/perun-web-apps/commit/962926af83da27d6044e094c29fcc699bb7515a8))


### Bug Fixes

* **admin:** bulk application approve/reject error handling ([76a23b7](https://github.com/CESNET/perun-web-apps/commit/76a23b738349748b1b08b1a7b0f65f1988e14a0e))
* **admin:** correctly display group action buttons on a tree view ([589744e](https://github.com/CESNET/perun-web-apps/commit/589744e3790cfd14fb722e511879ff6ecccbc8eb))
* **admin:** disable force propagation button ([eca6a76](https://github.com/CESNET/perun-web-apps/commit/eca6a76b07d1a73f2cca2ba132bcc029db518269))
* **admin:** disable to add new form item during the data loading ([307fde6](https://github.com/CESNET/perun-web-apps/commit/307fde6eea6d63c1d837e507fc7d43998c64e6de))
* **admin:** edit attribute definition ([248b065](https://github.com/CESNET/perun-web-apps/commit/248b065e9bc9383a71f80b2b6ef5e95331542250))
* **admin:** fix ExpressionChangedAfterItHasBeenCheckedError on applications page ([aecd28a](https://github.com/CESNET/perun-web-apps/commit/aecd28ae41e343d4ff2d1dc7f388f716a0524aad))
* **admin:** privilege exception not thrown on member detail ([b561227](https://github.com/CESNET/perun-web-apps/commit/b561227da20c93bdd338ea20732307600fb6338a))
* **admin:** rename role assignment types ([49d77dd](https://github.com/CESNET/perun-web-apps/commit/49d77ddb2ed8151dece065ffebb01c9fb6a5115e))

## [14.3.1](https://github.com/CESNET/perun-web-apps/compare/v14.3.0...v14.3.1) (2023-11-07)


### Bug Fixes

* **admin:** bulk application approve/reject error handling ([17a5da9](https://github.com/CESNET/perun-web-apps/commit/17a5da973613f04f5e62f0be1eb2ba710eb16380))

## [14.3.0](https://github.com/CESNET/perun-web-apps/compare/v14.2.1...v14.3.0) (2023-10-10)


### ⚠ BREAKING CHANGES

* **admin:** Removed 'Organizations', 'Groups', 'Resources' and 'Facilities' from the admin version of the User section. Refer admins to 'Accounts' and new 'Assignments' page for info on entities

### Features

* **admin:** attribute definition detail redesign ([dadb546](https://github.com/CESNET/perun-web-apps/commit/dadb546c6374677b23b87f710dc35e00f4034773))
* **admin:** change GUI to incorporate moduleClassNames ([c7fad76](https://github.com/CESNET/perun-web-apps/commit/c7fad76e9971d3788060f18447f8488f26971b2f))
* **admin:** update User section Perun Admin menu ([fad1186](https://github.com/CESNET/perun-web-apps/commit/fad11862371440042c7e3b7f40564ce1e12657ca))
* **profile:** mfa categories uses namespace as key ([c670091](https://github.com/CESNET/perun-web-apps/commit/c670091be4cd0022ed78f1a6600b12613927641e))


### Bug Fixes

* **admin:** change usage of send/sent in en.json ([6d77db3](https://github.com/CESNET/perun-web-apps/commit/6d77db395f736b3ebc8cd8e97bcb7c6adf030a21))
* **admin:** display groups on recently viewed dashboard ([68ac514](https://github.com/CESNET/perun-web-apps/commit/68ac5143b2f72b1dba6cf3040bcd1f75522b88a6))
* **admin:** edit variable for sidemenu submenu active text color ([fb7ff10](https://github.com/CESNET/perun-web-apps/commit/fb7ff10e92c971bbee303221cdca83578e2760b9))
* **admin:** entity text color ([000d882](https://github.com/CESNET/perun-web-apps/commit/000d8824073c89b17f553abfbca77202ce7f7e33))
* **admin:** fix application form page spinners ([44910d0](https://github.com/CESNET/perun-web-apps/commit/44910d084cba59979fe40402e2a579d018ad3d47))
* **admin:** group membership manager can set group status/expiration ([a6d1b3a](https://github.com/CESNET/perun-web-apps/commit/a6d1b3a6755a773001f7e9e8acbd0b3d08b61e28))
* **admin:** use renamed html tag for application dynamic list ([1d1a359](https://github.com/CESNET/perun-web-apps/commit/1d1a359021fbca207025b965d669e1b77ed4ee1f))
* **lib:** hide logout alert ([aacc183](https://github.com/CESNET/perun-web-apps/commit/aacc183067f157381389364071c0ee34beaaf69c))

## [14.2.1](https://github.com/CESNET/perun-web-apps/compare/v14.2.0...v14.2.1) (2023-10-05)


### Bug Fixes

* **admin:** use renamed html tag for application dynamic list ([58ee258](https://github.com/CESNET/perun-web-apps/commit/58ee25866429ffa9210c64421993a79b64589203))

## [14.2.0](https://github.com/CESNET/perun-web-apps/compare/v14.1.0...v14.2.0) (2023-09-29)


### Features

* **admin:** change GUI to incorporate moduleClassNames ([8353592](https://github.com/CESNET/perun-web-apps/commit/8353592b1da03cf703834a7f61b88a8e722a987c))


### Bug Fixes

* **admin:** entity text color ([dcfbdcd](https://github.com/CESNET/perun-web-apps/commit/dcfbdcd67be1ccc6e0dca0b2934b47c86c02548a))

## [14.1.0](https://github.com/CESNET/perun-web-apps/compare/v14.0.1...v14.1.0) (2023-09-27)


### Features

* **admin:** add bulk operations to applications overview ([391f340](https://github.com/CESNET/perun-web-apps/commit/391f3405f174956de61d5f0e6cbb267ac4591d56))
* **admin:** display also indirect managers ([48f433e](https://github.com/CESNET/perun-web-apps/commit/48f433ea94eedcd26af986a663a30203d80e7024))
* **admin:** jump onto specific page ([8f95c33](https://github.com/CESNET/perun-web-apps/commit/8f95c336c10ffb6d501529111876375e9ac5f224))
* **profile:** allow filtering by name and sorting on profile groups page ([1b9bba7](https://github.com/CESNET/perun-web-apps/commit/1b9bba766cb255c4fa88bd89178db64d9d1967b8))


### Bug Fixes

* **lib:** align items in attribute value list to the left ([fa4680e](https://github.com/CESNET/perun-web-apps/commit/fa4680e22eec278d2353cd5302af9b8989a1398f))
* revert initializing colors during runtime ([cfa074a](https://github.com/CESNET/perun-web-apps/commit/cfa074a528952219b7106942e33013c1b51b5f7e))

## [14.0.1](https://github.com/CESNET/perun-web-apps/compare/v14.0.0...v14.0.1) (2023-09-15)


### ⚠ BREAKING CHANGES

* **profile:** Added new config option "consolidator_url_cert" in order to support different URLs for consolidator with federated and certificate authentication.

### Bug Fixes

* **profile:** support adding both fed and cert identity types ([f9b66c0](https://github.com/CESNET/perun-web-apps/commit/f9b66c0fa4db940769ae440c37aba43aa9ff4f71))

## [14.0.0](https://github.com/CESNET/perun-web-apps/compare/v13.4.0...v14.0.0) (2023-09-11)


### ⚠ BREAKING CHANGES

* **profile:** The consolidator_base_url config property needs
to be changed to consolidator_url and include the complete url.

### Features

* close session expired dialog in all tabs ([316df47](https://github.com/CESNET/perun-web-apps/commit/316df4762ff6d2c0fdb3b94e8f743ea12c9c387c))
* **profile:** consolidator config uses full url ([0df39c2](https://github.com/CESNET/perun-web-apps/commit/0df39c2d5e7e269bc801587a058470d4c2360131))


### Bug Fixes

* initialize colors from instance config ([21ef021](https://github.com/CESNET/perun-web-apps/commit/21ef02165455bfef3e84331648d9dc5bc9f15a88))

## [13.4.0](https://github.com/CESNET/perun-web-apps/compare/v13.3.1...v13.4.0) (2023-09-04)


* **admin:** added support for new role ([a4579db](https://github.com/CESNET/perun-web-apps/commit/a4579db9d2f2ca115400658940c0dd24e8e7acfd))
* **admin:** align input in create relation dialog ([a242a6a](https://github.com/CESNET/perun-web-apps/commit/a242a6a26b376e6d786478c68e5d3bfea51e81c5))
* **admin:** buttons authz on member pages ([bfbe9a2](https://github.com/CESNET/perun-web-apps/commit/bfbe9a2b0eca2b814af336ced2b21107ca09b76d))
* **admin:** check disabled and hidden dependencies for application items ([b30ce1e](https://github.com/CESNET/perun-web-apps/commit/b30ce1e36d770e6ce2436a6c42486717f5ea0267))
* **admin:** customizable items per page in dashboard tables ([f2c656c](https://github.com/CESNET/perun-web-apps/commit/f2c656ccbd80d48e9846169bfcdc9ec1a7d23c65))
* **admin:** disable member invitation ([3d95de8](https://github.com/CESNET/perun-web-apps/commit/3d95de83a3cf16ebbf2adee1638e3613c31149dd))
* **admin:** expand section ([fb8d9cd](https://github.com/CESNET/perun-web-apps/commit/fb8d9cd6fc4799a398d5b3d032af074c43bf7ea6))
* **admin:** hide empty expandable sections ([729d9ed](https://github.com/CESNET/perun-web-apps/commit/729d9ed9f6cac95510809cd606fa8ffda01257ad))
* **admin:** indirect membership ([2fbd165](https://github.com/CESNET/perun-web-apps/commit/2fbd16532df954982c5a5a56a7d632d02db1c2f0))
* **admin:** key 'resources' duplicated in localStorage ([d27a0e2](https://github.com/CESNET/perun-web-apps/commit/d27a0e2e310070f05cf4dedd7827f38b423521e4))
* **admin:** missaligned icons in action-buttons ([8682866](https://github.com/CESNET/perun-web-apps/commit/8682866e0f05ae447a2428c76c1153bf7f5044d3))
* **admin:** modify user without role message ([aa73beb](https://github.com/CESNET/perun-web-apps/commit/aa73beb654bcee36d8967ab175961373682042f7))
* **admin:** notifications sending enabled control changed to toggle ([1eea89f](https://github.com/CESNET/perun-web-apps/commit/1eea89f1cdc400e97e07a397fed77780780fd5c6))
* **admin:** remove outer border at manageable entities ([5fe6804](https://github.com/CESNET/perun-web-apps/commit/5fe6804c2ea56e43e933fb5a79b6f18b9e6f0028))
* do not filter attributes with empy value ([93fdcbd](https://github.com/CESNET/perun-web-apps/commit/93fdcbd3916e9f8d62db9a19e496703d433ab839))
* open application in the new tab ([6fc47a5](https://github.com/CESNET/perun-web-apps/commit/6fc47a5ea1701379f229064f3db522f038a8a92a))
* **profile:** navigation working properly in mailing lists settings ([1df1e65](https://github.com/CESNET/perun-web-apps/commit/1df1e65d9164aa38da0f041636643b3a1e01bd8e))

## [13.3.1](https://github.com/CESNET/perun-web-apps/compare/v13.3.0...v13.3.1) (2023-09-04)

## [13.3.0](https://github.com/CESNET/perun-web-apps/compare/v13.2.0...v13.3.0) (2023-08-16)


### New features and notable changes

* **admin:** added tree view also to member-groups page ([193a508](https://github.com/CESNET/perun-web-apps/commit/193a50893a90bf0fe93ce88c79c1ec5dedc170f6))
* **admin:** replaced old table export ([70ca49d](https://github.com/CESNET/perun-web-apps/commit/70ca49d4a7773f7ca4b0ce7fa7e9c01fc58d6187))
* **lib:** password reset on profile opens modal window ([1deaa02](https://github.com/CESNET/perun-web-apps/commit/1deaa0265626366fa15d8f83647fe77711a70fba))
* remove access for service-accounts ([d29bb93](https://github.com/CESNET/perun-web-apps/commit/d29bb9386b04678031a9dc4679d37e200bae4685))

## [13.2.0](https://github.com/CESNET/perun-web-apps/compare/v13.1.0...v13.2.0) (2023-08-10)


### ⚠ BREAKING CHANGES

* **profile:** In defaultConfig.json for user-profile, 'authentication', 'mfa', 'anti_phishing', and 'accountActivation' values were added into displayed_tabs.

* **profile:** authentication management ([572a7ed](https://github.com/CESNET/perun-web-apps/commit/572a7edba5c4cf8dc5465bdfb2d36ba83042071d))


### New features and notable changes

* **admin:** attribute operation can be globally critical ([deb1778](https://github.com/CESNET/perun-web-apps/commit/deb1778e1eec74a261dbdbfd33ac6331e5d59e0f))
* **admin:** displaying children of items on entity detail ([a015743](https://github.com/CESNET/perun-web-apps/commit/a0157437ae7e3882a84affa0c296aa7c37b76a02))
* **admin:** last successful propagation ([32d167a](https://github.com/CESNET/perun-web-apps/commit/32d167a34b5dc49a0fc36d57576747f00ead5992))
* rounded design for components ([58998a1](https://github.com/CESNET/perun-web-apps/commit/58998a15842df7a8d3a3da4ece33dfcda0919e2a))
