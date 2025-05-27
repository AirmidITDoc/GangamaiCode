import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IpPaymentInsert } from 'app/main/ipd/ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DiscountAfterFinalBillComponent } from './discount-after-final-bill/discount-after-final-bill.component';
import { SalesReturnBillSettlementService } from './sales-return-bill-settlement.service';

@Component({
  selector: 'app-sales-return-bill-settlement',
  templateUrl: './sales-return-bill-settlement.component.html',
  styleUrls: ['./sales-return-bill-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnBillSettlementComponent implements OnInit {
  userFormGroup: FormGroup;
  userFormGroup1: FormGroup;
  displayedColumnsPaid = [
    // 'button',
    'SalesDate',
    'PillNo',
    'RegNo',
    'CompanyName',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'PaidAmount',
    'BalanceAmt',
    'action',
  ];
  displayedColumnsPaid1 = [
    'button',
    'SalesDate',
    'PillNo',
    'RegNo',
    'CompanyName',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'PaidAmount',
    'BalanceAmt',
    'action',
  ];


  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected: boolean = false;
  PatientListfilteredOptionsref: any;
  noOptionFound: any;
  filteredOptions: any;
  vRegNo: any;
  vPatienName: any;
  vMobileNo: any;
  vAdmissionDate: any;
  vAdmissionID: any;
  vIPDNo: any;
  PatientListfilteredOptionsOP: any;
  PatientListfilteredOptionsIP: any;
  RegNo: any;
  IPDNo: any;
  TariffName: any;
  CompanyName: any;
  registerObj: any;
  PatientName: any;
  RegId: any;
  OP_IP_Id: any;
  DoctorName: any;
  RoomName: any;
  BedName: any;
  Age: any;
  GenderName: any;
  OPDNo: any;
  OP_IPType: any;
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;
  vFinalPaidAmount: any;
  vFinalNetAmount: any;
  vFinalBalAmount: any;
  dsPaidItemList = new MatTableDataSource<PaidItemList>();
  dsPaidItemList1 = new MatTableDataSource<PaidItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;

  constructor(
    public _SelseSettelmentservice: SalesReturnBillSettlementService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
  ) { }
  vPharExtOpt: any;
  vPharOPOpt: any;
  vPharIPOpt: any;
  vSelectedOption: any = 'OP';
  WardName: any = ''
  vCondition: boolean = false;
  vConditionExt: boolean = false;
  vConditionIP: boolean = false;
autocompleteModedeptdoc: string = "ConDoctor";
  ngOnInit(): void {
    this.userFormGroup = this._SelseSettelmentservice.CreateUseFrom();
    this.userFormGroup1 = this._SelseSettelmentservice.CreateUseFrom();


    if (this.vPharExtOpt == true) {
      this.vSelectedOption = 'External';
    } else {
      this.vPharOPOpt = true
    }

    if (this.vPharIPOpt == true) {
      if (this.vPharOPOpt == false) {
        this.vSelectedOption = 'IP';
      }
    } else {
      this.vConditionIP = true
    }
    if (this.vPharOPOpt == true) {
      if (this.vPharExtOpt == false) {
        this.vSelectedOption = 'OP';
      }
    } else {
      this.vCondition = true
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  PatientInformRest() {
    this.PatientName = ''
    this.IPDNo = ''
    this.RegNo = ''
    this.DoctorName = ''
    this.TariffName = ''
    this.CompanyName = ''
    this.OPDNo = ''
  }
  paymethod: boolean = false;
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = '';
      this.paymethod = true;
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('PatientName').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('PatientName').updateValueAndValidity();
    } else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = '';
      this.paymethod = true;
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('PatientName').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('PatientName').updateValueAndValidity();
    } else {
      this.userFormGroup.get('MobileNo').reset();
      this.userFormGroup.get('MobileNo').setValidators([Validators.required]);
      this.userFormGroup.get('MobileNo').enable();
      this.userFormGroup.get('PatientName').reset();
      this.userFormGroup.get('PatientName').setValidators([Validators.required]);
      this.userFormGroup.get('PatientName').enable();
      this.userFormGroup.updateValueAndValidity();
      this.paymethod = false;
      this.OP_IPType = 2;
    }
  }

  getSelectedObjRegIP(obj) {
    console.log(obj);
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
      console.log(obj);
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = 40019,// obj.regID;
        this.OP_IP_Id = 40019,// obj.admissionID;
        this.IPDNo = obj.ipdNo;
      this.RegNo = obj.regNo;
      this.DoctorName = obj.doctorName;
      this.TariffName = obj.tariffName;
      this.CompanyName = obj.CompanyName;
      this.Age = obj.age;
      this.WardName = obj.roomName;
      this.BedName = obj.bedName;
    }
    this.getIpSalesList();
  }

  //  getSelectedObjOP(obj) {
  //    console.log(obj);
  //    this.OPDNoCheck = true;
  //    this.DoctorNamecheck = false;
  //    this.IPDNocheck = false;
  //    this.PatientName = obj.firstName + ' ' + obj.lastName;
  //    this.RegId = obj.regID;
  //    this.OP_IP_Id = obj.VisitId;
  //    this.OPDNo = obj.OPDNo;
  //    this.RegNo = obj.regNo;
  //    this.DoctorName = obj.doctorName;
  //    this.TariffName = obj.tariffName;
  //    this.CompanyName = obj.CompanyName;
  //    this.Age = obj.age;
  //    this.WardName = obj.roomName;
  //    this.BedName = obj.bedName;
  // this.getIpSalesList();

  //  }
  getSelectedObj(obj) {
    debugger
    if ((obj.value ?? 0) > 0) {
      console.log(obj)
      setTimeout(() => {
        this._SelseSettelmentservice.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          this.RegId = this.registerObj.regId
          this.RegNo = this.registerObj.regNo
          this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
          console.log(response)

        });

      }, 500);
    }
    this.getIpSalesList();
  }

   getSelectedObj1(obj) {
    debugger
    if ((obj.value ?? 0) > 0) {
      console.log(obj)
      setTimeout(() => {
        this._SelseSettelmentservice.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          this.RegId = this.registerObj.regId
          this.RegNo = this.registerObj.regNo
          this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
          console.log(response)

        });

      }, 500);
    }
    this.getIpSalesList();
  }
  onPatientChange(event: any): void {
    console.log(event);
  }


  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;

  public onEntermobileno(event): void {
    if (event.which === 13) {
      this.patientname.nativeElement.focus();
    }
  }
  public onEnterpatientname(event): void {
    if (event.which === 13) {
      // this.itemid.nativeElement.focus();
      this.doctorname.nativeElement.focus();
    }
  }
  public onEnterDoctorname(event): void {
    if (event.which === 13) {
      // this.address.nativeElement.focus();
    }
  }

  getIpSalesList() {
    debugger
    let OP_IP_Type
    if (this.vSelectedOption == 'OP') {
      OP_IP_Type = 0;
    }
    else if (this.vSelectedOption == 'IP') {
      OP_IP_Type = 1;
    } else {
      OP_IP_Type = 2;
    }
    this.sIsLoading = 'loading-data';
    var Param = {
      "first": 0,
      "rows": 10,
      "sortField": "SalesId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(this.RegId),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_ID",
          "fieldValue": String(this.OP_IP_Id),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue":1,// String(OP_IP_Type),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    console.log(Param)
    this._SelseSettelmentservice.getSalesList(Param).subscribe(Visit => {
      this.dsPaidItemList.data = Visit.data as PaidItemList[];
      console.log(this.dsPaidItemList.data)
      this.dsPaidItemList.sort = this.sort;
      this.dsPaidItemList.paginator = this.Secondpaginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  isLoading123 = false;
  BalanceAm1: any = 0;
  UsedAmt1: any = 0;
  OnPayment(contact) {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(contact)
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = formattedDate,
      PatientHeaderObj['PatientName'] = contact.PatientName;
    PatientHeaderObj['RegNo'] = contact.RegNo;
    PatientHeaderObj['OPD_IPD_Id'] = contact.IPNO;
    PatientHeaderObj['billNo'] = contact.SalesId;
    PatientHeaderObj['NetPayAmount'] = Math.round(contact.BalanceAmount);

    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP-Pharma-SETTLEMENT",
          advanceObj: PatientHeaderObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (result.IsSubmitFlag == true) {
        let updateBillobj = {};
        updateBillobj['salesID'] = contact.SalesId;
        updateBillobj['salRefundAmt'] = 0;
        updateBillobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;

        let UpdateAdvanceDetailarr = [];
        if (UpdateAdvanceDetailarr.length == 0) {
          let update_T_PHAdvanceDetailObj = {};
          update_T_PHAdvanceDetailObj['AdvanceDetailID'] = 0,
            update_T_PHAdvanceDetailObj['UsedAmount'] = 0,
            update_T_PHAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
        }

        let update_T_PHAdvanceHeaderObj = {};
        update_T_PHAdvanceHeaderObj['AdvanceId'] = 0,
          update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
          update_T_PHAdvanceHeaderObj['BalanceAmount'] = 0

        let Data = {
          "salesPaymentSettlement": result.submitDataPay.ipPaymentInsert,
          "update_Pharmacy_BillBalAmountSettlement": updateBillobj,
          "update_T_PHAdvanceDetailSettlement": UpdateAdvanceDetailarr,
          "update_T_PHAdvanceHeaderSettlement": update_T_PHAdvanceHeaderObj
        };
        console.log(Data);

        this._SelseSettelmentservice.InsertSalessettlement(Data).subscribe(response => {
          if (response) {
            this.toastr.success('Sales Credit Payment Successfully !', 'Success', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            //this.getSalesList();  
          }
          else {
            this.toastr.error('Sales Credit Payment  not saved !', 'error', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
    });
  }

  OnPayment1(contact) {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(contact)
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OP_IP_ID;
    PatientHeaderObj['AdvanceAmount'] = Math.round(contact.BalanceAmount);
    PatientHeaderObj['NetPayAmount'] = Math.round(contact.BalanceAmount);
    PatientHeaderObj['BillNo'] = contact.SalesId;
    PatientHeaderObj['IPDNo'] = this.IPDNo;
    PatientHeaderObj['RegNo'] = this.RegNo;
    PatientHeaderObj['OP_IP_Type'] = contact.OP_IP_Type;
    const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
      {
        maxWidth: "95vw",
        height: '650px',
        width: '85%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Pharma-SETTLEMENT"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (result.IsSubmitFlag == true) {
        let updateBillobj = {};
        updateBillobj['salesID'] = contact.SalesId;
        updateBillobj['salRefundAmt'] = 0;
        updateBillobj['balanceAmount'] = result.BalAmt || 0;// result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;


        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];

        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

        let UpdateAdvanceDetailarr = [];
        let UsedHeaderAmt = 0;
        if (result.submitDataAdvancePay.length > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let update_T_PHAdvanceDetailObj = {};
            //extra 
            //this.UsedAmt1 =  (parseInt(element.AdvanceAmount) - parseInt(element.BalanceAmount));
            //UsedHeaderAmt += this.UsedAmt1
            //
            update_T_PHAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            update_T_PHAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            this.UsedAmt1 = (parseInt(this.UsedAmt1) + parseInt(element.UsedAmount));
            update_T_PHAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            this.BalanceAm1 = (parseInt(this.BalanceAm1) + parseInt(element.BalanceAmount));
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
          });
        }
        else {
          let update_T_PHAdvanceDetailObj = {};
          update_T_PHAdvanceDetailObj['AdvanceDetailID'] = 0,
            update_T_PHAdvanceDetailObj['UsedAmount'] = 0,
            update_T_PHAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
        }

        let update_T_PHAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay.length > 0) {
          update_T_PHAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
            update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = this.UsedAmt1,
            update_T_PHAdvanceHeaderObj['BalanceAmount'] = this.BalanceAm1
        }
        else {
          update_T_PHAdvanceHeaderObj['AdvanceId'] = 0,
            update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
            update_T_PHAdvanceHeaderObj['BalanceAmount'] = 0
        }

        let Data = {
          "salesPaymentSettlement": result.submitDataPay.ipPaymentInsert,
          "update_Pharmacy_BillBalAmountSettlement": updateBillobj,
          "update_T_PHAdvanceDetailSettlement": UpdateAdvanceDetailarr,
          "update_T_PHAdvanceHeaderSettlement": update_T_PHAdvanceHeaderObj
        };
        console.log(Data);

        this._SelseSettelmentservice.InsertSalessettlement(Data).subscribe(response => {
          if (response) {
            this.toastr.success('Sales Credit Payment Successfully !', 'Success', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this._matDialog.closeAll();
            this.getIpSalesList();
            this.UsedAmt1 = 0;
            this.BalanceAm1 = 0;
          }
          else {
            this.toastr.error('Sales Credit Payment  not saved !', 'error', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
    });
  }
  vNetAmount: any = 0;
  vBalanceAmount: any = 0;
  vPaidAmount: any = 0;
  SelectedList: any = [];
  SelectedBilllist: any;

  tableElementChecked(event, element) {
    this.SelectedBilllist = element
    if (event.checked) {
      console.log(element)
      this.SelectedList.push(element)
      this.vNetAmount += element.NetAmount
      this.vPaidAmount += element.PaidAmountPayment
      this.vBalanceAmount += Math.round(element.BalanceAmount)
    }
    else {
      let index = this.SelectedList.indexOf(element);
      if (index >= 0) {
        this.SelectedList.splice(index, 1);
      }
      this.vNetAmount -= element.NetAmount
      this.vPaidAmount -= element.PaidAmountPayment
      this.vBalanceAmount -= element.BalanceAmount
    }
    console.log(this.SelectedList)
  }


  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this._SelseSettelmentservice.userFormGroup.reset();
    this.dsPaidItemList.data = [];
    this.PatientInformRest();
  }
  getDiscFinalBill(contact) {
    console.log(contact)
    let PatientInfo = this.registerObj
    const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
      {
        maxWidth: "100%",
        height: '72%',
        width: '60%',
        data: {
          Obj: contact, PatientInfo
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIpSalesList();
    });
  }
  getValidationMessages() {
    return {
      MobileNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      PatientName: [
        // { name: "required", Message: "SupplierId is required" }
      ],

    };
  }
DoctorId='';
  ListView(value) {
  if (value.value !== 0)
      this.DoctorId = String(value.value)
    else
      this.DoctorId = "0"

    // this.onChangeFirst();
  }


DoctorId1='';

  ListView1(value) {
  if (value.value !== 0)
      this.DoctorId1 = String(value.value)
    else
      this.DoctorId1 = "0"

    // this.onChangeFirst();
  }
}

export class PaidItemList {

  SalesDate: number;
  PillNo: number;
  RegNo: number;
  BillAmt: any;
  conAmount: any;
  NetPayAmount: any;
  PaidAmount: number;
  BalanceAmt: number;
  RefundAmt: any;

  constructor(PaidItemList) {
    {
      this.SalesDate = PaidItemList.SalesDate || 0;
      this.PillNo = PaidItemList.PillNo || 0;
      this.RegNo = PaidItemList.RegNo || 0;
      this.BillAmt = PaidItemList.BillAmt || 0;
      this.conAmount = PaidItemList.conAmount || 0;
      this.NetPayAmount = PaidItemList.NetPayAmount || 0;
      this.PaidAmount = PaidItemList.PaidAmount || 0;
      this.BalanceAmt = PaidItemList.BalanceAmt || 0;
    }
  }
}
export class CreditItemList {

  SalesDate: number;
  PillNo: number;
  RegNo: number;
  BillAmt: any;
  conAmount: any;
  NetPayAmount: any;
  PaidAmount: number;
  BalanceAmt: number;
  RefundAmt: any;
  FinalAmt: any;

  constructor(CreditItemList) {
    {
      this.SalesDate = CreditItemList.SalesDate || 0;
      this.PillNo = CreditItemList.PillNo || 0;
      this.RegNo = CreditItemList.RegNo || 0;
      this.BillAmt = CreditItemList.BillAmt || 0;
      this.conAmount = CreditItemList.conAmount || 0;
      this.NetPayAmount = CreditItemList.NetPayAmount || 0;
      this.PaidAmount = CreditItemList.PaidAmount || 0;
      this.BalanceAmt = CreditItemList.BalanceAmt || 0;
      this.FinalAmt = CreditItemList.FinalAmt || 0;
    }
  }
}

