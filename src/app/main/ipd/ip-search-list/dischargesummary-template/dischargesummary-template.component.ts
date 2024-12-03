import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IPSearchListService } from '../ip-search-list.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DischargeSummary, MedicineItemList } from '../discharge-summary/discharge-summary.component';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-dischargesummary-template',
  templateUrl: './dischargesummary-template.component.html',
  styleUrls: ['./dischargesummary-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargesummaryTemplateComponent implements OnInit {
  selectedAdvanceObj: AdvanceDetailObj;
  discSummary: FormGroup;
  vTemplateDesc: any;
  vTemplateId: any;
  noOptionFound: any;
  ItemId: any;
  vDay: any;
  vInstruction: any;
  screenFromString = 'discharge-summary';

  TemplateList: any = [];
  Chargelist: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  istemplateSelected: boolean = false;

  filteredOptionsItem: any;
  filteredOptionsDosename: Observable<string[]>;
  filteredOptionDoctor1: any;
  filteredOptionDoctor2: Observable<string[]>;

  optionsDoc1: any[] = [];
  optionsDoc2: any[] = [];
  vIsNormalDeath:any;


  isDoseSelected: boolean = false;
  isItemIdSelected: boolean = false;
  isdoctor1Selected: boolean = false;
  isdoctor2Selected: boolean = false;

  registerObj = new DischargeSummary({});
  vAdmissionId: any = 0;
  DischargeSummaryId: any;
  vDischargeId: any = 0;
  isLoading: string = '';
  DocName1:any;
  DocName2:any;
  DocName3:any;

  dsItemList = new MatTableDataSource<MedicineItemList>();
  displayedColumns: string[] = [
    'ItemName',
    'DoseName',
    'Day',
    //  'Remark',
    'Action'
  ]

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };

  MedicineItemForm: FormGroup;
  public tools: object = {
    type: 'MultiRow',
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'CreateTable', '|',
      'CreateLink', 'Image', '|',
      'Indent', 'Outdent', '|',
      'ClearFormat', '|', 'FullScreen',
      // 'SourceCode',
    ]
  };


  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargesummaryTemplateComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.discSummary = this.createdisctemplateForm();
    this.MedicineItemForm = this.MedicineItemform();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj = this.advanceDataStored.storage;
      this.vAdmissionId = this.selectedAdvanceObj.AdmissionID;
      console.log(this.registerObj);
      this.getDoctorList1();
      this.getDoctorList2();
      this.getDischargeSummaryData(this.registerObj) 
      this.getPrescriptionList(this.registerObj)
    }
    this.getTemplateList();
    this.getDoseList();
    this.getDoctorList1();
    this.getDoctorList2();
    this.getdischargeIdbyadmission();
  }

  createdisctemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
      DischargeDoctor1: [''],
      DischargeDoctor2: [''],
      IsNormalOrDeath:'True', 
    });
  }


  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
    });
  }
  filteredOptionstemplate: Observable<string[]>;
  optionstemplate: any[] = [];
  getTemplateList() {
    var data={
      "DischargesummaryId":this.DischargeSummaryId
    }
    this._IpSearchListService.gettemplateCombo().subscribe(data => {
      this.TemplateList = data;
      console.log(this.TemplateList)
      this.optionstemplate = this.TemplateList.slice();
      this.filteredOptionstemplate = this.discSummary.get('TemplateId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtertemp(value) : this.TemplateList.slice()),
      );

    });
  }
  private _filtertemp(value: any): string[] {
    if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.optionstemplate.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTexttemplate(option) {
    return option && option.TemplateName ? option.TemplateName : '';
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  getSearchItemList() {
    var m_data = {
      "ItemName": `${this.MedicineItemForm.get('ItemId').value}%`,
      "StoreId": this.accountService.currentUserValue.user.storeId
    }
    //console.log(m_data); 
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
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
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
  doseList: any = [];
  getDoseList() {
    this._IpSearchListService.getDoseList().subscribe((data) => {
      this.doseList = data;
      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDosename(value) : this.doseList.slice()),
      );
    });
  }
  private _filterDosename(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
      return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
    }
  }

  getDoctorList1() {
    
    this._IpSearchListService.getDischaregDoctor1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.filteredOptionDoctor1 = this.discSummary.get('DischargeDoctor1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc1(value) : this.Doctor1List.slice()),
      );
      if (this.registerObj) {
        const ddValue = this.Doctor1List.filter(item => item.DoctorId == this.registerObj.DischargeDoctor1);
        //console.log(ddValue)
        this.discSummary.get('DischargeDoctor1').setValue(ddValue[0]);
        this.discSummary.updateValueAndValidity();
      }
    });
  }
  getDoctorList2() {
    
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor2List = data;
      console.log(data)
      this.filteredOptionDoctor2 = this.discSummary.get('DischargeDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc2(value) : this.Doctor2List.slice()),
      );
      if (this.registerObj) {
        const ddValue = this.Doctor1List.filter(item => item.DoctorId == this.registerObj.DischargeDoctor2);
        //console.log(ddValue)
        this.discSummary.get('DischargeDoctor2').setValue(ddValue[0]);
        this.discSummary.updateValueAndValidity();
      }
    });
    
  }



  getOptionTextsDoctor1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextsDoctor2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  private _filterdoc1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.Doctor1List.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  private _filterdoc2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.Doctor2List.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }

  getdischargeIdbyadmission(){
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
 
    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      this.registerObj = data[0];
    this.vDischargeId=this.registerObj.DischargeId
    console.log(data[0])
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


  getPrescriptionList(el) {
    // 
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


  onAdd() {
    if ((this.MedicineItemForm.get('ItemId').value == '' || this.MedicineItemForm.get('ItemId').value == null || this.MedicineItemForm.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.filteredOptionsItem.find(item => item.ItemName == this.MedicineItemForm.get('ItemId').value.ItemName)) {
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
    if (!this.doseList.find(item => item.DoseName == this.MedicineItemForm.get('DoseId').value.DoseName)) {
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
    if (!iscekDuplicate) {
      this.dsItemList.data = [];
      this.Chargelist.push(
        {
          ItemID: this.MedicineItemForm.get('ItemId').value.ItemId || 0,
          ItemName: this.MedicineItemForm.get('ItemId').value.ItemName || '',
          DoseName: this.MedicineItemForm.get('DoseId').value.DoseName || '',
          DoseId: this.MedicineItemForm.get('DoseId').value.DoseId || '',
          Days: this.vDay,
          Instruction: this.vInstruction || ''
        });
      this.dsItemList.data = this.Chargelist
      //console.log(this.dsItemList.data); 
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


  onAddTemplate() {
    
    this.vTemplateDesc = this.discSummary.get('TemplateId').value.TemplateDescription || ''

  }



  Istemplate=false;
  chkTemplate(event){
      if (event.checked) 
      this.Istemplate=true
  else
  this.Istemplate=true
  }
  RetrDischargeSumryList: any = [];
  
  getDischargeSummaryData(el) {
    
    var m_data2 = {
      "AdmissionId": el.AdmissionID 
    }
    //console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
      this.RetrDischargeSumryList = data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);
      this.DischargeSummaryId = this.RetrDischargeSumryList[0].DischargeSummaryId
      this.vTemplateDesc = this.RetrDischargeSumryList[0].TemplateDescriptionHtml 
      // this.vhistory = this.RetrDischargeSumryList[0].History 
      // this.vClinicalCondition = this.RetrDischargeSumryList[0].ClinicalConditionOnAdmisssion
      // this.vClinicalFinding =  this.RetrDischargeSumryList[0].ClinicalFinding
      // this.vSURGERYprocedure = this.RetrDischargeSumryList[0].SurgeryProcDone
      // this.vOperativeNotes = this.RetrDischargeSumryList[0].OpertiveNotes
      // this.vPathology = this.RetrDischargeSumryList[0].Investigation
      // this.vRadiology = this.RetrDischargeSumryList[0].Radiology
      // this.vTreatmentGiven = this.RetrDischargeSumryList[0].TreatmentGiven
      // this.vTreatmentAdvisedAfterDischarge = this.RetrDischargeSumryList[0].TreatmentAdvisedAfterDischarge
      // this.vOtherConDrOpinions = this.RetrDischargeSumryList[0].OtherConDrOpinions
      // this.vPainManagementTechnique = this.RetrDischargeSumryList[0].PainManagementTechnique 
      // this.vLifeStyle = this.RetrDischargeSumryList[0].LifeStyle
      // this.vConditionofTimeDischarge = this.RetrDischargeSumryList[0].ConditionAtTheTimeOfDischarge 
      // this.vDoctorAssistantName = this.RetrDischargeSumryList[0].DoctorAssistantName 
      // this.vClaimNumber = this.RetrDischargeSumryList[0].ClaimNumber
      // this.vPreOthNumber =  this.RetrDischargeSumryList[0].PreOthNumber
      // this.DocName1 = this.RetrDischargeSumryList[0].DischargeDoctor1
      // this.DocName2 = this.RetrDischargeSumryList[0].DischargeDoctor2
      // this.DocName3 = this.RetrDischargeSumryList[0].DischargeDoctor3
      // this.IsNormalDeath = this.RetrDischargeSumryList[0].IsNormalOrDeath
       this.getRetevDropdownvalue(); 
       
      //  if(this.IsNormalDeath == 1){
      //   this.vIsNormalDeath = true;
      //   this.DischargesumForm.get("IsNormalOrDeath").setValue('True');
      //  }
      //  else{
      //   this.vIsNormalDeath = false;
      //   this.DischargesumForm.get("IsNormalOrDeath").setValue('false');
      //  } 
    }); 
  }

  getRetevDropdownvalue(){
    
    
      const ddValue1= this.Doctor1List.filter(item => item.DoctorID ==  this.DocName1);
      console.log(ddValue1) 
      this.discSummary.get("DischargeDoctor1").setValue(ddValue1[0]);
     
      const ddValue2= this.Doctor2List.filter(item => item.DoctorID ==  this.DocName2);
      console.log(ddValue2) 
      this.discSummary.get("DischargeDoctor2").setValue(ddValue2[0]);
   
      // const ddValue3= this.Doctor3List.filter(item => item.DoctorID ==  this.DocName3);
      // console.log(ddValue3) 
      // this.discSummary.get("DischargeDoctor3").setValue(ddValue3[0]);
   
   
  }
  onSubmit(){
    
   
    let DoctorName1 = 0;
    if(this.discSummary.get("DischargeDoctor1").value)
      DoctorName1 = this.discSummary.get("DischargeDoctor1").value.DoctorID;
  
    let DoctorName2 = 0;
    if(this.discSummary.get("DischargeDoctor2").value)
      DoctorName2 = this.discSummary.get("DischargeDoctor2").value.DoctorID;
  
    // let DoctorName3 = 0;
    // if(this.discSummary.get("DischargeDoctor3").value)
    //   DoctorName3 =this.discSummary.get("DischargeDoctor3").value.DoctorID;
  
    if(!this.DischargeSummaryId){
    let insertIPDDischargSummaryObj = {};
  
    insertIPDDischargSummaryObj['dischargesummaryId'] = 0,
    insertIPDDischargSummaryObj['admissionId'] =this.vAdmissionId || 0;
    insertIPDDischargSummaryObj['dischargeId'] = this.vDischargeId,
    insertIPDDischargSummaryObj['followupdate'] = this.dateTimeObj.date,
    insertIPDDischargSummaryObj['dischargeDoctor1'] = DoctorName1,
    insertIPDDischargSummaryObj['dischargeDoctor2'] = DoctorName2,
    insertIPDDischargSummaryObj['dischargeDoctor3'] = 1,//DoctorName3,
    insertIPDDischargSummaryObj['addedBy'] = this.accountService.currentUserValue.user.id,
    insertIPDDischargSummaryObj['templateDescriptionHtml'] = this.discSummary.get("TemplateDesc").value || '',
    insertIPDDischargSummaryObj['isNormalOrDeath'] = this.discSummary.get("IsNormalOrDeath").value
  
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
    let SubmitData={
      'insertIPDDischargSummarytemplate':insertIPDDischargSummaryObj,
      'insertIPPrescriptionDischarge':insertIPPrescriptionDischarge
    }
    console.log(SubmitData);
    setTimeout(() => {
      this._IpSearchListService.insertIPDDischargSummarytemplate(SubmitData).subscribe(response => {
        //console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Discharge Summary Saved Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              this.viewgetDischargesummaryTempPdf(this.vAdmissionId);
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
    updateIPDDischargSummaryObj['dischargesummaryId'] =this.DischargeSummaryId || 0,
        updateIPDDischargSummaryObj['dischargeId'] = this.vDischargeId,
    updateIPDDischargSummaryObj['followupdate'] = this.dateTimeObj.date,
    updateIPDDischargSummaryObj['dischargeDoctor1'] = DoctorName1,
    updateIPDDischargSummaryObj['dischargeDoctor2'] = DoctorName2,
    updateIPDDischargSummaryObj['dischargeDoctor3'] = 1,//DoctorName3, 
    updateIPDDischargSummaryObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    updateIPDDischargSummaryObj['templateDescriptionHtml'] = this.discSummary.get("TemplateDesc").value || '',
    updateIPDDischargSummaryObj['isNormalOrDeath'] = this.discSummary.get("IsNormalOrDeath").value 
  
  
  
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
      insertIPPrescriptionDischargeObj['days'] = element.Days || 0;
      insertIPPrescriptionDischargeObj['instructionId'] = 0;
      insertIPPrescriptionDischargeObj['qtyPerDay'] = 0;
      insertIPPrescriptionDischargeObj['totalQty'] = 0; 
      insertIPPrescriptionDischargeObj['instruction'] = 0 ;
      insertIPPrescriptionDischargeObj['remark'] =0;
      insertIPPrescriptionDischargeObj['isEnglishOrIsMarathi'] = 0;
      insertIPPrescriptionDischargeObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
      insertIPPrescriptionDischargeObj['createdBy'] = this.accountService.currentUserValue.user.id,
      insertIPPrescriptionDischarge.push(insertIPPrescriptionDischargeObj);
    });
  
     
    let deleteIPPrescriptionDischargeobj = {};
    deleteIPPrescriptionDischargeobj['opD_IPD_ID'] = this.vAdmissionId || 0;
  
    let SubmitData={
      'updatetIPDDischargSummarytemplate':updateIPDDischargSummaryObj,
      'insertIPPrescriptionDischarge':insertIPPrescriptionDischarge,
      'deleteIPPrescriptionDischarge':deleteIPPrescriptionDischargeobj
    }
    console.log(SubmitData);
    setTimeout(() => {
      this._IpSearchListService.updateIPDDischargSummaryTemplate(SubmitData).subscribe(response => {
       // console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Discharge Summary Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
           
              this.viewgetDischargesummaryTempPdf(this.vAdmissionId);
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
  
    this._IpSearchListService.getIpDischargesummaryTempReceipt(
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
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear() { }
  onClose() { }
}
