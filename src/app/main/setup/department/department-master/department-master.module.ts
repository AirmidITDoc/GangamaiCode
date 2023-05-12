import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DepartmentMasterComponent } from "./department-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DepartmentMasterComponent,
    },
];

@NgModule({
    declarations: [DepartmentMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DepartmentMasterComponent],
})
export class DepartmentMasterModule {}
