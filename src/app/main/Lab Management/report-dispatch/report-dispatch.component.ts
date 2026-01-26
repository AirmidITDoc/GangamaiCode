import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { LabmanagementService } from '../labmanagement.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LabPatientList } from '../lab-patient-reg/lab-patient-reg.component';
import { fuseAnimations } from '@fuse/animations';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';


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
  myReportform: FormGroup
  autocompleteModehospital: string = "Hospital";
  autocompleteModedispatch: string = "LabDispatchModeList";

  Remark: any = ''
  dateTimeObj: any
  LabId:any=0
  UnitId = this._accountService.currentUserValue.user.unitId
  DueAmt = 0
  ModeId = "0"
  screenFromString = 'Common-form';


  @ViewChild('ReportGrid', { static: false }) repogrid: AirmidTableComponent;

  Personaldata = new LabPatientList({})
  constructor(public _LabmanagementService: LabmanagementService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService, @Inject(MAT_DIALOG_DATA) public data: any,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService,
    public _whatsppService: WhatsAppEmailService, private _formBuilder: UntypedFormBuilder,
    private overlay: Overlay
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.Personaldata = this.data;
      console.log(this.Personaldata)
      this.LabId = this.Personaldata.labPatientId
      this.DueAmt = this.Personaldata.balanceAmt
      this.ModeId = this.Personaldata.dispatchModeId

    }
    this.myReportform = this.CreateReportDiscpathform()
    if (this.LabId)
      this.getfilterReporthistory()
  }


  CreateReportDiscpathform(): FormGroup {
    return this._formBuilder.group({
      dispatchId: [0, [
        Validators.required]],
      labPatientId: [this.LabId, [
        Validators.required]],
      unitId: [this._accountService.currentUserValue.user.unitId, [Validators.required]],
      dispatchModeId: [this.ModeId, [Validators.required]],
      comments: "",
      dispatchBy: this._accountService.currentUserValue.userId,
      dispatchOn: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      // DispatchBranch:0,
      // DueAmt:0,
      Service: true
    });
  }

  allReportfilters = [
    { fieldName: "DispatchId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }

  ];

  allReportcolumns = [
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Dispatch Mode", key: "name", sort: true, align: 'left', emptySign: 'NA', width: 150  },
    { heading: "Dispatch By", key: "dispatchBy", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Dispatch On", key: "dispatchOn", sort: true, align: 'left', emptySign: 'NA', type: 6 },
   { heading: "Created By", key: "createdUser", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Created Date", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
   { heading: "Modified By", key: "modifieduser", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Modified Date", key: "modifiedDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Remarks", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnEdit(data)
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._LabmanagementService.deactivateTheStatus(data.id).subscribe((response: any) => {
              // this.getfilterdata();
            });
          }
        }]
    }
  ];


  gridConfigReportdispatch: gridModel = {

    apiUrl: "PathDispatchReportHistory/PathDispatchReportHistoryList",
    columnsList: this.allReportcolumns,
    sortField: "DispatchId",
    sortOrder: 0,
    filters: this.allReportfilters
  }



  getfilterReporthistory() {

    this.gridConfigReportdispatch = {
      apiUrl: "PathDispatchReportHistory/PathDispatchReportHistoryList",
      columnsList: this.allReportcolumns,
      sortField: "DispatchId",
      sortOrder: 0,
      filters: [{ fieldName: "DispatchId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }

      ]
    }
    debugger
    this.repogrid.gridConfig = this.gridConfigReportdispatch;
    this.repogrid.bindGridData();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjMode(obj) {
    console.log("Mode data:", obj)

  }
  OnEdit(row: any) {
    this.myReportform.patchValue(row);
  }

  getSelectedObjunit(obj) {
    this.UnitId = obj

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
  onSubmit() {
    if (!this.myReportform.invalid) {
      console.log(this.myReportform.value)

      // this.myReportform.removeControl('DispatchBranch')
      //   this.myReportform.removeControl('DueAmt')
      this.myReportform.removeControl('Service')

      this.myReportform.get('unitId').setValue(parseInt(this.myReportform.get('unitId').value))
      this.myReportform.get('dispatchModeId').setValue(parseInt(this.myReportform.get('dispatchModeId').value))

      console.log(this.myReportform.value)
      debugger
      this._LabmanagementService.ReportDispatchInsert(this.myReportform.value).subscribe((response) => {
        console.log(response)
        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.myReportform.invalid) {
        for (const controlName in this.myReportform.controls) {
          if (this.myReportform.controls[controlName].invalid) {
            invalidFields.push(`Report Dispatch  Form: ${controlName}`);
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

  onClose() { }
}
