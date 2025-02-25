import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdvanceDataStored } from '../../advance';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';

@Component({
  selector: 'app-discharge-summary',
  templateUrl: './discharge-summary.component.html',
  styleUrls: ['./discharge-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeSummaryComponent implements OnInit {
  displayedColumns: string[] = [
    'ItemName',
    'DoseName',
    'Day',
    //  'Remark',
    'Action'
  ]

  DischargesumForm: FormGroup;
  MedicineItemForm: FormGroup;
  submitted = false;
  msg: any;
  Id: any;
  a: any;
  
  DischargeSummaryId: any;
  isLoading: string = '';
 
  DischargeSList = new DischargeSummary({});
  screenFromString = 'discharge-summary';
  dateTimeObj: any;
  filteredOptionsItem: any;
  noOptionFound: any;
  ItemId: any;
  isDoseSelected: boolean = false;
  vDay: any;
  vInstruction: any;
  Chargelist: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  IsNormalDeath: any=1;
  vOperativeNotes: any;
  vhistory: any;
  vClinicalFinding = "BP : \nP : \nR : \nSPO2 : \n\nRS : \nP/A :\nCVS : \nCNS :"

  vBp: any;
  vP: any;
  vR: any;
  vSPO2: any;
  vRS: any;
  vPA: any;
  vCVS: any;
  vCNS: any;

  vIsNormalDeath=false;
    registerObj1 = new AdmissionPersonlModel({});
    @ViewChild('itemid') itemid: ElementRef;
  
    bp: any = 1000;
    lngAdmId: any = [];

    autocompleteModeDose: string = "Dose";
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeDoctor: string = "ConDoctor";
    autocompleteitem: string = "Item";

    
  dsItemList = new MatTableDataSource<MedicineItemList>();

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargeSummaryComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe) {
   
    
      this.vAdmissionId = this.data.admissionId;
      console.log(this.registerObj);
      this.getDischargeSummaryData(this.registerObj)
    
  }
  IsDeath: any;

  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModerefdoc: string = "RefDoctor";

  filteredOptionsDosename: Observable<string[]>;

  ngOnInit(): void {
    this.DischargesumForm = this.showDischargeSummaryForm();
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
          this.registerObj= response;
          console.log(this.registerObj)

        });

        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          if(this.registerObj1){
            this.registerObj1.phoneNo=this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo=this.registerObj1.mobileNo.trim()


          this.registerObj1.admissionTime=  this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
          this.registerObj1.dischargeTime=  this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')
     
          }
          console.log(this.registerObj1)

        });


      }, 500);
    }

    
    this.getAdmissionInfo();
    this.getdischargeIdbyadmission();
    
    // if (this.vIsNormalDeath == True) {
    //   this.IsDeath = 1;
    // } else {
    //   this.IsDeath = 0;
    // }

  }

  selectChangeItem(obj: any) {
    debugger
    console.log("Item:",obj);
    this.MedicineItemForm.get('ItemId').setValue(obj); 
    // this.refdocId = obj.value
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

  dischargeSummaryId: 0,
  admissionId:'',
  dischargeId: '',
  history: "",
  diagnosis: "",
  investigation: "",
  clinicalFinding: "",
  opertiveNotes: "",
  treatmentGiven: "",
  treatmentAdvisedAfterDischarge: "",
  followupdate: "2024-09-08",
  remark: "",
  dischargeSummaryDate: "2024-09-08",
  opDate: "2024-09-08",
  optime: "10:00:00 AM",
  dischargeDoctor1: 0,
  dischargeDoctor2: 0,
  dischargeDoctor3: 0,
  dischargeSummaryTime: "11:00:00 PM",
  doctorAssistantName: "",
  claimNumber: "",
  preOthNumber: "",
  addedByDate: "2024-09-08",
  updatedByDate: "2024-09-08",
  surgeryProcDone: "",
  icd10code: "",
  clinicalConditionOnAdmisssion: "",
  otherConDrOpinions: "",
  conditionAtTheTimeOfDischarge: "",
  painManagementTechnique: "",
  lifeStyle: "",
  warningSymptoms: "",
  radiology: "",
  isNormalOrDeath: false
    });
  }
  


  // getSearchItemList() {
  //   let sname = this.MedicineItemForm.get('ItemId').value + '%' || '%'
  //       var m_data = {
    
  //         "first": 0,
  //         "rows": 100,
  //         "sortField": "ServiceId",
  //         "sortOrder": 0,
  //         "filters": [
  //           { "fieldName": "ServiceName", "fieldValue": sname, "opType": "StartsWith" },
  //           { "fieldName": "TariffId", "fieldValue": "0", "opType": "Equals" },
  //           { "fieldName": "GroupId", "fieldValue": "0", "opType": "Equals" },
  //           { "fieldName": "Start", "fieldValue": "0", "opType": "Equals" },
  //           { "fieldName": "Length", "fieldValue": "30", "opType": "Equals" }
  //         ],
  //         "exportType": "JSON"
  //       }
    
  //       console.log(m_data)
  //   this._IpSearchListService.getItemlist(m_data).subscribe(data => {
  //     this.filteredOptionsItem = data.data;
  //     console.log(this.data);
      
  //     if (this.filteredOptionsItem.length == 0) {
  //       this.noOptionFound = true;
  //     } else {
  //       this.noOptionFound = false;
  //     }
  //   });
  // }


   getSelectedserviceObj(obj) {
             console.log(obj)
  
        // this.SrvcName1 = obj.serviceName;
        // this.vPrice = obj.classRate;
        // this.vQty = 1;
        // this.vChargeTotalAmount = obj.price;
        // this.vCahrgeNetAmount = obj.price;
        // this.serviceId = obj.serviceId;
        // this.IsPathology = obj.isPathology;
        // this.IsRadiology = obj.isRadiology;
        // this.vIsPackage = obj.isPackage;
        // this.CreditedtoDoctor = obj.creditedtoDoctor;
        // if (this.CreditedtoDoctor == true) {
        //   this.isDoctor = true;
        //   this.chargeForm.get('DoctorID').reset();
        //   this.chargeForm.get('DoctorID').setValidators([Validators.required]);
        //   this.chargeForm.get('DoctorID').enable();
  
        // } else {
        //   this.isDoctor = false;
        //   this.chargeForm.get('DoctorID').reset();
        //   this.chargeForm.get('DoctorID').clearValidators();
        //   this.chargeForm.get('DoctorID').updateValueAndValidity();
        //   this.chargeForm.get('DoctorID').disable();
        // }
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
   
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if (!iscekDuplicate) {
      this.dsItemList.data = [];
      debugger
      this.Chargelist.push(
        {
          
          ItemID: this.MedicineItemForm.get('ItemId').value.ServiceId || 0,
          ItemName: this.MedicineItemForm.get('ItemId').value.serviceName || '',
          DoseName:"d1",// this.MedicineItemForm.get('DoseId').value.DoseName || '',
          DoseId: 2,//this.MedicineItemForm.get('DoseId').value.DoseId || '',
          Days: this.vDay,
          Instruction: this.vInstruction || ''
        });
      this.dsItemList.data = this.Chargelist
      } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // this.MedicineItemForm.get('ItemId').reset('');
    // this.MedicineItemForm.get('DoseId').reset('');
    // this.MedicineItemForm.get('Day').reset('');
    // this.MedicineItemForm.get('Instruction').reset('');
    // this.itemid.nativeElement.focus();
  }

  deleteTableRow(event, element) {
    debugger
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
 
  
  getAdmissionInfo() {
 ;
  }

  getPrescriptionList(el) {
    
    var m_data2 = {
      "AdmissionId": el.AdmissionID
    }
    //console.log(m_data2)
    this._IpSearchListService.getPrescriptionList(m_data2).subscribe((data) => {
      this.dsItemList.data = data as MedicineItemList[];
      this.Chargelist = data as MedicineItemList[];
      console.log(this.dsItemList.data);
    });
  }
 
  getDischargeSummaryData(el) {
    // debugger
    var m_data2 = {
      "AdmissionId": el.AdmissionID
    }
    //console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
      this.RetrDischargeSumryList = data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);
      if (this.RetrDischargeSumryList.length != 0) {
        this.DischargeSummaryId = this.RetrDischargeSumryList[0].DischargeSummaryId
        this.vDiagnosis = this.RetrDischargeSumryList[0].Diagnosis
        this.vhistory = this.RetrDischargeSumryList[0].History
        this.vClinicalCondition = this.RetrDischargeSumryList[0].ClinicalConditionOnAdmisssion
        this.vClinicalFinding = this.RetrDischargeSumryList[0].ClinicalFinding
        this.vSURGERYprocedure = this.RetrDischargeSumryList[0].SurgeryProcDone
        this.vOperativeNotes = this.RetrDischargeSumryList[0].OpertiveNotes
        this.vPathology = this.RetrDischargeSumryList[0].Investigation
        this.vRadiology = this.RetrDischargeSumryList[0].Radiology
        this.vTreatmentGiven = this.RetrDischargeSumryList[0].TreatmentGiven
        this.vTreatmentAdvisedAfterDischarge = this.RetrDischargeSumryList[0].TreatmentAdvisedAfterDischarge
        this.vOtherConDrOpinions = this.RetrDischargeSumryList[0].OtherConDrOpinions
        this.vPainManagementTechnique = this.RetrDischargeSumryList[0].PainManagementTechnique
        this.vLifeStyle = this.RetrDischargeSumryList[0].LifeStyle
        this.vConditionofTimeDischarge = this.RetrDischargeSumryList[0].ConditionAtTheTimeOfDischarge
        this.vDoctorAssistantName = this.RetrDischargeSumryList[0].DoctorAssistantName
        this.vClaimNumber = this.RetrDischargeSumryList[0].ClaimNumber
        this.vPreOthNumber = this.RetrDischargeSumryList[0].PreOthNumber
        // this.DocName1 = this.RetrDischargeSumryList[0].DischargeDoctor1
        // this.DocName2 = this.RetrDischargeSumryList[0].DischargeDoctor2
        // this.DocName3 = this.RetrDischargeSumryList[0].DischargeDoctor3
        this.IsNormalDeath = this.RetrDischargeSumryList[0].IsNormalOrDeath 
      }
   
      if (this.IsNormalDeath == 1) {
        this.vIsNormalDeath = true;
        this.DischargesumForm.get("IsNormalOrDeath").setValue('True');
      }
      else {
        this.vIsNormalDeath = false;
        this.DischargesumForm.get("IsNormalOrDeath").setValue('false');
      }
    });
  }
  getdischargeIdbyadmission() {
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";

    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      this.registerObj = data[0];
      this.vDischargeId = this.registerObj.DischargeId
    });
  }
 
 
  onClose() {
    this.DischargesumForm.reset();
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
        let DoctorName1 = 0;
        if (this.DischargesumForm.get("dischargeDoctor1").value)
          DoctorName1 = this.DischargesumForm.get("dischargeDoctor1").value;

        let DoctorName2 = 0;
        if (this.DischargesumForm.get("dischargeDoctor2").value)
          DoctorName2 = this.DischargesumForm.get("dischargeDoctor2").value;

        let DoctorName3 = 0;
        if (this.DischargesumForm.get("dischargeDoctor3").value)
          DoctorName3 = this.DischargesumForm.get("dischargeDoctor3").value;

        if (!this.DischargeSummaryId) {
         

          let insertIPPrescriptionDischarge = [];
          this.dsItemList.data.forEach(element => {
            let insertIPPrescriptionDischargeObj = {};
            insertIPPrescriptionDischargeObj['opD_IPD_ID'] = this.vAdmissionId || 0;
            insertIPPrescriptionDischargeObj['opD_IPD_Type'] = 1;
            insertIPPrescriptionDischargeObj['date'] = this.dateTimeObj.date;
            insertIPPrescriptionDischargeObj['pTime'] = this.dateTimeObj.time;
            insertIPPrescriptionDischargeObj['classID'] = 0;
            insertIPPrescriptionDischargeObj['genericId'] = 0;
            insertIPPrescriptionDischargeObj['drugId'] = element.ItemID || 0;
            insertIPPrescriptionDischargeObj['doseId'] = element.DoseId || 0;
            insertIPPrescriptionDischargeObj['days'] = element.Days || 0;
            insertIPPrescriptionDischargeObj['instructionId'] = 0;
            insertIPPrescriptionDischargeObj['qtyPerDay'] = 0;
            insertIPPrescriptionDischargeObj['totalQty'] = 0;
            insertIPPrescriptionDischargeObj['instruction'] = 0;
            insertIPPrescriptionDischargeObj['remark'] = 0;
            insertIPPrescriptionDischargeObj['isEnglishOrIsMarathi'] = 0;
            insertIPPrescriptionDischargeObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
            insertIPPrescriptionDischargeObj['createdBy'] = this.accountService.currentUserValue.user.id,
              insertIPPrescriptionDischarge.push(insertIPPrescriptionDischargeObj);
          });
          let SubmitData = {
            'insertIPDDischargSummary': this.DischargesumForm.value(),
            'insertIPPrescriptionDischarge': insertIPPrescriptionDischarge
          }
          console.log(SubmitData);
          this._IpSearchListService.insertIPDDischargSummary(SubmitData).subscribe(response => {
             this.toastr.success(response.message);
            // this.onClear(true);
            this._matDialog.closeAll();
        }, (error) => {
            this.toastr.error(error.message);
        });
        } else {
          let updateIPDDischargSummaryObj = {};
          updateIPDDischargSummaryObj['dischargesummaryId'] = this.DischargeSummaryId || 0,
            updateIPDDischargSummaryObj['dischargeId'] = this.vDischargeId,
            updateIPDDischargSummaryObj['history'] = this.DischargesumForm.get("history").value || '',
            updateIPDDischargSummaryObj['diagnosis'] = this.DischargesumForm.get("Diagnosis").value || '',
            updateIPDDischargSummaryObj['clinicalFinding'] = this.DischargesumForm.get("ClinicalFinding").value || '',
            updateIPDDischargSummaryObj['clinicalConditionOnAdmisssion'] = this.DischargesumForm.get("ClinicalConditionOnAdmisssion").value || '',
            updateIPDDischargSummaryObj['surgeryProcDone'] = this.DischargesumForm.get("SurgeryProcDone").value || '',
            updateIPDDischargSummaryObj['opertiveNotes'] = this.DischargesumForm.get("OperativeNotes").value || '',
            updateIPDDischargSummaryObj['radiology'] = this.DischargesumForm.get("Radiology").value || '',
            updateIPDDischargSummaryObj['investigation'] = this.DischargesumForm.get("Pathology").value || '',
            updateIPDDischargSummaryObj['treatmentGiven'] = this.DischargesumForm.get("TreatmentGiven").value || '',
            updateIPDDischargSummaryObj['treatmentAdvisedAfterDischarge'] = this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || '',
            updateIPDDischargSummaryObj['followupdate'] = this.dateTimeObj.date,
            updateIPDDischargSummaryObj['remark'] = ''
          updateIPDDischargSummaryObj['opDate'] = this.dateTimeObj.date,
            updateIPDDischargSummaryObj['opTime'] = this.dateTimeObj.date,
            updateIPDDischargSummaryObj['dischargeDoctor1'] = DoctorName1,
            updateIPDDischargSummaryObj['dischargeDoctor2'] = DoctorName2,
            updateIPDDischargSummaryObj['dischargeDoctor3'] = DoctorName3,
            updateIPDDischargSummaryObj['doctorAssistantName'] = this.DischargesumForm.get("DoctorAssistantName").value || '',
            updateIPDDischargSummaryObj['claimNumber'] = this.DischargesumForm.get("ClaimNumber").value || 0,
            updateIPDDischargSummaryObj['preOthNumber'] = this.DischargesumForm.get("PreOthNumber").value || 0,
            updateIPDDischargSummaryObj['updatedBy'] = this.accountService.currentUserValue.user.id,
            updateIPDDischargSummaryObj['icD10CODE'] = ''
          updateIPDDischargSummaryObj['otherConDrOpinions'] = this.DischargesumForm.get("OtherConDrOpinions").value || '',
            updateIPDDischargSummaryObj['conditionAtTheTimeOfDischarge'] = this.DischargesumForm.get("ConditionAtTheTimeOfDischarge").value || '',
            updateIPDDischargSummaryObj['painManagementTechnique'] = this.DischargesumForm.get("PainManagementTechnique").value || '',
            updateIPDDischargSummaryObj['lifeStyle'] = this.DischargesumForm.get("LifeStyle").value || '',
            updateIPDDischargSummaryObj['warningSymptoms'] = '',
            updateIPDDischargSummaryObj['isNormalOrDeath'] = this.DischargesumForm.get("IsNormalOrDeath").value



          let insertIPPrescriptionDischarge = [];
          this.dsItemList.data.forEach(element => {
            let insertIPPrescriptionDischargeObj = {};
            insertIPPrescriptionDischargeObj['opD_IPD_ID'] = this.vAdmissionId || 0;
            insertIPPrescriptionDischargeObj['opD_IPD_Type'] = 1;
            insertIPPrescriptionDischargeObj['date'] = this.dateTimeObj.date;
            insertIPPrescriptionDischargeObj['pTime'] = this.dateTimeObj.time;
            insertIPPrescriptionDischargeObj['classID'] = 0;
            insertIPPrescriptionDischargeObj['genericId'] = 0;
            insertIPPrescriptionDischargeObj['drugId'] = element.ItemID || 0;
            insertIPPrescriptionDischargeObj['doseId'] = element.DoseId || 0;
            insertIPPrescriptionDischargeObj['days'] = element.Days || 0;
            insertIPPrescriptionDischargeObj['instructionId'] = 0;
            insertIPPrescriptionDischargeObj['qtyPerDay'] = 0;
            insertIPPrescriptionDischargeObj['totalQty'] = 0;
            insertIPPrescriptionDischargeObj['instruction'] = 0;
            insertIPPrescriptionDischargeObj['remark'] = 0;
            insertIPPrescriptionDischargeObj['isEnglishOrIsMarathi'] = 0;
            insertIPPrescriptionDischargeObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
            insertIPPrescriptionDischargeObj['createdBy'] = this.accountService.currentUserValue.user.id,
              insertIPPrescriptionDischarge.push(insertIPPrescriptionDischargeObj);
          });


          let deleteIPPrescriptionDischargeobj = {};
          deleteIPPrescriptionDischargeobj['opD_IPD_ID'] = this.vAdmissionId || 0;

          let SubmitData = {
            'updateIPDDischargSummary': updateIPDDischargSummaryObj,
            'insertIPPrescriptionDischarge': insertIPPrescriptionDischarge,
            'deleteIPPrescriptionDischarge': deleteIPPrescriptionDischargeobj
          }
          console.log(SubmitData);
          setTimeout(() => {
            this._IpSearchListService.updateIPDDischargSummary(SubmitData).subscribe(response => {
              // this.toastr.success(response);
              // this.onClear(true);
              this._matDialog.closeAll();
            }, (error) => {
              this.toastr.error(error.message);
            });
            
          }, 500);
        }
      }
    })
  }


  viewgetDischargesummaryPdf(AdmId) {

    this._IpSearchListService.getIpDischargesummaryReceipt(
      AdmId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Discharge Summary Viewer"
          }
        });
    });
  }


  viewgetDischargesummaryTempPdf(AdmId) {

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
       

    };
}
}



export class DischargeSummary {
  AdmissionId: any;
  DischargeId: any;
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
  ItemID: any;
  ItemId: any;
  ItemName: string;
  DoseName: any;
  Days: number;
  DoseName1: any;
  Day1: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  DoseId: any;
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
      this.ItemId = MedicineItemList.ItemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.ItemName = MedicineItemList.ItemName || "";

      this.Instruction = MedicineItemList.Instruction || '';
      this.DoseName = MedicineItemList.DoseName || '';
      this.Days = MedicineItemList.Days || 0;
      this.DoseName1 = MedicineItemList.DoseName1 || '';
      this.Day1 = MedicineItemList.Day1 || 0;
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
