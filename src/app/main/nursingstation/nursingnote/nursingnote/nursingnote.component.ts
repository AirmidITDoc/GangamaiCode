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
    'ItemName', 
    'DoseName',
    'Route',
    'Frequency', 
    'NurseName',
    'Action'
  ]
  currentDate = new Date();
  isLoading: any;
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  PathologyDoctorList: any = [];
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  noOptionFound:any;
  filteredOptions:any; 
  vCompanyName:any;
  vRegNo:any;
  vDescription:any;
  vPatienName:any;
  vGender:any;
  vAdmissionDate:any;
  vAdmissionID:any;
  vIPDNo:any;
  vAgeyear:any;
  vAgeMonth:any;
  vRegId:any;
  vAgeDay:any;
  vWardName:any;
  vBedName:any;
  vPatientType:any;
  vRefDocName:any;
  vTariffName:any;
  vDoctorname:any;
  vDepartmentName:any;
  vTariffId:any;
  vClassId:any;
  vClassName:any;
  vGenderName:any;
  vCompanyId:any;
  vVisitDate:any;
  PatientListfilteredOptionsIP: any; 
  registerObj:any;
  NoteList:any=[]; 
   selectedAdvanceObj: AdmissionPersonlModel;
  dsNursingNoteList = new MatTableDataSource<DocNote>();
  dsItemList = new MatTableDataSource<MedicineItemList>();
  vAdmissionTime:any
  TemplateNoteList:any=[];
  TemplateListfilteredOptions:Observable<string[]>
  isTempSelected:boolean=false
  MedicineItemForm:FormGroup
  isItemIdSelected:boolean=false;
  isDoseSelected:boolean=false
  vRoute:any;
  vFrequency:any;
  vNurseName:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
 

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService, 
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder, 
    public datePipe: DatePipe,   
    public toastr: ToastrService,
    public _matDialog: MatDialog,  
    private _formBuilder:FormBuilder
  )
  { 
    if (this.advanceDataStored.storage) { 
    this.selectedAdvanceObj = this.advanceDataStored.storage;
    // this.PatientHeaderObj = this.advanceDataStored.storage;
    console.log( this.selectedAdvanceObj)
  } 
 }

  //doctorone filter
  public pathodoctorFilterCtrl: FormControl = new FormControl();
  public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  ngOnInit(): void { 
    this.MedicineItemForm = this.MedicineItemform();
    if(this.selectedAdvanceObj){
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
      this.getNoteTablelist(this.selectedAdvanceObj)
    }  
    this.getTemplateNoteList();  
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
  getSearchList(){
    debugger
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
  
  getSelectedObjRegIP(obj){
    console.log(obj)
    this.registerObj = obj;
    this.vPatienName = obj.FirstName + ' ' +obj.MiddleName+ ' ' + obj.LastName;
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
    this.getNoteTablelist(obj)
  }
  ///Template note list
    getTemplateNoteList() {
      this._NursingStationService.getNursingNoteCombo().subscribe(data => {
        this.TemplateNoteList = data;
        console.log(this.TemplateNoteList)
        this.TemplateListfilteredOptions = this._NursingStationService.myform.get('TemplateName').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterTemp(value) : this.TemplateNoteList.slice()),
        );
      }); 
    } 
    private _filterTemp(value: any): string[] {
      if (value) {
        const filterValue = value && value.NursTempName ? value.NursTempName.toLowerCase() : value.toLowerCase();
        return this.TemplateNoteList.filter(option => option.NursTempName.toLowerCase().includes(filterValue));
      }
    }
    getOptionTextTemplateName(option) {
      return option ? option.NursTempName : option.NursTempName
    }
    getSelectedObjTemplateName(obj) {
      console.log(obj)
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
}

 onAdd(){
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
  if(this._NursingStationService.myform.get('TemplateName').value){
    if(!this.TemplateNoteList.some(item=> item.NursTempName == this._NursingStationService.myform.get('TemplateName').value.NursTempName)){
      this.toastr.warning('Please select valid Note', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  this.vDescription = this._NursingStationService.myform.get('TemplateName').value.NursTempName || ''; 
  this._NursingStationService.myform.get('TemplateName').setValue('');
 }

 getNoteTablelist(el){
  var vdata={
    'AdmId': el.AdmissionID
  }
  this._NursingStationService.getNursingNotelist(vdata).subscribe(data =>{
    this.dsNursingNoteList.data = data as DocNote[];
    console.log(this.dsNursingNoteList.data);
    this.dsNursingNoteList.sort = this.sort;
    this.dsNursingNoteList.paginator =this.paginator;
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
      const formattedTime = datePipe.transform(currentDate, 'shortTime');
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
    if(!this._NursingStationService.myform.get("NursingNoteId").value){
      let nursingTemplateInsert = {}; 
      nursingTemplateInsert['admID'] = this.vAdmissionID ;
      nursingTemplateInsert['tDate'] = formattedDate;
      nursingTemplateInsert['tTime '] = formattedTime;
      nursingTemplateInsert['nursingNotes'] = this._NursingStationService.myform.get("Description").value || '', 
      nursingTemplateInsert['docNoteId'] = 0,
      nursingTemplateInsert['createdBy'] = this.accountService.currentUserValue.user.id  
  
      let submitData = {  
        "saveNursingNoteParam": nursingTemplateInsert
      };
      console.log(submitData); 
      this._NursingStationService.NursingNoteInsert(submitData).subscribe(response => { 
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); 
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
   else{   
    let updateTDoctorsNotesParamObj = {}; 
    updateTDoctorsNotesParamObj['admID'] = this.vAdmissionID ;
    updateTDoctorsNotesParamObj['tDate'] = formattedDate;
    updateTDoctorsNotesParamObj['tTime '] = formattedTime;
    updateTDoctorsNotesParamObj['nursingNotes'] = this._NursingStationService.myform.get("Description").value || '', 
    updateTDoctorsNotesParamObj['docNoteId'] = this._NursingStationService.myform.get("DoctNoteId").value || 0;
    updateTDoctorsNotesParamObj['modifiedBy'] = this.accountService.currentUserValue.user.id  

    let submitData = {  
      "updateNursingNoteParam": updateTDoctorsNotesParamObj
    };
    console.log(submitData); 
    this._NursingStationService.NursingNoteUpdate(submitData).subscribe(response => { 
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
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
  } 
  OnEdit(row) {
    console.log(row)
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName,
      "Description": row.NursingNotes, 
      "UpdatedBy": row.UpdatedBy,
      "NursingNoteId":row.DocNoteId
    }
    this._NursingStationService.NursingNotepoppulateForm(m_data);
  }
  

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
     this.dateTimeObj = dateTimeObj;
  } 
  onClear() {
    this._NursingStationService.myform.reset();
  } 
  onClose() {
    this._NursingStationService.myform.reset();
    this._matDialog.closeAll();
    this.onClearPatientInfo();
  } 
  doseList:any=[];
  filteredOptionsItem:any;
  filteredOptionsDosename:Observable<string[]>

     //Prescription List
  getSearchItemList() {
    if ((this.vRegNo == '' || this.vRegNo == '0' || this.vRegNo== undefined)) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    var m_data = {
      "ItemName": `${this.MedicineItemForm.get('ItemId').value}%`,
      "StoreId": this.accountService.currentUserValue.user.storeId
    }
    console.log(m_data);
    this._NursingStationService.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
       //console.log(this.filteredOptionsItem);
      this.filteredOptionsItem = data;
      if (this.filteredOptionsItem.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionItemText(option) { 
    if (!option) return '';
    return option.ItemName;
  }
  getSelectedObjItem(obj) {
    console.log(obj) 
    this.vDoseId = obj.DoseName
    this.vRoute = obj.DoseDay
    this.vFrequency = obj.Instruction 
    this.getDoseList();
  }
  vDoseId:any;
  getDoseList() {
    this._NursingStationService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDosename(value) : this.doseList.slice()),
      );
      if(this.vDoseId){
        const dvalue = this.doseList.filter(item=> item.DoseId == this.vDoseId)
        this.MedicineItemForm.get('DoseId').setValue(dvalue[0])
      }
    });
  }
  private _filterDosename(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
      return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }
    @ViewChild('itemid') itemid: ElementRef;
    @ViewChild('dosename') dosename: ElementRef;
    @ViewChild('Day') Day: ElementRef;
    @ViewChild('Instruction') Instruction: ElementRef;
    @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;  

    onEnterItem(event): void {
      if (event.which === 13) {
        this.dosename.nativeElement.focus();
      }
    }
    public onEnterDose(event): void {
      if (event.which === 13) {
        this.Day.nativeElement.focus();
      }
    }
    public onEnterqty(event): void {
      if (event.which === 13) {
        this.Instruction.nativeElement.focus();
      }
    }
    public onEnterremark(event): void {
      if (event.which === 13) {
        this.addbutton.focus;
       // this.add = true;
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
  
}
 
export class DocNote {

  AdmID : number;
  TDate : Date;
  TTime : Date;
  DoctorsNotes : any;
  IsAddedBy : any;
  DoctNoteId  : any;
 
  constructor(DocNote) {
 
    this.AdmID = DocNote.AdmID || 0;
    this.TDate = DocNote.TDate || '';
    this.TTime = DocNote.TTime || '';
    this.DoctorsNotes = DocNote.DoctorsNotes || '';
    this.IsAddedBy = DocNote.IsAddedBy || 0;
   this.DoctNoteId =DocNote.DoctNoteId  || 0;
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



