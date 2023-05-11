import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemGenericMasterComponent } from "./item-generic-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ItemGenericMasterComponent,
    },
];

@NgModule({
    declarations: [ItemGenericMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ItemGenericMasterComponent],
})
export class ItemGenericMasterModule {}
