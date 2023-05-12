import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ServiceMasterComponent } from "./service-master.component";

const routes: Routes = [
    {
        path: "**",
        component: ServiceMasterComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ServiceMasterComponent],
})
export class ServiceMasterModule {}
