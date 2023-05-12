import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemClassMasterComponent } from "./item-class-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ItemClassMasterComponent,
    },
];

@NgModule({
    declarations: [ItemClassMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ItemClassMasterComponent],
})
export class ItemClassMasterModule {}
