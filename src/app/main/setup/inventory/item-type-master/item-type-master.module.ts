import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemTypeMasterComponent } from "./item-type-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ItemTypeMasterComponent,
    },
];

@NgModule({
    declarations: [ItemTypeMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ItemTypeMasterComponent],
})
export class ItemTypeMasterModule {}
