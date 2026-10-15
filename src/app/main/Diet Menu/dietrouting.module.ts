import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

    // {
    //     path: "assessment",
    //     loadChildren: () => import("./patient-dietassessment/diet-assessment.module").then((m) => m.DietAssessmentModule),

    // },
    // {
    //     path: "creation",
    //     loadChildren: () => import("./patient-diet-creation/diet-creation.module").then((m) => m.DietCreationModule),

    // },
    // {
    //     path: "addonmenu",
    //     loadChildren: () => import("./patient-addon-menu/addon-menu.module").then((m) => m.AddonMenuModule),

    // },
    // {
    //     path: "dashboard",
    //     loadChildren: () => import("./diet-dashboard/dietdashboard.module").then((m) => m.DietdashboardModule),
    // }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
        
    ]
})
export class DietroutingModule { }
