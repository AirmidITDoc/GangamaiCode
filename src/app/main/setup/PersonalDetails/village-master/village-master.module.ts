import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VillageMasterComponent } from "./village-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: VillageMasterComponent,
    },
];

@NgModule({
    declarations: [VillageMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [VillageMasterComponent],
})
export class VillageMasterModule {}
