import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CashCounterMasterComponent } from "./cash-counter-master.component";

const routes: Routes = [
    {
        path: "**",
        component: CashCounterMasterComponent,
    },
];

@NgModule({
    declarations: [CashCounterMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CashCounterMasterComponent],
})
export class CashCounterMasterModule {}
