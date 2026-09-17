import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { DischargeSummaryComponent } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ClinicalCareChartService } from '../../clinical-care-chart/clinical-care-chart.service';
import { DietRequestService } from '../diet-request.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-diet-request',
  templateUrl: './new-diet-request.component.html',
  styleUrls: ['./new-diet-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDietRequestComponent {

  displayedColumns = [
    'CheckBox',
    'regno',
    'patientName',
    'roomName',
  ];

  autocompleteward: string = "Room";
  currentDate = new Date();
  vDepartmentName: any;
  vpatientName: any;
  vDoctorname: any;
  vAgeYear: any;
  vAgeDay: any;
  vAgeMonth: any;
  vRegNo: any;
  sIsLoading: string = "";
  dataSource = new MatTableDataSource<any>();

  DietForm: FormGroup;
  dietmenuForm: FormGroup;

  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator;

  autocompleteModedietMenu: string = "DietMenu";
  autocompleteModemealType: string = "MealType";
  autocompleteModedietType: string = "DietType";
  autocompleteModedietReisc: string = "DietRestiction";
  autocompleteModeallergy: string = "Allergy";

  constructor(
    public _ClinicalcareService: DietRequestService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.GetPatientdetail();
    this.DietForm = this.CreatedietForm();
    this.DietForm.markAllAsTouched();

    this.dietmenuForm = this.createDietReqForm()
  }

  CreatedietForm() {
    return this._formbuilder.group({
      dietMenuId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mealTypeId: [1],
      dietTypeId: [1],
      dietRestrictionId: [0],
      allergyId: [0],
      nutritionistId: [1],
      // comments: [''],
    })
  }

  createDietReqForm() {
    return this._formbuilder.group({
      dietReqId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: [this.datePipe.transform(new Date, 'yyyy-MM-dd')],
      time: [new Date()],
      unitId: [this.accountService.currentUserValue.user.unitId],
      dietReqNo: "12", //--> auto increment
      dietMenuId: [0],

      tDietPatReqDetails: this._formbuilder.array([]),
    })
  }

  createDietDetReqDetails(item: any, dietFormValue: any): FormGroup {
    return this._formbuilder.group({
      dietReqDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietReqId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      orderDate: [this.datePipe.transform(new Date, 'yyyy-MM-dd')],
      orderTime: [new Date()],
      opipid: [item.admissionID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: 1,
      dietMenuId: [dietFormValue.dietMenuId],
      mealTypeId: [dietFormValue.mealTypeId],
      dietTypeId: [dietFormValue.dietTypeId],
      dietRestrictionId: [dietFormValue.dietRestrictionId],
      allergyId: [dietFormValue.allergyId],
      nutritionistId: [dietFormValue.nutritionistId],
      isPriority: true,
      comments: [item.comments ?? ''],
      status: 0,
      isAccept: false,
      isAcceptedBy: 0,
      isAcceptedDateTime: ['1900-01-01'],
      isDelived: false,
      isDelivedBy: 0,
      isDelivedDateTime: ['1900-01-01'],
    });
  }

  get dietDetailsArray(): FormArray {
    return this.dietmenuForm.get('tDietPatReqDetails') as FormArray;
  }

  //////////////////////////////////////// main patient list ////////////////////////////////////////
  @ViewChild('grid5') grid5: AirmidTableComponent;
  gridConfig5: gridModel = new gridModel();
  pname = "%"
  wardid = '0'
  doctorid = '0'
  getPatientListwardWise() {
    this.gridConfig5 = {
      apiUrl: "ClinicalCare/AdmisionListNursingList",
      columnsList: [
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bed", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "PatientName", fieldValue: this.pname, opType: OperatorComparer.Equals },
        { fieldName: "WardId", fieldValue: this.wardid, opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: this.doctorid, opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid5.gridConfig = this.gridConfig5;
      this.grid5.bindGridData();
    });
  }

  selection = new SelectionModel<any>(true, []); // true = multi-select

  // Whether the number of selected elements matches the total number of (enabled) rows
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const enabledRows = this.dataSource.data.filter(row => !row.disabled);
    return numSelected === enabledRows.length && enabledRows.length > 0;
  }

  // Whether some but not all rows are selected (for indeterminate state)
  isSomeSelected(): boolean {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  // Selects all rows if not all selected; otherwise clears selection
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data
        .filter(row => !row.disabled)
        .forEach(row => this.selection.select(row));
    }
  }

  areAllRowsDisabled(): boolean {
    return this.dataSource.data.every(row => row.disabled);
  }

  removeChip(contact: any): void {
    this.selection.toggle(contact); // deselect — this also unchecks the row's mat-checkbox automatically
  }

  GetPatientdetail() {

    // debugger
    const filters: any[] = [];

    filters.push(

      {
        "fieldName": "PatientName",
        "fieldValue": this.pname,
        "opType": "Equals"
      },
      {
        "fieldName": "WardId",
        "fieldValue": String(this.wardid),
        "opType": "Equals"
      },
      {
        "fieldName": "DoctorId",
        "fieldValue": String(this.doctorid),
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "RegNo",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    console.log(data)
    this._ClinicalcareService.getSampleRecivedlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
    });
  }

  onChangeFirst() {
    debugger
    this.pname = this._ClinicalcareService.MyForm.get('PatientName').value + '%'
    this.wardid = this._ClinicalcareService.MyForm.get('WardName').value

    if (!this.wardid) {
      this.wardid = "0";
    }
    this.GetPatientdetail();
  }

  getSelectedObjward(value) {
    if (value.value !== 0)
      this.wardid = value.value
    else
      this.wardid = "0"
    this.onChangeFirst();
  }

  Clearfilter(event) {
    if (event == 'PatientName')
      this._ClinicalcareService.MyForm.get('PatientName').setValue("")
    this.onChangeFirst();
  }

  registerObj: any;
  vAdmission: any;
  vipdNo: any;
  isShowPrintButtons: boolean = false;
  getpatientDet(obj) {
    console.log(obj)

    this.isShowPrintButtons = true

    this.registerObj = obj;
    this.vpatientName = obj.patientName;
    this.vDoctorname = obj.doctorName;
    this.vAgeYear = obj.ageYear;
    this.vDepartmentName = obj.departmentName
    this.vAgeMonth = obj.ageMonth;
    this.vAgeDay = obj.ageDay;
    this.vRegNo = obj.regNo;
    this.vAdmission = this.registerObj.admissionID
    this.vipdNo = this.registerObj.ipdNo
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////

  onSave() {
    if (this.selection.selected.length === 0) {
      Swal.fire('Error!', 'Please select Patient', 'error');
      return;
    }

    const dietFormValue = this.DietForm.value;

    this.dietDetailsArray.clear();
    this.selection.selected.forEach(item => {
      this.dietDetailsArray.push(this.createDietDetReqDetails(item, dietFormValue));
    });

    console.log('Final array value:', this.dietDetailsArray.value);

    this.dietmenuForm.patchValue({
      dietReqId:0,
      dietMenuId: dietFormValue.dietMenuId
    });

    const payload = this.dietmenuForm.value;
    console.log('Final payload:', payload);

    this._ClinicalcareService.SaveDietReq(payload).subscribe(() => {
            this._matDialog.closeAll();
        });
  }

}
export class PatientList {
  DoctorName: any;
  AgeYear: any;
  PatientName: string;
  DepartmentName: string;
  RegNo: any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0;
    }
  }
}
export class PainAssesList {
  givendate: any;
  giventime: any;
  PainAssess: any;
  Employeename: string;

