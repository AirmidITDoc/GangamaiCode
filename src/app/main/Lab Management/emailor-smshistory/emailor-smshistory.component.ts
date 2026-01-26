import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LabPatientList } from '../lab-patient-reg/lab-patient-reg.component';
import { LabmanagementService } from '../labmanagement.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

import { fuseAnimations } from '@fuse/animations';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { FuseThemeOptionsComponent } from '@fuse/components/theme-options/theme-options.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-emailor-smshistory',
  templateUrl: './emailor-smshistory.component.html',
  styleUrls: ['./emailor-smshistory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmailorSMSHistoryComponent {
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  SMSform: FormGroup
  Emailform: FormGroup
  autocompleteModehospital: string = "Hospital";
  Remark: any = ''
  emailId: any = ''
  dateTimeObj: any
  LabId = 0
  DueAmt = 0
  screenFromString = 'Common-form';
  Personaldata = new LabPatientList({})
  autocompleteModedeptdoc: string = "ConDoctor";

  mobileNo: any
  patientName: any
  billno: any
  selectedItems: any[] = [];
  selectedItems1: any[] = [];
  ChargeList: any = [];
  ChargeList1: any = [];
  patientValues: any = ''
  patientValues1: any = ''
  @ViewChild('SMSGrid', { static: false }) smslistgrid: AirmidTableComponent;
  @ViewChild('EmailGrid', { static: false }) emaillistgrid: AirmidTableComponent;

constructor(public _LabmanagementService: LabmanagementService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService, @Inject(MAT_DIALOG_DATA) public data: any,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService,
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay
  ) {
    this.SMSform = this._LabmanagementService.CreateSMSform()
    this.Emailform = this._LabmanagementService.CreateEmailform()
  }

  ngOnInit(): void {
    this.selectedItems = [];
      this.selectedItems1 = [];
    if (this.data) {
      this.Personaldata = this.data;
      this.LabId = this.Personaldata.labPatientId
      this.DueAmt = this.Personaldata.balanceAmt
      this.billno = this.Personaldata.billNo
      this.patientName = this.Personaldata.patientName
      this.mobileNo = this.Personaldata.mobileNo
      this.emailId = this.Personaldata.emailId


      console.log(this.Personaldata)
    }
    // this.SMSform = this._LabmanagementService.CreateSMSform()
    // this.Emailform = this._LabmanagementService.CreateEmailform()

    if (this.LabId > 0) {
      this.onAddrow()
      if (this.emailId != '')
        this.onAddEmailrow()

      this.getfilterSMShistory()

    }
    if (this.LabId > 0)
      debugger
    this.getfilterEmailhistory()
  }


  allColumns1 = [
    { heading: "Sms Date", key: "smsDate", sort: true, align: 'left', emptySign: 'NA', width: 80, type: 6 },
    { heading: "Mobile Number", key: "mobileNumber", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Sms String", key: "smsString", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    // { heading: "smSurl", key: "smSurl", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
    { heading: "File Path", key: "filePath", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Sms Type", key: "smsType", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "TranNo", key: "tranNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },

    { heading: "Last Try", key: "lastTry", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Last Response", key: "lastResponse", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    // {
    //   heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate2  // Assign ng-template to the column
    // }
  ]
  allFilters1 = [
    { fieldName: "PatientId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }

  ]
  gridConfigSms: gridModel = {
    apiUrl: "LabPatientRegistration/LabPatientWhatsappSendoutList",
    columnsList: this.allColumns1,
    sortField: "PatientId",
    sortOrder: 0,
    filters: this.allFilters1
  }


  //email

  allColumnsemail = [
    { heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Email Date", key: "emailDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
    { heading: "Email Type", key: "emailType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "From Email", key: "fromEmail", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "To Email", key: "toEmail", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Mail Subject", key: "mailSubject", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Subject", key: "subject", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Mail Body", key: "mailBody", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Attachment Link", key: "attachmentLink", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Status", key: "lastResponse", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Ceated By", key: "createdBy", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Created On", key: "createdOn", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    // {
    //   heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate2  // Assign ng-template to the column
    // }
  ]
  allFiltersemail = [
    // { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
    // { fieldName: "ToDate", fieldValue: this.toDate2, opType: OperatorComparer.Equals }
    { fieldName: "PatientId", fieldValue: "20483", opType: OperatorComparer.Equals }

  ]

  gridConfigEmail: gridModel = {
    apiUrl: "LabPatientRegistration/LabPatientEmailOutgoingList",
    columnsList: this.allColumnsemail,
    sortField: "PatientId",
    sortOrder: 0,
    filters: this.allFiltersemail
  }


  getfilterSMShistory() {
debugger
    this.gridConfigSms = {
      apiUrl: "LabPatientRegistration/LabPatientWhatsappSendoutList",
      columnsList: this.allColumns1,
      sortField: "PatientId",
      sortOrder: 0,
      filters: [{ fieldName: "PatientId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }


      ]
    }

    this.smslistgrid.gridConfig = this.gridConfigSms;
    this.smslistgrid.bindGridData();
  }

  getfilterEmailhistory() {
    debugger
    // this.LabId = 200247
    this.gridConfigEmail = {
      apiUrl: "LabPatientRegistration/LabPatientEmailOutgoingList",
      columnsList: this.allColumnsemail,
      sortField: "PatientId",
      sortOrder: 0,
      filters: [{ fieldName: "PatientId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }

      ]
    }

    this.emaillistgrid.gridConfig = this.gridConfigEmail;
    this.emaillistgrid.bindGridData();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getValidationMessages() {
    return {
      CustMobile: [
        { name: "required", Message: "CustMobile is required" }
      ],
      DoctorID: [
        { name: "required", Message: "DoctorID is required" }
      ],
      Mode: [
        { name: "required", Message: "Mode is required" }
      ],
      DispatchBranch: [
        { name: "required", Message: "DispatchBranch is required" }
      ],
      DueAmt: [
        { name: "required", Message: "DueAmt is required" }
      ],
      Remark: [
        { name: "required", Message: "Remark is required" }
      ],
      EmailId: [
        { name: "required", Message: "Remark is required" }
      ],
    };
  }


  onAddrow() {

    if (this.SMSform.get('CustMobile').value)
      this.mobileNo = this.SMSform.get('CustMobile').value || this.mobileNo
    else
      this.mobileNo = this.mobileNo

    console.log("event is :", event);

    if (!this.ChargeList) {
      this.ChargeList = [];
    }

    const newItem = {
      patienName: this.patientName,
      type: 'B2C',
      mobile: this.mobileNo,
    };

    this.ChargeList.push(newItem);

    this.selectedItems = [...this.selectedItems, newItem];

  }

  onAddEmailrow() {

    if (this.Emailform.get('EmailId').value)
      this.emailId = this.Emailform.get('EmailId').value || this.emailId
    else
      this.emailId = this.emailId

    console.log("event is :", event);

    if (!this.ChargeList1) {
      this.ChargeList1 = [];
    }

    const newItem = {
      patienName: this.patientName,
      type: 'B2C',
      emailId: this.emailId,
    };

    this.ChargeList1.push(newItem);

    this.selectedItems1 = [...this.selectedItems1, newItem];

  }

  onItemToggle(item) {
    console.log('Toggled:', item);
  }

  onItemToggle1(item) {
    console.log('Toggled:', item);
  }
  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
  }
 removeItem1(index: number) {
    this.selectedItems.splice(index, 1);
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

  //whatsapp


  onSmsSubmit() {
    debugger
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: this.mobileNo,
      patientName: this.patientName,
      billNo: this.billno,
      // ?smsType: "LabReport",
      smsType: "OPReceipt",
      patientId: this.LabId


    })
    this._matDialog.closeAll()
    this.getfilterSMShistory()
  }

  onSmsReceiptSubmit() {
    debugger
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: this.mobileNo,
      patientName: this.patientName,
      billNo: this.billno,
      // smsType: "LabReportReceipt",
      smsType: "OPReceipt",
      patientId: this.LabId


    })
    this._matDialog.closeAll()
    this.getfilterSMShistory()
  }

  Personaldata1 = new LabPatientList({})
  OnReportemail() {
    debugger
    this.Personaldata1.emailId = this.Emailform.get('EmailId').value || 'Airmid@gmail.com'
    this.Personaldata1.billNo = this.billno
    this.Personaldata1.regNo = this.LabId

    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: this.Personaldata1,
          emailType: 'OPReceipt'
        }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  OnReceiptemail() {
    debugger
    this.Personaldata1.emailId = this.Emailform.get('EmailId').value || 'Airmid@gmail.com'
    this.Personaldata1.billNo = this.billno
    this.Personaldata1.regNo = this.LabId
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: this.Personaldata1,
          emailType: 'OPReceipt'
        }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  onClose() {
    this._matDialog.closeAll()
  }
}

