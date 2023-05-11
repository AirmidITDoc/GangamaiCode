import { NgModule } from "@angular/core";

import { LocationMasterComponent } from "./location-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: LocationMasterComponent,
    },
];

@NgModule({
    declarations: [LocationMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [LocationMasterComponent],
})
export class LocationMasterModule {}
