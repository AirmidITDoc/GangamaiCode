import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CanteenRequestService } from '../canteen-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { CanteenList } from '../canteen-request.component';

@Component({
  selector: 'app-new-canteen-request',
  templateUrl: './new-canteen-request.component.html',
  styleUrls: ['./new-canteen-request.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCanteenRequestComponent implements OnInit {
  displayedVisitColumns: string[] = [
    'Date',
    'Time'
  ]
  displayedVisitColumns2: string[] = [
    'ItemName',
    'Qty',
    'Remark',
    'buttons'
  ]
  
  vOPIPId: any = 0;
  vOPDNo: any ;
  vTariffId: any = 0;
  vClassId: any = 0;
  filteredOptions:any;
  PatientListfilteredOptions:any;
  noOptionFound:any;
  PatientName: any ;
  vAdmissionID: any = 0;
  RegNo:any;
  Doctorname:any;
  Tarrifname:any;
  CompanyName:any;
  WardName:any;
  BedNo:any;
  registerObj:any; 
  isRegIdSelected:boolean=false;
  isItemIdSelected:boolean=false;
  filteredOptionsWard: Observable<string[]>;
  optionsWard: any[] = [];
  isWardselected: boolean = false;
  filteredOptionsStore: Observable<string[]>;
  optionsStore: any[] = [];
  isStoreselected: boolean = false;
  WardList: any = [];
  StoreList: any = [];
  Itemlist: any = [];
  PresItemlist: any = [];
  dataArray: any = [];
  filteredOptionsItem:any;
  ItemId:any;
  ItemName:any;
  vQty:any;
  vRemark:any
  Chargelist:any=[];
  vStoredId:any;

  dsItemList = new MatTableDataSource<CanteenItemList>(); 
  dsCanteenDateList = new MatTableDataSource<CanteenList>();

  constructor(
    public _CanteenRequestservice:CanteenRequestService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getWardList(); 
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._CanteenRequestservice.MyForm.get('RegID').value}%`
    }
    if (this._CanteenRequestservice.MyForm.get('RegID').value.length >= 1) {
      this._CanteenRequestservice.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  }
 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' '+ option.MiddleName + ' ' + option.LastName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj) {
    debugger
    if(obj.IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged');
      this.PatientName = ''  
      this.vAdmissionID =  ''
      this.RegNo = ''
      this.Doctorname =  ''
      this.Tarrifname = ''
      this.CompanyName =''
      this.vOPDNo = ''
      this.WardName =''
      this.BedNo = ''
    }
    else{
      debugger
      this.registerObj = obj;
      // this.PatientName = obj.FirstName + '' + obj.LastName;
      this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
      this.RegNo = obj.RegNo;
      this.vAdmissionID = obj.AdmissionID;
      this.CompanyName = obj.CompanyName;
      this.Tarrifname = obj.TariffName;
      this.Doctorname = obj.DoctorName;
      // this.vOpIpId = obj.AdmissionID;
      this.vOPDNo = obj.IPDNo;
      this.WardName = obj.RoomName;
      this.BedNo = obj.BedName;
      console.log(obj);
    } 
  } 


  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    } 
  }
  gePharStoreList() {
    this._CanteenRequestservice.getPharmacyStoreList().subscribe(data => {
      this.StoreList = data;
      this.optionsStore = this.StoreList.slice();
      this.filteredOptionsStore = this._CanteenRequestservice.MyForm.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterStore(value) : this.StoreList.slice()),
      );
      this._CanteenRequestservice.MyForm.get('StoreId').setValue(this.StoreList[7])
    });
  } 
  private _filterWard(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.optionsWard.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    } 
  }
  getWardList() {
    this._CanteenRequestservice.getWardList().subscribe(data => {
      this.WardList = data;
      console.log(this.WardList)
      this.optionsWard = this.WardList.slice();
      this.filteredOptionsWard = this._CanteenRequestservice.MyForm.get('WardName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWard(value) : this.WardList.slice()),
      ); 
    });
  }
  WardId: any;
  getOptionTextWard(option) {
    // debugger
    return option && option.RoomName ? option.RoomName : '';
  }
  getOptionTextStore(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getSelectedObjward(obj) {
    this.WardId = obj.RoomId;
  }

  getSearchItemList() {  
    if(this._CanteenRequestservice.MyForm.get('StoreId').value.StoreId > 0){ 
      var m_data = {
        "ItemName": `${this._CanteenRequestservice.ItemForm.get('ItemId').value}%` 
      }
      console.log(m_data); 
      this._CanteenRequestservice.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
        // console.log(this.data);
        this.filteredOptionsItem = data;
        if (this.filteredOptionsItem.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }else{
      this.toastr.warning('Please enter a Store', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
    }
    
  } 
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemName;
  } 
  getSelectedObjItem(obj) {
    console.log(obj)
      this.ItemName = obj.ItemName;
      this.ItemId = obj.ItemID; 
   
  }
  onAdd() {
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if(!iscekDuplicate){
    this.dsItemList.data = [];
    this.Chargelist.push(
      {
        ItemID: this.ItemId,
        ItemName: this.ItemName,
        Qty: this.vQty,
        Remark: this.vRemark || '' 
      });
    this.dsItemList.data = this.Chargelist
    console.log(this.dsItemList.data); 
    }else{
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this._CanteenRequestservice.ItemForm.get('ItemId').reset('');
    this._CanteenRequestservice.ItemForm.get('Qty').reset('');
    this._CanteenRequestservice.ItemForm.get('Remark').reset('');
    this.itemid.nativeElement.focus();
    this.add = false;
    //console.log(this.dsPrePresList.data)
  }

  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
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

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  } 
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('remark') remark: ElementRef; 
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement; 
  add: boolean = false;
  onEnterItem(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus(); 
    }
  }

  public onEnterqty(event): void { 
    if (event.which === 13) {
      this.remark.nativeElement.focus(); 
    }
  }

  public onEnterremark(event): void { 
    if (event.which === 13) {
      this.add = true; 
    } 
  }
  savebtn:boolean=false;
  OnSave(){
    if (( this.RegNo== '' || this.RegNo == null || this.RegNo == undefined)) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vStoredId == '' || this.vStoredId == null || this.vStoredId == undefined)) {
    this.toastr.warning('Please select Store', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if(!this.StoreList.some(item => item.StoreName ===this._CanteenRequestservice.MyForm.get('StoreId').value.StoreName)){
    this.toastr.warning('Please Select valid Store Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
    if ((this._CanteenRequestservice.MyForm.get('WardName').value == '' || 
      this._CanteenRequestservice.MyForm.get('WardName').value == null || 
      this._CanteenRequestservice.MyForm.get('WardName').value == undefined)) {
      this.toastr.warning('Please select WardName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.WardList.some(item => item.RoomName ===this._CanteenRequestservice.MyForm.get('WardName').value.RoomName)){
      this.toastr.warning('Please Select valid Ward Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    Swal.fire('Need Save Api');
  }
  onClose(){
    this._matDialog.closeAll();
    this._CanteenRequestservice.ItemForm.reset();
    this._CanteenRequestservice.MyForm.reset();
    this.dsCanteenDateList.data = [];
    this.dsItemList.data =[];
    this.Chargelist.data = [];
    this._CanteenRequestservice.MyForm.get('Op_ip_id').setValue('1')
  }
}
export class CanteenItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  Qty: number;
  Remark: any;
  /**
  * Constructor
  *
  * @param CanteenItemList
  */
  constructor(CanteenItemList) {
    {
      this.ItemId = CanteenItemList.ItemId || 0;
      this.ItemID = CanteenItemList.ItemID || 0;
      this.ItemName = CanteenItemList.ItemName || "";
      this.Qty = CanteenItemList.Quantity || 0;
      this.Remark = CanteenItemList.Remark || '';
    }
  }
}
