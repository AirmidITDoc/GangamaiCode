import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseConfigService } from "@fuse/services/config.service";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ConfigService } from "app/core/services/config.service";
// import { EncryptionService } from "app/core/services/encryption.service";
import { ServerMonitoringService } from "app/core/services/servermonitoring.service";
import { StoreUnitContextService } from "app/main/shared/services/storeunit-context.service";
// import { EncryptionService } from "app/core/services/encryption.service";
import { LoginChallenge } from "app/core/services/login-envelope.service";
import { delay, finalize } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    returnUrl: string;
    submitted = false;
    errorMessage: string;
    LoginPageHeading: any = "";
    LoginPageFooter: any = "";
    captcha: string;
    // captchaToken: string;
    captchaError = '';
    challenge: LoginChallenge | null = null;
    obj: any;
    licenseExpiryDate: Date;
    isExpired: boolean = false;
    autocompleteModeUnitName: string = "Hospital";
    hidePassword = true;
    captchaLoading = true;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild('statusForm') statusForm!: TemplateRef<any>;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private serverMonitoringService: ServerMonitoringService,
        private _matDialog: MatDialog,
        // private encryptionService: EncryptionService,
        private contextSvc: StoreUnitContextService,
        private _configue: ConfigService,
        private _httpClient1: ApiCaller,
        private changeDetector: ChangeDetectorRef,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };

        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(["/"]);
        }
    }
    // loadCaptcha() {
    //     this.authenticationService.getCaptcha().subscribe((data) => {
    //         this.captcha = 'data:image/jpg;base64,' + data.img;
    //         this.captchaToken = data.token;
    //         this.licenseExpiryDate = data.expiry;
    //         const today = new Date();
    //         this.isExpired = new Date(this.licenseExpiryDate) < today;
    //     });
    // }

    loadChallenge() {
        if (this.loginForm) {
            this.loginForm.get('CaptchaCode')?.setValue('');
        }

        this.captcha = '';
        this.challenge = null;
        this.captchaError = '';
        this.captchaLoading = true;

        this.authenticationService.getChallenge()
            .pipe(
                delay(0),
                finalize(() => {
                    this.captchaLoading = false;
                    this.changeDetector.detectChanges();
                })
            )
            .subscribe({
                next: (data) => {
                    if (!data?.img || !data?.challengeId || !data?.captchaId) {
                        this.captchaError = 'The security code could not be loaded. Please try again.';
                        this.captcha = '';
                        this.challenge = null;
                        this.changeDetector.detectChanges();
                        return;
                    }

                    this.captcha = 'data:image/jpeg;base64,' + data.img;
                    this.challenge = data;
                    this.licenseExpiryDate = null;
                    this.isExpired = !!this.licenseExpiryDate && new Date(this.licenseExpiryDate) < new Date();
                    this.changeDetector.detectChanges();
                },
                error: () => {
                    this.captchaError = 'Unable to load the security code. Check your connection and try again.';
                    this.captcha = '';
                    this.challenge = null;
                    this.changeDetector.detectChanges();
                }
            });
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            Username: ["", [Validators.required]],
            Password: ["", Validators.required],
            CaptchaCode: ["", Validators.required],
            unitId: [0]
        });
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
        // this.loadCaptcha();
        this.loadChallenge();
        this.ConfigSettigForLoginHeading();


    }
    get f() {
        return this.loginForm.controls;
    }
    // onSubmit() {
    //     this.submitted = true;
    //     this.obj = this.loginForm.value;
    //     if (this.loginForm.invalid) {
    //         return;
    //     }
    //     const data = {
    //         // CaptchaToken: this.captchaToken, Username: this.encryptionService.encrypt(this.obj.Username),
    //         // Password: this.encryptionService.encrypt(this.obj.Password),
    //         CaptchaToken: this.captchaToken,
    //         Username: this.obj.Username,
    //         Password: this.obj.Password,
    //         CaptchaCode: this.loginForm.value.CaptchaCode,
    //         LoginType: 1
    //     };
    //     this.authenticationService.login(data).subscribe(
    //         (data) => {
    //             if ((data?.status ?? 'Ok') != 'Ok') {
    //                 this.confirmDialogRef = this._matDialog.open(
    //                     FuseConfirmDialogComponent,
    //                     {
    //                         disableClose: false,
    //                     }
    //                 );
    //                 this.confirmDialogRef.componentInstance.confirmMessage = data.msg;
    //                 this.confirmDialogRef.afterClosed().subscribe((result) => {
    //                     if (result) {
    //                         this.authenticationService.confirmlogin({ Token: data.token, LoginType: 1 }).subscribe((data) => {
    //                             if ((data?.userId ?? 0) > 0) {
    //                                 this.contextSvc.setContext({
    //                                     storeId: data.user.storeId,
    //                                     storeName: data.user.tLoginStoreDetails.find(x => x.storeId == data.user.storeId).storeName,
    //                                     unitId: data.user.unitId,
    //                                     unitName: data.user.tLoginUnitDetails.find(x => x.unitId == data.user.unitId).unitName,
    //                                     Stores: data.user.tLoginStoreDetails,
    //                                     Units: data.user.tLoginUnitDetails
    //                                 });
    //                                 // this.router.navigate([this.returnUrl]);
    //                                 this.router.navigateByUrl(this.returnUrl);
    //                             }
    //                         }, (error) => {
    //                             this.serverMonitoringService.showServerDownMessage();
    //                             this.errorMessage = error.error.message;
    //                             // this.loadCaptcha();
    //                             this.loadChallenge();
    //                         });
    //                     }
    //                     this.confirmDialogRef = null;
    //                 });
    //             }
    //             else if ((data?.userId ?? 0) > 0) {
    //                 this.contextSvc.setContext({
    //                     storeId: data.user.storeId,
    //                     storeName: data.user.tLoginStoreDetails.find(x => x.storeId == data.user.storeId).storeName,
    //                     unitId: data.user.unitId,
    //                     unitName: data.user.tLoginUnitDetails.find(x => x.unitId == data.user.unitId).unitName,
    //                     Stores: data.user.tLoginStoreDetails,
    //                     Units: data.user.tLoginUnitDetails
    //                 });
    //                 // this.router.navigate([this.returnUrl]);
    //                 this.router.navigateByUrl(this.returnUrl);
    //             }
    //             else {
    //                 this.errorMessage = "Invalid username or password.";
    //                 // this.loadCaptcha();
    //                 this.loadChallenge();
    //             }
    //         }, (error) => {
    //             this.serverMonitoringService.showServerDownMessage();
    //             this.errorMessage = error.error.message;
    //             // this.loadCaptcha();
    //             this.loadChallenge();
    //         }
    //     );
    // }

    onSubmit() {
        this.submitted = true;
        this.errorMessage = '';
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            this.errorMessage = 'Please correct the highlighted fields and try again.';
            return;
        }
        if (!this.challenge) {
            this.captchaError = 'Load a security code before signing in.';
            return;
        }
        const credentials = {
            username: this.loginForm.getRawValue().Username,
            password: this.loginForm.getRawValue().Password,
            captchaCode: this.loginForm.getRawValue().CaptchaCode
        };
        const challenge = this.challenge;
        this.loginForm.get('Password')?.setValue('', { emitEvent: false });
        this.loginForm.get('Password')?.markAsUntouched();
        this.challenge = null;
        this.authenticationService.login(credentials, challenge).subscribe(
            (data) => {
                if ((data?.status ?? 'Ok') != 'Ok') {
                    this.confirmDialogRef = this._matDialog.open(
                        FuseConfirmDialogComponent,
                        {
                            disableClose: false,
                        }
                    );
                    this.confirmDialogRef.componentInstance.confirmMessage = data.msg;
                    this.confirmDialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            this.authenticationService.confirmlogin({ token: data.token }).subscribe((data) => {
                                if ((data?.userId ?? 0) > 0) {
                                    this.contextSvc.setContext({
                                        storeId: data.user.storeId,
                                        storeName: data.user.tLoginStoreDetails.find(x => x.storeId == data.user.storeId).storeName,
                                        unitId: data.user.unitId,
                                        unitName: data.user.tLoginUnitDetails.find(x => x.unitId == data.user.unitId).unitName,
                                        Stores: data.user.tLoginStoreDetails,
                                        Units: data.user.tLoginUnitDetails
                                    });
                                    this.router.navigateByUrl(this.returnUrl);
                                }
                            }, (error) => {
                                this.handleLoginError(error);
                                this.loadChallenge();
                            });
                        }
                        this.confirmDialogRef = null;
                    });
                }
                else if ((data?.userId ?? 0) > 0) {
                    this.contextSvc.setContext({
                        storeId: data.user.storeId,
                        storeName: data.user.tLoginStoreDetails.find(x => x.storeId == data.user.storeId).storeName,
                        unitId: data.user.unitId,
                        unitName: data.user.tLoginUnitDetails.find(x => x.unitId == data.user.unitId).unitName,
                        Stores: data.user.tLoginStoreDetails,
                        Units: data.user.tLoginUnitDetails
                    });
                    this.router.navigateByUrl(this.returnUrl);
                }
                else {
                    this.errorMessage = "Invalid username or password.";
                    this.loadChallenge();
                }
            }, (error) => {
                this.handleLoginError(error);
                this.loadChallenge();
            }
        );
    }

     private handleLoginError(error: HttpErrorResponse): void {
        if (error?.status === 0 || error?.status >= 500) {
            this.serverMonitoringService.showServerDownMessage();
        }
        const responseMessage = typeof error?.error === 'string'
            ? error.error
            : error?.error?.message || error?.error?.title;
        this.errorMessage = responseMessage
            || error?.message
            || 'Unable to sign in. Please check your details and try again.';
    }
    
    
    getValidationMessages() {
        return {
            unitId: { name: "required", Message: "Unit Name is required" },
        };
    }

    openStatus(row: any = null): void {
        console.log(row)

        const dialogRef = this._matDialog.open(this.statusForm, {
            width: '50%',
            height: '50%'
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    configSettingParam1: any = [];
    ConfigSettigForLoginHeading() {
        const Params =
        {
            "searchFields": [],
            "mode": "NewSysConfig"  //SystemConfigList
        }
        this._httpClient1.PostData("Common", Params).subscribe(data => {
            this.configSettingParam1 = data;
            if (this.configSettingParam1.length) {
                //this code for riomed for loginpage heading 
                const rawValue = this?.configSettingParam1[0]?.LoginPageHeading ?? '';
                let Heading = '';
                let id = '';
                let PageHeading = '';
                let pageFooter = '';
                if (rawValue.includes(':')) {
                    const parts = rawValue.split(':'); id = parts[0]?.trim() || ''; Heading = parts[1]?.trim() || '';
                }
                if (Heading && Heading.includes('|')) {
                    const parts = Heading.split('|'); PageHeading = parts[0]?.trim() || ''; pageFooter = parts[1]?.trim() || '';
                }
                this.LoginPageHeading = PageHeading;
                this.LoginPageFooter = pageFooter;
                console.log('login: ', this._configue.configParams);
            }
        });
    }
}
