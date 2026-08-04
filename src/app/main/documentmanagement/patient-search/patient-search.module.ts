import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PatientSearchComponent } from './patient-search.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: PatientSearchComponent }];
@NgModule({
  declarations: [PatientSearchComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PatientSearchModule {}
