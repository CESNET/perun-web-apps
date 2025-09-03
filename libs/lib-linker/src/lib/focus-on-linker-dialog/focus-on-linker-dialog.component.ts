import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-focus-on-linker-dialog',
  templateUrl: './focus-on-linker-dialog.component.html',
  styleUrls: ['./focus-on-linker-dialog.component.css'],
})
export class FocusOnLinkerDialogComponent {}
