import { NgModule } from "@angular/core";

import { DoctorMasterComponent } from "./doctor-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DoctorMasterComponent,
    },
];

@NgModule({
    declarations: [DoctorMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DoctorMasterComponent],
})
export class DoctorMasterModule {}
