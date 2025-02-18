import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { OPSearhlistService } from '../op-searhlist.service';
import { OPBillingComponent } from '../op-billing/op-billing.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { fuseAnimations } from '@fuse/animations';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OPCasepaperComponent } from '../op-casepaper/op-casepaper.component';
import { OPRefundofBillComponent } from '../op-refundof-bill/op-refundof-bill.component';
import { NewOPRefundofbillComponent } from '../new-oprefundofbill/new-oprefundofbill.component';
import Swal from 'sweetalert2';
import { IPpaymentWithadvanceComponent } from 'app/main/ipd/ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { IpPaymentInsert } from '../op-advance-payment/op-advance-payment.component';
import { OpPaymentComponent } from '../op-payment/op-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OpPaymentVimalComponent } from '../op-payment-vimal/op-payment-vimal.component';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';



@Component({
  selector: 'app-opd-search-list',
  templateUrl: './opd-search-list.component.html',
  styleUrls: ['./opd-search-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class OpdSearchListComponent implements OnInit {

  flagSubmit: boolean; 
  sIsLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj; 
  screenFromString = 'Ip-Settelment';   
  currentDate = new Date();
  FinalAmt: any;
  balanceamt: any;  
  searchFormGroup: FormGroup;
  registerObj:any;
  filteredOptions: any;
  noOptionFound: boolean = false;  
  PatientName: any;
  RegId: any;
  isRegIdSelected: boolean = false;
  vAdmissionID: any;
  vCompanyName: any;
  vTariif: any;
  RegNo: any;
  PatientHeaderObj: AdvanceDetailObj;
  AgeYear:any;
  AgeDay:any;
  GenderName:any;
  AgeMonth:any;
  MobileNo:any; 
  SpinLoading: boolean = false; 

  displayedColumns1: string[] = [ 
    'button',
    'CompanyName',
    'PatientType',
    'BillDate',
    'BillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'action' 
  ];
  dataSource1 = new MatTableDataSource<CreditBilldetail>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  private _BrowseOPDBillsService: any;

  constructor(
    public _opSearchListService: OPSearhlistService, 
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService, 
    private formBuilder: FormBuilder, 
  ) { }

  ngOnInit(): void {
    this.clearpatientinfo();
    this.searchFormGroup = this.createSearchForm(); 
  }
 createSearchForm() {
    return this.formBuilder.group({ 
      RegId: [''], 
    });
  }  
  getSearchList() { 
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._opSearchListService.getRegisteredList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    } 
  } 
 

  getSelectedObj(obj) {
    console.log(obj)
   
    this.RegId = obj.value;
  
    if ((this.RegId ?? 0) > 0) {
        
       setTimeout(() => {
          this._opSearchListService.getRegistraionById(this.RegId).subscribe((response) => {
            this.registerObj = response;
            console.log(this.registerObj)
            if(this.registerObj)
              this.getregdetails(this.registerObj);
  
          });
  
        }, 500);
    }
  
}
 
getregdetails(obj){
  console.log(obj)
    this.PatientName = obj.firstName + ' ' + obj.middleName + ' ' + obj.lastName;
    this.RegId = obj.RegID;  
    this.RegId = obj.regId;  
    this.vAdmissionID = obj.AdmissionID;
    this.RegNo = obj.RegNo;
    this.AgeYear = obj.AgeYear; 
    this.AgeDay = obj.AgeDay;
    this.AgeMonth = obj.AgeMonth;
    this.GenderName = obj.genderId;
    this.MobileNo = obj.mobileNo;  
}
  getOptionText(option) {
    if (!option) return '';
    return option.firstName + ' ' + option.mastName + ' ' + option.lastName ; 
  }
  clearpatientinfo(){
    this.PatientName = '';
    this.RegId =  '';
    this.vAdmissionID = '';
    this.RegNo = '';
    this.AgeYear = '' ;
    this.AgeDay = '';
    this.AgeMonth = '';
   this.GenderName = '';
   this.MobileNo = ''; 
  } 
  getCreditBillDetails() { 
    this.sIsLoading = 'loading-data'; 
    var Vdata={
      'RegId':this.RegId
    } 
    console.log(Vdata)


    
    this._opSearchListService.getCreditBillList(Vdata).subscribe(Visit => {
      this.dataSource1.data = Visit as CreditBilldetail[];
      console.log(this.dataSource1.data);
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator; 
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  }
  vpaidamt:any;
  vbalanceamt:any;
  openPaymentpopup(contact){
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(contact)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate,
    PatientHeaderObj['RegNo'] = contact.RegNo;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OPDNo;
    PatientHeaderObj['Age'] = contact.PatientAge;
    PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
    PatientHeaderObj['DoctorName'] = contact.DoctorName;
    PatientHeaderObj['TariffName'] = contact.TariffName;
    PatientHeaderObj['CompanyName'] = contact.CompanyName;
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt; 
    
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      { 
        maxWidth: "80vw",
        height: '600px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP-Bill"
        }
      });
  

      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (result.IsSubmitFlag == true) {
debugger
          this.vpaidamt = result.PaidAmt;
          this.vbalanceamt = result.BalAmt

          let updateBillobj = {};
          updateBillobj['BillNo'] = contact.BillNo;
          updateBillobj['BillBalAmount'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;  //result.BalAmt;
       
          let Data = {
            "updateBill": updateBillobj,
            "paymentCreditUpdate": result.submitDataPay.ipPaymentInsert
          };
          console.log(Data)
          this._opSearchListService.InsertOPBillingsettlement(Data).subscribe(response => {
            if (response) {
              Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  
                  this.viewgetOPPayemntPdf(response,true)
                  this._matDialog.closeAll();
                  this.getCreditBillDetails(); 
                }
              });
            }
            else {
              Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
            }
          });
        }
      });
  }  
 
  viewgetOPPayemntPdf(Id,value) {
    setTimeout(() => {

      let param = {

          "searchFields": [
              {
                  "fieldName": "PaymentId",
                  "fieldValue": Id,
                  "opType": "13"
              }
          ],
          "mode": "OPPaymentReceipt"
      }

      debugger
      console.log(param)
      this._BrowseOPDBillsService.getReportView(param).subscribe(res => {
          const matDialog = this._matDialog.open(PdfviewerComponent,
              {
                  maxWidth: "85vw",
                  height: '750px',
                  width: '100%',
                  data: {
                      base64: res["base64"] as string,
                      title: "OP Payment  Viewer"

                  }

              });

          matDialog.afterClosed().subscribe(result => {

          });
      });

  }, 100);
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
     this._matDialog.closeAll();
     this.searchFormGroup.reset();
     this.dataSource1.data =[]; 
     this.clearpatientinfo();
  }
   
} 
export class CreditBilldetail { 
  BillNo: any;
  CompanyName: any;
  PatientType: any;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PaidAmount: number;
  BalanceAmt: number;
  BillDate: Date;