  constructor(PainAssesList) {
    {

      this.givendate = PainAssesList.givendate || 0;
      this.giventime = PainAssesList.giventime || 0;
      this.PainAssess = PainAssesList.PainAssess || 0;
      this.Employeename = PainAssesList.Employeename || "";
    }
  }
}
export class VitalsList {
  date: any;
  time: any;
  temperature: any;
  Temperature: any;
  Pulse: any;
  pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  cvp: any;
  peep: any;
  constructor(VitalsList) {
    {

      this.date = VitalsList.date || 0;
      this.time = VitalsList.time || 0;
      this.temperature = VitalsList.temperature || 0;
      this.Pulse = VitalsList.Pulse || 0;
      this.pulse = VitalsList.pulse || 0;
      this.Respiration = VitalsList.Respiration || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.BP = VitalsList.BP || 0;
      this.MewaScore = VitalsList.MewaScore || 0;
      this.AVPU = VitalsList.AVPU || 0;
      this.TakenBy = VitalsList.TakenBy || 0;
      this.CVP = VitalsList.CVP || 0;
      this.cvp = VitalsList.cvp || 0
      this.peep = VitalsList.peep || 0
    }
  }
}
export class SugarlevelList {
  Date: any;
  BSL: any;
  bsl: any;
  UrineSugar: any;
  ETTpressure: any;
  UrineKetone: any;
  Bodies: any;
  IntakeMode: any;
  bodies: any;
  intakeMode: any;
  ReportedToRMO: any;
  Addedby: any;
  CVP: any;
  constructor(SugarlevelList) {
    {

      this.Date = SugarlevelList.Date || 0;
      this.BSL = SugarlevelList.BSL || 0;
      this.bsl = SugarlevelList.bsl || 0;
      this.UrineSugar = SugarlevelList.UrineSugar || 0;
      this.ETTpressure = SugarlevelList.ETTpressure || 0;
      this.Bodies = SugarlevelList.Bodies || 0;
      this.bodies = SugarlevelList.bodies || 0;
      this.intakeMode = SugarlevelList.intakeMode || 0;
      this.IntakeMode = SugarlevelList.IntakeMode || 0;
      this.ReportedToRMO = SugarlevelList.ReportedToRMO || 0;
      this.Addedby = SugarlevelList.Addedby || 0;
      this.UrineKetone = SugarlevelList.UrineKetone || 0;
    }
  }
}
export class OxygenVentilatorlist {
  Date: any;
  Mode: any;
  TidolV: any;
  setRange: any;
  ipap: any;
  MinuteV: any;
  rateTotal: any;
  epap: any;
  peep: any;
  pc: any;
  mvpercentage: any;
  prSup: any;
  fio2: any;
  ie: any;
  oxygenRate: any;
  saturationWithO2: any;
  flowTrigger: any;
  CreatedBy: any;
  tidolV: any;
  constructor(OxygenVentilatorlist) {
    {
      this.Date = OxygenVentilatorlist.Date || 0;
      this.Mode = OxygenVentilatorlist.Mode || 0;
      this.TidolV = OxygenVentilatorlist.TidolV || 0;
      this.tidolV = OxygenVentilatorlist.tidolV || 0
      this.setRange = OxygenVentilatorlist.setRange || 0;
      this.ipap = OxygenVentilatorlist.ipap || 0;
      this.MinuteV = OxygenVentilatorlist.MinuteV || 0;
      this.rateTotal = OxygenVentilatorlist.rateTotal || 0;
      this.epap = OxygenVentilatorlist.epap || 0;
      this.pc = OxygenVentilatorlist.pc || 0;
      this.peep = OxygenVentilatorlist.peep || 0;
      this.mvpercentage = OxygenVentilatorlist.mvpercentage || 0;
      this.prSup = OxygenVentilatorlist.prSup || 0;
      this.fio2 = OxygenVentilatorlist.fio2 || 0;
      this.ie = OxygenVentilatorlist.ie || 0;
      this.oxygenRate = OxygenVentilatorlist.oxygenRate || 0;
      this.saturationWithO2 = OxygenVentilatorlist.saturationWithO2 || 0;
      this.flowTrigger = OxygenVentilatorlist.flowTrigger || 0;
      this.CreatedBy = OxygenVentilatorlist.CreatedBy || 0;
    }
  }
}

export class INputOutputList {
  date: any;
  time: any;
  Temperature: any;
  temperature: any;
  Pulse: any;
  pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any;
  CVP: any;
  cvp: any;
  peep: any;
  constructor(INputOutputList) {
    {

      this.date = INputOutputList.date || 0;
      this.time = INputOutputList.time || 0;
      this.temperature = INputOutputList.temperature || 0;
      this.Pulse = INputOutputList.Pulse || 0;
      this.pulse = INputOutputList.pulse || 0;
      this.Respiration = INputOutputList.Respiration || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.BP = INputOutputList.BP || 0;
      this.MewaScore = INputOutputList.MewaScore || 0;
      this.AVPU = INputOutputList.AVPU || 0;
      this.TakenBy = INputOutputList.TakenBy || 0;
      this.CVP = INputOutputList.CVP || 0;
      this.cvp = INputOutputList.cvp || 0
      this.peep = INputOutputList.peep || 0
    }
  }
}

