import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { RequestLabService } from './request-lab.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-lab',
  templateUrl: './request-lab.component.html',
  styleUrls: ['./request-lab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RequestLabComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;

  dsRequestLabList = new MatTableDataSource<RequestLabList>();

  dsRequestLabDetails = new MatTableDataSource<RequestLabDetails>();

  displayedColumns = [
    'RegNo',
    'PatientName',
    'Age',
    'AdmDate',
    'WardName',
    'RequestType',
    'TariffName',
    'CompanyName',
    'action',
  ];

  displayedColumns1 = [
   
      'ReqDate',
      'ReqTime',
      'ServiceName',
      'AddedByName',
      'AddBillingUser',
      'BillDateTime',
      'IsStatus',
      'PBillNO',
      'IsComplete',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _RequestLabList: RequestLabService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getRequestLabList() 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
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

  getRequestLabList() {
    this.sIsLoading = 'loading-data';
    var Param = {
       "FromDate": this.datePipe.transform(this._RequestLabList.RequestLabSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "ToDate": this.datePipe.transform(this._RequestLabList.RequestLabSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "Reg_No": this._RequestLabList.RequestLabSearchGroup.get("RegNoSearch").value || 0
    }
      this._RequestLabList.getRequestLabList(Param).subscribe(data => {
      this.dsRequestLabList.data = data as RequestLabList[];
      this.dsRequestLabList.sort = this.sort;
      this.dsRequestLabList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getRequestLabDetails(Params){
    this.sIsLoading = 'loading-data';
    var Param = {
       "IPMedID": Params.IPMedID
    }
      this._RequestLabList.getRequestLabDetails(Param).subscribe(data => {
      this.dsRequestLabDetails.data = data as RequestLabDetails[];
      this.dsRequestLabDetails.sort = this.sort;
      this.dsRequestLabDetails.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }



  onClear(){
    
  }
}

export class RequestLabDetails {
  
  ReqDate:number;
  ReqTime:number;
  ServiceName:string;
  AddedByName:string;
  AddBillingUser:string;
  BillDateTime:number;
  IsStatus:string;
  PBillNO:number;
  IsComplete:string;

  /**
   * Constructor
   *
   * @param RequestLabDetails
   */
  constructor(RequestLabDetails) {
    {
      this.ReqDate = RequestLabDetails.ReqDate || 0;
      this.ReqTime = RequestLabDetails.ReqTime || 0;
      this.ServiceName = RequestLabDetails.ServiceName || "";
      this.AddedByName = RequestLabDetails.AddedByName || "";
      this.AddBillingUser = RequestLabDetails.AddBillingUser || "";
      this.BillDateTime = RequestLabDetails.BillDateTime || 0;
      this.IsStatus = RequestLabDetails.IsStatus || "";
      this.PBillNO = RequestLabDetails.PBillNO || 0;
      this.IsComplete = RequestLabDetails.IsComplete || "";
    }
  }
}

export class RequestLabList {
  RegNo: Number;
  PatientName: string;
  Age:number;
  AdmDate:number;
  WardName:string;
  RequestType:string;
  TariffName:string;
  CompanyName:string;
  IsActive: boolean;
 
  /**
   * Constructor
   *
   * @param RequestLabList
   */
  constructor(RequestLabList) {
    {
      this.RegNo = RequestLabList.RegNo || 0;
      this.PatientName = RequestLabList.PatientName || "";
      this.Age = RequestLabList.Age || 0;
      this.AdmDate = RequestLabList.AdmDate || 0;
      this.WardName = RequestLabList.WardName || "";
      this.RequestType = RequestLabList.RequestType || "";
      this.TariffName = RequestLabList.TariffName || "";
      this.CompanyName = RequestLabList.CompanyName || "";
      this.IsActive = RequestLabList.IsActive || "";
    }
  }
}