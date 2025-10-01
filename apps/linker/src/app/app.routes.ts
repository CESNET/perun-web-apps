import { Routes } from '@angular/router';
import { ShowResultComponent } from './components/show-result/show-result.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'result',
    pathMatch: 'full',
  },
  {
    path: 'result/:result',
    component: ShowResultComponent,
  },
];
