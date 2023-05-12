import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SubtpaCompanyMasterComponent } from "./subtpa-company-master.component";

const routes: Routes = [
    {
        path: "**",
        component: SubtpaCompanyMasterComponent,
    },
];

@NgModule({
    declarations: [SubtpaCompanyMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [SubtpaCompanyMasterComponent],
})
export class SubtpaCompanyMasterModule {}
