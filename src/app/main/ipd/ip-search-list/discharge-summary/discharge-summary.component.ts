import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
  selector: 'app-discharge-summary',
  templateUrl: './discharge-summary.component.html',
  styleUrls: ['./discharge-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeSummaryComponent implements OnInit {

  DischargesumInsertForm: FormGroup;
  MedicineItemForm: FormGroup;
  DischargeSummaryId: any = 0;
  Chargeslist: any = [];
  rtrvDischargeSList = new DischargeSummary({});
  screenFromString = 'discharge-summary';
  dateTimeObj: any;
  ItemId: any;
  vDay: any;
  vInstruction: any;
  ClinicalFInding: any;
  saveflag: boolean = false

  displayedColumns: string[] = [
    'itemName',
    'doseName',
    'day',
    'Action'
  ]
  registerObj = new DischargeSummary({});
  vAdmissionId: any = 0;
  vDischargeId: any = 0;
  RetrDischargeSumryList: any = [];
  vDiagnosis: any;
  vClinicalCondition: any;
  vSURGERYprocedure: any;
  vPathology: any;
  vRadiology: any;
  vTreatmentGiven: any;
  vTreatmentAdvisedAfterDischarge: any;
  vOtherConDrOpinions: any;
  vPainManagementTechnique: any;
  vLifeStyle: any;
  vConditionofTimeDischarge: any;
  vSurgicalFinding: any;
  vDoctorAssistantName: any;
  vClaimNumber: any;
  vPreOthNumber: any;
  IsNormalDeath: any = 1;
  vOperativeNotes: any;
  vhistory: any;
  vClinicalFinding = "BP : \nP : \nR : \nSPO2 : \n\nRS : \nP/A :\nCVS : \nCNS :"
  doseId = 0
  doseName1 = ""
  DocName3 = 0
  vIsNormalDeath = "1";
  ItemName: any;
  isItemIdSelected: boolean = false;
  dateTimeString: any;
  public now: Date = new Date();
  registerObj1 = new AdmissionPersonlModel({});
  @ViewChild('itemid') itemid: ElementRef;
  autocompleteModeDose: string = "DoseMaster";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteitem: string = "Item";
  autocompletetemplate: string = "DischargeTemplate";
  dsItemList = new MatTableDataSource<MedicineItemList>();
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargeSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.DischargesumInsertForm = this.showDischargeSummaryInsertForm();
    this.DischargesumInsertForm.markAllAsTouched();

    this.MedicineItemForm = this.MedicineItemform();
    this.MedicineItemForm.markAllAsTouched();

    this.prescriptionDischargeArray.push(this.createprescriptionDischarge());
    console.log(this.data)
    if (this.data) {
      this.registerObj = this.data;
      this.vAdmissionId = this.data.admissionId;
      this.DischargesumInsertForm.get("dischargModel.admissionId")?.setValue(this.data.admissionId)
      this.getDischargeSummaryData(this.data.admissionId)
      this.getPrescription(this.data.admissionId)
    }

    if ((this.data?.regId ?? 0) > 0) {

      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
        });
        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          if (this.registerObj1) {
            this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
          }
        });
      }, 500);
    }

  }

  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
    });
  }
  vTemplateDesc: any;

  showDischargeSummaryInsertForm(): FormGroup {
    return this._formBuilder.group({
      dischargeDoctor3: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isNormalOrDeath: [1],

      dischargModel: this._formBuilder.group({
        admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        dischargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        history: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        diagnosis: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        investigation: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        clinicalFinding: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        opertiveNotes: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        treatmentGiven: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        treatmentAdvisedAfterDischarge: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        followupdate: [new Date(),[this._FormvalidationserviceService.validDateValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        dischargeSummaryDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        opDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        optime: [this.datePipe.transform(new Date(), 'hh:mm:ss a')],
        dischargeDoctor1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        dischargeDoctor2: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        dischargeDoctor3: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        dischargeSummaryTime: this.datePipe.transform(new Date(), 'hh:mm:ss a'),
        doctorAssistantName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        claimNumber: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        preOthNumber: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        addedBy: [0, this._FormvalidationserviceService.onlyNumberValidator()],
        updatedBy: [0, this._FormvalidationserviceService.onlyNumberValidator()],
        surgeryProcDone: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        icd10code: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        clinicalConditionOnAdmisssion: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        otherConDrOpinions: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        conditionAtTheTimeOfDischarge: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        painManagementTechnique: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        lifeStyle: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        warningSymptoms: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        radiology: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        isNormalOrDeath: [1],
        dischargeSummaryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      prescriptionDischarge: this._formBuilder.array([]),
    });
  }

  // 2. FormArray Group for Refund Detail
  createprescriptionDischarge(item: any = {}): FormGroup {
    return this._formBuilder.group({
      opdIpdId: [this.vAdmissionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      pTime: [this.datePipe.transform(new Date(), 'shortTime')],
      classId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      genericId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugId: [item.itemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doseId: [Number(item.doseId) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [Number(item.days) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instructionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instruction: [''],
      remark: [''],
      isEnglishOrIsMarathi: true,
      storeId: this.accountService.currentUserValue.user.storeId,
      createdBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  get prescriptionDischargeArray(): FormArray {
    return this.DischargesumInsertForm.get('prescriptionDischarge') as FormArray;
  }

  OnSave() {
    Swal.fire({
      title: 'Do you want to Save the Discharge Summary ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save!"

    }).then((result) => {

      if (result.isConfirmed) {
        if (!this.DischargesumInsertForm.invalid) {

          if (this.DischargesumInsertForm.get("isNormalOrDeath").value == false)
            this.vIsNormalDeath = "0"
          if (this.DischargesumInsertForm.get("isNormalOrDeath").value == true)
            this.vIsNormalDeath = "1"

          this.prescriptionDischargeArray.clear();
          this.dsItemList.data.forEach(item => {
            this.prescriptionDischargeArray.push(this.createprescriptionDischarge(item));
          });

          this.DischargesumInsertForm.get("dischargModel.dischargeId")?.setValue(this.vDischargeId)
          this.DischargesumInsertForm.get("dischargModel.isNormalOrDeath")?.setValue(Number(this.vIsNormalDeath))
          this.DischargesumInsertForm.get("dischargModel.dischargeSummaryId")?.setValue(this.DischargeSummaryId);
          this.DischargesumInsertForm.get("dischargModel.dischargeSummaryDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
          this.DischargesumInsertForm.get("dischargModel.dischargeSummaryTime")?.setValue(this.dateTimeObj.time)
        
          if (this.DischargesumInsertForm.get('dischargModel.dischargeSummaryId')?.value) {
            this.DischargesumInsertForm.get('dischargModel.updatedBy').setValue(this.accountService.currentUserValue.userId);

            let updateData = {
              "dischargModel": this.DischargesumInsertForm.value.dischargModel,
              "prescriptionDischarge": this.DischargesumInsertForm.value.prescriptionDischarge
            };
            console.log(updateData)

            this._IpSearchListService.updateIPDDischargSummary(updateData).subscribe(response => {
              this.getPrint(this.vAdmissionId)
              this._matDialog.closeAll();
            });
          }
          else {
            this.DischargesumInsertForm.get('dischargModel.addedBy').setValue(this.accountService.currentUserValue.userId);

            let insertData = {
              "dischargModel": this.DischargesumInsertForm.value.dischargModel,
              "prescriptionDischarge": this.DischargesumInsertForm.value.prescriptionDischarge
            };
            console.log(insertData)
            this._IpSearchListService.insertIPDDischargSummary(insertData).subscribe(response => {
              this.getPrint(response)
              this._matDialog.closeAll();
            });
          }
        } else {
          let invalidFields: string[] = [];
          // checks nested error 
          if (this.DischargesumInsertForm.invalid) {
            for (const controlName in this.DischargesumInsertForm.controls) {
              const control = this.DischargesumInsertForm.get(controlName);

              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`NestedForm : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`MainForm: ${controlName}`);
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
    })
  }

  getdose(event) {
    this.doseName1 = event.text
    this.doseId = event.value
  }
  getSelectedserviceObj(obj) {
    this.ItemId = obj.itemId
    this.ItemName = obj.itemName
    console.log(obj)
  }
  
 onChangeDate(value) {
  console.log(value)
  const formatted = this.datePipe.transform(value, 'yyyy-MM-dd');
  this.DischargesumInsertForm.get("dischargModel.followupdate").setValue(formatted);
}

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onAdd() {

    if ((this.MedicineItemForm.get("ItemId").value == "" || this.MedicineItemForm.get("DoseId").value == "")) {
      this.toastr.warning('Please select Item Details..', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const iscekDuplicate = this.dsItemList.data.some(item => item.itemID == this.ItemId)
    if (!iscekDuplicate) {
      this.dsItemList.data = [];
      this.Chargeslist.push(
        {
          itemID: this.MedicineItemForm.get('ItemId').value.itemId || 0,
          itemName: this.MedicineItemForm.get('ItemId').value.itemName || '',
          doseName: this.doseName1,
          doseId: this.doseId,
          days: this.MedicineItemForm.get('Day').value || 0,
          instruction: this.vInstruction || ''
        });
      this.dsItemList.data = this.Chargeslist
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.MedicineItemForm.get('ItemId').reset('%');
    this.MedicineItemForm.get('DoseId').reset('');
    this.MedicineItemForm.get('Day').reset('');
    this.MedicineItemForm.get('Instruction').reset('');
    // this.itemid.nativeElement.focus();
  }

  deleteTableRow(event, element) {
    let index = this.Chargeslist.indexOf(element);
    if (index >= 0) {
      this.Chargeslist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  getPrescription(AdmissionId) {

    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(AdmissionId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    console.log(m_data2)
    this._IpSearchListService.getPrescriptionList(m_data2).subscribe((data) => {
      this.dsItemList.data = data?.data as MedicineItemList[];
      if (this.dsItemList.data)
        this.Chargeslist = data.data as MedicineItemList[];
      console.log(this.dsItemList.data);
    });
  }

  getDischargeSummaryData(AdmissionId) {

    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(AdmissionId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }

    console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {

      this.RetrDischargeSumryList = data?.data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);

      this.rtrvDischargeSList = this.RetrDischargeSumryList[0]
      if (this.RetrDischargeSumryList.length != 0) {
        this.rtrvDischargeSList = this.RetrDischargeSumryList[0]
        this.DischargeSummaryId = this.RetrDischargeSumryList[0].dischargeSummaryId || 0
        this.vDiagnosis = this.RetrDischargeSumryList[0].diagnosis
        this.vhistory = this.RetrDischargeSumryList[0].history
        this.vClinicalCondition = this.RetrDischargeSumryList[0].clinicalConditionOnAdmisssion
        this.vClinicalFinding = this.RetrDischargeSumryList[0].clinicalFinding
        this.vSURGERYprocedure = this.RetrDischargeSumryList[0].surgeryProcDone
        this.vOperativeNotes = this.RetrDischargeSumryList[0].opertiveNotes
        this.vPathology = this.RetrDischargeSumryList[0].investigation
        this.vRadiology = this.RetrDischargeSumryList[0].radiology
        this.vTreatmentGiven = this.RetrDischargeSumryList[0].treatmentGiven
        this.vTreatmentAdvisedAfterDischarge = this.RetrDischargeSumryList[0].treatmentAdvisedAfterDischarge
        this.vOtherConDrOpinions = this.RetrDischargeSumryList[0].otherConDrOpinions
        this.vPainManagementTechnique = this.RetrDischargeSumryList[0].painManagementTechnique
        this.vLifeStyle = this.RetrDischargeSumryList[0].lifeStyle
        this.vConditionofTimeDischarge = this.RetrDischargeSumryList[0].conditionAtTheTimeOfDischarge
        this.vDoctorAssistantName = this.RetrDischargeSumryList[0].doctorAssistantName
        this.vClaimNumber = String(this.RetrDischargeSumryList[0].claimNumber) || "0"
        this.vPreOthNumber = String(this.RetrDischargeSumryList[0].preOthNumber) || "0"
        this.vIsNormalDeath = this.RetrDischargeSumryList[0].isNormalOrDeath
        this.DischargesumInsertForm.get("dischargModel.followupdate")?.setValue(this.RetrDischargeSumryList[0].followupdate)
        this.DischargesumInsertForm.get("dischargModel.dischargeDoctor1")?.setValue(this.RetrDischargeSumryList[0].dischargeDoctor1)
        this.DischargesumInsertForm.get("dischargModel.dischargeDoctor2")?.setValue(this.RetrDischargeSumryList[0].dischargeDoctor2)
        this.DischargesumInsertForm.get("dischargeDoctor3")?.setValue(this.RetrDischargeSumryList[0].dischargeDoctor3)

        if (this.RetrDischargeSumryList[0].isNormalOrDeath == 0)
          this.vIsNormalDeath = "0"
        else
          this.vIsNormalDeath = "1"
      }
    });
  }

  getPrint(contact) {
    Swal.fire({
      title: 'Select Report Format',
      text: "Choose how you want to view the report:",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "With Header",
      denyButtonText: "Without Header",
    }).then((result) => {
      if (result.isConfirmed) {
        this.viewgetDischargesummaryPdf(contact);
      } else if (result.isDenied) {
        this.viewgetDischargesummaryHeaderPdf(contact);
      }
    });
  }


  viewgetDischargesummaryPdf(AdmId) {
    console.log(AdmId)
    this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryReport");
  }

  viewgetDischargesummaryHeaderPdf(AdmId) {
    this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryReportWithoutHeader");
  }

  getItemMaster() {
    // const dialogRef = this._matDialog.open(AddItemComponent,
    //   {
    //     maxWidth: "60vw",
    //     maxHeight: "65vh",
    //     width: '100%',
    //     height: "100%" 
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    // });
  }

  getValidationMessages() {
    return {
      RegId: [],
      dischargeDoctor1: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      dischargeDoctor2: [
        // { name: "required", Message: "Middle Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      dischargeDoctor3: [
        { name: "required", Message: "Last Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      areaId: [
        { name: "required", Message: "Area Name is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      religionId: [
        { name: "required", Message: "Religion Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],
      maritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phoneNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      aadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AadharCard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }
      ],
      MaritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],
      tariffId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      PurposeId: [
        { name: "required", Message: "Purpose Name is required" }
      ],
      CompanyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      SubCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      bedId: [
        { name: "required", Message: "bedId Name is required" }
      ],
      wardId: [
        { name: "required", Message: "wardId Name is required" }
      ],
      DoseId: []

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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onClose() {
    this.DischargesumInsertForm.reset();
    this._matDialog.closeAll();
  }
}

export class DischargeSummary {
  AdmissionId: any;
  DischargeId: any;
  dischargeId: any;
  History: any;
  Diagnosis: any;
  Investigation: any;
  ClinicalFinding: any;
  OpertiveNotes: any;
  TreatmentGiven: any;
  TreatmentAdvisedAfterDischarge: any;
  Followupdate: any;
  Remark: any;
  DischargeSummaryDate: any;
  OPDate: any;
  OPTime: any;
  DischargeDoctor1: any;
  DischargeDoctor2: any;
  DischargeDoctor3: any;
  DischargeSummaryTime: any;
  DoctorAssistantName: any;
  ClaimNumber: any;
  PreOthNumber: any;
  AddedBy: any;
  AddedByDate: any;
  UpdatedBy: any;
  UpdatedByDate: any;
  SurgeryProcDone: any;
  ICD10CODE: any;
  ClinicalConditionOnAdmisssion: any;
  OtherConDrOpinions: any;
  ConditionAtTheTimeOfDischarge: any;
  PainManagementTechnique: any;
  LifeStyle: any;
  WarningSymptoms: any;
  Radiology: any;
  IsNormalOrDeath: any;
  DischargesummaryId: any;
  Pathology: any;
  DocNameID: any;
  TemplateDescriptionHtml: any;
  IsDischarged: any;


  constructor(DischargeSummary) {
    this.DischargesummaryId = DischargeSummary.DischargesummaryId || 0,
      this.AdmissionId = DischargeSummary.AdmissionId || 0,
      this.DischargeId = DischargeSummary.DischargeId || 0,
      this.dischargeId = DischargeSummary.dischargeId || 0,
      this.History = DischargeSummary.History || 0,
      this.Diagnosis = DischargeSummary.Diagnosis || 0,
      this.Investigation = DischargeSummary.Investigation || 0,
      this.ClinicalFinding = DischargeSummary.ClinicalFinding || 0,
      this.OpertiveNotes = DischargeSummary.OpertiveNotes || 0,
      this.TreatmentGiven = DischargeSummary.TreatmentGiven || 0,
      this.TreatmentAdvisedAfterDischarge = DischargeSummary.TreatmentAdvisedAfterDischarge || 0,
      this.Followupdate = DischargeSummary.Followupdate || new Date(),
      this.Remark = DischargeSummary.Remark || 0,
      this.DischargeSummaryDate = DischargeSummary.DischargeSummaryDate || 0,
      this.OPDate = DischargeSummary.OPDate || 0,
      this.OPTime = DischargeSummary.OPTime || 0,
      this.DischargeDoctor1 = DischargeSummary.DischargeDoctor1 || 0,
      this.DischargeDoctor2 = DischargeSummary.DischargeDoctor2 || 0,
      this.DischargeDoctor3 = DischargeSummary.DischargeDoctor3 || 0,
      this.DischargeSummaryTime = DischargeSummary.DischargeSummaryTime || 0,
      this.DoctorAssistantName = DischargeSummary.DoctorAssistantName || 0
    this.Pathology = DischargeSummary.Pathology || '';
    this.TemplateDescriptionHtml = DischargeSummary.TemplateDescriptionHtml || '';
    this.IsDischarged = DischargeSummary.IsDischarged || 0;
  }
}
export class MedicineItemList {
  itemID: any;
  ItemID: any;
  itemId: any;
  itemName: string;
  doseName: any;
  days: number;
  doseName1: any;
  day1: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  doseId: any;
  DoseId1: any;
  DoseId2: any;
  Day: any;
  DaysOption2: any;
  DaysOption3: any;
  DoseNameOption2: any;
  DoseNameOption3: any;
  /**
  * Constructor
  *
  * @param MedicineItemList
  */
  constructor(MedicineItemList) {
    {
      this.itemId = MedicineItemList.itemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.itemID = MedicineItemList.itemID || 0;
      this.itemName = MedicineItemList.itemName || "";

      this.Instruction = MedicineItemList.Instruction || '';
      this.doseName = MedicineItemList.doseName || '';
      this.days = MedicineItemList.days || 0;
      this.doseId = MedicineItemList.doseId || 0;
      this.doseName1 = MedicineItemList.doseName1 || '';
      this.day1 = MedicineItemList.day1 || 0;
      this.DoseName2 = MedicineItemList.DoseName2 || '';
      this.Day2 = MedicineItemList.Day2 || 0;
      this.DoseId1 = MedicineItemList.DoseId1 || '';
      this.DoseId2 = MedicineItemList.DoseId2 || 0;
      this.DaysOption2 = MedicineItemList.DaysOption2 || 0;
      this.DaysOption3 = MedicineItemList.DaysOption3 || 0;
      this.DoseNameOption2 = MedicineItemList.DoseNameOption2 || '';
      this.DoseNameOption3 = MedicineItemList.DoseNameOption3 || '';
    }
  }
}
