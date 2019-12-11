/**
 * Return string representing Material icon for status of given member.
 *
 * @param richMember member
 */
import {
  Attribute,
  AttributeDefinition, Candidate,
  Group,
  Owner,
  RichMember,
  RichUser,
  User
} from '@perun-web-apps/perun/models';


export function parseStatusIcon(richMember: RichMember): string {
  switch (richMember.status) {
    case 'VALID':
      return 'verified_user';
    case 'INVALID':
      return 'report';
    case 'SUSPENDED':
      return 'lock';
    case 'EXPIRED':
      return 'schedule';
    case 'DISABLED':
      return 'delete';
  }
}

/**
 * Return color which should be used for icon of given member's status.
 *
 * @param richMember member
 */
export function parseStatusColor(richMember: RichMember): string {
  switch (richMember.status) {
    case 'VALID':
      return 'accent';
    case 'INVALID':
      return 'warn';
    default:
      return '';
  }
}

/**
 * Gets email of given member. The vo-email has top priority, the preferred email
 * has lower priority. If there are no emails, an empty string is returned.
 *
 * @param richMember RichMember
 */
export function parseEmail(richMember: RichMember): string {
  let email = '';
  if (richMember) {
    richMember.memberAttributes.forEach(attr => {
      if (attr.friendlyName === 'mail' && attr.value !== null) {
        email = attr.value;
      }
    });

    if (email.length === 0) {
      richMember.userAttributes.forEach(attr => {
        if (attr.friendlyName === 'preferredMail') {
          email = attr.value;
        }
      });
    }
  }
  return email;
}

/**
 * Gets email of given user. If there are no emails, an empty string is returned.
 *
 * @param richUser RichUser
 */
export function parseUserEmail(richUser: RichUser): string {
  let email = '';
  if (richUser) {
    richUser.userAttributes.forEach(attr => {
      if (attr.friendlyName === 'preferredMail') {
        email = attr.value;
      }
    });
  }
  return email;
}

/**
 * Get logins of given member.
 *
 * @param richMember member
 */
export function parseLogins(richMember: RichMember|RichUser): string {
  let logins = '';

  richMember.userAttributes.forEach(attr => {
    if (attr.baseFriendlyName === 'login-namespace') {
      logins += attr.friendlyNameParameter + ': ' + attr.value + ' ';
    }
  });

  if (logins.endsWith(' ')) {
    logins = logins.substring(0, logins.length - 1);
  }
  return logins;
}

export function parseUrnsToUrlParam(paramName: string, urns: string[]): string {
  let attributesParam = '';
  urns.forEach(a => attributesParam = attributesParam.concat(`&${paramName}%5B%5D=`).concat(a));
  return attributesParam;
}

/**
 * Creates full name for given user form his titles and names.
 *
 * @param user user
 */
export function parseFullName(user: User | Candidate): string {
  let fullName = '';

  if (user.titleBefore !== null) {
    fullName += user.titleBefore + ' ';
  }
  if (user.firstName !== null) {
    fullName += user.firstName + ' ';
  }
  if (user.middleName !== null) {
    fullName += user.middleName + ' ';
  }
  if (user.lastName !== null) {
    fullName += user.lastName + ' ';
  }
  if (user.titleAfter !== null) {
    fullName += user.titleAfter + ' ';
  }
  if (fullName.endsWith(' ')) {
    fullName = fullName.substring(0, fullName.length - 1);
  }

  return fullName;
}

/**
 * Returns attribute with specific urn from given rich user.
 * If the given user doesn't have attribute with given urn, null is returned.
 *
 * @param user user with attributes
 * @param urn urn for required attribute
 */
export function getRichUserAttribute(user: RichUser, urn: string): Attribute {
  for (const attribute of user.userAttributes) {
    const attributeUrn = attribute.namespace + ':' + attribute.friendlyName;
    if (attributeUrn === urn) {
      return attribute;
    }
  }

  return null;
}

export function parseTechnicalOwnersNames(owners: Owner[]): string {
  let names = '';
  for (const owner of owners) {
    if (owner.type === 'technical') {
      names += owner.name + ', ';
    }
  }
  if (names.endsWith(', ')) {
    names = names.substring(0, names.length - 2);
  }
  return names;
}

