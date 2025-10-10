import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  selector: 'perun-web-apps-loading-table',
  templateUrl: './loading-table.component.html',
  styleUrls: ['./loading-table.component.scss'],
})
export class LoadingTableComponent {}
