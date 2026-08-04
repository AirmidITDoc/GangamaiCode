import { NgModule } from '@angular/core';
import { DocumentsComponent } from './documents.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: DocumentsComponent }];
@NgModule({
  declarations: [DocumentsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class DocumentsModule {}
