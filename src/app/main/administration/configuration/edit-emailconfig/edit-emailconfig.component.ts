import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-edit-emailconfig',
  templateUrl: './edit-emailconfig.component.html',
  styleUrls: ['./edit-emailconfig.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditEmailconfigComponent {

  EmailForm: FormGroup

  vdisplayName: any;
  vemailAddress: any;
  vmailServerSmtp: any;
  vsmtpPort: any;
  vserverTimeout: any;
  vsmtpRequiredAuthentication: any;
  vrequiredSquiredPasswordAuthentication: any;
  vuserName: any;
  vpassword: any;
  vsmtpSsl: any;
  dateTimeObj: any
  screenFromString = 'Common-form';
  constructor(
    public _ConfigurationService: ConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public _formbuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }


  ngOnInit(): void {

    this.EmailForm = this.CreateEmailForm()
    debugger
    console.log(this.data)
    this.vdisplayName = this.data.displayname
    this.vemailAddress = this.data.emailaddress
    this.vmailServerSmtp = this.data.mailserver
    this.vsmtpPort = this.data.smtpPort
    this.vserverTimeout = this.data.serverTimeout
    this.vsmtpRequiredAuthentication = this.data.reqAuthenticate
    this.vrequiredSquiredPasswordAuthentication = this.data.passauthenticate
    this.vuserName = this.data.userName
    this.vpassword = this.data.password
    this.vsmtpSsl = this.data.smtpSsl

    this.EmailForm.patchValue({
      id: this.data.id,
      displayName: this.data.displayname,
      emailAddress: this.data.emailaddress,
      mailServerSmtp: this.data.mailserver,
      smtpPort: this.data.smtpport,
      serverTimeout: this.data.servertimeout,
      userName: this.data.userName,
      password: this.data.password,
      isActive: this.data.isActive,
      smtpSsl:true,// this.data.smtpSsl,
      smtpRequiredAuthentication: this.data.reqAuthenticate,
      requiredSquiredPasswordAuthentication: this.data.passauthenticate,
    })

    //  this.EmailForm.get('displayName').setValue(this.data.displayname)
  }


  CreateEmailForm() {
    return this._formbuilder.group({
      id: [''],
      displayName: [''],
      emailAddress: [''],
      mailServerSmtp: [''],
      smtpPort: [''],
      serverTimeout: [''],
      smtpRequiredAuthentication: ['true'],
      requiredSquiredPasswordAuthentication: ['true'],
      userName: [''],
      password: [''],
      isActive: ['true'],
      smtpSsl: ['true'],
    });
  }

  OnSave() {


    console.log(this.EmailForm.value)
    if (this.EmailForm.valid) {
      this._ConfigurationService.Emailconfigedit(this.EmailForm.value).subscribe((response) => {
        this._matDialog.closeAll()
      });
    }
    else {
      let invalidFields = [];

      if (this.EmailForm.invalid) {
        for (const controlName in this.EmailForm.controls) {
          if (this.EmailForm.controls[controlName].invalid) {
            invalidFields.push(`Email Config Edit Form: ${controlName}`);
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



  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  getValidationMessages() {
    return {
      displayName: [
        { name: "required", Message: "displayName is required" }
      ],
      emailAddress: [{ name: "required", Message: "emailAddress is required" }],
      mailServerSmtp: [{ name: "required", Message: "mailServerSmtp is required" }],
      smtpPort: [{ name: "required", Message: "smtpPort is required" }],
      serverTimeout: [{ name: "required", Message: "serverTimeout is required" }],
      userName: [{ name: "required", Message: "userName is required" }],
      password: [{ name: "required", Message: "password is required" }],
      smtpSsl: [{ name: "required", Message: "smtpSsl is required" }],

    };
  }



  OnReset() {
    this.onClose();
  }
  onClose() {
    this._matDialog.closeAll();
    // this._ConfigurationService.MyNewSMSForm.reset();
  }
}

