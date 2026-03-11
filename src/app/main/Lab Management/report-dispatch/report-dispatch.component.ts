import { Component, Inject, ViewChild, ViewEncapsulation, ComponentRef } from '@angular/core';
import { LabmanagementService } from '../labmanagement.service';
import { ToastrService } from 'ngx-toastr';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LabPatientList } from '../lab-patient-reg/lab-patient-reg.component';
import { fuseAnimations } from '@fuse/animations';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';

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
  LabId: any = 0
  UnitId = this._accountService.currentUserValue.user.unitId
  DueAmt = 0
  ModeId = "0"
  screenFromString = 'ExternalLab-form';

  @ViewChild('ReportGrid', { static: false }) repogrid: AirmidTableComponent;

  Personaldata = new LabPatientList({})
  constructor(public _LabmanagementService: LabmanagementService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService, @Inject(MAT_DIALOG_DATA) public data: any,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
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
    this.getServiceTestList();
    this.myReportform = this.CreateReportDiscpathform()
    if (this.LabId != 0)
      this.getfilterReporthistory()
  }

  CreateReportDiscpathform(): FormGroup {
    return this._formBuilder.group({
      dispatchId: [0, [
        Validators.required]],
      labPatientId: [this.LabId, [
        Validators.required]],
      unitId: [this._accountService.currentUserValue.user.unitId, [Validators.required]],
      dispatchModeId: [this.ModeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      comments: "",
      dispatchBy: this._accountService.currentUserValue.userId,
      dispatchOn: ['', Validators.required],
      Service: true,

      tPathDispatchReportHistoryDetails: this._formBuilder.array([])
    });
  }

  createTestDetail(item: any = {}): FormGroup {
    return this._formBuilder.group({
      dispatchDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dispatchId: [0],
      testId: [item.testId]
    });
  }

  get testDetailsArray(): FormArray {
    return this.myReportform.get('tPathDispatchReportHistoryDetails') as FormArray;
  }

  allReportfilters = [
    { fieldName: "DispatchId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }
  ];

  allReportcolumns = [
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Dispatch Mode", key: "name", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Dispatch On", key: "dispatchOn", sort: true, align: 'left', emptySign: 'NA', type: 8 },
    { heading: "Created By", key: "createdUser", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Created Date", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    // { heading: "Modified By", key: "modifieduser", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Modified Date", key: "modifiedDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Remarks", key: "comments", sort: true, align: 'left', emptySign: 'NA' }
    // {
    //   heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
    //     {
    //       action: gridActions.edit, callback: (data: any) => {
    //         this.OnEdit(data)
    //       }
    //     }, {
    //       action: gridActions.delete, callback: (data: any) => {
    //         this._LabmanagementService.deactivateTheStatus(data.id).subscribe((response: any) => {
    //           // this.getfilterdata();
    //         });
    //       }
    //     }]
    // }
  ];
  allservicefilters = [
    { fieldName: "DispatchId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }

  ];

  allServicecolumns = [
    { heading: "Service Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    //   { heading: "Dispatch Mode", key: "name", sort: true, align: 'left', emptySign: 'NA', width: 150  },
    //   { heading: "Dispatch By", key: "dispatchBy", sort: true, align: 'left', emptySign: 'NA' },
    //   { heading: "Dispatch On", key: "dispatchOn", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    //  { heading: "Created By", key: "createdUser", sort: true, align: 'left', emptySign: 'NA' },
    //   { heading: "Created Date", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    //  { heading: "Modified By", key: "modifieduser", sort: true, align: 'left', emptySign: 'NA' },
    //   { heading: "Modified Date", key: "modifiedDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    //   { heading: "Remarks", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
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
  gridConfig: gridModel = {

    apiUrl: "Estimate/EstimateList",
    columnsList: this.allServicecolumns,
    sortField: "PatientId",
    sortOrder: 0,
    filters: this.allservicefilters
  }

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
      filters: [{ fieldName: "DispatchId", fieldValue: String(this.LabId), opType: OperatorComparer.Equals }]
    }

    setTimeout(() => {
      this.repogrid.gridConfig = this.gridConfigReportdispatch;
      this.repogrid.bindGridData();
    }, 100);
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

  displayedColumns = [
    'CheckBox',
    'testname',
    'mode',
    'action'
  ];
  selection = new SelectionModel<SampleList>(true, []);
  SelectedList: any = [];
  dataSource = new MatTableDataSource<SampleList>();
  isCheckboxDisabled(row: any): boolean {
    return !row?.name && row.name.trim() === '';
  }
  areAllRowsDisabled(): boolean {
    return this.dataSource?.data?.length
      ? this.dataSource.data.every(row => this.isCheckboxDisabled(row))
      : true;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data
        .filter(row => !row?.name || row.name.trim() === '')   // check name empty
        .forEach(row => this.selection.select(row));
    }
  }

  isAllSelected() {
    const selectableRows = this.dataSource.data.filter(
      row => !row?.name || row.name.trim() === ''
    );

    return this.selection.selected.length === selectableRows.length;
  }
  isSomeSelected() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  getServiceTestList() {

    let data = {
      "first": 0,
      "rows": 10,
      "sortField": "LabPatientId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "LabPatientId",
          "fieldValue": String(this.LabId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    console.log(data)
    this._LabmanagementService.gettestlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
    });
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
    this.myReportform.removeControl('Service')

    this.myReportform.get('unitId').setValue(parseInt(this.myReportform.get('unitId').value))
    this.myReportform.get('dispatchOn').setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss"))
    this.myReportform.get('dispatchModeId').setValue(parseInt(this.myReportform.get('dispatchModeId').value))

    if (this.selection.selected.length === 0) {
      this.toastr.warning(`select Report to dispatch`, 'Warning');
      return;
    }
    debugger
    this.testDetailsArray.clear();
    this.selection.selected.forEach(item => {
      this.testDetailsArray.push(this.createTestDetail(item));
    });

    if (!this.myReportform.invalid) {

      console.log(this.myReportform.value)
      this._LabmanagementService.ReportDispatchInsert(this.myReportform.value).subscribe((response) => {
        this.repogrid.bindGridData();
        this.getServiceTestList();
        this.myReportform.get('dispatchModeId').setValue(0)
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


  private overlayRef: OverlayRef | null = null;
  private EmailOverlayRef: OverlayRef | null = null;
  private whatsappOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private patientCloseTimeout: any = null;
  private doctorCloseTimeout: any = null;

  openEmailDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.EmailOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
      const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.EmailOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeEmailDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }
    }, 200);
  }
  openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.whatsappOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
      const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.whatsappOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeWhatsappDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }
    }, 200);
  }
  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
      this.patientCloseTimeout = null;
    }
  }

  getWhatsappshareBill(el) {
    console.log(el);
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.billNo,
      smsType: "OPBill",
      patientId: el.regNo
    })
  }

  Onemail(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'OPBill'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // this.grid.bindGridData();
    });
  }
}

export class SampleList {
  testName: any;
  name: any;

  constructor(SampleList) {
    this.testName = SampleList.testName || '';
    this.name = SampleList.name || '';
    // this.ServiceName = SampleList.ServiceName || '';
    // this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    // this.isSampleCollection = SampleList.isSampleCollection || 0;
    // this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    // this.PathReportID = SampleList.PathReportID || 0;
    // this.SampleNo = SampleList.SampleNo || 0;
    // this.RegNo = SampleList.RegNo || 0;
  }
}