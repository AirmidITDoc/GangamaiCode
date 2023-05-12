import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { GroupMasterComponent } from "./group-master.component";

const routes: Routes = [
    {
        path: "**",
        component: GroupMasterComponent,
    },
];

@NgModule({
    declarations: [GroupMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [GroupMasterComponent],
})
export class GroupMasterModule {}
