Upgrade notes

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
