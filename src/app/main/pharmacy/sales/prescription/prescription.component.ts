import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SalesService } from '../sales.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PrescriptionComponent implements OnInit {
  displayedColumns = [
    'RegNo',
    'PatientName',
    'DoctorName',
    'Date',
    'Type',
    'Time',
    'CompanyName',
    'No',
    'WardName',
    'Action'
  ];
  displayedColumns1 = [
    "ItemName",
    "Qty",
    "TotalQty",
    // "DrugType"
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsPrescriptionList = new MatTableDataSource<PriscriptionList>();
  dsItemDetList = new MatTableDataSource<ItemNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;
  
  constructor( 
    public _SalesService: SalesService, 
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,  
    private _loggedService: AuthenticationService, 
    public toastr: ToastrService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.getPrescriptionList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  } 

  getPrescriptionList(){
    var Param = {
      "StoreId": this._loggedService.currentUserValue.user.storeId, 
      "FromDate": this.datePipe.transform(this._SalesService.PrescriptionFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._SalesService.PrescriptionFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsStatus": this._SalesService.PrescriptionFrom.get("Status").value || 0,
      "Reg_No": this._SalesService.PrescriptionFrom.get('RegNo').value || 0,
      "IPPreId":0
    }
    console.log(Param)
    this._SalesService.getPrescriptionList(Param).subscribe(data => {
      this.dsPrescriptionList.data = data as PriscriptionList[];
      console.log(this.dsPrescriptionList.data)
      this.dsPrescriptionList.sort = this.sort;
      this.dsPrescriptionList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 

  getItemDetailList(contact){
    var Param = {
      "OP_IP_Id": contact.OP_IP_ID ,
      "OP_IP_Type":contact.PatientType
    }
    console.log(Param)
    this._SalesService.getItemDetailList(Param).subscribe(data => {
      this.dsItemDetList.data = data as ItemNameList[];
      console.log(this.dsItemDetList.data)
      this.dsItemDetList.sort = this.sort;
      this.dsItemDetList.paginator = this.Secondpaginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
  onClear(){
    this._SalesService.PrescriptionFrom.reset();
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
export class PriscriptionList {
 
  RegNo: any;
  PatientName: string;
  DoctorName: string;
  CompanyName: string;
  WardName: string; 
  Date: number;
  Type: any; 
  No: number;
  Time:any;

  constructor(PriscriptionList) {
    {

      this.RegNo = PriscriptionList.RegNo || 0;
      this.PatientName = PriscriptionList.PatientName || "";
      this.Time = PriscriptionList.Time || 0;
      this.No = PriscriptionList.No || 0;
      this.Date = PriscriptionList.Date || 0;
      this.DoctorName = PriscriptionList.DoctorName || "";
      this.CompanyName = PriscriptionList.CompanyName || "";
      this.WardName = PriscriptionList.WardName || "";
    }
  }
}
  export class ItemNameList {
   
    ItemName: string; 
    DrugType: string; 
    Qty: number;
    TotalQty: any;  
  
    constructor(ItemNameList) {
      {
  
        this.ItemName = ItemNameList.ItemName || "";
        this.DrugType = ItemNameList.DrugType || '';
        this.Qty = ItemNameList.Qty || 0;
        this.TotalQty = ItemNameList.TotalQty || 0; "";
      }
    }
}
