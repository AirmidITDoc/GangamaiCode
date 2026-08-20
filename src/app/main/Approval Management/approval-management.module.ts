import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router'; 

const appRoutes: Routes = [
  {
    path: "approvallist",
    loadChildren: () => import("./approval-list/approval-list.module").then((m) => m.ApprovalListModule)
  },

]; 

@NgModule({
  declarations: [],
  imports: [ 
    RouterModule.forChild(appRoutes) 
  ]
})
export class ApprovalManagementModule { } 
