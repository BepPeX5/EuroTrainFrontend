import { Routes } from '@angular/router';
import { SearchComponent } from './components/search-train/search-train';
import { ResultsComponent } from './components/results/results';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'admin-login-callback', component: AdminComponent },
  { path: 'admin', component: AdminComponent }
];
