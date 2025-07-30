import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from '../consent.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-consent',
  templateUrl: './new-consent.component.html',
  styleUrls: ['./new-consent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentComponent {

  registerObj: any;
  vRegNo: any;
  vPatientName: any;
  vAdmissionDate: any;
  vMobileNo: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
  vRegId: any;
  OP_IPType: any = 0;
  vSelectedOption: any = 'OP';
  isButtonDisabled: boolean = false;
  selectedDepartment: string = '';
  selectedTemplate: string = '';
  selectedTemplateOption: any;
  vConsentText: any;
  vOPDNo: any;
  OP_IP_Id: any;

  ConsentinsertForm: FormGroup;

  autocompletedepartment: string = "Department";
  autocompleteModeTemplate: string = "ConsentMaster";

  @ViewChild('ddlTemplate') ddlTemplate: AirmidDropDownComponent;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,
  };

  onBlur(e: any) {
    this.vConsentText = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  constructor(
    public _ConsentService: ConsentService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentComponent>,
    private commonService: PrintserviceService,
    public datePipe: DatePipe,) { }

  ngOnInit(): void {
    this._ConsentService.myform.markAllAsTouched();
    this.ConsentinsertForm = this._ConsentService.CreateMyInsertform();
    this.ConsentinsertForm.markAllAsTouched();

    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if ((this.data?.consentId ?? 0) > 0) {
      this.vConsentText = this.data.consentText
      this.OP_IP_Id = this.data.opipid
      this.OP_IPType = this.data.opipType
      this.vSelectedOption = this.data.opipType === 1 ? 'IP' : 'OP';
      this.vdepartmentId = this.data.consentDeptId
      this.templateId = this.data.consentTempId
      this.ConsentinsertForm.patchValue(this.data);
      console.log(this.data)
      this.registerObj=this.data
      this.getSelectedObjOP(this.data)
      this.getSelectedObjIP(this.data)
    }
  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.vRegId = "";
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.vRegId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {
    console.log("Visite Patient:", obj)
    this.registerObj=obj
    this.vRegNo = obj.regNo
    this.OP_IP_Id = obj.visitId
  }

  getSelectedObjIP(obj) {
    console.log("Admitted patient:", obj)
    this.registerObj=obj
    this.vRegNo = obj.regNo
    this.OP_IP_Id = obj.admissionID
  }

  patientInfoReset() {
    this._ConsentService.myform.get('RegID').setValue('');
    this._ConsentService.myform.get('RegID').reset();
    this.vRegNo = '';
    this.registerObj = '';
  }

  vdepartmentId = ""
  selectChangedepartment(obj: any) {
    console.log(obj)
    this.vdepartmentId = obj.value
    // template is dependent on department
    this._ConsentService.getConsentByDepartment(obj.value).subscribe((data: any) => {
        this.ddlTemplate.options = data;
        this.ddlTemplate.bindGridAutoComplete();
    });
  }

  templateId = "0"
  templateName=''
  onTemplateSelect(option: any) {
    console.log("selectedTemplateOption:", option)
    this.templateId = option.consentId
    this.templateName = option.consentName
    this.selectedTemplateOption = option.consentDesc; //details of template dd should pass
  }

  onSave() {

    if (this.ConsentinsertForm.get("consentId").value > 0) {
        this.ConsentinsertForm.get("modifiedBy").setValue(this._loggedService.currentUserValue.userId)
         this.ConsentinsertForm.removeControl('createdBy');

      } else {
        this.ConsentinsertForm.get("createdBy").setValue(this._loggedService.currentUserValue.userId)
         this.ConsentinsertForm.removeControl('modifiedBy');

      }
    if (!this.ConsentinsertForm.invalid) {
      this.ConsentinsertForm.get("consentDate").setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      this.ConsentinsertForm.get("consentTime").setValue(this.datePipe.transform(new Date(), 'shortTime'))
      this.ConsentinsertForm.get("opipid").setValue(this.OP_IP_Id)
      this.ConsentinsertForm.get("opiptype").setValue(Number(this.OP_IPType))
      this.ConsentinsertForm.get("consentTempId").setValue(Number(this.templateId))
      this.ConsentinsertForm.get("ConsentName").setValue(this.templateName)

      console.log(this.ConsentinsertForm.value)
      this._ConsentService.ConsentSave(this.ConsentinsertForm.value).subscribe((response) => {
        debugger
        this.OnViewReportPdf(response)
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.ConsentinsertForm.invalid) {
        for (const controlName in this.ConsentinsertForm.controls) {
          if (this.ConsentinsertForm.controls[controlName].invalid) {
            invalidFields.push(`My Form: ${controlName}`);
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

  addTemplateDescription() {
    this.isButtonDisabled = false

    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined || this.vRegNo == 0) {
      this.toastr.warning('Please select patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const deptId = this.ConsentinsertForm.get('consentDeptId')?.value;
    if (deptId === null || deptId === 0 || deptId === '' || deptId === "0") {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const tempId = this.ConsentinsertForm.get('consentTempId')?.value;
    if (tempId === null || tempId === 0 || tempId === '' || tempId === "0") {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vConsentText = this.selectedTemplateOption || '';
    this.selectedTemplateOption = '';
  }

  onClose() {
    this._ConsentService.myform.reset({
      // start: this._ConsentService.myform.get('start')?.value,
      // end: this._ConsentService.myform.get('end')?.value,
      Language: '1',
      IsIPOrOP: '2'
    });
    this.ConsentinsertForm.reset({
      Language: '1',
      IsIPOrOP: '2'
    });
    this.dialogRef.close();
  }

  onClear() {
    this._ConsentService.myform.reset({ Language: '1' });
  }

  getValidationMessages() {
    return {
      consentDeptId: [
        { name: "required", Message: "Department is required" }
      ],
      consentTempId: [
        { name: "required", Message: "Template is required" }
      ]
    };
  }

  OnViewReportPdf(element: any) {
    
      setTimeout(() => {
        let param = {
          "searchFields": [
            {
              "fieldName": "ConsentId",
              "fieldValue": String(element.consentId),
              "opType": "Equals"
            },
            {
              "fieldName": "OP_IP_Type",
              "fieldValue": String(element.opipType),
              "opType": "Equals"
            }
          ],
          "mode": "ConsentInformation"
        }
    
        this._ConsentService.getReportView(param).subscribe(res => {
    
          const matDialog = this._matDialog.open(PdfviewerComponent,
            {
              maxWidth: "85vw",
              height: '750px',
              width: '100%',
              data: {
                base64: res["base64"] as string,
                title: "Consent Report" + " " + "Viewer"
              }
            });
          matDialog.afterClosed().subscribe(result => {
          });
        });
      }, 100);
  }
}
