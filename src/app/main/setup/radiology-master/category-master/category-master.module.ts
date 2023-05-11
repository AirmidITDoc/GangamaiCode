import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryMasterComponent } from "./category-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CategoryMasterComponent,
    },
];

@NgModule({
    declarations: [CategoryMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CategoryMasterComponent],
})
export class CategoryMasterModule {}
