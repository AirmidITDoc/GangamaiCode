import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CompanyTypeMasterComponent } from "./company-type-master.component";

const routes: Routes = [
    {
        path: "**",
        component: CompanyTypeMasterComponent,
    },
];

@NgModule({
    declarations: [CompanyTypeMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [CompanyTypeMasterComponent],
})
export class CompanyTypeMasterModule {}
