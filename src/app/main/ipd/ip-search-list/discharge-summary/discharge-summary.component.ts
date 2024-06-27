import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    'Remark',
    'Action'
  ]

  DischargesumForm:FormGroup;
  MedicineItemForm:FormGroup;
  submitted = false;
  msg: any;
  Id: any;
  a: any;
  data: any = [];
  DischargeSummaryId: any;
  isLoading: string = '';
  Doctor3List: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  DischargeSList = new DischargeSummary({});
  screenFromString = 'discharge-summary';
  dateTimeObj: any;
  filteredOptionsItem:any;
  noOptionFound:any;
  ItemId:any;
  isDoseSelected:boolean=false;
  vDay:any;
  vInstruction:any;
  Chargelist:any=[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj = new DischargeSummary({});

 
  filteredOptionDoctor1: any;
  filteredOptionDoctor2: Observable<string[]>;
  filteredOptionDoctor3: Observable<string[]>;
  filteredOptionsDosename: Observable<string[]>;

  optionsDoc1: any[] = [];
  optionsDoc2: any[] = [];
  optionsDoc3: any[] = [];
  
  isdoctor1Selected: boolean = false;
  isdoctor2Selected: boolean = false;
  isdoctor3Selected: boolean = false;

  menuActions: Array<string> = [];
  vAdmissionId:any=0;
  vDischargeId:any=0;

  dsItemList = new MatTableDataSource<MedicineItemList>();

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargeSummaryComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) 
    
  {
    this.getDoctorList1();
    this.getDoctorList2();
    this.getDoctorList3();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj = this.advanceDataStored.storage;
      this.vAdmissionId = this.selectedAdvanceObj.AdmissionID;
      console.log(this.registerObj);
    }
  }

  ngOnInit(): void {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj = this.advanceDataStored.storage;
      this.vAdmissionId = this.selectedAdvanceObj.AdmissionID;
      this.getDischargeSummaryData(this.registerObj)
    }
    
    this.DischargesumForm=this.showDischargeSummaryForm();
    this.MedicineItemForm = this.MedicineItemform();
    this.getAdmissionInfo();
    //this.getDischargeSummaryData();
    this.getdischargeIdbyadmission();
    this.getDoseList();

      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDosename(value)),
    );
    this.filteredOptionDoctor1 = this.DischargesumForm.get('DischargeDoctor1').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterdoc1(value) : this.Doctor1List.slice()),
    );
    this.filteredOptionDoctor2 = this.DischargesumForm.get('DischargeDoctor2').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterdoc2(value) : this.Doctor2List.slice()),
    );
    this.filteredOptionDoctor3 = this.DischargesumForm.get('DischargeDoctor3').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterdoc3(value) : this.Doctor3List.slice()),
    );
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  isItemIdSelected:boolean=false;
  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId:'',             
      DoseId:'',
      Day:'',            
      Instruction:'',
    });
  }
  showDischargeSummaryForm(): FormGroup {
    return this._formBuilder.group({
    
 AdmissionId:'',             
 DischargeId:'',
 History:'',            
 Diagnosis:'',
 Investigation:'',
 ClinicalFinding:'',
 OpertiveNotes:'',
 TreatmentGiven:'',
 TreatmentAdvisedAfterDischarge:'',
 Followupdate:'',      
 Remark:'',
 DischargeSummaryDate:'',
 OPDate:'',        
 OPTime:'',
 DischargeDoctor1:'',
 DischargeDoctor2:'',
 DischargeDoctor3:'',
 DischargeSummaryTime:'',
 DoctorAssistantName:'',
 ClaimNumber:'',  
 PreOthNumber:'',
 AddedBy:'',  
 AddedByDate:'',
 UpdatedBy:'',  
 UpdatedByDate:'',
 SurgeryProcDone:'',
 ICD10CODE:'',
 ClinicalConditionOnAdmisssion:'',
 OtherConDrOpinions:'',
 ConditionAtTheTimeOfDischarge:'',
 PainManagementTechnique:'',
 LifeStyle:'',
 WarningSymptoms:'',
 Pathology:'',
 Radiology:'',
 IsNormalOrDeath:'',  
 DischargesummaryId:'',  
    });
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

  getDoctorList1() {
    this._IpSearchListService.getDischaregDoctor1Combo().subscribe(data => {
      this.Doctor1List = data; 
      if (this.registerObj) {
        const ddValue= this.Doctor1List.filter(item => item.DoctorId ==  this.registerObj.DocNameID);
        console.log(ddValue)
        this.DischargesumForm.get('DischargeDoctor1').setValue(ddValue[0]);
        this.DischargesumForm.updateValueAndValidity();
      }
    });
  }
  getDoctorList2() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor2List = data;
       this.optionsDoc2 = this.Doctor2List.slice(); 
    });
  }
  getDoctorList3() {
    this._IpSearchListService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor3List = data;
      console.log( this.Doctor3List )
       this.optionsDoc3 = this.Doctor3List.slice(); 
    });
  }
  private _filterdoc1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc1.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  private _filterdoc2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  private _filterdoc3(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc3.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }

   getOptionTextsDoctor1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextsDoctor2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextsDoctor3(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }

  getSearchItemList() {   
      var m_data = {
        "ItemName": `${this.MedicineItemForm.get('ItemId').value}%`,
        "StoreId": this.accountService.currentUserValue.user.storeId
      }
      console.log(m_data); 
      this._IpSearchListService.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
        // console.log(this.data);
        this.filteredOptionsItem = data;
        if (this.filteredOptionsItem.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
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
    doseList:any=[];
    getDoseList() {
      this._IpSearchListService.getDoseList().subscribe((data) => {
        this.doseList = data; 
      });
    }
    private _filterDosename(value: any): string[] {
      if (value) {
        const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
        return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
      }
    }
 
    onAdd() {
      if ((this.MedicineItemForm.get('ItemId').value == '' || this.MedicineItemForm.get('ItemId').value == null || this.MedicineItemForm.get('ItemId').value == undefined)) {
        this.toastr.warning('Please select Item', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if(!this.filteredOptionsItem.find(item => item.ItemName ==  this.MedicineItemForm.get('ItemId').value.ItemName)){
        this.toastr.warning('Please select valid Item Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((this.MedicineItemForm.get('DoseId').value == '' || this.MedicineItemForm.get('DoseId').value == null || this.MedicineItemForm.get('DoseId').value == undefined)) {
        this.toastr.warning('Please select Dose', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if(!this.doseList.find(item => item.DoseName ==  this.MedicineItemForm.get('DoseId').value.DoseName)){
        this.toastr.warning('Please select valid Dose Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((this.vDay == '' || this.vDay == null || this.vDay == undefined)) {
        this.toastr.warning('Please enter a Day', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
      if(!iscekDuplicate){
      this.dsItemList.data = [];
      this.Chargelist.push(
        {
          ItemID:  this.MedicineItemForm.get('ItemId').value.ItemId || 0,
          ItemName: this.MedicineItemForm.get('ItemId').value.ItemName || '',
          DoseName: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          DoseId: this.MedicineItemForm.get('DoseId').value.DoseId || '',
          Day: this.vDay,
          Instruction: this.vInstruction || '' 
        });
      this.dsItemList.data = this.Chargelist
      //console.log(this.dsItemList.data); 
      }else{
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.MedicineItemForm.get('ItemId').reset('');
      this.MedicineItemForm.get('DoseId').reset('');
      this.MedicineItemForm.get('Day').reset('');
      this.MedicineItemForm.get('Instruction').reset('');
      this.itemid.nativeElement.focus(); 
    }
  
    deleteTableRow(event, element) { 
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
    @ViewChild('itemid') itemid: ElementRef;
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

  lngAdmId: any = [];
  // ============================================================================
  getAdmissionInfo() {
    // let Query = "select Isnull(AdmissionId,0) as AdmId from DischargeSummary where AdmissionId=" + this.vAdmissionId + ""
    // console.log(Query)
    // this._IpSearchListService.getchargesList(Query).subscribe(data => { 
    //   this.lngAdmId = data;
    //   console.log(this.lngAdmId)
    //   if (this.lngAdmId.length > 0) {
    //     this.getDischargeSummaryData();
    //   }
    //   else {
    //     console.log('no-data found');
    //   }
    // },
    //   (error) => {
    //     this.isLoading = 'list-loaded';
    //   });
  }

  getdischargeIdbyadmission(){
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
    console.log(Query)
    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      this.registerObj = data[0];
     // console.log(this.registerObj);
      this.vDischargeId=this.registerObj.DischargeId
    });
  }
RetrDischargeSumryList:any=[];
vDiagnosis:any;
vClinicalCondition:any;
vSURGERYprocedure:any;
warningSymptoms:any;
vPathology:any;
vRadiology:any;
vTreatmentGiven:any;
vTreatmentAdvisedAfterDischarge:any;
vOtherConDrOpinions:any;
vPainManagementTechnique:any;
vLifeStyle:any;
vConditionofDischarge:any;
vSurgicalFinding:any;
  getDischargeSummaryData(el) {
    debugger
    var m_data2 = {
      "AdmissionId": el.AdmissionID 
    }
    console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
      this.RetrDischargeSumryList = data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);
      this.DischargeSummaryId = this.RetrDischargeSumryList[0].DischargeSummaryId
      this.vDiagnosis = this.RetrDischargeSumryList[0].Diagnosis
      this.vClinicalCondition = this.RetrDischargeSumryList[0].clinicalFinding
      this.vSURGERYprocedure = this.RetrDischargeSumryList[0].Investigation
      this.warningSymptoms = this.RetrDischargeSumryList[0].OpertiveNotes
      this.vTreatmentGiven = this.RetrDischargeSumryList[0].TreatmentGiven
      this.vTreatmentAdvisedAfterDischarge = this.RetrDischargeSumryList[0].TreatmentAdvisedAfterDischarge
      this.vConditionofDischarge = this.RetrDischargeSumryList[0].Remark
      this.getRetevDropdownvalue();
      console.log(this.DischargeSummaryId)
    });
    
    // this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
    //   if (data && data.length > 0) {
    //     this.DischargeSList = data[0] as DischargeSummary;
    //   } else {
    //     this.DischargeSList = new DischargeSummary({});
    //   }
    // });
    // console.log(this.DischargeSList);
  }
  getRetevDropdownvalue(){
    if(this.RetrDischargeSumryList[0].DischargeDoctor1){
      const ddValue= this.Doctor1List.filter(item => item.DoctorID ==  this.RetrDischargeSumryList[0].DischargeDoctor1);
      console.log(ddValue) 
      this.DischargesumForm.get("DischargeDoctor1").setValue(ddValue[0]);
    }
    if(this.RetrDischargeSumryList[0].DischargeDoctor2){
      const ddValue= this.Doctor2List.filter(item => item.DoctorID ==  this.RetrDischargeSumryList[0].DischargeDoctor2);
      console.log(ddValue) 
      this.DischargesumForm.get("DischargeDoctor2").setValue(ddValue[0]);
    }
    if(this.RetrDischargeSumryList[0].DischargeDoctor3){
      const ddValue= this.Doctor3List.filter(item => item.DoctorID ==  this.RetrDischargeSumryList[0].DischargeDoctor3);
      console.log(ddValue) 
      this.DischargesumForm.get("DischargeDoctor3").setValue(ddValue[0]);
    }
  }
  onClose() {
    this.DischargesumForm.reset();
    this._matDialog.closeAll();
  }
OnSave(){
  if(!this.DischargeSummaryId){
  let insertIPDDischargSummaryObj = {};

  insertIPDDischargSummaryObj['DischargeSummaryId'] = 0,
  insertIPDDischargSummaryObj['AdmissionId'] =this.vAdmissionId || 0;
  insertIPDDischargSummaryObj['DischargeID'] = this.vDischargeId,
  insertIPDDischargSummaryObj['History'] =  "",
  insertIPDDischargSummaryObj['Diagnosis'] = this.DischargesumForm.get("Diagnosis").value || '',
  insertIPDDischargSummaryObj['OTHER_CON_DR_OPINION'] = this.DischargesumForm.get("OtherConDrOpinions").value || '',
  insertIPDDischargSummaryObj['PATHOLOGY'] = this.DischargesumForm.get("Pathology").value || '',
  insertIPDDischargSummaryObj['Radiology'] = this.DischargesumForm.get("Radiology").value || '',
  insertIPDDischargSummaryObj['PAIN_MANAGMENT_TECHNIQUE'] = this.DischargesumForm.get("PainManagementTechnique").value || '',
  insertIPDDischargSummaryObj['LIFE_STYLE'] = this.DischargesumForm.get("LifeStyle").value || '',
  insertIPDDischargSummaryObj['SURGERY_PROCEDURE'] = this.DischargesumForm.get("SurgeryProcDone").value || '',
  insertIPDDischargSummaryObj['SURGICAL_FINDINGS'] = this.DischargesumForm.get("SurgicalFinding").value || '',
  insertIPDDischargSummaryObj['Investigation'] = '',
  insertIPDDischargSummaryObj['ClinicalFinding'] = this.DischargesumForm.get("ClinicalConditionOnAdmisssion").value || '',
  insertIPDDischargSummaryObj['Condition_At_the_timeOfdischarge'] = this.DischargesumForm.get("ConditionAtTheTimeOfDischarge").value || '',
  insertIPDDischargSummaryObj['TreatmentGiven'] =  this.DischargesumForm.get("TreatmentGiven").value || '',
  insertIPDDischargSummaryObj['TreatmentAdvisedAfterDischarge'] = this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || '',
  insertIPDDischargSummaryObj['Followupdate'] = this.dateTimeObj.date,
  insertIPDDischargSummaryObj['Remark'] =  ''
  insertIPDDischargSummaryObj['DischargeSummaryDate'] = this.dateTimeObj.date,//this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
  insertIPDDischargSummaryObj['OpDate'] =  this.dateTimeObj.date,
  insertIPDDischargSummaryObj['OPTime'] =  this.dateTimeObj.date,
  insertIPDDischargSummaryObj['DischargeDoctor1'] =this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
  insertIPDDischargSummaryObj['DischargeDoctor2'] = this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
  insertIPDDischargSummaryObj['DischargeDoctor3'] = this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
  insertIPDDischargSummaryObj['DischargeSummaryTime'] =this.dateTimeObj.time,
  insertIPDDischargSummaryObj['DoctorAssistantName'] = this.DischargesumForm.get("DoctorAssistantName").value || '',
  insertIPDDischargSummaryObj['CreatedBy'] = this.accountService.currentUserValue.user.id,
  insertIPDDischargSummaryObj['CreatedDate'] =  this.dateTimeObj.date,
  insertIPDDischargSummaryObj['ModifiedBy'] = this.accountService.currentUserValue.user.id,
  insertIPDDischargSummaryObj['ModifiedDate'] = this.dateTimeObj.date

  let insertIPPrescriptionDischarge =[];
  this.dsItemList.data.forEach(element =>{
    let insertIPPrescriptionDischargeObj = {};
    insertIPPrescriptionDischargeObj['opD_IPD_ID'] = this.vAdmissionId || 0;
    insertIPPrescriptionDischargeObj['opD_IPD_Type'] = 1;
    insertIPPrescriptionDischargeObj['date'] = this.dateTimeObj.date;
    insertIPPrescriptionDischargeObj['pTime'] = this.dateTimeObj.time;
    insertIPPrescriptionDischargeObj['classID'] = 0;
    insertIPPrescriptionDischargeObj['genericId'] = 0;
    insertIPPrescriptionDischargeObj['drugId'] = element.ItemID || 0;
    insertIPPrescriptionDischargeObj['doseId'] = element.DoseId || 0;
    insertIPPrescriptionDischargeObj['days'] = element.Day || 0;
    insertIPPrescriptionDischargeObj['instructionId'] = 0;
    insertIPPrescriptionDischargeObj['qtyPerDay'] = 0;
    insertIPPrescriptionDischargeObj['totalQty'] = 0;
    insertIPPrescriptionDischargeObj['instruction'] = element.Instruction || 0;
    insertIPPrescriptionDischargeObj['remark'] =  0;
    insertIPPrescriptionDischargeObj['isEnglishOrIsMarathi'] = 0;
    insertIPPrescriptionDischargeObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    insertIPPrescriptionDischargeObj['createdBy'] = this.accountService.currentUserValue.user.id,
    insertIPPrescriptionDischarge.push(insertIPPrescriptionDischargeObj);
  });
  let SubmitData={
    'insertIPDDischargSummary':insertIPDDischargSummaryObj,
    'insertIPPrescriptionDischarge':insertIPPrescriptionDischarge
  }
  console.log(SubmitData);
  setTimeout(() => {
    this._IpSearchListService.insertIPDDischargSummary(SubmitData).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'Discharge Summary Saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            this.viewgetDischargesummaryPdf(this.vAdmissionId,);
          }
        });
      } else {
        Swal.fire('Error !', 'Discharge Summary not Saved', 'error');
      }
      this.isLoading = '';
    });
  }, 500);
 }else{

  let updateIPDDischargSummaryObj = {};
  updateIPDDischargSummaryObj['DischargeSummaryId'] = 0,
  //updateIPDDischargSummaryObj['AdmissionId'] =this.vAdmissionId || 0;
  updateIPDDischargSummaryObj['DischargeID'] = this.vDischargeId,
  updateIPDDischargSummaryObj['History'] =  "",
  updateIPDDischargSummaryObj['Diagnosis'] = this.DischargesumForm.get("Diagnosis").value || '',
  updateIPDDischargSummaryObj['OTHER_CON_DR_OPINION'] = this.DischargesumForm.get("OtherConDrOpinions").value || '',
  updateIPDDischargSummaryObj['PATHOLOGY'] = this.DischargesumForm.get("Pathology").value || '',
  updateIPDDischargSummaryObj['Radiology'] = this.DischargesumForm.get("Radiology").value || '',
  updateIPDDischargSummaryObj['PAIN_MANAGMENT_TECHNIQUE'] = this.DischargesumForm.get("PainManagementTechnique").value || '',
  updateIPDDischargSummaryObj['LIFE_STYLE'] = this.DischargesumForm.get("LifeStyle").value || '',
  updateIPDDischargSummaryObj['SURGERY_PROCEDURE'] = this.DischargesumForm.get("SurgeryProcDone").value || '',
  updateIPDDischargSummaryObj['SURGICAL_FINDINGS'] = this.DischargesumForm.get("SurgicalFinding").value || '',
  updateIPDDischargSummaryObj['Investigation'] = '',
  updateIPDDischargSummaryObj['ClinicalFinding'] = this.DischargesumForm.get("ClinicalConditionOnAdmisssion").value || '',
  updateIPDDischargSummaryObj['Condition_At_the_timeOfdischarge'] = this.DischargesumForm.get("ConditionAtTheTimeOfDischarge").value || '',
  updateIPDDischargSummaryObj['TreatmentGiven'] =  this.DischargesumForm.get("TreatmentGiven").value || '',
  updateIPDDischargSummaryObj['TreatmentAdvisedAfterDischarge'] = this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || '',
  updateIPDDischargSummaryObj['Followupdate'] = this.dateTimeObj.date,
  updateIPDDischargSummaryObj['Remark'] =  ''
  updateIPDDischargSummaryObj['DischargeSummaryDate'] = this.dateTimeObj.date,//this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
  updateIPDDischargSummaryObj['OpDate'] =  this.dateTimeObj.date,
  updateIPDDischargSummaryObj['OPTime'] =  this.dateTimeObj.date,
  updateIPDDischargSummaryObj['DischargeDoctor1'] =this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
  updateIPDDischargSummaryObj['DischargeDoctor2'] = this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
  updateIPDDischargSummaryObj['DischargeDoctor3'] = this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
  updateIPDDischargSummaryObj['DischargeSummaryTime'] =this.dateTimeObj.time,
  updateIPDDischargSummaryObj['DoctorAssistantName'] = this.DischargesumForm.get("DoctorAssistantName").value || '',
  updateIPDDischargSummaryObj['CreatedBy'] = this.accountService.currentUserValue.user.id,
  updateIPDDischargSummaryObj['CreatedDate'] =  this.dateTimeObj.date,
  updateIPDDischargSummaryObj['ModifiedBy'] = this.accountService.currentUserValue.user.id,
  updateIPDDischargSummaryObj['ModifiedDate'] = this.dateTimeObj.date


  let insertIPPrescriptionDischarge =[];
  this.dsItemList.data.forEach(element =>{
    let insertIPPrescriptionDischargeObj = {};
    insertIPPrescriptionDischargeObj['opD_IPD_ID'] =  this.vAdmissionId || 0;
    insertIPPrescriptionDischargeObj['opD_IPD_Type'] = 1;
    insertIPPrescriptionDischargeObj['date'] = this.dateTimeObj.date;
    insertIPPrescriptionDischargeObj['pTime'] = this.dateTimeObj.time;
    insertIPPrescriptionDischargeObj['classID'] = 0;
    insertIPPrescriptionDischargeObj['genericId'] = 0;
    insertIPPrescriptionDischargeObj['drugId'] = element.ItemID || 0;
    insertIPPrescriptionDischargeObj['doseId'] = element.DoseId || 0;
    insertIPPrescriptionDischargeObj['days'] = element.Day || 0;
    insertIPPrescriptionDischargeObj['instructionId'] = 0;
    insertIPPrescriptionDischargeObj['qtyPerDay'] = 0;
    insertIPPrescriptionDischargeObj['totalQty'] = 0;
    insertIPPrescriptionDischargeObj['instruction'] = element.Instruction || 0;
    insertIPPrescriptionDischargeObj['remark'] =  0;
    insertIPPrescriptionDischargeObj['isEnglishOrIsMarathi'] = 0;
    insertIPPrescriptionDischargeObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    insertIPPrescriptionDischargeObj['createdBy'] = this.accountService.currentUserValue.user.id,
    insertIPPrescriptionDischarge.push(insertIPPrescriptionDischargeObj);
  });

   
  let deleteIPPrescriptionDischargeobj = {};
  deleteIPPrescriptionDischargeobj['opD_IPD_ID'] = this.vAdmissionId || 0;

  let SubmitData={
    'updateIPDDischargSummary':updateIPDDischargSummaryObj,
    'insertIPPrescriptionDischarge':insertIPPrescriptionDischarge,
    'deleteIPPrescriptionDischarg':deleteIPPrescriptionDischargeobj
  }
  console.log(SubmitData);
  setTimeout(() => {
    this._IpSearchListService.updateIPDDischargSummary(SubmitData).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'Discharge Summary Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            this.viewgetDischargesummaryPdf(this.vAdmissionId,);
          }
        });
      } else {
        Swal.fire('Error !', 'Discharge Summary not Updated', 'error');
      }
      this.isLoading = '';
    });
  }, 500);
  }
}
  onSubmit() {
   debugger
  
    this.submitted = true;
    this.isLoading = 'submit';
    // console.log(this.DischargeSList.DischargeSummaryId);
    // if ((this.DischargeSList.DischargeSummaryId != 0) && (this.DischargeSList.DischargeSummaryId !=undefined)) {
    if(this.DischargesumForm.get("AdmissionId").value){
      var m_data = {
        "updateIPDDischargSummary": {
          "DischargesummaryId":this.DischargesumForm.get("DischargesummaryId").value || "0",
          "DischargeId": this.vDischargeId,
          "History": this.DischargesumForm.get("History").value || "",
          "Diagnosis": this.DischargesumForm.get("Diagnosis").value || "",
          "Investigation": this.DischargesumForm.get("Investigation").value || "",
          "ClinicalFinding": this.DischargesumForm.get("ClinicalFinding").value || "",
          "OpertiveNotes": this.DischargesumForm.get("OpertiveNotes").value || "",
          "TreatmentGiven": this.DischargesumForm.get("TreatmentGiven").value || "",
          "TreatmentAdvisedAfterDischarge": this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || "",
          "Followupdate": this.DischargesumForm.get("Followupdate").value || "2021-05-24T06:18:37.533Z",
          "Remark": this.DischargesumForm.get("Remark").value || "",
          "OPDate": this.dateTimeObj.date,//this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
          "OPTime": this.dateTimeObj.date,// this.DischargesumForm.get("OPTime").value || "2021-05-24T06:18:37.533Z",
          "DischargeDoctor1": this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
          "DischargeDoctor2": this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
          "DischargeDoctor3": this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
          "DischargeSummaryTime":  this.dateTimeObj.time,
          "DoctorAssistantName": this.DischargesumForm.get("DoctorAssistantName").value || "",

        }
      }
      console.log(m_data);
      setTimeout(() => {
        this._IpSearchListService.updateIPDDischargSummary(m_data).subscribe(response => {
          console.log(response);
          if (response) {
            Swal.fire('Congratulations !', 'Discharge Summary updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                this.viewgetDischargesummaryPdf(this.vAdmissionId,);
              }
            });
          } else {
            Swal.fire('Error !', 'Discharge Summary not updated', 'error');
          }
          this.isLoading = '';
        });
      }, 500);
    }
    else {
      var m_data1 = {
        "insertIPDDischargSummary": {
          "DischargesummaryId": 0,// this.DischargesumForm.get("DischargesummaryId").value || "0",
          "AdmissionId":this.vAdmissionId,// this.DischargesumForm.get("AdmissionId").value || "0",
          "DischargeId": this.vDischargeId,
          "History": this.DischargesumForm.get("History").value || "",
          "Diagnosis": this.DischargesumForm.get("Diagnosis").value || "",
          "Investigation": this.DischargesumForm.get("Investigation").value || "",
          "ClinicalFinding": this.DischargesumForm.get("ClinicalConditionOnAdmisssion").value || "",
          "OpertiveNotes": this.DischargesumForm.get("OpertiveNotes").value || "",
          "TreatmentGiven": this.DischargesumForm.get("TreatmentGiven").value || "",
          "TreatmentAdvisedAfterDischarge": this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || "",
          "Followupdate": this.DischargesumForm.get("Followupdate").value || "2021-05-24T06:18:37.533Z",
          "Remark": this.DischargesumForm.get("Remark").value || "",
          "DischargeSummaryDate":  this.dateTimeObj.date,
          "OPDate": this.dateTimeObj.date,// this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
          "OPTime": this.dateTimeObj.time,//this.DischargesumForm.get("OPTime").value || "2021-05-24T06:18:37.533Z",
          "DischargeDoctor1": this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
          "DischargeDoctor2": this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
          "DischargeDoctor3": this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
          "DischargeSummaryTime":  this.dateTimeObj.time,
          "DoctorAssistantName": this.DischargesumForm.get("DoctorAssistantName").value || "",
        
        }
      }
      debugger
      console.log(m_data1)
      setTimeout(() => {
        this._IpSearchListService.insertIPDDischargSummary(m_data1).subscribe(response => {
          console.log(response);
          if (response) {
            Swal.fire('Congratulations !', 'Discharge Summary Save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                this.viewgetDischargesummaryPdf(this.vAdmissionId,);
              }
            });
          }
          else {
            Swal.fire('Error !', 'Discharge Summary not saved', 'error');
          }
          this.isLoading = '';
        });
      }, 500);

      // this.onClose();
    }//if

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
          title: "Discharge SummaryViewer"
        }
      });
  });
}
}



