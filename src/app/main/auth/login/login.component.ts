import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from "sweetalert2";
import { ServerMonitoringService } from "app/core/services/servermonitoring.service";
import { setInterval, setTimeout } from "timers";
import { MatDialog } from "@angular/material/dialog";
import { AppointmentBillingComponent } from "app/main/opd/appointment-list/appointment-billing/appointment-billing.component";
import { EncryptionService } from "app/core/services/encryption.service";

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
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private serverMonitoringService: ServerMonitoringService,
        private _matDialog: MatDialog,
        private encryptionService:EncryptionService
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
        this.obj["CaptchaToken"] = this.captchaToken;
        if (this.loginForm.invalid) {
            return;
        }
        this.obj.Username=this.encryptionService.encrypt(this.obj.Username);
        this.obj.Password=this.encryptionService.encrypt(this.obj.Password);
        this.authenticationService.login(this.obj).subscribe(
            (data) => {
                if ((data?.userId ?? 0) > 0) {
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
