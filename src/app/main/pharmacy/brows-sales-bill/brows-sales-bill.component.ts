import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BrowsSalesBillService } from './brows-sales-bill.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
 
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-brows-sales-bill',
  templateUrl: './brows-sales-bill.component.html',
  styleUrls: ['./brows-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class BrowsSalesBillComponent implements OnInit { 
  displayedColumns: string[] = [
    'action',
    'Date',
    'SalesNo',
    'RegNo',
    'PatientName',
    'NetAmt',
    'BalAmt',
    'PaidAmt',
    'PaidType',
    'IPNo'
  ]
  displayedColumns2: string[] = [
    'ItemName',
    'BatchNo',
    'Expdate',
    'Qty',
    'MRP',
    'TotalMRP',
    'GST',
    'CGST',
    'SGST',
    'IGST'
  ]
  displayedColumns3: string[] = [
    'action',
    'SalesDate',
    'SalesNo',
    'RegNo',
    'PatientName',
    'NetAmt',
    'BalAmt',
    'PaidAmt',
    'Type'
  ]
  displayedColumns4: string[] = [
    'ItemName',
    'BatchNo',
    'Expdate',
    'Qty',
    'MRP',
    'TotalMRP',
    'GST',
    'CGST',
    'SGST',
    'IGST'
  ]
  StoreList:any = [];
  Store1List:any = [];
  hasSelectedContacts: boolean;
   
   

  
  
  dssaleList1 = new MatTableDataSource<SaleList>();
  dssalesList2 = new MatTableDataSource<SalesDetList>();

  dssalesReturnList = new MatTableDataSource<SalesReturnList>();
  dssalesReturnList1 = new MatTableDataSource<SalesReturnDetList>();

  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _BrowsSalesBillService:BrowsSalesBillService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
     
    
  ) { }

  ngOnInit(): void {
    //this.getSalesList();
    this.getSalesReturnList()
    this.gePharStoreList();
    this.gePharStoreList1();
    
  }
  gePharStoreList() {
    var vdata={
      Id : this._loggedService.currentUserValue.user.storeId
    }
    this._BrowsSalesBillService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._BrowsSalesBillService.userForm.get('StoreId').setValue(this.StoreList[0]);
      
    });
  }
  gePharStoreList1() {
    var vdata={
      Id : this._loggedService.currentUserValue.user.storeId
    }
    this._BrowsSalesBillService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._BrowsSalesBillService.formReturn.get('StoreId').setValue(this.Store1List[0]);
      
    });
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getSalesList(){

    var vdata={
      F_Name:this._BrowsSalesBillService.userForm.get('F_Name').value || '%' ,                                            
      L_Name: this._BrowsSalesBillService.userForm.get('L_Name').value || '%'  ,                                     
      From_Dt: this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                      
      To_Dt :  this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                 
      Reg_No :this._BrowsSalesBillService.userForm.get('RegNo').value || 0  ,                  
      SalesNo :this._BrowsSalesBillService.userForm.get('SalesNo').value || 0  , 
      OP_IP_Type:this._BrowsSalesBillService.userForm.get('OP_IP_Type').value, 
      StoreId :this._BrowsSalesBillService.userForm.get('StoreId').value.storeid || 0  ,
       IPNo :this._BrowsSalesBillService.userForm.get('IPNo').value || 0
      
    }
   console.log(vdata);

    this._BrowsSalesBillService.getSalesList(vdata).subscribe(data=>{
      this.dssaleList1.data= data as SaleList[];
      this.dssaleList1.sort = this.sort;
      this.dssaleList1.paginator = this.paginator;
      console.log(this.dssaleList1.data);
    })

  }

  getSalesDetList(Parama){
    var vdata={
      SalesID: Parama.SalesId,                  
      OP_IP_Type:Parama.OP_IP_Type
    }
    this._BrowsSalesBillService.getSalesDetList(vdata).subscribe(data=>{
      this.dssalesList2.data = data as SalesDetList[];
      this.dssalesList2.sort = this.sort;
      this.dssalesList2.paginator = this.paginator;
      console.log( this.dssalesList2.data);
    })
  }

  onSelect(Parama){
    //console.log(Parama);
   this.getSalesDetList(Parama)
 }

  getSalesReturnList(){
    var vdata={
      F_Name : this._BrowsSalesBillService.formReturn.get('F_Name').value || '%'  ,                            
      L_Name : this._BrowsSalesBillService.formReturn.get('L_Name').value || '%'  ,                            
      From_Dt :this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('startdate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                      
      To_Dt :  this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('enddate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                 
      Reg_No :this._BrowsSalesBillService.formReturn.get('RegNo').value || 0  ,                                                                           
      SalesNo :  this._BrowsSalesBillService.formReturn.get('SalesNo').value || 0  ,
      OP_IP_Type : this._BrowsSalesBillService.formReturn.get('OP_IP_Types').value || 0  ,
      StoreId   :this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,
    }
    
    console.log(vdata);
    this._BrowsSalesBillService.getSalesReturnList(vdata).subscribe(data =>{
      this.dssalesReturnList.data = data as SalesReturnList[];
      this.dssalesReturnList.sort = this.sort;
      this.dssalesReturnList.paginator = this.paginator;
       console.log(this.dssalesReturnList.data);
    })
  }
  getSalesReturnDetList(Parama)
  { var vdata={
    SalesReturnId:Parama.SalesReturnId
  
  }
 
  this._BrowsSalesBillService.getSalesReturnDetList(vdata).subscribe(data =>{
    this.dssalesReturnList1.data = data as SalesReturnDetList[];
    this.dssalesReturnList1.sort = this.sort;
    this.dssalesReturnList1.paginator = this.paginator;
    console.log(this.dssalesReturnList1.data);
  })
  }
  onSelect1(Parama){
    console.log(Parama);
   this.getSalesReturnDetList(Parama)
 }
}

export class SaleList {
  Date:number;
  SalesNo:number;
  RegNo:number;
  PatientName:string;
  BalAmt:number;
  PaidAmt:number;
  PaidType:number;
  IPNo:any;

   
  constructor(SaleList) {
    {
      this.Date = SaleList.Date || 0;
      this.SalesNo = SaleList.SalesNo || 0;
      this.RegNo = SaleList.RegNo || 0;
      this.PatientName = SaleList.PatientName|| '';
      this.BalAmt = SaleList.BalAmt || 0;
      this.PaidAmt =SaleList.PaidAmt || 0;
      this.PaidType =SaleList.PaidType || 0;
       this.IPNo =SaleList.IPNo || 0;
    }
  }
} 

export class SalesDetList{
   
  ItemName:string;
  BatchNo:number;
  Expdate:number;
  Qty:string;
  MRP:number;
  TotalMRP:number;
  GST:number;
  CGST:any;
  SGST:any;
  IGST: any;

  constructor(SalesDetList) {
    {
      this.ItemName = SalesDetList.ItemName || '';
      this.BatchNo = SalesDetList.BatchNo || 0;
      this.Expdate = SalesDetList.Expdate || 0;
      this.Qty = SalesDetList.Qty|| 0;
      this.MRP = SalesDetList.MRP || 0;
      this.TotalMRP =SalesDetList.TotalMRP || 0;
      this.GST =SalesDetList.GST || 0;
      this.CGST =SalesDetList.CGST || 0;
      this.SGST =SalesDetList.SGST || 0;
      this.IGST =SalesDetList.IGST || 0;
    }
  }
}

export class SalesReturnList{
  SalesDate:number;
  SalesNo:number;
  RegNo:number;
  PatientName:string;
  BalAmt:number;
  PaidAmt:number;
  Type:number;
 

   
  constructor(SalesReturnList) {
    {
      this.SalesDate = SalesReturnList.SalesDate || 0;
      this.SalesNo = SalesReturnList.SalesNo || 0;
      this.RegNo = SalesReturnList.RegNo || 0;
      this.PatientName = SalesReturnList.PatientName|| '';
      this.BalAmt = SalesReturnList.BalAmt || 0;
      this.PaidAmt =SalesReturnList.PaidAmt || 0;
      this.Type =SalesReturnList.Type || 0;
      
    }
  }

}
export class SalesReturnDetList{

  ItemName:string;
  BatchNo:number;
  Expdate:number;
  Qty:string;
  MRP:number;
  TotalMRP:number;
  GSTAmount:number;
  CGST:any;
  SGST:any;
  IGST: any;

  constructor(SalesReturnDetList) {
    {
      this.ItemName = SalesReturnDetList.ItemName || '';
      this.BatchNo = SalesReturnDetList.BatchNo || 0;
      this.Expdate = SalesReturnDetList.Expdate || 0;
      this.Qty = SalesReturnDetList.Qty|| 0;
      this.MRP = SalesReturnDetList.MRP || 0;
      this.TotalMRP =SalesReturnDetList.TotalMRP || 0;
      this.GSTAmount =SalesReturnDetList.GSTAmount || 0;
      this.CGST =SalesReturnDetList.CGST || 0;
      this.SGST =SalesReturnDetList.SGST || 0;
      this.IGST =SalesReturnDetList.IGST || 0;
    }
  }

}
