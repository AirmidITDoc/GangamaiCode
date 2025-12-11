import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NewAppointmentComponent } from 'app/main/opd/appointment-list/new-appointment/new-appointment.component';
import { NewAdmissionComponent } from 'app/main/ipd/Admission/admission/new-admission/new-admission.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MLCInformationComponent } from 'app/main/ipd/Admission/admission/mlcinformation/mlcinformation.component';
import { LabPatientRegService } from './lab-patient-reg.service';
import { NewLabPatientRegComponent } from './new-lab-patient-reg/new-lab-patient-reg.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { LabRegBillDeatilsComponent } from './lab-reg-bill-deatils/lab-reg-bill-deatils.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { EstimateForPatientComponent } from './estimate-for-patient/estimate-for-patient.component';
// import { NewLabPatientregComponent } from './new-lab-patientreg/new-lab-patientreg.component';

@Component({
  selector: 'app-lab-patient-reg',
  templateUrl: './lab-patient-reg.component.html',
  styleUrls: ['./lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class LabPatientRegComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  myFilterform: FormGroup;
  f_name: any = ""
  l_name: any = ""
  Status: any = "0";
   PBillNo: any = "%";
  DoctorId: any = "0";
  vbalanceamt: any;
  vpaidamt: any;
  autocompleteModedoctor: string = "ConDoctor";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;
  constructor(
    public _labPatientRegService: LabPatientRegService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._labPatientRegService.CreateSearchGroup();
    // this.GetlabAppointdetail();
  }

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'balanceAmt1')!.template = this.actionsTemplate4;
  }

  allcolumns = [
    { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Date-Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 60 },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width:150 },
    { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width:100},
    { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width:100 },
    { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width:100},
    { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width:100 },
    { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width:100},
    { heading: "HospitalName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allfilters = [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "PBillNo", fieldValue:"%", opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals }

  ]

  gridConfig: gridModel = {
    apiUrl: "LabPatientRegistration/List",
    columnsList: this.allcolumns,
    sortField: "LabPatientId",
    sortOrder: 0,
    filters: this.allfilters
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
    // if (event == 'RegNo')
    //   this.myFilterform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterform.get('PBillNo').setValue("")
    this.onChangeFirst();
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.getfilterdata();
  }
 
  getfilterdata() {
    this.gridConfig = {
      apiUrl: "LabPatientRegistration/List",
      columnsList: this.allcolumns,
      sortField: "LabPatientId",

      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals }

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    // this.GetAppointdetail();
  }
  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = 0

    this.onChangeFirst();
  }

  keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

  onnew(row: any = null) {
    const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
      {
        maxWidth: "90vw",
        maxHeight: '90vh',
        width: '95%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }
  openPaymentpopup(contact) {
    console.log(contact)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
      PatientHeaderObj['RegNo'] = contact.regNo;
    PatientHeaderObj['PatientName'] = contact.patientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.opD_IPD_ID;
    PatientHeaderObj['Age'] = contact.ageYear;
    PatientHeaderObj['DepartmentName'] = contact.departmentName;
    PatientHeaderObj['DoctorName'] = contact.doctorName;
    PatientHeaderObj['TariffName'] = contact.tariffName;
    PatientHeaderObj['CompanyName'] = contact.companyName;
    PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
    // this.vMobileNo = contact.mobileNo;
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        width: '70%',
        maxHeight: "90vw",
        height: '90%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP-Bill"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.IsSubmitFlag == true) {
         let PaymentObjarr = [];
        let PaymentObj = result.submitDataPay.ipPaymentInsert
         PaymentObjarr.push(PaymentObj);


        this.vpaidamt = result.PaidAmt;
        this.vbalanceamt = result.BalAmt
        PaymentObj['BillNo'] = contact.billNo;
        let updateBillobj = {};
        updateBillobj['BillNo'] = contact.billNo;
        updateBillobj['balanceAmt'] = result.BillBalanceAmount;
        console.log(result.submitDataPay.ipPaymentInsert)
        let data = {
          opCreditPayment: PaymentObj,
          "billUpdate": {
            "billNo": contact.billNo,
            "balanceAmt": result.BillBalanceAmount
          },
            tPayments:PaymentObjarr
        }
        console.log(data)
        this._labPatientRegService.InsertLabBillingsettlement(data).subscribe(response => {
          this.toastr.success(response.message);
          this.grid.gridConfig = this.gridConfig;
          this.grid.bindGridData();
          this.viewgetOPPayemntPdf(response, true);

        }, (error) => {
          this.toastr.error(error.message);
        });

      }
    });

  }

   viewgetOPPayemntPdf(data, status) {
        if (status == true)
            this.commonService.Onprint("PaymentId", data, "LabPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "LabPaymentReceipt");
    }

  OnallList() {
    setTimeout(() => {

      let param = {

        "searchFields": [
          {
            "fieldName": "DoctorId",
            "fieldValue": this.DoctorId,
            "opType": "13"
          },
          {
            "fieldName": "From_Dt",
            "fieldValue": "2025-11-11",
            "opType": "13"
          },
          {
            "fieldName": "To_Dt",
            "fieldValue": "2025-11-11",
            "opType": "13"
          }

        ],
        "mode": "LabRegistrationListReport"
      }

      console.log(param)
      this._labPatientRegService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Lab Registration List  Viewer"

            }
          });

        matDialog.afterClosed().subscribe(result => {

        });
      });

    }, 100);

  }


  billdetail(element) {
    console.log(element)
    

    const dialogRef = this._matDialog.open(LabRegBillDeatilsComponent,
      {
        maxWidth: "60vw",
        height: '650px',
        width: '100%',
        data: element

      });
    dialogRef.afterClosed().subscribe(result => {
      // this.onChangeFirst2()
    });

  }


   viewgetOPBillReportPdf(element) {
        this.commonService.Onprint("BillNo", element.billNo, "LabregisterBillReceipt");
    }


  Onmessage(element){
 console.log(element)
    
    const dialogRef = this._matDialog.open(EstimateForPatientComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '100%',
        data: element

      });
    dialogRef.afterClosed().subscribe(result => {
      // this.onChangeFirst2()
    });
  }
  Onemail(){}
  getWhatsappshareBill(){}
  OnCancle() {
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this Lab Registration?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33',     // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        //call 
      }
    })
  }
}

