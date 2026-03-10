import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ComponentRef } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { LabSampleReceivedService } from './lab-sample-received.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PatientDetailsPopoverComponent } from 'app/main/opd/appointment-list/patient-details-popover/patient-details-popover.component';

@Component({
  selector: 'app-lab-sample-received',
  templateUrl: './lab-sample-received.component.html',
  styleUrls: ['./lab-sample-received.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabSampleReceivedComponent {

  myformSearch: FormGroup;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  vOPIPId = 0;
  f_name: any = "%"
  regNo: any = "0"
  l_name: any = "%"
  status: any = "0"
  vCompanyId: any = "0"
  VPBillNo = "%"
  // Ptype: any = "5"
  Vtotalcount = 0
  VCompletedcount = 0
  Vpendingcount = 0
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  autocompleteModeunit: string = "Hospital";
  autocompleteModecompany: string = "Company";
  dataSource = new MatTableDataSource<SampleList>();
  isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;

  displayedColumns = [
    'CheckBox',
    // 'PBillNo',
    'datetime',
    'unitname',
    // 'UHID',
    'patientName',
    // 'genderName',
    // 'mobileNo',
    'serviceName',
    'outSourceLabName',
    'samplecollectiondatetime',
    'Recevieddate',
    'action',
  ];
  vSampleCollFormGroup: FormGroup

  constructor(public _SampleCollectionService: LabSampleReceivedService,
    public _matDialog: MatDialog, private commonService: PrintserviceService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public permissionService: PagePermissionService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private overlay: Overlay,) { }

  ngOnInit(): void {
    this.myformSearch = this._SampleCollectionService.createSearchForm()

    this.vSampleCollFormGroup = this.vSamplecollFormInsert();

    this.GetSampleCollectiondetail()
  }

  ListViewcompany(value) {
    console.log(value)
    if (value.value !== 0)
      this.vCompanyId = value.value
    else
      this.vCompanyId = 0

    this.onChangeFirst()
  }

  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeFirst();
  }

  onChangeFirst() {
    // debugger
    // this.isShowDetailTable = false;
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstName').value + "%"
    this.l_name = this.myformSearch.get('LastName').value + "%"
    this.regNo = this.myformSearch.get('RegNo').value || "0"
    this.status = this.myformSearch.get('StatusSearch').value
    this.VPBillNo = this.myformSearch.get('PBillNo').value || "%"
    this.vCompanyId = this.myformSearch.get('CompanyId').value || "0"
    // this.Ptype = this.myformSearch.get('PatientTypeSearch').value
    this.GetSampleCollectiondetail();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myformSearch.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myformSearch.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myformSearch.get('RegNo').setValue("0")
    if (event == 'PBillNo')
      this.myformSearch.get('PBillNo').setValue("")

    this.onChangeFirst();
  }

  selection = new SelectionModel<SampleList>(true, []);
  SelectedList: any = [];
  isCheckboxDisabled(row: any): boolean {
    return row.isSampleReceivedStatus === true;
  }
  areAllRowsDisabled(): boolean {
    return this.dataSource?.data?.length
      ? this.dataSource.data.every(row => this.isCheckboxDisabled(row))
      : true;
  }
  // masterToggle() {
  //   // if there is a selection then clear that selection
  //   if (this.isSomeSelected()) {
  //     this.selection.clear();
  //   } else {
  //     this.isAllSelected()
  //       ? this.selection.clear()
  //       : this.dataSource.data.forEach(row => this.selection.select(row));
  //   }
  //   console.log(this.selection)
  // }

  // isSomeSelected() {

  //   return this.selection.selected.length > 0;
  // }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;

  //   return numSelected === numRows;

  // }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data
        .filter(row => !row.isSampleReceivedStatus) // ✅ only remaining 3
        .forEach(row => this.selection.select(row));
    }
  }
  isAllSelected() {
    const selectableRows = this.dataSource.data.filter(
      row => !row.isSampleReceivedStatus
    );

    return this.selection.selected.length === selectableRows.length;
  }
  isSomeSelected() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  GetSampleCollectiondetail() {

    let fromDateControl = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd");
    let toDateControl = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd");

    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;
    // debugger
    let filters: any[] = [];

    // Handle date range
    if (fromDateControl && toDateControl) {
      this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
      this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
    }
    filters.push(
      {
        "fieldName": "F_Name",
        "fieldValue": String(this.f_name),
        "opType": "StartsWith"
      },
      {
        "fieldName": "L_Name",
        "fieldValue": String(this.l_name),
        "opType": "StartsWith"
      },
      {
        "fieldName": "Reg_No",
        "fieldValue": String(this.regNo),
        "opType": "Equals"
      },
      {
        "fieldName": "From_Dt",
        "fieldValue": this.fromDate,
        "opType": "Equals"
      },
      {
        "fieldName": "To_Dt",
        "fieldValue": this.toDate,
        "opType": "Equals"
      },
      {
        "fieldName": "IsReceived",
        "fieldValue": String(this.status),
        "opType": "Equals"
      },
      {
        "fieldName": "PBillNo",
        "fieldValue": String(this.VPBillNo),
        "opType": "Equals"
      },
      {
        "fieldName": "CompanyId",
        "fieldValue": String(this.vCompanyId),
        "opType": "Equals"
      },
      {
        "fieldName": "UnitId",
        "fieldValue": String(this.UnitId),
        "opType": "Equals"
      }
    );

    let data = {
      "first": 0,
      "rows": 999999,
      "sortField": "LabPatientId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    console.log(data)
    this._SampleCollectionService.getSampleRecivedlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
      if (this.dataSource.data.length > 0) {
        // debugger
        this.Vtotalcount = this.dataSource.data.length
        this.VCompletedcount = this.dataSource.data.filter(
          (element: any) => element.isSampleReceivedStatus == true
        ).length;

        this.Vpendingcount = this.dataSource.data.filter(
          (element: any) => element.isSampleReceivedStatus == false
        ).length;

        console.log(this.dataSource.data)
      }
    });
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

  vSamplecollFormInsert(): FormGroup {
    return this._formbuilder.group({
      pathologyLabReport: this._formbuilder.array([])// FormArray for details
    });
  }

  createSampleDetail(item: any = {}): FormGroup {
    return this._formbuilder.group({
      pathReportId: [item.pathReportID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      sampleReceviedDateTime: [this.getNow()],//new Date()],
      sampleReceviedUserId: this._loggedService.currentUserValue.userId,
      isSampleReceivedStatus: true
    });
  }

  get receivedDetailsArray(): FormArray {
    return this.vSampleCollFormGroup.get('pathologyLabReport') as FormArray;
  }

  getNow(): string {
    const d = new Date();
    return (
      d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0') + 'T' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0')
    );
  }

  OnSave() {
    if (this.selection.selected.length === 0) {
      Swal.fire('Error!', 'Please select sample data', 'error');
      return;
    }
    debugger
    this.receivedDetailsArray.clear();
    this.selection.selected.forEach(item => {
      this.receivedDetailsArray.push(this.createSampleDetail(item));
    });
    console.log(this.vSampleCollFormGroup.value);

    this._SampleCollectionService.UpdateSampleRecived(this.vSampleCollFormGroup.value).subscribe(() => {
      this._matDialog.closeAll();
      this.GetSampleCollectiondetail();
    });
  }
  OnReset() {
    // this.getSupplierList();
    this.SelectedList = [];
    this.selection.clear();
    this.myformSearch.reset({
      StatusSearch: "0",
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      UnitId: [this._loggedService.currentUserValue.user.unitId]
    });
  }

  OnCancel(data: any) {
    Swal.fire({
      title: 'Do you want to cancel Sample Recevied?',
      text: "Please provide a reason for cancellation",
      icon: "warning",
      input: 'text',
      inputPlaceholder: 'Enter cancellation reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let submitData = {
          pathReportId: data.pathReportID,
          sampleReceviedCancelReason: result.value,
        };
        console.log(submitData);
        this._SampleCollectionService.OnCancel(submitData).subscribe((res) => {
          this.toastr.success(res.message);
          this.GetSampleCollectiondetail();
        });
      }
    });
  }


  // ////////////// outsource popup //////////////////////
  // private overlayRef: OverlayRef | null = null;
  private patientOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private outSourceCloseTimeout: any = null;

  openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.patientOverlayRef) {
        this.patientOverlayRef.dispose();
        this.patientOverlayRef = null;
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

      this.patientOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(OutsourceDetailsPopoverComponent);
      const componentRef: ComponentRef<OutsourceDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
      componentRef.instance.outSourceData = outSourceData;

      // Handle mouse events on the overlay element
      const overlayElement = this.patientOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }

  closePatientDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.outSourceCloseTimeout = setTimeout(() => {
      if (this.patientOverlayRef) {
        this.patientOverlayRef.dispose();
        this.patientOverlayRef = null;
      }
    }, 200);
  }


  // Patient & doctor popup

  private overlayRef: OverlayRef | null = null;
  private patOverlayRef: OverlayRef | null = null;
  private PatihoverTimeout: any = null;
  private patientCloseTimeout: any = null;

  openDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.PatihoverTimeout) {
      clearTimeout(this.PatihoverTimeout);
    }

    // Add small delay to prevent flickering
    this.PatihoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.patOverlayRef) {
        this.patOverlayRef.dispose();
        this.patOverlayRef = null;
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

      this.patOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(PatientDetailsPopoverComponent);
      const componentRef: ComponentRef<PatientDetailsPopoverComponent> = this.patOverlayRef.attach(portal);
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.patOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }

  closeDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.PatihoverTimeout) {
      clearTimeout(this.PatihoverTimeout);
      this.PatihoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.patOverlayRef) {
        this.patOverlayRef.dispose();
        this.patOverlayRef = null;
      }
    }, 200);
  }

  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
      this.outSourceCloseTimeout = null;
    }
  }

}

