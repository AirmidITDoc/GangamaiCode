import { Component } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-emailconfig',
  templateUrl: './edit-emailconfig.component.html',
  styleUrls: ['./edit-emailconfig.component.scss']
})
export class EditEmailconfigComponent {

  EmailForm: FormGroup

   displayName:any;
   emailAddress:any;
   mailServerSmtp:any;
   smtpPort:any;
   serverTimeout:any;
   smtpRequiredAuthentication:any;
   requiredSquiredPasswordAuthentication:any;
   userName:any;
   password:any;
   smtpSsl:any;

  constructor(
    public _ConfigurationService: ConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog, public _formbuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.EmailForm = this.CreateEmailForm()

  }


  CreateEmailForm() {
    return this._formbuilder.group({
      "id": 1,
      "displayName": "ATISupport",
      "emailAddress": "support@airmidtechinnovations.com",
      "mailServerSmtp": "mail.airmidtechinnovations.com",
      "smtpPort": 587,
      "serverTimeout": 2000,
      "smtpRequiredAuthentication": true,
      "requiredSquiredPasswordAuthentication": true,
      "userName": "support@airmidtechinnovations.com",
      "password": "support@13#",
      "isActive": true,
      "smtpSsl": true
    });
  }

  OnSave() {
    // if ((this.vMessage == '' || this.vMessage == null || this.vMessage == undefined)) {
    //   this.toastr.warning('Please enter message', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }


      console.log(this.EmailForm.value)
      this._ConfigurationService.Emailconfigedit(this.EmailForm.value).subscribe((response) => {
        this.toastr.success(response.message);

      }, (error) => {
        this.toastr.error(error.message);
      }); 
    
  }
  OnReset() {
    this.onClose();
  }
  onClose() {
    this._matDialog.closeAll();
    // this._ConfigurationService.MyNewSMSForm.reset();
  }
}

