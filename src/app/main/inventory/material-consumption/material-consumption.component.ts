import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MaterialConsumptionService } from './material-consumption.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { NewMaterialConsumptionComponent } from './new-material-consumption/new-material-consumption.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-material-consumption',
  templateUrl: './material-consumption.component.html',
  styleUrls: ['./material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MaterialConsumptionComponent implements OnInit {
  displayedColumns = [
    'ConsumptionNo',
    'ConsumptionDate',
    'ConsumptionTime',
    'MaterialConsumptionId',
    'LandedTotalAmount',
    'Remark',
    'AddedBy',
    'action',
  ];
  displayedNewMaterialList = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UsedQty',
    'Rate',
    'TotalAmount',
    'Remark',
    'StkId'
  ];

  SpinLoading: boolean = false;
  StoreList: any = [];
  screenFromString = 'admission-form';
  sIsLoading: string = '';
  isLoading = true;
  showAutocomplete = false;
  ItemName:any;
  isItemIdSelected:boolean = false;
  ItemId: any;
  dateTimeObj: any;

  
  dsMaterialConLList = new MatTableDataSource<MaterialConList>();
  dsNewMaterialConList = new MatTableDataSource<NewMaterialList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _MaterialConsumptionService: MaterialConsumptionService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
   this. gePharStoreList();
   this.getMaterialConList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getMaterialConList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ToStoreId":this._loggedService.currentUserValue.user.storeId || 0,
       "From_Dt":this.datePipe.transform(this._MaterialConsumptionService.SearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt":this.datePipe.transform(this._MaterialConsumptionService.SearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    console.log(vdata);
      this._MaterialConsumptionService.getMaterialConList(vdata).subscribe(data => {
      this.dsMaterialConLList.data = data as MaterialConList[];
      this.dsMaterialConLList.sort = this.sort;
      this.dsMaterialConLList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsMaterialConLList.data)
    },
    error => {
      this.sIsLoading = '';
    });
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._MaterialConsumptionService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._MaterialConsumptionService.SearchGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  NewMatrialCon(){
    const dialogRef = this._matDialog.open(NewMaterialConsumptionComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getMaterialConList();
    });
  }

     
  viewgetMaterialconsumptionReportPdf(contact) {
    
    console.log(contact)
    this.sIsLoading == 'loading-data'
  
    setTimeout(() => {
    this.SpinLoading =true;
    let MaterialConsumptionId= contact.MaterialConsumptionId
  this._MaterialConsumptionService.getMaterialconsumptionview(MaterialConsumptionId).subscribe(res => {
     
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Material Consumption Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }
}

export class NewMaterialList {
  ItemName: string;
  BatchNo: number;
  ExpDate:number;
  BalQty:number;
  UsedQty:any;
  Rate:any;
  TotalAmount:any;
  Remark:any;
  StkId:any;
 
  constructor(NewMaterialList) {
    {
      this.ItemName = NewMaterialList.ItemName || "";
      this.BatchNo = NewMaterialList.BatchNo || 0;
      this.ExpDate = NewMaterialList.ExpDate || 0;
      this.BalQty = NewMaterialList.BalQty|| 0;
      this.UsedQty = NewMaterialList.UsedQty || 0;
      this.Rate =NewMaterialList.Rate || 0;
      this.TotalAmount = NewMaterialList.TotalAmount|| 0;
      this.Remark = NewMaterialList.Remark || ' ';
      this.StkId =NewMaterialList.StkId || 0;
    }
  }
}
export class MaterialConList {
  ConsumptionNo:any;
  Date: Number;
  FromStoreName:string;
  PurchaseTotalAmount: number;
  TotalVatAmount:any;
  Addedby:number;
  Remark:any;
  
  constructor(MaterialConList) {
    {
      this.ConsumptionNo = MaterialConList.ConsumptionNo || 0;
      this.Date = MaterialConList.Date || 0;
      this.PurchaseTotalAmount = MaterialConList.PurchaseTotalAmount || 0;
      this.FromStoreName = MaterialConList.FromStoreName || "";
      this.TotalVatAmount = MaterialConList.TotalVatAmount || 0;
      this.Addedby = MaterialConList.Addedby || 0;
      this.Remark = MaterialConList.Remark || "";
 
    }
  }
}

