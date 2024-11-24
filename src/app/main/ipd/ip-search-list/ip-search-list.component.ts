import { DatePipe, Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AdvanceDataStored } from '../advance';
import { IPSearchListService } from './ip-search-list.service';
import { Router } from '@angular/router';
import { IPAdvanceComponent } from './ip-advance/ip-advance.component';
import Swal from 'sweetalert2';
import { DischargeComponent } from './discharge/discharge.component';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
// import { IPRefundofAdvanceComponent } from './ip-refundof-advance/ip-refundof-advance.component';
import { IPRefundofBillComponent } from './ip-refundof-bill/ip-refundof-bill.component';
import { Admission, AdmissionPersonlModel } from '../Admission/admission/admission.component';
import { IPBillingComponent } from './ip-billing/ip-billing.component';
import { IPSettlementComponent } from '../ip-settlement/ip-settlement.component';
import { DischargeSummaryComponent } from './discharge-summary/discharge-summary.component';
import { ToastrService } from 'ngx-toastr';
import { CompanyInformationComponent } from '../company-information/company-information.component';
import { IPRefundofAdvanceComponent } from '../ip-refundof-advance/ip-refundof-advance.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPIPFeedbackComponent } from '../Feedback/opip-feedback/opip-feedback.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';


@Component({
  selector: 'app-ip-search-list',
  templateUrl: './ip-search-list.component.html',
  styleUrls: ['./ip-search-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPSearchListComponent implements OnInit {
  // ----- spinner loading 

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "Admission/AdmissionList",
        columnsList: [
            { heading: "Code", key: "admissionId", sort: true, align: 'left', emptySign: 'NA' , width:50 },
            { heading: "RegId", key: "regId", sort: true, align: 'left', emptySign: 'NA' , width:50 },
            // { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AdmissionTime", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width:150  },
            { heading: "PatientTypeId", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA' , width:150 },
           
            { heading: "DocNameId", key: "docNameId", sort: true, align: 'left', emptySign: 'NA' , width:150 },
            { heading: "Ipdno", key: "ipdno", sort: true, align: 'left', emptySign: 'NA' , width:150 },
          //  { heading: "IsConsolidatedDr", key: "isConsolidatedDr", sort: true, align: 'left', emptySign: 'NA' },
          {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this.confirmDialogRef = this._matDialog.open(
                            FuseConfirmDialogComponent,
                            {
                                disableClose: false,
                            }
                        );
                        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                        this.confirmDialogRef.afterClosed().subscribe((result) => {
                            if (result) {
                                let that = this;
                                this._IpSearchListService.deactivateTheStatus(data.AdmissionId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    that.grid.bindGridData();
                                });
                            }
                            this.confirmDialogRef = null;
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "AdmissionId",
    sortOrder: 0,
    filters: [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: "11/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
    }


  isLoadingStr: string = '';
  isLoading: String = '';


  hasSelectedContacts: boolean;
  MouseEvent = true;
  AdvanceId: number;
  AdmittedPatientList: any;
  msg: any;
  click: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  doctorNameCmbList: any = [];
  wardNameCmbList: any = [];

  isChecked: boolean = false;

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  public wardFilterCtrl: FormControl = new FormControl();
  public filteredward: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource<Admission>();
  @Output() showClicked = new EventEmitter();
  sIsLoading: string = '';

  displayedColumns = [
    'button',
    'IsBillGenerated',
    'IsMLC',
    'RegNo',
    'PatientName',
    'DOA',
    'IPDNo',
    'Doctorname',
    'RefDocName',
    'PatientType',
    'CompanyName',
    'buttons1',
    'buttons'
  ];



  menuActions: Array<string> = [];


  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    //this.onClear();
    // this.getAdmittedPatientList();
    if (this._ActRoute.url == '/ipd/ipadvance') {
      this.menuActions.push('Advance');
      this.menuActions.push('Bed Transfer');
    }
    else if (this._ActRoute.url == '/ipd/discharge') {
      this.menuActions.push('Discharge');
      this.menuActions.push('Discharge Summary');
      this.menuActions.push('Patient Feedback');
    }
    else if (this._ActRoute.url == '/ipd/dischargesummary') {
      this.menuActions.push('Discharge');
      this.menuActions.push('Discharge Summary');
    }
    else if (this._ActRoute.url == '/ipd/refund/iprefundofadvance' || this._ActRoute.url == '/ipd/refund/iprefundofbill') {

      this.menuActions.push('Refund of Bill');
      this.menuActions.push('Refund of Advance');
      this.menuActions.push('Refund of Advance');
    }

    else if (this._ActRoute.url == '/ipd/add-billing') {
      this.menuActions.push('Advance');
      this.menuActions.push('Bill');
      this.menuActions.push('Refund of Bill');
      this.menuActions.push('Refund of Advance');
      // this.menuActions.push('Payment');
      this.menuActions.push('Update Company Information');
    }
    else if (this._ActRoute.url == '/ipd/medicalrecords') {
      this.menuActions.push('Case Paper');
    }
    else if (this._ActRoute.url == '/ipd/ip-casepaper') {
      this.menuActions.push('Medical CasePaper');

    }
    else if (this._ActRoute.url == '/nursingstation/bedtransfer') {
      this.menuActions.push('Bed Transfer');
      this.menuActions.push('Doctor Note');
      this.menuActions.push('Nursing Note');

    }

  }
  get f() { return this._IpSearchListService.myFilterform.controls; }

  ngOnChanges(changes: SimpleChanges) {

    this.click = !this.click;
    setTimeout(() => {
      {
        this.dataSource.data = changes.dataArray.currentValue as Admission[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.click = false;
      }
    }, 500);
    this.MouseEvent = true;
  }
  onSave(data){}

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  resultsLength = 0;
  getAdmittedPatientList() {

    if (this._IpSearchListService.myFilterform.get("IsDischarge").value == "0" || this._IpSearchListService.myFilterform.get("IsDischarge").value == false) {
      this.isLoadingStr = 'loading';
      var D_data = {
        "F_Name": this._IpSearchListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._IpSearchListService.myFilterform.get("LastName").value + '%' || "%",
        "Reg_No": this._IpSearchListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._IpSearchListService.myFilterform.get("DoctorId").value || 0,
        "From_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": this._IpSearchListService.myFilterform.get('IsDischarge').value || 0,
        "M_Name": this._IpSearchListService.myFilterform.get("MiddleName").value + '%' || "%",
        "IPNo": this._IpSearchListService.myFilterform.get("IPDNo").value || 0,
        Start: (this.paginator?.pageIndex ?? 0),
        Length: (this.paginator?.pageSize ?? 35),
      }

      setTimeout(() => {
        this.isLoadingStr = 'loading';
        this._IpSearchListService.getAdmittedPatientList_1(D_data).subscribe(data => {
          this.dataSource.data = data["Table1"] ?? [] as Admission[];
          // console.log(this.dataSource.data)
          this.dataSource.sort = this.sort;
          this.resultsLength = data["Table"][0]["total_row"];
          this.sIsLoading = '';
        },
          error => {
            this.sIsLoading = '';
          });
      }, 1000);
    }
    else {
      this.isLoadingStr = 'loading';
      var Params = {
        "F_Name": this._IpSearchListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._IpSearchListService.myFilterform.get("LastName").value + '%' || "%",
        "M_Name": this._IpSearchListService.myFilterform.get("MiddleName").value + '%' || "%",
        "Reg_No": this._IpSearchListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._IpSearchListService.myFilterform.get("DoctorId").value || 0,
        "From_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": this._IpSearchListService.myFilterform.get('IsDischarge').value,
        "IPNo": this._IpSearchListService.myFilterform.get("IPDNo").value || 0,
        Start: (this.paginator?.pageIndex ?? 0),
        Length: (this.paginator?.pageSize ?? 35),
      }
      setTimeout(() => {
        this.isLoadingStr = 'loading';
        this._IpSearchListService.getDischargedPatientList_1(Params).subscribe(data => {
          // this.dataSource.data = data as Admission[];
          this.dataSource.data = data["Table1"] ?? [] as Admission[];
          console.log(this.dataSource.data)
          this.dataSource.sort = this.sort;
          this.resultsLength = data["Table"][0]["total_row"];
          // this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
          this.sIsLoading = '';
          // this.click = false;
        },
          error => {
            this.sIsLoading = '';
          });
      }, 1000);

    }
  }


  dataSource1 = new MatTableDataSource<AdvanceDetailObj>();

  SubMenu(contact) {
    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.AdmissionID,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      IsDischarged: contact.IsDischarged,
      IPDNo: contact.IPDNo,
      BedName: contact.BedName,
      WardName: contact.RoomName
    };
    this.advanceDataStored.storage = new AdvanceDetailObj(xx);
    this._ActRoute.navigate(['ipd/add-billing/new-appointment']);
  }


  getRecord(contact, m): void {
    if (m == "Advance") {
      console.log(contact);

      this.advanceDataStored.storage = new AdvanceDetailObj(contact);
      this._IpSearchListService.populateForm(contact);
      //debugger
      let Advflag: boolean = false;
      if (contact.IsBillGenerated) {
        Advflag = true;
      }
      if (contact.IsDischarged) {
        Advflag = true;
      }

      if (!Advflag) {
        const dialogRef = this._matDialog.open(IPAdvanceComponent,
          {
            maxWidth: "100%",
            height: '95%',
            width: '80%',
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
        });
      } else {
        Swal.fire("Bil Generatd !")
      }
    }
    else if (m == "Discharge Summary") {
      console.log(contact);
      this.advanceDataStored.storage = new AdvanceDetailObj(contact);
      this._IpSearchListService.populateForm1(contact);
      const dialogRef = this._matDialog.open(DischargeSummaryComponent,
        {

          maxWidth: "95vw",
          height: '90vh',
          width: '100%',

        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else if (m == "Payment") {

      var m_data = {
        RegNo: contact.RegNo,
        RegId: contact.RegID,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_ID: contact.OPD_IPD_Id,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
        opD_IPD_Typec: contact.opD_IPD_Type

      }

      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm1(m_data);
      const dialogRef = this._matDialog.open(IPSettlementComponent,
        {

          maxWidth: "95vw",
          height: '110vh',
          width: '100%',
          data: m_data

        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else if (m == "Refund of Bill") {

      console.log(" This is for IP Refund of Bill pop : " + m);

      this.advanceDataStored.storage = new AdvanceDetailObj(contact);

      // if (!contact.IsBillGenerated || contact.IsDischarged ==1) {
      const dialogRef = this._matDialog.open(IPRefundofBillComponent,
        {
          maxWidth: "75vw",
          height: '95%',
          width: '100%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
      });
      // }else{Swal.fire("Bill Generated")}
    }
    else if (m == "Refund of Advance") {


      this.advanceDataStored.storage = new AdvanceDetailObj(contact);
      this._IpSearchListService.populateForm2(contact);
      // if (!contact.IsBillGenerated) {
      const dialogRef = this._matDialog.open(IPRefundofAdvanceComponent,
        {
          maxWidth: "75vw",
          maxHeight: "95%", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        // this.getAdmittedPatientList();
      });
      // }else Swal.fire("Bill already Generated")
    }
    else if (m == "Update Company Information") {
      let m_data = {
        RegNo: contact.RegNo,
        RegId: contact.RegID,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_ID: contact.OPD_IPD_Id,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
        opD_IPD_Typec: contact.opD_IPD_Type,
        CompanyName: contact.CompanyName
      }

      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm2(m_data);
      // if (!contact.IsBillGenerated) {
      const dialogRef = this._matDialog.open(CompanyInformationComponent,
        {
          maxWidth: "75vw",
          maxHeight: "99%", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        // this.getAdmittedPatientList();
      });
      // }else Swal.fire("Bill already Generated")
    }
    else if (m == "Bill") {
      console.log(" This is for  Bill pop : " + m);
   
      this.advanceDataStored.storage = new AdvanceDetailObj(contact);

      if (!contact.IsBillGenerated) {

        const dialogRef = this._matDialog.open(IPBillingComponent,
          {
            maxWidth: "90%",
            width: '98%',
            height: '95%',
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
        //   this.getAdmittedPatientList();
        });
      } else { Swal.fire("Final Bill Already Generated") }
    }
    else if (m == "Discharge") {
      console.log(contact);
      if (!contact.IsDischarged) {


        this.advanceDataStored.storage = new AdvanceDetailObj(contact);
        this._IpSearchListService.populateForm(contact);
        const dialogRef = this._matDialog.open(DischargeComponent,
          {
            maxWidth: "85vw",
            height: '400px',
            width: '100%',
            data: {
              Obj: contact
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
        //   this.getAdmittedPatientList();
        });
      } else {
        console.log(contact)
        Swal.fire({
          title: 'Patient Already Discharged Do you Want to Edit',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'OK',

        }).then((result) => {

          if (result.isConfirmed) {

            this.advanceDataStored.storage = new AdvanceDetailObj(contact);
            this._IpSearchListService.populateForm(contact);
            const dialogRef = this._matDialog.open(DischargeComponent,
              {
                maxWidth: "85vw",
                height: '400px',
              });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed - Insert Action', result);

            });
          }
          else {

          }
        });

      }
    } 
     else if (m == "Patient Feedback") {
      console.log(contact);
      if (!contact.IsDischarged) {


        this.advanceDataStored.storage = new AdvanceDetailObj(contact);
        this._IpSearchListService.populateForm(contact);
        const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
          {
           maxWidth: "95vw",
          maxHeight: "115vh", width: '100%', height: "100%",
            data: {
              Obj: contact
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
        //   this.getAdmittedPatientList();
        });
      } else {
        console.log(contact)
        Swal.fire({
          title: 'Patient feedBack Edit',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'OK',

        }).then((result) => {

          if (result.isConfirmed) {

            this.advanceDataStored.storage = new AdvanceDetailObj(contact);
            this._IpSearchListService.populateForm(contact);
            const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
              {
                maxWidth: "95vw",
                maxHeight: "115vh", width: '100%', height: "100%",
                  data: {
                    Obj: contact
                  }
              });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed - Insert Action', result);

            });
          }
         
        });

      }
    }
    else if (m == "Bed Transfer") {
      console.log(" This is for BedTransfer pop : " + m);

      this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
      this._IpSearchListService.populateForm(contact);
      console.log(contact)
      const dialogRef = this._matDialog.open(BedTransferComponent,
        {
          maxWidth: "85vw",
          maxHeight: "56vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        //  this.getAdmittedPatientList();
      });
    } else if (m == "Medical CasePaper") {
      console.log(" This is for Case Paper pop : " + m);
      this.advanceDataStored.storage = new AdvanceDetailObj(contact);
      this._IpSearchListService.populateForm(contact);

      // const dialogRef = this._matDialog.open(NewCasepaperComponent,
      //   {
      //     maxWidth: "95vw",
      //     maxHeight: "55vh", width: '100%', height: "100%"
      //   });
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed - Insert Action', result);
      //   this.getAdmittedPatientList();
      // });
    }


  }


  onClear() {
    // this._IpSearchListService.myFilterform.reset(
    //   {
    //     start: [],
    //     end: []
    //   }
    // );
    this._IpSearchListService.myFilterform.reset();
    this._IpSearchListService.myFilterform.get("IsDischarge").setValue(0);
    this._IpSearchListService.myFilterform.get("FirstName").setValue('');
    this._IpSearchListService.myFilterform.get("MiddleName").setValue('');
    this._IpSearchListService.myFilterform.get("LastName").setValue('');
    // this.getAdmittedPatientList();
  }


  private filterDoctor() {

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

    this.filtereddoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  private filterWard() {

    if (!this.wardNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.wardFilterCtrl.value;
    if (!search) {
      this.filteredward.next(this.wardNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredward.next(
      this.wardNameCmbList.filter(bank => bank.RoomName.toLowerCase().indexOf(search) > -1)
    );
  }


  getWardNameCombo() {
    this._IpSearchListService.getWardNameCombo().subscribe(data => {
      this.wardNameCmbList = data;
      this.filteredward.next(this.wardNameCmbList.slice());
    });
  }

  getAdmittedDoctorCombo() {
    // this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
    //   this.doctorNameCmbList = data;
    //   this.filtereddoctor.next(this.doctorNameCmbList.slice());
    // });
  }

  IsDischarge: any;
  onChangeIsactive(SiderOption) {
    this.IsDischarge = SiderOption.checked;
    if (SiderOption.checked == true) {
      this._IpSearchListService.myFilterform.get('IsDischarge').setValue(1);
      this._IpSearchListService.myFilterform.get('start').setValue((new Date()).toISOString());
      this._IpSearchListService.myFilterform.get('end').setValue((new Date()).toISOString());
    }
    else {
      this._IpSearchListService.myFilterform.get('IsDischarge').setValue(0);
      this._IpSearchListService.myFilterform.get('start').setValue(''),
        this._IpSearchListService.myFilterform.get('end').setValue('')
    }
  }



  printDischargeslip(contact) {
    console.log(contact)
    this._IpSearchListService.getIpDischargeReceipt(
      contact.AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "CHECK OUT SLIP Viewer"
          }
        });
    });
  }


  printDischargesummary(contact) {

    this._IpSearchListService.getIpDischargesummaryReceipt(
      contact.AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Discharge SummaryViewer"
          }
        });
    });
  }

  
}



export class Bed {
  BedId: Number;
  BedName: string;

  /**
   * Constructor
   *
   * @param Bed
   */
  constructor(Bed) {
    {
      this.BedId = Bed.BedId || '';
      this.BedName = Bed.BedName || '';
    }
  }
}


export class AdvanceDetail {
  AdvanceDetailID: Number;
  Date: Date;
  Time: Time;
  AdvanceId: number;
  RefId: number;
  TransactionID: number;
  OPD_IPD_Id: number;
  OPD_IPD_Type: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  ReasonOfAdvanceId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  Reason: string;

  /**
  * Constructor
  *
  * @param AdvanceDetail
  */
  constructor(AdvanceDetail) {
    {
      this.AdvanceDetailID = AdvanceDetail.AdvanceDetailID || '';
      this.Date = AdvanceDetail.Date || '';
      this.Time = AdvanceDetail.Time || '';
      this.AdvanceId = AdvanceDetail.AdvanceId || '';
      this.RefId = AdvanceDetail.RefId || '';
      this.TransactionID = AdvanceDetail.TransactionID || '';
      this.OPD_IPD_Id = AdvanceDetail.OPD_IPD_Id || '';
      this.OPD_IPD_Type = AdvanceDetail.OPD_IPD_Type || '';
      this.AdvanceAmount = AdvanceDetail.AdvanceAmount || '';
      this.UsedAmount = AdvanceDetail.UsedAmount || '';
      this.BalanceAmount = AdvanceDetail.BalanceAmount || '';
      this.RefundAmount = AdvanceDetail.RefundAmount || '';
      this.ReasonOfAdvanceId = AdvanceDetail.ReasonOfAdvanceId || '';
      this.AddedBy = AdvanceDetail.AddedBy || '';
      this.IsCancelled = AdvanceDetail.IsCancelled || '';
      this.IsCancelledBy = AdvanceDetail.IsCancelledBy || '';
      this.IsCancelledDate = AdvanceDetail.IsCancelledDate || '';
      this.Reason = AdvanceDetail.Reason || '';
    }
  }
}

export class AdvanceDetailObj {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  AgeMonth: number;
  AgeDay: number;
  ClassId: number;
  ClassName: String;
  TariffName: String;
  TariffId: number;
  IsDischarged: boolean;
  opD_IPD_Type: number;
  PatientType: any;
  PatientTypeID: any;
  VisitId: any;
  AdmissionId: number;
  IPDNo: any;
  DoctorId: number;
  BedId: any;
  BedName: String;
  WardName: String;
  CompanyId: string;
  SubCompanyId: any;
  IsBillGenerated: any;
  UnitId: any;
  RegId: number;
  RefId: number;
  OPD_IPD_ID: any;
  storage: any;
  IsMLC: any;
  NetPayableAmt: any;
  OPD_IPD_Id: any;
  RegID: any;
  CompanyName: any;
  RoomName: any;
  DOA: any;
  DOD: any;
  DepartmentName: any;
  RefDocName: any;
  GenderName: any;
  DocNameID: any;

  PolicyNo: any;
  MemberNo: any; 
  ClaimNo: any;
  CompBillNo: any;
  CompBillDate: any;
  CompDiscount: any;
  CompDisDate: any;
  C_BillNo: any;
  C_FinalBillAmt: any;
  C_DisallowedAmt: any;
  HDiscAmt: any;
  C_OutsideInvestAmt: any;
  RecoveredByPatient: any;
  H_ChargeAmt: any;
  H_AdvAmt: any;
  H_BillId: any;
  H_BillDate: any;
  H_BillNo: any;
  H_TotalAmt: any;
  H_DiscAmt: any;
  H_NetAmt: any;
  H_PaidAmt: any;
  H_BalAmt: any;
  MobileNo: any;
  PatientAge: any;
  AdvTotalAmount:any;
  /**
  * Constructor
  *
  * @param AdvanceDetailObj
  */
  constructor(AdvanceDetailObj) {
    {
      this.RegNo = AdvanceDetailObj.RegNo || '';
      this.RegId = AdvanceDetailObj.RegId || '';
      this.AdmissionID = AdvanceDetailObj.AdmissionID || '';
      this.PatientName = AdvanceDetailObj.PatientName || '';
      this.Doctorname = AdvanceDetailObj.Doctorname || '';
      this.AdmDateTime = AdvanceDetailObj.AdmDateTime || '';
      this.AgeYear = AdvanceDetailObj.AgeYear || '';
      this.ClassId = AdvanceDetailObj.ClassId || '';
      this.ClassName = AdvanceDetailObj.ClassName || '';
      this.TariffName = AdvanceDetailObj.TariffName || '';
      this.TariffId = AdvanceDetailObj.TariffId || '';
      this.IsDischarged = AdvanceDetailObj.IsDischarged || 0;
      this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type | 0;
      this.PatientType = AdvanceDetailObj.PatientType || 0;
      this.VisitId = AdvanceDetailObj.VisitId || '';
      this.AdmissionId = AdvanceDetailObj.AdmissionId || '';
      this.IPDNo = AdvanceDetailObj.IPDNo || '';
      this.BedName = AdvanceDetailObj.BedName || '';
      this.WardName = AdvanceDetailObj.WardName || '';
      this.CompanyId = AdvanceDetailObj.CompanyId || '';
      this.IsBillGenerated = AdvanceDetailObj.IsBillGenerated || 0;
      this.UnitId = AdvanceDetailObj.UnitId || 0;
      this.RefId = AdvanceDetailObj.RefId || 0;
      this.DoctorId = AdvanceDetailObj.DoctorId || 0;
      this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
      this.IsMLC = AdvanceDetailObj.IsMLC || 0;
      this.BedId = AdvanceDetailObj.BedId || 0;
      this.SubCompanyId = AdvanceDetailObj.SubCompanyId || 0;
      this.PatientTypeID = AdvanceDetailObj.PatientTypeID || 0;
      this.NetPayableAmt = AdvanceDetailObj.NetPayableAmt || 0;
      this.OPD_IPD_Id = AdvanceDetailObj.OPD_IPD_Id || 0;
      this.RegID = AdvanceDetailObj.RegID || 0;
      this.CompanyName = AdvanceDetailObj.CompanyName || ''
      this.RoomName = AdvanceDetailObj.RoomName || ''
      this.DOA = AdvanceDetailObj.DOA || ''
      this.DOD = AdvanceDetailObj.DOD || ''
      this.DepartmentName = AdvanceDetailObj.DepartmentName || ''
      this.AgeMonth = AdvanceDetailObj.AgeMonth || ''
      this.AgeDay = AdvanceDetailObj.AgeDay || ''
      this.RefDocName = AdvanceDetailObj.RefDocName || ''
      this.GenderName = AdvanceDetailObj.GenderName || ''
      this.DocNameID = AdvanceDetailObj.DocNameID | 0
      this.MobileNo = AdvanceDetailObj.MobileNo || ''
      this.AdvTotalAmount = AdvanceDetailObj.AdvTotalAmount || 0
    }
  }
}


export class ChargesList {
  ChargesId: number;
  ServiceId: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId: number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology: boolean;
  IsRadiology: boolean;
  ClassId: number;
  ClassName: string;
  ChargesAddedName: string;
  BalanceQty: any;
  IsStatus: any;
  extMobileNo: any;
  ConcessionPercentage: any;
  constructor(ChargesList) {
    this.ChargesId = ChargesList.ChargesId || '';
    this.ServiceId = ChargesList.ServiceId || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.Price = ChargesList.Price || '';
    this.Qty = ChargesList.Qty || '';
    this.TotalAmt = ChargesList.TotalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.NetAmount = ChargesList.NetAmount || '';
    this.DoctorId = ChargesList.DoctorId || 0;
    this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
    this.ChargesDate = ChargesList.ChargesDate || '';
    this.IsPathology = ChargesList.IsPathology || '';
    this.IsRadiology = ChargesList.IsRadiology || '';
    this.ClassId = ChargesList.ClassId || 0;
    this.ClassName = ChargesList.ClassName || '';
    this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    this.BalanceQty = ChargesList.BalanceQty || 0;
    this.IsStatus = ChargesList.IsStatus || 0;
    this.extMobileNo = ChargesList.extMobileNo || ''
    this.ConcessionPercentage = ChargesList.ConcessionPercentage || ''
  }
}
export class AdvanceHeader {
  AdvanceId: Number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  AdvanceAmount: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;

  /**
  * Constructor
  *
  * @param AdvanceHeader
  */
  constructor(AdvanceHeader) {
    {
      this.AdvanceId = AdvanceHeader.AdvanceId || '';
      this.Date = AdvanceHeader.Date || '';
      this.RefId = AdvanceHeader.RefId || '';
      this.OPD_IPD_Type = AdvanceHeader.OPD_IPD_Type || '';
      this.OPD_IPD_Id = AdvanceHeader.OPD_IPD_Id || '';
      this.AdvanceAmount = AdvanceHeader.AdvanceAmount || '';
      this.AdvanceUsedAmount = AdvanceHeader.AdvanceUsedAmount || '';
      this.BalanceAmount = AdvanceHeader.BalanceAmount || '';
      this.AddedBy = AdvanceHeader.AddedBy || '';
      this.IsCancelled = AdvanceHeader.IsCancelled || '';
      this.IsCancelledBy = AdvanceHeader.IsCancelledBy || '';
      this.IsCancelledDate = AdvanceHeader.IsCancelledDate || '';

    }
  }
}
export class Payment {
  PaymentId: Number;
  BillNo: number;
  ReceiptNo: string;
  PaymentDate: Date;
  PaymentTime: Time;
  CashPayAmount: number;
  ChequePayAmount: number;
  ChequeNo: string;
  BankName: string;
  ChequeDate: Date;
  CardPayAmount: number;
  CardNo: string;
  CardBankName: string;
  CardDate: Date;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  TransactionType: number;
  Remark: string;
  AddBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  CashCounterId: number;
  IsSelfORCompany: number;
  CompanyId: number;
  NEFTPayAmount: number;
  NEFTNo: string;
  NEFTBankMaster: string;
  NEFTDate: Date;
  PayTMAmount: number;
  PayTMTranNo: string;
  PayTMDate: Date;

  /**
  * Constructor
  *
  * @param Payment
  */
  constructor(Payment) {
    {
      this.PaymentId = Payment.PaymentId || '';
      this.BillNo = Payment.BillNo || '';
      this.ReceiptNo = Payment.ReceiptNo || '';
      this.PaymentDate = Payment.PaymentDate || '';
      this.PaymentTime = Payment.PaymentTime || '';
      this.CashPayAmount = Payment.CashPayAmount || '';
      this.ChequePayAmount = Payment.ChequePayAmount || '';
      this.ChequeNo = Payment.ChequeNo || '';
      this.BankName = Payment.BankName || '';
      this.ChequeDate = Payment.ChequeDate || '';
      this.CardPayAmount = Payment.CardPayAmount || '';
      this.CardNo = Payment.CardNo || '';
      this.CardBankName = Payment.CardBankName || '';
      this.CardDate = Payment.CardDate || '';
      this.AdvanceUsedAmount = Payment.AdvanceUsedAmount || '';
      this.AdvanceId = Payment.AdvanceId || '';
      this.RefundId = Payment.RefundId || '';
      this.TransactionType = Payment.TransactionType || '';
      this.Remark = Payment.Remark || '';
      this.AddBy = Payment.AddBy || '';
      this.IsCancelled = Payment.IsCancelled || '';
      this.IsCancelledBy = Payment.IsCancelledBy || '';
      this.IsCancelledDate = Payment.IsCancelledDate || '';
      this.CashCounterId = Payment.CashCounterId || '';
      this.IsSelfORCompany = Payment.IsSelfORCompany || '';
      this.CompanyId = Payment.CompanyId || '';
      this.NEFTPayAmount = Payment.NEFTPayAmount || '';
      this.NEFTNo = Payment.NEFTNo || '';
      this.NEFTBankMaster = Payment.NEFTBankMaster || '';
      this.NEFTDate = Payment.NEFTDate || '';
      this.PayTMAmount = Payment.PayTMAmount || '';
      this.PayTMTranNo = Payment.PaymentId || '';
      this.PayTMDate = Payment.PayTMDate || '';


    }
  }

}

export class Discharge {
  DischargeId: Number;
  AdmissionID: Number;
  DischargeDate: Date;
  DischargeTime: Date;
  DischargeTypeId: string;
  DischargedDocId: number;
  AddedBy: number;

  /**
  * Constructor
  *
  * @param Discharge
  */
  constructor(Discharge) {
    {
      this.DischargeId = Discharge.DischargeId || '';
      this.AdmissionID = Discharge.AdmissionID || '';
      this.DischargeDate = Discharge.DischargeDate || '';
      this.DischargeTime = Discharge.DischargeTime || '';
      this.DischargeTypeId = Discharge.DischargeTypeId || '';
      this.DischargedDocId = Discharge.DischargedDocId || '';
      this.AddedBy = Discharge.AddedBy || '';

    }
  }
}


export class Bedtransfer {
  // BedId : Number;
  FromTime: Date;
  FromDate: Date;
  FromBedId: number;
  FromClassId: number;
  FromWardID: number;
  ToDate: Date;
  ToTime: Date;
  ToBedId: number;
  ToWardID: Number;
  ToClassId: Number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: Number;

  /**
  * Constructor
  *
  * @param Bedtransfer
  */
  constructor(Bedtransfer) {
    {
      this.FromTime = Bedtransfer.FromTime || '';
      this.FromDate = Bedtransfer.FromDate || '';
      this.FromBedId = Bedtransfer.FromBedId || '';
      this.FromClassId = Bedtransfer.FromClassId || '';
      this.FromWardID = Bedtransfer.FromWardID || '';
      this.ToDate = Bedtransfer.ToDate || '';
      this.ToTime = Bedtransfer.ToTime || '';
      this.ToBedId = Bedtransfer.ToBedId || '';
      this.ToClassId = Bedtransfer.ToClassId || '';
      this.ToWardID = Bedtransfer.ToWardID || '';
      this.IsCancelled = Bedtransfer.IsCancelled || '';
      this.IsCancelledBy = Bedtransfer.IsCancelledBy || '';
      this.AddedBy = Bedtransfer.AddedBy || '';

    }
  }
}