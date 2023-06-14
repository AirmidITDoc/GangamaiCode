import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './create-user.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '**',
      component: CreateUserComponent,
  },
];

@NgModule({
  declarations: [CreateUserComponent],
  imports: [
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    CreateUserComponent,
]
})
export class CreateUserModule { }
