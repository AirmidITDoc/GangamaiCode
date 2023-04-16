import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { FuseSharedModule } from "@fuse/shared.module";

import { LoginComponent } from "app/main/auth/login/login.component";

const routes = [
    {
        path: '**',
        component: LoginComponent,
    },
];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
    ],
})
export class LoginModule { }
