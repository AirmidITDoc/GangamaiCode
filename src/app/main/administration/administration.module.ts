import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

const appRoutes: Routes = [
  {
      path: "create-user",
      loadChildren: () => import("./create-user/create-user.module").then((m) => m.CreateUserModule),
  },
  {
      path: "password-change",
     loadChildren: () => import("./password-change/password-change.module").then((m) => m.PasswordChangeModule),
  },
  {
    path: "system-configuration",
   loadChildren: () => import("./system-configuration/system-configuration.module").then((m) => m.SystemConfigurationModule),
  },
  {
    path: "role-template-master",
   loadChildren: () => import("./role-template-master/role-template-master.module").then((m) => m.RoleTemplateMasterModule),
  },
 
];


@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule
  ]
})
export class AdministrationModule { }
