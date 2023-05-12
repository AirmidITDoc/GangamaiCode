import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TemplatemasterComponent } from "./templatemaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: TemplatemasterComponent,
    },
];

@NgModule({
    declarations: [TemplatemasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TemplatemasterComponent],
})
export class TemplatemasterModule {}
