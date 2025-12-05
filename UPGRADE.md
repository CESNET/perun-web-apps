Upgrade notes

## [20.4.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v20.3.0...v20.4.0) (2025-12-05)


### Features

* include base url on create sponsored member requests ([2de1345](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2de1345b38e6258b36570e8c9fa4ff391732849c))


### Bug Fixes

* **pwdreset:** error notice on wrong namespace pass reset ([557d55c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/557d55ce898aa0514d46f226deff124951150ff8))
* **pwdreset:** race condition on wrong language ([35eb2cd](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/35eb2cd374868aa2912463e3a2435da76ddeecd6))

## [20.3.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v20.2.0...v20.3.0) (2025-11-28)


### ⚠ BREAKING CHANGES

* If the message is rewritten in instanceConfig (or other namespaces are included), make sure the minimum is updated

### Features

* update password help messages in defaultConfigs to match new length minimum of 12 characters ([0c306e9](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0c306e9a4f8d5bf7de8e9dc6968d8c9b81ddafa0))

## [20.2.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v20.1.0...v20.2.0) (2025-11-21)


### Features

* include login to backend password checks ([ca1786c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ca1786c5f09c92e1bf69cf8be1281c792e4f0a4a))

## [20.1.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v20.0.1...v20.1.0) (2025-11-04)


### ⚠ BREAKING CHANGES

* new config properties `gui_settings_panel` and `allow_show_id_setting`
which control the display of the new top panel; defaultConfig(s).json are set in a way
you probably want it

### Features

* move GUI settings to a header drop-down panel ([46df5bf](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/46df5bf9c4112c2bc20b0480a26bf591d7f45712))
* **profile:** new page for orcid account ([ca02a62](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ca02a620b896cd845a885a11f7731675660299b7))


### Bug Fixes

* config tweaks ([50bf772](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/50bf77255d723674478d94dc5f387395ebac73d2))
* **profile:** correctly mark required properties in orcid config ([744fd10](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/744fd108f79c8ee3b4a7aaf4794c6717547776dd))

## [20.0.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v20.0.0...v20.0.1) (2025-10-13)


### Bug Fixes

* **admin:** allow read-only roles to copy the invitation link ([edba66a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/edba66a0491993f6aa6ea1115d548d50fe99d71e))
* **admin:** display modified/createdBy application values when name not available ([73aa2b2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/73aa2b2f8d688737f96a5e997f5dc692c8b434e3))

## [20.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v19.0.2...v20.0.0) (2025-10-10)


### ⚠ BREAKING CHANGES

* moved my profile section of admin GUI to user-profile
app
* to build, node versions now have to be ^20.19.0 || ^22.12.0 || ^24.0.0 (tested on ^24), should be covered by changes to `pom.xml`

### Features

* move myProfile functionality to user profile application ([5b2a4b9](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5b2a4b93ae3fee334a95d084d6cde779053e3e20))
* upgrade Angular to version 20 along with its required components as well ([560f622](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/560f622549baa9bb8db6f50838d5d2f047fe4b36))


### Bug Fixes

* **admin:** correctly display modifier name in application detail ([32a103c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/32a103c0b39d7c509197edd82f41a06e14c84e5a))
* **admin:** facility configuration guide correctly retrieves required service attributes ([1ce19f5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/1ce19f5e10d4b66a3b14d3a2277056d98d003631))
* **admin:** get local cypress E2E test functional again ([b909e8d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b909e8dab1609af39872dfdb657444ab77db29a8))
* **admin:** side menu artefact line ([302c2fc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/302c2fc6dd9ba7e8ff9dba80ceaf982977912cfd))
* do not track by whole object in for loop in templates ([f50fd11](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f50fd11af354889570e26c733bd6df24a916e57e))
* doduble loading on user profile ([f415a2a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f415a2ae866afcc1dac3c3d5bfd1c526668840eb))
* **profile:** adjust loading indicators on groups and vos pages ([eef3c2e](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/eef3c2e60898eedaba3b26ea51c5b7d32cf4dd2b))

## [19.0.2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v19.0.1...v19.0.2) (2025-09-04)


### Bug Fixes

* **admin:** correctly display consents column on member lists ([0bd5b22](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0bd5b22ceaf4b01f98ea89e77ea693e5c83b7b02))

## [19.0.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v19.0.0...v19.0.1) (2025-08-19)


### Bug Fixes

* **lib:** fix roles not displaying with enable_sponsorhips ([37e3d58](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/37e3d58ad2fe157f673a78ec5b3e0b179f3568f6))