export class LabPatientList {

  PatientName: string;
  Date: Number;
  RegNo: number;
  MobileNo: number;
  Doctorname: number;
  patientTypeID: any;
  firstName: any;
  middleName: any;
  lastName: any;
  genderId: any;
  address: any;
  pinNo: any;
  stateId: any;
  cityId: any;
  countryId: any;
  mobileNo: any;
  phoneNo: any;
  dateofBirth: Date;
  dateOfBirth: Date;
  currentDate = new Date();
  prefixId: any;
  regId: any;
  departmentId: any;
  docNameId: any;
  doctorId: any;
  genderID: any;
  emgId: any;
  comment: any;
  tariffId: any;
  classId: any;
  tariffid: any;
  classid: any;
  tariffName: any;
  genderName: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  patientName: any;
  doctorName: any;
  departmentName: any;
  chiefComplaint: any;
  diagnosis: any;
  examination: any;
  height: any;
  pweight: any;
  bmi: any;
  bsl: any;
  spo2: any;
  pulse: any;
  bp: any;
  temp: any;
  advice: any;
  emgHistoryId: any;
  attendingDoctorId: any;
  refDoctorId: any;
  spO2: any;
  isMlc: any;
  convertedIntoAdm: any;
  age: any;
  refDocId: any;

  constructor(LabPatientList) {
    {
      this.Date = LabPatientList.Date || 0;
      this.RegNo = LabPatientList.RegNo || 0;
      this.MobileNo = LabPatientList.MobileNo || 0;
      this.Doctorname = LabPatientList.Doctorname || '';
      this.PatientName = LabPatientList.PatientName || '';
      this.patientTypeID = LabPatientList.patientTypeID || 0
      this.firstName = LabPatientList.firstName || ''
      this.middleName = LabPatientList.middleName || ''
      this.lastName = LabPatientList.lastName || ''
      this.genderId = LabPatientList.genderId || 0
      this.address = LabPatientList.address || ''
      this.pinNo = LabPatientList.pinNo || 0
      this.stateId = LabPatientList.stateId || 0
      this.cityId = LabPatientList.cityId || 0
      this.countryId = LabPatientList.countryId || 0
      this.mobileNo = LabPatientList.mobileNo || 0
      this.phoneNo = LabPatientList.phoneNo || 0
      this.dateOfBirth = LabPatientList.dateOfBirth || this.currentDate;
      this.dateofBirth = LabPatientList.dateofBirth || this.currentDate;
      this.prefixId = LabPatientList.prefixId || 0
      this.regId = LabPatientList.regId || 0
      this.departmentId = LabPatientList.departmentId || 0
      this.docNameId = LabPatientList.docNameId || 0
      this.doctorId = LabPatientList.doctorId || 0
      this.refDocId = LabPatientList.refDocId || 0
      this.genderID = LabPatientList.genderID || 0
      this.emgId = LabPatientList.emgId || 0
      this.comment = LabPatientList.comment || ''
      this.tariffId = LabPatientList.tariffId || 0
      this.classId = LabPatientList.classId || 0
      this.tariffid = LabPatientList.tariffid || 0
      this.classid = LabPatientList.classid || 0
      this.genderName = LabPatientList.genderName || ''
      this.tariffName = LabPatientList.tariffName || ''
      this.ageYear = LabPatientList.ageYear || 0
      this.ageMonth = LabPatientList.ageMonth || 0
      this.ageDay = LabPatientList.ageDay || 0
      this.patientName = LabPatientList.patientName || ''
      this.doctorName = LabPatientList.doctorName || ''
      this.departmentName = LabPatientList.departmentName || ''
      this.chiefComplaint = LabPatientList.chiefComplaint || ''
      this.diagnosis = LabPatientList.diagnosis || ''
      this.examination = LabPatientList.examination || ''
      this.height = LabPatientList.height || ''
      this.pweight = LabPatientList.pweight || ''
      this.bmi = LabPatientList.bmi || ''
      this.bsl = LabPatientList.bsl || ''
      this.spo2 = LabPatientList.spo2 || ''
      this.pulse = LabPatientList.pulse || ''
      this.bp = LabPatientList.bp || ''
      this.temp = LabPatientList.temp || ''
      this.advice = LabPatientList.advice || ''
      this.emgHistoryId = LabPatientList.emgHistoryId || 0
      this.attendingDoctorId = LabPatientList.attendingDoctorId || 0
      this.refDoctorId = LabPatientList.refDoctorId || 0
      this.spO2 = LabPatientList.spO2 || 0
      this.isMlc = LabPatientList.isMlc || false
      this.convertedIntoAdm = LabPatientList.convertedIntoAdm || ''
      this.age = LabPatientList.age || 0
    }
  }
}

export class LabRequest {
  ServiceName: any;
  Price: number;
  price: number;
  ServiceId: any;
  CreditedtoDoctor: any;
  constructor(LabRequest) {
    this.ServiceName = LabRequest.ServiceName || '';
    this.Price = LabRequest.Price || 0;
      this.price = LabRequest.price || 0;
    this.ServiceId = LabRequest.ServiceId || 0;
    this.CreditedtoDoctor = LabRequest.CreditedtoDoctor || 0;
  }
}
