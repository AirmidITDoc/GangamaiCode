import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-emailor-smshistory',
  templateUrl: './emailor-smshistory.component.html',
  styleUrls: ['./emailor-smshistory.component.scss']
})
export class EmailorSMSHistoryComponent {
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  SMSform: FormGroup
  Emailform: FormGroup
  autocompleteModehospital: string = "Hospital";
  Remark: any = ''
  dateTimeObj: any
  LabId = 0
  DueAmt = 0
  screenFromString = 'Common-form';
  Personaldata = new LabPatientList({})
   autocompleteModedeptdoc: string = "ConDoctor";

  constructor(public _LabmanagementService: LabmanagementService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService, @Inject(MAT_DIALOG_DATA) public data: any,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService,
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.Personaldata = this.data;
      this.LabId = this.Personaldata.labPatientId
      this.DueAmt = this.Personaldata.balanceAmt
      console.log(this.Personaldata)
    }
    this.SMSform = this._LabmanagementService.CreateSMSform()
     this.Emailform = this._LabmanagementService.CreateEmailform()
  }


  allSmshistoryfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

  ];

  allSmshistorycolumns = [
    { heading: "Mobile No", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "SMS Type", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "SMS Text", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Staus", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Created By", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Created On", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Send On", key: "cashPayAmount1", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Send Through", key: "chequePayAmount1", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Response", key: "advanceUsedAmount1", sort: true, align: 'left', emptySign: 'NA' },


  ];


  gridConfigSms: gridModel = {

    apiUrl: "Tally/TallyOPBillCashCounterList",
    columnsList: this.allSmshistorycolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allSmshistoryfilters
  }


  allSmsfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

  ];

  allsmscolumns = [
    { heading: "Person Name", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: " Type", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Mobile", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
  
  
  ];


  gridConfigSms1: gridModel = {

    apiUrl: "Tally/TallyOPBillCashCounterList",
    columnsList: this.allsmscolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allSmsfilters
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
  onSubmit() { }
}
