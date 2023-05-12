import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "personaldetail",
        loadChildren: () =>
            import("./PersonalDetails/personaldetail.module").then(
                (m) => m.PersonaldetailModule
            ),
    },
    {
        path: "billing",
        loadChildren: () =>
            import("./billing/billing.module").then((m) => m.BillingModule),
    },
    {
        path: "department",
        loadChildren: () =>
            import("./department/department.module").then(
                (m) => m.DepartmentModule
            ),
    },
    {
        path: "doctor",
        loadChildren: () =>
            import("./doctor/doctor.module").then((m) => m.DoctorModule),
    },
    {
        path: "prescription",
        loadChildren: () =>
            import("./prescription/prescription.module").then(
                (m) => m.PrescriptionModule
            ),
    },
    {
        path: "pathology",
        loadChildren: () =>
            import("./pathology/pathology.module").then(
                (m) => m.PathologyModule
            ),
    },
    {
        path: "radiology-master",
        loadChildren: () =>
            import("./radiology-master/radiology-master.module").then(
                (m) => m.RadiologyMasterModule
            ),
    },
    {
        path: "inventory",
        loadChildren: () =>
            import("./inventory/inventory.module").then(
                (m) => m.InventoryModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class SetupModule {}
