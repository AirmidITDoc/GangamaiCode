import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BankMasterComponent } from "./bank-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: BankMasterComponent,
    },
];

@NgModule({
    declarations: [BankMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [BankMasterComponent],
})
export class BankMasterModule {}
