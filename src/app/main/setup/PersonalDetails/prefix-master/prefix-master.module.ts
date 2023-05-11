import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrefixMasterComponent } from "./prefix-master.component";

const routes: Routes = [
    {
        path: "**",
        component: PrefixMasterComponent,
    },
];

@NgModule({
    declarations: [PrefixMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [PrefixMasterComponent],
})
export class PrefixMasterModule {}
