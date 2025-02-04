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
import { AddItemComponent } from 'app/main/opd/new-casepaper/add-item/add-item.component';

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
  filteredOptionstemplate: Observable<string[]>;
  optionstemplate: any[] = []
  optionsDoc1: any[] = [];
  optionsDoc2: any[] = [];
  vIsNormalDeath: any;


  isDoseSelected: boolean = false;
  isItemIdSelected: boolean = false;
  isdoctor1Selected: boolean = false;
  isdoctor2Selected: boolean = false;

  registerObj = new DischargeSummary({});
  vAdmissionId: any = 0;
  DischargeSummaryId: any = 0;
  vDischargeId: any = 0;
  isLoading: string = '';
  DocName1: any = 0;
  DocName2: any = 0;
  DocName3: any;
  IsNormalDeath: any=1;

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
    public datePipe: DatePipe) {
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
  }

  ngOnInit(): void {
    this.discSummary = this.createdisctemplateForm();
    this.MedicineItemForm = this.MedicineItemform();
    // if (this.advanceDataStored.storage) {
    //   this.selectedAdvanceObj = this.advanceDataStored.storage;
    //   this.registerObj = this.advanceDataStored.storage;
    //   this.vAdmissionId = this.selectedAdvanceObj.AdmissionID;
    //   console.log(this.registerObj);
    //   this.getDoctorList1();
    //   this.getDoctorList2();
    //   this.getDischargeSummaryData(this.registerObj)
    //   this.getPrescriptionList(this.registerObj)
    // }

    this.getDoseList();
    this.getDoctorList1();
    this.getDoctorList2();
    this.getDischargeSummaryData(this.registerObj)
    this.getdischargeIdbyadmission();
   

    this.filteredOptionstemplate = this.discSummary.get('TemplateId').valueChanges.pipe(
      startWith(''),
      map(value => this._filtertemp(value)),
    );
  }

  createdisctemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
      DischargeDoctor1: [''],
      DischargeDoctor2: [''],
      IsNormalOrDeath: 'True',
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
  ;
  getTemplateList() {

    this._IpSearchListService.gettemplateCombo().subscribe(data => {
      this.TemplateList = data;
      console.log(this.TemplateList)
      this.optionstemplate = this.TemplateList.slice();
      this.filteredOptionstemplate = this.discSummary.get('TemplateId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtertemp(value) : this.TemplateList.slice()),
      );
      if (data) {

        this.discSummary.get('TemplateId').setValue(this.TemplateList[0]);
        this.vTemplateDesc = this.TemplateList[0].TemplateDescription
      }

    });

  }

  getDiscSummTemplateList(AdmissionId) {
    var data = {
      "AdmissionId": AdmissionId
    }
    this._IpSearchListService.gettemplateCombofrDiscSumm(data).subscribe(data => {
      this.TemplateList = data;
      console.log(this.TemplateList)
      this.optionstemplate = this.TemplateList.slice();
      // this.filteredOptionstemplate = this.discSummary.get('TemplateId').valueChanges.pipe(
      //   startWith(''),
      //   map(value => value ? this._filtertemp1(value) : this.TemplateList.slice()),
      // );
      if (data) {

        this.discSummary.get('TemplateId').setValue(this.TemplateList[0]);
        this.vTemplateDesc = this.TemplateList[0].TemplateDescriptionHtml
      }

    });

  }



  private _filtertemp(value: any): string[] {
    if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.TemplateList.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }

  }



  private _filtertemp1(value: any): string[] {
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
  registerObj1: any;
  getdischargeIdbyadmission() {
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
    debugger
    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      if (data) {
        this.registerObj = data[0];
        if (this.registerObj)
          this.vDischargeId = this.registerObj.DischargeId
        console.log(data[0])
      }
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
  // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  @ViewChild('addbutton') addbutton: ElementRef;
  
  add: boolean = true;
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
      this.addbutton.nativeElement.focus();
      this.add = false;
      // this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      // this.addbutton.focus;
      // this.add = true;
    }
  }


  onAddTemplate() {

    this.vTemplateDesc = this.discSummary.get('TemplateId').value.TemplateDescription || ''

  }



  Istemplate = false;
  chkTemplate(event) {
    if (event.checked)
      this.Istemplate = true
    else
      this.Istemplate = true
  }
  RetrDischargeSumryList: any = [];

  getDischargeSummaryData(el) {

    var m_data2 = {
      "AdmissionId": el.AdmissionID
    }

    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
      this.RetrDischargeSumryList = data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);

      if (this.RetrDischargeSumryList.length != 0) {
        this.DischargeSummaryId = this.RetrDischargeSumryList[0].DischargeSummaryId
        this.DocName1 = this.RetrDischargeSumryList[0].DischargeDoctor1
        this.DocName2 = this.RetrDischargeSumryList[0].DischargeDoctor2
        // this.DocName3 = this.RetrDischargeSumryList[0].DischargeDoctor3
        this.IsNormalDeath = this.RetrDischargeSumryList[0].IsNormalOrDeath
        }
        this.getRetevDropdownvalue();

        if (this.IsNormalDeath == 1) {
          this.vIsNormalDeath = true;
          this.discSummary.get("IsNormalOrDeath").setValue('True');
        }
        else {
          this.vIsNormalDeath = false;
          this.discSummary.get("IsNormalOrDeath").setValue('false');
        }

     


    });
    // this.getRetevDropdownvalue();

  }

  getTemplateDetails() {
    debugger
    if (this.DischargeSummaryId == 0)
      this.getTemplateList();
    else if (this.DischargeSummaryId != 0) {
      this.getDiscSummTemplateList(this.vAdmissionId);

    }

  }

  getRetevDropdownvalue() {
    debugger
    if (this.DischargeSummaryId == 0)
      this.getTemplateList();
    else if (this.DischargeSummaryId != 0) {
      this.getDiscSummTemplateList(this.vAdmissionId);

    }

    // if(this.DocName1 !=0){
    const ddValue1 = this.Doctor1List.filter(item => item.DoctorID == this.DocName1);
    console.log(ddValue1)
    this.discSummary.get("DischargeDoctor1").setValue(ddValue1[0]);
    // }
    // if(this.DocName2 !=0){
    const ddValue2 = this.Doctor2List.filter(item => item.DoctorID == this.DocName2);
    console.log(ddValue2)
    this.discSummary.get("DischargeDoctor2").setValue(ddValue2[0]);
    // }

  }

  onSubmit() {
 Swal.fire({
      title: 'Do you want to Save the Discharge Summary Template ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save!"

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {


    let DoctorName1 = 0;
    if (this.discSummary.get("DischargeDoctor1").value)
      DoctorName1 = this.discSummary.get("DischargeDoctor1").value.DoctorID;

    let DoctorName2 = 0;
    if (this.discSummary.get("DischargeDoctor2").value)
      DoctorName2 = this.discSummary.get("DischargeDoctor2").value.DoctorID;

    if (DoctorName1 && DoctorName2) {
      if (!this.DischargeSummaryId) {
        let insertIPDDischargSummaryObj = {};

        insertIPDDischargSummaryObj['dischargesummaryId'] = 0,
          insertIPDDischargSummaryObj['admissionId'] = this.vAdmissionId || 0;
        insertIPDDischargSummaryObj['dischargeId'] = this.vDischargeId,
          insertIPDDischargSummaryObj['followupdate'] = this.dateTimeObj.date,
          insertIPDDischargSummaryObj['dischargeDoctor1'] = DoctorName1,
          insertIPDDischargSummaryObj['dischargeDoctor2'] = DoctorName2,
          insertIPDDischargSummaryObj['dischargeDoctor3'] = 1,//DoctorName3,
          insertIPDDischargSummaryObj['addedBy'] = this.accountService.currentUserValue.user.id,
          insertIPDDischargSummaryObj['templateDescriptionHtml'] = this.discSummary.get("TemplateDesc").value || '',
          insertIPDDischargSummaryObj['isNormalOrDeath'] = this.discSummary.get("IsNormalOrDeath").value

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
          'insertIPDDischargSummarytemplate': insertIPDDischargSummaryObj,
          'insertIPPrescriptionDischarge': insertIPPrescriptionDischarge
        }
        console.log(SubmitData);
        setTimeout(() => {
          this._IpSearchListService.insertIPDDischargSummarytemplate(SubmitData).subscribe(response => {
            //console.log(response);
            if (response) {
              this._matDialog.closeAll();
              this.toastr.success('Discharge Summary Template save Successfully !', 'Congratulations !', {
                toastClass: 'tostr-tost custom-toast-success',
              });  

          
            } else {
              this.toastr.success('Discharge Summary  Template not saved', 'error', {
                toastClass: 'tostr-tost custom-toast-success',
              }); 
            }
            this.isLoading = '';
          });
        }, 500);
      } else {
        let updateIPDDischargSummaryObj = {};
        updateIPDDischargSummaryObj['dischargesummaryId'] = this.DischargeSummaryId || 0,
          updateIPDDischargSummaryObj['dischargeId'] = this.vDischargeId,
          updateIPDDischargSummaryObj['followupdate'] = this.dateTimeObj.date,
          updateIPDDischargSummaryObj['dischargeDoctor1'] = DoctorName1,
          updateIPDDischargSummaryObj['dischargeDoctor2'] = DoctorName2,
          updateIPDDischargSummaryObj['dischargeDoctor3'] = 1,//DoctorName3, 
          updateIPDDischargSummaryObj['updatedBy'] = this.accountService.currentUserValue.user.id,
          updateIPDDischargSummaryObj['templateDescriptionHtml'] = this.discSummary.get("TemplateDesc").value || '',
          updateIPDDischargSummaryObj['isNormalOrDeath'] = this.discSummary.get("IsNormalOrDeath").value



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
          'updatetIPDDischargSummarytemplate': updateIPDDischargSummaryObj,
          'insertIPPrescriptionDischarge': insertIPPrescriptionDischarge,
          'deleteIPPrescriptionDischarge': deleteIPPrescriptionDischargeobj
        }
        console.log(SubmitData);
        setTimeout(() => {
          this._IpSearchListService.updateIPDDischargSummaryTemplate(SubmitData).subscribe(response => {
            if (response) {
              this._matDialog.closeAll();
              this.toastr.success('Discharge Summary Template save Successfully !', 'Congratulations !', {
                toastClass: 'tostr-tost custom-toast-success',
              });  
              this.viewgetDischargesummaryTempPdf(this.vAdmissionId);
            
            } else {
              this.toastr.success('Discharge Summary  Template not saved', 'error', {
                toastClass: 'tostr-tost custom-toast-success',
              }); 
            }
            this.isLoading = '';
          });
        }, 500);
      }

    } else {

      this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;

    }
  }
})
  
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
            title: "Discharge Summary Template Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.viewgetDischargesummaryPathologyReportPdf(AdmId) 
        }); 
    });
  }
  viewgetDischargesummaryPathologyReportPdf(AdmId) {

    this._IpSearchListService.viewgetDischargesummaryPathologyReportPdf(
      AdmId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pathology Report Viewer"
          }
        });
    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear() { 
    this.discSummary.reset();
  }
  onClose() {
    this._matDialog.closeAll();
   }

  getItemMaster() {
    const dialogRef = this._matDialog.open(AddItemComponent,
      {
        maxWidth: "60vw",
        maxHeight: "65vh",
        width: '100%',
        height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
}
