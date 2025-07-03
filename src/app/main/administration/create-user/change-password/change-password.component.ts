import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { UserList } from '../create-user.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import Swal from 'sweetalert2';
import { CreateUserService } from '../create-user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ChangePasswordComponent implements OnInit {

  hasSelectedContacts: boolean;
  fname: String;
  lname: String;
  Uname: String;
  changePasswordFormGroup: FormGroup;
  hide = true;
  UserId: any;
  passrule: boolean = false;

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

    var mdata = {
      userName: this.accountService.currentUserValue?.userName,
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

  createchangePasswordForm() {
    return this.formBuilder.group({
      userId: this.accountService.currentUserValue.userId,
      userName: this.accountService.currentUserValue.userName,
      password: ['', Validators.required],
      confirmpassword: ['']
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
      let invalidFields = [];
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


