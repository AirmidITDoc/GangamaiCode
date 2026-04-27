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
    {
        path: "otmanagment",
        loadChildren: () =>
            import("./OTManagement/otmanagement.module").then(
                (m) => m.OTManagementModule
            ),
    },
    {
        path: "nursing",
        loadChildren: () =>
            import("./nursing-master/nursing-master.module").then(
                (m) => m.NursingMasterModule
            ),
    },
    {
        path: "ambulance",
        loadChildren: () =>
            import("./ambulance-master/ambulancemaster.module").then(
                (m) => m.AmbulancemasterModule
            ),
    },
    ,
    {
        path: "Canteen",
        loadChildren: () =>
            import("./Canteen_Master/canteen-master.module").then(
                (m) => m.CanteenMasterModule
            ),
    },
    {
        path: "employee",
        loadChildren: () =>
            import("./employee/employee.module").then((m) => m.EmployeeModule),
    },
];

@NgModule({
    declarations: [
  ],
    imports: [RouterModule.forChild(appRoutes)],
})
export class SetupModule { }
