import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";


import { ParameterDescriptiveMasterComponent } from './parameter-descriptive-master/parameter-descriptive-master.component';

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
    { 
        path: "vendor-master",
        loadChildren: () => import("./vendor-master/vendor-master.module").then((m) => m.VendorMasterModule),
    },
    {
        path: "producttype-master",

        loadChildren: () => import("./producttype-master/producttype-master.module").then((m) => m.ProducttypeMasterModule),
    },

    {
        path: "parameterDescriptive-master",
        loadChildren: () => import("./parameter-descriptive-master/parameter-descriptive-master.module").then((m) => m.ParameterDescriptiveMasterModule),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class DepartmentModule { }
