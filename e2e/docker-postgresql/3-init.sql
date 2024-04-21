-- init sequence in this session
SELECT nextval('ext_sources_id_seq');

/* insert attributes definitions
    1 - urn:perun:user:attribute-def:def:login-namespace:einfra
    2 - urn:perun:user:attribute-def:def:login-namespace:einfra-services
    3 - urn:perun:user:attribute-def:def:login-namespace:cesnet
    4 - urn:perun:user:attribute-def:def:login-namespace:mu
    5 - urn:perun:vo:attribute-def:def:aupLink
    6 - urn:perun:group:attribute-def:def:notificationsDefLang
    7 - urn:perun:facility:attribute-def:def:unixGID-namespace
    8 - urn:perun:resource:attribute-def:def:userSettingsDescription
    9 - urn:perun:resource:attribute-def:def:userSettingsName
    10 - urn:perun:user:attribute-def:def:preferredMail
    11 - urn:perun:user:attribute-def:def:login-namespace:dummy
 */
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:login-namespace:einfra', 'login-namespace:einfra', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'login-namespace:einfra');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:login-namespace:einfra-services', 'login-namespace:einfra-services', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'login-namespace:einfra-services');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:login-namespace:cesnet', 'login-namespace:cesnet', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'login-namespace:cesnet');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:login-namespace:mu', 'login-namespace:mu', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'login-namespace:mu');
insert into attr_names (id, attr_name, friendly_name, namespace, type, dsc, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:vo:attribute-def:def:aupLink', 'aupLink', 'urn:perun:vo:attribute-def:def', 'java.lang.String', 'Link to AUP of a virtual organization.', 'Link to AUP');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:group:attribute-def:def:notificationsDefLang', 'notificationsDefLang', 'urn:perun:group:attribute-def:def', 'java.lang.String', 'Notification default language');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:facility:attribute-def:def:unixGID-namespace', 'unixGID-namespace', 'urn:perun:facility:attribute-def:def', 'java.lang.String', 'GID namespace');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:resource:attribute-def:def:userSettingsDescription', 'userSettingsDescription', 'urn:perun:resource:attribute-def:def', 'java.lang.String', 'User settings description');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:resource:attribute-def:def:userSettingsName', 'userSettingsName', 'urn:perun:resource:attribute-def:def', 'java.lang.String', 'User settings name');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:preferredMail', 'preferredMail', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'User preferred Mail');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:login-namespace:dummy', 'login-namespace:dummy', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'login-namespace:dummy');


/* insert roles
    1 - Perun Admin
    2 - Vo admin
    3 - Group admin
    4 - Self
    5 - Facility admin
    6 - Resource admin
    7 - Top group creator
    8 - Trusted Facility admin
    9 - Resource self service
   10 - Resource observer
   11 - Group observer
   12 - Facility observer
   13 - Vo observer
   14 - Perun observer
   15 - Sponsor
   16 - Sponsor without rights to create
*/
insert into roles (id, name) values (nextval('roles_id_seq'), 'voadmin');
insert into roles (id, name) values (nextval('roles_id_seq'), 'groupadmin');
insert into roles (id, name) values (nextval('roles_id_seq'), 'self');
insert into roles (id, name) values (nextval('roles_id_seq'), 'facilityadmin');
insert into roles (id, name) values (nextval('roles_id_seq'), 'resourceadmin');
insert into roles (id, name) values (nextval('roles_id_seq'), 'topgroupcreator');
insert into roles (id, name) values (nextval('roles_id_seq'), 'trustedfacilityadmin');
insert into roles (id, name) values (nextval('roles_id_seq'), 'resourceselfservice');
insert into roles (id, name) values (nextval('roles_id_seq'), 'resourceobserver');
insert into roles (id, name) values (nextval('roles_id_seq'), 'groupobserver');
insert into roles (id, name) values (nextval('roles_id_seq'), 'facilityobserver');
insert into roles (id, name) values (nextval('roles_id_seq'), 'voobserver');
insert into roles (id, name) values (nextval('roles_id_seq'), 'perunobserver');
insert into roles (id, name) values (nextval('roles_id_seq'), 'sponsor');
insert into roles (id, name) values (nextval('roles_id_seq'), 'sponsornocreaterights');


