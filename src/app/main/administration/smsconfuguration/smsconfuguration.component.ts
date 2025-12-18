import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { SMSConfugurationService } from './smsconfuguration.service';
import { UpdateSMSComponent } from './update-sms/update-sms.component';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';

@Component({
  selector: 'app-smsconfuguration',
  templateUrl: './smsconfuguration.component.html',
  styleUrls: ['./smsconfuguration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SMSConfugurationComponent implements OnInit {
  MySearchForm: FormGroup;
  whatsappfilterForm: FormGroup;
  emailfilterForm: FormGroup;
  auditFilterForm: FormGroup;

  msg: any;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  MobileNumber = ""
  ActionByName = ""
  NotificationType = "0"

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid2: AirmidTableComponent;

   @ViewChild('actionisSent') actionisSent!: TemplateRef<any>;
  @ViewChild('actionisSendMail') actionisSendMail!: TemplateRef<any>;
   @ViewChild(AirmidTableComponent) auditgrid: AirmidTableComponent;


  ngAfterViewInit() {
    //  this.gridConfig.columnsList.find(col => col.key === 'isSent')!.template = this.actionisSent;
   // this.gridConfig2.columnsList.find(col => col.key === 'isSendMail')!.template = this.actionisSendMail;
  
    //  this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
  }



  // gridConfig: gridModel = {
  //   apiUrl: "smsConfig/SMSendoutList",
  //   columnsList: [
  //      { heading: "IsSent", key: "isSent", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
  //     { heading: "Date", key: "smsDate", sort: true, align: 'left', emptySign: 'NA',type:6 },
  //     { heading: "MobileNo", key: "mobileNumber", sort: true, align: 'left', emptySign: 'NA' },
  //     { heading: "SMSString", key: "smsString", sort: true, align: 'left', emptySign: 'NA' },
  //     // { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
  //     {
  //       heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
  //         {
  //           action: gridActions.edit, callback: (data: any) => {
  //             this.NewsmsPdfInsert(data);
  //           }
  //         }, {
  //           action: gridActions.delete, callback: (data: any) => {
  //             this._SMSConfigService.deactivateTheStatus(data.talukaId).subscribe((response: any) => {
  //               this.toastr.success(response.message);
  //               this.grid.bindGridData();
  //             });
  //           }
  //         }]
  //     } //Action 1-view, 2-Edit,3-delete
  //   ],
  //   sortField: "SMSOutGoingID",
  //   sortOrder: 0,
  //   filters: [
  //     { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Contains },
  //     { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  //   ]
  // }


  allColumns2 = [
    { heading: "Sms Date", key: "smsDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
    { heading: "Mobile Number", key: "mobileNumber", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Sms String", key: "smsString", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Sms Type", key: "smsType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "TranNo", key: "tranNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    // { heading: "smSurl", key: "smSurl", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
    { heading: "File Path", key: "filePath", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Last Try", key: "lastTry", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Last Response", key: "lastResponse", sort: true, align: 'left', emptySign: 'NA', width: 120 },

    // {
    //   heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate2  // Assign ng-template to the column
    // }
  ]
  allFilters2 = [
    { fieldName: "MobileNumber", fieldValue: this.MobileNumber, opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.GreaterThanOrEqual },
    { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.GreaterThanOrEqual }



  ]
  gridConfig1: gridModel = {
    apiUrl: "smsConfig/WhatsappSendoutList",
    columnsList: this.allColumns2,
    sortField: "SMSOutGoingID",
    sortOrder: 0,
    filters: this.allFilters2
  }

  //email

  allColumnsemail = [
    { heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA', width: 30 },
    { heading: "emailDate", key: "emailDate", sort: true, align: 'left', emptySign: 'NA', width: 100 , type: 6  },
    { heading: "emailType", key: "emailType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "fromEmail", key: "fromEmail", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "toEmail", key: "toEmail", sort: true, align: 'left', emptySign: 'NA', width: 250},
    { heading: "mailSubject", key: "mailSubject", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Subject", key: "subject", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "mailBody", key: "mailBody", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "attachmentLink", key: "attachmentLink", sort: true, align: 'left', emptySign: 'NA',width: 300 },
    { heading: "Status", key: "lastResponse", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "createdBy", key: "createdBy", sort: true, align: 'left', emptySign: 'NA',width: 120 },
    { heading: "createdOn", key: "createdOn", sort: true, align: 'left', emptySign: 'NA',width: 120 , type: 6 },
    // {
    //   heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate2  // Assign ng-template to the column
    // }
  ]
  allFiltersemail = [
    { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate2, opType: OperatorComparer.Equals }
  ]

  gridConfig2: gridModel = {
    apiUrl: "smsConfig/EmailOutgoingList",
    columnsList: this.allColumnsemail,
    sortField: "Id",
    sortOrder: 0,
    filters: this.allFiltersemail
  }


//audit

  allColumnsaudit = [
    { heading: "ActionBy Name", key: "actionByName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Entity Name", key: "entityName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Additional Info", key: "additionalInfo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "LogTypeId", key: "logTypeId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "LogSource", key: "logSourceId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Created On", key: "createdOn", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },

    // {
    //   heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate2  // Assign ng-template to the column
    // }
  ]
  allFiltersaudit = [
    { fieldName: "ActionByName", fieldValue: this.ActionByName, opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate2, opType: OperatorComparer.Equals },
  ]

  gridConfig3: gridModel = {
    apiUrl: "Configuration/AuditLogList",
    columnsList: this.allColumnsaudit,
    sortField: "Id",
    sortOrder: 0,
    filters: this.allFiltersaudit
  }


  constructor(
    public _SMSConfigService: SMSConfugurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.MySearchForm = this._SMSConfigService.CreateSearchForm();
    this.whatsappfilterForm = this._SMSConfigService.CreatewhatsappSearchForm();
    this.emailfilterForm = this._SMSConfigService.CreateemailSearchForm();
this.auditFilterForm = this._SMSConfigService.CreateauditForm();
  }



  NewsmsPdfInsert() {  

        const dialogRef = this._matDialog.open(UpdateSMSComponent,
          {
            maxWidth: "50vw",
            maxHeight: '50%',
            width: '55%', 
          });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
  }



  // NewsmsPdfInsert() {
  //   const dialogRef = this._matDialog.open(UpdateSMSComponent,
  //     {
  //       maxWidth: "60%",
  //       height: '00%',
  //       width: '60%',
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);

  //   });
  // }
  //Whats app

  onChangewhatsapp() {
    this.fromDate1 = this.datePipe.transform(this.whatsappfilterForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate1 = this.datePipe.transform(this.whatsappfilterForm.get('enddate').value, "yyyy-MM-dd")
    this.MobileNumber = this.whatsappfilterForm.get('Mobile').value

    this.getfilterdata1();
  }

  getfilterdata1() {
    this.gridConfig1 = {
      apiUrl: "smsConfig/WhatsappSendoutList",
      columnsList: this.allColumns2,
      sortField: "SMSOutGoingID",
      sortOrder: 0,
      filters: [
        { fieldName: "MobileNumber", fieldValue: this.MobileNumber, opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.StartsWith }

      ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

  Clearfilterwhatsapp(event) {
    console.log(event)
    if (event == 'Mobile')
      this.whatsappfilterForm.get('Mobile').setValue("")
    this.onChangewhatsapp()
  }
  //email

  onChangeemail() {
    // this.NotificationType = this.emailfilterForm.get('NotificationType').value
    this.fromDate2 = this.datePipe.transform(this.emailfilterForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.emailfilterForm.get('enddate').value, "yyyy-MM-dd")

    this.getfilterdataemail();
  }

  getfilterdataemail() {
    this.gridConfig2 = {
      apiUrl: "smsConfig/EmailsendoutList",
      columnsList: this.allColumnsemail,
      sortField: "Id",
      sortOrder: 0,
      filters: [
        // { fieldName: "NotificationType", fieldValue: this.NotificationType, opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate2, opType: OperatorComparer.Equals }

      ]
    }
    this.grid2.gridConfig = this.gridConfig2;
    this.grid2.bindGridData();
  }

  Clearfilteremail(event) {
    // console.log(event)
    // if (event == 'NotificationType')
    //   this.emailfilterForm.get('NotificationType').setValue("")
    this.onChangeemail()
  }


  openResend(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });

  }

    openSMS(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });

  }
  onChangeaudit() {
    this.fromDate2 = this.datePipe.transform(this.auditFilterForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate2 = this.datePipe.transform(this.auditFilterForm.get('enddate').value, "yyyy-MM-dd")

    this.ActionByName = this.auditFilterForm.get('ActionByName').value

    this.getfilterdataaudit();
  }

  getfilterdataaudit() {
    debugger

    this.gridConfig3 = {
      apiUrl: "Configuration/AuditLogList",
      columnsList: this.allColumnsaudit,
      sortField: "Id",
      sortOrder: 0,
      filters: [
        { fieldName: "ActionByName", fieldValue: this.ActionByName, opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate2, opType: OperatorComparer.Equals },
      ]
    }
    this.auditgrid.gridConfig = this.gridConfig3;
    this.auditgrid.bindGridData();
  }

  Clearfilteraudit(event) {
    console.log(event)
    if (event == 'ActionByName') {
      this.auditFilterForm.get('ActionByName').setValue("")
      this.onChangeaudit()
    }
  }

  getValidationMessages() {
    return {
      registrationNo: [],
      ipNo: [],
      opNo: [],
      patientType: [],

    };
  }
}


