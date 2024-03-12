import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PatientMaterialConsumptionService } from './patient-material-consumption.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-patient-material-consumption',
  templateUrl: './patient-material-consumption.component.html',
  styleUrls: ['./patient-material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PatientMaterialConsumptionComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';

  labelPosition: 'before' | 'after' = 'after';
  
  dsIndentID = new MatTableDataSource<IndentID>();

  dsIndentList = new MatTableDataSource<IndentList>();
  SpinLoading:boolean=false;
  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'Qty',
   'IssQty',
   'Bal',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IndentID: PatientMaterialConsumptionService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIndentID() 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  newCreateUser(): void {
    // const dialogRef = this._matDialog.open(RoleTemplateMasterComponent,
    //   {
    //     maxWidth: "95vw",
    //     height: '50%',
    //     width: '100%',
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   //  this.getPhoneAppointList();
    // });
  }

  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._IndentID.IndentSearchGroup.get('ToStoreId').value.StoreId || 1,
       "FromDate": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "ToDate": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      //  "Status": 1//this._IndentID.IndentSearchGroup.get("Status").value || 1,
    }
      this._IndentID.getMaterialConsumptiondatewise(Param).subscribe(data => {
      this.dsIndentID.data = data as IndentID[];
      console.log(this.dsIndentID.data)
      this.dsIndentID.sort = this.sort;
      this.dsIndentID.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getIndentList(Params){
    // this.sIsLoading = 'loading-data';
    var Param = {
      "IndentId": Params.IndentId
    }
      this._IndentID.getIndentList(Param).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
      this.dsIndentList.sort = this.sort;
      this.dsIndentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  
onclickrow(contact){
Swal.fire("Row selected :" + contact)
}
  getIndentStoreList(){
    debugger
   
        this._IndentID.getStoreFromList().subscribe(data => {
          this.Store1List = data;
          // this._IndentID.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
        });

       }



       
  viewgetMaterialConsumptionReportPdf(contact) {
    this.sIsLoading == 'loading-data'
  
    setTimeout(() => {
    this.SpinLoading =true;
    //  this.AdList=true;
    this._IndentID.getMaterialConsumptionview(contact.MaterialConsumptionId).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Issue to Dept Reprt Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }


   
  exportIssuetodeptReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['IssueNo', 'IssueDate', 'FromStoreName', 'ToStoreName', 'TotalAmount','TotalVatAmount','NetAmount','Remark','Receivedby'];
    this.reportDownloadService.getExportJsonData(this.dsIndentID.data, exportHeaders, 'Issue To Department');
    this.dsIndentID.data=[];
    this.sIsLoading = '';
  }

  onClear(){
    
  }
}

export class IndentList {
  ItemId:any;
  ItemName: string;
  Qty: number;
  IssQty:number;
  Bal:number;
  StoreId:any;
  StoreName:any;
  BatchExpDate:any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal|| 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName =IndentList.StoreName || '';
      this.BatchExpDate =IndentList.BatchExpDate || '';
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName:string;
  ToStoreName:string;
  Addedby:number;
  IsInchargeVerify: string;
  IndentId:any;
  FromStoreId:boolean;
  
  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

