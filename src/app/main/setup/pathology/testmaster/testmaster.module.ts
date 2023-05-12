import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TestmasterComponent } from "./testmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: TestmasterComponent,
    },
];

@NgModule({
    declarations: [TestmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [TestmasterComponent],
})
export class TestmasterModule {}
