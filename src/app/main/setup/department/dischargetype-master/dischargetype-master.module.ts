import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DischargetypeMasterComponent } from "./dischargetype-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DischargetypeMasterComponent,
    },
];

@NgModule({
    declarations: [DischargetypeMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DischargetypeMasterComponent],
})
export class DischargetypeMasterModule {}
