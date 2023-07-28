import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import Swal from 'sweetalert2';
import { OTRequestListComponent } from './ot-request-list/ot-request-list.component';


const appRoutes: Routes = [
  {
    path: "otreservationlist",
    loadChildren: () => import("./ot-request-list/ot-requestlist.module").then((m) => m.OTRequestlistModule),
  },
  {
    path: "otnotes",
    loadChildren: () => import("./ot-note/ot-note.module").then((m) => m.OTNoteModule),
  },
  {
    path: "otrequest",
    // component:OTRequestListComponent
    loadChildren: () => import("./ot-request-list/ot-requestlist.module").then((m) => m.OTRequestlistModule),
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class OtmanagementModule { }