## [19.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.14.0...v19.0.0) (2025-08-01)


### ⚠ BREAKING CHANGES

* all servicesPackage functionality removed

### Features

* **admin:** add option to remove associated objects when removing services ([fb6e3ab](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/fb6e3abbfd741c51f779446c2b870f7589610956))


### Bug Fixes

* **admin:** correctly convert attributes to unique when updating the definition ([7347279](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/7347279bf021f0de1788ad17af83ed2671381028))
* **admin:** creating new preapproved invitation notification no longer mangles layout ([982fc83](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/982fc83d35586d77fe9f3c56e981867e66e2e8a7))
* **profile:** missing translations for viewing list/map attribute values ([b114fcc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b114fcc0d842f1c4f59b380ffecfb604cb5b1a2e))


### Others

* remove ServicesPackage ([71368be](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/71368be0e0f98623775f0f63bd123eaf1804109c))

## [18.14.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.13.0...v18.14.0) (2025-07-07)


### Features

* **admin:** group creator role ([e0035aa](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e0035aa15a4f591ef01aff8afb6daaad865d23ef))


### Bug Fixes

* **admin:** correctly match keys and values in entityless attributes ([4caacdc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4caacdc5ea9877f4232c83d4e260e0495e6911e4))
* **admin:** fix who can view member/parent VOs ([135de7f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/135de7fb8f40a6b88e5e0a40f9496a859ff3cf02))
* **admin:** reset page of paginated lists to 1 when filtering ([5e1a5d5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5e1a5d5d3973d4ed482012e445a2053e90687cb0))

## [18.13.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.12.0...v18.13.0) (2025-06-23)


### Features

* **admin:** improve propagation display ([2e33b2c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2e33b2c63c83e828b991b0c61546ad1beb5220c7))


### Bug Fixes

* **admin:** correctly display preapproved invitation for a sender no longer part of VO ([956ab41](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/956ab418fd7dc5ebb5ca5db48bfcf801766ecea7))
* **admin:** redirect url correctly saves when sending multiple preapproved invitations ([8f26c2b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8f26c2b7d5d23d497d5d697dfdcd2148e1606044))

## [18.12.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.11.0...v18.12.0) (2025-05-07)


### ⚠ BREAKING CHANGES

* **admin:** new `enable_sponsorships` config property enabling sponsored members logic, which is now disabled by default

### Features

* **admin:** make sponsor functionality configurable ([6c671e4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/6c671e4a3f9080876714f88fb71c720598187260))
* **profile:** adjustments to change name dialog ([d2803bf](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d2803bf9d86f54022b140436fd854c53c1b30285))

## [18.11.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.10.0...v18.11.0) (2025-04-23)


### Features

* **admin:** allow choice to propagate banned members in service ([c740928](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c740928ae3c77f0e2680d2b512fee20be3bb3a87))
* **admin:** display a different icon for MEMBERS of both direct/indirect origin ([48abcb1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/48abcb1c1c843d567c277d9481e3d013aa01817c))


### Bug Fixes

* **admin:** checkbox app form item help/error labels can be edited ([6a0b5d1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/6a0b5d173f29f38d206422c4a3d4ab15cad1223b))
* **admin:** only focus global search with `/` when nothing else is focused ([4fe9a21](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4fe9a21775b4a8192abc0b5faf05f6eee3d8ea10))

## [18.10.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.9.0...v18.10.0) (2025-04-02)


### Features

* **admin:** add applications page to PERUNADMIN user detail ([c20705b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c20705bec6bd6083a1724778e25515a033765ee3))
* **admin:** allow expiration by vo/group rules when changing member status to active ([118e1f7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/118e1f717e98c4bfbfa01f4e928957a168781359))


### Bug Fixes

* **admin:** do not check for service users when anonymizing service user ([38dc064](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/38dc064ef5889fe56226761f3ab4990b32947f5f))
* **lib:** fix wrong translate path for issue report success ([c8eab3f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c8eab3fc6818b496ad666b1cbbd944472c7c9c24))
* **profile:** allow email, name and organization change only from IDP UES ([e863db9](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e863db96dab0e8d3d8ffc65ffa2ecf6facc732c7))

## [18.9.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.8.0...v18.9.0) (2025-03-10)


### ⚠ BREAKING CHANGES

* **admin:** new `notification_tags` config property

### Features

