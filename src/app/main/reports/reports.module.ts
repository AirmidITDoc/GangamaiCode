import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { IpReportComponent } from './ip-report/ip-report.component';
// import { IpBillingReportComponent } from './ip-billing-report/ip-billing-report.component';
// import { OPBillingReportComponent } from './opbilling-report/opbilling-report.component';
import { CommonReportComponent } from './common-report/common-report.component';
 // loadChildren: () =>
        //     import("./opbilling-report/opbillingreport.module").then(
        //         (m) => m.OpbillingreportModule
        //     ),
const appRoutes: Routes = [
    {
        path: "opbillingreport",
        loadChildren: () =>
            import("./op-reports/opreports.module").then(
                (m) => m.OPReportsModule
            ),
    },
    {
        path: "pharmacyreport",
        loadChildren: () =>
            import("./pharmacy-report/pharmacyreport.module").then(
                (m) => m.PharmacyreportModule
            ),

    },
    {
        path: "ipreport",
        loadChildren: () =>
            import("./ip-report/ipreort.module").then(
                (m) => m.IPReortModule
            ),
    },
    {
        path: "ipmisreports",
        loadChildren: () =>
            import("./ip-report/ipreort.module").then(
                (m) => m.IPReortModule
            ),
    },
    {
        path: "ipbillingreport",
        loadChildren: () =>
            import("./ip-report/ipreort.module").then(
                (m) => m.IPReortModule
            ),
    },
    {
        path: "opreports",
        loadChildren: () =>
            import("./op-reports/opreports.module").then(
                (m) => m.OPReportsModule
            ),
    },
    {
        path: "opmisreports",
        loadChildren: () =>
            import("./op-reports/opreports.module").then(
                (m) => m.OPReportsModule
            ),
    },
   {
        path: "commanreport",
        loadChildren: () =>
            import("./common-report/common-report.module").then(
                (m) => m.CommonReportModule
            ),
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule, RouterModule.forChild(appRoutes)
    ]
})
export class ReportsModule { }