  constructor(CreditBilldetail) {
    this.BillDate = CreditBilldetail.BillDate || '';
    this.BillNo = CreditBilldetail.BillNo || '';
    this.TotalAmt = CreditBilldetail.TotalAmt || 0;
    this.ConcessionAmt = CreditBilldetail.ConcessionAmt || '';
    this.NetPayableAmt = CreditBilldetail.NetPayableAmt || 0;
    this.PaidAmount = CreditBilldetail.PaidAmount || 0;
    this.BalanceAmt = CreditBilldetail.BalanceAmt || '';
    this.CompanyName = CreditBilldetail.CompanyName || '';
    this.PatientType = CreditBilldetail.PatientType || '';
  }

}
export class SearchInforObj
{
    RegNo : Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    ClassName:String;
    TariffName: String;
    Tariffname: String;
    TariffId : number;
    IsDischarged:boolean;
    opD_IPD_Type:number;
    PatientType:any;
    PatientTypeID:any;
    VisitId:any;
    AdmissionId:number;
    IPDNo:any;
    DoctorId:number;
    BedId:any;
    BedName:String;
    WardName:String;
    CompanyId:string;
    SubCompanyId:any;
    IsBillGenerated:any;
    UnitId:any;
    RegId:number;
    RefId:number;
    OPDNo:any;
     OPD_IPD_ID:any;
     storage: any;
     IsMLC:any;
     NetPayableAmt:any;
     CompanyName:any;
     MobileNo:any;
     AgeDay:any;
     AgeMonth:any;
     DepartmentName:any;
     GenderName:any;
     DepartmentId:any;
     Tarrifname:any;
     RefDocName:any;
     RefDocId:any;
     TarrifName:any;
     /**
     * Constructor
     *
     * @param SearchInforObj
     */
      constructor(SearchInforObj) {
        {
           this.RegNo = SearchInforObj.RegNo || '';
           this.RegId = SearchInforObj.RegId || '';
           this.OPDNo = SearchInforObj.OPDNo || '';
           this.AdmissionID = SearchInforObj.AdmissionID || '';
           this.PatientName = SearchInforObj.PatientName || '';
           this.Doctorname = SearchInforObj.Doctorname || '';
           this.AdmDateTime = SearchInforObj.AdmDateTime || '';
           this.AgeYear = SearchInforObj.AgeYear || '';
           this.ClassId = SearchInforObj.ClassId || '';
           this.ClassName = SearchInforObj.ClassName || '';
           this.TariffName = SearchInforObj.TariffName || '';
           this.Tariffname = SearchInforObj.Tariffname || '';
           this.TariffId = SearchInforObj.TariffId || '';
           this.IsDischarged =SearchInforObj.IsDischarged || 0 ;
           this.opD_IPD_Type = SearchInforObj.opD_IPD_Type | 0;
           this.PatientType = SearchInforObj.PatientType || 0;
           this.VisitId = SearchInforObj.VisitId || '';
           this.AdmissionId = SearchInforObj.AdmissionId || '';
           this.IPDNo = SearchInforObj.IPDNo || '';
           this.BedName = SearchInforObj.BedName || '';
           this.WardName = SearchInforObj.WardName || '';
           this.CompanyId = SearchInforObj.CompanyId || '';
           this.IsBillGenerated = SearchInforObj.IsBillGenerated || 0;
           this.UnitId = SearchInforObj.UnitId || 0;
           this.RefId = SearchInforObj.RefId || 0;
            this.DoctorId = SearchInforObj.DoctorId || 0;
            this.OPD_IPD_ID = SearchInforObj.OPD_IPD_ID || 0;
            this.IsMLC = SearchInforObj.IsMLC || 0;
            this.BedId = SearchInforObj.BedId || 0;
            this.SubCompanyId =SearchInforObj.SubCompanyId || 0;
            this.PatientTypeID =SearchInforObj.PatientTypeID || 0;
           this.NetPayableAmt =SearchInforObj.NetPayableAmt || 0;
           this.CompanyName=SearchInforObj.CompanyName || '',
           this.MobileNo=SearchInforObj.MobileNo ||''
           this.AgeDay=SearchInforObj.AgeDay || '',
           this.AgeMonth=SearchInforObj.AgeMonth||0
           this.DepartmentName=SearchInforObj.DepartmentName || '',
           this.DepartmentId=SearchInforObj.DepartmentId ||0
           this.GenderName=SearchInforObj.GenderName|| ""
           this.Tarrifname=SearchInforObj.Tarrifname || ""
             this.TarrifName=SearchInforObj.TarrifName || ""
           this.RefDocName=SearchInforObj.RefDocName|| ""
           this.RefDocId=SearchInforObj.RefDocId || 0;

        }
    }
}
export class ChargesList{
  ChargesId: number;
  ServiceId: number;
  serviceId: number;
  ServiceName : String;
  Price:any;
  Qty: any;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId:number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology:boolean;
  IsRadiology:boolean;
  ClassId:number;
  ClassName: string;
  ChargesAddedName: string;
  PackageId:any;
  PackageServiceId:any;
  IsPackage:any;
  PacakgeServiceName:any;
  BillwiseTotalAmt: any;
  
