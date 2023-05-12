import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CityMasterComponent } from "./city-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CityMasterComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
})
export class CityMasterModule {}
