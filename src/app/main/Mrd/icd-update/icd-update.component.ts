import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { IcdUpdateService } from './icd-update.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-icd-update',
  templateUrl: './icd-update.component.html',
  styleUrls: ['./icd-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IcdUpdateComponent {

  IcdUpdateForm: FormGroup;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  ////////////// search variables /////////////
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
  vopIpId: any;
  vRegNo: any;

  IpFilterDisable = false;
  ////////////// search variables /////////////

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
  }


  allcolumns = [
    { heading: "ICD Diagnosis Name", key: "diagnosisName", sort: true, align: 'left', emptySign: 'NA', width: 600 },
    { heading: "ICD version", key: "icdversion", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "ICD Code", key: "icdcode", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },

    // {
    //     heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
    //         {
    //             action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.MICDE_Master, permissionType.Edit), callback: (data: any) => {
    //                 this.onSave(data);
    //             }
    //         }, {
    //             action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.MICDE_Master, permissionType.Delete), callback: (data: any) => {
    //                 this._ICDEMasterService.deactivateTheStatus(data.icdid).subscribe((data: any) => {
    //                     this.grid.bindGridData();
    //                 });
    //             }
    //         }]
    // }
  ]

  allfilters = [
    { fieldName: "DiagnosisName", fieldValue: "", opType: OperatorComparer.StartsWith },
    // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: "MIcdDiagnosisMaster/List",
    columnsList: this.allcolumns,
    sortField: "Icdid",
    sortOrder: 0,
    filters: this.allfilters
  }
  createICDUpdateForm(): FormGroup {
    return this._formBuilder.group({
      opIpId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: [true],
    });
  }
  onSearch() { }

  onSearchClear() {
    this._IcdUpdateSerivce.myformSearch.reset({
      DoseNameSearch: ""
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

}
