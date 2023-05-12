import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "doctortype-master",
        loadChildren: () =>
            import("./doctortype-master/doctortype-master.module").then(
                (m) => m.DoctortypeMasterModule
            ),
    },
    {
        path: "doctor-master",
        loadChildren: () =>
            import("./doctor-master/doctor-master.module").then(
                (m) => m.DoctorMasterModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class DoctorModule {}
