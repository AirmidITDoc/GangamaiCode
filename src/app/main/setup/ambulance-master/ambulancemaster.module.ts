import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";


const appRoutes: Routes = [
    {
        path: "Vehicle",
        loadChildren: () =>
            import("./vechical-master/vechical.module").then(
                (m) => m.VechicalModule
            ),
    },
    {
        path: "driver",
        loadChildren: () =>
            import("./driver-master/drivermaster.module").then(
                (m) => m.DrivermasterModule
            ),
    },
    //  {
    //         path: "doctorshare",
    //         loadChildren: () =>
    //             import("./doctor-payoutpercentage/doctor-payout.module").then(
    //                 (m) => m.DoctorPayoutModule
    //             ),
    //     },

];

@NgModule({
    declarations: [

    ],
    imports: [RouterModule.forChild(appRoutes)],
})
export class AmbulancemasterModule { }
