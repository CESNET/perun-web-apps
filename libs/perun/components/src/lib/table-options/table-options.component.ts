import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableExporterDirective} from 'mat-table-exporter';

@Component({
  selector: 'perun-web-apps-table-options',
  templateUrl: './table-options.component.html',
  styleUrls: ['./table-options.component.scss']
})
export class TableOptionsComponent implements OnInit {

  constructor() { }

  @Input()
  exporter: MatTableExporterDirective;

  // tslint:disable-next-line:no-output-native
  @Output()
  start = new EventEmitter();

  // tslint:disable-next-line:no-output-native
  @Output()
  end = new EventEmitter();

  ngOnInit(): void {
    this.exporter.exportStarted.subscribe(() => {this.start.emit();});
    this.exporter.exportCompleted.subscribe(() => this.end.emit());
  }
}
