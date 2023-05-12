import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrugmasterComponent } from "./drugmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DrugmasterComponent,
    },
];

@NgModule({
    declarations: [DrugmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DrugmasterComponent],
})
export class DrugmasterModule {}