export class DischargeSummary{
  AdmissionId:any;            
  DischargeId:any;
  History:any;       
  Diagnosis:any;
  Investigation:any;
  ClinicalFinding:any;
  OpertiveNotes:any;
  TreatmentGiven:any;
  TreatmentAdvisedAfterDischarge:any;
  Followupdate:any;      
  Remark:any;
  DischargeSummaryDate:any;
  OPDate:any;        
  OPTime:any;
  DischargeDoctor1:any;
  DischargeDoctor2:any;
  DischargeDoctor3:any;
  DischargeSummaryTime:any;
  DoctorAssistantName:any;
  ClaimNumber:any;  
  PreOthNumber:any;
  AddedBy:any;  
  AddedByDate:any;
  UpdatedBy:any; 
  UpdatedByDate:any;
  SurgeryProcDone:any;
  ICD10CODE:any;
  ClinicalConditionOnAdmisssion:any;
  OtherConDrOpinions:any;
  ConditionAtTheTimeOfDischarge:any;
  PainManagementTechnique:any;
  LifeStyle:any;
  WarningSymptoms:any;
  Radiology:any;
  IsNormalOrDeath:any;  
  DischargesummaryId:any;  
  Pathology:any;
  DocNameID:any;
  
  
  constructor(DischargeSummary){
    this.DischargesummaryId=DischargeSummary.DischargesummaryId || 0,
    this.AdmissionId=DischargeSummary.AdmissionId || 0,
    this.DischargeId=DischargeSummary.DischargeId || 0,
    this.History=DischargeSummary.History || 0,
    this.Diagnosis=DischargeSummary.Diagnosis || 0,
    this.Investigation=DischargeSummary.Investigation || 0,
    this.ClinicalFinding=DischargeSummary.ClinicalFinding || 0,
    this.OpertiveNotes=DischargeSummary.OpertiveNotes || 0,
    this.TreatmentGiven=DischargeSummary.TreatmentGiven || 0,
    this.TreatmentAdvisedAfterDischarge=DischargeSummary.TreatmentAdvisedAfterDischarge || 0,
    this.Followupdate=DischargeSummary.Followupdate || new Date(),
    this.Remark=DischargeSummary.Remark || 0,
    this.DischargeSummaryDate=DischargeSummary.DischargeSummaryDate || 0,
    this.OPDate=DischargeSummary.OPDate || 0,
    this.OPTime=DischargeSummary.OPTime || 0,
    this.DischargeDoctor1=DischargeSummary.DischargeDoctor1 || 0,
    this.DischargeDoctor2=DischargeSummary.DischargeDoctor2 || 0,
    this.DischargeDoctor3=DischargeSummary.DischargeDoctor3 || 0,
    this.DischargeSummaryTime=DischargeSummary.DischargeSummaryTime || 0,
    this.DoctorAssistantName=DischargeSummary.DoctorAssistantName || 0
    this.Pathology=DischargeSummary.Pathology || '';
  }
}
export class MedicineItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  DoseName:any;
  Day: number;
  Instruction: any;
  DoseId:any;
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
      this.Day = MedicineItemList.Day || 0;
      this.Instruction = MedicineItemList.Instruction || '';
      this.DoseName = MedicineItemList.DoseName || '';
    }
  }
}
