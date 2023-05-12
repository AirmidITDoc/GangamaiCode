import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemMasterComponent } from "./item-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ItemMasterComponent,
    },
];

@NgModule({
    declarations: [ItemMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ItemMasterComponent],
})
export class ItemMasterModule {}
