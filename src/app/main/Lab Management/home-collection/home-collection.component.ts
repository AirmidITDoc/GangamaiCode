import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { HomeCollectionService } from './home-collection.service';
import { NewCollectionComponent } from './new-collection/new-collection.component';
import { NewLabPatientRegComponent } from '../lab-patient-reg/new-lab-patient-reg/new-lab-patient-reg.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-collection',
  templateUrl: './home-collection.component.html',
  styleUrls: ['./home-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HomeCollectionComponent {
  myFilterform: FormGroup;
  f_name: any = ""
  l_name: any = ""
  Status: any = "0";
  PBillNo: any = "%";
  DoctorId: any = "0";
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('stausStart') stausStart!: TemplateRef<any>;
  autocompleteModeunit: string = "Hospital";

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'status')!.template = this.stausStart;
  }

  constructor(
    public _homeCollectionService: HomeCollectionService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService,
    public permissionService: PagePermissionService, private router: Router
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._homeCollectionService.CreateSearchGroup();
  }

  allcolumns = [
    // {
    //   heading: "", key: "colorPad", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 120,
    //   template: this.ColorCode
    // },
    // {
    //   heading: "Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 120,
    //   template: this.PatientTypeColorCode
    // },
    { heading: "Unit/Branch Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Date-Time", key: "collectionTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "HomeSeqNo", key: "homeSeqNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.stausStart
    },
    { heading: "Reason", key: "remark", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Area", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Phlebotomist", key: "phlebotomist", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PT", key: "priority", type: gridColumnTypes.status, align: "center" },
    { heading: "Tran-DateTime", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
    { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.LabPatientRegistration,
    apiUrl: "HomeCollection/HomeCollectionRegistrationInfoList",
    columnsList: this.allcolumns,
    sortField: "HomeCollectionId",
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
    this.onChangeFirst();
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
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "HomeCollection/HomeCollectionRegistrationInfoList",
      columnsList: this.allcolumns,
      sortField: "HomeCollectionId",

      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    // this.GetAppointdetail();
  }

  onnew(row: any = null) {
    const dialogRef = this._matDialog.open(NewCollectionComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }

  onBillProcess(row: any = null) {
    const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: { mode: 'home', row }
      });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result == 'home') {
        this.router.navigate(['/LabManagement/lab-patientreg']);
      }
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }

  OnCancel(data: any) {
    Swal.fire({
      title: 'Do you want to cancel Home Collection?',
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
        const submitData = {
          homeCollectionId: data.homeCollectionId,
          isCancelledBy: this._loggedService.currentUserValue.userId,
          cancelReason: result.value
        };
        console.log(submitData);
        this._homeCollectionService.OnCancel(submitData).subscribe((res) => {
          this.toastr.success(res.message);
          this.grid.bindGridData();
        });
      }
    });
  }
}
