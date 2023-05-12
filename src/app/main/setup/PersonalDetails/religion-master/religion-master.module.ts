import { NgModule } from "@angular/core";

import { ReligionMasterComponent } from "./religion-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ReligionMasterComponent,
    },
];

@NgModule({
    declarations: [ReligionMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ReligionMasterComponent],
})
export class ReligionMasterModule {}
