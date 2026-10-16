import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QrcodegeneratorModule } from 'app/main/purchase/good-receiptnote/qrcodegenerator/qrcodegenerator.module';
import { UploadComponent } from './upload.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: UploadComponent }];
@NgModule({
  declarations: [UploadComponent],
  imports: [SharedModule, QrcodegeneratorModule, RouterModule.forChild(routes)],
})
export class UploadModule {}