* **admin:** add s3-json as possible service destination ([ca06673](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ca06673318977abde0a5f6689422dfcf0aa4ea6e))
* **admin:** allow displaying subgroup applications on group applications page ([fad7825](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/fad782554793ec7dc417840d9b8b9381853945e2))
* **admin:** notification tags rework ([2534ebc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2534ebc26b7c37b02f390f9cc8e1503c117b184a))
* allow customization of ID column in tables ([59d4781](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/59d4781338567587f683a8fcd573512d4790ec63))


### Bug Fixes

* **admin:** component caching ([6b3f9c4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/6b3f9c429dc07a32cc85faef8f36ca4587a93729))
* **profile:** extending VO/Group membership now opens new tab ([8facc68](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8facc689781f6eb27eaa64e9702a54d32e787539))

## [18.8.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.7.0...v18.8.0) (2025-02-21)


### ⚠ BREAKING CHANGES

* **admin:** set new `show_search` config option to true to enable global search in the Admin GUI app. Use `globalSearch_String_policy` on the backend to configure availability of the feature

### Features

* **admin:** corrected group member attributes set up ([20af3dc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/20af3dc29607ded6a6220c30f4de6a426ffb6fce))
* **admin:** global search ([59dcd2b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/59dcd2b45da376e1bc9c0bf186c3cd286f9771c9))

## [18.7.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.6.0...v18.7.0) (2025-02-05)


### Features

* **profile:** default selected value when changing user basic attributes ([a276f54](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a276f54e4b2d81a7213bb4917a5ff06c4582cbf4))


### Bug Fixes

* **admin:** added route guard to service-account pages ([676bcb8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/676bcb8bde055867c48b0ebb65f980aa71ca4e2b))
* hide member IDs for non-PERUNADMIN ([8be53f4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8be53f4b9db302e38badc6f6a34545a5c2dcccec))
* **profile:** quota change visual adjustment ([bbb1344](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/bbb13444bc49a83dd5177687560e890348565435))

## [18.6.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.5.0...v18.6.0) (2025-01-22)


### ⚠ BREAKING CHANGES

* new `other_apps_custom` config property

### Features

* **admin:** display all rpc errors when copying application form ([cf19878](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/cf1987859842486442e27b16f8c8e2e9396179f9))
* enable custom other app links ([e96e4be](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e96e4be3f9ce0d6420be282740b60735e5a676d7))


### Bug Fixes

* **admin:** anonymize dialog infinite loading ([18fde67](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/18fde67657c3155f24cf22d6682325537194c997))
* **admin:** trim search strings ([c3d24da](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c3d24da875bddac89ca76a39ea76c4b0891e7ae1))

## [18.5.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.4.0...v18.5.0) (2025-01-09)


### ⚠ BREAKING CHANGES

* **admin:** removed security teams and related functionality

### Features

* **admin:** check for app items having destination attr assigned ([66de388](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/66de38832c8e86f3d17fe9f6e7010fd7502ddcb7))
* **admin:** redirect preffered email change to user profile ([2609f1b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2609f1b014146c4bcfee5ad4c97f78b42f2b113a))
* change and unification of regex to validate mails ([326f3bd](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/326f3bd5a1c05ee99e095d9164d760fe29765486))
* markdown files with configuration specification ([59422c2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/59422c222c2641a3683a14da940a14e912331938))


### Bug Fixes

* **openapi:** fixed typo in manager name ([c2c9a86](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c2c9a866fa59c006c11bb9b6568dadcd5a3aa56d))
* **publications:** selecting publication would select all items on import ([468342f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/468342f83431295a759b0ee2558ec01537316237))


### Others

* **admin:** remove security teams, blacklist and security admin role ([4fbebac](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4fbebac99146e3e1528a35f409d223ca7eaae336))

## [18.4.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.3.0...v18.4.0) (2024-12-16)


### Features

* **admin:** `Tasks` admin page ([c6e119d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c6e119dedef0aa159a4661ebfd9390d13c863a8b))
* **admin:** check whether application can be approved ([4ab87b3](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4ab87b3524e262e84a41e686512dbdf45f1786c1))
* **admin:** organization membership manager role ([928dfec](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/928dfec28508c049460505c26879e4e132fb4bdb))


### Bug Fixes

* **admin:** certificates page infinite loading fix ([8d112e7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8d112e76ea18260d80959e9a47708aa10280391d))

## [18.3.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.2.0...v18.3.0) (2024-12-13)


### Features

* **admin:** check whether application can be approved ([e02f097](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e02f097183fc6be353433eddd595cefd2102355f))

