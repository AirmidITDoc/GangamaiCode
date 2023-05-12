import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "department-master",
        loadChildren: () =>
            import("./department-master/department-master.module").then(
                (m) => m.DepartmentMasterModule
            ),
    },
    {
        path: "location-master",
        loadChildren: () =>
            import("./location-master/location-master.module").then(
                (m) => m.LocationMasterModule
            ),
    },
    {
        path: "ward-master",
        loadChildren: () =>
            import("./ward-master/ward-master.module").then(
                (m) => m.WardMasterModule
            ),
    },
    {
        path: "bed-master",
        loadChildren: () =>
            import("./bed-master/bed-master.module").then(
                (m) => m.BedMasterModule
            ),
    },
    {
        path: "dischargetype-master",
        loadChildren: () =>
            import("./dischargetype-master/dischargetype-master.module").then(
                (m) => m.DischargetypeMasterModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class DepartmentModule {}
