import { Routes } from '@angular/router';
import { SearchComponent } from './components/search-train/search-train';
import { ResultsComponent } from './components/results/results';
import { AdminComponent } from './components/admin/admin';
import { AdminTrainsComponent } from './components/admin-trains/admin-trains';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings';
import { RiepilogoComponent } from './components/riepilogo/riepilogo';
import {PrenotaComponent} from './components/prenota/prenota';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'riepilogo', component: RiepilogoComponent },
  { path: 'prenota', component: PrenotaComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/trains', component: AdminTrainsComponent },
  { path: 'admin/bookings', component: AdminBookingsComponent }
];