## [18.2.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.1.0...v18.2.0) (2024-11-21)


### Features

* **admin:** add url-json as possible service destination ([17671de](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/17671de7092ee847e9d5739476c0ea5c3f62e28d))
* new export login columns ([0a3765a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0a3765a45c93cdd3370b2785e172924b0b177f23))
* **profile:** change personal data dialogs ([078444e](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/078444eabd32f424c84956a389be8ec8a7a0158a))
* warnings and fixes when disconnecting last owner from service accout ([b1dccf5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b1dccf520cc0f4f85e7fe36ae347cb39ae19a108))


### Bug Fixes

* **admin:** correct regex on service account mail validation ([d8d9ef2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d8d9ef2469866f798a4105d9797672c8e63b22f0))

## [18.1.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v18.0.0...v18.1.0) (2024-11-08)


### Features

* **admin:** add s3 as possible service destination ([b05e2a3](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b05e2a30f783175c4557e8db95e9cac42798dc0b))
* **admin:** tooltip for disabled create facility button ([ccf9e84](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ccf9e84a01bb410d9710f0dd8aa5a0bf428625cd))

## [18.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.10.0...v18.0.0) (2024-10-24)


### ⚠ BREAKING CHANGES

* new export limit is by default 1000 items
* new config property 'export_limit'

### Features

* **admin:** add "expired VO members" into service dialog ([5758310](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5758310b0505e72897b6819245838128ec55aa8c))
* **admin:** disable VO create button on no auth ([d1e36a3](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d1e36a3a9d22978985948288c19a438009e075c5))
* **admin:** hide member groups role and assignment filters ([8f30511](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8f3051161093ccec2911ca57f3d3750dbfcb76a5))
* **admin:** new role EXEMPTEDFROMMFA ([2eca7ae](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2eca7ae239809ccce52b545dec1113b01f99e378))
* **admin:** propagate expired vo members ([273604f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/273604fa8297c6ff6f50cb605c9958eed6915e38))
* **admin:** resend preapproved invitation mail ([55327e6](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/55327e696d5043d88589b24f78f9128bd0ea1646))
* **admin:** ux text improvements on preapproved invites ([0a8d161](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0a8d161f2fcf1856f1536da960e9086a90aa40b0))
* table export upgrades ([0deb7b8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0deb7b8b4766d5b652ffa16df702ee4e186a7280))


### Bug Fixes

* **admin:** filter mail types from resend notification dialog ([753cae8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/753cae8d29b508aed00e169505644dba9648feb9))
* **admin:** restore tokens ([4f223fb](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4f223fb1a3aa3bcb66a78de554450b61f238b0f6))

## [17.10.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.9.0...v17.10.0) (2024-10-12)


### Features

* added upper limit for expiration date for invite member and extend expiration date dialogs ([5d5af1e](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5d5af1e1adda43b13861a987ed535729c64510a9))
* **admin:** invitation detail page ([089d463](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/089d463dbee52928f944e2cee5fd9a224339ce51))


### Bug Fixes

* **admin:** better tooltip on indirect member manipulation ([2cd5051](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2cd5051b3717344134282b81df0ad35a301c866b))
* **admin:** duplicated invitations manager methods ([4338e60](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4338e6022f4eebe6e1992a84ae7d18fb599a5262))

## [17.9.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.8.0...v17.9.0) (2024-09-26)


### Features

* **admin:** prefill preapproved invitation notification subject ([e9e7ce4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e9e7ce4b2ea74b07453041b6560ac38e52c3f9d3))


### Bug Fixes

* **admin:** group relations authorization ([5a8c67e](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5a8c67e635c856021b2546d3e8f25dd1342fa2c5))

## [17.8.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.7.0...v17.8.0) (2024-09-20)


### Features

* **admin:** indicate that application was approved via preapproved invitation ([c75e09d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c75e09d3066281319eefbf51b1a7e9ba5d50dcc2))

## [17.7.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.6.0...v17.7.0) (2024-09-16)


### Features

* **admin:** display a warning when removing last VO/Facility admin ([a5b64ca](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a5b64ca6d8b85221e3e72ea9a4ece97782d4a3c2))
* **admin:** search vos by short name ([9b2a8da](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9b2a8da88a90c28935aac2b265165f056c571d13))


### Bug Fixes

* **admin:** change html check methods to POST ([f045df0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f045df0cbaa4632b42321a8a3932ea3625265882))
* **admin:** correctly use label instead of placeholder text in invite dialogs ([4c8a99a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4c8a99a462ef87b9140b63bb1075a83eb33d6a7a))

