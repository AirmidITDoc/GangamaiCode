import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TermsOfPaymentMasterComponent } from "./terms-of-payment-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: TermsOfPaymentMasterComponent,
    },
];

@NgModule({
    declarations: [TermsOfPaymentMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TermsOfPaymentMasterComponent],
})
export class TermsOfPaymentMasterModule {}
