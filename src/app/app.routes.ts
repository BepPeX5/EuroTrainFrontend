import { Routes } from '@angular/router';
import { SearchComponent } from './components/search-train/search-train';
import { ResultsComponent } from './components/results/results';
import { AdminComponent } from './components/admin/admin';
import { AdminTrainsComponent } from './components/admin-trains/admin-trains';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings';
import { RiepilogoComponent } from './components/riepilogo/riepilogo';
import {PrenotaComponent} from './components/prenota/prenota';
import {PagamentoComponent} from './components/pagamento/pagamento';
import {PrenotazioneCompletataComponent} from './components/prenotazione-completata/prenotazione-completata';
import {RecupPrenoPersonaliComponent} from './components/recup-preno-personali/recup-preno-personali';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'riepilogo', component: RiepilogoComponent },
  { path: 'prenota', component: PrenotaComponent },
  { path: 'pagamento', component: PagamentoComponent },
  { path: 'prenotazione-completata', component: PrenotazioneCompletataComponent },
  { path: 'recup-preno-personali', component: RecupPrenoPersonaliComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/trains', component: AdminTrainsComponent },
  { path: 'admin/bookings', component: AdminBookingsComponent }
];
