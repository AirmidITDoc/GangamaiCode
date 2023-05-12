import { NgModule } from "@angular/core";

import { BedMasterComponent } from "./bed-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: BedMasterComponent,
    },
];

@NgModule({
    declarations: [BedMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [BedMasterComponent],
})
export class BedMasterModule {}
