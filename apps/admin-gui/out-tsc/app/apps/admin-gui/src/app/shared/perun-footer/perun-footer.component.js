import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportIssueDialogComponent } from '../components/report-issue-dialog/report-issue-dialog.component';
import { StoreService } from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { version } from '../../../../../../package.json';
let PerunFooterComponent = class PerunFooterComponent {
    constructor(storeService, dialog, store) {
        this.storeService = storeService;
        this.dialog = dialog;
        this.store = store;
        this.perunwebpage = '';
        this.perunTeamWebpage = '';
        this.privacyPolicy = '';
        this.userDocumentationWebpage = '';
        this.administratorDocumentationWebpage = '';
        this.supportMail = '';
        this.version = '';
        this.copyright = [];
        this.backgroundColor = this.store.get('theme', 'footer_bg_color');
        this.footerCopyrightTextColor = this.store.get('theme', 'footer_copyright_text_color');
        this.linksTextColor = this.store.get('theme', 'footer_links_text_color');
        this.footerHeadersTextColor = this.store.get('theme', 'footer_headers_text_color');
        this.githubRepository = this.storeService.get('footer_github_releases');
        this.currentYear = (new Date()).getFullYear();
    }
    ngOnInit() {
        console.log(this.backgroundColor);
        this.perunwebpage = this.storeService.get('footer_perun_web_web');
        this.perunTeamWebpage = this.storeService.get('footer_perun_team_web');
        this.privacyPolicy = this.storeService.get('footer_privacy_policy_web');
        this.userDocumentationWebpage = this.storeService.get('footer_users_documentation_web');
        this.administratorDocumentationWebpage = this.storeService.get('footer_administrator_documentation');
        this.supportMail = this.storeService.get('footer_support_mail');
        this.version = version;
        this.copyright = this.storeService.get('footer_copyright');
    }
    openBugReportDialog() {
        const config = getDefaultDialogConfig();
        config.width = '550px';
        this.dialog.open(ReportIssueDialogComponent, config);
    }
};
PerunFooterComponent = __decorate([
    Component({
        selector: 'app-perun-footer',
        templateUrl: './perun-footer.component.html',
        styleUrls: ['./perun-footer.component.scss']
    }),
    __metadata("design:paramtypes", [StoreService,
        MatDialog,
        StoreService])
], PerunFooterComponent);
export { PerunFooterComponent };
//# sourceMappingURL=perun-footer.component.js.map