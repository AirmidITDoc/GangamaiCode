import { Component, ViewEncapsulation } from '@angular/core';
import { OpeningBalanceService } from './opening-balance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

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
    'AddedByName' 
  ];
  displayedColumns1:string[] = [
    'action',
    'ItemName',
    'BatchNo',
    'ExpDate',
    'Qty',
    'PurRate',
    'MRP',
    'GSTPer' 
  ];
  displayedColumnsNew :string[] = [
    'action',
    'Code',
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UnitRate',
    'UnitMRP',
    'GST' 
  ];

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[];
  screenFromString = 'admission-form';

  dsOpeningBalnce=new MatTableDataSource<OpeningBalanceList>();
  dsOpeningBalnce1=new MatTableDataSource<OpeningBalanceList1>();

  dsOpeningBalNewList=new MatTableDataSource<NewOprningBal>();
  
  constructor(
    public _OpeningBalanceService:OpeningBalanceService,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService,
  )
   {}

  ngOnInit(): void {
    this.gePharStoreList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
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
      this._OpeningBalanceService.NewUseForm.get('StoreID').setValue(this.StoreList[0]);
    });
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
export class OpeningBalanceList1{
  ItemName:string;
  BatchNo:number;
  ExpDate:number;
  Qty:any;
  PurRate:any;
  MRP:any;
  GSTPer:any;

  constructor(OpeningBalanceList1){
    {
      this.BatchNo=OpeningBalanceList1.BatchNo || 0;
      this.ExpDate=OpeningBalanceList1.ExpDate || 0;
      this.Qty=OpeningBalanceList1.Qty || 0;
      this.ItemName=OpeningBalanceList1.ItemName || "";
      this.PurRate=OpeningBalanceList1.PurRate || 0;
      this.MRP=OpeningBalanceList1.MRP || 0;
      this.GSTPer=OpeningBalanceList1.GSTPer || 0;
    }
  }
}

export class NewOprningBal{
  ItemName:string;
  Code:number;
  ExpDate:number;
  BatchNo:any;
  BalQty:any;
  UnitRate:any;
  UnitMRP:any;
  PurRate:any;
  GST:any;

  constructor(NewOprningBal){
    {
      this.Code=NewOprningBal.Code || 0;
      this.ExpDate=NewOprningBal.ExpDate || 0;
      this.BatchNo=NewOprningBal.BatchNo || 0;
      this.ItemName=NewOprningBal.ItemName || "";
      this.BalQty=NewOprningBal.BalQty || 0;
      this.UnitRate=NewOprningBal.UnitRate || 0;
      this.UnitMRP=NewOprningBal.UnitMRP || 0;
      this.GST=NewOprningBal.GST || 0;
      this.PurRate=NewOprningBal.PurRate || 0;
     
    }
  }
}