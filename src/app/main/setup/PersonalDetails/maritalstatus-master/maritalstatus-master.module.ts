import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MaritalstatusMasterComponent } from "./maritalstatus-master.component";

const routes: Routes = [
    {
        path: "**",
        component: MaritalstatusMasterComponent,
    },
];

@NgModule({
    declarations: [MaritalstatusMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [MaritalstatusMasterComponent],
})
export class MaritalstatusMasterModule {}
