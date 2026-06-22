import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
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
import { AbhaStepperComponent } from './abha-stepper/abha-stepper.component';
import { AadhaarStepComponent } from './steps/aadhaar-step/aadhaar-step.component';
import { AbhaAddressStepComponent } from './steps/abha-address-step/abha-address-step.component';
import { MobileStepComponent } from './steps/mobile-step/mobile-step.component';
import { OtpStepComponent } from './steps/otp-step/otp-step.component';
import { ProfileCardStepComponent } from './steps/profile-card-step/profile-card-step.component';
import { MatRadioModule } from '@angular/material/radio';
import { AbhaComponent } from './abha.component';
import { AbhaVerifyComponent } from './abha-verify/abha-verify.component';
import { VerifyByAbhaOtpComponent } from './abha-verify/methods/verify-by-abha-otp.component';
import { VerifyByMobileComponent } from './abha-verify/methods/verify-by-mobile.component';
import { VerifyByAadhaarComponent } from './abha-verify/methods/verify-by-aadhaar.component';
import { VerifyByAbhaAddressComponent } from './abha-verify/methods/verify-by-abha-address.component';


const appRoutes: Routes = [
    // { path: 'create-aadhaar', component: CreateAadhaarComponent, title: 'Create ABHA via Aadhaar' },
    // { path: 'create-mobile', component: CreateMobileComponent, title: 'Create ABHA via Mobile' },
    // { path: 'verify', component: VerifyAbhaComponent, title: 'Verify ABHA' },
    // { path: 'profile', component: AbhaProfileComponent, title: 'ABHA Profile' },
    {
        path: "**",
        component: AbhaComponent
    }
];

@NgModule({
    declarations: [
        AbhaStepperComponent, OtpInputComponent, AadhaarStepComponent, AbhaAddressStepComponent, MobileStepComponent, OtpStepComponent,
        ProfileCardStepComponent, AbhaComponent,AbhaVerifyComponent,VerifyByAbhaOtpComponent,VerifyByAbhaAddressComponent,VerifyByMobileComponent,VerifyByAadhaarComponent
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
        MatStepperModule,
        MatRadioModule
    ]
})

export class AbhaModule { }
