import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { RichUser, Candidate, MemberCandidate, Attribute } from '@perun-web-apps/perun/openapi';
import {
  parseEmail,
  getCandidateEmail,
  getExtSourceNameOrOrganizationColumn,
  parseUserEmail,
  parseVo, parseName
} from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-members-candidates-list',
  templateUrl: './members-candidates-list.component.html',
  styleUrls: ['./members-candidates-list.component.scss']
})
export class MembersCandidatesListComponent implements OnChanges, AfterViewInit {

  constructor() {
  }

  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  members: MemberCandidate[];

  @Input()
  selection: SelectionModel<MemberCandidate>;

  @Input()
  type: string;

  displayedColumns: string[] = ['checkbox', 'status', 'fullName', 'voExtSource', 'email', 'logins', 'alreadyMember', 'local'];
  dataSource: MatTableDataSource<MemberCandidate>;

  exporting = false;

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (memberCandidate, property) => {
        switch (property) {
          case 'status':
            return memberCandidate.member ? memberCandidate.member.status : '';
          case 'fullName':
            let name;
            if (memberCandidate.richUser) {
              name = parseName(memberCandidate.richUser);
            } else {
              name = parseName(memberCandidate.candidate);
            }
            return name.toLowerCase();
          case 'email':
            if (memberCandidate.richUser || memberCandidate.member) {
              return parseUserEmail(memberCandidate.richUser);
            } else {
              return this.getEmail(memberCandidate);
            }
          case 'voExtSource':
            return memberCandidate.richUser ? parseVo(memberCandidate.richUser) : this.getOrganization(memberCandidate.candidate);
          case 'logins':
            return this.getLogins(memberCandidate);
          case 'alreadyMember':
            return this.getAlreadyMember(memberCandidate);
          case 'local':
            return memberCandidate.richUser ? "Local" : "External identity";
          default:
            return memberCandidate[property];
        }
      };

      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    this.setDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<MemberCandidate>(this.members);

    this.setDataSource();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getEmail(memberCandidate: MemberCandidate): string {
    let email: Attribute;
    if (memberCandidate.richUser) {
      for (const attribute of memberCandidate.richUser.userAttributes) {
        if(attribute.namespace + ":" + attribute.friendlyName === 'urn:perun:user:attribute-def:def:preferredMail'){
          email = attribute;
          break;
        }
      }
      if (email != null && email.value != null && !('null' === email.value.toString().toLowerCase())) {
        return email.value.toString().replace(",", " ");
      }
      return '';
    } else {
      return getCandidateEmail(memberCandidate.candidate);
    }

  }

  getOrganization(candidate: Candidate): string {
    return getExtSourceNameOrOrganizationColumn(candidate);
  }

  /**
   * Gets all logins stored in user attributes
   *
   * @return users logins
   */
  getLogins(memberCandidate: MemberCandidate): string {
    if (memberCandidate.richUser) {
      return this.getLoginsForRichUser(memberCandidate.richUser);
    }
    else {
      let logins = this.getLoginsForCandidate(memberCandidate.candidate);
      if (logins == null || logins === '') {
        logins = memberCandidate.candidate.userExtSource.login;
      }
      return logins;
    }
	}

	getLoginsForRichUser(user: RichUser): string {
    let logins = '';
    for (const userAttribute of user.userAttributes) {
      if (userAttribute.friendlyName.startsWith('login-namespace')) {
        // process only logins which are not null
        if (userAttribute.value != null) {
          // append comma
          if (logins.length > 0) {
            logins += ", ";
          }
          // parse login namespace
          const parsedNamespace =  userAttribute.friendlyName.substring(16);
          logins += parsedNamespace + ": " + userAttribute.value;
        }
      }
    }
    return logins;
  }

  getLoginsForCandidate(candidate: Candidate): string {
    const attributesNamespace = 49;
    let logins = '';
    for (const prop in candidate.attributes) {
      if (candidate.attributes.hasOwnProperty(prop)) {
        if (prop.indexOf('urn:perun:user:attribute-def:def:login-namespace:') !== -1) {
          if (candidate.attributes[prop] != null) {
            if(logins.length > 0){
              logins += ", ";
            }
            // parse login namespace
            const parsedNamespace = prop.substring(attributesNamespace);
            logins += parsedNamespace + ": " + candidate.attributes[prop];
          }
        }
      }
    }
    return logins;
  }

  getAlreadyMember(memberCandidate: MemberCandidate): string {
    if (this.type === 'vo') {
      if (memberCandidate.member != null) return 'Member of VO';
    } else {
      if (memberCandidate.member != null &&
        memberCandidate.member.sourceGroupId !== 0 &&
        memberCandidate.member.membershipType === 'DIRECT') return 'Member of Group';
      if (memberCandidate.member != null &&
        memberCandidate.member.sourceGroupId !== 0 &&
        memberCandidate.member.membershipType === 'INDIRECT') return 'Indirect member of Group';
      if (memberCandidate.member != null) return 'Member of VO';
    }
    return '';
  }

  isCheckboxDisabled(memberCandidate: MemberCandidate): boolean {
    if (this.type === 'vo') {
      return memberCandidate.member != null;
    }
    else {
        if (memberCandidate.member) {
          return memberCandidate.member.sourceGroupId !== 0 &&
                  memberCandidate.member.membershipType === 'DIRECT'
        }
    }
    return false;
  }
}
