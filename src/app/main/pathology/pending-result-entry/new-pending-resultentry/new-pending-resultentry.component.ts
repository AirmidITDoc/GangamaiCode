import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SampleDetailObj, SampleList } from '../../result-entry/result-entry.component';
import { Pthologyresult } from '../../result-entry/new-result-entry/new-result-entry.component';
import { ResultEntryService } from '../../result-entry/result-entry.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-new-pending-resultentry',
  templateUrl: './new-pending-resultentry.component.html',
  styleUrls: ['./new-pending-resultentry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPendingResultentryComponent {

  ResultForm: FormGroup
  PathResultForm: FormGroup
  vresultdetailFormGroup: FormGroup
  @ViewChild('PathResultDoctorId') PathResultDoctorId: ElementRef;
  @ViewChild('DoctorId') DoctorId: ElementRef;
  @ViewChild('RefDoctorID') RefDoctorID: ElementRef;
  @ViewChild('helpinput') helpinput: ElementRef;

  displayedColumns2: string[] = [
    'checkbox',
    'TestName',
  ];

  displayedColumns: string[] = [
    'sequence',
    'TestName',
    // 'SubTestName',
    'ParameterName',
    'ResultValue',
    'Flag',
    'NormalRange',
    'Formula'
  ];

  isLoading: string = '';
  Pthologyresult: any = [];
  PathologyDoctorList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  otherForm: FormGroup;
  msg: any;

  selectedAdvanceObj1: SampleDetailObj;
  selectedAdvanceObj2: AdmissionPersonlModel;
  screenFromString = 'Common-form';
  hasSelectedContacts: boolean;
  advanceData: any;
  dataSource = new MatTableDataSource<Pthologyresult>();
  resultdataSource = new MatTableDataSource<Pthologyresult>();
  pendingDS = new MatTableDataSource<SampleList>();

  configDoc: any;
  sIsLoading: string = '';
  AgeType: any = 'YEAR'

  currentDate: Date = new Date();
  autocompleteModeDoctor: string = "ConDoctor";

  isresultdrSelected: boolean = false;
  vPathResultDoctorId: any = 0;
  vDoctorId: any = 0;
  vRefDoctorID: any = 0;
  vsuggation: any = '';
  reportIdData: any = [];
  ServiceIdData: any = [];
  OPIPID: any = 0;
  OP_IPType: any;
  Iscompleted: any;
  vPathReportId: any;
  PathResultDr1: any;
  SexId: any;
  CheckAge: any;
  CheckAgemonth: any = 0
  CheckAgeday: any = 0
  regObj: any;
  FinalAge: any = 0;
  opipnumber = '0'
  ageY = 0
  ageM = 0
  ageD = 0
  genderId = 0
  sampleNo = '0'
  suggestionNotes = ''
  verifyCheck: boolean;
  type: string = '';
  patientName: any;
  resultSource = [];
  selectedRows: any[] = [];

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<SampleList>(true, []);

  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: ResultEntryService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<NewPendingResultentryComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    private configService: ConfigService,
    private commonService: PrintserviceService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _fuseSidebarService: FuseSidebarService) {

    this.type = data?.type;

    if (this.data) {
      console.log(this.data)
      this.verifyCheck = data.verifyCheck

      this.selectedAdvanceObj2 = data.patientdata;
      console.log(this.data.patientdata)

      this.opipnumber = this.data.patientdata.oP_IP_No
      this.ageY = this.data.patientdata.ageYear.trim() || "0"
      this.ageM = this.data.patientdata.ageMonth.trim() || "0"
      this.ageD = this.data.patientdata.ageDay.trim() || "0"
      this.genderId = this.data.patientdata.genderId
      this.sampleNo = this.data.sampleNo.split(" ")[0]
      this.suggestionNotes = this.data.patientdata.suggestionNotes
      this.patientName = this.selectedAdvanceObj2.patientName || ''

      this.OPIPID = this.selectedAdvanceObj2.opdipdid // this.selectedAdvanceObj2.OPD_IPD_ID;
      this.OP_IPType = this.selectedAdvanceObj2.opdipdtype;
      this.SexId = this.selectedAdvanceObj2.genderId;
      if (this.selectedAdvanceObj2.ageYear)
        this.CheckAge = this.selectedAdvanceObj2.ageYear.trim();
      if (this.selectedAdvanceObj2.ageMonth)
        this.CheckAgemonth = this.selectedAdvanceObj2.ageMonth.trim();
      if (this.selectedAdvanceObj2.ageDay)
        this.CheckAgeday = this.selectedAdvanceObj2.ageDay.trim();

      this.reportIdData = [];

      this.regObj = data.RIdData
      this.vPathReportId = this.regObj[0].PathReportId

      this.data.RIdData.forEach((element) => {
        this.reportIdData.push(element.PathReportId)
        this.ServiceIdData.push(element.ServiceId)
        if (element.IsCompleted == "true")
          this.Iscompleted = 1;
        else
          this.Iscompleted = 0
      });


      if (this.selectedAdvanceObj2.ageYear) {
        this.FinalAge = this.selectedAdvanceObj2.ageYear.trim();
        this.AgeType = 'YEAR'
      }
      if (this.selectedAdvanceObj2.ageMonth && this.FinalAge == 0) {
        this.FinalAge = this.selectedAdvanceObj2.ageMonth.trim();
        this.AgeType = 'MONTH'
      }
      if (this.selectedAdvanceObj2.ageDay && this.FinalAge == 0) {
        this.FinalAge = this.selectedAdvanceObj2.ageDay.trim();
        this.AgeType = 'DAY'
      }
    }

    if (this.Iscompleted == 0) {
      if (this.OP_IPType == 1)
        this.getResultListIP(this.selectedAdvanceObj2, this.regObj);
      else
        this.getResultListOP(this.selectedAdvanceObj2, this.regObj);

    } else {
      this.getResultList1(this.regObj);
    }

    this.GetPendingdetailList(this.selectedAdvanceObj2);

  }
  ngOnInit(): void {

    this.otherForm = this.formBuilder.group({
      suggestionNotes: '',
      PathResultDoctorId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      AdmDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      RefDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      vSampleNo: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });

    this.ResultForm = this.createResultInsertForm();
    this.PathResultForm = this.createPathologyResultForm();
    this.pathologyResultArray.push(this.createResultdetailForm());
    this.otherForm.patchValue({ vSampleNo: this.sampleNo || 0 });
    // debugger

    //this code for Pathology doctor set 
    const rawValue = this?.configService?.configParams?.IsPathDoctorId || "";
    const [id, IsPathDoctorId] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
    if (id == "1" && IsPathDoctorId) {
      this.getdoclist(IsPathDoctorId);
    }
  }
  doclist: any = [];
  getdoclist(IsPathDoctorId) {
    this._SampleService.getPathDocList().subscribe(res => {
      // debugger
      this.doclist = res
      if (this.doclist.length) {
        const doctor = this.doclist.find(x => x.doctorId == IsPathDoctorId);
        if (doctor) {
          setTimeout(() => {
            this.otherForm.get('PathResultDoctorId')?.setValue(doctor.doctorId.toString());

            this.vPathResultDoctorId = doctor?.doctorId || 0
          }, 300);

        }
      }
    });
  }

  masterToggle() {
    debugger
    const totalTests = this.pendingDS.data.length;
    const collectedTests = this.pendingDS.data.filter(
      (row: any) => !this.isCheckboxDisabled(row)
    );
    const notCollectedCount = totalTests - collectedTests.length;

    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : collectedTests.forEach(row => this.selection.select(row));
    }

    console.log('Selected items count:', this.selection.selected.length);
    this.resultSource = [...this.selection.selected];
    console.log('Selected items:', this.resultSource);

    const rows = this.selection.selected;   // array of all ticked rows
    if (rows.length) {
      this.loadResultList(rows);
    } else {
      // nothing ticked: clear the right-hand table here if you want
    }
  }

  isSomeSelected() {
    const selectableRows = this.pendingDS.data.filter(
      row => !this.isCheckboxDisabled(row)
    );
    // console.log(this.selection.selected);
    return this.selection.selected.length > 0 &&
      this.selection.selected.length < selectableRows.length;
  }

  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  isAllSelected() {
    const selectableRows = this.pendingDS.data.filter(
      row => !this.isCheckboxDisabled(row)
    );
    const numSelected = this.selection.selected.length;
    const numRows = selectableRows.length; //    this.pendingDS.data.length;

    return numSelected === numRows;
  }
  isCheckboxDisabled(contact: any): boolean {
    if (contact.isRefunded == 1) {
      return true
    }
    if (contact.isSampleCollection === 'False') {
      return true
    }
    return false; // Self patient → always enabled
  }

  // onRowCheck(event: any, contact: any) {
  //   this.selection.toggle(contact);

  //   if (event.checked) {

  //     if (this.ServiceIdData.some(id => id == contact.pathTestID)) {
  //       event.source.checked = false;
  //       this.toastr.warning('This Test is already selected');
  //       return;
  //     }
  //     // ticked: keep the old list and add this row
  //     if (this.ServiceIdData.includes(contact.pathTestID)) return;   // already in the list
  //     this.loadResultList([contact], true);                          // true = append
  //   } else {
  //     // unticked: remove only this row
  //     this.dataSource.data = this.dataSource.data.filter(
  //       (x: any) => x.PathTestID != contact.pathTestID                // use your real test id field
  //     );
  //     this.ServiceIdData = this.ServiceIdData.filter(id => id != contact.pathTestID);
  //     this.reportIdData = this.reportIdData.filter(id => id != contact.pathReportID);
  //   }
  // }

  // true if this test is already in the loaded result list
  isTestChecked(contact: any): boolean {
    return this.ServiceIdData.some(id => id == contact.pathTestID);
  }

  // true if the test came from the main list (cannot be unticked here)
  initialTestIds: any[] = [];

  // right after the first, non-append loadResultList(rows) call
  isLockedRow(contact: any): boolean {
    return this.initialTestIds.includes(contact.pathTestID);
  }

  onRowCheck(event: any, contact: any) {
    if (event.checked) {
      if (this.isTestChecked(contact)) {
        event.source.checked = true;          // already there, keep it ticked
        return;
      }
      this.loadResultList([contact], true);   // append

    } else {
      // only rows ticked in this dialog can be removed
      this.dataSource.data = this.dataSource.data.filter(
        (x: any) => !(x._testId == contact.pathTestID && x._reportId == contact.pathReportID)
      );
      this.ServiceIdData = this.ServiceIdData.filter(id => id != contact.pathTestID);
      this.reportIdData = this.reportIdData.filter(id => id != contact.pathReportID);
    }
  }

  // onRowCheck(event: any, contact: any) {
  //   if (event.checked) {
  //     // 1. check first, before touching the selection
  //     if (this.ServiceIdData.some(id => id == contact.pathTestID)) {
  //       event.source.checked = false;
  //       this.toastr.warning('This Test is already selected');
  //       return;                        // selection is NOT toggled
  //     }

  //     // 2. allowed: add to selection and append to the old list
  //     this.selection.toggle(contact);
  //     this.loadResultList([contact], true);

  //   } else {
  //     // unticked: remove only this row
  //     // this.selection.toggle(contact);
  //     this.dataSource.data = this.dataSource.data.filter(
  //       (x: any) => x.PathTestID != contact.pathTestID                // use your real test id field
  //     );
  //     this.ServiceIdData = this.ServiceIdData.filter(id => id != contact.pathTestID);
  //     this.reportIdData = this.reportIdData.filter(id => id != contact.pathReportID);
  //   }
  // }

  onresultentryshow(event, m) {
    // debugger
    console.log("2nd Table Data:", m)
    this.OPIPID = m.opdipdid //m.OPD_IPD_ID
    this.advanceDataStored.storage = new SampleDetailObj(m);
    if (event.checked) {
      if (m.pathTestID == 0) {
        this.toastr.warning('This Test Not Created !', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

    }

    if (!m || typeof m !== 'object' || !('isTemplateTest' in m) || m.isTemplateTest == null) {

      this.toastr.warning('This Test Not Created!', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      console.log('isTemplateTest not found or null, dataSource1 cleared.');
      return;
    }

    const rows = this.selection.selected;   // array of all ticked rows
    if (rows.length) {
      this.loadResultList(rows);
    } else {
      // nothing ticked: clear the right-hand table here if you want
    }
  }

  loadResultList(rbj: any[], append: boolean = false) {
    debugger
    if (!Array.isArray(rbj)) rbj = [rbj];

    if (!append) {                 // popup open: start fresh
      this.reportIdData = [];
      this.ServiceIdData = [];
      this.vPathReportId = rbj[0].pathReportID;
    }

    this.vPathReportId = rbj[0].pathReportID
    rbj.forEach((element) => {
      this.reportIdData.push(element.pathReportID)
      this.ServiceIdData.push(element.pathTestID)
      if (element.IsCompleted == "true")
        this.Iscompleted = 1;
      else
        this.Iscompleted = 0
    });

    if (this.selectedAdvanceObj2.ageYear) {
      this.FinalAge = this.selectedAdvanceObj2.ageYear.trim();
      this.AgeType = 'YEAR'
    }
    if (this.selectedAdvanceObj2.ageMonth && this.FinalAge == 0) {
      this.FinalAge = this.selectedAdvanceObj2.ageMonth.trim();
      this.AgeType = 'MONTH'
    }
    if (this.selectedAdvanceObj2.ageDay && this.FinalAge == 0) {
      this.FinalAge = this.selectedAdvanceObj2.ageDay.trim();
      this.AgeType = 'DAY'
    }

    // working when pending result entry
    // if (this.selectedAdvanceObj2.opdipdtype == 1) {
    //   this.getResultListIP(this.selectedAdvanceObj2, rbj);
    // }
    // else {
    //   this.getResultListOP(this.selectedAdvanceObj2, rbj);
    // }

    // append = pending row ticked -> always the entry function, never replace
    if (append || this.selectedAdvanceObj2.isCompleted == true) {
      if (this.selectedAdvanceObj2.opdipdtype == 1) {
        this.getResultListIP(this.selectedAdvanceObj2, rbj, append);
      } else {
        this.getResultListOP(this.selectedAdvanceObj2, rbj, append);
      }
    } else {
      this.getResultList1(this.selectedAdvanceObj2);   // completed list, fresh load only
    }

  }

  GetPendingdetailList(obj: any = null) {
    const fromDate = this.datePipe.transform(obj.pathDate, "yyyy-MM-dd")
    const toDate = this.datePipe.transform(obj.pathDate, "yyyy-MM-dd")
    const data =
    {
      "first": 0,
      "rows": 9999,
      "sortField": "PathReportID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "From_Dt",
          "fieldValue": fromDate,
          "opType": "Equals"
        },
        {
          "fieldName": "To_Dt",
          "fieldValue": toDate,
          "opType": "Equals"
        },
        {
          "fieldName": "PatientName",
          "fieldValue": "%",
          "opType": "Equals"
        },
        {
          "fieldName": "TestName",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "RegNo",
          "fieldValue": String(obj.regNo),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(this.OP_IPType),
          "opType": "Equals"
        },
        {
          "fieldName": "IsCompleted",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "CategoryId",
          "fieldValue": "0",
          "opType": "Equals"
        },
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._SampleService.getresultenteryDetlist(data).subscribe((response) => {
      // this.pendingDS.data = response.data;

      const rows = Array.isArray(this.selectedAdvanceObj2) ? this.selectedAdvanceObj2 : [this.selectedAdvanceObj2];
      this.pendingDS.data = (response?.data || []).map((p: any) => ({
        ...p,
        _locked: rows.some((r: any) =>
          r.pathTestID == p.pathTestID && r.pathReportID == p.pathReportID)
      }));
    });
  }

  ChangeSampleNo() {
    const newSampleNo = this.otherForm.get('vSampleNo')?.value || 0
    if (newSampleNo > 0) {
      this.sampleNo = newSampleNo
    }

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  setDropdownObjs() {

    this.vsuggation = this.dataSource.data[0].SuggestionNote;

    const toSelect = this.PathologyDoctorList.find(c => c.DoctorId == this.dataSource.data[0].PathResultDr1);
    this.otherForm.get('DoctorId').setValue(toSelect);
    this.otherForm.updateValueAndValidity();
  }

  getShortNames(formula: string): string[] {
    let Keys: string[] = [];
    const allKeys = formula.split('{{');
    allKeys.forEach((key: string) => {
      if (key.indexOf('}}') > -1) {
        const val = (key.split('}}'))[0];
        Keys = Keys.concat(val);
      }
    });
    return Keys;
  }
  getValidatetabledata() {
    if (this.dataSource.data.length) {
      this.dataSource.data.forEach(element => {
        this.onResultUp(element)
      })
    }
  }

  onResultUp(data) {
    // debugger
    //Changes done by Ambadas 07-03-2026
    const items = this.dataSource.data.filter(x => String(x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
    for (let i = 0; i < items.length; i++) {
      let formula = items[i].Formula;
      const formulas = this.getShortNames(formula);
      formulas.forEach(e => {
        const itm = this.dataSource.data.find(x => x.ParameterShortName == e);
        if (itm)
          //formula = formula.replaceAll("{{" + e + "}}", itm.ResultValue || 0)
          formula = formula.replaceAll("{{" + e + "}}", String(Number(itm?.ResultValue) || 0));
      });
      //items[i].ResultValue = isNaN(eval(formula)) ? "" : eval(formula); 
      let result: any = "";
      try {
        result = eval(formula);
      } catch (error) {
        console.error("Invalid formula:", formula);
      }
      items[i].ResultValue = isNaN(result as any) ? "" : result;
      if (!isNaN(items[i].ResultValue))
        items[i].ResultValue = String(Math.round(items[i].ResultValue * 100) / 100);
    }

    // data.ParaBoldFlag = '';
    if ((data?.ParaIsNumeric || 0) || (data?.PIsNumeric || 0)) {

      const a = parseFloat(data.ResultValue);
      const b = parseFloat(data.MinValue);
      const c = parseFloat(data.MaxValue);

      if (b != null && c != null && a != null) {
        if (a < b || a > c) {
          data.ParaBoldFlag = 'B';
        } else {
          data.ParaBoldFlag = '';
        }
      }
    }
  }

  boldstatus = 0;

  editflag(contact) {
    contact.ParaBoldFlag = contact.ParaBoldFlag
  }

  currentval = "";
  currentvaltemp = "";
  ParameterId = "";

  AddData1(contact, val) {
    console.warn(val);
    if (this.currentval != "")
      this.currentval = this.currentval + ' , ' + val;
    else
      this.currentval = this.currentval + '  ' + val;
    contact.ResultValue = this.currentval
  }

  onRowChange(row: any) {
    // if user moves to a different row
    if (this.activeHelpRow && this.activeHelpRow !== row) {
      this.resetHelpSelection(this.activeHelpRow);
    }
    this.activeHelpRow = row;
  }
  resetHelpSelection(row: any) {
    if (!row) return;
    this.currentval = ""
  }

  helpItems: any[] = [];
  helpFullItems: any[] = [];
  selectedParam: any;
  activeHelpRow: any = null;

  onKeydown(event: KeyboardEvent, contact: any) {
    if (event.key !== 'F2') return;

    event.preventDefault();
    // Close previous popup
    if (this.activeHelpRow && this.activeHelpRow !== contact) {
      this.activeHelpRow.IsHelpShown = false;
      this.activeHelpRow.helpItems = [];
    }

    const param = {
      searchFields: [{
        fieldName: 'ParameterId',
        fieldValue: String(contact.ParameterId),
        opType: 'Equals'
      }],
      mode: 'ParameterDescriptiveMaster'
    };

    this._SampleService.getPathologyResultList(param).subscribe(res => {
      // debugger
      contact.fullHelpItems = res as any[];   // ✅ backup (never change)
      contact.helpItems = [...contact.fullHelpItems]; // working copy

      contact.IsHelpShown = contact.helpItems.length > 0;
      this.activeHelpRow = contact;

      setTimeout(() => {
        document.getElementById('helpText_' + contact.ParameterId)?.focus();
      });
    });
  }

  filterHelp(event: any, contact: any) {
    const value = event.target.value?.toLowerCase() || '';

    contact.helpItems = contact.fullHelpItems.filter((item: any) =>
      item.ParameterValues.toLowerCase().includes(value)
    );
  }

  onSelectHelp(value: string, data: any) {
    const row = this.dataSource.data.find(x => x.ParameterId === this.selectedParam);
    if (row) {
      row.ResultValue = value;
    }
    data.IsHelpShown = false;
    data.helpItems = [];
    data.fullHelpItems = [];

    this.AddData1(data, value);
  }
  ///////////////// end ///////////////////
  getResultList1(rbj, append: boolean = false) {
    // debugger
    if (this.OP_IPType == 0) {
      var param = {
        "searchFields": [
          {
            "fieldName": "PathReportId",
            "fieldValue": String(this.reportIdData), //String(rbj[0].PathReportId), //"150598",  
            "opType": "Equals"
          }
        ],
        "mode": "PathologyResultEntryOPCompleted"
      }
    }
    else if (this.OP_IPType == 1) {
      var param = {
        "searchFields": [
          {
            "fieldName": "PathReportId",
            "fieldValue": String(this.reportIdData), //String(rbj[0].PathReportId),
            "opType": "Equals"
          }
        ],
        "mode": "PathologyResultEntryIPCompleted"
      }
    }

    console.log(param)
    this._SampleService.getPathologyResultListforOP(param).subscribe(Visit => {

      this.dataSource.data = Visit as Pthologyresult[];
      console.log(this.dataSource.data)
      // this.Pthologyresult = Visit as Pthologyresult[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      const first: any = this.dataSource.data[0];
      if (first) {
        this.otherForm.get('PathResultDoctorId').setValue(first.PathResultDr1);
        this.vPathResultDoctorId = first.PathResultDr1;
        this.PathResultDr1 = first["PathResultDr1"];
        this.vsuggation = first["SuggestionNote"];
      }
      // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
      // this.vPathResultDoctorId = this.dataSource.data[0].PathResultDr1
      // this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      // this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      console.log(this.PathResultDr1);
      // this.getPathresultDoctorList();
    },
      error => {
        this.sIsLoading = '';
      });

  }

  getResultListIP(obj, rbj, append: boolean = false) {

    const SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "OPIPId",
          "fieldValue": String(obj.opdipdid),
          "opType": "Equals"
        },
        {
          "fieldName": "ServiceId ",
          "fieldValue": String(this.ServiceIdData),
          // "fieldValue": String(rbj[0].ServiceId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(obj.opdipdtype),
          "opType": "Equals"
        },
        {
          "fieldName": "PathReportId",
          "fieldValue": String(this.reportIdData),
          // "fieldValue": String(rbj[0].PathReportId),
          "opType": "Equals"
        },
        {
          "fieldName": "SexId",
          "fieldValue": String(obj.genderId),
          "opType": "Equals"
        },
        {
          "fieldName": "MaxAge",
          "fieldValue": String(this.FinalAge),
          "opType": "Equals"
        },
        {
          "fieldName": "AgeType",
          "fieldValue": String(this.AgeType),
          "opType": "Equals"
        }
      ],
      "mode": "PathologyResultEntryIP"
    }

    console.log(SelectQuery);
    this._SampleService.getPathologyResultListforIP(SelectQuery).subscribe(Visit => {
      // this.dataSource.data = Visit as Pthologyresult[];

      let newRows = (Visit as Pthologyresult[]) || [];
      // this.dataSource.data = Visit as Pthologyresult[];

      if (append) {
        // keep old rows, add the new ones
        // this.dataSource.data = [...this.dataSource.data, ...newRows];
        const testId = rbj[0].pathTestID;
        const reportId = rbj[0].pathReportID;
        const existing = this.dataSource.data as any[];

        newRows = newRows.filter(r => r.ServiceID == testId);                              // ticked test only
        newRows = newRows.filter(r => !existing.some(e => e.ServiceID == r.ServiceID));    // not already in table
        newRows = newRows.map(r => ({ ...r, _testId: testId, _reportId: reportId }));

        this.dataSource.data = [...existing, ...newRows];
      } else {
        this.dataSource.data = newRows;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        if (newRows.length) {          // doctor is set only on first load
          this.otherForm.get('PathResultDoctorId').setValue(newRows[0].adm_Visit_docId);
          this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
          this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
          this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
        }
      }
      this.sIsLoading = '';

      // console.log(this.dataSource.data)
      // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)
      // this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
      // this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      // this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      // this.sIsLoading = '';
    });
  }

  getResultListOP(obj, rbj, append: boolean = false) {
    // const ServiceIdData = rbj.map(r => String(r.ServiceId || r.pathTestID));
    // const reportIdData = rbj.map(r => String(r.PathReportId || r.pathReportID));


    const SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "OPIPId",
          "fieldValue": String(obj.opdipdid),
          "opType": "Equals"
        },
        {
          "fieldName": "ServiceId ",
          "fieldValue": String(this.ServiceIdData),
          // "fieldValue": String(rbj[0].ServiceId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(obj.opdipdtype),
          "opType": "Equals"
        },
        {
          "fieldName": "PathReportId",
          "fieldValue": String(this.reportIdData),
          // "fieldValue": String(rbj[0].PathReportId),
          "opType": "Equals"
        },
        {
          "fieldName": "SexId",
          "fieldValue": String(obj.genderId),
          "opType": "Equals"
        },
        {
          "fieldName": "MaxAge",
          "fieldValue": String(this.FinalAge),
          "opType": "Equals"
        },
        {
          "fieldName": "AgeType",
          "fieldValue": String(this.AgeType),
          "opType": "Equals"
        }

      ],
      "mode": "PathologyResultEntryOP"
    }
    console.log(SelectQuery)
    this._SampleService.getPathologyResultListforOP(SelectQuery).subscribe(Visit => {
      let newRows = (Visit as Pthologyresult[]) || [];
      // this.dataSource.data = Visit as Pthologyresult[];

      if (append) {
        // keep old rows, add the new ones
        // this.dataSource.data = [...this.dataSource.data, ...newRows];
        const testId = rbj[0].pathTestID;
        const reportId = rbj[0].pathReportID;
        const existing = this.dataSource.data as any[];

        newRows = newRows.filter(r => r.ServiceID == testId);                              // ticked test only
        newRows = newRows.filter(r => !existing.some(e => e.ServiceID == r.ServiceID));    // not already in table
        newRows = newRows.map(r => ({ ...r, _testId: testId, _reportId: reportId }));

        this.dataSource.data = [...existing, ...newRows];
      } else {
        this.dataSource.data = newRows;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        if (newRows.length) {          // doctor is set only on first load
          this.otherForm.get('PathResultDoctorId').setValue(newRows[0].adm_Visit_docId);
          this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
          this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
          this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
        }
      }
      this.sIsLoading = '';

      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      // this.sIsLoading = '';
      // // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
      // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)

      // this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
      // this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      // this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      // console.log(this.PathResultDr1);
      // this.getPathresultDoctorList();
    });

  }

  selectChangeDoctor(row) {
    this.vPathResultDoctorId = row.doctorId
  }

  onReload() {
    this.getResultList1(this.regObj);
  }

  checkMultipleRunDates(data: Pthologyresult[]) {
    const withRunDate = data.filter(d => d.RUNDATE && Object.keys(d.RUNDATE as any).length !== 0);

    const distinctRunDates = Array.from(new Set(withRunDate.map(d => d.RUNDATE as unknown as string)))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // hasMultiple is purely: are there 2+ distinct non-empty RUNDATE values overall?
    const hasMultiple = distinctRunDates.length > 1;

    return { hasMultiple, distinctRunDates };
  }

  SampleNo = 0;
  onUpload() {

    debugger
    console.log(this.selectedAdvanceObj2)
    console.log(this.regObj)

    if (this.OP_IPType == 0) {
      var SelectQuery =
      {
        "searchFields": [
          {
            "fieldName": "OPIPId",
            "fieldValue": String(this.selectedAdvanceObj2.opdipdid),
            "opType": "Equals"
          },
          {
            "fieldName": "ServiceId ",
            "fieldValue": String(this.regObj[0].ServiceId),
            "opType": "Equals"
          },
          {
            "fieldName": "OPIPType",
            "fieldValue": String(this.selectedAdvanceObj2.opdipdtype),
            "opType": "Equals"
          },
          {
            "fieldName": "PathReportId",
            "fieldValue": String(this.regObj[0].PathReportId),
            "opType": "Equals"
          },
          {
            "fieldName": "SexId",
            "fieldValue": String(this.selectedAdvanceObj2.genderId),
            "opType": "Equals"
          },
          {
            "fieldName": "MaxAge",
            "fieldValue": String(this.FinalAge),
            "opType": "Equals"
          },
          {
            "fieldName": "SampleNo",
            "fieldValue": String(this.sampleNo),
            "opType": "Equals"
          },
          {
            "fieldName": "AgeType",
            "fieldValue": String(this.AgeType),
            "opType": "Equals"
          }
        ],
        "mode": "PathologyResultEntryOPMachine"
      }
      console.log(SelectQuery)
      this._SampleService.getPathologyResultListforOP(SelectQuery).subscribe(Visit => {
        this.dataSource.data = Visit as Pthologyresult[];
        console.log("OP DATA:", this.dataSource.data)

        ////////////// check double data //////////////////

        const { hasMultiple, distinctRunDates } = this.checkMultipleRunDates(this.dataSource.data);

        if (hasMultiple) {
          // ✅ Only reaches here if 2+ distinct RUNDATEs exist among result rows
          this.pendingUploadData = this.dataSource.data;
          this.openRunDatePopup(distinctRunDates);
        } else {
          // ✅ Single (or zero) RUNDATE — load directly, no popup
          this.applyUploadData(this.dataSource.data);
        }

        ////////////// end ///////////////

        // this.Pthologyresult = Visit as Pthologyresult[];
        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
        // this.sIsLoading = '';
        // // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
        // if ((this.dataSource.data[0]?.adm_Visit_docId || 0) > 0) {
        //     this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)
        //     this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
        // }
        // this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
        // this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
        // console.log(this.PathResultDr1);
        // this.getPathresultDoctorList();
      });

    } else if (this.OP_IPType == 1) {
      var SelectQuery =
      {
        "searchFields": [
          {
            "fieldName": "OPIPId",
            "fieldValue": String(this.selectedAdvanceObj2.opdipdid),
            "opType": "Equals"
          },
          {
            "fieldName": "ServiceId ",
            "fieldValue": String(this.regObj[0].ServiceId),
            "opType": "Equals"
          },
          {
            "fieldName": "OPIPType",
            "fieldValue": String(this.selectedAdvanceObj2.opdipdtype),
            "opType": "Equals"
          },
          {
            "fieldName": "PathReportId",
            "fieldValue": String(this.regObj[0].PathReportId),
            "opType": "Equals"
          },
          {
            "fieldName": "SexId",
            "fieldValue": String(this.selectedAdvanceObj2.genderId),
            "opType": "Equals"
          },
          {
            "fieldName": "MaxAge",
            "fieldValue": String(this.FinalAge),
            "opType": "Equals"
          },
          {
            "fieldName": "SampleNo",
            "fieldValue": String(this.sampleNo),
            "opType": "Equals"
          },
          {
            "fieldName": "AgeType",
            "fieldValue": String(this.AgeType),
            "opType": "Equals"
          }
        ],
        "mode": "PathologyResultEntryIPMachine"
      }

      console.log(SelectQuery);
      this._SampleService.getPathologyResultListforIP(SelectQuery).subscribe(Visit => {
        this.dataSource.data = Visit as Pthologyresult[];
        //  this.Pthologyresult = Visit as Pthologyresult[];
        console.log("IP DATA:", this.dataSource.data)

        ////////////// check double data //////////////////

        const { hasMultiple, distinctRunDates } = this.checkMultipleRunDates(this.dataSource.data);

        if (hasMultiple) {
          // ✅ Only reaches here if 2+ distinct RUNDATEs exist among result rows
          this.pendingUploadData = this.dataSource.data;
          this.openRunDatePopup(distinctRunDates);
        } else {
          // ✅ Single (or zero) RUNDATE — load directly, no popup
          this.applyUploadData(this.dataSource.data);
        }

        ////////////// end ///////////////

        // if ((this.dataSource.data[0]?.adm_Visit_docId || 0) > 0) {
        //     this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)
        //     this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
        // }
        // this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
        // this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
        // this.sIsLoading = '';
      });

    }
    this.getValidatetabledata()
  }

  @ViewChild('dateForm') dateForm!: TemplateRef<any>;
  pendingUploadData: Pthologyresult[] = [];
  openRunDatePopup(runDates: string[]) {
    const dialogRef = this._matDialog.open(this.dateForm, {
      width: '400px',
      data: { runDates }
    });

    dialogRef.afterClosed().subscribe((selectedRunDate: string) => {
      if (selectedRunDate) {
        const filtered = this.filterByRunDate(this.pendingUploadData, selectedRunDate);
        this.applyUploadData(filtered);
      } else {
        this.sIsLoading = '';
      }
    });
  }

  filterByRunDate(data: Pthologyresult[], selectedRunDate: string): Pthologyresult[] {
    return data.filter(d => {
      // keep parameters that have no result yet (RUNDATE empty) untouched
      if (!d.RUNDATE || Object.keys(d.RUNDATE as any).length === 0) return true;
      return d.RUNDATE === selectedRunDate;
    });
  }

  applyUploadData(data: Pthologyresult[]) {
    this.dataSource.data = data;
    if ((data[0]?.adm_Visit_docId || 0) > 0) {
      this.otherForm.get('PathResultDoctorId').setValue(data[0].adm_Visit_docId);
      this.vPathResultDoctorId = data[0].adm_Visit_docId;
    }
    this.PathResultDr1 = data[0]?.["PathResultDr1"];
    this.vsuggation = data[0]?.["SuggestionNote"];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sIsLoading = '';
  }

  onVerify() {
    Swal.fire({
      title: 'Confirm Verify Report ',
      text: 'Are you sure you want to Verify Report?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#41ea76ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Verify!'

    }).then((flag) => {
      // debugger
      if (flag.isConfirmed) {

        const submitData = {
          "pathReportId": this.vPathReportId,
          "isVerifyid": this.accountService.currentUserValue.userId,
          "isVerifySign": true,
          "isVerifyedDate": new Date().toISOString()
        };
        console.log(submitData);
        this._SampleService.PathReportverifyMaster(submitData).subscribe(response => {
          this._matDialog.closeAll();
        });
      }
    });
    // this.onEdit(row);
  }

  Printresultentry(reportIds: any[]) {

    // const pathologyDelete = [];

    // this.data.RIdData.forEach((element) => {
    //   pathologyDelete.push({ pathReportId: element.PathReportId });
    // });

    const uniqueIds = Array.from(new Set(reportIds));        // remove duplicate report ids

    const pathologyDelete = uniqueIds.map(id => ({ pathReportId: id }));

    const submitData = {
      pathPrintResultEntry: pathologyDelete
    };

    console.log(submitData);

    this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
      if (res) {
        this.viewgetPathologyTestReportPdf()
      }
    });
  }

  viewgetPathologyTestReportPdf() {
    // debugger
    const param = {
      searchFields: [
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(this.selectedAdvanceObj2.opdipdtype),
          opType: "Equals"
        }
      ],
      mode: "PathologyReportWithHeader"
    };

    console.log(param);

    this._SampleService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Pathology Test Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });
  }

  nEnterresultdr
  Saveflag = 2;
  printf: boolean = true;

  onSave() {
    this.getValidatetabledata()

    if ((this.vPathResultDoctorId == 0 || this.vPathResultDoctorId == undefined)) {
      this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // this.PathResultForm.get("pathResultDr1").setValue(this.vPathResultDoctorId)
    // this.PathResultForm.get("suggestionNotes").setValue(this.otherForm.get("suggestionNotes").value)
    // this.ResultForm.get("pathologyReport").setValue(this.PathResultForm.value)

    this.pathologyResultArray.clear();
    this.dataSource.data.forEach(item => {
      console.log(item)
      this.pathologyResultArray.push(this.createResultdetailForm(item));
    });
    debugger
    this.pathologyReportArray.clear();
    [...new Set(this.reportIdData)].forEach(id => {
      this.pathologyReportArray.push(this.createPathologyResultForm(id));
    });
    console.log(this.ResultForm.value);

    this._SampleService.PathResultentryInsert(this.ResultForm.value).subscribe(response => {
      if (response) {
        debugger
        const reportIds = [...this.reportIdData];

        // reset state for the next time
        this.reportIdData = [];
        this.ServiceIdData = [];
        this.dataSource.data = [];
        this.selection.clear();                     // un-tick the main list rows
        this.FinalAge = 0;

        this._matDialog.closeAll();
        this.FinalAge = 0
        this.Printresultentry(reportIds);
      }
      this.isLoading = '';
    });

  }


  public onEnterSugg(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.PathResultDoctorId.nativeElement.focus();
      event.preventDefault(); // optional, to avoid newline on Ctrl+Enter
    }
  }


  public onEnterPathResultDoctorId(event, value): void {

    if (event.which === 13) {
      console.log(value)
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Pathology Doctor .', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.DoctorId.nativeElement.focus();
      }
    }
  }

  onClear() {
    this.otherForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }

  createResultInsertForm(): FormGroup {
    return this.formBuilder.group({
      pathologyReport: this.formBuilder.array([]),// this.PathResultForm.value,
      pathologyResult: this.formBuilder.array([]) // FormArray for details
    });
  }

  createPathologyResultForm(pathReportId: any = null): FormGroup {
    return this.formBuilder.group({
      pathReportId: pathReportId,
      reportDate: this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
      reportTime: this.datePipe.transform(this.currentDate, "HH:mm"),
      isCompleted: true,
      isPrinted: true,
      pathResultDr1: [this.vPathResultDoctorId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      pathResultDr2: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      pathResultDr3: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isTemplateTest: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      suggestionNotes: [this.otherForm.get("suggestionNotes").value ?? ''],
      admVisitDoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }

  get pathologyReportArray(): FormArray {
    return this.ResultForm.get('pathologyReport') as FormArray;
  }

  createResultdetailForm(item: any = {}, index: number = 0): FormGroup {

    return this.formBuilder.group({
      pathReportDetId: [item.pathReportDetId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pathReportId: [item.PathReportId || item.PathReportID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      categoryId: [item.CategoryId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      testId: [item.TestId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subTestId: [item.SubTestId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      parameterId: [item.ParameterId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      resultValue: [item.ResultValue || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      unitId: [item.UnitId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      normalRange: [item.NormalRange || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      printOrder: [this.pathologyResultArray.length + 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pisNumeric: [item.ParaIsNumeric || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdid: [item.OPD_IPD_ID, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opdipdtype: [item.OPD_IPD_Type, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      categoryName: [item.CategoryName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      testName: [item.TestName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      subTestName: [item.SubTestName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      parameterName: [item.ParameterName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      unitName: [item.UnitName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      patientName: [this.selectedAdvanceObj2.patientName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      regNo: [this.selectedAdvanceObj2.regNo || '321', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      sampleId: [item.SampleID || "", [this._FormvalidationserviceService.onlyNumberValidator()]],
      paraBoldFlag: [item.ParaBoldFlag || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      minValue: [parseFloat(item.MinValue), [this._FormvalidationserviceService.onlyNumberValidator()]],
      maxValue: [parseFloat(item.MaxValue), [this._FormvalidationserviceService.onlyNumberValidator()]],
      opipnumber: this.opipnumber || "Lab87",
      ageY: this.ageY,
      ageM: this.ageM,
      ageD: this.ageD,
      genderId: this.genderId,
      sampleNo: " ",
      suggestionNotes: this.vsuggation,
    });
  }

  get pathologyResultArray(): FormArray {
    return this.ResultForm.get('pathologyResult') as FormArray;
  }
}
