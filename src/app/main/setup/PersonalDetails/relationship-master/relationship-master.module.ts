import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RelationshipMasterComponent } from "./relationship-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: RelationshipMasterComponent,
    },
];

@NgModule({
    declarations: [RelationshipMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [RelationshipMasterComponent],
})
export class RelationshipMasterModule {}
