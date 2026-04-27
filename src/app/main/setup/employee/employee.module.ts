import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "emp-master",
    loadChildren: () =>
      import("./employee-master/employee-master.module").then(
        (m) => m.EmployeeMasterModule
      ),
  },
  {
    path: "emp-department",
    loadChildren: () =>
      import("./employee-department/employee-department.module").then(
        (m) => m.EmployeeDepartmentModule
      ),
  },
  {
    path: "emp-designation",
    loadChildren: () =>
      import("./employee-designation/employee-designation.module").then(
        (m) => m.EmployeeDesignationModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(appRoutes)],
})
export class EmployeeModule { }
