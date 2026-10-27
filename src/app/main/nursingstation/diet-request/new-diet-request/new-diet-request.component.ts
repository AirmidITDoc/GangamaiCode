import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
DietForm: FormGroup;
  dietmenuForm: FormGroup;
  MyForm: FormGroup;
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
  dietReqId = 0
  registerObj: any;
  vAdmission: any;
  vipdNo: any;
  DietMenuName = ''
  dietMenuDetails = ''

  isShowPrintButtons: boolean = false;
  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator;

  autocompleteModedietMenu: string = "MDietMenuMaster";
  autocompleteModemealType: string = "MMealTypeMaster";
  autocompleteModedietType: string = "MDietTypeMaster";
  autocompleteModedietReisc: string = "DietRestiction";
  autocompleteModeallergy: string = "Allergy";

  constructor(
    public _DietRequestService: DietRequestService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _formbuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {

    console.log(this.data)
    this.GetPatientdetail();
    this.DietForm = this.CreatedietForm();
    this.DietForm.markAllAsTouched();

    this.dietmenuForm = this.createDietReqForm()
    this.MyForm = this.createMyForm()
    if (this.data) {

      this.registerObj = this.data
      this.dietReqId = this.data.dietReqId

      this.DietForm.get('dietMenuId').setValue(this.registerObj.dietMenuId)
      this.GetPatientdetail(() => {
        if (this.data) {
          this.GetDetails();
        }
      });
    }

  }

  createMyForm() {
    return this._formbuilder.group({
      WardName: [''],
      RegID: [''],
      PatientName: ['']

    })
  }
  CreatedietForm() {
    return this._formbuilder.group({
      dietMenuId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mealTypeId: [0],
      dietTypeId: [0],
      dietRestrictionId: [0],
      allergyId: [0],
      nutritionistId: [1],

    })
  }

  createDietReqForm() {
    return this._formbuilder.group({
      dietReqId: [this.dietReqId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: [this.datePipe.transform(new Date, 'yyyy-MM-dd')],
      time: [new Date()],
      unitId: [this.accountService.currentUserValue.user.unitId],
      dietReqNo: "1",
      dietMenuId: [0],

      tDietPatReqDetails: this._formbuilder.array([]),
    })
  }

  createDietDetReqDetails(item: any, dietFormValue: any): FormGroup {

    return this._formbuilder.group({
      dietReqDetId: [item.dietReqDetId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietReqId: [this.dietReqId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      orderDate: [this.datePipe.transform(new Date, 'yyyy-MM-dd')],
      orderTime: [new Date()],
      opipid: [item.admissionID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: 1,
      dietMenuId: [dietFormValue.dietMenuId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mealTypeId: [dietFormValue.mealTypeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dietTypeId: [dietFormValue.dietTypeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dietRestrictionId: [dietFormValue.dietRestrictionId],
      allergyId: [dietFormValue.allergyId],
      nutritionistId: [dietFormValue.nutritionistId],
      isPriority: true,
      comments: [item.comments ?? ''],
      status: 0,
      isAccept: [!!item.isAccept],
      isAcceptedBy: [item.isAcceptedBy ?? 0],
      isAcceptedDateTime: [item.isAccept && item.isAcceptedDateTime ? item.isAcceptedDateTime : '1900-01-01'],
      isDelived: [!!item.isDelivered],
      isDelivedBy: [item.isDelivedBy ?? 0],
      isDelivedDateTime: [item.isDelivered && item.isDelivedDateTime ? item.isDelivedDateTime : '1900-01-01'],
    });
  }

  get dietDetailsArray(): FormArray {
    return this.dietmenuForm.get('tDietPatReqDetails') as FormArray;
  }


  @ViewChild('grid5') grid5: AirmidTableComponent;
  gridConfig5: gridModel = new gridModel();
  pname = "%"
  wardid = '0'
  doctorid = '0'
  getPatientListwardWise() {
    this.gridConfig5 = {
      apiUrl: "ClinicalCare/AdmisionListNursingList",
      columnsList: [
        // { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Bed", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
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
    const toggleable = this.dataSource.data.filter(row => !this.isLocked(row));
    return toggleable.length > 0 &&
      toggleable.every(row => this.selection.isSelected(row));
  }
  // Whether some but not all rows are selected (for indeterminate state)
  isSomeSelected(): boolean {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  areAllRowsDisabled(): boolean {
    return this.dataSource.data.every(row => row.disabled);
  }

  removeChip(contact: any): void {
    if (contact.isAccept) return;
    this.selection.deselect(contact);
  }
  remove(row: any) {
    if (row.isAccept) return;
  }

  editComment(row: any) {
    if (row.isAccept) return;

  }


  GetPatientdetail(onLoaded?: () => void) {
    const filters: any[] = [];

    filters.push(
      { "fieldName": "PatientName", "fieldValue": this.pname, "opType": "Equals" },
      { "fieldName": "WardId", "fieldValue": String(this.wardid), "opType": "Equals" },
      { "fieldName": "DoctorId", "fieldValue": String(this.doctorid), "opType": "Equals" }
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

    this._DietRequestService.getSampleRecivedlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      if (onLoaded) onLoaded();
    });
  }
  onChangeFirst() {

    this.pname = this.MyForm.get('PatientName').value + '%'
    this.wardid = this.MyForm.get('WardName').value

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
      this.MyForm.get('PatientName').setValue("")
    this.onChangeFirst();
  }


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

  onSave() {
    if (this.selection.selected.length === 0) {
      Swal.fire("Please select at least one patient from the list.")
      return;
    }

    const dietFormValue = this.DietForm.value;

    this.dietmenuForm.patchValue({
      dietReqId: this.dietReqId,
      dietMenuId: dietFormValue.dietMenuId,
      mealTypeId: dietFormValue.mealTypeId,
      dietTypeId: dietFormValue.dietTypeId,

    });


    this.dietDetailsArray.clear();
    this.selection.selected.forEach(item => {
      this.dietDetailsArray.push(this.createDietDetReqDetails(item, dietFormValue));
    });

    console.log('Final array value:', this.dietDetailsArray.value);
    const payload = this.dietmenuForm.value;
    console.log('Final payload:', payload);

    if (!this.DietForm.invalid) {
      this._DietRequestService.SaveDietReq(payload).subscribe(() => {
        this._matDialog.closeAll();
      });
    }
    else {
      const invalidFields = [];

      if (this.DietForm.invalid) {
        for (const controlName in this.DietForm.controls) {
          if (this.DietForm.controls[controlName].invalid) {
            invalidFields.push(`Diet  Form: ${controlName}`);
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

  GetMenu($event) {

    console.log($event)

    this.DietMenuName = $event.text
    const filters: any[] = [];

    filters.push(
      { fieldName: "DietMenuName", fieldValue: this.DietMenuName, opType: OperatorComparer.StartsWith },
      { fieldName: "MealName", fieldValue: "0", opType: OperatorComparer.StartsWith },
      { fieldName: "DietName", fieldValue: "0", opType: OperatorComparer.StartsWith }
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "DietMenuid",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };

    this._DietRequestService.getMenuItem(data).subscribe((response) => {

      const ItemDetails = response.data || [];
      this.dietMenuDetails = response.data[0].dietMenuDetails

      console.log(response.data)
    })
  }

  GetDetails() {
    const filters: any[] = [];

    filters.push(
      { fieldName: "DietReqId", fieldValue: String(this.dietReqId), opType: OperatorComparer.Equals }
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "DietReqDetId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };

    this._DietRequestService.getdetaillist(data).subscribe((response) => {
      const existingDetails = response.data || [];
      console.log(response)

      if (existingDetails.length) {
        this.DietForm.get('mealTypeId').setValue(existingDetails[0].mealTypeId);
        this.DietForm.get('dietTypeId').setValue(existingDetails[0].dietTypeId);
      }

      existingDetails.forEach((detail: any) => {
        const matchedRow = this.dataSource.data.find(
          row => Number(row.admissionID) === Number(detail.opipid)
        );
        if (matchedRow) {
          matchedRow.comments = detail.comments ?? '';
          matchedRow.dietReqDetId = detail.dietReqDetId;
          matchedRow.isAccept = !!detail.isAccept;
          matchedRow.isAcceptedBy = detail.isAcceptedBy ?? 0;
          matchedRow.isAcceptedDateTime = detail.isAcceptedDateTime;   // check the exact field name in your response
          matchedRow.isDelivered = !!detail.isDelivered;
          matchedRow.isDelivedBy = detail.isDelivedBy ?? 0;
          matchedRow.isDelivedDateTime = detail.isDelivedDateTime;     // check the exact field name in your response
          this.selection.select(matchedRow);
        }
      });
    });
  }
  masterToggle(): void {
    const toggleable = this.dataSource.data.filter(row => !this.isLocked(row));
    if (this.isAllSelected()) {
      toggleable.forEach(row => this.selection.deselect(row));
    } else {
      toggleable.forEach(row => this.selection.select(row));
    }
  }

  //
  private isLocked(row: any): boolean {
    return !!(row.disabled || row.isAccept);
  }
  onCommentChange(item: any, value: string) {

    item.comments = value;
    console.log('Updated comment for', item.patientName, '→', item.comments, item);
  }
  onClose() {
    this.MyForm.get('PatientName').setValue('')
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
