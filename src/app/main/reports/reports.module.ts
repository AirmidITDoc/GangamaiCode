import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SimplereportComponent } from './simplereport/simplereport.component';


const appRoutes: Routes = [
    {
        path: "simplereport",
        loadChildren: () =>
            import("./simplereport/simplereport.module").then(
                (m) => m.SimpleReportModule
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
