import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SalesService } from '../sales.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    public _dialogRef: MatDialogRef<PrescriptionComponent>,
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
PatienName:any;
WardId:any;
BedNo:any;
RegNo:any;
AddmissionId:any;
RegId:any;
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
  IPMedID:any;
  DoctorName:any;
  IPDNo:any;
  getItemDetailList(contact){
    console.log(contact)
    this.IPMedID = contact.IPMedID;
    this.PatienName = contact.PatientName;
    this.BedNo =  contact.bedId;
    this.WardId = contact.WardId;
    this.AddmissionId = contact.OP_IP_ID;
    this.RegNo =  contact.RegNo;
    this.RegId = contact.RegId;
    this.IPMedID = contact.IPMedID;
    this.DoctorName = contact.DoctorName;
    this.IPDNo = contact.IPDNo;
    var Param = {
      "OP_IP_Id": contact.IPMedID ,
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
 
  chargelist:any=[];
  Patientlist:any=[];

  GetPrescrpList() { 
    if(this.dsItemDetList.data.length > 0){
    let strSql = "Select ItemId,QtyPerDay,BalQty,IsBatchRequired,ItemName from GeT_IP_PrescriptionItemDet where IPMedID=" + this.IPMedID + " Order by ItemName "
    this._SalesService.getchargesList(strSql).subscribe(data => {
      this.chargelist = data as any;
   
    });  
    this.chargelist.forEach((element) => { 
      this.Patientlist.push(
        {
          ItemId :element.ItemId,
          QtyPerDay :element.QtyPerDay,
          BalQty :element.BalQty,
          IsBatchRequired :element.IsBatchRequired,
          PatientName :this.PatienName,
          RegNo :this.RegNo,
          WardId :this.WardId,
          BedId :  this.BedNo,
          AdmissionID :this.AddmissionId,
          RegId :this.RegId,
          IPMedID:this.IPMedID,
          DoctorName: this.DoctorName,
          IPDNo : this.IPDNo
        });
    console.log(this.Patientlist);
    this._dialogRef.close(this.Patientlist);
    }); 
  }
  else{
    this.toastr.error('Product not in list Please select Product!', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    }); 
  }
  
   
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
  OP_IP_ID:any;
  bedId: number;
  WardId:any; 

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
