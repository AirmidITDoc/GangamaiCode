import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseConfigService } from "@fuse/services/config.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { EncryptionService } from "app/core/services/encryption.service";
import { ServerMonitoringService } from "app/core/services/servermonitoring.service";
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
    captcha: string;
    captchaToken: string;
    obj: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private serverMonitoringService: ServerMonitoringService,
        private _matDialog: MatDialog,
        private encryptionService: EncryptionService
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
        });
    }
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            Username: ["", [Validators.required]],
            Password: ["", Validators.required],
            CaptchaCode: ["", Validators.required],
        });
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
        this.loadCaptcha();
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
        var data = {
            CaptchaToken: this.captchaToken, Username: this.encryptionService.encrypt(this.obj.Username),
            Password: this.encryptionService.encrypt(this.obj.Password),
            CaptchaCode: this.loginForm.value.CaptchaCode
        };
        this.authenticationService.login(data).subscribe(
            (data) => {
                debugger
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
                            this.authenticationService.confirmlogin({ Token: data.token }).subscribe((data) => {
                                if ((data?.userId ?? 0) > 0) {
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
}
