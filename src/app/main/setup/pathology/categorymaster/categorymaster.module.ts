import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategorymasterComponent } from "./categorymaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CategorymasterComponent,
    },
];

@NgModule({
    declarations: [CategorymasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CategorymasterComponent],
})
export class CategorymasterModule {}
