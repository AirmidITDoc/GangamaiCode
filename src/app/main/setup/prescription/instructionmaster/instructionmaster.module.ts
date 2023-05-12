import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InstructionmasterComponent } from "./instructionmaster.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: "**",
        component: InstructionmasterComponent,
    },
];

@NgModule({
    declarations: [InstructionmasterComponent],
    imports: [RouterModule.forChild(routes)],
    entryComponents: [InstructionmasterComponent],
})
export class InstructionmasterModule {}
