import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ResourceState, Task } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDivider,
    MatTableModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-state-tab',
  templateUrl: './state-tab.component.html',
  styleUrls: ['./state-tab.component.scss'],
})
export class StateTabComponent implements OnChanges {
  @Input()
  propagation: ResourceState[] = [];
  @Input()
  loading = false;
  datasources: MatTableDataSource<Task>[] = [];
  displayedColumns = ['id', 'service', 'status', 'scheduled', 'started', 'ended'];

  getErrorCountStates(resourceStatus: ResourceState): number {
    let counter = 0;
    for (const task of resourceStatus.taskList) {
      if (task.status === 'ERROR' || task.status === 'GENERROR' || task.status === 'SENDERROR') {
        counter++;
      }
    }
    return counter;
  }

  getDataSource(): void {
    this.datasources = [];
    for (const resourceState of this.propagation) {
      this.datasources.push(new MatTableDataSource(resourceState.taskList));
    }
  }

  ngOnChanges(): void {
    this.getDataSource();
  }
}
