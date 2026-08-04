import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QrScanComponent } from './qr-scan.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: QrScanComponent }];
@NgModule({
  declarations: [QrScanComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class QrScanModule {}
