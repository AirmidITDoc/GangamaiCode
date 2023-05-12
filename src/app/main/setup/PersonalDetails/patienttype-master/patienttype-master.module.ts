import { NgModule } from "@angular/core";

import { PatienttypeMasterComponent } from "./patienttype-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: PatienttypeMasterComponent,
    },
];

@NgModule({
    declarations: [PatienttypeMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [PatienttypeMasterComponent],
})
export class PatienttypeMasterModule {}
