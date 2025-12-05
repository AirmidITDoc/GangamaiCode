import { Component } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-smsconfig',
  templateUrl: './edit-smsconfig.component.html',
  styleUrls: ['./edit-smsconfig.component.scss']
})
export class EditSMSConfigComponent {
  SmsForm: FormGroup
  

  constructor(
    public _ConfigurationService: ConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog, public _formbuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.SmsForm = this.CreateSMSForm()
    
  }

  CreateSMSForm() {
    return this._formbuilder.group({
      TemplateCreation: [''],
      Msgcategory: [''],
      Message: [''],
      TemplateId: [''],
      IsBlock: ['']

      // url[''],
      // keys[''],
      // campaign[''],
      // routeid[''],
      // senderId": "string",
      // userName": "string",
      // spassword": "string",
      // storageLocLink": "string",
      // conType": "string"


    });
  }



  OnSave() {
    // if ((this.vMessage == '' || this.vMessage == null || this.vMessage == undefined)) {
    //   this.toastr.warning('Please enter message', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

      console.log(this.SmsForm.value)
      this._ConfigurationService.SMSconfigedit(this.SmsForm.value).subscribe((response) => {
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
