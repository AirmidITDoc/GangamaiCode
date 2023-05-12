import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ConcessionReasonMasterComponent } from "./concession-reason-master.component";

const routes: Routes = [
    {
        path: "**",
        component: ConcessionReasonMasterComponent,
    },
];

@NgModule({
    declarations: [ConcessionReasonMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ConcessionReasonMasterComponent],
})
export class ConcessionReasonMasterModule {}
