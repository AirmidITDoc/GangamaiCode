import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VisitMaster } from '../../appointment/appointment.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { OPSearhlistService } from '../op-searhlist.service';
import { OPBillingComponent } from '../op-billing/op-billing.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OPCasepaperComponent } from '../op-casepaper/op-casepaper.component';
import { OPRefundofBillComponent } from '../op-refundof-bill/op-refundof-bill.component';
import { OutstandingPaymentComponent } from '../outstanding-payment/outstanding-payment.component';


@Component({
  selector: 'app-opd-search-list',
  templateUrl: './opd-search-list.component.html',
  styleUrls: ['./opd-search-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class OpdSearchListComponent implements OnInit {

  isLoading = true;
  hasSelectedContacts: boolean;
  VisitList: any;
  msg: any;
  selectedID: any;
  response: any = [];
  sIsLoading: string = '';
  doctorNameCmbList:any=[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    // 'checkbox',
    'PatientOldNew',
    'MPbillNo',
    'RegNoWithPrefix',
    'PatientName',
    'DVisitDate',
    'VisitTime',
    'OPDNo',
    'Doctorname',
    'RefDocName',
    'PatientType',
    'HospitalName',
    'buttons'
  ];
  dataSource = new MatTableDataSource<VisitMaster>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  private _onDestroy = new Subject<void>();

  constructor(public _opSearchListService: OPSearhlistService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService,
  
  ) { }

  ngOnInit(): void {

    this.getDoctorNameCombobox();

    
    this.doctorFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
     this.filterDoctor();
     
  });

    if (this._ActRoute.url == '/opd/appointment') {
      // this.menuActions.push('One');
      this.menuActions.push('New Appointment');
      this.menuActions.push('New Appointment with Bill');
      this.menuActions.push('Vital Inforamtion');
      this.menuActions.push('Case Paper');
      this.menuActions.push('Bill');
      this.menuActions.push('Refund of Bill');
      // this.menuActions.push('OP_REPORTS');

    }
    else if (this._ActRoute.url == '/opd/bill') {
      this.menuActions.push('Bill');
      this.menuActions.push('Payment');
    }
    else if (this._ActRoute.url == '/opd/medicalrecords') {
      this.menuActions.push('Case Paper');
      this.menuActions.push('Company Settlement');
      this.menuActions.push('Upload Documents');
      this.menuActions.push('Camera Capture');
    }
    else if (this._ActRoute.url == '/opd/refund') {
      this.menuActions.push('Refund Of Bill');
    }
    else if (this._ActRoute.url == '/opd/payment') {
      this.menuActions.push('Payment');
    }
    this.getVisitList();
  }


  
// validation
get f() { return this._opSearchListService.myFilterform.controls; }

private filterDoctor() {
  // debugger;
  if (!this.doctorNameCmbList) {
    return;
  }
  // get the search keyword
  let search = this.doctorFilterCtrl.value;
   if (!search) {
    this.filtereddoctor.next(this.doctorNameCmbList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filtereddoctor.next(
    this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
  );
  }

  getDoctorNameCombobox(){
    // this._opSearchListService.getDoctorMasterCombo().subscribe(data => this.doctorNameCmbList =data);

     this._opSearchListService.getDoctorMasterCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
  }

  getVisitList() {
    // debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": (this._opSearchListService.myFilterform.get("FirstName").value).trim() + '%' || "%",
      "L_Name": (this._opSearchListService.myFilterform.get("LastName").value).trim() + '%' || "%",
      "Reg_No": this._opSearchListService.myFilterform.get("RegNo").value || 0,
      "Doctor_Id": this._opSearchListService.myFilterform.get("DoctorId").value.DoctorID || 0,
      "From_Dt": this.datePipe.transform(this._opSearchListService.myFilterform.get("start").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._opSearchListService.myFilterform.get("end").value, "MM-dd-yyyy") || '01/01/1900',
      "IsMark": this._opSearchListService.myFilterform.get("IsMark").value.selected || 0,
    }
    //  console.log(D_data);
    this._opSearchListService.getAppointmentList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as VisitMaster[];
      // console.log( this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
    // console.log( this.dataArray);
  }



  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    // this.isLoading = true;
    this.dataSource.data = changes.dataArray.currentValue as VisitMaster[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.isLoading = false;
  }

  getRecord(contact, m): void {
    if (m == "Bill") {
      let xx = {
        RegNo: contact.RegId,
        // RegId: contact.RegId,
        AdmissionID: contact.VisitId,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        ClassName: contact.ClassName,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId
      };
      this.advanceDataStored.storage = new SearchInforObj(xx);
      // this._ActRoute.navigate(['opd/new-OpdBilling']);
        const dialogRef = this._matDialog.open(OPBillingComponent, 
         {  maxWidth: "90%",
        //  height: '495px !important',

        height: '695px !important',
        // width: '100%',
       });
       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
      });
    }
    
    else if(m == "Payment") {
        
        let data = {
          RegNo: contact.RegId,
          AdmissionID: contact.VisitId,
          PatientName: contact.PatientName,
          Doctorname: contact.Doctorname,
          AdmDateTime: contact.AdmDateTime,
          AgeYear: contact.AgeYear,
          ClassName: contact.ClassName,
          WardName:contact.RoomName,
          BedName:contact.BedName,
          IPDNo:contact.IPDNo,
          TariffName: contact.TariffName,
          TariffId: contact.TariffId,
          PatientType:contact.PatientType,
          VisitId:contact.VisitId,
          opD_IPD_Type :contact.opD_IPD_Type,
        };
        this.advanceDataStored.storage = new SearchInforObj(data);
        console.log( this.advanceDataStored.storage);
        console.log(data);
        const dialogRef = this._matDialog.open(OutstandingPaymentComponent,
          {
            maxWidth: "95%",
            height: '65%',
            width: '100%',
            data : {
              registerObj : data,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
          //  this.getRadiologytemplateMasterList();
        });
      }
    
    
    // if (m == "Advance") {
    //   var m_data = {
    //     RegNo: contact.RegId,
    //     AdmissionID: contact.VisitId,
    //     PatientName: contact.PatientName,
    //     Doctorname: contact.Doctorname,
    //     AdmDateTime: contact.AdmDateTime,
    //     AgeYear: contact.AgeYear,
    //     ClassId: contact.ClassId,
    //     TariffName: contact.TariffName,
    //     TariffId: contact.TariffId
    //   }
    //   this._opSearchListService.populateForm(m_data);
    //   this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
    //   const dialogRef = this._matDialog.open(OpAdvanceComponent,
    //     {
    //       maxWidth: "85vw",
    //       height: '560px',
    //       width: '100%',
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed - Insert Action', result);

    //   });
    // }
    // if (m == "Company Settlement") {
    //   var m_data = {
    //     RegNo: contact.RegId,
    //     AdmissionID: contact.VisitId,
    //     PatientName: contact.PatientName,
    //     Doctorname: contact.Doctorname,
    //     AdmDateTime: contact.AdmDateTime,
    //     AgeYear: contact.AgeYear,
    //     ClassId: contact.ClassId,
    //     TariffName: contact.TariffName,
    //     TariffId: contact.TariffId
    //   }
    //   this._opSearchListService.populateForm(m_data);
    //   this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
    //   const dialogRef = this._matDialog.open(CompanySettlementComponent,
    //     {
    //       maxWidth: "85vw",
    //       height: '600px',
    //       width: '100%',
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed - Insert Action', result);

    //   });
    // }

    if (m == "Refund Of Bill") {
      // console.log(" This is for Refund of Bill pop : " + m);
      let xx = {
        RegNo: contact.RegNo,
        RegId: contact.RegId,
        AdmissionID: contact.VisitId,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,

      };
      this.advanceDataStored.storage = new SearchInforObj(xx);

      // this._ActRoute.navigate(['opd/new-OpdBilling']);
      const dialogRef = this._matDialog.open(OPRefundofBillComponent,
        {
          maxWidth: "85%",
          height: '900px',
          width: '100%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
      });
    }

   
    // if (m == " OP_REPORTS") {

    //   console.log(" This is for  OP_REPORTS pop : " + m);
    //   let xx = {
    //     RegNo: contact.RegNo,
    //     RegId: contact.RegId,
    //     AdmissionID: contact.VisitId,
    //     PatientName: contact.PatientName,
    //     Doctorname: contact.Doctorname,
    //     AdmDateTime: contact.AdmDateTime,
    //     AgeYear: contact.AgeYear,
    //     ClassId: contact.ClassId,
    //     TariffName: contact.TariffName,
    //     TariffId: contact.TariffId,
    //     DoctorId: contact.DoctorId,

    //   };
    //   // this.advanceDataStored.storage = new AdvanceDetailObj(xx);

    //   // this._ActRoute.navigate(['opd/new-OpdBilling']);
    //   // const dialogRef = this._matDialog.open(OpReprtsComponent,
    //   //   {
    //   //     maxWidth: "85%",
    //   //     height: '650px',
    //   //     width: '100%',
    //   //   });
    //   // dialogRef.afterClosed().subscribe(result => {
    //   //   console.log('The dialog was closed - Insert Action', result);
    //   //   //  this.getRadiologytemplateMasterList();
    //   // });
    // }

  
  }

   // toggle sidebar
 toggleSidebar(name): void {
  this._fuseSidebarService.getSidebar(name).toggleOpen();
}

  onClear() {
  
    this._opSearchListService.myFilterform.get('FirstName').reset();
    this._opSearchListService.myFilterform.get('LastName').reset();
    this._opSearchListService.myFilterform.get('RegNo').reset();
    this._opSearchListService.myFilterform.get('DoctorId').reset();
  }

}

