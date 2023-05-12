import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupplierMasterComponent } from "./supplier-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: SupplierMasterComponent,
    },
];

@NgModule({
    declarations: [SupplierMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [SupplierMasterComponent],
})
export class SupplierMasterModule {}
