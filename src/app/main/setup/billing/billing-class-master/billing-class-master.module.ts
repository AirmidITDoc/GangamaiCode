import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { BillingClassMasterComponent } from "./billing-class-master.component";

const routes: Routes = [
    {
        path: "**",
        component: BillingClassMasterComponent,
    },
];

@NgModule({
    declarations: [BillingClassMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [BillingClassMasterComponent],
})
export class BillingClassMasterModule {}