## [17.6.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.5.0...v17.6.0) (2024-08-28)


### Features

* **admin:** extend invitation expiration date ([a16b2d4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a16b2d4750c67282f7500462378a1e2ed2d6771e))
* **admin:** revoke invitation functionality ([6df3eda](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/6df3edad939c998039047a6e87bb7304b920af77))


### Bug Fixes

* **admin:** additional changes squash later ([3501c80](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3501c806d39dcfc6957338bb49d82f30e3c70315))
* **admin:** include whole group object in entity-storage service ([5f53c3b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5f53c3b6fa783cd34edf27a13709fc2c8c4f1469))
* **admin:** nav back on cached components clashing with entity storage service ([d9ed5ee](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d9ed5ee591265a196833a8e9a0b585bcacc973d0))
* **admin:** preapprove invitation notification ([dd991b8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/dd991b8f9b9bdb0774685d94227e1a848f4f2eea))

## [17.5.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.4.0...v17.5.0) (2024-08-15)


### Features

* **admin:** display number of assigned services in OK state resources ([94d09c5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/94d09c5ec978fc897941925d9eee1a20c6d04870))
* **admin:** invitations page ([aaffbe8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/aaffbe869029cbda9d4283d21056da83f332f02f))


### Bug Fixes

* **admin:** correct times in resource states table ([3f885f5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3f885f5f99b716914dfde1feec212a5fa4963cbe))

## [17.4.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.3.3...v17.4.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* **profile:** Configuration properties `enable_security_image`,
`security_image_attribute` and `enable_security_text` were removed.
The security text section is now always visible when the anti-phishing
page is available (`anti_phishing` listed in `displayed_tabs`).

### Features

* **admin:** dialog windows to invite preapproved members ([2ca1a84](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2ca1a8441a81f51c10326578d1a1ea180e67be66))


### Bug Fixes

* client side table selection ([04f5596](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/04f5596e27cd133c64eeb6cae5ef30c48872ba04))
* long notification title overflow ([9324ee7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9324ee781f7a8eda4b5a2fb4cc35ca9410a3eedf))
* **profile:** remove security image ([f31f633](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f31f633632736e8bc3add0f7c7d01d5f5824eff0))

## [17.3.3](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.3.2...v17.3.3) (2024-07-18)


### Bug Fixes

* **pwdreset:** password reset remove leading whitespace ([dce1596](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/dce15966feb7ceb20208f2bd2149a8440c508cc8))

## [17.3.2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.3.1...v17.3.2) (2024-07-04)


### Bug Fixes

* **admin:** vo_hierarchy_prevent_cycles ([90340ab](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/90340ab23712b57e24c67817b4c93da2a2e6e78f))

## [17.3.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.3.0...v17.3.1) (2024-06-25)


### Bug Fixes

* **admin:** broken button layout on group detail ([d3ff654](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d3ff65491a6f02f03eea891e31621196d49e26ea))
* **admin:** entity service providing correct id on nav back ([78d2181](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/78d2181ca92f1b177d05921167be48d13170cf03))
* **admin:** group relations missing initial fetch ([582c075](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/582c0758d9f0475ef13160a87ce8c61913795066))
* **admin:** missing vo id in the vo member component ([0d4cba0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/0d4cba0bf302e10da5a320e17d94b119bbff7508))
* **pwdreset:** edit action buttons ([e296af8](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e296af80fe081ac0d2caf3775eb1e15e5679cd95))

## [17.3.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.2.0...v17.3.0) (2024-06-05)


### ⚠ BREAKING CHANGES

* **pwdreset:** "config" property now needs to be set in instanceConfig for bug reports in password reset, same as in the Admin GUI app

### Features

* **admin:** copy hierarchical group name ([2137c3d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2137c3d7e5526a56ab71bc021c88b4f0e1e418dd))
* **admin:** search for members also by member attributes in searcher ([014c403](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/014c403a506382882532e4643e0a5ca23c120db3))
* **pwdreset:** options after reset call failed ([f99661d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f99661d743a0c87501bfc2af8d8b0348e68c3c30))


### Bug Fixes

* **admin:** cache everything in application form ([9f0fa40](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9f0fa40e72f3cd0f659944d3e8783031998fea13))
* **admin:** data loading after the back button ([fb11590](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/fb11590fa58b4dcf186c920d25450dfe32a5373e))
* do not refresh gui after step-up ([f89df9e](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f89df9e0449534723807df1dc7af0f072f1a0210))

