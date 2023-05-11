import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiologyTemplateMasterComponent } from "./radiology-template-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: RadiologyTemplateMasterComponent,
    },
];

@NgModule({
    declarations: [RadiologyTemplateMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [RadiologyTemplateMasterComponent],
})
export class RadiologyTemplateMasterModule {}
