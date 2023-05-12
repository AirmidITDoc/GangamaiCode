import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SubGroupMasterComponent } from "./sub-group-master.component";

const routes: Routes = [
    {
        path: "**",
        component: SubGroupMasterComponent,
    },
];

@NgModule({
    declarations: [SubGroupMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [SubGroupMasterComponent],
})
export class SubGroupMasterModule {}