## [17.2.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.1.0...v17.2.0) (2024-05-23)


### Features

* **admin:** use params in body versions of chosen methods ([1aebeea](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/1aebeeaf21c22238abb7a6498aba92ff9ded4ff4))


### Bug Fixes

* **admin:** data persisting in dialogs after canceling ([39ee05d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/39ee05d34a10da13fd1fd7be0480cd5e3e372253))
* **admin:** new sponsor role ([12c5f43](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/12c5f4306a2120df772d4636b001ed8ff20f6cc9))
* **admin:** searcher issues ([846d239](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/846d2394b86b567aacc99f4c870c749d46c9cf9d))
* **admin:** wrong disabled tooltip on already member ([2e2532a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2e2532abda1be865119d37a5f5e18ea81dcb23e0))
* revert problematic offset changes ([d10cc0d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d10cc0d100b85da41ea2b0c85f916a66ffeb0121))

## [17.1.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.0.1...v17.1.0) (2024-05-10)


### ⚠ BREAKING CHANGES

* **admin:** new role 'SERVICEACCOUNTCREATOR'

### Features

* **admin:** check whether notification mail text filled ([96683a4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/96683a432fe18cf6c2cc14d2f436a20c549f5828))
* **admin:** new role service account creator ([e80d31f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/e80d31f46dae7b3ff533d678b5719677c59b6e49))
* ban manager roles ([9ed34b2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9ed34b27fd79f7bfe0eaba3c19793fad92037126))


### Bug Fixes

* **admin:** allow to select only existing extSource when adding identity ([b37d2b7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b37d2b78df88d6ca9b9c21a4bddf861f4fcd50bf))
* **admin:** fix issues with applications export ([a65a0a7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a65a0a7776353694571636ef784143895e58e498))
* **admin:** fix member applications showing applications from whole vo ([d1ed176](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d1ed1760eb120091767f11980f2a060b311c8364))
* **admin:** improve create group relations dialog ([63bbb80](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/63bbb80bdb137952734fad34cbcaaea696d97a94))
* **admin:** improve refreshing of data for all cached components ([3d3c730](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3d3c730b959c3d58882aa4f914eba353ef00213c))
* **admin:** refresh application data in components restored from cache ([ce72539](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ce72539771f9efa3957fc8f28c9b1a77049431a5))
* propagate the backend offset to the frontend paginator for the... ([a3747a7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a3747a76a8751639349e9889681978b3b0b05e27))
* **pwdreset:** display request invalid notification ([b34d839](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b34d839c5c2c5fe69ce3eb59b70054c86873b9c3))
* step up infinite loading on firefox ([8f5286b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/8f5286b09cf3c9d53c73cd1d7fa7ddb360345c6d))

## [17.0.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v17.0.0...v17.0.1) (2024-04-17)


### Bug Fixes

* **admin:** allow to select only existing extSource when adding identity ([66f82b0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/66f82b0de3c31d8431028a6ab84c83f0020c16b4))
* **admin:** fix member applications showing applications from whole vo ([cad5702](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/cad5702082c53663d3188bef6b57d007f0b8b05f))

## [17.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v16.0.0...v17.0.0) (2024-04-16)


### ⚠ BREAKING CHANGES

