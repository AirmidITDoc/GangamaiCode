import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrescriptionclassmasterComponent } from "./prescriptionclassmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: PrescriptionclassmasterComponent,
    },
];

@NgModule({
    declarations: [PrescriptionclassmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [PrescriptionclassmasterComponent],
})
export class PrescriptionclassmasterModule {}
