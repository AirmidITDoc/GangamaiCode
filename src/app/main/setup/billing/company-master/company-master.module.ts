import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CompanyMasterComponent } from "./company-master.component";

const routes: Routes = [
    {
        path: "**",
        component: CompanyMasterComponent,
    },
];

@NgModule({
    declarations: [CompanyMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CompanyMasterComponent],
})
export class CompanyMasterModule {}
