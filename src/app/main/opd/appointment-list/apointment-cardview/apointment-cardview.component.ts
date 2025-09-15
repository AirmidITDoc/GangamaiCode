import { DatePipe } from '@angular/common';
import { Component, HostBinding, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidCardViewComponent } from 'app/main/shared/componets/airmid-card-view/airmid-card-view.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppointmentlistService } from '../appointmentlist.service';
import { VisitMaster1 } from '../appointment-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { NewRegistrationComponent } from '../../registration/new-registration/new-registration.component';

@Component({
  selector: 'app-apointment-cardview',
  templateUrl: './apointment-cardview.component.html',
  styleUrls: ['./apointment-cardview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ApointmentCardviewComponent {
  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex') flex = '1 1 auto';
  @HostBinding('style.minHeight') minH = '0';
  @HostBinding('style.flexDirection') dir = 'column';

  myuserform: FormGroup;
  myformSearch: FormGroup;

  mNo: any;
  f_name: any = "%"
  regNo = 0;
  l_name: any = "%"
  IsMark = "2"

  ngOnInit(): void {
    this.myuserform = this.filterForm();
    this.myformSearch = this.filterForm();
    // this.GetAppointdetail()
  }
  pageSize = 25;
  resultsLength = 0;
  autocompletedepartment: string = "Department";
  statusOptions = [
    { text: 'All', value: '' },
    { text: 'IsActive', value: '1' },
    { text: 'IsDeactive', value: '0' }
  ];

  // Add view mode and user data for card view
  viewMode: 'table' | 'card' = 'card';
  userList: any[] = [];

  // Card view config and pagination
  cardConfig = {
    fields: [
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'UHID', key: 'regNoWithPrefix' },
      { label: 'OPDNo', key: 'opdNo' },
      { label: 'DepartmentName', key: 'departmentName' },
      { label: 'Doctor Name', key: 'doctorname' },
      { label: 'MobileNo', key: 'mobileNo' },
      { label: 'PatientType', key: 'patientType' },
      { label: 'RefDocName', key: 'refDocName' },
      { label: 'Is Active', key: 'isActive' }
    ],
    actions: [
      { icon: 'remove_red_eye', tooltip: 'View Password', action: 'viewPassword' },
      { icon: 'edit', tooltip: 'Edit', action: 'edit' },
      { icon: 'delete', tooltip: 'Delete', action: 'delete' }
    ]
  };

  constructor(private _formBuilder: UntypedFormBuilder, public datePipe: DatePipe, public _AppointmentlistService: AppointmentlistService,
    public _matDialog: MatDialog, public toastr: ToastrService, private _FormvalidationserviceService: FormvalidationserviceService) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild(AirmidCardViewComponent) cardView: AirmidCardViewComponent;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    // this.gridConfig.columnsList.find(col => col.key === 'doctorID')!.template = this.docIcon;

    this.gridConfig.columnsList.find(col => col.key === 'patientOldNew')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'mPbillNo')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'phoneAppId')!.template = this.actionsTemplate2;
    this.gridConfig.columnsList.find(col => col.key === 'crossConsulFlag')!.template = this.actionsTemplate3;
    this.gridConfig.columnsList.find(col => col.key === 'isConvertRequestForIp')!.template = this.actionsTemplate4;
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
  @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
  @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  // @ViewChild('actionButtonTemplate') actionButtonTemplatebutton!: TemplateRef<any>;
  // @ViewChild('docIcon') docIcon!: TemplateRef<any>;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  DoctorId = "0";
  allfilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals }

  ];
  allcolumns = [
    { heading: "", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "phoneAppId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "crossConsulFlag", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "isConvertRequestForIp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "UHID", key: "regNoWithPrefix", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date", key: "vistDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 230 },

    { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Check-InTime", key: "checkInTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
    { heading: "Check-OutTime", key: "checkOutTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 7 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "VisitDetail/AppVisitList",
    columnsList: this.allcolumns,
    sortField: "VisitId",
    sortOrder: 0,
    filters: this.allfilters
  }



  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      FirstName: [''],
      LastName: [''],
      DoctorId: [0],
      departmentId: [0],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      IsMark: ['2']
    });
  }
  onAfterLoadData(data: any[]) {
    console.log(data)
    this.userList = data;//thia.dataSource
    this.resultsLength = data.length;
  }

  onCardAction(event: { action: string, item: any }) {
    if (event.action === 'viewPassword') {
      // this.PasswordView(event.item);
    } else if (event.action === 'edit') {
      this.onEdit(event.item);
    } else if (event.action === 'delete') {
    }
  }
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  selectChangedepartment(obj: any) {
    if (!obj?.value || obj.value === 0) {
      this.ddlDoctor.options = [];
      return;
    }
    this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      console.log(data);
      this.ddlDoctor.bindGridAutoComplete();
    });
  }
  // filterForm(): FormGroup {
  //   return this._formBuilder.group({
  //     UserName: [''],
  //     FirstName: [''],
  //     LastName: [''],
  //     MobileNo: [''],
  //     storeId: [],
  //     roleId: [],
  //     status: ['']
  //   });
  // }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myformSearch.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myformSearch.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myformSearch.get('RegNo').setValue("")

    this.onChangeFirst1(event);
  }

  onChangeFirst1(event) {

    console.log(event)
    // if (event.key == 13) {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstName').value + "%"
    this.l_name = this.myformSearch.get('LastName').value + "%"
    this.regNo = this.myformSearch.get('RegNo').value
    this.IsMark = this.myformSearch.get('IsMark').value
    this.getfilterdata();
    // }
  }

  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "VisitDetail/AppVisitList",
      columnsList: this.allcolumns,
      sortField: "VisitId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: String(this.DoctorId), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: this.IsMark, opType: OperatorComparer.Equals }

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    // / Update grid based on current view mode
    if (this.viewMode === 'table' && this.grid) {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    } else if (this.viewMode === 'card' && this.cardView) {
      this.cardView.gridConfig = this.gridConfig;
      this.cardView.bindGridData();
    }
  }
  dataSource = new MatTableDataSource<VisitMaster1>();
  GetAppointdetail() {

    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")

    let data =
    {
      "first": 0,
      "rows": 150,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "F_Name",
          "fieldValue": String(this.f_name),
          "opType": "Contains"
        },
        {
          "fieldName": "L_Name",
          "fieldValue": String(this.l_name),
          "opType": "Contains"
        },
        {
          "fieldName": "Reg_No",
          "fieldValue": String(this.regNo),
          "opType": "Equals"
        },
        {
          "fieldName": "Doctor_Id",
          "fieldValue": String(this.DoctorId),
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
          "fieldName": "IsMark",
          "fieldValue": "2",
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
    this._AppointmentlistService.getVisitlist(data).subscribe((response) => {
      this.dataSource.data = response.data;

    });
  }

  onEdit(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    let that = this;
    const dialogRef = this._matDialog.open(NewRegistrationComponent,
      {
        maxWidth: "95vw",
        maxHeight: '90%',
        width: '90%',
        data: row

      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (that.viewMode === 'table' && that.grid) {
          that.grid.bindGridData();
        } else if (that.viewMode === 'card' && that.cardView) {
          that.cardView.bindGridData();
        }
      }
    });
  }

  Password: string;

  // PasswordView(contact) {

  //   const today = new Date();
  //   const Currentyear = today.getFullYear()
  //   this.Password = (contact.userLoginName + "@" + Currentyear)
  //   Swal.fire({
  //     title: 'Your Password is ' + contact.password,
  //     text: "Do you want to reset Your Password",
  //     icon: "success",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Reset Password"
  //   }).then((flag) => {
  //     if (flag.isConfirmed) {
  //       let submitData = {
  //         "userId": contact.userId,
  //         "userName": contact.userLoginName,
  //         "password": this.Password
  //       }
  //       console.log(submitData);

  //       this._CreateUserService.PasswordUpdate(submitData).subscribe(
  //         (response) => {
  //           this.toastr.success(response.message);
  //           if (this.viewMode === 'table' && this.grid) {
  //             this.grid.bindGridData();
  //           } else if (this.viewMode === 'card' && this.cardView) {
  //             this.cardView.bindGridData();
  //           }
  //         });
  //     }
  //   });
  // }
}