function PrescriptionTable(PrescriptionTable: any, arg1: { maxWidth: string; maxHeight: string; width: string; height: string; }) {
  throw new Error('Function not implemented.');
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
     OPD_IPD_ID:any;
     storage: any;
     IsMLC:any;
     NetPayableAmt:any;
     /**
     * Constructor
     *
     * @param SearchInforObj
     */
      constructor(SearchInforObj) {
        {
           this.RegNo = SearchInforObj.RegNo || '';
           this.RegId = SearchInforObj.RegId || '';
           this.AdmissionID = SearchInforObj.AdmissionID || '';
           this.PatientName = SearchInforObj.PatientName || '';
           this.Doctorname = SearchInforObj.Doctorname || '';
           this.AdmDateTime = SearchInforObj.AdmDateTime || '';
           this.AgeYear = SearchInforObj.AgeYear || '';
           this.ClassId = SearchInforObj.ClassId || '';
           this.ClassName = SearchInforObj.ClassName || '';
           this.TariffName = SearchInforObj.TariffName || '';
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
        }
    }
}


export class ChargesList{
  ChargesId: number;
  ServiceId: number;
  ServiceName : String;
  Price:number;
  Qty: number;
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

  constructor(ChargesList){
          this.ChargesId = ChargesList.ChargesId || '';
          this.ServiceId = ChargesList.ServiceId || '';
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
  }
} 