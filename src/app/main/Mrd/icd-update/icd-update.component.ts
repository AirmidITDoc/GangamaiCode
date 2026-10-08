import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { IcdUpdateService } from './icd-update.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { NewICDEComponent } from './new-icde/new-icde.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-icd-update',
  templateUrl: './icd-update.component.html',
  styleUrls: ['./icd-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IcdUpdateComponent {
  myFilterform: FormGroup;
  IcdUpdateForm: FormGroup;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  patientDetailsObj: any = {};

  vPatientName: any;
  vDOA: any;
  vRefDocName: any;
  vPatientType: any;
  vTariffName: any;
  vCompanyName: any;
  vRoomName: any;
  vBedName: any;
  vgender: any;
  vopIpId: any = 0;
  vRegNo: any;
  admId = "0"
  IPDiagId = "0"
  IpFilterDisable = false;
  IsEdit: boolean = this.permissionService.getPermission(permissionCodes.Membership, permissionType.Edit);
  page: PageNames = PageNames.PATIENT;

  constructor(
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public permissionService: PagePermissionService,
    public _IcdUpdateSerivce: IcdUpdateService,
    private _formBuilder: FormBuilder, public datePipe: DatePipe,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.IcdUpdateForm = this.createICDUpdateForm();
    this.IcdUpdateForm.markAllAsTouched();
    this.myFilterform = this.filterForm()
  }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }
  allcolumns = [
    { heading: "Reg Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },

    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "ICD Code", key: "icdcode", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Diagnosis ", key: "diagnosisinformation", sort: true, align: 'left', emptySign: 'NA', width: 350 },

    { heading: "Created By ", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 220 },

    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "RegNo", fieldValue: String(this.vopIpId), opType: OperatorComparer.Equals },

  ]

  gridConfig: gridModel = {
    apiUrl: "MRDDiagnosisInfo/MRDDiagnosisInfoList",
    columnsList: this.allcolumns,
    sortField: "IPDiagId",
    sortOrder: 0,
    filters: this.allfilters
  }
  createICDUpdateForm(): FormGroup {
    return this._formBuilder.group({
      opIpId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: [true],
    });
  }
  filterForm(): FormGroup {
    return this._formBuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],

      AdmId: ''
    });
  }

  // getSelectedObjIP(obj: any): void {
  //   console.log("icd-update", obj)
  //   if ((obj?.regID ?? 0) > 0) {

  //     this.patientDetailsObj = obj;

  //     this.vPatientName =
  //       (obj.firstName || '') + ' ' +
  //       (obj.middleName || '') + ' ' +
  //       (obj.lastName || '');

  //     this.vRegNo = obj.regNo
  //     this.vgender = obj.genderName
  //     this.vDOA = obj.admissionDate;
  //     this.vRefDocName = obj.refDocName;
  //     this.vPatientType = obj.patientType;
  //     this.vTariffName = obj.tariffName;
  //     this.vCompanyName = obj.companyName;
  //     this.vRoomName = obj.roomName;
  //     this.vBedName = obj.bedName;
  //     this.vopIpId = obj.admissionID;

  //     console.log('Search Patient Info:', this.patientDetailsObj);
  //   }
  // }
  Clearfilter(event) {
    console.log(event)
    if (event == 'AdmId')
      this.myFilterform.get('AdmId').setValue("")
   
    this.onChangeFirst();
  }

  onChangeFirst() {
    this.getfilterdata();
  }

  getfilterdata() {

    let fromDate1 = this.myFilterform.get("fromDate").value || "";
    let toDate1 = this.myFilterform.get("enddate").value || "";
    fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
    toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";

    let AdmId = this.myFilterform.get("AdmId").value || "";
    this.gridConfig = {
      apiUrl: "MRDDiagnosisInfo/MRDDiagnosisInfoList",
      columnsList: this.allcolumns,
      sortField: "IPDiagId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: toDate1, opType: OperatorComparer.Equals },
        { fieldName: "RegNo", fieldValue: AdmId, opType: OperatorComparer.Equals },

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

    if (this.gridConfig) {
      debugger
      setTimeout(() => {

      }, 500);
    }
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
  getICDE() {
    const dialogRef = this._matDialog.open(NewICDEComponent,
      {
        maxWidth: "95vw",
        width: '100%',
        height: "80vh",
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });

  }

  onSave(row: any = null) {
    const that = this;
    const dialogRef = this._matDialog.open(NewICDEComponent,
      {
        maxWidth: "95vw",
        width: '90%',
        height: "80vh",
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();

    });
  }
}
