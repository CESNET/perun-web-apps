import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'perun-web-apps-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  @Output()
  sidenavToggle = new EventEmitter();

  ngOnInit() {
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