export async function doAfterDelay(delayMs: number, callback: () => void) {
  await delay(delayMs);
  callback();
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns array with recently used entities at the top of array.
 *
 * @param key of localStorage
 * @param array of all entities
 */
export function getRecentlyVisited(key: string, array: any[]): any[] {
  const recentIds: number[] = JSON.parse(localStorage.getItem(key));
  if (recentIds) {
    const recentlyVisited: any[] = [];
    for (let i = 0; i < recentIds.length; i ++) {
      array.forEach((item, index) => {
        if (item.id === recentIds[i]) {
          recentlyVisited.push(item);
          array.splice(index, 1);
        }
      });
    }
    for (let i = recentlyVisited.length - 1; i >= 0; i--) {
      array.unshift(recentlyVisited[i]);
    }
  }
  return array;
}

/**
 * Returns saved ids for given key.
 *
 * @param key of local storage
 */
export function getRecentlyVisitedIds(key: string): number[] {
  const recentIds: number[] = JSON.parse(localStorage.getItem(key));
  if (recentIds) {
    return recentIds;
  }
  return [];
}


/**
 * Add entity that was just visited to localStorage.
 *
 * @param key of localStorage
 * @param item entity that was visited
 */
export function addRecentlyVisited(key: string, item: any) {
  if (localStorage.getItem(key) === null) {
    // if user not have any in local storage
    const recent: number[] = [];
    recent.unshift(item.id);
    localStorage.setItem('vos', JSON.stringify(recent));
  } else {
    const recent: number[] = JSON.parse(localStorage.getItem(key));
    const index = indexOfVo(recent, item.id);
    if (index > 0) {
      // if vo is in recent but not of first place, then we remove it to placed it first
      recent.splice(index, 1);
    }
    if (index !== 0) {
      // place the element as first
      recent.unshift(item.id);
    }
    if (recent.length > 5) {
      // pop last element if length exceed 5 vo
      recent.pop();
    }
    localStorage.setItem(key, JSON.stringify(recent));
  }
}

export function indexOfVo(recent: number[], id: number) {
  for (let i = 0; i < recent.length; i++) {
    if (recent[i] === id) {
      return i;
    }
  }
  return -1;
}

/**
 * Gets Vo of given user.
 *
 * @param richUser RichUser
 */
export function parseVo(richUser: RichUser): string {
  let result = '';
  if (richUser) {
    richUser.userAttributes.forEach(attr => {
      if (attr.friendlyName === 'organization') {
        result = attr.value;
      }
    });
  }
  return result;
}
/**
 * From given attributes array removes all core attributes.
 *
 * @param attributes non core attributes
 */
export function filterCoreAttributes(attributes: Attribute[]): Attribute[] {
  return attributes.filter(attribute => !attribute.namespace.includes('def:core'));
}

/**
 * Filter groups by given filter string.
 *
 * @param filterValue filter string
 * @param groups field of groups that its filtering
 * return field - on first position is groups filtered by name, on second groups are filtered by shortName and added their parents
 */
export function applyFilter(filterValue: string, groups: Group[]) {
  const filteredTreeGroups = [];
  const filteredGroups = groups.filter( option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  const treegroup = groups.filter( option => option.shortName.toLowerCase().includes(filterValue.toLowerCase()));
  for (const group of treegroup) {
    filteredTreeGroups.push(group);
    if (group.parentGroupId) {
      filteredTreeGroups.concat(findParent(group.parentGroupId, groups));
    }
  }
  return [filteredGroups, filteredTreeGroups];
}

/**
 * Find parents of given group in field of groups
 * @param group that you parent you want to found
 * @param groups field of groups where you want to find parent
 * return field of parents
 */
export function findParent(group: number, groups: Group[]): Group[] {
  const parent = groups.find( x => x.id === group);
  if (parent) {
    if (parent.parentGroupId) {
      return findParent(parent.parentGroupId, groups).concat(parent);
    } else {
      return [parent];
    }
  } else {
    return [];
  }
}

export function filterCoreAttributesDefinitions(attributesDef: AttributeDefinition[]): AttributeDefinition[] {
  return attributesDef.filter(attribute => !attribute.namespace.includes('def:core'));
}

/**
 * Finds attribute with given attrName from given attributes.
 *
 * @param attributes attributes
 * @param attrName attr name
 * @return attribute with given name or null if not found
 */
export function getAttribute(attributes: Attribute[], attrName: string) : Attribute {
  for (const attribute of attributes) {
    if ((attribute.namespace + ":" + attribute.friendlyName) === attrName) {
      return attribute;
    }
  }
  return null;
}

/**
 * Find candidate email in his attributes
 * @param candidate
 * @return candidate email
 */
export function getCandidateEmail(candidate: Candidate): string {
  if (candidate.attributes['urn:perun:member:attribute-def:def:mail'] != null) {
    return candidate.attributes['urn:perun:member:attribute-def:def:mail'];
  } else if (candidate.attributes['urn:perun:user:attribute-def:def:preferredMail'] != null) {
    return candidate.attributes['urn:perun:user:attribute-def:def:preferredMail'];
  }
  return "";
}

export function getExtSourceNameOrOrganizationColumn(candidate: Candidate): string {
  if (candidate.userExtSource.extSource.type.toLowerCase() == "cz.metacentrum.perun.core.impl.ExtSourceX509".toLowerCase()) {
    return convertCertCN(candidate.userExtSource.extSource.name);
  } else if (candidate.userExtSource.extSource.type.toLowerCase() == "cz.metacentrum.perun.core.impl.ExtSourceIdp".toLowerCase()) {
    return translateIdp(candidate.userExtSource.extSource.name);
  } else {
    return candidate.userExtSource.extSource.name;
  }
}

/**
 * If passed string is DN of certificate(recognized by "/CN=") then returns only CN part with unescaped chars.
 * If passed string is not DN of certificate, original string is returned.
 *
 * @param toConvert
 * @return
 */
export function convertCertCN(toConvert: string): string {

  if (toConvert.includes("/CN=")) {
    const splitted = toConvert.split("/");
    for (const s in splitted) {
      if (s.startsWith("CN=")) {
        return unescapeDN(s.substring(3));
      }
    }
  }
  return toConvert;
}

export function unescapeDN(string: string): string {

  return decodeURIComponent(string.replace(/\\x/g, '%'));

}

export function translateIdp(name: string): string {

  const orgs: Map<string, string> = new Map();
  orgs.set("https://idp.upce.cz/idp/shibboleth", "University in Pardubice");
  orgs.set("https://idp.slu.cz/idp/shibboleth", "University in Opava");
  orgs.set("https://login.feld.cvut.cz/idp/shibboleth", "Faculty of Electrical Engineering, Czech Technical University In Prague");
  orgs.set("https://www.vutbr.cz/SSO/saml2/idp", "Brno University of Technology");
  orgs.set("https://shibboleth.nkp.cz/idp/shibboleth", "The National Library of the Czech Republic");
  orgs.set("https://idp2.civ.cvut.cz/idp/shibboleth", "Czech Technical University In Prague");
  orgs.set("https://shibbo.tul.cz/idp/shibboleth", "Technical University of Liberec");
  orgs.set("https://idp.mendelu.cz/idp/shibboleth", "Mendel University in Brno");
  orgs.set("https://cas.cuni.cz/idp/shibboleth", "Charles University in Prague");
  orgs.set("https://wsso.vscht.cz/idp/shibboleth", "Institute of Chemical Technology Prague");
  orgs.set("https://idp.vsb.cz/idp/shibboleth", "VSB – Technical University of Ostrava");
  orgs.set("https://whoami.cesnet.cz/idp/shibboleth", "CESNET");
  orgs.set("https://helium.jcu.cz/idp/shibboleth", "University of South Bohemia");
  orgs.set("https://idp.ujep.cz/idp/shibboleth", "Jan Evangelista Purkyne University in Usti nad Labem");
  orgs.set("https://idp.amu.cz/idp/shibboleth", "Academy of Performing Arts in Prague");
  orgs.set("https://idp.lib.cas.cz/idp/shibboleth", "Academy of Sciences Library");
  orgs.set("https://shibboleth.mzk.cz/simplesaml/metadata.xml", "Moravian  Library");
  orgs.set("https://idp2.ics.muni.cz/idp/shibboleth", "Masaryk University");
  orgs.set("https://idp.upol.cz/idp/shibboleth", "Palacky University, Olomouc");
  orgs.set("https://idp.fnplzen.cz/idp/shibboleth", "FN Plzen");
  orgs.set("https://id.vse.cz/idp/shibboleth", "University of Economics, Prague");
  orgs.set("https://shib.zcu.cz/idp/shibboleth", "University of West Bohemia");
  orgs.set("https://idptoo.osu.cz/simplesaml/saml2/idp/metadata.php", "University of Ostrava");
  orgs.set("https://login.ics.muni.cz/idp/shibboleth", "MetaCentrum");
  orgs.set("https://idp.hostel.eduid.cz/idp/shibboleth", "eduID.cz Hostel");
  orgs.set("https://shibboleth.techlib.cz/idp/shibboleth", "National Library of Technology");
  orgs.set("https://eduid.jamu.cz/idp/shibboleth", "Janacek Academy of Music and Performing Arts in Brno");
  orgs.set("https://marisa.uochb.cas.cz/simplesaml/saml2/idp/metadata.php", "Institute of Organic Chemistry and Biochemistry AS CR");
  orgs.set("https://shibboleth.utb.cz/idp/shibboleth", "Tomas Bata University in Zlin");
  orgs.set("https://engine.elixir-czech.org/authentication/idp/metadata", "Elixir Europe");
  orgs.set("https://login.elixir-czech.org/idp", "Elixir Czech");
  orgs.set("https://mojeid.cz/saml/idp.xml", "MojeID");
  orgs.set("https://www.egi.eu/idp/shibboleth", "EGI SSO");

  orgs.set("@google.extidp.cesnet.cz", "Google");
  orgs.set("@facebook.extidp.cesnet.cz", "Facebook");
  orgs.set("@mojeid.extidp.cesnet.cz", "MojeID");
  orgs.set("@linkedin.extidp.cesnet.cz", "LinkedIn");
  orgs.set("@twitter.extidp.cesnet.cz", "Twitter");
  orgs.set("@seznam.extidp.cesnet.cz", "Seznam");
  orgs.set("@elixir-europe.org", "Elixir Europe");
  orgs.set("@github.extidp.cesnet.cz", "GitHub");
  orgs.set("@orcid.extidp.cesnet.cz", "OrcID");

  if (orgs.get(name) != null) {
    return orgs.get(name);
  } else {
    return name;
  }

}
