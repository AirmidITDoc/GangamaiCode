import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
    
    {
        path: "Account Master",
        loadChildren: () => import("./party-account/party-account.module").then((m) => m.PartyAccountModule),
    },
    // {
    //     path: "Brokers",
    //    loadChildren: () => import("./brokers/broker-master.module").then((m) => m.BrokerMasterModule),
       
    // },
    // {
    //     path: "Sizings",
    //     loadChildren: () => import("./sizing/sizing.module").then((m) => m.SizingModule),
    // },
  

];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class MasterModule { }
