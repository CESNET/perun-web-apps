import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from '../../../../models/src/lib/MenuItem';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu-buttons-field',
  templateUrl: './menu-buttons-field.component.html',
  styleUrls: ['./menu-buttons-field.component.scss']
})
export class MenuButtonsFieldComponent implements OnInit {

  constructor(public dialog: MatDialog,
              protected route: ActivatedRoute) { }

  @Input()
  items: MenuItem[];

  @Input()
  size = 'large';

  voId: number;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.voId = params['voId'];
    });
  }

}

