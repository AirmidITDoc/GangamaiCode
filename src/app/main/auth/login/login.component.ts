import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseConfigService } from "@fuse/services/config.service";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ConfigService } from "app/core/services/config.service";
import { EncryptionService } from "app/core/services/encryption.service";
import { ServerMonitoringService } from "app/core/services/servermonitoring.service";
import { StoreUnitContextService } from "app/main/shared/services/storeunit-context.service";
// import { EncryptionService } from "app/core/services/encryption.service";

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
    LoginPageHeading:any = "";
    LoginPageFooter:any = "";
    captcha: string;
    captchaToken: string;
    obj: any;
    licenseExpiryDate: Date;
    isExpired: boolean = false;
    autocompleteModeUnitName: string = "Hospital";
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
        private encryptionService: EncryptionService,
        private contextSvc: StoreUnitContextService,
         private _configue: ConfigService,
             private _httpClient1: ApiCaller,
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
    loadCaptcha() {
        this.authenticationService.getCaptcha().subscribe((data) => {
            this.captcha = 'data:image/jpg;base64,' + data.img;
            this.captchaToken = data.token;
            this.licenseExpiryDate = data.expiry;
            const today = new Date();
            this.isExpired = new Date(this.licenseExpiryDate) < today;
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
        this.loadCaptcha();
        this.ConfigSettigForLoginHeading();


    }
    get f() {
        return this.loginForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        this.obj = this.loginForm.value;
        if (this.loginForm.invalid) {
            return;
        }
        const data = {
            CaptchaToken: this.captchaToken, Username: this.encryptionService.encrypt(this.obj.Username),
            Password: this.encryptionService.encrypt(this.obj.Password),
            CaptchaCode: this.loginForm.value.CaptchaCode,
            LoginType: 1
        };
        this.authenticationService.login(data).subscribe(
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
                            this.authenticationService.confirmlogin({ Token: data.token, LoginType: 1 }).subscribe((data) => {
                                if ((data?.userId ?? 0) > 0) {
                                    this.contextSvc.setContext({
                                        storeId: data.user.storeId,
                                        storeName: data.user.tLoginStoreDetails.find(x => x.storeId == data.user.storeId).storeName,
                                        unitId: data.user.unitId,
                                        unitName: data.user.tLoginUnitDetails.find(x => x.unitId == data.user.unitId).unitName,
                                        Stores: data.user.tLoginStoreDetails,
                                        Units: data.user.tLoginUnitDetails
                                    });
                                    this.router.navigate([this.returnUrl]);
                                }
                            }, (error) => {
                                this.serverMonitoringService.showServerDownMessage();
                                this.errorMessage = error.error.message;
                                this.loadCaptcha();
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
                    this.router.navigate([this.returnUrl]);
                }
                else {
                    this.errorMessage = "Invalid username or password.";
                    this.loadCaptcha();
                }
            }, (error) => {
                this.serverMonitoringService.showServerDownMessage();
                this.errorMessage = error.error.message;
                this.loadCaptcha();
            }
        );
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
