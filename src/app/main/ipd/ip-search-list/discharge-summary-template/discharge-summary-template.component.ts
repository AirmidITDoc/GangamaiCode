import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { DischargeSummary, MedicineItemList } from '../discharge-summary/discharge-summary.component';

@Component({
  selector: 'app-discharge-summary-template',
  templateUrl: './discharge-summary-template.component.html',
  styleUrls: ['./discharge-summary-template.component.scss']
})
export class DischargeSummaryTemplateComponent {
  
  MedicineItemForm: FormGroup;
  discSummary: FormGroup;
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

  displayedColumns: string[] = [
    'itemName',
    'doseName',
    'day',
    //  'Remark',
    'Action'
  ]


  submitted = false;
  msg: any;
  Id: any;
  a: any;

  DischargeSummaryId: any;

  DischargeSList = new DischargeSummary({});
  screenFromString = 'discharge-summary';
  dateTimeObj: any;
  filteredOptionsItem: any;
  noOptionFound: any;
  ItemId: any;
  isDoseSelected: boolean = false;
  vDay: any;
  vInstruction: any;
  Chargeslist: any = [];

  @Input() dataArray: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj = new DischargeSummary({});
  menuActions: Array<string> = [];
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
  bp: any = 1000;
  vBp: any;
  vP: any;
  vR: any;
  vSPO2: any;
  vRS: any;
  vPA: any;
  vCVS: any;
  vCNS: any;
  vTemplateDesc: any;
  vTemplateId: any;
  vIsNormalDeath = 1;
  doseId = 0
  doseName1 = ""
  registerObj1 = new AdmissionPersonlModel({});
  @ViewChild('itemid') itemid: ElementRef;
  lngAdmId: any = [];

  autocompleteModeDose: string = "DoseMaster";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteitem: string = "Item";
  autocompleteModetemplate: string = "Template"

  dsItemList = new MatTableDataSource<MedicineItemList>();

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DischargeSummaryTemplateComponent>,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.discSummary = this.showDischargeSummaryForm();
    this.MedicineItemForm = this.MedicineItemform();

