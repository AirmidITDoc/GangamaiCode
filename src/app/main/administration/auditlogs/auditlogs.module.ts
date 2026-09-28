import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditlogsComponent } from './auditlogs.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

const routes: Routes = [
    {
        path: "**",
        component: AuditlogsComponent,
    },
];

@NgModule({
  declarations: [AuditlogsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatToolbarModule
  ]
})
export class AuditlogsModule { }
