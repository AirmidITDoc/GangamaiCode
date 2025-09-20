import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [    
  {
      path: "expenses",
       loadChildren: () => import("./expenses/expenses.module").then((m) => m.ExpensesModule),
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class ManagmentModule { }
