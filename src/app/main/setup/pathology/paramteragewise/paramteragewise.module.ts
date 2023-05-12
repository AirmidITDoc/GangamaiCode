import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParamteragewiseComponent } from "./paramteragewise.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: ParamteragewiseComponent,
    },
];

@NgModule({
    declarations: [ParamteragewiseComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [ParamteragewiseComponent],
})
export class ParamteragewiseModule {}
