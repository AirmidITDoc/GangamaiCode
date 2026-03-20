import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { UserList } from '../create-user.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CreateUserService } from '../create-user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ChangePasswordComponent implements OnInit {

    hasSelectedContacts: boolean;
    fname: string;
    lname: string;
    Uname: string;
    changePasswordFormGroup: FormGroup;
    hide = true;
    UserId: any;
    passrule: boolean = false;
    hidePassword = true;
    hideConfirmPassword = true;

    constructor(private _fuseSidebarService: FuseSidebarService,
        private accountService: AuthenticationService,
        private dialogRef: MatDialogRef<ChangePasswordComponent>,
        public dialog: MatDialog,
        public _CreateUserService: CreateUserService,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        public _matDialog: MatDialog,
        private formBuilder: FormBuilder,) {
        dialogRef.disableClose = true;
        // this.UserId= this.accountService.currentUserValue.user.id;
    }

    ngOnInit(): void {

        console.log("UserDetail:", this.accountService.currentUserValue)
        this.changePasswordFormGroup = this.createchangePasswordForm();
        this.changePasswordFormGroup.markAllAsTouched()

        const mdata = {
            userName: this.accountService.currentUserValue?.user.userName,
        };
        this.changePasswordFormGroup.patchValue(mdata);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    onClose() {
        this.dialogRef.close();
    }

    passrulesdisp() {
        setTimeout(() => {
            this.passrule = true;
        }, 500);
        this.passrule = false;
    }
    changepassflag() {
        this.passrule = false;
    }
    passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

    createchangePasswordForm() {
        return this.formBuilder.group({
            userId: this.accountService.currentUserValue.userId,
            userName: this.accountService.currentUserValue.user.userName,
            oldpassword: [this.accountService.currentUserValue.user.password], // extra 
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)
                //  , Validators.pattern(this.passwordPattern)
            ]],
            confirmpassword: ['', [Validators.minLength(8), Validators.maxLength(15)]]
        }, { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(formGroup: AbstractControl) {
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmpassword')?.value;

        if (password !== confirmPassword) {
            formGroup.get('confirmpassword')?.setErrors({ passwordMismatch: true });
        } else {
            formGroup.get('confirmpassword')?.setErrors(null);
        }
        return null;
    }

    onSubmit() {
        const confirmPasswordCtrl = this.changePasswordFormGroup.get('confirmpassword');
        if (confirmPasswordCtrl?.hasError('passwordMismatch')) {
            this.toastr.warning('Password and Confirm Password do not match');
            return;
        }
        if (!this.changePasswordFormGroup.invalid) {

            this.changePasswordFormGroup.removeControl('confirmpassword')
            this.changePasswordFormGroup.removeControl('oldpassword')
            console.log(this.changePasswordFormGroup.value)
            this._CreateUserService.getpasswwordChange(this.changePasswordFormGroup.value).subscribe(data => {
                if (data) {
                    Swal.fire('Pasword Changed!', 'Record updated Successfully !', 'success').then((result) => {
                        if (result.isConfirmed) {
                            this._matDialog.closeAll();
                        }
                    });
                } else {
                    Swal.fire('Error !', 'Password not Updated', 'error');
                }
            });
        } {
            const invalidFields = [];
            if (this.changePasswordFormGroup.invalid) {
                for (const controlName in this.changePasswordFormGroup.controls) {
                    if (this.changePasswordFormGroup.controls[controlName].invalid) {
                        invalidFields.push(`Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }
    }

    screenFromString = 'OP-billing';
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
}


