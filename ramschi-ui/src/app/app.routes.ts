import { Routes } from '@angular/router';
import { RamschiListComponent } from './ramschi/ramschi-list/ramschi-list.component';
import { RamschiDetailComponent } from './ramschi/ramschi-detail/ramschi-detail.component';
import { NewAssigneeComponent } from './ramschi/new-assignee/new-assignee.component';

export const routes: Routes = [
    { path: "", component: RamschiListComponent },
    { path: "ramsch", component: RamschiDetailComponent },
    { path: "ramsch/:id", component: RamschiDetailComponent },
    { path: "neu", component: NewAssigneeComponent },
];
