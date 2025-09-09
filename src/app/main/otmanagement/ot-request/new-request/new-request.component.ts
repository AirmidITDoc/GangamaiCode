import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  requestForm: FormGroup;

  personalFormGroup: FormGroup;
  Regflag: boolean = false;
  Patientnewold: any = 1;
  admissionFormGroup: FormGroup;
  Regdisplay: boolean = false;
  searchFormGroup: FormGroup;

  vSelectedOption: any = "OP";
  vsurgeryType: any = "1";

  isActive: boolean = true;
  autocompleteModeDepartment: String = "Department";
  autocompleteModeSiteDescriptionId: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";

  vRegNo: any;
  vPatientName: any;
  vbookingId: any;
  vOPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vAge: any;
  vGenderName: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vMobNo: any;
  vIPDNo: any;

  screenFromString = 'Common-form';
  opIpId: any;

  @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;
  opIpType: number;
  RegId: string;
  registerObj: any;
  constructor(public _OtRequestService: OtRequestService,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private ref: MatDialogRef<NewRequestComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.requestForm = this._OtRequestService.createRequestForm();
    this.requestForm.markAllAsTouched();

    if ((this.data?.otBookingId) > 0) {
      this.registerObj = this.data
      this.vbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.visitId
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.opdNo
      this.vPatientName = this.registerObj.patientName
      this.vAge = this.registerObj.ageYear
      this.vDepartment = this.registerObj.departmentName
      this.vMobNo = this.registerObj.mobileNo
      this.vDoctorName = this.registerObj.doctorName
      this.vTariffName = this.registerObj.tariffName
      this.vCompanyName = this.registerObj.companyName

      // if (this.registerObj?.otRequestTime) {
      //   const date = new Date(this.registerObj.otRequestTime);

      //   // Format to HH:mm (24-hour)
      //   const hours = date.getHours().toString().padStart(2, '0');
      //   const minutes = date.getMinutes().toString().padStart(2, '0');

      //   const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

      //   this.requestForm.get('otRequestTime')?.setValue(formattedTime);
      // }

      if (this.registerObj?.otRequestTime) {
        const date = new Date(this.registerObj.otRequestTime);

        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.requestForm.get('otRequestTime')?.setValue(formattedTime);
          });

          console.log("Raw from backend:", this.registerObj.otRequestTime);
          console.log("Formatted:", formattedTime);
          console.log("Control value after patch:", this.requestForm.get('otRequestTime')?.value);
        }
      }

      console.log(this.registerObj)
      this.requestForm.patchValue(this.registerObj);
      this.selectChangedoctorType(this.registerObj)
    }
    this.requestForm.get("this.isCancelledDate")?.setValue('1900-01-01')
  }
  patientInfoReset() {
    this.requestForm.get('opIpId').setValue('');
    this.requestForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vGenderName = '';
    this.vAge = '';
    this.vAgeDay = '';
    this.vAgeMonth = '';
    this.vDepartment = '';
    this.vMobNo = '';
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {

    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  onChangeReg(event) {
    if (event.value == 'OP') {
      this.opIpType = 0;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = 1;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.opIpId = obj.admissionID;
      this.vMobNo = obj.mobileNo;
    }
  }
  getSelectedObjOP(obj) {

    if ((obj.regId ?? 0) > 0) {
      console.log("Visite Patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vDepartment = obj.departmentName
      this.vOPDNo = obj.opdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
      this.vMobNo = obj.mobileNo;
    }
  }

  opstartTime: any;
  onChangeTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opstartTime = time
    this.requestForm.get('otRequestTime')?.setValue(time, { emitEvent: false });
  }

  onSubmit() {
    let opdate = this.datePipe.transform(this.requestForm.get('otRequestDate')?.value,'yyyy-MM-dd');
    const combinedDateStartTime = `${opdate}T${this.opstartTime}:00`;

    this.requestForm.get('otbookingDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
    this.requestForm.get('opIpId').setValue(this.opIpId);
    this.requestForm.get('otbookingId')?.setValue(this.vbookingId || 0);
    this.requestForm.get('otRequestDate').setValue(this.datePipe.transform(this.requestForm.get('otRequestDate').value, 'yyyy-MM-dd'));
    this.requestForm.get('otRequestTime').setValue(combinedDateStartTime);
    this.requestForm.get('categoryId').setValue(this.requestForm.get('doctorTypeId').value);
    if (!this.requestForm.invalid) {
      if (this.requestForm.get('opIpType').value == 'IP') { this.requestForm.get('opIpType').setValue(1) }
      else { this.requestForm.get('opIpType').setValue(0) }
      this.requestForm.removeControl('doctorTypeId')
      console.log(this.requestForm.value)
      this._OtRequestService.requestSave(this.requestForm.value).subscribe((response) => {
        this.OnPrint(response)
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.requestForm.invalid) {
        for (const controlName in this.requestForm.controls) {
          if (this.requestForm.controls[controlName].invalid) {
            invalidFields.push(`request Form: ${controlName}`);
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

  selectChangedoctorType(obj: any) {
    if (obj.value) {
      this._OtRequestService.getSurgeonsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        this.surgeonList.bindGridAutoComplete();
      });
    } else {
      this._OtRequestService.getSurgeonsByDoctorType(obj.categoryId).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        // this.surgeonList.bindGridAutoComplete();
        const incomingDoctorId = obj.surgeonId;
        setTimeout(() => {
          this.surgeonList.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.requestForm.get('surgeonId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
  }

  OnPrint(Param) {
    const param = {
      searchFields: [
        {
          fieldName: "OTBookingId",
          fieldValue: String(Param.otbookingId),
          opType: "Equals"
        },
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(Param.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTRequest"
    };

    console.log(param);

    this._OtRequestService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "OT Request Report Viewer"
        }
      });
      matDialog.afterClosed().subscribe(result => {
      });
    });
  }

  getValidationMessages() {
    return {
      DepartmentName: [
        { name: "required", Message: "Department Name is required" }
      ],
      SurgeryCategory: [
        { name: "required", Message: "SurgeryCategory  is required" }
      ],
      Site: [
        { name: "required", Message: "Site Name is required" }
      ],
      SurgeryProcedure: [
        { name: "required", Message: "SurgeryProcedure Name is required" }
      ],
      SurgeonName: [
        { name: "required", Message: "Surgeon Name is required" }
      ],
      SurgeryType: [
        { name: "required", Message: "SurgeryType Name is required" },
        { name: "maxlength", Message: "SurgeryType Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ],

    };
  }
  onClose() {
    this.ref.close();
  }
  onClear(val: boolean) {
    // this.requestForm.reset();
    this.dialogRef.close(val);
    this.requestForm.get('opIpType').setValue('OP')
  }
}





