import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaxMasterComponent } from "./tax-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: TaxMasterComponent,
    },
];

@NgModule({
    declarations: [TaxMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TaxMasterComponent],
})
export class TaxMasterModule {}
