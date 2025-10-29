import { Component, Inject, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { AdministrationService } from '../administration.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatRadioChange } from '@angular/material/radio';
import { BillDateUpdateComponent } from '../cancellation/bill-date-update/bill-date-update.component';
import Swal from 'sweetalert2';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DateUpdateComponent } from '../paymentmodechanges/date-update/date-update.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreditBilldetail } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import {
  Bill

} from 'app/main/ipd/ip-search-list/ip-billing/ip-billing.component';
import { AdvanceDetail, Payment } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { fuseAnimations } from '@fuse/animations';
import { BillRefundMaster } from 'app/main/ipd/ip-search-list/ip-refundof-bill/ip-refundof-bill.component';
import { VisitMaster1 } from 'app/main/opd/appointment-list/appointment-list.component';
import { BillDetails } from 'app/main/ipd/ip-search-list/company-bill/company-bill.component';
import { EditPaymentComponent } from '../paymentmodechanges/edit-payment/edit-payment.component';
import { AdmissiontaskComponent } from './admissiontask/admissiontask.component';
import { AdmissionModule } from 'app/main/ipd/Admission/admission/admission.module';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { EditConsultantDoctorComponent } from 'app/main/opd/appointment-list/edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefranceDoctorComponent } from 'app/main/opd/appointment-list/edit-refrance-doctor/edit-refrance-doctor.component';
import { AppointmenttaskComponent } from './appointmenttask/appointmenttask.component';

