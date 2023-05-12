import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiologyTestMasterComponent } from "./radiology-test-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: RadiologyTestMasterComponent,
    },
];

@NgModule({
    declarations: [RadiologyTestMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [RadiologyTestMasterComponent],
})
export class RadiologyTestMasterModule {}
