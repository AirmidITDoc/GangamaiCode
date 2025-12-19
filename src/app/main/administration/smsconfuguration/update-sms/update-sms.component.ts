import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SMSConfugurationService } from '../smsconfuguration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-update-sms',
  templateUrl: './update-sms.component.html',
  styleUrls: ['./update-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateSMSComponent implements OnInit {
 
  vTemplateCreation:any;
  vMessage:any;
  vTemplateId:any; 
  vIsBlock:any;
  MSGCategory:any=[];

    SearchGroupForm: FormGroup;
    SaveForm: FormGroup;
 

  constructor(
    public _SMSConfigService : SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
       public _formbuilder: FormBuilder, 
        public dialogRef: MatDialogRef<UpdateSMSComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _formvalidationservice: FormvalidationserviceService,
        public _configue: ConfigService
  ) { }

  ngOnInit(): void {
    this.SearchGroupForm = this.createSearchform();
    this.SearchGroupForm.markAllAsTouched();
   // this.SaveForm = this.CreateSaveForm();
  } 
   createSearchform() { 
     return this._formbuilder.group({ 
       smsid:0,
       type: ['', [Validators.required,this._formvalidationservice.allowEmptyStringValidator()]],
       pdfModeName: ['', [Validators.required,this._formvalidationservice.allowEmptyStringValidator()]],
       fieldName: ['', [Validators.required,this._formvalidationservice.allowEmptyStringValidator()]],
       passwordProtectedPdf:[false]
     })
   } 
  OnSave(){
    if (this.SearchGroupForm.valid) { 
      console.log(this.SearchGroupForm.value)
      this._SMSConfigService.SMSPdfSave(this.SearchGroupForm.value).subscribe((response) => { 
        this.OnClose();
      }); 
    }else{
        let invalidFields = [];
      if (this.SearchGroupForm.invalid) {
        for (const controlName in this.SearchGroupForm.controls) {
          if (this.SearchGroupForm.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }
  OnReset(){
    this.OnClose();
  }
  OnClose(){
    this._matDialog.closeAll();
    this._SMSConfigService.MyNewSMSForm.reset();
  }
  getValidationMessages() { 
    return { 
      type: [
        { name: "required", Message: "Sms type is required" }, 
      ],
      pdfModeName: [
        { name: "required", Message: "Pdf Mode name is required" }, 
      ],
       fieldName: [
        { name: "required", Message: "filedName is required" }, 
      ],

    };
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
export class TemplateList { 
  MgsCategory:string;
  Code: Number;
  IsBlock:number;
  TemplateId:number; 
  constructor(TemplateList) {
    {
      this.Code = TemplateList.Code || 0;
      this.IsBlock = TemplateList.IsBlock || 0;
      this.TemplateId = TemplateList.TemplateId || 0;  
      this.MgsCategory = TemplateList.MgsCategory || '';
    }
  }
}
export class MappingList { 
  MappingValue:string; 
  constructor(MappingList) {
    {
      this.MappingValue = MappingList.MappingValue ||  ''; 
    }
  }
}
