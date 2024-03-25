import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';



const appRoutes: Routes = [
    // {
    //     path: "simplereport",
    //     loadChildren: () =>
    //         import("./simplereport/simplereport.module").then(
    //             (m) => m.SimpleReportModule
    //         ),
    // },
    {
        path: "pharmacyreport",
        loadChildren: () =>
            import("./pharmacy-report/pharmacyreport.module").then(
                (m) => m.PharmacyreportModule
            ),
        // loadChildren: () =>
        // import("./simplereport/simplereport.module").then(
        //     (m) => m.SimpleReportModule
        // ),
    },

    // {
    //     path: "pharmacyreport",
    //     loadChildren: () =>
    //         import("./opipbill-reports/opipbill.module").then(
    //             (m) => m.OPIPBillModule
    //         ),
    // },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule, RouterModule.forChild(appRoutes)
    ]
})
export class ReportsModule { }
