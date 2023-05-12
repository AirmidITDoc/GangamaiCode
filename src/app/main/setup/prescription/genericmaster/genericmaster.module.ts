import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericmasterComponent } from "./genericmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: GenericmasterComponent,
    },
];

@NgModule({
    declarations: [GenericmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [GenericmasterComponent],
})
export class GenericmasterModule {}
