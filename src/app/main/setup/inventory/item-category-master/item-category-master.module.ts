import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemCategoryMasterComponent } from "./item-category-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ItemCategoryMasterComponent,
    },
];

@NgModule({
    declarations: [ItemCategoryMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ItemCategoryMasterComponent],
})
export class ItemCategoryMasterModule {}
