import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreMasterComponent } from "./store-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: StoreMasterComponent,
    },
];

@NgModule({
    declarations: [StoreMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [StoreMasterComponent],
})
export class StoreMasterModule {}
