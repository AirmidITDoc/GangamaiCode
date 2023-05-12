import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParametermasterComponent } from "./parametermaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ParametermasterComponent,
    },
];

@NgModule({
    declarations: [ParametermasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ParametermasterComponent],
})
export class ParametermasterModule {}
