import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAadhaarComponent } from './create-aadhaar/create-aadhaar.component';
import { CreateMobileComponent } from './create-mobile/create-mobile.component';
import { VerifyAbhaComponent } from './verify-abha/verify-abha.component';
import { AbhaProfileComponent } from './abha-profile/abha-profile.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { OtpInputComponent } from './otp-input.component';


const appRoutes: Routes = [
    { path: 'create-aadhaar', component: CreateAadhaarComponent, title: 'Create ABHA via Aadhaar' },
    { path: 'create-mobile', component: CreateMobileComponent, title: 'Create ABHA via Mobile' },
    { path: 'verify', component: VerifyAbhaComponent, title: 'Verify ABHA' },
    { path: 'profile', component: AbhaProfileComponent, title: 'ABHA Profile' },
    { path: '**', redirectTo: 'verify', pathMatch: 'full' },
];

@NgModule({
    declarations: [
        CreateAadhaarComponent,CreateMobileComponent,VerifyAbhaComponent,AbhaProfileComponent,OtpInputComponent
    ],
    imports: [
        RouterModule.forChild(appRoutes),
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatCardModule,
        ReactiveFormsModule,
        SharedModule,
        MatTooltipModule,
        MatStepperModule
    ]
})

export class AbhaModule { }
