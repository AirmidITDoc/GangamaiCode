import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PatientMaterialConsumptionReturnService } from './patient-material-consumption-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-material-consumption-return',
  templateUrl: './patient-material-consumption-return.component.html',
  styleUrls: ['./patient-material-consumption-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PatientMaterialConsumptionReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';

  labelPosition: 'before' | 'after' = 'after';
  
  dsIndentID = new MatTableDataSource<IndentID>();

  dsIndentList = new MatTableDataSource<IndentList>();

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
    public _IndentID: PatientMaterialConsumptionReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
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
       "From_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "Status": 1//this._IndentID.IndentSearchGroup.get("Status").value || 1,
    }
      this._IndentID.getIndentID(Param).subscribe(data => {
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

  onClear(){
    
  }
}

export class IndentList {
  ItemName: string;
  Qty: number;
  IssQty:number;
  Bal:number;
  StoreId:any;
  StoreName:any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal|| 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName =IndentList.StoreName || '';
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

