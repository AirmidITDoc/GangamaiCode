import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AreaMasterComponent } from "./area-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: AreaMasterComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [AreaMasterComponent],
})
export class AreaMasterModule {}
