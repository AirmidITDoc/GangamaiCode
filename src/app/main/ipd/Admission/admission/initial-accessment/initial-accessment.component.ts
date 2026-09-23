import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { LanguageOption, SpeechRecognitionService } from "app/main/shared/services/speech-recognition.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { AdmissionService } from "../admission.service";


@Component({
  selector: 'app-initial-accessment',
  templateUrl: './initial-accessment.component.html',
  styleUrls: ['./initial-accessment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class InitialAccessmentComponent {
  AccessForm: FormGroup
 
 private recognition: any = null;
    isListening = false;
    selectedLang = 'en-US';
    languages: LanguageOption[] = [];


  vcauseofdeath: any
  vpdiagnosis: any
  vIcdecode: any
  vfdiagnosis: any
  vAdmissionId=0

  displayedColumns1: string[] = ['diagnosisName', 'icdversion', 'icdcode', 'shortName', 'Add'];

  displayedColumns2: string[] = ['icdcode', 'diagnosisName'];
  DSdiagnosis = new MatTableDataSource<ICDEdetailList>();

  constructor(
    public _AdmissionService: AdmissionService,
    public dialogRef: MatDialogRef<InitialAccessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder, public speechService: SpeechRecognitionService,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog
  ) { }

  ICDEtList: any = new MatTableDataSource<ICDEdetailList>();
  ngOnInit(): void {

    this.AccessForm = this.createAccessmentForm();
    this.AccessForm.markAllAsTouched();
    this.AccessDignosisArray.push(this.createmopCasepaperDignosis());

    if (this.data) {
      this.vAdmissionId=this.data.admissionId
    }
    this.getIcdedata()
  }

  createAccessmentForm(): FormGroup {
    return this._formBuilder.group({
      NameSearch: [''],
      causeofdeath: [''],
      pdiagnosis: [''],
      Icdecode: [''],
      fdiagnosis: [''],
      AcessDignosisMaster: this._formBuilder.array([]),

    });
  }
  DiagnosisName: any = ''
  getIcdedata() {

    this.DiagnosisName = this.AccessForm.get('NameSearch').value
    const filters: any[] = [];
    filters.push(
      {
        "fieldName": "DiagnosisName",
        "fieldValue": String(this.DiagnosisName),
        "opType": "Contains"
      }
    );

    const data = {
      "first": 0,
      "rows": 100,
      "sortField": "Icdid",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };

    this._AdmissionService.getIcdelist(data).subscribe((response) => {
      this.ICDEtList.data = response.data;
      console.log(this.ICDEtList.data)

    })
  }

  onSearchClear() {
    this.AccessForm.get("NameSearch").setValue("");
    this.DiagnosisName = ""
    this.getIcdedata();
    // this.getParameterNameCombobox();
  }
  ChargeList: any = [];
  chargeslist: any = [];
  onAdd(event) {

    this.adddiagnos(event);
  }


  adddiagnos(row) {

    if (!row || !row.icdid) {
      console.error("Invalid row data!");
      return;
    }

    if (!this.chargeslist)
      this.chargeslist = [];
    debugger
    if (this.chargeslist.length > 1) {
      const isDuplicate = this.chargeslist.some(ele => ele.icdid === row.icdid);

      if (isDuplicate) {
        this.toastr.warning('Selected ICDE already added in the list', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    this.chargeslist.push(row);

    this.addICDEdata(row);

    this.DSdiagnosis.data = [...this.chargeslist];

  }


  addICDEdata(row) {

    this.ChargeList = this.DSdiagnosis.data || [];

    const exists = this.ChargeList.some(item => item.icdid === row.icdid);
    if (!exists) {
      debugger
      this.ChargeList.push({
        icdid: row.icdid,
        diagnosisName: row.diagnosisName,
        icdversion: row.icdversion,
        icdcode: row.icdcode,
        shortName: row.shortName
      });

      this.DSdiagnosis.data = [...this.ChargeList];
      // this.dsTemparoryList.data = [...this.ChargeList];
    }
  }

  onMicToggle1() {

    this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
      const currentText = this.AccessForm.get('causeofdeath')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.AccessForm.get('causeofdeath')?.setValue(updated);
    });
  }
  onMicToggle2() {

    this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
      const currentText = this.AccessForm.get('pdiagnosis')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.AccessForm.get('pdiagnosis')?.setValue(updated);
    });
  }

  onMicToggle3() {

    this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
      const currentText = this.AccessForm.get('Icdecode')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.AccessForm.get('Icdecode')?.setValue(updated);
    });
  }
  onMicToggle4() {

    this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
      const currentText = this.AccessForm.get('fdiagnosis')?.value || '';
      const updated = currentText ? `${currentText} ${text}` : text;
      this.AccessForm.get('fdiagnosis')?.setValue(updated);
    });
  }

  createmopCasepaperDignosis(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      visitId: [this.vAdmissionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      icdcode: [element.icdcode ?? ''],
      diagnosisName: [element.diagnosisName ?? '']
    });
  }

  get AccessDignosisArray(): FormArray {
    return this.AccessForm.get('AcessDignosisMaster') as FormArray;
  }


  onSubmit() {
  
    this.DSdiagnosis.data.forEach(element => {
      const mopCasePaperFormGroup: FormGroup = this.createmopCasepaperDignosis(element);
      this.AccessDignosisArray.push(mopCasePaperFormGroup);
    });

    console.log(this.AccessForm.value)
    const submitData = {
      // "admissionReg": this.personalFormGroup.value,
      // "admission": this.admissionFormGroup.value,
      // "patientPolicy": this.policyFormGroup.value
    };


    this._AdmissionService.AccessmentInsert(submitData).subscribe(response => {


    })
  }

  onClose(obj) {
    this._matDialog.closeAll()
  }
}


export class ICDEdetailList {
  diagnosisName: any
  icdversion: any
  icdcode: any
  shortName: any

  constructor(ICDEdetailList) {
    {
      this.diagnosisName = ICDEdetailList.diagnosisName || '';
      this.icdversion = ICDEdetailList.icdversion || 0;
      this.icdcode = ICDEdetailList.icdcode || '';
      this.shortName = ICDEdetailList.shortName || ''

    }
  }
}