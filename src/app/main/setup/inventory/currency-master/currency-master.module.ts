import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyMasterComponent } from "./currency-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CurrencyMasterComponent,
    },
];

@NgModule({
    declarations: [CurrencyMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CurrencyMasterComponent],
})
export class CurrencyMasterModule {}
