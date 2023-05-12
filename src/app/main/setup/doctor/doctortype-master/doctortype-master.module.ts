import { NgModule } from "@angular/core";

import { DoctortypeMasterComponent } from "./doctortype-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DoctortypeMasterComponent,
    },
];

@NgModule({
    declarations: [DoctortypeMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DoctortypeMasterComponent],
})
export class DoctortypeMasterModule {}
