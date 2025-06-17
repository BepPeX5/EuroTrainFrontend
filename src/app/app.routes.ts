import { Routes } from '@angular/router';
import { SearchComponent } from './components/search-train/search-train';
import { ResultsComponent } from './components/results/results';
import { AdminComponent } from './components/admin/admin';
import {AdminTrainsComponent} from './components/admin-trains/admin-trains';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/trains', component: AdminTrainsComponent }
];
