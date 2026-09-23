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
import { IcdUpdateService } from "../icd-update.service";

@Component({
  selector: 'app-new-icde',
  templateUrl: './new-icde.component.html',
  styleUrls: ['./new-icde.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewICDEComponent {
  IcdUpdateForm: FormGroup
  searchFormGroup: FormGroup;
  private recognition: any = null;
  isListening = false;
  selectedLang = 'en-US';
  languages: LanguageOption[] = [];

  registerObj: any;
  vcauseofdeath: any
  vpdiagnosis: any
  vIcdecode: any
  vfdiagnosis: any
  vAdmissionId = 0
  PatientName: any;
  RegId1 = "0";
  vIPDNo = ''

  constructor(
    public _IcdUpdateService: IcdUpdateService,
    public dialogRef: MatDialogRef<NewICDEComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder, public speechService: SpeechRecognitionService,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, private accountService: AuthenticationService,
  ) { }

  ICDEtList: any = new MatTableDataSource<ICDEdetailList>();
  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.IcdUpdateForm = this.createAccessmentForm();
    this.IcdUpdateForm.markAllAsTouched();
    // this.AccessDignosisArray.push(this.createmopCasepaperDignosis());

    if (this.data) {
      this.vAdmissionId = this.data.admissionId

    }

  }
  createSearchForm() {
    return this._formBuilder.group({
      RegId: 0,
      AppointmentDate: [(new Date()).toISOString()],
    });
  }
  createAccessmentForm(): FormGroup {
    return this._formBuilder.group({
      NameSearch: [''],
      causeofdeath: [''],
      pdiagnosis: [''],
      Icdecode: [''],
      fdiagnosis: [''],

      hid: 0,
      reqDate: [new Date().toISOString],
      reqTime: [new Date().toISOString],
      oP_IP_Type: 1,
      oP_IP_Id: this.vAdmissionId,


      PatientDignosisMaster: this._formBuilder.array([]),
      PatientCauseMaster: this._formBuilder.array([]),
      PatientProvisionalDignosisMaster: this._formBuilder.array([]),
      PatientfinalDignosisMaster: this._formBuilder.array([]),

    });
  }

  addDiagnolist: any = [];

  selectChangeDiagnosis(selectedChips: string[]) {

    this.addDiagnolist = selectedChips;
    this.IcdUpdateForm.get('PatientDignosisMaster')?.setValue(this.addDiagnolist);
  }

  addProvDiagnolist: any = [];

  selectChangeProvDiagnosis(selectedChips: string[]) {

    this.addProvDiagnolist = selectedChips;
    this.IcdUpdateForm.get('PatientProvisionalDignosisMaster')?.setValue(this.addProvDiagnolist);
  }


  addCauselist: any = [];

  selectChangeCause(selectedChips: string[]) {

    this.addCauselist = selectedChips;
    this.IcdUpdateForm.get('PatientCauseMaster')?.setValue(this.addCauselist);
  }

  addfinalDiagnolist: any = [];

  selectChangefinalDiagnosis(selectedChips: string[]) {

    this.addfinalDiagnolist = selectedChips;
    this.IcdUpdateForm.get('PatientfinalDignosisMaster')?.setValue(this.addfinalDiagnolist);
  }

  addDiagnos(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.addDiagnolist.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeDiagno(Diagno: string): void {
    const index = this.addDiagnolist.indexOf(Diagno);
    if (index >= 0) {
      this.addDiagnolist.splice(index, 1);
    }
  }
  selectedobjDiagno(obj): void {
    const value = obj.Diagnosis;
    if ((value || '').trim()) {
      this.addDiagnolist.push(value.trim());
    }
  }


  createmopCasepaperDignosis(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      // visitId: [this.vAdmissionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      // descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // icdcode: [element.icdcode ?? ''],
      // diagnosisName: [element.diagnosisName ?? '']

      icdCode: [element.icdcode ?? ''],
      icdCodeDesc: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      addedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      updatedBy: 0,
      icdcdeMainName: [element.diagnosisName ?? ''],
      mainIcdcdeId: [element.icdcode ?? ''],

    });
  }

  get AccessDignosisArray(): FormArray {
    return this.IcdUpdateForm.get('PatientDignosisMaster') as FormArray;
  }
  getSelectedObj(obj) {
    console.log(obj)
    this.RegId1 = obj.regID;
    this.registerObj = obj;
    this.vIPDNo = obj.ipdNo
    this.vAdmissionId = obj.admissionID
    this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
    console.log("this  : " + this.registerObj);
    this.getRtrvdiagnosisList(this.vAdmissionId)
  }

  onSubmit() {


    console.log(this.IcdUpdateForm.value)
    const submitData = {
      // "admissionReg": this.personalFormGroup.value,
      // "admission": this.admissionFormGroup.value,
      // "patientPolicy": this.policyFormGroup.value
    };


    this._IcdUpdateService.IcdeInsert(submitData).subscribe(response => {


    })
  }
  mentionItems: Array<{ id: string | number; text: string }> = [];
  AllTypeDescription: any = []

  getRtrvdiagnosisList(obj?: any): void {
    this.addDiagnolist = [];
    this.AllTypeDescription = [];

    console.log('vAdmissionId →', this.vAdmissionId);
    debugger
    this._IcdUpdateService
      .getDiagnosisListbyId(this.vAdmissionId)
      .subscribe({
        next: (response: any) => {

          const Diagnosis = response;
          console.log(response)
          this.addDiagnolist = [];

          const diagnosisArray = this.IcdUpdateForm.get(
            'PatientDignosisMaster'
          ) as FormArray;

          diagnosisArray.clear();

          if (Diagnosis && Diagnosis.length > 0) {

            Diagnosis.forEach((element: any) => {

              const diagnosisObj = {
                id: element.ipdiagnosisId,
                descriptionName: element.descriptionName || '',
                icdcode: element.icdcode || '',
                diagnosisName:
                  element.diagnosis || element.descriptionName || '',
                icdCodeWithDignosis:
                  element.diagnosisinformation ||
                  `${element.icdcode || ''} - ${element.diagnosis || element.descriptionName || ''
                  }`
              };

              // For displaying chips
              this.addDiagnolist.push(diagnosisObj);

              // For FormArray
              diagnosisArray.push(
                this._formBuilder.control(diagnosisObj)
              );
            });
          }

          this.updateDiagnosisMentionItems(this.addDiagnolist);

          console.log('CHIP DATA:', this.addDiagnolist);
          console.log('FORM DATA:', diagnosisArray.value);
        },

        error: (err) => {
          console.error(
            'Error fetching diagnosis list',
            err
          );
        }
      });
  }
  private updateDiagnosisMentionItems(diagnoses: any[]): void {
    this.mentionItems = (diagnoses || [])
      .map(item => {
        const text = item.text || item.descriptionName || item.diagnosis ||
          item.diagnosisName || item.diagnosisinformation;
        return text ? {
          id: item.id || item.ipdiagnosisId || text,
          text
        } : null;
      })
      .filter((item): item is { id: string | number; text: string } => item !== null);
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