import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PharmacyClearenceService } from './pharmacy-clearence.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pharmacy-clearence',
  templateUrl: './pharmacy-clearence.component.html',
  styleUrls: ['./pharmacy-clearence.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PharmacyClearenceComponent implements OnInit {  

  displayedColumnsRef = [
    'SalesDate',
    'SalseNo',
    'NetPayAmt',
    'PaidAmt',
    'BalAmount',
    'RefundAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'AdvPay'
  ];
  displayedColumns = [
    'SalesDate',
    'SalseNo',
    'NetPayAmt',
    'PaidAmt',
    'BalAmount',
    'RefundAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'AdvPay'
  ];

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected: boolean = false;
  PatientListfilteredOptionsref: any;
  noOptionFound: any;
  filteredOptions: any;

 

  dsIpItemList = new MatTableDataSource<IpItemList>();
  dsTable1IpItemList = new MatTableDataSource<IpRefItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;

  constructor(
    public _PharmacyClearenceService: PharmacyClearenceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService, 
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getRefSearchList() {
    var m_data = {
      "Keyword": `${this._PharmacyClearenceService.userFormGroup.get('RegID').value}%`
    }
    if (this._PharmacyClearenceService.userFormGroup.get('RegID').value.length >= 1) {
      this._PharmacyClearenceService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptionsref = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionTextref(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegID + ')';
  }
  vRegNo: any;
  vRegId: any;
  vPatienName: any;
  vTariffName: any;
  vDoctorName: any;
  vAdmissionID: any;
  vIPDNo: any;
  vCompanyName:any;
  CheckPatienInfo:boolean=false;
  getSelectedObj(obj) {
    if(obj.IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged');
      //this.PatientInformRest();
      this.vRegId = ''
    }
    else{
      this.CheckPatienInfo=true;
      console.log(obj)  
      this.vPatienName = obj.FirstName + ' ' + obj.LastName;
      this.vRegId = obj.RegID;
      this.vAdmissionID = obj.AdmissionID;
      this.vIPDNo = obj.IPDNo;
      this.vRegNo =obj.RegNo;
      this.vDoctorName = obj.DoctorName;
      this.vTariffName =obj.TariffName
      this.vCompanyName = obj.CompanyName;
    } 
  } 
  
  getSalesList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionId": obj.AdmissionId
    }
    console.log(m_data)
    setTimeout(() => {
      this.sIsLoading = 'loading';
      this._PharmacyClearenceService.getSalesList(m_data).subscribe(Visit => {
        this.dsIpItemList.data = Visit as IpItemList[];
        console.log(this.dsIpItemList.data)
        this.dsIpItemList.sort = this.sort;
        this.dsIpItemList.paginator = this.Secondpaginator; 
      },
        error => {
          this.sIsLoading = this.dsIpItemList.data.length == 0 ? 'no-data' : '';
        });
    }, 500);

  }
  TotalAdvamt: any;
  Advavilableamt: any;
  vadvanceAmount: any;
  vPatientType: any;
  getAdvancetotal(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.TotalAdvamt = netAmt;
    return netAmt;
  }

  getAdvavilable(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.Advavilableamt = netAmt;
    return netAmt;
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
  onSave() {
    
  }
  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this._PharmacyClearenceService.userFormGroup.reset();
    this._PharmacyClearenceService.userFormGroup.get('Op_ip_id').setValue(1);
    this.dsIpItemList.data = [];
  }
}
  export class IpItemList {
  
    SalesDate: number;
    SalseNo: number;
    NetPayAmt: number;
    PaidAmt: any;
    BalAmount: any;
    RefundAmt: any;
    CashPay: number;
    CardPay: number;
    ChequePay: any;
    AdvPay:any;
  
    constructor(IpItemList) {
      { 
        this.SalesDate = IpItemList.SalesDate || 0;
        this.SalseNo = IpItemList.SalseNo || 0;
        this.NetPayAmt = IpItemList.NetPayAmt || 0;
        this.PaidAmt = IpItemList.PaidAmt || 0;
        this.BalAmount = IpItemList.BalAmount || 0;
        this.RefundAmt = IpItemList.RefundAmt || 0;
        this.CashPay = IpItemList.CashPay || 0;
        this.CardPay = IpItemList.CardPay || 0;
        this.ChequePay = IpItemList.ChequePay || 0; 
        this.AdvPay = IpItemList.AdvPay || 0;
      }
    }
  }
  export class IpRefItemList {
  
    SalesDate: number;
    SalseNo: number;
    NetPayAmt: number;
    PaidAmt: any;
    BalAmount: any;
    RefundAmt: any;
    CashPay: number;
    CardPay: number;
    ChequePay: any;
    AdvPay:any;
  
    constructor(IpItemList) {
      { 
        this.SalesDate = IpItemList.SalesDate || 0;
        this.SalseNo = IpItemList.SalseNo || 0;
        this.NetPayAmt = IpItemList.NetPayAmt || 0;
        this.PaidAmt = IpItemList.PaidAmt || 0;
        this.BalAmount = IpItemList.BalAmount || 0;
        this.RefundAmt = IpItemList.RefundAmt || 0;
        this.CashPay = IpItemList.CashPay || 0;
        this.CardPay = IpItemList.CardPay || 0;
        this.ChequePay = IpItemList.ChequePay || 0; 
        this.AdvPay = IpItemList.AdvPay || 0;
      }
    }
  }