/**********************************************************************************************************************
    VO MANAGEMENT
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test', 'User');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'test', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Vo-manager', 'User2');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'voManager', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Vo-manager-2', 'User3');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'voManager2', currval('ext_sources_id_seq')-1, 0);

-- insert test vo, vo_ext_source, vo application form and application form item
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db', 'test-e2e-vo-from-db');
insert into vo_ext_sources (vo_id, ext_sources_id) values (currval('vos_id_seq'), currval('ext_sources_id_seq')-1);
insert into application_form (id, vo_id) values (nextval('application_form_id_seq'), currval('vos_id_seq'));
insert into application_form_items (id, form_id, ordnum, type, shortname) values (nextval('application_form_items_id_seq'), currval('application_form_id_seq'), 0, 'TEXTFIELD', 'input-test');

-- insert vo members and groups
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'));
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq')-1, 1, currval('groups_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-group-from-db', currval('vos_id_seq'));

-- set User2 and User3 as VOADMIN of test-e2e-vo-from-db
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq')-1, 2, currval('vos_id_seq'));
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq'), 2, currval('vos_id_seq'));

-- insert vo attribute Link to AUP and set rights for this attribute
insert into vo_attr_values (vo_id, attr_id, attr_value) values (currval('vos_id_seq'), 5, 'www.test-link.cz');
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 5, 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 2, 'Vo', currval('attribute_policy_collections_id_seq'));
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 5, 'WRITE');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 2, 'Vo', currval('attribute_policy_collections_id_seq'));

-- insert vo for force delete and insert group and member to mock some relations
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-to-delete', 'test-e2e-vo-to-delete');
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));

/**********************************************************************************************************************
    GROUP MANAGEMENT
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test2', 'User4');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'test2', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Group-manager', 'User6');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'groupManager', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Group-manager-2', 'User7');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'groupManager2', currval('ext_sources_id_seq')-1, 0);

-- insert test vo, vo_ext_source
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-2', 'test-e2e-vo-from-db-2');
insert into vo_ext_sources (vo_id, ext_sources_id) values (currval('vos_id_seq'), currval('ext_sources_id_seq')-1);

-- insert vo members and groups
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-2, currval('vos_id_seq'));
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'));
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq')-1, 1, currval('groups_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-group-from-db-2', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));
insert into groups (id, parent_group_id, name, vo_id) values (nextval('groups_id_seq'), currval('groups_id_seq')-1, 'subgroup', currval('vos_id_seq'));

-- insert group application form and application form item
insert into application_form (id, vo_id, group_id) values (nextval('application_form_id_seq'), currval('vos_id_seq'), currval('groups_id_seq')-1);
insert into application_form_items (id, form_id, ordnum, type, shortname) values (nextval('application_form_items_id_seq'), currval('application_form_id_seq'), 0, 'TEXTFIELD', 'input-test');


-- set User6 and User7 as GROUPADMIN of test-group-from-db-2
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq')-1, 3, currval('vos_id_seq'), currval('groups_id_seq')-1);
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq')-1);

-- insert attributes and authorization
insert into group_attr_values (group_id, attr_id, attr_value) values (currval('groups_id_seq')-1, 6, 'en');
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 6, 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 3, 'Group', currval('attribute_policy_collections_id_seq'));
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 6, 'WRITE');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 3, 'Group', currval('attribute_policy_collections_id_seq'));


/**********************************************************************************************************************
    FACILITY MANAGEMENT
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test3', 'User8');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'test3', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'facility-manager', 'User9');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'facilityManager', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'facility-manager-2', 'User10');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'facilityManager2', currval('ext_sources_id_seq')-1, 0);

-- insert test facilities and consent hubs
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'est-e2e-facility-from-db', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db-2');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'test-e2e-facility-from-db-2', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-for-facility', 'test-e2e-vo-from-db-for-facility');

-- insert test resource
insert into resources(id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'test-e2e-resource-from-db', currval('facilities_id_seq'), currval('vos_id_seq'));

-- set users User8 and User9 as FACILITYADMIN of test-e2e-facility-from-db-2 and set User9 as FACILITYADMIN of test-e2e-facility-from-db
insert into authz (user_id, role_id, facility_id) values (currval('users_id_seq')-2, 5, currval('facilities_id_seq'));
insert into authz (user_id, role_id, facility_id) values (currval('users_id_seq')-1, 5, currval('facilities_id_seq'));
insert into authz (user_id, role_id, facility_id) values (currval('users_id_seq')-1, 5, currval('facilities_id_seq')-1);
-- insert attributes and authorization
insert into facility_attr_values (facility_id, attr_id, attr_value) values (currval('facilities_id_seq'), 7, 'einfra');
insert into attributes_authz (attr_id, role_id, action_type_id) values (7, 5, 1);
insert into attributes_authz (attr_id, role_id, action_type_id) values (7, 5, 4);
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 7, 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 5, 'Facility', currval('attribute_policy_collections_id_seq'));
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 7, 'WRITE');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 5, 'Facility', currval('attribute_policy_collections_id_seq'));

/**********************************************************************************************************************
    RESOURCE MANAGEMENT
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test4', 'User11');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceTest', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Resource-admin', 'User12');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceManager', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Resource-admin-2', 'User13');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceManager2', currval('ext_sources_id_seq')-1, 0);

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db-4');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'test-e2e-facility-from-db-4', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-3', 'test-e2e-vo-from-db-3');

-- insert test resource
insert into resources (id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'test-e2e-resource-from-db-2', currval('facilities_id_seq'), currval('vos_id_seq'));

-- set User12 and User13 as RESOURCEADMIN of test-e2e-resource-from-db-2
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq')-1, 6, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq'), 6, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));

-- insert test groups
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-1', currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-2', currval('vos_id_seq'));

-- assign test-e2e-group-from-db-1 to test-e2e-resource-from-db-2
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq')-1, currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq')-1, currval('resources_id_seq'), 'ACTIVE');

-- insert attributes and authorization
insert into resource_attr_values (resource_id, attr_id, attr_value) values (currval('resources_id_seq'), 8, 'test');
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 8, 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
values (nextval('attribute_policies_id_seq'), 6, 'Resource', currval('attribute_policy_collections_id_seq'));
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 8, 'WRITE');
insert into attribute_policies (id, role_id, object, policy_collection_id)
values (nextval('attribute_policies_id_seq'), 6, 'Resource', currval('attribute_policy_collections_id_seq'));

-- set authorization for available attribute to add
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 9, 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
values (nextval('attribute_policies_id_seq'), 6, 'Resource', currval('attribute_policy_collections_id_seq'));
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), 9, 'WRITE');
insert into attribute_policies (id, role_id, object, policy_collection_id)
values (nextval('attribute_policies_id_seq'), 6, 'Resource', currval('attribute_policy_collections_id_seq'));

/**********************************************************************************************************************
    Top Group Creator
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Top-group-creator', 'User16');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'topGroupCreator', currval('ext_sources_id_seq')-1, 0);

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-4', 'test-e2e-vo-from-db-4');

-- insert user to vo members
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'));

-- set user as TOPGROUPCREATOR in vo
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq'), 7, currval('vos_id_seq'));

/**********************************************************************************************************************
    PERUN ADMIN MANAGEMENT
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test5', 'User14');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'test4', currval('ext_sources_id_seq')-1, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test6', 'User15');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'test5', currval('ext_sources_id_seq')-1, 0);
insert into user_attr_values (user_id, attr_id, attr_value) values (currval('users_id_seq'), 1, 'e2etestlogin');

-- insert test attribute definition
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:e2eTestAttrFromDb', 'e2eTestAttrFromDb', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'E2E Test Attr From Db');
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:user:attribute-def:def:perunAdminTestAttr', 'perunAdminTestAttr', 'urn:perun:user:attribute-def:def', 'java.lang.String', 'perunAdminTestAttr');

-- insert test services
insert into services (id, name, script) values (nextval('services_id_seq'), 'test_service_db', './test_service_db');
insert into services (id, name, script) values (nextval('services_id_seq'), 'test_service_db2', './test_service_db2');

-- insert test ext source
insert into ext_sources (id, name, type) values (nextval('ext_sources_id_seq'), 'test_ext_source_db', 'cz.metacentrum.perun.core.impl.ExtSourceInternal');

-- insert test auditer log message
insert into auditer_log (id, msg, actor) values (nextval('auditer_log_id_seq'), 'test_audit_message', 'test_actor');

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db-3');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'test-e2e-facility-from-db-3', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test owners
insert into owners (id, name, type) values (nextval('owners_id_seq'), 'DbOwnerTest', 'technical');

-- insert test blocked login
insert into blocked_logins (id, login) values (nextval('blocked_logins_id_seq'), 'test_blocking_login');
insert into blocked_logins (id, login) values (nextval('blocked_logins_id_seq'), 'test_blocking_login_list');

/**********************************************************************************************************************
    Trusted Facility admin
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test7', 'User17');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'trustedFacilityAdmin', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Test8', 'User18');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'trustedFacilityAdmin2', currval('ext_sources_id_seq')-2, 0);

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db-5');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'test-e2e-facility-from-db-5', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-5', 'test-e2e-vo-from-db-5');

-- insert test resource
insert into resources (id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'test-e2e-resource-from-db-3', currval('facilities_id_seq'), currval('vos_id_seq'));

-- insert test groups
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-3', currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-4', currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-5', currval('vos_id_seq'));

-- assign test-e2e-group-from-db-4 and test-e2e-group-from-db-5 to test-e2e-resource-from-db-3, one as inactive one as active
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq'), currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq'), currval('resources_id_seq'), 'ACTIVE');

insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq')-1, currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq')-1, currval('resources_id_seq'), 'INACTIVE');

-- set User17 as RESOURCEADMIN, RESOURCEOBSERVER and RESOURCESELFSERVICE of test-e2e-resource-from-db-3 and user16 as FACILITYADMIN TrustedFacilityAdmin
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq'), 6, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq'), 9, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq'), 10, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq')-1, 8, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id,facility_id) values (currval('users_id_seq')-1, 5, currval('facilities_id_seq'));

/**********************************************************************************************************************
    RESOURCE SELF SERVICE
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Resource-self-service', 'User19');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceSelfService', currval('ext_sources_id_seq')-2, 0);

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'test-e2e-facility-from-db-6');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'test-e2e-facility-from-db-6', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-6', 'test-e2e-vo-from-db-6');

-- insert test resource
insert into resources (id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'test-e2e-resource-from-db-4', currval('facilities_id_seq'), currval('vos_id_seq'));

-- insert test groups
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-6', currval('vos_id_seq'));      -- change status to INACTIVE
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-7', currval('vos_id_seq'));      -- change status to ACTIVE
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-8', currval('vos_id_seq'));      -- remove from resource
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'test-e2e-group-from-db-9', currval('vos_id_seq'));      -- assign to resource


-- set User19 as RESOURCESELFSERVICE of test-e2e-resource-from-db-4 and as GROUPADMIN of test-e2e-group-from-db-6, test-e2e-group-from-db-7, test-e2e-group-from-db-8, test-e2e-group-from-db-9
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq'), 9, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq')-3);
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq')-2);
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq')-1);
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq'));

-- assign groups to test-e2e-resource-from-db-4
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq')-3, currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq')-3, currval('resources_id_seq'), 'ACTIVE');
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq')-2, currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq')-2, currval('resources_id_seq'), 'INACTIVE');
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq')-1, currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq')-1, currval('resources_id_seq'), 'ACTIVE');

/**********************************************************************************************************************
    GROUP OBSERVER
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'group-observer', 'group-observer');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'groupObserver', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'g-o-testGroupMember', 'g-o-testGroupMember');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'g-o-testGroupMember', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'g-o-testVoMember', 'g-o-testVoMember');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'g-o-testVoMember', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'g-o-testGroupAdmin', 'g-o-testGroupAdmin');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'g-o-testGroupAdmin', currval('ext_sources_id_seq')-2, 0);

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'g-o-test-vo', 'g-o-test-vo');

-- insert vo members
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-2, currval('vos_id_seq'));
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq')-1, 1, currval('groups_id_seq'));

-- insert test group and members
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'g-o-test-group', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq')-1, 1, currval('groups_id_seq'));
insert into group_ext_sources (group_id, ext_source_id) values (currval('groups_id_seq'), currval('ext_sources_id_seq')-2);

-- set group management roles
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq')-3, 11, currval('vos_id_seq'), currval('groups_id_seq'));
insert into authz (user_id, role_id, vo_id, group_id) values (currval('users_id_seq'), 3, currval('vos_id_seq'), currval('groups_id_seq'));

-- insert group application form, application form item and vo member's application
insert into application_form (id, vo_id, group_id) values (nextval('application_form_id_seq'), currval('vos_id_seq'), currval('groups_id_seq'));
insert into application_form_items (id, form_id, ordnum, type, shortname) values (nextval('application_form_items_id_seq'), currval('application_form_id_seq'), 0, 'TEXTFIELD', 'g-o-input-test');
insert into application (id, vo_id, user_id, apptype, extSourceName, extSourceType, fed_info, state, extSourceLoa, group_id) values (nextval('application_id_seq'), currval('vos_id_seq'), currval('users_id_seq')-1, 'INITIAL', 'INTERNAL', 'cz.metacentrum.perun.core.impl.ExtSourceInternal', '', 'VERIFIED', 0, currval('groups_id_seq'));

/**********************************************************************************************************************
    FACILITY OBSERVER
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Facility-observer-firstname', 'Facility-observer-lastname');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'facilityObserver', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'f-o-assigned-user-firstname', 'f-o-assigned-user-lastname');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'f-o-assigned-user', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'f-o-facility-manager-firstname', 'f-o-facility-manager-lastname');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'f-o-facility-manager', currval('ext_sources_id_seq')-2, 0);

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'f-o-test-vo', 'f-o-test-vo');

-- insert test vo member, groups and groups member
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'f-o-test-group', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'f-o-test-facility');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'f-o-test-facility', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test resource
insert into resources (id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'f-o-test-resource', currval('facilities_id_seq'), currval('vos_id_seq'));

-- assign f-o-test-group to f-o-test-resource as active
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq'), currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq'), currval('resources_id_seq'), 'ACTIVE');

-- set facilityObserver as FACILITYOBSERVER of f-o-test-facility and f-o-facility-manager as FACILITYADMIN of f-o-test-facility
insert into authz (user_id, role_id, facility_id) values (currval('users_id_seq')-2, 12, currval('facilities_id_seq'));
insert into authz (user_id, role_id, facility_id) values (currval('users_id_seq'), 5, currval('facilities_id_seq'));

-- insert owner and assign to f-o-test-facility
insert into owners (id, name, type) values (nextval('owners_id_seq'), 'f-o-owner', 'technical');
insert into facility_owners (facility_id, owner_id) values (currval('facilities_id_seq'), currval('owners_id_seq'));

-- insert service and assign to f-o-test-resource
insert into services (id, name, script) values (nextval('services_id_seq'), 'f-o-test-service', './f-o-test-service');
insert into resource_services (service_id, resource_id) values (currval('services_id_seq'), currval('resources_id_seq'));

-- insert destination and assign to facility
insert into destinations (id, destination, type) values (nextval('destinations_id_seq'), 'test-destination.hostname.cz', 'host');
insert into facility_service_destinations (service_id, facility_id, destination_id) values (currval('services_id_seq'), currval('facilities_id_seq'), currval('destinations_id_seq'));

-- insert host and host attribute
insert into hosts (id, hostname, facility_id) values (nextval('hosts_id_seq'), 'test.hostname.cz', currval('facilities_id_seq'));
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:host:attribute-def:def:frontend', 'frontend', 'urn:perun:host:attribute-def:def', 'java.lang.String', 'Is this host a frontend?');
insert into host_attr_values (host_id, attr_id, attr_value) values (currval('hosts_id_seq'), currval('attr_names_id_seq'), 'test');

-- insert task and task result
insert into tasks (id, service_id, facility_id, schedule, recurrence, delay, status) values (nextval('tasks_id_seq'), currval('services_id_seq'), currval('facilities_id_seq'), 'Aug 10, 2021, 2:00:32 PM', 0, 10, 'DONE');
insert into tasks_results (id, task_id, destination_id, status) values (nextval('tasks_results_id_seq'), currval('tasks_id_seq'), currval('destinations_id_seq'), 'DONE');

-- insert facility attribute and rights for this attribute
insert into attr_names (id, attr_name, friendly_name, namespace, type, display_name) values (nextval('attr_names_id_seq'), 'urn:perun:facility:attribute-def:def:uid-namespace', 'uid-namespace', 'urn:perun:facility:attribute-def:def', 'java.lang.String', 'Define namespace for user`s UIDs on Facility.');
insert into attribute_policy_collections (id, attr_id, action) values (nextval('attribute_policy_collections_id_seq'), currval('attr_names_id_seq'), 'READ');
insert into attribute_policies (id, role_id, object, policy_collection_id)
	values (nextval('attribute_policies_id_seq'), 12, 'Facility', currval('attribute_policy_collections_id_seq'));
insert into facility_attr_values (facility_id, attr_id, attr_value) values (currval('facilities_id_seq'), currval('attr_names_id_seq'), 'cesnet');

/**********************************************************************************************************************
    RESOURCE OBSERVER
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'resource-observer-user1', 'Resource-observer-User1');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceObserver', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'resource-observer-user2', 'Resource-observer-User2');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceObserver2', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'resource-observer-user3', 'Resource-observer-User3');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'resourceObserver3', currval('ext_sources_id_seq')-2, 0);

-- insert test facility and consent hub
insert into facilities (id, name) values (nextval('facilities_id_seq'), 'resource-observer-facility-from-db-1');
insert into consent_hubs (id, name, enforce_consents) values (nextval('consent_hubs_id_seq'), 'resource-observer-facility-from-db-1', true);
insert into consent_hubs_facilities (consent_hub_id, facility_id) values (currval('consent_hubs_id_seq'), currval('facilities_id_seq'));

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'resource-observer-vo-from-db-1', 'resource-observer-vo-from-db-1');

-- insert test resource
insert into resources (id, name, facility_id, vo_id) values (nextval('resources_id_seq'), 'resource-observer-resource-from-db-1', currval('facilities_id_seq'), currval('vos_id_seq'));

-- set Resource-observer-User1 as RESOURCEOBSERVER and Resource-observer-User2 as RESOURCEADMIN of resource-observer-resource-from-db-1
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq')-2, 10, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));
insert into authz (user_id, role_id, resource_id, facility_id, vo_id) values (currval('users_id_seq')-1, 6, currval('resources_id_seq'), currval('facilities_id_seq'), currval('vos_id_seq'));

-- insert user to vo members
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'));

-- insert test groups
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'resource-observer-group-from-db-1', currval('vos_id_seq'));

-- insert group members
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));

-- assign resource-observer-group-from-db-1 to resource-observer-resource-from-db-1
insert into groups_resources (group_id, resource_id) values (currval('groups_id_seq'), currval('resources_id_seq'));
insert into groups_resources_state (group_id, resource_id, status) values (currval('groups_id_seq'), currval('resources_id_seq'), 'ACTIVE');

-- insert test services
insert into services (id, name, script) values (nextval('services_id_seq'), 'resource-observer-test_service_db', './test_service_db');

/**********************************************************************************************************************
    VO Observer
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'vo-observer-user1', 'vo-observer-user1');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'voObserver', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'vo-observer-user2', 'vo-observer-user2');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'voObserver2', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'vo-observer-user3', 'vo-observer-user3');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'voObserver3', currval('ext_sources_id_seq')-2, 0);

-- insert test vo, vo_ext_source, vo application form and application form item and application
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'vo-observer-vo-from-db', 'vo-observer-vo-from-db');
insert into vo_ext_sources (vo_id, ext_sources_id) values (currval('vos_id_seq'), 1);
insert into application_form (id, vo_id) values (nextval('application_form_id_seq'), currval('vos_id_seq'));
insert into application_form_items (id, form_id, ordnum, type, shortname) values (nextval('application_form_items_id_seq'), currval('application_form_id_seq'), 0, 'TEXTFIELD', 'input-test');
insert into application (id, vo_id, apptype, state) values (nextval('application_id_seq'), currval('vos_id_seq'), 'EXTENSION', 'VERIFIED');

-- insert vo-observer-user3 as vo and group member
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'));
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'vo-observer-group-from-db', currval('vos_id_seq'));
insert into groups_members (group_id, member_id, membership_type, source_group_id) values (currval('groups_id_seq'), currval('members_id_seq'), 1, currval('groups_id_seq'));

-- set vo-observer-user1 as VOOBSERVER and vo-observer-user2 as VOADMIN of vo-observer-vo-from-db
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq')-2, 13, currval('vos_id_seq'));
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq')-1, 2, currval('vos_id_seq'));

/**********************************************************************************************************************
    PERUN OBSERVER
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'PerunObserverTest1', 'PerunObserverTest1');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'perunObserver', currval('ext_sources_id_seq')-2, 0);

-- set user as PERUNOBSERVER in vo
insert into authz (user_id, role_id) values (currval('users_id_seq'), 14);

-- insert test services
insert into services (id, name, script) values (nextval('services_id_seq'), 'perun_observer_test', './perun_observer_test');


/**********************************************************************************************************************
    SPONSOR
***********************************************************************************************************************/

