import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { CompanyInformationComponent } from 'app/main/ipd/company-information/company-information.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AbhaLinkComponent } from 'app/main/abha/Abha linking/abha-link.component';
import { AppointmentlistService } from '../appointmentlist.service';
import { RegistrationService } from '../../registration/registration.service';
import { VisitMaster1 } from '../../medicalrecord/medicalrecord.component';

@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  styleUrls: ['./followup-list.component.scss']
})
export class FollowupListComponent {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  myformSearch: FormGroup;
  searchFormGroup: FormGroup;

  @Input() patientData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  isLoading: boolean = false;
  DoctorId = "0";
  autocompleteModedeptdoc: string = "ConDoctor";
  doctorID = "0";
  f_name: any = "%"
  regNo = 0;
  l_name: any = "%"
  IsMark = "2"
  CompanyId = "0"
  autocompletedepartment: string = "Department";
  autocompleteCompany: string = "Company";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


  // displayedColumns: string[] = [
  //   'batchNo',
  //   'batchExpDate',
  //   'balanceQty',
  //   'unitMRP',
  //   'purchaseRate',
  //   'converFacto',
  //   'landedRate',
  //   'ExpDays',
  //   'prodLocation',
  //   'itemGenericName',
  //   // 'ItemCode',
  // ];
  isLoadingStr: string = '';
  // dataSource = new MatTableDataSource<VisitMaster1>();


  constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
    private commonService: PrintserviceService, public _registrationService: RegistrationService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    public _ConfigService: ConfigService,
    public toastr: ToastrService, public datePipe: DatePipe,
    private _ActRoute: Router, private route: ActivatedRoute,
    private overlay: Overlay, public permissionService: PagePermissionService, private _configue: ConfigService,
  ) { }
  allfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "RegId", fieldValue: "0", opType: OperatorComparer.Equals },


  ];

  // @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  allcolumns = [
    { heading: "FollowUp Date", key: "followupDate", sort: true, align: 'left', emptySign: 'NA', width: 130, type: 6 },

    { heading: "UHID", key: "regID", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "DOA", key: "visitTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    // { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    // { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 230, type: gridColumnTypes.template },
    // { heading: "", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
    { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    // {
    //   heading: "Action", key: "action", align: "center", width: 80, sticky: false, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate  // Assign ng-template to the column
    // }
  ]
  gridConfig: gridModel = {
    // permissionCode: permissionCodes.Appointment,
    apiUrl: "VisitDetail/Follow_up_List",
    columnsList: this.allcolumns,
    sortField: "FollowupDate",
    sortOrder: 0,
    filters: this.allfilters
  }

  ngOnInit(): void {
    // this.getFollowupData();
    this.myformSearch = this._AppointmentlistService.filterForm();
    // this.searchFormGroup = this.createSearchForm();
  }


  // getFollowupData() {
  //   this.isLoadingStr = 'loading';
  //   const filters: any[] = [];
  //   filters.push(

  //     {
  //       "fieldName": "From_Dt",
  //       "fieldValue": String(this.fromDate),
  //       "opType": "Equals"
  //     },
  //     {
  //       "fieldName": "To_Dt",
  //       "fieldValue": this.toDate,
  //       "opType": "Equals"
  //     },
  //     {
  //       "fieldName": "RegId",
  //       "fieldValue": this.regNo,
  //       "opType": "Equals"
  //     }
  //   );

  //   const data = {
  //     "first": 0,
  //     "rows": 999999,
  //     "sortField": "AdmissionId",
  //     "sortOrder": 0,
  //     "filters": filters,
  //     "exportType": "JSON",
  //     "columns": []
  //   };

  //   this._AppointmentlistService.getFollowupList(data).subscribe((res: any) => {
  //     console.log(res);
  //      this.dataSource.data = res.data;
  //   });
  // }



  onChangeFirst() {

    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
    this.regNo = this.myformSearch.get('RegNo').value || "0"

    this.getfilterdata();

  }
  onChangeFirst1(event) {
    debugger
    console.log(event)
    // if (event.key == 13) {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
    this.regNo = this.myformSearch.get('RegNo').value || "0"

    this.getfilterdata();
    // }
  }
  ListView(value) {

    const departmentId = this.myformSearch.get('departmentId')?.value;
    if (!departmentId || departmentId === "0" || departmentId === 0) {
      // this.ddlDoctor.options = [];
      this.toastr.warning("Please select a Department First.", "warning");
      this.DoctorId = "0";
      return;
    }
    console.log(value)
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = "0"

    this.onChangeFirst();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "VisitDetail/Follow_up_List",
      columnsList: this.allcolumns,
      sortField: "FollowupDate",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },

        { fieldName: "RegId", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }

  getValidationdoctorMessages() {
    return {
      DoctorId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getSelectedObj($event) { }
  GetAppointdetail() { }
  selectedRow: any = null;

  getSelectedRow(row: any): void {
    this.selectedRow = row;
    console.log("Selected row : ", row);
  }
  clearSelection() {
    this.selectedRow = null;
  }
  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myformSearch.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myformSearch.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myformSearch.get('RegNo').setValue("")

    this.onChangeFirst();
  }
  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }
  //
  onClose() {
    this._matDialog.closeAll()
  }
}
