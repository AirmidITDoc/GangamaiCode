import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-prescription-template',
  templateUrl: './prescription-template.component.html',
  styleUrls: ['./prescription-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionTemplateComponent implements OnInit {
  displayedItemColumn: string[] = [
    'ItemName',
    'DoseName',
    'Days', 
    'Instruction',
    'Action'
  ]
  displayedTemplateColumn: string[] = [
    'TemplateId',
    'TemplateName' 
  ]

  TemplateForm:FormGroup; 
  sIsLoading: string = '';
  noOptionFound: boolean = false;
  currentDate = new Date();  
  ItemName: any;
  BalanceQty: any;
  vQty: any;
  ItemId: any; 
  vRemark: any; ;
  isDrugIdSelected: any;
  filteredOptionsItem: any;
  vDay: any;
  vInstruction: any;
  Chargelist: any = []; 
  isItemIdSelected: boolean = false;
  filteredOptionsDosename: Observable<string[]>;
  doseList: any = [];
  isDoseSelected: boolean = false; 
  vTemplatename:any; 

  dsItemList = new MatTableDataSource<MedicineItemList>();
  dsTemplateList = new MatTableDataSource<Templatelist>();
  
  constructor( 
    private _CasepaperService: CasepaperService, 
    private _formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
  ) { }

  ngOnInit(): void {
    this.TemplateFomr();
    this.getDoseList() ;
  }

  TemplateFomr() {
    this.TemplateForm = this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
      Remark:'' ,
      TemplateName:'',
      OP_Ip_Type:'1',
      Formname:''
    });
  } 


  //Prescription List
  getSearchItemList() { 
    var m_data = {
      "ItemName": `${this.TemplateForm.get('ItemId').value}%`,
      "StoreId": this._loggedService.currentUserValue.user.storeId
    }
    console.log(m_data);
    this._CasepaperService.getItemlist(m_data).subscribe(data => {
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
    this.ItemId = obj.ItemId;
  }

  getDoseList() {
    this._CasepaperService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
      this.filteredOptionsDosename = this.TemplateForm.get('DoseId').valueChanges.pipe(
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
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }

  Day1: any = 0;
  Day2: any = 0;
  onAdd() {
    debugger
    if ((this.TemplateForm.get('ItemId').value == '' || this.TemplateForm.get('ItemId').value == null || this.TemplateForm.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.filteredOptionsItem.find(item => item.ItemName == this.TemplateForm.get('ItemId').value.ItemName)) {
      this.toastr.warning('Please select valid Item Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.TemplateForm.get('DoseId').value == '' || this.TemplateForm.get('DoseId').value == null || this.TemplateForm.get('DoseId').value == undefined)) {
      this.toastr.warning('Please select Dose', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.doseList.find(item => item.DoseName == this.TemplateForm.get('DoseId').value.DoseName)) {
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
          ItemID: this.TemplateForm.get('ItemId').value.ItemId || 0,
          ItemName: this.TemplateForm.get('ItemId').value.ItemName || '',
          DoseId: this.TemplateForm.get('DoseId').value.DoseId || 0,
          DoseName: this.TemplateForm.get('DoseId').value.DoseName || '',
          Days: this.TemplateForm.get('Day').value || 0,
          Instruction: this.vInstruction || ''
        });
      this.dsItemList.data = this.Chargelist
      console.log(this.dsItemList.data);
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    this.TemplateForm.get('ItemId').reset('');
    this.TemplateForm.get('DoseId').reset('');
    this.TemplateForm.get('Day').reset('');
    this.TemplateForm.get('Instruction').reset('');
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
  onSave(){
   
    if(this.vTemplatename == '' || this.vTemplatename == undefined || this.vTemplatename == null){ 
      this.toastr.warning('Please enter Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.TemplateForm.get('FormName').value == '' || this.TemplateForm.get('FormName').value == undefined || this.TemplateForm.get('FormName').value == null){ 
      this.toastr.warning('Please enter Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.dsItemList.data.length == 0) {
      this.toastr.warning('please add item in Prescription list  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

  }
  onClose(){
    this._matDialog.closeAll();
  }

  onClear(){

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
  add: boolean = false;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

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
}
export class Templatelist {
  TemplateName: any;
  TemplateId: any; 
  /**
  * Constructor
  *
  * @param Templatelist
  */
  constructor(Templatelist) {
    {
      this.TemplateName = Templatelist.TemplateName || '';
      this.TemplateId = Templatelist.TemplateId || 0; 
    }
  }
}
