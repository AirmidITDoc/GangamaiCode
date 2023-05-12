import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UnitmasterComponent } from "./unitmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: UnitmasterComponent,
    },
];

@NgModule({
    declarations: [UnitmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [UnitmasterComponent],
})
export class UnitmasterModule {}
