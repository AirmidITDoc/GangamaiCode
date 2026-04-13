import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";



const appRoutes: Routes = [
    {
        path: "helpdeskdetail",
        loadChildren: () =>
            import("./complaint-list.module").then(
                (m) => m.ComplaintListModule
            ),
    },
    // {
    //     path: "dietplan",
    //     loadChildren: () =>
    //         import("./diet-plan/dietplan.module").then(
    //             (m) => m.DietplanModule
    //         ),
            
    // }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class RouteHelpdeskModule { }
