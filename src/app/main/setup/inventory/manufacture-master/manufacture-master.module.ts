import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManufactureMasterComponent } from "./manufacture-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ManufactureMasterComponent,
    },
];

@NgModule({
    declarations: [ManufactureMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ManufactureMasterComponent],
})
export class ManufactureMasterModule {}
