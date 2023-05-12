import { NgModule } from "@angular/core";

import { WardMasterComponent } from "./ward-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: WardMasterComponent,
    },
];

@NgModule({
    declarations: [WardMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [WardMasterComponent],
})
export class WardMasterModule {}
