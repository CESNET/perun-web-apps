import {AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { Candidate, MemberCandidate, RichUser } from '@perun-web-apps/perun/models';
import {
  parseEmail,
  parseFullName,
  getCandidateEmail,
  getExtSourceNameOrOrganizationColumn
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

  @ViewChild(MatSort, {static: true}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

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

      this.dataSource.sortingDataAccessor = (richMember, property) => {
        switch (property) {
          case 'fullName':
            return parseFullName(richMember.richUser);
          case 'email':
            return parseEmail(richMember.member);
          default:
            return richMember[property];
        }
      };

      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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

  checkboxLabel(row?: MemberCandidate): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.member === null ? row.richUser.id + 1 : row.member.id + 1}`;
  }

  getEmail(candidate: Candidate): string {
    return getCandidateEmail(candidate);
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
      if (userAttribute.friendlyName.substring(0, 15) === 'login-namespace') {
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
    let logins = '';
    for (const prop in candidate.attributes) {
      if (candidate.attributes.hasOwnProperty(prop)) {
        if (prop.indexOf('urn:perun:user:attribute-def:def:login-namespace:') !== -1) {
          if (candidate.attributes[prop] != null) {
            if(logins.length > 0){
              logins += ", ";
            }
            // parse login namespace
            const parsedNamespace = prop.substring(49);
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
