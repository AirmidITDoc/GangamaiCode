import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { OpeningBalanceService } from './opening-balance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { NewOpeningBalanceComponent } from './new-opening-balance/new-opening-balance.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class OpeningBalanceComponent {
  displayedColumns:string[] = [
    'No',
    'Date',
    'StoreName',
    'AddedByName' ,
    'action'
  ];
  displayedColumns1:string[] = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'Qty',
    'PurRate',
    'MRP',
    'GSTPer'
  ]; 

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[]; 
  dateTimeObj: any;

  dsOpeningBalnceList=new MatTableDataSource<OpeningBalanceList>();
  dsOpeningBalItemDetList=new MatTableDataSource<OpeningBalanceItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;
  
  constructor(
    public _OpeningBalanceService:OpeningBalanceService,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService, 
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
  )
   {}

  ngOnInit(): void {
    this.gePharStoreList();
    this.getOpeningBalList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._OpeningBalanceService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._OpeningBalanceService.UseFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getOpeningBalList(){ 
    var vdata={
      'StoreId':this._loggedService.currentUserValue.user.storeId,
      'From_Dt':this.datePipe.transform(this._OpeningBalanceService.UseFormGroup.get('startdate').value ,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'To_Dt':this.datePipe.transform(this._OpeningBalanceService.UseFormGroup.get('enddate').value ,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    this._OpeningBalanceService.getOpeningBalList(vdata).subscribe(data =>{
      this.dsOpeningBalnceList.data = data as OpeningBalanceList[];
      console.log(this.dsOpeningBalnceList.data)
      this.dsOpeningBalnceList.sort =this.sort;
      this.dsOpeningBalnceList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getOpeningBalItemDetList(Param){ 
    var vdata={
      'OpeningHId':Param.OpeningHId
     }
     console.log(vdata)
    this._OpeningBalanceService.getOpeningBalItemDetList(vdata).subscribe(data =>{
      this.dsOpeningBalItemDetList.data = data as OpeningBalanceItemList[];
      console.log(this.dsOpeningBalItemDetList.data)
      this.dsOpeningBalItemDetList.sort =this.sort;
      this.dsOpeningBalItemDetList.paginator = this.SecondPaginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  NewOpeningBal() {
    const dialogRef = this._matDialog.open(NewOpeningBalanceComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '95%' 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getOpeningBalList();
    });
    //this.getGRNLit();
  }
}
export class OpeningBalanceList{
  No:number;
  Date:number;
  StoreName:any;
  AddedByName:any;

  constructor(OpeningBalanceList){
    {
      this.No=OpeningBalanceList.No || 0;
      this.Date=OpeningBalanceList.Date || 0;
      this.StoreName=OpeningBalanceList.StoreName || "";
      this.AddedByName=OpeningBalanceList.AddedByName || "";
    }
  }
}
export class OpeningBalanceItemList{
  ItemName:string;
  BatchNo:number;
  ExpDate:number;
  Qty:any;
  PurRate:any;
  MRP:any;
  GSTPer:any;

  constructor(OpeningBalanceItemList){
    {
      this.BatchNo=OpeningBalanceItemList.BatchNo || 0;
      this.ExpDate=OpeningBalanceItemList.ExpDate || 0;
      this.Qty=OpeningBalanceItemList.Qty || 0;
      this.ItemName=OpeningBalanceItemList.ItemName || "";
      this.PurRate=OpeningBalanceItemList.PurRate || 0;
      this.MRP=OpeningBalanceItemList.MRP || 0;
      this.GSTPer=OpeningBalanceItemList.GSTPer || 0;
    }
  }
}
 