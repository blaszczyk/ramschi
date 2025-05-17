import { Routes } from '@angular/router';
import { RamschiListComponent } from './ramschi/ramschi-list/ramschi-list.component';
import { RamschiDetailComponent } from './ramschi/ramschi-detail/ramschi-detail.component';
import { AdminComponent } from './ramschi/admin/admin.component';
import { EliminatorComponent } from './ramschi/eliminator/eliminator.component';

export const routes: Routes = [
  { path: '', component: RamschiListComponent },
  { path: 'ramsch', component: RamschiDetailComponent },
  { path: 'ramsch/:id', component: RamschiDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/sauber', component: EliminatorComponent },
];
