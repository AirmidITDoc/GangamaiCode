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
import { element } from 'protractor';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { CanteenList } from '../canteen-request.component';

@Component({
  selector: 'app-new-canteen-request',
  templateUrl: './new-canteen-request.component.html',
  styleUrls: ['./new-canteen-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCanteenRequestComponent implements OnInit {

  data: any;
  autocompleteModegroupName: string = "Service";
  autocompleteModestoreName: string = "Store";
  autocompleteModewardName: string = "Room";
  dsItemList = new MatTableDataSource<CanteenItemList>();
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  
  vOPIPId: any = 0;
  vOPDNo: any;
  vTariffId: any = 0;
  vClassId: any = 0;
  filteredOptions: any;
  PatientListfilteredOptions: any;
  noOptionFound: any;
  PatientName: any;
  vAdmissionID: any = 0;
  RegNo: any;
  Doctorname: any;
  Tarrifname: any;
  CompanyName: any;
  WardName: any;
  BedNo: any;
  registerObj: any;
  isRegIdSelected: boolean = false;
  
  PresItemlist: any = [];
  dataArray: any = [];
  filteredOptionsItem: any;
  ItemId: any;
  ItemName: any;
  vQty: any;
  vRemark: any
  Chargelist: any = [];
  vStoredId: any;
  vOpDId: any;

  
  PatientType: any;
  RefDocName: any;
  DepartmentName: any;
  Ageyear: any;
  AgeMonth: any;
  AgeDay: any;
  AdmissionDate: any;
  GenderName: any;

  price=0
  isBatchRequired:boolean=false;
  constructor(
    public _CanteenRequestservice: CanteenRequestService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
   
  }

  getValidationMessages() {
    return {
      StoreId: [],
      WardName: [],
      ItemId: [],
      Qty: [],
      Remark: [],

    }
  }
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
  getSelectedObj(obj) {
    console.log(obj)
    if (obj.IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.PatientName = ''
      this.vAdmissionID = ''
      this.RegNo = ''
      this.Doctorname = ''
      this.Tarrifname = ''
      this.CompanyName = ''
      this.vOPDNo = ''
      this.WardName = ''
      this.BedNo = ''
    }
    else {
      this.registerObj = obj;
      console.log(obj)
      // this.PatientName = obj.FirstName + '' + obj.LastName;
      this.PatientName = obj.formattedText;
      // obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
      this.RegNo = obj.regNo;
      this.vAdmissionID = obj.admissionID;
      this.CompanyName = obj.companyName;
      this.Tarrifname = obj.tariffName;
      this.Doctorname = obj.doctorName;
      this.vOpDId = obj.admissionID;
      this.vOPDNo = obj.ipdNo;
      this.WardName = obj.roomName;
      this.BedNo = obj.bedName;
      this.PatientType = obj.PatientType
      this.RefDocName = obj.RefDocName
      this.DepartmentName = obj.DepartmentName
      this.Ageyear = obj.age
      this.AgeMonth = obj.AgeMonth
      this.AgeDay = obj.AgeDay
      this.GenderName = obj.genderName
      this.AdmissionDate = obj.admissionTime
      console.log(obj);
    }
  }


  onAdd() {
    // if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
    //   this.toastr.warning('Please enter a qty', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.ItemId)
    if (!iscekDuplicate) {
debugger
      this.dsItemList.data = [];
      this.Chargelist.push(
        {
          ItemID: this.ItemId,
          ItemName: this.ItemName,
          Qty:this._CanteenRequestservice.ItemForm.get('Qty').value,
          Price:this.price || 0,
          totalamt:parseInt(this._CanteenRequestservice.ItemForm.get('Qty').value) * this.price,
          Remark:this._CanteenRequestservice.ItemForm.get('Remark').value || ''
        });
        console.log(this.Chargelist);
      this.dsItemList.data = this.Chargelist
      console.log(this.dsItemList.data);
    } else {
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


  getSelectedserviceObj(obj) {

    console.log(obj)
    this.ItemId = obj.itemID
    this.ItemName = obj.itemName
    this.price = obj.price
    this.isBatchRequired = obj.isBatchRequired
    this.add = true;
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
  savebtn: boolean = false;
  OnSave() {
    
    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    
    let canteenRequestDetailsInsert = [];

    this.dsItemList.data.forEach(element => {
      let CanteenReqDetObj = {};
      CanteenReqDetObj['reqDetId'] = 0
      CanteenReqDetObj['reqId'] = 0
      CanteenReqDetObj['itemId'] = element.ItemID || 0;
      CanteenReqDetObj['unitMRP'] = element.Price || 0,
      CanteenReqDetObj['qty'] = element.Qty || 0;
      CanteenReqDetObj['totalAmount'] = element.totalamt;
      CanteenReqDetObj['isBillGenerated'] = true;
      CanteenReqDetObj['isCancelled'] = false;
      canteenRequestDetailsInsert.push(CanteenReqDetObj);
    });

    let SubmitDataObj = {
      "reqId": 0,
      "date":this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      "time": this.datePipe.transform(new Date(), 'hh:mm:ss a'),
      "reqNo": "string",
      "opIpId": this.vOpDId || 0,
      "opIpType": 1,
      "wardId":this._CanteenRequestservice.MyForm.get('WardName').value || 0,
      "cashCounterId": 0,
      "isFree": true,
      "unitId": 1,
      "isBillGenerated": true,
      "isPrint": true,
      'tCanteenRequestDetails': canteenRequestDetailsInsert
    }
    console.log(SubmitDataObj);
    this._CanteenRequestservice.CanteenReqSave(SubmitDataObj).subscribe(response => {
      this.toastr.success(response.message);
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);
    });

 
  }

  dsCanteenDateList = new MatTableDataSource<CanteenList>();

  onClose() {
    this._matDialog.closeAll();
    this._CanteenRequestservice.ItemForm.reset();
    this._CanteenRequestservice.MyForm.reset();
    this.dsCanteenDateList.data = [];
    this.dsItemList.data = [];
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
  Price:any;
  totalamt:any;
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
      this.Price = CanteenItemList.price || 0;
      this.Remark = CanteenItemList.Remark || '';
      this.totalamt = CanteenItemList.totalamt || '';
    }
  }
}
