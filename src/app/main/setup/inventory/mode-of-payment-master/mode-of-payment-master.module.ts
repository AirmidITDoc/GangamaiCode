import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModeOfPaymentMasterComponent } from "./mode-of-payment-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ModeOfPaymentMasterComponent,
    },
];

@NgModule({
    declarations: [ModeOfPaymentMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ModeOfPaymentMasterComponent],
})
export class ModeOfPaymentMasterModule {}
