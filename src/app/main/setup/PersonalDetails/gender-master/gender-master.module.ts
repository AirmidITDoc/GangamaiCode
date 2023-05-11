import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenderMasterComponent } from "./gender-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: GenderMasterComponent,
    },
];

@NgModule({
    declarations: [GenderMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [GenderMasterComponent],
})
export class GenderMasterModule {}
