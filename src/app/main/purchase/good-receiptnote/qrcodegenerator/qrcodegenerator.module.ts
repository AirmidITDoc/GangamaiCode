import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule as MainSharedModule } from 'app/main/shared/shared.module';
import { NgxPrintModule } from 'ngx-print';
import { QrcodegeneratorComponent } from './qrcodegenerator.component';

@NgModule({
    declarations: [QrcodegeneratorComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        FuseSharedModule,
        MainSharedModule,
        NgxPrintModule,
    ],
    exports: [QrcodegeneratorComponent],
})
export class QrcodegeneratorModule { }
