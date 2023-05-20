import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
   
    {
        path: "ipd-bill-browse-list",
        loadChildren: () =>
         
           import("./ip-bill-browse-list/ip-bill-browse.module").then((m) => m.IPBillBrowseModule),

        //    import("./ip-browseall-list/browse-alllist.module").then((m) => m.BrowseAlllistModule),
    },
   
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class IPRoutingModule { }
