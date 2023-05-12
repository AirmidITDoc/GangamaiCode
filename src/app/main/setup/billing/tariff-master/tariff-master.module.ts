import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TariffMasterComponent } from "./tariff-master.component";

const routes: Routes = [
    {
        path: "**",
        component: TariffMasterComponent,
    },
];

@NgModule({
    declarations: [TariffMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TariffMasterComponent],
})
export class TariffMasterModule {}