-- insert test users and user_ext_sources
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'Sponsor', 'User19');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'sponsor', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'MemberToSponsor', 'User20');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'sponsor2', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'MemberToUnsponsor', 'User21');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'sponsor3', currval('ext_sources_id_seq')-2, 0);
insert into users (id, first_name, last_name) values (nextval('users_id_seq'), 'SponsoredMember', 'User22');
insert into user_ext_sources (id, user_id, login_ext, ext_sources_id, loa) values (nextval('user_ext_sources_id_seq'), currval('users_id_seq'), 'sponsor4', currval('ext_sources_id_seq')-2, 0);

-- set einfra login and preferredMail for User22 to be able to reset password
insert into user_attr_values (user_id, attr_id, attr_value) values (currval('users_id_seq'), 1, 'SponsoredMember');
insert into user_attr_values (user_id, attr_id, attr_value) values (currval('users_id_seq'), 10, 'test@test.com');

-- insert test vo
insert into vos (id, name, short_name) values (nextval('vos_id_seq'), 'test-e2e-vo-from-db-7', 'test-e2e-vo-from-db-7');

-- insert members group
insert into groups (id, name, vo_id) values (nextval('groups_id_seq'), 'members', currval('vos_id_seq'));

-- add User22, User21, and User20 as member of vo
insert into members (id, user_id, vo_id) values (nextval('members_id_seq'), currval('users_id_seq')-2, currval('vos_id_seq'));
insert into members (id, user_id, vo_id, sponsored) values (nextval('members_id_seq'), currval('users_id_seq')-1, currval('vos_id_seq'), true);
insert into members (id, user_id, vo_id, sponsored) values (nextval('members_id_seq'), currval('users_id_seq'), currval('vos_id_seq'), true);

-- add User22 and User21 as sponsored members sponsored by User19
insert into members_sponsored (sponsored_id, sponsor_id) values (currval('members_id_seq'), currval('users_id_seq')-3);
insert into members_sponsored (sponsored_id, sponsor_id) values (currval('members_id_seq')-1, currval('users_id_seq')-3);

-- set User19 as sponsor in VO, also set as TOPGROUPCREATOR (needed for generating sponsored members via CSV)
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq')-3, 15, currval('vos_id_seq'));
insert into authz (user_id, role_id, vo_id) values (currval('users_id_seq')-3, 7, currval('vos_id_seq'));
