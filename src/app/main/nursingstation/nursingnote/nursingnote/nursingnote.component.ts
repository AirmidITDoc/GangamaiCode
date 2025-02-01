import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NursingnoteService } from '../nursingnote.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AnyARecord } from 'dns';
import { CreateTemplateComponent } from '../../doctornote/create-template/create-template.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MedicineSchedulerComponent } from './medicine-scheduler/medicine-scheduler.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-nursingnote',
  templateUrl: './nursingnote.component.html',
  styleUrls: ['./nursingnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NursingnoteComponent implements OnInit {
  displayedColumns: string[] = [
    'VDate',
    'Note',
    'AddedBy',
    'Action'
  ]
  displayedItemColumn: string[] = [
    'Status',
    'ItemName',
    'DoseName',
    'Route',
    'Frequency',
    'NurseName',
    'Action'
  ]
  displayedHandOverNote: string[] = [
    'Date',
    'Shift',
    'I',
    'S',
    'B',
    'A',
    'R',
    'Comments',
    'CreatedBy',
    'Action'
  ]
  displayedItemColumnPatient: string[] = [
    'ItemName',
    'BatchNo',
    'Qty',
    'Action'
  ]

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vDescription = e.target.innerHTML;
  }

  currentDate = new Date();
  isLoading: any;
  IsAddFlag: boolean = false;;
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  PathologyDoctorList: any = [];
  isRegIdSelected: boolean = false;
  PatientListfilteredOptions: any;
  noOptionFound: any;
  filteredOptions: any;
  vCompanyName: any;
  vRegNo: any;
  vDescription: any;
  vPatienName: any;
  vGender: any;
  vAdmissionDate: any;
  vAdmissionID: any;
  vIPDNo: any;
  vAgeyear: any;
  vAgeMonth: any;
  vRegId: any;
  vAgeDay: any;
  vWardName: any;
  vBedName: any;
  vPatientType: any;
  vRefDocName: any;
  vTariffName: any;
  vDoctorname: any;
  vDepartmentName: any;
  vTariffId: any;
  vClassId: any;
  vClassName: any;
  vGenderName: any;
  vCompanyId: any;
  vVisitDate: any;
  PatientListfilteredOptionsIP: any;
  registerObj: any;
  NoteList: any = [];
  selectedAdvanceObj: AdmissionPersonlModel;
  dsNursingNoteList = new MatTableDataSource<DocNote>();
  dsItemList = new MatTableDataSource<MedicineItemList>();
  dsPatientItemList = new MatTableDataSource<MedicineItemList>();
  dsHandOverNoteList = new MatTableDataSource<DocNote>();
  vAdmissionTime: any
  TemplateNoteList: any = [];
  TemplateListfilteredOptions: Observable<string[]>
  isTempSelected: boolean = false
  MedicineItemForm: FormGroup
  vRoute: any;
  vFrequency: any;
  vNurseName: any;


  vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
  vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
  vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
  VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
  VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('Patientlistpaginator', { static: true }) public Patientlistpaginator: MatPaginator;
  @ViewChild('Medicinepaginator', { static: true }) public Medicinepaginator: MatPaginator;

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.PatientHeaderObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }

  //doctorone filter
  public pathodoctorFilterCtrl: FormControl = new FormControl();
  public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  ngOnInit(): void {
    this.MedicineItemForm = this.MedicineItemform();
    this.getTemplateNoteList();
    if (this.selectedAdvanceObj) {
      this.vRegNo = this.selectedAdvanceObj.RegNo;
      this.vPatienName = this.selectedAdvanceObj.PatientName;
      this.vDoctorname = this.selectedAdvanceObj.DoctorName;
      this.vDepartmentName = this.selectedAdvanceObj.DepartmentName;
      this.vAgeyear = this.selectedAdvanceObj.AgeYear;
      this.vAgeMonth = this.selectedAdvanceObj.AgeMonth;
      this.vAgeDay = this.selectedAdvanceObj.AgeDay;
      this.vBedName = this.selectedAdvanceObj.BedName;
      this.vWardName = this.selectedAdvanceObj.RoomName;
      this.vAdmissionID = this.selectedAdvanceObj.AdmissionID
      this.getNoteTablelist()
      this.getHandOverNotelist();
    }

  }
  MedicineItemform() {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Route: '',
      Frequency: '',
      NurseName: '',
    });
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this._NursingStationService.myform.get('RegID').value}%`
    }
    this._NursingStationService.getAdmittedPatientList(m_data).subscribe(data => {
      this.PatientListfilteredOptionsIP = data;
      if (this.PatientListfilteredOptionsIP.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }

  getOptionTextIPObj(option) {
    return option && option.FirstName + " " + option.LastName;
  }

  getSelectedObjRegIP(obj) {
    console.log(obj)
    this.registerObj = obj;
    this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.vRegId = obj.RegId;
    this.vAdmissionDate = obj.AdmissionDate;
    this.vAdmissionTime = obj.AdmissionTime;
    this.vDoctorname = obj.DoctorName;
    this.vVisitDate = this.datePipe.transform(obj.VisitDate, 'dd/MM/yyyy hh:mm a');
    this.vCompanyName = obj.CompanyName;
    this.vTariffName = obj.TariffName;
    this.vDepartmentName = obj.DepartmentName;
    this.vRegNo = obj.RegNo;
    this.vIPDNo = obj.IPDNo;
    this.vTariffId = obj.TariffId;
    this.vClassId = obj.ClassId;
    this.vAgeyear = obj.Age;
    this.vAgeMonth = obj.AgeMonth;
    this.vClassName = obj.ClassName;
    this.vAgeDay = obj.AgeDay;
    this.vGenderName = obj.GenderName;
    this.vRefDocName = obj.RefDoctorName
    this.vBedName = obj.BedName;
    this.vPatientType = obj.PatientType;
    this.vCompanyId = obj.CompanyId;
    this.vAdmissionID = obj.AdmissionID
    this.getNoteTablelist()
    this.getItemlistforMedication();
    this.getHandOverNotelist();
    this.getSchedulerlist();
    this.dsNursingNoteList.data = []
    this.dsHandOverNoteList.data = []
    this.HandOverNoteList = []
    this._NursingStationService.myform.get('TemplateName').setValue('')

  }
  ///Template note list
  getTemplateNoteList() {
    var vdata = {
      "category": "NursNote"
    }
    this._NursingStationService.getNursingNoteCombo(vdata).subscribe(data => {
      this.TemplateNoteList = data;
      this.TemplateListfilteredOptions = this._NursingStationService.myform.get('TemplateName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTemp(value) : this.TemplateNoteList.slice()),
      );
    });
  }
  private _filterTemp(value: any): string[] {
    if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.TemplateNoteList.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextTemplateName(option) {
    if (!option)
      return '';
    return option.TemplateName;
  }
  getSelectedObjTemplateName(obj) {
    // console.log(obj)
  }

  onClearPatientInfo() {
    this.vRegNo = '';
    this.vPatienName = '';
    this.vWardName = '';
    this.vBedName = '';
    this.vGender = '';
    this.vIPDNo = '';
    this.vDepartmentName = '';
    this.vDoctorname = '';
    this.vAgeyear = '';
    this.vAgeMonth = '';
    this.vAgeDay = '';
    this.vAdmissionDate = '';
    this.vRefDocName = '';
    this.vPatientType = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vAdmissionTime = '';
  }

  onAdd() {
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this._NursingStationService.myform.get('TemplateName').value) {
      this.toastr.warning('Please select Template note', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._NursingStationService.myform.get('TemplateName').value) {
      if (!this.TemplateNoteList.some(item => item.TemplateName == this._NursingStationService.myform.get('TemplateName').value.TemplateName)) {
        this.toastr.warning('Please select valid Note', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.vDescription = this._NursingStationService.myform.get('TemplateName').value.TemplateDesc || '';
    this._NursingStationService.myform.get('TemplateName').setValue('');
  }

  getNoteTablelist() {
    var vdata = {
      'AdmId': this.vAdmissionID
    }
    this._NursingStationService.getNursingNotelist(vdata).subscribe(data => {
      this.dsNursingNoteList.data = data as DocNote[];
      //console.log(this.dsNursingNoteList.data);
      this.dsNursingNoteList.sort = this.sort;
      this.dsNursingNoteList.paginator = this.paginator;
    });
  }


  getDoctorList() {
    this._NursingStationService.getDoctorCombo().subscribe(data => {
      this.PathologyDoctorList = data;
      this.filteredPathDoctor.next(this.PathologyDoctorList.slice());

    });
  }

  onSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vDescription == '' || this.vDescription == null || this.vDescription == undefined) {
      this.toastr.warning('Please enter Doctor Note', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.isLoading = 'submit';
    if (!this._NursingStationService.myform.get("NursingNoteId").value) {
      let nursingTemplateInsert = {

        "docNoteId": 0,

        "admID": this.vAdmissionID,

        "tDate": formattedDate,

        "tTime": formattedTime,

        "nursingNotes": this._NursingStationService.myform.get("Description").value || '',

        "createdBy": this.accountService.currentUserValue.user.id,

      }
      let submitData = {
        "saveNursingNoteParam": nursingTemplateInsert
      };
      console.log(submitData);
      this._NursingStationService.NursingNoteInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getNoteTablelist();
          this.getNursingNoteprint(this.vAdmissionID);
          this.onClose();
        }
        else {
          this.toastr.error('Record Data not saved !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
    else {
      let updateNursingNoteParam = {

        "docNoteId": this._NursingStationService.myform.get("NursingNoteId").value,

        "admID": this.vAdmissionID,

        "tDate": formattedDate,

        "tTime": formattedTime,

        "nursingNotes": this._NursingStationService.myform.get("Description").value || '',

        "modifiedBy": this.accountService.currentUserValue.user.id
      }
      let submitData = {
        "updateNursingNoteParam": updateNursingNoteParam
      };
      console.log(submitData);
      this._NursingStationService.NursingNoteUpdate(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getNoteTablelist();
          this.getNursingNoteprint(this.vAdmissionID);
          this.onClose();
        }
        else {
          this.toastr.error('Record Data not Updated !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });

      this.IsAddFlag = false
    }
  }
  OnEdit(row) {
    console.log(row)
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName,
      "Description": row.NursingNotes,
      "UpdatedBy": row.UpdatedBy,
      "NursingNoteId": row.DocNoteId
    }
    this._NursingStationService.NursingNotepoppulateForm(m_data);
    this.IsAddFlag = true;
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    //this._NursingStationService.myform.reset();
    this._matDialog.closeAll();
    //this.onClearPatientInfo(); 
    this._NursingStationService.myform.get('TemplateName').setValue('')
    this._NursingStationService.myform.get('Description').setValue('')
    this._NursingStationService.myform.get("NursingNoteId").setValue('')
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Morning')
    this.HandOverNoteList = []
    this.IsAddFlag = false
  }


  //Prescription List 
  Chargelist: any = [];
  //get Scheduler list
  getSchedulerlist() {
    var vdata = {
      'AdmissionId': this.vAdmissionID
    }
    this._NursingStationService.getSchedulerlist(vdata).subscribe(data => {
      this.dsItemList.data = data as MedicineItemList[];
      this.Chargelist = data as MedicineItemList[];
      this.dsItemList.sort = this.sort
      this.dsItemList.paginator = this.Medicinepaginator
    })
  }

  deleteTableRow(event, element) {
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  SelectedChecked(contact, event) {
    if (event.checked) {
      this.toastr.success('The selected dose/item has been successfully administered to the patient.', 'successfully !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  ///[^a-zA-Z0-9]/
  keyPressOk(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //Patient HandOver 
  HandOverNoteList: any = [];
  OnAddHand() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'hh:mm');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.HandOverNoteList.push(
      {
        VDate: formattedDate,
        MTime: formattedTime,
        ShiftInfo: this._NursingStationService.PatientHandOverForm.get('HandOverType').value,
        PatHand_I: this._NursingStationService.PatientHandOverForm.get('staffName').value,
        PatHand_S: this._NursingStationService.PatientHandOverForm.get('Stable').value,
        PatHand_B: this._NursingStationService.PatientHandOverForm.get('SYMPTOMS').value,
        PatHand_A: this._NursingStationService.PatientHandOverForm.get('Assessment').value,
        PatHand_R: this._NursingStationService.PatientHandOverForm.get('Instruction').value,
        Comments: this._NursingStationService.PatientHandOverForm.get('Comments').value || '',
        CreatedBy: this.accountService.currentUserValue.user.userName || ''
      }
    )
    this.onSubmitHandOver();
    // this.dsHandOverNoteList.data = this.HandOverNoteList   
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Morning')
  }
  deleteHandOverTableRow(element) {
    let index = this.HandOverNoteList.indexOf(element);
    if (index >= 0) {
      this.HandOverNoteList.splice(index, 1);
      this.dsHandOverNoteList.data = [];
      this.dsHandOverNoteList.data = this.HandOverNoteList;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  OnHandOverEdit(row) {
    console.log(row)
    var m_data = {
      "HandOverType": row.ShiftInfo,
      "staffName": row.PatHand_I,
      "SYMPTOMS": row.PatHand_B,
      "Instruction": row.PatHand_R,
      "Stable": row.PatHand_S,
      "Assessment": row.PatHand_A,
      "PatHandId": row.PatHandId,
      "Comments": row.Comments
    }
    this._NursingStationService.HandOverNotepoppulateForm(m_data);
    if (row.ShiftInfo == 'Night') {
      this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Night')
    } else if (row.ShiftInfo == 'Morning') {
      this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Morning')
    } else {
      this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Evening')
    }
  }
  onSubmitHandOver() {
    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if (!this.dsHandOverNoteList.data.length) {
    //   this.toastr.warning('Please add Patient HandOver Note', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    this.isLoading = 'submit';
    if (!this._NursingStationService.PatientHandOverForm.get('PatHandId').value) {
      let saveTNursingPatientHandoverParam
      this.dsHandOverNoteList.data.forEach(element => {
        saveTNursingPatientHandoverParam = {
          "patHandId": 0,
          "admID": this.vAdmissionID,
          "tDate": element.VDate,
          "tTime": element.MTime,
          "shiftInfo": element.ShiftInfo,
          "patHand_I": element.PatHand_I,
          "patHand_S": element.PatHand_S,
          "patHand_B": element.PatHand_B,
          "patHand_A": element.PatHand_A,
          "patHand_R": element.PatHand_R,
          "comments": element.Comments || '',
          "createdBy": this.accountService.currentUserValue.user.id,
        }
      })
      let submitData = {
        "saveTNursingPatientHandoverParam": saveTNursingPatientHandoverParam
      };
      console.log(submitData);
      this._NursingStationService.HandOverInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getHandOverNotelist();
          this.getPatientHandprint(this.vAdmissionID)
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not saved !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
    else {
      let updateTNursingPatientHandoverParam
      this.dsHandOverNoteList.data.forEach(element => {
        updateTNursingPatientHandoverParam = {
          "patHandId": this._NursingStationService.PatientHandOverForm.get('PatHandId').value,
          "admID": this.vAdmissionID,
          "tDate": element.VDate,
          "tTime": element.MTime,
          "shiftInfo": element.ShiftInfo,
          "patHand_I": element.PatHand_I,
          "patHand_S": element.PatHand_S,
          "patHand_B": element.PatHand_B,
          "patHand_A": element.PatHand_A,
          "patHand_R": element.PatHand_R,
          "comments": element.Comments || '',
          "modifiedBy": this.accountService.currentUserValue.user.id,
        }
      })
      let submitData = {
        "updateTNursingPatientHandoverParam": updateTNursingPatientHandoverParam
      };
      console.log(submitData);
      this._NursingStationService.HandOverUpdate(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getHandOverNotelist();
          this.getPatientHandprint(this.vAdmissionID)
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not Updated !, Please check error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this._NursingStationService.PatientHandOverForm.get('HandOverType').setValue('Morning')
    this.dsHandOverNoteList.data = [];
  }
  getHandOverNotelist() {
    var vdata = {
      'AdmId': this.vAdmissionID
    }
    this._NursingStationService.getHandOverNotelist(vdata).subscribe(data => {
      this.dsHandOverNoteList.data = data as DocNote[];
      this.HandOverNoteList = data as DocNote[];
      this.dsHandOverNoteList.sort = this.sort
      this.dsHandOverNoteList.paginator = this.paginator
    });
  }

  NewTemplate() {
    const dialogRef = this._matDialog.open(CreateTemplateComponent,
      {
        maxWidth: "75vw",
        height: '85%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getTemplateNoteList();
    });
  }

  //Medication chart
  getItemlistforMedication() {
    var vdata = {
      'AdmId': this.vAdmissionID
    }
    this._NursingStationService.getItemlistforMedication(vdata).subscribe(data => {
      this.dsPatientItemList.data = data as MedicineItemList[];
      console.log(this.dsPatientItemList.data);
      this.dsPatientItemList.sort = this.sort;
      this.dsPatientItemList.paginator = this.Patientlistpaginator;
    });
  }

  getSchedular(contact) {
    const dialogRef = this._matDialog.open(MedicineSchedulerComponent,
      {
        maxWidth: "75vw",
        height: '85%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getItemlistforMedication();
      this.getSchedulerlist();
    });
  }

  getNursingNoteprint(AdmID) {
    setTimeout(() => {
      this._NursingStationService.NursingNoteReport(
        AdmID
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "NURSING NOTE REPORT Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);

  }
  getPatientHandprint(AdmID) {
    setTimeout(() => {
      this._NursingStationService.getPatientHandprint(
        AdmID
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "NURSING PATIENT HANDOVER REPORT Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);

  }
}

export class DocNote {

  AdmID: number;
  TDate: Date;
  TTime: Date;
  DoctorsNotes: any;
  IsAddedBy: any;
  DoctNoteId: any;
  VDate: any;
  MTime: Date;
  ShiftInfo: any;
  PatHand_I: any;
  PatHand_S: any;
  PatHand_B: any;
  PatHand_A: any;
  PatHand_R: any;
  Comments: any;

  constructor(DocNote) {

    this.AdmID = DocNote.AdmID || 0;
    this.TDate = DocNote.TDate || '';
    this.TTime = DocNote.TTime || '';
    this.DoctorsNotes = DocNote.DoctorsNotes || '';
    this.IsAddedBy = DocNote.IsAddedBy || 0;
    this.DoctNoteId = DocNote.DoctNoteId || 0;
    this.VDate = DocNote.VDate || 0;
    this.MTime = DocNote.MTime || 0;
    this.ShiftInfo = DocNote.ShiftInfo || 0;
    this.PatHand_I = DocNote.PatHand_I || 0;
    this.PatHand_S = DocNote.PatHand_S || 0;
    this.PatHand_B = DocNote.PatHand_B || 0;
    this.PatHand_A = DocNote.PatHand_A || 0;
    this.PatHand_R = DocNote.PatHand_R || 0;
  }
}

export class MedicineItemList {
  ItemID: any;
  ItemId: any;
  ItemName: string;
  DoseName: any;
  Route: number;
  Frequency: any;
  NurseName: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  DoseDateTime: any;

  /**
  * Constructor
  *
  * @param MedicineItemList
  */
  constructor(MedicineItemList) {
    {
      this.ItemId = MedicineItemList.ItemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.ItemName = MedicineItemList.ItemName || "";
      this.Frequency = MedicineItemList.Frequency || '';
      this.DoseName = MedicineItemList.DoseName || '';
      this.Route = MedicineItemList.Route || 0;
      this.NurseName = MedicineItemList.NurseName || 0;

    }
  }
}



