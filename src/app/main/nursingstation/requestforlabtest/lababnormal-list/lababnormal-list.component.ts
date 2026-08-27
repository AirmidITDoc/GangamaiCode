import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from '../../nursingnote/nursingnote.component';
import { CasepaperService } from 'app/main/opd/new-casepaper/casepaper.service';
import { gridResponseType } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';
import * as XLSX from 'xlsx';
import { labRadList } from 'app/main/opd/new-casepaper/new-casepaper.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-lababnormal-list',
  templateUrl: './lababnormal-list.component.html',
  styleUrls: ['./lababnormal-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LababnormalListComponent {
  public dsResultViewList = new MatTableDataSource<MedicineItemList>();
  public dsList = new MatTableDataSource<MedicineItemList>();
  public displayedResultViewColumns =
    ['sequence', 'TestName', 'ParameterName', 'ResultValue', 'Flag', 'Arrow', 'NormalRange'];
     public dsColumn =
    ['sequence', 'TestName', 'ParameterName', 'ResultValue', 'Flag', 'Arrow', 'NormalRange'];

  gridResponseType = gridResponseType;
  currentType: string = 'viewAll';
  showExportButton: boolean = true;
  name=''

  constructor(
    private _CasepaperService: CasepaperService,
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    private _httpClient: ApiCaller,
    public dialogRef: MatDialogRef<LababnormalListComponent>,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.row) {
      console.log("List:", this.data.row)
      this.name=this.data.patientName
      this.getAbnormalList('viewAll');
    }
  }

  getAbnormalList(type: string) {
    // debugger
    let abnormalValue = '';
    let pathReportId = '0';
    this.currentType = type;
    this.showExportButton =true;
    this.showSpecificResultTable = false;

    switch (type) {

      case 'abnormal':
        abnormalValue = 'b';
        pathReportId = '0';
        break;

      case 'viewAll':
        abnormalValue = '%';
        pathReportId = '0';
        break;
    }

    const param = {
      searchFields: [
        {
          fieldName: "OPD_IPD_ID",
          fieldValue: String(this.data.vOPIPId),
          opType: "Equals"
        },
        {
          fieldName: "OPD_IPD_Type",
          fieldValue: String(this.data.opipType),
          opType: "Equals"
        },
        {
          fieldName: "PathReportId",
          fieldValue: "0",//String(this.data?.row?.pathReportID),
          // fieldValue: pathReportId,
          opType: "Equals"
        },
        {
          fieldName: "Abnormal",
          fieldValue: abnormalValue,
          opType: "Equals"
        }
      ],
      mode: "PathologyResultListabnormal"
    };

    this._CasepaperService
      .getabnormalLabResultView(param)
      .subscribe((response) => {

        this.dsResultViewList.data = response || [];

        console.log(this.dsResultViewList.data);
      });
  }

  dsLab = new MatTableDataSource<labRadList>();
  LabMap: { [key: string]: labRadList[] } = {};
  @ViewChild('labSort') labSort!: MatSort;
  labColumns: string[] = [
    'labDate',
    'ServiceName',
    'BillNo',
    'PatientType'
  ]

  getLabdata() {
    
    this.showExportButton =false;
    this.currentType = 'viewSpecific';
    const D_data = {
      first: 0,
      rows: 999,
      sortField: "VisitId",
      sortOrder: 0,
      filters: [
        { fieldName: "OPIPId", fieldValue: String(this.data.vOPIPId), opType: "Equals" },
        { fieldName: "OPIPType", fieldValue: String(this.data.opipType), opType: "Equals" }
      ],
      exportType: "JSON",
      columns: []
    };

    this._CasepaperService.getLabRadList(D_data).subscribe(Visit => {
      const allData = Visit.data as labRadList[];
      this.LabMap[this.data.vOPIPId] = allData.filter(item => item.patientType === 'PathologyTestList');
      this.dsLab.data = this.LabMap[this.data.vOPIPId];
    });
  }

  showSpecificResultTable = false;
  getAbnormalSpecificList(row: any) {
    const param = {
      searchFields: [
        { fieldName: "OPD_IPD_ID", fieldValue: String(this.data.vOPIPId), opType: "Equals" },
        { fieldName: "OPD_IPD_Type", fieldValue: String(this.data.opipType), opType: "Equals" },
        { fieldName: "PathReportId", fieldValue: String(row?.pathReportID), opType: "Equals" },
        { fieldName: "Abnormal", fieldValue: '%', opType: "Equals" }
      ],
      mode: "PathologyResultListabnormal"
    };

    this._CasepaperService.getabnormalLabResultView(param).subscribe((response: any) => {
      this.dsList.data = response || [];   // <-- likely bug: use response.data, not response
      this.showSpecificResultTable = true;
      console.log('Specific result:', this.dsList.data);
    });
  }

  onExportClick() {
    const dataToExport = this.dsResultViewList.data;

    if (!dataToExport || !dataToExport.length) {
      // optional: show a toast/snackbar saying "No data to export"
      return;
    }

    // map only the columns you actually want in the file,
    // with clean, readable header names
    const exportData = dataToExport.map((row: any) => ({
      'Test Name': row.TestName,
      'Parameter': row.ParameterName,
      'Result': row.ResultValue,
      'Flag': row.ParaBoldFlag,
      'Normal Range': row.NormalRange
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'AbnormalResults': worksheet },
      SheetNames: ['AbnormalResults']
    };

    XLSX.writeFile(workbook, `AbnormalLabResult_${new Date().getTime()}.xlsx`);
  }

  onClose() {
    this.dialogRef.close();
  }
}