  constructor(ChargesList){
          this.ChargesId = ChargesList.ChargesId || '';
          this.ServiceId = ChargesList.ServiceId || '';
          this.serviceId = ChargesList.serviceId || 0;
          this.ServiceName = ChargesList.ServiceName || '';
          this.Price = ChargesList.Price || '';
          this.Qty = ChargesList.Qty || '';
          this.TotalAmt = ChargesList.TotalAmt || '';
          this.DiscPer = ChargesList.DiscPer || '';
          this.DiscAmt = ChargesList.DiscAmt || '';
          this.NetAmount = ChargesList.NetAmount || '';
          this.DoctorId=ChargesList.DoctorId || 0;
          this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
          this.ChargesDate = ChargesList.ChargesDate || '';
          this.IsPathology = ChargesList.IsPathology || '';
          this.IsRadiology = ChargesList.IsRadiology || '';
          this.ClassId=ChargesList.ClassId || 0;
          this.ClassName = ChargesList.ClassName || '';
          this.ChargesAddedName = ChargesList.ChargesAddedName || '';
          this.PackageId=ChargesList.PackageId || 0;
          this.PackageServiceId=ChargesList.PackageServiceId || 0;
          this.IsPackage=ChargesList.IsPackage || 0; 
          this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
  }
} 