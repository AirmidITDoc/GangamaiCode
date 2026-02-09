import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatAccordion } from '@angular/material/expansion';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfigService } from 'app/core/services/config.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { LabResultListService } from '../lab-result-list.service';
import { SampleDetailObj } from 'app/main/pathology/result-entry/result-entry.component';
import { AdmissionPersonl } from '../lab-result-list.component';

@Component({
  selector: 'app-new-labresult-entry',
  templateUrl: './new-labresult-entry.component.html',
  styleUrls: ['./new-labresult-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabresultEntryComponent {
  ResultForm: FormGroup
  PathResultForm: FormGroup
  vresultdetailFormGroup: FormGroup
  @ViewChild('PathResultDoctorId') PathResultDoctorId: ElementRef;
  @ViewChild('DoctorId') DoctorId: ElementRef;
  @ViewChild('RefDoctorID') RefDoctorID: ElementRef;
  @ViewChild('helpinput') helpinput: ElementRef;


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
  selectedAdvanceObj2: AdmissionPersonl;
  screenFromString = 'Common-form';
  hasSelectedContacts: boolean;
  advanceData: any;
  dataSource = new MatTableDataSource<Pthologyresult>();
  resultdataSource = new MatTableDataSource<Pthologyresult>();

  configDoc: any;
  sIsLoading: string = '';

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
  // OP_IPType: any;
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

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: LabResultListService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<NewLabresultEntryComponent>,
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

      this.opipnumber = this.data.patientdata.labRequestNo
      this.ageY = this.data.patientdata.ageYear.trim() || "0"
      this.ageM = this.data.patientdata.ageMonth.trim() || "0"
      this.ageD = this.data.patientdata.ageDay.trim() || "0"
      this.genderId = this.data.patientdata.genderId
      this.sampleNo = this.data.sampleNo.split(" ")[0]
      this.suggestionNotes = this.data.patientdata.suggestionNotes

      this.OPIPID = this.selectedAdvanceObj2.opdipdId // this.selectedAdvanceObj2.OPD_IPD_ID;
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


      if (this.selectedAdvanceObj2.ageYear)
        this.FinalAge = this.selectedAdvanceObj2.ageYear.trim();
      if (this.selectedAdvanceObj2.ageMonth && this.FinalAge == 0)
        this.FinalAge = this.selectedAdvanceObj2.ageMonth.trim();
      if (this.selectedAdvanceObj2.ageDay && this.FinalAge == 0)
        this.FinalAge = this.selectedAdvanceObj2.ageDay.trim();

    }

    if (this.Iscompleted == 0) {
      this.getResultListLab(this.selectedAdvanceObj2, this.regObj);
    } else {
      this.getResultList1(this.regObj);
    }

  }

  ngOnInit(): void {

    this.otherForm = this.formBuilder.group({
      suggestionNotes: '',
      PathResultDoctorId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      AdmDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      RefDoctorID: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });

    this.ResultForm = this.createResultInsertForm();
    this.PathResultForm = this.createPathologyResultForm();
    this.pathologyResultArray.push(this.createResultdetailForm());

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

  onResultUp(data) {

    let items = this.dataSource.data.filter(x => String(x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
    for (let i = 0; i < items.length; i++) {
      let formula = items[i].Formula;
      let formulas = this.getShortNames(formula);
      formulas.forEach(e => {
        let itm = this.dataSource.data.find(x => x.ParameterShortName == e);
        if (itm)
          formula = formula.replace("{{" + e + "}}", itm.ResultValue)
      });
      items[i].ResultValue = isNaN(eval(formula)) ? "" : eval(formula);
      if (!isNaN(items[i].ResultValue))
        items[i].ResultValue = String(Math.round(items[i].ResultValue * 100) / 100);
    }

    data.ParaBoldFlag = '';
    if (data.ParaIsNumeric || data.PIsNumeric) {

      let a = parseFloat(data.ResultValue);
      let b = parseFloat(data.MinValue);
      let c = parseFloat(data.MaxValue);

      if (b != null && c != null && a != null) {
        if (a < b || a > c) {
          data.ParaBoldFlag = 'B';
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
  getResultList1(rbj) {
    // debugger
    var param = {
      "searchFields": [
        {
          "fieldName": "PathReportId",
          "fieldValue": String(rbj[0].PathReportId),
          "opType": "Equals"
        }
      ],
      "mode": "PathologyResultEntryLabCompleted"
    }

    console.log(param)
    this._SampleService.getPathologyResultListforOP(param).subscribe(Visit => {

      this.dataSource.data = Visit as Pthologyresult[];
      console.log(this.dataSource.data)
      // this.Pthologyresult = Visit as Pthologyresult[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
      this.vPathResultDoctorId = this.dataSource.data[0].PathResultDr1
      this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      console.log(this.PathResultDr1);
      // this.getPathresultDoctorList();
    },
      error => {
        this.sIsLoading = '';
      });

  }

  getResultListLab(obj, rbj) {
    const serviceIds = rbj.map(r => String(r.ServiceId));
    const pathReportIds = rbj.map(r => String(r.PathReportId));


    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "OPIPId",
          "fieldValue": String(obj.opdipdId),
          "opType": "Equals"
        },
        {
          "fieldName": "ServiceId ",
          "fieldValue": String(rbj[0].ServiceId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": "4",
          "opType": "Equals"
        },
        {
          "fieldName": "PathReportId",
          "fieldValue": String(rbj[0].PathReportId),
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
        }
      ],
      "mode": "PathologyResultEntryLAB"
    }
    console.log(SelectQuery)
    this._SampleService.getPathologyResultListforLab(SelectQuery).subscribe(Visit => {
      this.dataSource.data = Visit as Pthologyresult[];
      console.log(this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)

      this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
      this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      console.log(this.PathResultDr1);

    });

  }

  selectChangeDoctor(row) {
    this.vPathResultDoctorId = row.doctorId
  }

  onReload() {
    this.getResultList1(this.regObj);
  }

  SampleNo = 0;
  onUpload() {

    debugger
    console.log(this.selectedAdvanceObj2)
    console.log(this.regObj)

    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "OPIPId",
          "fieldValue": String(this.selectedAdvanceObj2.opdipdId),
          "opType": "Equals"
        },
        {
          "fieldName": "ServiceId ",
          "fieldValue": String(this.regObj[0].ServiceId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": "4",
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
        }
      ],
      "mode": "PathologyResultEntryLabMachine"
    }
    console.log(SelectQuery)
    this._SampleService.getPathologyResultListforLab(SelectQuery).subscribe(Visit => {
      this.dataSource.data = Visit as Pthologyresult[];
      console.log("LAB DATA:", this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)

      this.vPathResultDoctorId = this.dataSource.data[0].adm_Visit_docId
      this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
      this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
      console.log(this.PathResultDr1);

    });

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

        let submitData = {
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

  Printresultentry() {

    let pathologyDelete = [];

    this.data.RIdData.forEach((element) => {
      pathologyDelete.push({ pathReportId: element.PathReportId });
    });

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
          fieldValue: "4",
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

    if ((this.vPathResultDoctorId == 0 || this.vPathResultDoctorId == undefined)) {
      this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.PathResultForm.get("pathResultDr1").setValue(this.vPathResultDoctorId)
    this.PathResultForm.get("suggestionNotes").setValue(this.otherForm.get("suggestionNotes").value)
    this.ResultForm.get("pathologyReport").setValue(this.PathResultForm.value)

    this.pathologyResultArray.clear();
    this.dataSource.data.forEach(item => {
      console.log(item)
      this.pathologyResultArray.push(this.createResultdetailForm(item));
    });


    console.log(this.ResultForm.value);
    this._SampleService.PathResultentryInsert(this.ResultForm.value).subscribe(response => {
      if (response) {
        this._matDialog.closeAll();
        this.FinalAge = 0
        // this.Printresultentry();
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


  //  selectChangeDoctorName(row) {
  //     console.log(row)
  //     this.VpathResultDr1 = row.doctorId
  //   }


  onClear() {
    this.otherForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }

  //new

  createResultInsertForm(): FormGroup {
    return this.formBuilder.group({
      pathologyReport: '',// this.PathResultForm.value,
      pathologyResult: this.formBuilder.array([]) // FormArray for details
    });
  }

  createPathologyResultForm(): FormGroup {
    return this.formBuilder.group({
      pathReportId: this.vPathReportId,
      reportDate: this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
      reportTime: this.datePipe.transform(this.currentDate, "HH:mm"),
      isCompleted: true,
      isPrinted: true,
      pathResultDr1: [this.vPathResultDoctorId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      pathResultDr2: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      pathResultDr3: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isTemplateTest: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      suggestionNotes: "",
      admVisitDoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDoctorId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
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
      opdipdtype: [4, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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

export class Pthologyresult {
  TestName: String;
  SubTestName: boolean;
  ParameterName: Date;
  NormalRange: any;
  Formula: any;
  ParameterShortName: any;
  ResultValue: any;
  ParameterId: any;
  ParaBoldFlag: any;
  SuggestionNote: any;
  PathResultDr1: any;
  PathReportId: any;
  CategoryId: any;
  TestId: any;
  SubTestId: any;
  UnitId: any;
  PrintOrder: any;
  ParaIsNumeric: any;
  PIsNumeric: any;
  CategoryName: any;
  UnitName: any;
  MinValue: any;
  MaxValue: any;
  SampleID: any;
  adm_Visit_docId: any;

  constructor(Pthologyresult) {
    this.TestName = Pthologyresult.TestName || '';
    this.SubTestName = Pthologyresult.SubTestName || '';
    this.ParameterName = Pthologyresult.ParameterName || '';
    this.NormalRange = Pthologyresult.NormalRange || '';
    this.Formula = Pthologyresult.Formula || '';
    this.ParameterShortName = Pthologyresult.ParameterShortName || '';
    this.ResultValue = Pthologyresult.ResultValue || '';
    this.ParameterId = Pthologyresult.ParameterId || '';
    this.ParaBoldFlag = Pthologyresult.ParaBoldFlag || '';
    this.SuggestionNote = Pthologyresult.SuggestionNote || '';
    this.PathResultDr1 = Pthologyresult.PathResultDr1 || 0;
    this.adm_Visit_docId = Pthologyresult.adm_Visit_docId || 0;
    this.PathReportId = Pthologyresult.PathReportId || '';
    this.CategoryId = Pthologyresult.CategoryId || '';
    this.TestId = Pthologyresult.TestId || '';
    this.SubTestId = Pthologyresult.SubTestId || '';
    this.UnitId = Pthologyresult.UnitId || '';
    this.PrintOrder = Pthologyresult.PrintOrder || '';
    this.ParaIsNumeric = Pthologyresult.ParaIsNumeric || '';
    this.PIsNumeric = Pthologyresult.PIsNumeric || '';
    this.CategoryName = Pthologyresult.CategoryName || '';
    this.UnitName = Pthologyresult.UnitName || '';
    this.MinValue = Pthologyresult.MinValue || '';
    this.MaxValue = Pthologyresult.MaxValue || 0;
    this.SampleID = Pthologyresult.SampleID || 0;
  }

}


export class PthologyTemplateresult {

  TemplateDesc: String;
  PrintTestName: String;
  PathReportID: any;
  TestId: any;
  PathResultDr1: any;

  constructor(PthologyTemplateresult) {
    this.TemplateDesc = PthologyTemplateresult.TemplateDesc || '';
    this.PrintTestName = PthologyTemplateresult.PrintTestName || '';
    this.PathReportID = PthologyTemplateresult.PathReportID || '';
    this.TestId = PthologyTemplateresult.TestId || 0;
    this.PathResultDr1 = PthologyTemplateresult.PathResultDr1 || '';
  }
}


export class PthologyresultInsert {
  PathReportId: number;
  CategoryID: number;
  TestID: any;
  SubTestId: any;
  ParameterId: any;
  ResultValue: any;
  UnitId: any;
  NormalRange: any;
  PrintOrder: any;
  ParaIsNumeric: boolean;
  PIsNumeric: any;
  CategoryName: any;
  TestName: any;
  SubTestName: any;
  ParameterName: any;
  UnitName: String;
  PatientName: any;
  RegNo: any;
  SampleID: any;

  constructor(pathologyInsertReportObj) {
    this.PathReportId = pathologyInsertReportObj.PathReportId || 0;
    this.CategoryID = pathologyInsertReportObj.CategoryID || 0;
    this.TestID = pathologyInsertReportObj.TestID || 0;
    this.SubTestId = pathologyInsertReportObj.SubTestId || 0;
    this.ParameterId = pathologyInsertReportObj.ParameterId || 0;
    this.ResultValue = pathologyInsertReportObj.ResultValue || '0';
    this.UnitId = pathologyInsertReportObj.UnitId || '0';
    this.NormalRange = pathologyInsertReportObj.NormalRange || '';
    this.PrintOrder = pathologyInsertReportObj.PrintOrder || '0';
    this.ParaIsNumeric = pathologyInsertReportObj.ParaIsNumeric || 0;
    this.PIsNumeric = pathologyInsertReportObj.PIsNumeric || 0;
    this.CategoryName = pathologyInsertReportObj.CategoryName || '';
    this.TestName = pathologyInsertReportObj.TestName || '';
    this.SubTestName = pathologyInsertReportObj.SubTestName || '';
    this.ParameterName = pathologyInsertReportObj.ParameterName || '';
    this.UnitName = pathologyInsertReportObj.UnitName || '';
    this.PatientName = pathologyInsertReportObj.PatientName || '';
    this.RegNo = pathologyInsertReportObj.RegNo || '0';
    this.SampleID = pathologyInsertReportObj.SampleID || 0;

  }

}

export class PthologyresulDelt {
  pathReportID: number;
  constructor(pathologyDeleteObj) {
    this.pathReportID = pathologyDeleteObj.pathReportID || 0;
  }
}


export class PthologyresulUp {
  PathReportID: number;
  ReportDate: any;
  ReportTime: any;
  IsCompleted: boolean;
  IsPrinted: boolean;
  PathResultDr1: any;
  PathResultDr2: any;
  PathResultDr3: any;
  IsTemplateTest: any;
  SuggestionNotes: any;
  AdmVisitDoctorID: any;
  RefDoctorID: any;

  constructor(pathologyUpdateReportObj) {
    this.PathReportID = pathologyUpdateReportObj.PathReportID || 0;
    this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
    this.ReportDate = pathologyUpdateReportObj.ReportDate || '';
    this.ReportTime = pathologyUpdateReportObj.ReportTime || '';
    this.IsCompleted = pathologyUpdateReportObj.IsCompleted || 0;
    this.IsPrinted = pathologyUpdateReportObj.IsPrinted || 0;
    this.PathResultDr1 = pathologyUpdateReportObj.PathResultDr1 || 0;
    this.PathResultDr2 = pathologyUpdateReportObj.PathResultDr2 || 0;
    this.PathResultDr3 = pathologyUpdateReportObj.PathResultDr3 || 0;
    this.IsTemplateTest = pathologyUpdateReportObj.IsTemplateTest || 0;
    this.SuggestionNotes = pathologyUpdateReportObj.SuggestionNotes || '';
    this.AdmVisitDoctorID = pathologyUpdateReportObj.AdmVisitDoctorID || 0;
    this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
  }
}