* **admin:** all user tables are now by default sorted by first column (ascending)
* new 'step_up_available' config option, set this to false to disable step-up dialog (e.g. when proxy doesn't support MFA)
* Admin-gui defaultConfig new property: `header_label_en`.
Password-reset defaultConfig new properties: `auto_service_access_redirect`,
`proxy_logout` and `log_out_enabled`.

### Features

* allow configuration of step-up dialog ([84d77b6](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/84d77b6d39960040c7b4c089102d56ad715ddc90))
* publications added to appType enum ([31307d1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/31307d16a09f83e2eb8fb5ac576e059ea6ff39a5))
* update openapi ([36c3e86](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/36c3e86fc89ec19eaf2c533105a38cfb02d9dbe4))


### Bug Fixes

* **admin:** add caching to group relations page ([5138361](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5138361da0f996f97112425408c880f6245c9d9b))
* **admin:** add margin-top ([c2981d7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c2981d77d4808cfe45d5cf65959856373483aafb))
* **admin:** fix error notification when group form not exists ([01510c1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/01510c170a62922d21d9f064d5e4a3ff8dde276d))
* **admin:** sponsor optimization ([9b1991d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9b1991d4b820197ebead6cbff6adb5ceb0b2d7b8))
* avoid unnecessary session expiration when step up is NOT available ([a4321cc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/a4321cc155782464ab8954a7970cc9b185215bb6))
* login pages UI ([5c534a1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5c534a1bfcac3c2a0e883713cd0664149cf5971f))
* **publications:** fix import missing information ([d3fb4d5](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d3fb4d5416a8200fbb7c84701f7c656c061fd378))
* **publications:** remove moment usage ([2b56128](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2b56128c8ac0e962a304bb34897789cd69c83fbe))


### Refactoring

* **admin:** users list component pagination support ([6d883ed](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/6d883ed6707759edde5a311753b89fd025aad007))

## [16.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.4.2...v16.0.0) (2024-03-25)


### ⚠ BREAKING CHANGES

* remove old unused properties from instance configs on the instances where it is still in place
* **admin:** Visualizer functionality was removed from admin GUI.
* **pwdreset:** It is now possible to set optional config property `default_namespace` for password reset application.

### Features

* **pwdreset:** option to set default namespace ([485a363](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/485a36305443eb1ddc5f902e296f9a816b1e0f8c))


### Bug Fixes

* group list sorting failed when paginated ([6135732](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/61357323c261fb03b3c97314067bc203205bb996))
* **lib:** fix incorrect value assignment in membership expiration settings ([92c0ae7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/92c0ae71b8710ace086d9a9ff19adba1eace33b2))
* **profile:** inaccessible exception displayed on login as unknown user ([ca12e58](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ca12e58ee16da0c194bdd85f1bffc11680c74ff5))
* reworked links to other apps ([abb89ae](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/abb89ae9572ee7fd86bd1c470c6ba62336df5295))


### Others

* **admin:** remove visualizer and its dependencies ([bc7e1cd](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/bc7e1cd90d8b5a16dc4661be2fff0f8eab60ce09))
* delete unused config properties ([67abfea](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/67abfeab1fa63cab4c4b4cd628404267caf02f8c))

## [15.4.2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.4.1...v15.4.2) (2024-03-13)


### Bug Fixes

* group list sorting failed when paginated ([50adc7f](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/50adc7fd030e98d1451d70981ecb86d72ddaae6b))

## [15.4.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.4.0...v15.4.1) (2024-03-11)


### Bug Fixes

* **admin:** show also indirect managers fix ([3391432](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3391432fa70df373fd0c17d82fa49706c422a1c0))

## [15.4.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.3.0...v15.4.0) (2024-03-01)


### ⚠ BREAKING CHANGES

* **admin:** Run of `color-migration.js` script is required.

### Features

* **admin:** extended warning list of deleted items on group deletion ([d29d4b9](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d29d4b9c420215c86e95c5ec019b0f3dcc19c1cc))
* **admin:** use async html check for all places where we accept html input ([3c6afda](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3c6afda9ff23ae01841cfd76abf16486a7d12926))
* new components for handling HTML inputs including the warning that the input will be changed ([117a31d](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/117a31da69bfb3af7f70e01858f58dbb3bb29835))


### Bug Fixes

* **admin:** fix issues with roles page ([5f5dc0a](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5f5dc0a2f04e2edef1bb8e2ba1669d9d2d2e5ec2))
* **admin:** hide alert during data loading ([49d2ee1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/49d2ee18b5aaaa570bc38ea23aa601c96d7323ab))

## [15.3.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.2.0...v15.3.0) (2024-02-16)


### ⚠ BREAKING CHANGES

* **admin:** new config propery bulk_bug_report_max_items specifying
limit on displayed error messages in the bulk bug report

### Features

* **admin:** check for spaces at start and end of names ([2db25b2](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2db25b2a1d5c0cad24beccccfc9ec523d47f9ef2))
* **admin:** display warning label and app name also before login ([d96ad9c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/d96ad9c795c164e183c474389130aa6b8ce048ac))
* **admin:** partial success allowed on bulk operations with applications ([07c2c81](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/07c2c81581e0ba0dfe9cc82c66181f731796b2d0))
* **pwdreset:** add warning message ([c18db95](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c18db95fb7ff70301b0b3f3c222e7c65168ad167))


### Bug Fixes

* **admin:** application bulk operation dialog ui fixes ([f9f9f2c](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f9f9f2c9e3388dacc72f0994023d4b8d9b23b11a))
* **admin:** fix notification dialog inputs keeping information upon cancel ([084d078](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/084d078b54978b19cc5b27f8efe4409b992923cd))

## [15.2.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.1.0...v15.2.0) (2024-01-30)


### Features

* **admin:** enable to copy invitation link on the Members page ([5c79e13](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5c79e13188eaa9f1d51ee2c081f6158dd819dcfd))


### Bug Fixes

* **admin:** dead end sponsored member dialogs ([c3d9d83](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/c3d9d8358155202b05cf89b73dabe4589e8834cd))
* **admin:** hover in mdc-tables ([60577e1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/60577e1d70f783de01b16f46f24425f940f4430f))
* **admin:** show correct icon for service accounts on member detail page ([171a403](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/171a403a125d3cca4348742e8925a544a162b498))

## [15.1.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.0.1...v15.1.0) (2024-01-15)


### ⚠ BREAKING CHANGES

* **profile:** New property `auth_validity` for user-profile under the mfa has been created.
This property defines for how long MFA will not be required since the last valid MFA (only for MFA settings).

### Features

* **admin:** added uuid to facility/vo detail ([711a253](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/711a25318ba851ca0633c4da6e1a8e8dfabd8997))
* **admin:** allow html in checkbox form items ([cddfd26](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/cddfd2605527e517b08fc991830e50f2083ba5b3))


### Bug Fixes

* **admin:** disable services status operation buttons ([1660e46](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/1660e46ea93c11847caa60a9a8b5b1ad5ad23591))
* **admin:** fed attribute custom value not displayed until clicking ([956128b](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/956128b71fea88079650793b63b1a2e78c4bb08a))
* **admin:** fix service user filter to use attribute instead of string search ([51e02dc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/51e02dc64ec3cd9eebea9313c3361e631970e69c))
* **admin:** forbid managing embedded groups if item not saved ([cbb9ef6](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/cbb9ef6cadc0c8705edd9bf70f9a2e4ca5fdb8cc))
* **admin:** membership page fixes ([ad649cc](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/ad649cc333af8879652929c8e49168099ad2892e))
* **admin:** refresh cached data ([24625b7](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/24625b7a20ecb074f6fc423e11b6a7d6453e0552))
* **lib:** fix secondary text display in entity search select ([9c096e3](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9c096e3e2cc5c69ed9f63841dbb0efe5279ec203))
* **lib:** ripple overflowing icon buttons ([190f7ec](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/190f7eccc9b4b5be954499fbf40998dec8747269))
* **profile:** fix the setting of MFA and move the whole logic to step-up ([f3fbcaf](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/f3fbcaf1e8dedb1c1fef480cb295ec74cff4a275))

## [15.0.1](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v15.0.0...v15.0.1) (2023-12-11)


### ⚠ BREAKING CHANGES

* **profile:** New property `auth_validity` for user-profile under the mfa has been created.
This property defines for how long MFA will not be required since the last valid MFA (only for MFA settings).

(cherry picked from commit f3fbcaf1e8dedb1c1fef480cb295ec74cff4a275)

### Bug Fixes

* **profile:** fix the setting of MFA and move the whole logic to step-up ([4a0ee58](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/4a0ee58477fdebb727cc53fab0dd3944831ce71d))

## [15.0.0](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/compare/v14.4.0...v15.0.0) (2023-11-24)


### Bug Fixes

* **admin:** added missing loading indicator for application actions ([82ebf42](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/82ebf42dae6be17ca719069034a6b37d9f3b4c4d))
* **admin:** alignemnt of the sync icon ([badc9ed](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/badc9ed5d9e1dba000cda2cd478b94e89efcbafe))
* **admin:** display initial loading on managers and mempership pages in vo settings ([5fe86ee](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/5fe86ee63b56dc9ef44717a0bce7d638d7e58710))
* **admin:** fix resources state page ([2a096aa](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/2a096aa4d0cdfc12730cb3b367155af8f0f9c30f))
* change references from GitHub to GitLab ([8372335](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/837233503fced58eb88e6defd64ac02ce3a4e66b))
* empty commit to trigger first GitLab release ([b0d1dbf](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/b0d1dbf0328aa77b25e255af5c543582e9e29c3e))
* **profile:** dynamically translate breadcrumbs ([9a3d3b4](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/9a3d3b42ac56933a0ba0fa3a95412a39eaedaff2))
* **profile:** removed unused calls ([3bc2260](https://gitlab.ics.muni.cz/perun/perun-idm/perun-web-apps/commit/3bc22605be9c76526b6615ae79b40dc02420d653))

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
