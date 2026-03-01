import { Component, OnInit } from '@angular/core';
import { EntityStorageService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-application-detail-new-component',
  templateUrl: 'application-detail-new.component.html',
  styleUrls: ['application-detail-new.component.scss'],
  standalone: true,
})
export class ApplicationDetailNewComponent implements OnInit {
  constructor(private entityStorageService: EntityStorageService) {}

  ngOnInit(): void {
    return;
  }
}
