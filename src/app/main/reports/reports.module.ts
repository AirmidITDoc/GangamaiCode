import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SimplereportComponent } from './simplereport/simplereport.component';
import { PharmacyReportComponent } from './pharmacy-report/pharmacy-report.component';


const appRoutes: Routes = [
    {
        path: "simplereport",
        loadChildren: () =>
            import("./simplereport/simplereport.module").then(
                (m) => m.SimpleReportModule
            ),
    },
    {
        path: "pharmacyreport",
        loadChildren: () =>
            import("./pharmacy-report/pharmacyreport.module").then(
                (m) => m.PharmacyreportModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule, RouterModule.forChild(appRoutes)
    ]
})
export class ReportsModule { }
