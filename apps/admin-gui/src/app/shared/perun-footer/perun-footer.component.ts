import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ReportIssueDialogComponent } from '../components/report-issue-dialog/report-issue-dialog.component';
import { StoreService } from '../../core/services/common/store.service';

@Component({
  selector: 'app-perun-footer',
  templateUrl: './perun-footer.component.html',
  styleUrls: ['./perun-footer.component.scss']
})
export class PerunFooterComponent implements OnInit {

  constructor(private storeService: StoreService,
              private dialog: MatDialog) { }

  perunwebpage = '';
  perunTeamWebpage = '';
  privacyPolicy = '';
  userDocumentationWebpage = '';
  administratorDocumentationWebpage = '';
  supportMail = '';
  version = '';
  copyright: [] = [];

  currentYear = (new Date()).getFullYear();

  ngOnInit() {
    this.perunwebpage = this.storeService.get('footer_perun_web_web');
    this.perunTeamWebpage = this.storeService.get('footer_perun_team_web');
    this.privacyPolicy = this.storeService.get('footer_privacy_policy_web');
    this.userDocumentationWebpage = this.storeService.get('footer_users_documentation_web');
    this.administratorDocumentationWebpage = this.storeService.get('footer_administrator_documentation');
    this.supportMail = this.storeService.get('footer_support_mail');
    this.version = this.storeService.get('version');
    this.copyright = this.storeService.get('footer_copyright');
  }

  openBugReportDialog() {
    this.dialog.open(ReportIssueDialogComponent, {
      width: '550px',
    });
  }
}
