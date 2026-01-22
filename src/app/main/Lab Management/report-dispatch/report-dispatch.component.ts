import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { LabmanagementService } from '../labmanagement.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FormGroup } from '@angular/forms';
import { LabPatientList } from '../lab-patient-reg/lab-patient-reg.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-report-dispatch',
  templateUrl: './report-dispatch.component.html',
  styleUrls: ['./report-dispatch.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReportDispatchComponent {

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  myReportFilterform: FormGroup
  autocompleteModehospital: string = "Hospital";
  Remark:any=''
  dateTimeObj:any
  LabId=0
  DueAmt=0
 screenFromString = 'Common-form';
  Personaldata=new LabPatientList({})
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
      this.LabId=this.Personaldata.labPatientId
         this.DueAmt=this.Personaldata.balanceAmt
      console.log( this.Personaldata)
    }
    this.myReportFilterform = this._LabmanagementService.CreateReportDiscpathform()
  }

  allReportfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

  ];

  allReportcolumns = [
    { heading: "Service Name", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "Dispatch Mode", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Courier/Phlebo/PickUp", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "POD No", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Remarks", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Due Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Approved On", key: "cashPayAmount1", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Dispatch By", key: "chequePayAmount1", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Dispatch On", key: "advanceUsedAmount1", sort: true, align: 'left', emptySign: 'NA' },


  ];


  gridConfigReportdispatch: gridModel = {

    apiUrl: "Tally/TallyOPBillCashCounterList",
    columnsList: this.allReportcolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allReportfilters
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      UnitId: [
        { name: "required", Message: "UnitId is required" }
      ],
      LabId: [
        { name: "required", Message: "LabId is required" }
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
    };
  }
  onSubmit() { }

  onClose() { }
}
