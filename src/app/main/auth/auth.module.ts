import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

const routes = [
    {
        path: "login",
        loadChildren: () =>
            import("./login/login.module").then((m) => m.LoginModule),
    },
    {
        path: "register",
        loadChildren: () =>
            import("./register/register.module").then((m) => m.RegisterModule),
    },
    // {
    //     path: "chat",
    //     loadChildren: () =>
    //         import("./chat/chat.module").then((m) => m.ChatModule),
    // },
    // {
    //     path        : 'dashboards/analytics',
    //     loadChildren: () => import('./dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    // },
    // {
    //     path        : 'dashboards/project',
    //     loadChildren: () => import('./dashboards/project/project.module').then(m => m.ProjectDashboardModule)
    // },
    {
        path        : 'menu-configure/menu-list',
        loadChildren: () => import('./menu-configure/menu.module').then(m => m.MenuModule)
    },
    {
        path: "menu-main",
        loadChildren: () =>
            import("./menu-configure/menu.module").then((m) => m.MenuModule),
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class AuthModule { }
