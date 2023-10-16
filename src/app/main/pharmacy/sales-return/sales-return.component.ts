import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesReturnService } from './sales-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class SalesReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';
  ItemSubform: FormGroup;
  labelPosition: 'before' | 'after' = 'after';
  isPatienttypeDisabled: boolean = true;
DoctorName:any;
  
  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  
  dsIndentID = new MatTableDataSource<IndentID>();

  dsIndentList = new MatTableDataSource<IndentList>();

  displayedColumns = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'GSTAmount',
    'TotalMRP',
    'DiscAmt',
    'NetAmt',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'GSTAmount',
    'TotalMRP',
    'DiscAmt',
    'NetAmt',
  ];

  displayedColumns2 = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _SalesReturnService: SalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIndentID() 
    this.getItemSubform();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['External'],
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: 0,
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer: '',
      FinalDiscAmt: '',
      FinalTotalAmt: '',
      FinalNetAmount: '',
      FinalGSTAmt: '',
      BalanceAmt: '',
      CashPay: ['CashPay'],
      // Credit: [0]
    });
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

  getOptionText(option) {
    this.ItemId = option.ItemId;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObj(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;

    if (this.BalanceQty > 0) {
      this.getBatch();
    }
  }

  getBatch() {
    // this.Quantity.nativeElement.focus();
    // const dialogRef = this._matDialog.open(SalePopupComponent,
    //   {
    //     maxWidth: "800px",
    //     minWidth: '800px',
    //     width: '800px',
    //     height: '380px',
    //     disableClose: true,
    //     data: {
    //       "ItemId": this._salesService.IndentSearchGroup.get('ItemId').value.ItemId,
    //       "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid
    //     }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    //   this.BatchNo = result.BatchNo;
    //   this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
    //   this.MRP = result.UnitMRP;
    //   this.Qty = 1;
    //   this.Bal = result.BalanceAmt;
    //   this.GSTPer = result.VatPercentage;

    //   this.TotalMRP = this.Qty * this.MRP;
    //   this.DiscAmt = 0;
    //   this.NetAmt = this.TotalMRP;
    //   this.BalanceQty = this.BalanceQty;
    //   this.ItemObj = result;

    //   this.VatPer = result.VatPercentage;
    //   this.CgstPer = result.CGSTPer;
    //   this.SgstPer = result.SGSTPer;
    //   this.IgstPer = result.IGSTPer;

    //   this.VatAmount = result.VatPercentage;
    //   this.CGSTAmt = result.VatPercentage;
    //   this.SGSTAmt = result.VatPercentage;
    //   this.IGSTAmt = result.VatPercentage;
    //   this.StockId = result.StockId
    //   this.StoreId = result.StoreId;
    //   this.LandedRate = result.LandedRate;
    //   this.PurchaseRate = result.PurchaseRate;
    //   this.UnitMRP = result.UnitMRP;
    // });

    // this.Quantity.nativeElement.focus();
  }
  getNetAmtSum(element) {
    let netAmt;
    netAmt = (element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);
    // this.FinalTotalAmt = netAmt;
    // this.FinalNetAmount = this.FinalTotalAmt;


    // this.TotDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    // this.ItemSubform.get('FinalNetAmount').setValue(this.FinalTotalAmt)
    return netAmt;
  }

  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
      let index = this.Itemchargeslist.indexOf(element);
      if (index >= 0) {
        this.Itemchargeslist.splice(index, 1);
        // this.saleSelectedDatasource.data = [];
        // this.saleSelectedDatasource.data = this.Itemchargeslist;
      }
      Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

    // }
  }
  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._SalesReturnService.IndentSearchGroup.get('ToStoreId').value.StoreId || 1,
       "From_Dt": this.datePipe.transform(this._SalesReturnService.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._SalesReturnService.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "Status": 1//this._SalesReturnService.IndentSearchGroup.get("Status").value || 1,
    }
      this._SalesReturnService.getIndentID(Param).subscribe(data => {
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
      this._SalesReturnService.getIndentList(Param).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
      this.dsIndentList.sort = this.sort;
      this.dsIndentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onChangePatientType(event) {
    if (event.value == 'External') {

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();


    } else {
      // this.Regdisplay = true;

      this.ItemSubform.get('MobileNo').disable();

      this.ItemSubform.get('PatientName').disable();
      this.isPatienttypeDisabled = false;

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();

      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('PatientName').updateValueAndValidity();

    }


  }
  
onclickrow(contact){
Swal.fire("Row selected :" + contact)
}
  getIndentStoreList(){
    debugger
   
        this._SalesReturnService.getStoreFromList().subscribe(data => {
          this.Store1List = data;
          // this._SalesReturnService.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
        });

       }

  onClear(){
    
  }
  onClose(){}
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

