import { NgModule } from '@angular/core';



import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
   
    {
        path: "admission",
        loadChildren: () =>
            import("./Admission/admission/admission.module").then((m) => m.AdmissionModule),
    },
    {
        path: "ipadvance",
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
    },
    {
        path: "ip-advance-browse", 
        loadChildren: () =>
        import("./browse-ip-advance/browse-ip-advance.module").then((m) => m.BrowseIpAdvanceModule),
    },
    {
        path: "ip-casepaper",
        loadChildren: () =>
        import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
    },
    {
        path: "ip-refund-browse",
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
    },
    // {
    //     path: "refund",
    //     loadChildren: () =>import("./Refund/ip-refund/ip-refund.module").then((m) => m.IPRefundModule),
    // },
    {
        path: "ipd-bill-browse-list",
        loadChildren: () =>
       import("./ip-bill-browse-list/ip-bill-browse.module").then((m) => m.IPBillBrowseModule),
    },
    {
        path: "ipd-browse-receipt",
        loadChildren: () =>
           import("./ip-bill-browse-list/ip-bill-browse.module").then((m) => m.IPBillBrowseModule),
    },
    {
        path: "discharge",
        loadChildren: () =>
        import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
           
    },
    {
        path: "dischargesummary",
        loadChildren: () =>
        import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
         
    },
   
    {
        path: "add-billing",
        loadChildren: () =>
        import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
            // this.Routes.navigate(['ipd/ip-search-list/ip-billing']);
    },
     {
         path: "ip-addCharges", 
         loadChildren: () =>
         import("./ip-settlement/ip-settlement.module").then((m) => m.IPSettlementModule),
        },
        // {
        //     path: "browserefundofbill",
        //     loadChildren: () =>
        //     import("./Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.module").then((m) => m.IPBrowseRefundofBillModule),
               
        // },
        // {
        //     path: "browserefundofadvance",
        //     loadChildren: () =>
        //     import("./Refund/ip-refund/ip-browse-refundof-advance/ip-browse-refundof-advance.module").then((m) => m.IPBrowseRefundofAdvanceModule),
               
       // },
        {
            path: "companylist",
            loadChildren: () =>
            import("./company-list/company-list.module").then((m) => m.CompanyListModule),
               
        },

    {
        path: "refundofbill", 
        loadChildren: () =>
            import("./ip-search-list/ip-searchlist.module").then((m) => m.IPSearchlistModule),
   }

];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class IPRoutingModule { }
