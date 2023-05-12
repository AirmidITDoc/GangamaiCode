import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TalukaMasterComponent } from "./taluka-master.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: TalukaMasterComponent,
    },
];

@NgModule({
    declarations: [TalukaMasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TalukaMasterComponent],
})
export class TalukaMasterModule {}