export class SampleList {
  VADate: Date;
  VATime: Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  isSampleCollection: any;
  SampleCollectionTime: Date;
  PathReportID: any;
  SampleNo: any;
  RegNo: any;
  pathReportID: any;
  sampleNo: any;
  isApprovedByCamp: any;
  pBillNo: any;
  pathDate: any;
  sampleCollectionTime: any;
  labRequestNo: any;
  patientName: any;
  genderName: any;
  mobileNo: any;
  serviceName: any;
  outSourceLabName: any;
  SampleReceviedDateTime: any;
  userName: any;
  isSampleReceivedStatus: any;

  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.VATime = SampleList.VATime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.isSampleCollection = SampleList.isSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathReportID = SampleList.PathReportID || 0;
    this.SampleNo = SampleList.SampleNo || 0;
    this.RegNo = SampleList.RegNo || 0;
    this.pathReportID = SampleList.pathReportID || 0;
    this.sampleNo = SampleList.sampleNo || 0;
    this.isApprovedByCamp = SampleList.isApprovedByCamp || 0;
    this.pBillNo = SampleList.pBillNo || 0;
    this.pathDate = SampleList.pathDate || 0;
    this.sampleCollectionTime = SampleList.sampleCollectionTime || 0;
    this.labRequestNo = SampleList.labRequestNo || 0;
    this.patientName = SampleList.patientName || 0;
    this.genderName = SampleList.genderName || 0;
    this.mobileNo = SampleList.mobileNo || 0;
    this.serviceName = SampleList.serviceName || 0;
    this.outSourceLabName = SampleList.outSourceLabName || 0;
    this.SampleReceviedDateTime = SampleList.SampleReceviedDateTime || 0;
    this.userName = SampleList.userName || 0;
    this.isSampleReceivedStatus = SampleList.isSampleReceivedStatus || 0
  }
}