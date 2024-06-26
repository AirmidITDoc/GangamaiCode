import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from "sweetalert2";
import { ServerMonitoringService } from "app/core/services/servermonitoring.service";
import { setInterval, setTimeout } from "timers";

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
    loading = false;
    submitted = false;
    errorMessage: string;
    hide = true;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private serverMonitoringService:ServerMonitoringService,
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            username: ["", [Validators.required]],
            password: ["", Validators.required],
        });

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
        // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/opd/registration";

        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
        
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    // onSubmit() {
    //     this.submitted = true;

    //     // stop here if form is invalid
    //     if (this.loginForm.invalid) {
    //         return;
    //     }

    //     this.loading = true;
    //     this.authenticationService
    //         .login(this.f.username.value, this.f.password.value)
    //         .subscribe(
    //             (data) => {
    //                 this.router.navigate([this.returnUrl]);
    //             },
    //             (error) => {
    //                 this.errorMessage = error.error.message;
    //             }
    //         );
    // }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        
        this.authenticationService.login(this.f.username.value, this.f.password.value).subscribe(
                (data) => {
                    this.authenticationService.getNavigationData(data.user.webRoleId);
                    // console.log(this.configService.getConfigParam());
                    this.router.navigate([this.returnUrl]);
                },
                (error) => {
                    this.serverMonitoringService.showServerDownMessage();                    
                    this.errorMessage = error.error.message;
                }
            );
    }
}
