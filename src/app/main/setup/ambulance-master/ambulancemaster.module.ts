import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { VechicalMasterComponent } from './vechical-master/vechical-master.component';
import { DriverMasterComponent } from './driver-master/driver-master.component';
import { NewVechicalComponent } from './vechical-master/new-vechical/new-vechical.component';
import { NewDriverComponent } from './driver-master/new-driver/new-driver.component';


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
