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
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-new-icde',
  templateUrl: './new-icde.component.html',
  styleUrls: ['./new-icde.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewICDEComponent implements OnInit {
  IcdUpdateForm: FormGroup
  searchFormGroup: FormGroup;


  private recognition: any = null;
  isListening = false;
  selectedLang = 'en-US';
  languages: LanguageOption[] = [];
  ipdiagId = 0
  registerObj: any;
  registerObj1: any

  vIcdecode: any
  vfdiagnosis: any
  vAdmissionId = 0
  PatientName: any;
  RegId1 = "0";
  vIPDNo = ''
  isSyncflag = false
  flagCode = 'NotSync'
  screenFromString = 'Common-form';

  Patientdetails: any;
  DoctorName: any;
  OPDNo: any;
  RegNo: any;
  IPDNo: any;
  RegId: any = '';
  OP_IP_Id: any = 0;
  vSelectedOption: any = '1';
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;
  DoctorNamecheck: boolean = false;
  showRightSideSection: boolean = true;
  ustatus: boolean = true;

  ICDEtList: any = new MatTableDataSource<ICDEdetailList>();
  constructor(
    public _IcdUpdateService: IcdUpdateService,
    public dialogRef: MatDialogRef<NewICDEComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public datePipe: DatePipe,
    public toastr: ToastrService, public permissionService: PagePermissionService,
    private _formBuilder: UntypedFormBuilder, public speechService: SpeechRecognitionService,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, private accountService: AuthenticationService,
  ) { }
  UpdateRtrvDescriptionList: any = [];
  addProDiagnolist: any = [];
  ProdiagnosisMentionItems: Array<{ id: string | number; text: string }> = [];
  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    if (this.data) {
      console.log(this.data)
      this.vAdmissionId = this.data.admId
      this.OP_IP_Id = this.data.admId
      this.ipdiagId = this.data.ipdiagId
      this.ustatus = false
      if (this.ipdiagId > 0)
        this.getRtrvdiagnosisList(this.data)

      // if (res && Array.isArray(res.tIpEmrdignosisHistories)) {
      //     this.UpdateRtrvDescriptionList = res.tIpEmrdignosisHistories

      const ProDiagnosis = this.UpdateRtrvDescriptionList.filter(item => item.flagCode === 'ProDiagnosis');
      if (ProDiagnosis.length > 0) {
        ProDiagnosis.forEach(element => {
          this.addProDiagnolist.push(
            {
              id: element.ipemrdiagnId,
              descriptionName: element.diagnosisinformation,
              icdcode: element.icdcode || '',
              diagnosisName: element.diagnosis,
              icdCodeWithDignosis: element.diagnosisinformation
            }
          )
        })
        this.ProdiagnosisMentionItems = this.addProDiagnolist
          .filter(item => item.descriptionName)
          .map(item => ({
            id: item.id,
            text: item.descriptionName
          }));
        // this.MyForm.get('mAssignProDiagnosis').setValue(this.addProDiagnolist);
      }
    }


    this.IcdUpdateForm = this.buildForm();
    this.IcdUpdateForm.markAllAsTouched();

    if (this.ipdiagId > 0) {
      const v = this.data.isSync;
      this.IcdUpdateForm.get('mrdDiagnosisInfoHeader.isSync')
        .setValue(v === true || v === 1 || v === '1' || v === 'true');
    }

    if ((this.vAdmissionId ?? 0) > 0) {
      setTimeout(() => {
        this._IcdUpdateService.getAdmissionById(this.vAdmissionId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(this.registerObj1)
          if (response) {
            this._IcdUpdateService.getRegistraionById(response.regId).subscribe((response) => {
              this.registerObj = response;
              this.PatientName = response.firstName + ' ' + response.middleName + ' ' + response.lastName
              this.registerObj.admissionDate = this.registerObj1.admissionDate
              this.registerObj.regNo = this.registerObj1.regNo
              this.registerObj.admissionId = this.registerObj1.admissionId
              this.registerObj.admissionDate = this.registerObj1.admissionDate
              console.log(this.registerObj)
            });
          } else {
            this._IcdUpdateService.getVisitById(this.vAdmissionId).subscribe((response) => {
              if (response) {
                this._IcdUpdateService.getRegistraionById(response.regId).subscribe((response) => {
                  this.registerObj = response;
                  console.log(response)
                  this.PatientName = response.firstName + ' ' + response.middleName + ' ' + response.lastName
                  this.registerObj.admissionDate = this.registerObj1.admissionDate
                  this.registerObj.regNo = this.registerObj1.regNo
                  this.registerObj.admissionId = this.registerObj1.visitId
                  this.registerObj.admissionDate = this.registerObj1.admissionDate
                  console.log(this.registerObj)
                });
              }

            });
          }
        });
      }, 500);
    }
  }

  createSearchForm() {
    return this._formBuilder.group({

      regId: [''],
      opIpType: [0],

    });
  }



  buildForm(): FormGroup {
    return this._formBuilder.group({
      mrdDiagnosisInfoHeader: this._formBuilder.group({
        ipdiagId: [this.ipdiagId || 0],
        admId: [this.OP_IP_Id, Validators.required],
        isSync: [false],
        createdBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        modifiedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      }),


      PatientDignosisMaster: [[]],
    });
  }

  get diagnosisChips(): any[] {
    return this.IcdUpdateForm.get('PatientDignosisMaster')?.value || [];
  }

  addDiagnolist: any[] = [];

  selectChangeDiagnosis(selectedChips: any[]) {
    this.addDiagnolist = selectedChips || [];
    this.IcdUpdateForm.get('PatientDignosisMaster')?.setValue(this.addDiagnolist);
  }



  onSubmit() {

    const header = this.IcdUpdateForm.get('mrdDiagnosisInfoHeader') as FormGroup;

    if (this.ipdiagId !== 0) {
      header.removeControl('createdBy');
    } else {
      header.removeControl('modifiedBy');
    }

    if (this.IcdUpdateForm.get('mrdDiagnosisInfoHeader.isSync').value)
      this.flagCode = 'Sync'
    else
      this.flagCode = 'NotSync'


    this.IcdUpdateForm.get('mrdDiagnosisInfoHeader.admId').setValue(this.OP_IP_Id)


    debugger
    if (this.IcdUpdateForm.invalid || this.OP_IP_Id == 0) {
      this.IcdUpdateForm.markAllAsTouched();
      this.toastr.warning('Please select Patient....');
      return;
    }

    const formValue = this.IcdUpdateForm.value;
    const createdBy = this.accountService.currentUserValue.userId;


    const mrdDiagnosisInfoDetail = (formValue.PatientDignosisMaster || []).map((chip: any) => ({
      // ipdiagDetId: chip.ipdiagDetId || 0,
      ipdiagId: chip.ipdiagId || this.ipdiagId || 0,
      admId: this.OP_IP_Id,
      diagnosis: chip.diagnosisName || chip.diagnosis || chip.icdCodeWithDignosis || '',
      icdcode: chip.icdcode || '',
      diagnosisinformation: chip.icdCodeWithDignosis || chip.diagnosisinformation || chip.descriptionName || '',
      flagCode: this.flagCode,
      createdBy: createdBy
    }));

    if (!mrdDiagnosisInfoDetail.length) {
      this.toastr.warning('Diagnosis is required. Please select at least one');
      return;
    }

    const submitData = {
      mrdDiagnosisInfoHeader: formValue.mrdDiagnosisInfoHeader,
      mrdDiagnosisInfoDetail: mrdDiagnosisInfoDetail
    };

    console.log(submitData);

    this._IcdUpdateService.IcdeInsert(submitData).subscribe(response => {
      this._matDialog.closeAll();
    });
  }

  mentionItems: Array<{ id: string | number; text: string }> = [];


  getRtrvdiagnosisList(obj?: any): void {

    console.log('vAdmissionId →', this.vAdmissionId);

    const filters: any[] = [];

    filters.push(

      {
        "fieldName": "AdmId",
        "fieldValue": String(this.vAdmissionId),
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999,
      "sortField": "",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    this._IcdUpdateService.getDiagnosisListbyId(data).subscribe((response) => {
      const Diagnosis = response.data;
      console.log(response.data)
      this.addDiagnolist = [];

      if (Diagnosis && Diagnosis.length > 0) {
        Diagnosis.forEach((element: any) => {

          const diagnosisObj = {
            id: element.ipdiagnosisId,
            ipdiagDetId: element.ipdiagDetId || 0,
            ipdiagId: element.ipdiagId || this.ipdiagId || 0,
            descriptionName: element.descriptionName || element.diagnosisinformation,
            icdcode: element.icdcode || '',
            diagnosisName: element.diagnosis || element.descriptionName || element.diagnosisinformation,
            icdCodeWithDignosis: element.diagnosisinformation ||
              `${element.icdcode || ''} - ${element.diagnosis || element.descriptionName || ''
              }`
          };

          this.addDiagnolist.push(diagnosisObj);
        });
      }

      this.IcdUpdateForm.get('PatientDignosisMaster')?.setValue(this.addDiagnolist);

      this.updateDiagnosisMentionItems(this.addDiagnolist);

      console.log('CHIP DATA:', this.addDiagnolist);

    });
  }

  getRtrvProvisionaldiagnosis(obj?: any): void {

    console.log('vAdmissionId →', this.vAdmissionId);

    const filters: any[] = [];

    filters.push(

      {
        "fieldName": "AdmId",
        "fieldValue": String(this.vAdmissionId),
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999,
      "sortField": "",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    this._IcdUpdateService.getDiagnosisListbyId(data).subscribe((response) => {
      const Diagnosis = response.data;
      console.log(response.data)
      this.addDiagnolist = [];

      if (Diagnosis && Diagnosis.length > 0) {
        Diagnosis.forEach((element: any) => {

          const diagnosisObj = {
            id: element.ipdiagnosisId,
            ipdiagDetId: element.ipdiagDetId || 0,
            ipdiagId: element.ipdiagId || this.ipdiagId || 0,
            descriptionName: element.descriptionName || element.diagnosisinformation,
            icdcode: element.icdcode || '',
            diagnosisName: element.diagnosis || element.descriptionName || element.diagnosisinformation,
            icdCodeWithDignosis: element.diagnosisinformation ||
              `${element.icdcode || ''} - ${element.diagnosis || element.descriptionName || ''
              }`
          };

          this.addDiagnolist.push(diagnosisObj);
        });
      }

      this.IcdUpdateForm.get('PatientDignosisMaster')?.setValue(this.addDiagnolist);

      this.updateDiagnosisMentionItems(this.addDiagnolist);

      console.log('CHIP DATA:', this.addDiagnolist);

    });
  }
  getDiagnosisList() {

    this._IcdUpdateService
      .getDiagnosisList1('Diagnosis')
      .subscribe((response: any) => {
        console.log('Diagnosis API Response:', response);

        const diagnoses = Array.isArray(response) ? response : response?.data || [];
        this.updateDiagnosisMentionItems(diagnoses);

        console.log('Mention Items:', this.mentionItems);
      });
  }

  private updateDiagnosisMentionItems(diagnoses: any[]): void {
    this.mentionItems = (diagnoses || [])
      .map(item => {
        // Priority: descriptionName first
        const text = item.descriptionName
          || item.diagnosisName
          || item.diagnosis
          || item.text
          || item.diagnosisinformation;
        if (!text || !isNaN(Number(text))) {
          return null;
        }

        return {
          id: item.id || item.ipdiagnosisId || text,
          text: text
        };
      })
      .filter((item): item is { id: string | number; text: string } => item !== null);
  }
  onChangePatientType(event) {
    if (event.value == '0') {
      this.RegId = '';
      this.searchFormGroup.get('regId').setValue('');

    } else if (event.value == '1') {
      this.RegId = '';
      this.searchFormGroup.get('regId').setValue('');

    }
  }
  getSelectedObjRegIP(obj) {
    console.log(obj);
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
      this.Patientdetails = obj;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = obj.regID;
      this.OP_IP_Id = obj.admissionID;
      this.IPDNo = obj.ipdNo;
      this.DoctorName = obj.doctorName;
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false;
      this.RegNo = obj?.regNo;
    }


  }

  getSelectedObj(obj) {
    console.log(obj)
    this.RegId1 = obj.regID;
    this.registerObj = obj;
    this.vIPDNo = obj.ipdNo
    this.vAdmissionId = obj.admissionID
    this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
    this.OP_IP_Id = obj.admissionID;
    this.IcdUpdateForm.get('mrdDiagnosisInfoHeader.admId')?.setValue(this.OP_IP_Id);

    console.log("this  : " + this.registerObj);

  }
  getSelectedObjOP(obj) {
    debugger
    console.log(obj);
    this.Patientdetails = obj;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.RegId = obj.regId;
    this.OP_IP_Id = obj.visitId;
    this.OPDNo = obj.opdNo;
    this.OPDNoCheck = true;
    this.DoctorNamecheck = true;
    this.IPDNocheck = false;
    this.RegNo = obj?.regNo;
    this.registerObj.age = this.Patientdetails.ageYear
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
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