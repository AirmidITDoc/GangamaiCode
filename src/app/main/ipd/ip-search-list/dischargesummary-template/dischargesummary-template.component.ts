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



  isDoseSelected: boolean = false;
  isItemIdSelected: boolean = false;
  isdoctor1Selected: boolean = false;
  isdoctor2Selected: boolean = false;

  registerObj = new DischargeSummary({});

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
    }
    this.getTemplateList();
    this.getDoseList();
    this.getDoctorList1();
    this.getDoctorList2();
  }

  createdisctemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
      DischargeDoctor1: [''],
      DischargeDoctor2: [''],

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
        const ddValue = this.Doctor1List.filter(item => item.DoctorId == this.registerObj.DocNameID);
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


  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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

  onSubmit() { }
  onAddTemplate() {
    debugger
    this.vTemplateDesc = this.discSummary.get('TemplateId').value.TemplateDescription || ''

  }
  onClear() { }
  onClose() { }
}
