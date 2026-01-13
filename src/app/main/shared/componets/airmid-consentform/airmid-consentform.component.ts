import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AirmidDropDownComponent } from '../airmid-dropdown/airmid-dropdown.component';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ConsentService } from 'app/main/nursingstation/consent/consent.service';

@Component({
  selector: 'app-airmid-consentform',
  templateUrl: './airmid-consentform.component.html',
  styleUrls: ['./airmid-consentform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AirmidConsentformComponent {
  myForm: FormGroup;

  autocompletedepartment: string = "Department";
  @ViewChild('ddlTemplate') ddlTemplate: AirmidDropDownComponent;

  vdepartmentId: any;
  vTemplateDesc: any;
  selectedTemplateOption: any;
  isButtonDisabled: boolean = false;
  hideFlag: boolean = true;
  templateId = "0"
  templateName = ''
  vRefType: any;
  vconsentID: any;
  OP_IPType: any;
  vSelectedOption: any = 'OP';
  registerObj: any;
  OP_IP_Id: any;
  vRegNo: any;
  ConsentTy: any;

  constructor(
    public dialogRef: MatDialogRef<AirmidConsentformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _service: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public _ConsentService: ConsentService,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.myForm = this.createConsentForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    this.OP_IPType = this.data?.opipType
    if ((this.data?.Id ?? 0) > 0) {
      this._service.GetData("TransactionConsentMaster/" + this.data.Id).subscribe((response) => {
        console.log(response)
        this.myForm.get('ConsentDescription')?.setValue(response.consentDescription);
        this.myForm.get('ConsentDepartment')?.setValue(response.consentDepartment);
        this.myForm.get('ConsentTempId')?.setValue(response.consentTempId);
        this.vRefType = response.refType
        this.templateId = response.consentTempId
        this.templateName = response.consentName
        this.vconsentID = response.consentId
        // this.selectChangedepartment(response)
        this.isButtonDisabled = true
      });
    }
    if (this.data?.refId > 0) {
      this.hideFlag = false
    }
    if (this.data?.Id > 0) {
      this.hideFlag = false
    }

    if (this.data?.labelType == 'MRD') {
      this.ConsentTy = 'MRD Consent'
    } else if (this.data?.labelType == 'OT') {
      this.ConsentTy = 'OT Consent'
    } else if (this.data?.labelType == 'OPD') {
      this.ConsentTy = 'OPD Consent'
    } else if (this.data?.labelType == 'IPD') {
      this.ConsentTy = 'IPD Consent'
    } else if (this.data?.labelType == 'Nursing') {
      this.ConsentTy = 'Nursing Consent'
    }
  }

  createConsentForm(): FormGroup {
    return this._formBuilder.group({
      consentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      consentDate: [(new Date()).toISOString()],
      consentTime: [(new Date()).toISOString()],
      refId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      // refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: [0],
      ConsentTempId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentName: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ConsentDepartment: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentDescription: ["", [Validators.required]],
      transactionLabel: ["", [Validators.required]],

      // extra fields
      RegID: [''],
      PatientType: ['OP'],
      IsDischargedit: 0,
    });
  }

  onTemplateSelect(option: any) {
    this.isButtonDisabled = false
    this.templateId = option.consentId
    this.templateName = option.consentName
    this.vRefType = option.consentType
    this.selectedTemplateOption = option.consentDesc;
    this.myForm.get('ConsentDepartment')?.setValue(option.departmentId)
  }

  onEditorValueChange(content: string) {
    this.myForm.get('ConsentDescription')?.setValue(content);
  }

  selectChangedepartment(obj: any) {
    if (obj.value) {
      this.vdepartmentId = obj.value
      this._service.GetData('NursingConsent/GetMConsentMasterList?DeptId=' + obj.value + '&consentType=' + this.ConsentTy).subscribe((data: any[]) => {
        const mapped = data.map(item => ({
          ...item,
          value: item.consentId,
          text: item.consentName
        }))
        this.ddlTemplate.options = mapped;
        this.ddlTemplate.bindGridAutoComplete();
      });
    } else {
      this._service.GetData('NursingConsent/GetMConsentMasterList?DeptId=' + obj.value + '&consentType=' + this.ConsentTy).subscribe((data: any[]) => {
        const mapped = data.map(item => ({
          ...item,
          value: item.consentId,
          text: item.consentName
        }))
        this.ddlTemplate.options = mapped;

        const incomingTempId = obj.consentTempId;
        setTimeout(() => {
          this.ddlTemplate.bindGridAutoComplete();
          if (incomingTempId) {
            const matchedTemp = mapped.find(temp => temp.value === incomingTempId);
            if (matchedTemp) {
              this.ddlTemplate.SetSelection(matchedTemp.value);
            }
          }
        }, 100);
      });
    }
  }

  addTemplateDescription() {

    const tempId = this.myForm.get('ConsentTempId')?.value;
    if (tempId === null || tempId === 0 || tempId === '' || tempId === "0") {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vTemplateDesc = this.selectedTemplateOption || '';
    this.myForm.get('ConsentDescription')?.setValue(this.vTemplateDesc);
    this.selectedTemplateOption = '';
    this.isButtonDisabled = true
  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {
    console.log("Visite Patient:", obj)
    this.registerObj = obj
    this.vRegNo = obj.regNo
    this.OP_IP_Id = obj.visitId
  }

  getSelectedObjIP(obj) {
    console.log("Admitted patient:", obj)
    this.registerObj = obj
    this.vRegNo = obj.regNo
    this.OP_IP_Id = obj.admissionID
  }

  isDischarge: any;
  getSelectedObjDC(obj) {
    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      console.log("Discharge patient:", obj)
      this.registerObj = obj
      this.vRegNo = obj.regNo
      this.isDischarge = obj.isDischarged
      this.OP_IP_Id = obj.admissionID;
      this.OP_IPType=1
    }
  }

  vCheckBox: boolean = false;
  getDischargedList(event) {
    if (event.checked == true) {
      this.vCheckBox = true;
      this.myForm.get('PatientType')?.setValue('IP');
      this.patientInfoReset()
    }
    else {
      this.vCheckBox = false;
      this.patientInfoReset();
    }
  }

  patientInfoReset() {
    this.myForm.get('RegID').setValue('');
    this.myForm.get('RegID').reset();
    this.vRegNo = '';
    this.registerObj = '';
  }

  onSubmit() {
    const now = new Date();

    const formattedDate = this.datePipe.transform(now, "yyyy-MM-dd");
    const formattedTime = this.datePipe.transform(now, "shortTime");

    this.myForm.get('consentDate')?.setValue(formattedDate);
    this.myForm.get('consentTime')?.setValue(`${formattedDate} ${formattedTime}`);
    debugger
    this.myForm.get("opipid").setValue(this.OP_IP_Id ?? this.data?.opipId)
    this.myForm.get("opiptype").setValue(Number(this.OP_IPType))
    this.myForm.get("transactionLabel").setValue(this.data?.labelType || 'OT')
    this.myForm.get("refId").setValue(Number(this.data?.refId) ?? 0)
    this.myForm.get("refType").setValue(this.vRefType)
    this.myForm.get("ConsentTempId").setValue(this.templateId)
    this.myForm.get("ConsentName").setValue(this.templateName)
    this.myForm.get("consentId").setValue(this.vconsentID ?? 0)

    if (!this.myForm.invalid) {
      this.myForm.removeControl('RegID')
      this.myForm.removeControl('IsDischargedit')
      this.myForm.removeControl('PatientType')

      if (this.vconsentID > 0) {
        console.log(this.myForm.value)
        this._service.PutData("TransactionConsentMaster/" + this.vconsentID, this.myForm.value).subscribe((response) => {
          this.OnViewReportPdf(response)
          this.onClose();
        });
      } else {
        console.log(this.myForm.value)
        this._service.PostData("TransactionConsentMaster", this.myForm.value).subscribe((response) => {
          this.OnViewReportPdf(response)
          this.onClose();
        });
      }
    } else {
      let invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
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

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
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
            "fieldName": "OPIPType",
            "fieldValue": String(this.OP_IPType),
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