    console.log(this.data)
    if (this.data) {

      this.registerObj = this.data;
      this.vAdmissionId = this.selectedAdvanceObj.AdmissionID;
      this.getDischargeSummaryData(this.registerObj)
      this.getPrescriptionList(this.registerObj)

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

            this.registerObj1.admissionTime = this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
            this.registerObj1.dischargeTime = this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')

          }
          console.log(this.registerObj1)

        });


      }, 500);
    }


    this.getdischargeIdbyadmission();

    // if (this.vIsNormalDeath == True) {
    //   this.IsDeath = 1;
    // } else {
    //   this.IsDeath = 0;
    // }

  }

  selectChangeItem(obj: any) {
    debugger
    console.log("Item:", obj);
    this.MedicineItemForm.get('ItemId').setValue(obj);
    // this.refdocId = obj.value
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  isItemIdSelected: boolean = false;
  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
    });
  }
  showDischargeSummaryForm(): FormGroup {
    return this._formBuilder.group({
      admissionId: 0,
      dischargeId: 0,
      followupdate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
      dischargeDoctor1: 0,
      dischargeDoctor2: 0,
      dischargeDoctor3: 0,
      addedBy: 10,
      isNormalOrDeath: 1,
      dischargeSummaryId: 0,
      TemplateId:0,
      templateDescriptionHtml: ""
    });
  }

  getdose(event) {
    this.doseName1 = event.text
    this.doseId = event.value
  }
  getSelectedserviceObj(obj) {
    console.log(obj)

  }


  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  }
  getSelectedObjItem(obj) {
    // console.log(obj)
    this.ItemId = obj.ItemId;
  }
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }

  onAdd() {

    const iscekDuplicate = this.dsItemList.data.some(item => item.itemID == this.ItemId)
    if (!iscekDuplicate) {
      this.dsItemList.data = [];
      this.Chargeslist.push(
        {
          itemID: this.MedicineItemForm.get('ItemId').value.serviceId || 0,
          itemName: this.MedicineItemForm.get('ItemId').value.serviceName || '',
          doseName: this.doseName1,//this.MedicineItemForm.get('DoseId').value || '',
          doseId: this.doseId,// this.MedicineItemForm.get('DoseId').value || 0,
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
    this.MedicineItemForm.get('ItemId').reset('');
    this.MedicineItemForm.get('DoseId').reset('');
    this.MedicineItemForm.get('Day').reset('');
    this.MedicineItemForm.get('Instruction').reset('');
    // this.itemid.nativeElement.focus();
  }

  deleteTableRow(event, element) {
    debugger
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

  onAddTemplate() {

    this.vTemplateDesc ="sssssssssssssssssssssss" //this.discSummary.get('TemplateId').value.TemplateDescription || ''

  }

  getPrescriptionList(el) {

    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": "40773",
          "opType": "Equals"
        },
        {
          "fieldName": "Start",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "Length",
          "fieldValue": "10",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
    console.log(m_data2)
    this._IpSearchListService.getPrescriptionList(m_data2).subscribe((data) => {
      this.dsItemList.data = data.data as MedicineItemList[];
      this.Chargeslist = data as MedicineItemList[];
      console.log(this.dsItemList.data);
    });
  }


  onClose() {
    // this.discSummary.reset();
    this._matDialog.closeAll();
  }
  ClinicalFInding: any;

  Istemplate = false;
  chkTemplate(event) {
    if (event.checked)
      this.Istemplate = true
    else
      this.Istemplate = true
  }

  saveflag: boolean = false
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.saveflag = true

        if (!this.DischargeSummaryId) {

          let dischargModeldata = {};

          dischargModeldata['dischargesummaryId'] = this.DischargeSummaryId || 0,
            dischargModeldata['dischargeId'] = this.vDischargeId,
            dischargModeldata['admissionId'] = this.vAdmissionId || 0,
           
            dischargModeldata['followupdate'] = this.discSummary.get("diagnosis").value || '',
            dischargModeldata['dischargeDoctor1'] = this.discSummary.get("dischargeDoctor1").value,
            dischargModeldata['dischargeDoctor2'] = this.discSummary.get("dischargeDoctor2").value,
            dischargModeldata['dischargeDoctor3'] = this.discSummary.get("dischargeDoctor3").value,
            dischargModeldata['addedBy'] = 1
            dischargModeldata['isNormalOrDeath'] = this.discSummary.get("isNormalOrDeath").value


            dischargModeldata['templateDescriptionHtml'] = this.discSummary.get("templateDescriptionHtml").value || ''
           

          let insertIPPrescriptionDischarge = [];
          this.dsItemList.data.forEach(element => {
            let Prescdiscgargemodel = {};
            Prescdiscgargemodel['opdIpdId'] = this.vAdmissionId || 0;
            Prescdiscgargemodel['opdIpdType'] = 1;
            Prescdiscgargemodel['date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd');
            Prescdiscgargemodel['pTime'] = this.dateTimeObj.time;
            Prescdiscgargemodel['classId'] = 0;
            Prescdiscgargemodel['genericId'] = 0;
            Prescdiscgargemodel['drugId'] = element.itemID || 0;
            Prescdiscgargemodel['doseId'] = element.doseId || 0;
            Prescdiscgargemodel['days'] = element.days || 0;
            Prescdiscgargemodel['instructionId'] = 0;
            Prescdiscgargemodel['qtyPerDay'] = 0;
            Prescdiscgargemodel['totalQty'] = 0;
            Prescdiscgargemodel['instruction'] = "";
            Prescdiscgargemodel['remark'] = "";
            Prescdiscgargemodel['isEnglishOrIsMarathi'] = true;
            Prescdiscgargemodel['storeId'] = 1;//this.accountService.currentUserValue.user.storeId || 0;
            Prescdiscgargemodel['createdBy'] = 1;//this.accountService.currentUserValue.user.id,
            insertIPPrescriptionDischarge.push(Prescdiscgargemodel);
          });

          let SubmitData = {
            'discharge': dischargModeldata,
            'prescriptionTemplate': insertIPPrescriptionDischarge
          }
          console.log(SubmitData);
          this._IpSearchListService.insertIPDDischargSummaryTemplate(SubmitData).subscribe(response => {
            this.toastr.success(response.message);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });
        }
      }
    })
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
          "fieldValue": String(AdmissionId),//"40773",	
          "opType": "Equals"
        },
        {
          "fieldName": "Start",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "Length",
          "fieldValue": "10",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
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
          "fieldValue": String(AdmissionId),// "40622",	
          "opType": "Equals"
        },
        {
          "fieldName": "Start",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "Length",
          "fieldValue": "10",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }

    console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
      console.log(data);
      debugger
      this.RetrDischargeSumryList = data?.data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);
      if (this.RetrDischargeSumryList.length != 0) {
        this.DischargeSummaryId = this.RetrDischargeSumryList[0].dischargeSummaryId || 0
        this.vDiagnosis = this.RetrDischargeSumryList[0].diagnosis
        this.vhistory = this.RetrDischargeSumryList[0].history
        this.vClinicalCondition = this.RetrDischargeSumryList[0].clinicalConditionOnAdmisssion
        this.vClinicalFinding = this.RetrDischargeSumryList[0].clinicalFinding
        this.vSURGERYprocedure = this.RetrDischargeSumryList[0].surgeryProcDone
        this.vOperativeNotes = this.RetrDischargeSumryList[0].opertiveNotes
        this.vPathology = this.RetrDischargeSumryList[0].pathology
        this.vRadiology = this.RetrDischargeSumryList[0].radiology
        this.vTreatmentGiven = this.RetrDischargeSumryList[0].treatmentGiven
        this.vTreatmentAdvisedAfterDischarge = this.RetrDischargeSumryList[0].treatmentAdvisedAfterDischarge
        this.vOtherConDrOpinions = this.RetrDischargeSumryList[0].otherConDrOpinions
        this.vPainManagementTechnique = this.RetrDischargeSumryList[0].painManagementTechnique
        this.vLifeStyle = this.RetrDischargeSumryList[0].lifeStyle
        this.vConditionofTimeDischarge = this.RetrDischargeSumryList[0].conditionAtTheTimeOfDischarge
        this.vDoctorAssistantName = this.RetrDischargeSumryList[0].doctorAssistantName
        this.vClaimNumber = this.RetrDischargeSumryList[0].claimNumber
        this.vPreOthNumber = this.RetrDischargeSumryList[0].preOthNumber
        this.IsNormalDeath = this.RetrDischargeSumryList[0].isNormalOrDeath
        this.discSummary.get("dischargeDoctor1").setValue(this.RetrDischargeSumryList[0].dischargeDoctor1)
        this.discSummary.get("dischargeDoctor2").setValue(this.RetrDischargeSumryList[0].dischargeDoctor2)
        this.discSummary.get("dischargeDoctor3").setValue(this.RetrDischargeSumryList[0].dischargeDoctor3)


      }

      if (this.IsNormalDeath == 1) {
        this.vIsNormalDeath = 1;
        this.discSummary.get("isNormalOrDeath").setValue('1');
      }
      else {
        this.vIsNormalDeath = 0;
        this.discSummary.get("isNormalOrDeath").setValue('0');
      }
    });
  }
  getdischargeIdbyadmission() {
    debugger
    this._IpSearchListService.getDischargeId(this.data.admissionId).subscribe(data => {
      console.log(data)

      if (data.dischargeId)
        this.vDischargeId = data.dischargeId
      else this.vDischargeId = 0
    });
  }

  viewgetDischargesummaryPdf(AdmId) {

  }


  viewgetDischargesummaryTempPdf(AdmId) {

  }

  onClear() { 
    this._matDialog.closeAll()
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

  SetDeathOrNormal() {

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
      TemplateId: [
        { name: "required", Message: "Template Name is required" }
      ],
      doseId:[]

    };
  }
}

