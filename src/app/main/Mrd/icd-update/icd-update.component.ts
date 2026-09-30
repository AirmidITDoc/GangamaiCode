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


  constructor(
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public permissionService: PagePermissionService,
    public _IcdUpdateSerivce: IcdUpdateService,
    private _formBuilder: FormBuilder,
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

    { heading: "Diagnosis Id", key: "ipdiagId", sort: true, align: 'left', emptySign: 'NA', width: 90 },

    { heading: "Admission Id", key: "admId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Age", key: "ageGender", sort: true, align: 'left', emptySign: 'NA', width: 140 },
    { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "ICD Code", key: "icdcode", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "ICDE Diagnosis Name", key: "diagnosis", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    { heading: "Diagnosis ", key: "diagnosisinformation", sort: true, align: 'left', emptySign: 'NA', width: 350 },

    { heading: "Created By ", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 220 },

    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allfilters = [
    { fieldName: "AdmId", fieldValue: String(this.vopIpId), opType: OperatorComparer.Equals },
    { fieldName: "IPDiagId", fieldValue: this.IPDiagId, opType: OperatorComparer.Equals }
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

      AdmId: '',
      IPDiagId: ''
    });
  }

  getSelectedObjIP(obj: any): void {
    console.log("icd-update", obj)
    if ((obj?.regID ?? 0) > 0) {

      this.patientDetailsObj = obj;

      this.vPatientName =
        (obj.firstName || '') + ' ' +
        (obj.middleName || '') + ' ' +
        (obj.lastName || '');

      this.vRegNo = obj.regNo
      this.vgender = obj.genderName
      this.vDOA = obj.admissionDate;
      this.vRefDocName = obj.refDocName;
      this.vPatientType = obj.patientType;
      this.vTariffName = obj.tariffName;
      this.vCompanyName = obj.companyName;
      this.vRoomName = obj.roomName;
      this.vBedName = obj.bedName;
      this.vopIpId = obj.admissionID;

      console.log('Search Patient Info:', this.patientDetailsObj);
    }
  }
  Clearfilter(event) {
    console.log(event)
    if (event == 'AdmId')
      this.myFilterform.get('AdmId').setValue("")
    if (event == 'IPDiagId')
      this.myFilterform.get('IPDiagId').setValue("")

    this.onChangeFirst();
  }

  onChangeFirst() {
    this.vopIpId = this.myFilterform.get('AdmId').value
    this.IPDiagId = this.myFilterform.get('IPDiagId').value

    this.getfilterdata();
  }

  getfilterdata() {


    let AdmId = this.myFilterform.get("AdmId").value || "";
    this.gridConfig = {
      apiUrl: "MRDDiagnosisInfo/MRDDiagnosisInfoList",
      columnsList: this.allcolumns,
      sortField: "IPDiagId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmId", fieldValue: this.vopIpId, opType: OperatorComparer.Equals },
        { fieldName: "IPDiagId", fieldValue: this.IPDiagId, opType: OperatorComparer.Equals }
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
        width: '100%',
        height: "80vh",
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();

    });
  }
}
