import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../configuration.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Smsdetail } from '../configuration.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-edit-smsconfig',
  templateUrl: './edit-smsconfig.component.html',
  styleUrls: ['./edit-smsconfig.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditSMSConfigComponent {
  SmsForm: FormGroup
  screenFromString = 'Common-form';
  autocompleteModeMessagetype: string = "Messagetypes"
  registerObj = new Smsdetail({})
  dateTimeObj: any


    vurl:any;
      vkeys:any;
      vcampaign:any;
      vrouteid: any;
      vsenderId: any;
      vuserName:any;
      vspassword:any;
      vstorageLocLink: any;
      vconType: any;

  constructor(
    public _ConfigurationService: ConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public _formbuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.SmsForm = this.CreateSMSForm()

    if (this.data)
      console.log(this.data)
    this.registerObj = this.data;
debugger
      this.vurl=this.data.url
      this.vkeys=this.data.keys
      this.vcampaign=this.data.campaign
      this.vrouteid=this.data.routeid
      this.vsenderId=this.data.senderId
      this.vuserName=this.data.userName
      this.vspassword=this.data.spassword
      this.vstorageLocLink=this.data.storageLocLink
      this.vconType=this.data.conType
  }


  CreateSMSForm() {
    return this._formbuilder.group({

      url: [''],
      keys: [''],
      campaign: [''],
      routeid: [''],
      senderId: "0",
      userName: "",
      spassword: "",
      storageLocLink: "",
      conType: ""


    });
  }

  vMessage: any = ''

  OnSave() {
    // if ((this.vMessage == '' || this.vMessage == null || this.vMessage == undefined)) {
    //   this.toastr.warning('Please enter message', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    console.log(this.SmsForm.value)
    
    if (this.SmsForm.valid) {
      console.log(this.SmsForm.value)
      this._ConfigurationService.SMSconfigedit(this.SmsForm.value).subscribe((response) => {
      });
    }
    else {
      let invalidFields = [];

      if (this.SmsForm.invalid) {
        for (const controlName in this.SmsForm.controls) {
          if (this.SmsForm.controls[controlName].invalid) {
            invalidFields.push(`Sms Config Edit Form: ${controlName}`);
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
      url: [
        { name: "required", Message: "url is required" }
      ],
      keys: [{ name: "required", Message: "keys is required" }],
      campaign: [{ name: "required", Message: "campaign is required" }],
      routeid: [{ name: "required", Message: "routeid is required" }],
      senderId: [{ name: "required", Message: "senderId is required" }],
      userName: [{ name: "required", Message: "userName is required" }],
      spassword: [{ name: "required", Message: "spassword is required" }],
      storageLocLink: [{ name: "required", Message: "storageLocLink is required" }],
      conType: [{ name: "required", Message: "conType is required" }],
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