@Component({
  selector: 'app-new-administrative-task',
  templateUrl: './new-administrative-task.component.html',
  styleUrls: ['./new-administrative-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewAdministrativeTaskComponent {

  @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;

  myForm: FormGroup;
  vRegNo: any = "0";
  vPatientName: any;
  vAdmissionDate: any;
  vMobileNo: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
  vAdmissionID: any;
  vClassId: any;
  AdmissionId: any
  vRegId: any
  vbillNo: any

  OPIPType = 1
  //
  AdmissionTaskForm: FormGroup
  date: any;
  dateTimeString: any;
  isTimeChanged: boolean = false;
  dateLabel: string = 'Admission Date';
  timeLabel: string = 'Admission Time';

  isDatePckrDisabled: boolean = false;


  displayedColumns: string[] = [
    // 'action1',
    'VisitId',
    'VisitTime',
    'OPDNo',
    'DoctorName',
    'action'
  ];

  displayedColumns5: string[] = [
    // 'action1',
    'IsBillGenerated',
    'IsDischarged',
    'AdmissionID',
    'AdmissionTime',
    'RegID',
    'DoctorName',
    'IPDNo',
    // 'DischargeTime',
    'action'
  ];


  displayedColumns1: string[] = [
    'IsCancelled',
    'billDate',
    'pbillNo',
    'totalAmt',
    'netPayableAmt',

    'action'
  ];


  displayedColumns2: string[] = [
    // 'action1',
    // 'PaymentId',
    'paymentDate',
    'ReceiptNo',

    'action'
  ];


  displayedColumns3: string[] = [
    'action1',
    // 'PatientTypeId',
    'date',
    'advanceNo',
    'regNo',
    'patientName',
    'advanceAmount',
    'balanceAmount',
    // 'refundAmount',
    'action'
  ];

  displayedColumns4: string[] = [
    'refundTime',
    'paymentTime',
    'regNo',
    'patientName',
    'refundAmount',
    'userName',
    'action'
  ];

  dataSource = new MatTableDataSource<VisitMaster1>();
  dataSource1 = new MatTableDataSource<AdmissionPersonlModel>();

  dataSourceBill = new MatTableDataSource<Bill>();
  dataSourcepayment = new MatTableDataSource<Payment>();
  dataSourceAdvance = new MatTableDataSource<AdvanceDetail>();
  dataSourceRefund = new MatTableDataSource<BillRefundMaster>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


  constructor(

    public _AdministrativetaskService: AdministrationService,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe, private _fuseSidebarService: FuseSidebarService,
  ) {
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.AdmissionTaskForm.get('AdmissionTime').setValue(this.now);
        if (this.AdmissionTaskForm.get('AdmissionTime'))
          this.AdmissionTaskForm.get('AdmissionTime').setValue(this.now);
      }
    }, 1);
  }
  opiptype = true
  ngOnInit(): void {

    this.myForm = this.createMyForm();
    this.myForm.markAllAsTouched();

    this.AdmissionTaskForm = this.CreateAdmissionForm()
    this.AdmissionTaskForm.get('RegID').setValue('');
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);

  }


  CreateAdmissionForm() {
    return this.formBuilder.group({
      RegID: '',
      Op_ip_id: '1',
      // IsDischargedit: 0, 
      // IsIPDnoEdit: 0,
      AdmissionDate: [(new Date()).toISOString(), Validators.required],
      AdmissionTime: [''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      NewIpdNo: ['', Validators.required]
    });
  }

  createMyForm() {
    return this.formBuilder.group({
      RegID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opiptype: ['1'],
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    })
  }

  onChangeRadio(event) {


    if (this.myForm.get('opiptype').value == "0") {
      this.opiptype = false
      this.OPIPType = 0
      this.myForm.get('RegID').setValue('')
      this.dataSource.data = []
      this.dataSource1.data = []
      this.dataSourceBill.data = []
      this.dataSourcepayment.data = []

    }
    else {
      this.opiptype = true
      this.OPIPType = 1
      this.myForm.get('RegID').setValue('')
      this.dataSource.data = []
      this.dataSource1.data = []
      this.dataSourceBill.data = []
      this.dataSourcepayment.data = []
    }
  }

  getOpPatientdata() {

    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "RegId",
          "fieldValue": String(this.vRegId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(this.OPIPType),
          "opType": "Equals"
        }
      ],
      "mode": "Admin_Visitlist"
    }

    console.log(SelectQuery);

    this._AdministrativetaskService.getPatientListOP(SelectQuery).subscribe(Visit => {
      console.log(Visit)
      if (Visit) {

        if (!this.OPIPType) {
          this.dataSource.data = Visit as VisitMaster1[];
        }
        else {
          this.dataSource1.data = Visit as AdmissionPersonlModel[];
          console.log(this.dataSource1.data)
        }
      }
    });
  }

  VistId = 0
  GetBillData(element) {


    if (element.VisitId)
      this.VistId = element.VisitId
    else
      this.VistId = element.AdmissionID


    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "VisitId",
          "fieldValue": String(this.VistId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(this.OPIPType),
          "opType": "Equals"
        }
      ],
      "mode": "Admin_VisitWiseBilllist"
    }

    console.log(SelectQuery);
    this._AdministrativetaskService.getBillDetailList(SelectQuery).subscribe(data => {
      this.dataSourceBill.data = data as Bill[];
      console.log(this.dataSourceBill.data)

    });
  }


  GetPaymentData(element) {

    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(element.BillNo),
          "opType": "Equals"
        }
      ],
      "mode": "Admin_VisitBillWisePaymentlist"
    }

    console.log(SelectQuery);
    this._AdministrativetaskService.getPaymentDetailList(SelectQuery).subscribe(data => {
      this.dataSourcepayment.data = data as Payment[];
      console.log(this.dataSourcepayment.data)

    });
  }

  //   getOPBilldata() {
  //     this.fromDate = this.datePipe.transform(this.myForm.get('startdate').value,"yyyy-MM-dd")
  //     this.toDate = this.datePipe.transform(this.myForm.get('enddate').value,"yyyy-MM-dd")
  // 

  //     var m_data = {
  //       "first": 0,
  //       "rows": 20,
  //       "sortField": "BillNo",
  //       "sortOrder": 0,
  //       "filters": [
  //         { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //         { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //         { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual }, //year from 2021 to 2025
  //         { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
  //         { fieldName: "Reg_No", fieldValue: this.vRegNo, opType: OperatorComparer.Equals },
  //         { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //         { fieldName: "CompanyId", fieldValue: '0', opType: OperatorComparer.Equals }
  //       ],
  //       "Columns": [],
  //       "exportType": "JSON"
  //     }

  //     console.log(m_data);
  //     this._AdministrativetaskService.OPBillDetailList(m_data).subscribe(Visit => {
  //       this.dataSourceBill.data = Visit.data as Bill[];
  //       console.log("ResultList:", this.dataSourceBill.data)

  //     });
  //   }


  // getIPBilldata() {

  //   

  //      this.fromDate = this.datePipe.transform(this.myForm.get('startdate').value,"yyyy-MM-dd")
  //   this.toDate = this.datePipe.transform(this.myForm.get('enddate').value,"yyyy-MM-dd")
  //   var m_data = {
  //     "first": 0,
  //     "rows": 20,
  //     "sortField": "BillNo",
  //     "sortOrder": 0,
  //     "filters": [
  //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
  //       { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
  //       { fieldName: "Reg_No", fieldValue: this.vRegNo, opType: OperatorComparer.Equals },
  //       { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith }, //13
  //       { fieldName: "IsIntrimOrFinal", fieldValue: "2", opType: OperatorComparer.Equals }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }

  //   console.log(m_data);
  //   this._AdministrativetaskService.IPBillDetailList(m_data).subscribe(Visit => {
  //     this.dataSourceBill.data = Visit.data as Bill[];
  //     console.log("ResultList:", this.dataSourceBill.data)

  //   });
  // }


  // getOPpaymentdata() {
  //     this.fromDate = this.datePipe.transform(this.myForm.get('startdate').value,"yyyy-MM-dd")
  //   this.toDate = this.datePipe.transform(this.myForm.get('enddate').value,"yyyy-MM-dd")
  //   var m_data = {
  //     "first": 0,
  //     "rows": 20,
  //     "sortField": "RegNo",
  //     "sortOrder": 0,
  //     "filters": [
  //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //       { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  //       { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
  //       { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
  //       { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }

  //   console.log(m_data);
  //   this._AdministrativetaskService.OPPaymentList(m_data).subscribe(Visit => {
  //     this.dataSourcepayment.data = Visit.data as Payment[];
  //     console.log("ResultList:", this.dataSourcepayment.data)

  //   });
  // }
  // ifromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  // itoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  // getIPpaymentdata() {

  //   this.ifromDate = this.myForm.get('startdate').value
  //   this.itoDate = this.myForm.get('enddate').value

  //   var m_data = {
  //     "first": 0,
  //     "rows": 20,
  //     "sortField": "PaymentId",
  //     "sortOrder": 0,
  //     "filters": [
  //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "From_Dt", fieldValue: this.ifromDate, opType: OperatorComparer.Equals },
  //       { fieldName: "To_Dt", fieldValue: this.itoDate, opType: OperatorComparer.Equals },
  //       { fieldName: "Reg_No", fieldValue:this.vRegNo, opType: OperatorComparer.Equals },
  //       { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
  //       { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Equals }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }

  //   console.log(m_data);
  //   this._AdministrativetaskService.IPPaymentList(m_data).subscribe(Visit => {
  //     this.dataSourcepayment.data = Visit.data as Payment[];
  //     console.log("ResultList:", this.dataSourcepayment.data)

  //   });
  // }
  // getAdvancedata() {

  //   this.fromDate = this.myForm.get('startdate').value
  //   this.toDate = this.myForm.get('enddate').value


  //   var m_data = {
  //     "first": 0,
  //     "rows": 20,
  //     "sortField": "RegID",
  //     "sortOrder": 0,
  //     "filters": [
  //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //       { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  //       { fieldName: "Reg_No", fieldValue: this.vRegNo, opType: OperatorComparer.Equals },
  //       { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.StartsWith }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }

  //   console.log(m_data);
  //   this._AdministrativetaskService.AdvanceList(m_data).subscribe(Visit => {
  //     this.dataSourceAdvance.data = Visit.data as AdvanceDetail[];
  //     console.log("ResultList:", this.dataSourceAdvance.data)

  //   });
  // }

  // getRefunddata() {
  //   
  //   var m_data = {
  //     "first": 0,
  //     "rows": 20,
  //     "sortField": "RegNo",
  //     "sortOrder": 0,
  //     "filters": [
  //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  //       { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //       { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  //       { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }

  //   console.log(m_data);
  //   this._AdministrativetaskService.refundList(m_data).subscribe(Visit => {
  //     this.dataSourceRefund.data = Visit.data as BillRefundMaster[];
  //     console.log("ResultList:", this.dataSourceBill.data)

  //   });
  // }
  DischargeCancel(contact) {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-Warning',
      });
      return
    }

    Swal.fire({
      title: 'Do you want to cancel the Discharge ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {

        let SubmitDate = {
          "admissionID": contact.AdmissionID
        }
        console.log(SubmitDate)
        this._AdministrativetaskService.SaveDischargeCancel(SubmitDate).subscribe(response => {
          // this.resetform();
        });
      }
    })
  }

  EditConsultant(contact) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
      {
        maxWidth: "90vw",
        height: "430px",
        width: "80%",
        data: contact
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getOpPatientdata()
    });
  }


  EditRefDoctor(contact) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(EditRefranceDoctorComponent,
      {
        maxWidth: "90vw",
        height: "430px",
        width: "80%",
        data: contact
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getOpPatientdata()
    });
  }
  VisitDateUpdate(contact) {
    console.log(contact)
    const dialogRef = this._matDialog.open(AppointmenttaskComponent,
      {
        maxHeight: "35vh",
        maxWidth: '90vh',
        width: '100%',
        data: contact
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  PaymentDate(contact) {
    console.log(contact)
    const dialogRef = this._matDialog.open(DateUpdateComponent,
      {
        maxHeight: "35vh",
        maxWidth: '90vh',
        width: '100%',
        data: contact
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  // Admissiontask(contact) {
  //   console.log(contact)
  //   const dialogRef = this._matDialog.open(AdmissiontaskComponent,
  //     {
  //       maxHeight: "35vh",
  //       maxWidth: '90vh',
  //       width: '100%',
  //       data: contact
  //     });
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  resultsLength = 0;

  BillCancle(contact) {
    debugger
    if (this.myForm.get('opiptype').value == "0")
      this.BillCancelOP(contact)
    else
      this.BillCancelIP(contact)
  }

  BillCancelOP(contact) {
    console.log("Data:", contact)
    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {

      if (result.isConfirmed) {
        let SubmitDate = {
          "billNo": contact.BillNo || 0
        }
        debugger
        console.log("Json:", SubmitDate)
        this._AdministrativetaskService.OpCancelBill(SubmitDate).subscribe(response => {
          // this.GetBillData()
        });
      }
    })

  }

  BillCancelIP(contact) {

    console.log("Data:", contact)
    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {

      if (result.isConfirmed) {
        let SubmitDate = {
          "billNo": contact.BillNo || 0
        }
        debugger
        console.log("Json:", SubmitDate)
        this._AdministrativetaskService.IpCancelBill(SubmitDate).subscribe(response => {
          //  this.grid.bindGridData();
        });
      }
    })

  }

  CancelAdvance(contact) {
    console.log("Data:", contact)

    Swal.fire({
      title: 'Do you want to cancel the Advance',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {

      if (result.isConfirmed) {
        let SubmitDate = {
          "advanceId": contact.advanceId || 0,
          "advanceDetailId": contact.advanceDetailID || 0,
          "addedBy": contact.addedBy || 0,
          "advanceAmount": contact.advanceAmount || 0
        }

        console.log(SubmitDate)
        this._AdministrativetaskService.SaveCancelAdvance(SubmitDate).subscribe(response => {
          //  this.grid1.bindGridData();
        });
      }
    })

  }



  Billdateupdate(row) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    console.log(row)
    let that = this;
    const dialogRef = this._matDialog.open(BillDateUpdateComponent,
      {
        maxHeight: "35vh",
        maxWidth: '90vh',
        width: '100%',
        data: {
          data: row,
          Id: 4
        }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  onEdit(row) {
    console.log(row)
    const dialogRef = this._matDialog.open(EditPaymentComponent,
      {
        height: "99%",
        width: '80%',
        data: {
          registerObj: row,
          FromName: "IP-PaymentModeChange"
        },

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.grid.bindGridData();

    });
  }
  registerObj = new RegInsert({});

  // getSelectedObjIP(obj) {
  //   console.log(obj)
  //   if ((obj.regID ?? 0) > 0) {
  //     console.log("Discharge patient:", obj)
  //     this.vRegNo = obj.regNo
  //     this.vRegId = obj.regID

  //     this.vDoctorName = obj.doctorName
  //     this.vDepartment = obj.departmentName
  //     this.vAdmissionDate = obj.admissionDate
  //     this.vAdmissionTime = obj.admissionTime
  //     this.vIPDNo = obj.ipdNo
  //     this.vAge = obj.age
  //     this.vAgeMonth = obj.ageMonth
  //     this.vAgeDay = obj.ageDay
  //     this.vGenderName = obj.genderName
  //     this.vRefDocName = obj.refDoctorName
  //     this.vRoomName = obj.roomName
  //     this.vBedName = obj.bedName
  //     this.vPatientType = obj.patientType
  //     this.vTariffName = obj.tariffName
  //     this.vCompanyName = obj.companyName
  //     let nameField = obj.formattedText;
  //     let extractedName = nameField.split('|')[0].trim();
  //     this.vPatientName = extractedName;
  //     this.AdmissionId = obj.admissionID
  //     this.getOpPatientdata()

  //   }


  // }

  // getSelectedObjOP(obj) {
  //   console.log(obj);


  //   if (obj) {

  //     setTimeout(() => {
  //       this._AdministrativetaskService.getRegistraionById(obj.regId).subscribe((response) => {
  //         if (response) {
  //           this.registerObj = response;
  //           this.vRegId = this.registerObj?.regId
  //           this.vRegNo = this.registerObj?.regNo
  //           this.vPatientName = this.registerObj?.firstName + " " + this.registerObj?.middleName + " " + this.registerObj?.lastName
  //           this.vbillNo = this.registerObj.billNo;
  //           this.getOpPatientdata()
  //           console.log(response)

  //         }
  //       });
  //     }, 500);
  //   }

  // }

  getSelectedObj(obj) {
    this.vRegId = obj.value;
    this.vRegNo = obj.regNo
    this.registerObj = obj
    this.getOpPatientdata()
  }


  //Admission task
  public now: Date = new Date();
  OnAdmDateTimeUpdate() {
    // if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
    //   this.toastr.success('Please select patient', 'Save !', {
    //     toastClass: 'tostr-tost custom-toast-success',
    //   });
    //   return
    // }
    Swal.fire({
      title: 'Do you want to Update Admission Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {

        const formattedDate = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.AdmissionTaskForm.get('AdmissionDate').setValue(formattedDate);
        // this.AdmissionTaskForm.get('AdmissionTime').setValue(formattedDate + ' ' + formattedTime);
        let Admissiontime = formattedDate + ' ' + formattedTime



        debugger
        if (!this.AdmissionTaskForm.invalid) {
          var data = {
            'admissionID': this.AdmissionId,
            'admissionDate': formattedDate,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd"),
            'admissionTime': Admissiontime,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionTime').value, 'yyyy-MM-dd HH:mm'),
            'ipdno': this.AdmissionTaskForm.get('NewIpdNo').value
          }
          console.log(data);
          this._AdministrativetaskService.getDateTimeChange(data).subscribe(response => {
            // this.resetform()

          });
        } else {
          let invalidFields = [];

          if (this.AdmissionTaskForm.invalid) {
            for (const controlName in this.AdmissionTaskForm.controls) {
              if (this.AdmissionTaskForm.controls[controlName].invalid) {
                invalidFields.push(`MlcInfo Form: ${controlName}`);
              }
            }
          }
          if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
              this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
              );
            });
          }
        }
      }
    });
  }

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
  onChangeTime(event) {
    if (event) {
      let selectedDate = new Date(this.AdmissionTaskForm.get('AdmissionDate').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    // this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
  @Input() isDisableFuture: boolean = false;
  myFilter = (d: Date | null): boolean => {
    return this.isDisableFuture ? d <= new Date() : true;
  };

  openServiceTable(contact): void {
    debugger
    this.vIPDNo=contact.IPDNo
    this.AdmissionId=contact.AdmissionID

      this.AdmissionTaskForm.get('NewIpdNo').setValue(contact.IPDNo);
      this.AdmissionTaskForm.get('AdmissionDate').setValue(contact.AdmissionTime);
      this.AdmissionTaskForm.get('AdmissionTime').setValue(contact.AdmissionDate);
     

    this._matDialog.open(this.serviceTable, {
      maxHeight: "55vh",
      maxWidth: '90vh',
      
    })
  }
  oncloseservice() {
    // this._.close(this.serviceTable);
  }


  onClose() {
    this._matDialog.closeAll()
  }
}

