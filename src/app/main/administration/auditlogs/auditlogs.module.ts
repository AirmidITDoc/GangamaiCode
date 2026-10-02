import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditlogsComponent } from './auditlogs.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatToolbarModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
          DatePipe
  ]
})
export class AuditlogsModule { }
