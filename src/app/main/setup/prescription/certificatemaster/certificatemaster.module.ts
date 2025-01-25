import { NgModule } from "@angular/core";
import { CertificatemasterComponent } from "./certificatemaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: CertificatemasterComponent,
    },
];

@NgModule({
    declarations: [CertificatemasterComponent],
    imports: [RouterModule.forChild(routes)]
})
export class CertificatemasterModule {}
