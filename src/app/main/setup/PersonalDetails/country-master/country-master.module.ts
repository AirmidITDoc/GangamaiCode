import { NgModule } from "@angular/core";

import { CountryMasterComponent } from "./country-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CountryMasterComponent,
    },
];

@NgModule({
    declarations: [CountryMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CountryMasterComponent],
})
export class CountryMasterModule {}
