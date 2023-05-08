import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
    {
        path: "admission",
        loadChildren: () =>
            
            // import("./ip-bill-browse-list/ip-bill-browse.module").then((m) => m.IPBillBrowseModule),

            import("./Admission/admission/admission.module").then((m) => m.AdmissionModule),
    },
    {
        path: "discharge",
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
           
    },
    {
        path: "ipadvance",
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
    },
    {
        path: "refund",
        loadChildren: () =>import("./Refund/ip-refund/ip-refund.module").then((m) => m.IPRefundModule),
    },

    {
        path: "add-billing",
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
            
    },
    {
        path: "ip-advance-browse",
        loadChildren: () =>
            // import("./ip-advance-browse/ip-advance.module").then((m) => m.IpAdvanceBrowseModule),
            import("./browse-ipadvance/browse-ipadvance.module").then((m) => m.BrowseIPAdvanceModule),
    },
    {
        path: "ipd-bill-browse-list",
        loadChildren: () =>
         
           import("./ip-bill-browse-list/ip-bill-browse.module").then((m) => m.IPBillBrowseModule),

        //    import("./ip-browseall-list/browse-alllist.module").then((m) => m.BrowseAlllistModule),
    },
   
    {
         path: "companysettlement", 
         loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class IPRoutingModule { }
