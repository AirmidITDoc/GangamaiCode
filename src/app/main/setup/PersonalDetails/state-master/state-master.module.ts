import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StateMasterComponent } from "./state-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: StateMasterComponent,
    },
];

@NgModule({
    declarations: [StateMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [StateMasterComponent],
})
export class StateMasterModule {}
