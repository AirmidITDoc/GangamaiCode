import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UomMasterComponent } from "./uom-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: UomMasterComponent,
    },
];

@NgModule({
    declarations: [UomMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [UomMasterComponent],
})
export class UomMasterModule {}
