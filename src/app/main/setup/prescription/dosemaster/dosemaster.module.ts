import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DosemasterComponent } from "./dosemaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: DosemasterComponent,
    },
];

@NgModule({
    declarations: [DosemasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [DosemasterComponent],
})
export class DosemasterModule {}
