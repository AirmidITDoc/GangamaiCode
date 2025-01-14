import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";
import { DoctornoteService } from "../doctornote.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { fuseAnimations } from "@fuse/animations";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { element } from "protractor";
import { CreateTemplateComponent } from "../create-template/create-template.component";



@Component({
  selector: 'app-doctornote',
  templateUrl: './doctornote.component.html',
  styleUrls: ['./doctornote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctornoteComponent implements OnInit {
  displayedColumns: string[] = [
    'RegNo',
    'PatienName'
  ]
  displayedDoctorNote: string[] = [
    'VDate', 
    'Note',
    'CreatedBy',
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
    'CreatedBy',
    'Action'
  ]

  currentDate = new Date();
  screenFromString = 'opd-casepaper';
  sIsLoading: string = '';
  isLoading: string = '';
  PathologyDoctorList: any = [];
  wardList: any = [];
  TemplateNoteList: any = [];
  NoteList: any = [];
  vCompanyName: any;
  vRegNo: any;
  vRegId: any;
  vDescription: any;
  vPatienName: any;
  vGender: any;
  vAdmissionDate: any;
  vAdmissionID: any;
  vIPDNo: any;
  vAgeyear: any;
  vAgeMonth: any;
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
  isRegIdSelected: boolean = false;
  isTempSelected: boolean = false;
  noOptionFound: boolean = false;
  registerObj: any;
  vAdmissionTime: any;
  TemplateListfilteredOptions: Observable<string[]>;
  chargelist:any=[];
  selectedAdvanceObj: AdmissionPersonlModel;
  dsPatientList = new MatTableDataSource;
  dsDoctorNoteList = new MatTableDataSource<DocNote>();
  dsHandOverNoteList = new MatTableDataSource<DocNote>();


   vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
   vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
   vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
   VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
   VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
 


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _NursingStationService: DoctornoteService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) {
    if (this.advanceDataStored.storage) { 
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }



  ngOnInit(): void {
    this.getTemplateNoteList();
    // this.getWardNameList();
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
      this.vAdmissionID  = this.selectedAdvanceObj.AdmissionID;
      this.getDoctorNotelist()
      this.getHandOverNotelist();
    } 
 
  }
//Patient search 
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
  this.vAdmissionID = obj.AdmissionID
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
  this.getDoctorNotelist();
  this.getHandOverNotelist();
  this.dsDoctorNoteList.data = []
  this.dsHandOverNoteList.data = [] 
  this.HandOverNoteList = []
  this._NursingStationService.myform.get('TemplateName').setValue('')
}

///Template note list
  getTemplateNoteList() { 
    var vdata={
      "category": "DoctorNote"
    }
    console.log(vdata)
    this._NursingStationService.getDoctorNoteCombo(vdata).subscribe(data => {
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
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.TemplateNoteList.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextTemplateName(option) {
    return option ? option.TemplateName : option.TemplateName
  }
  getSelectedObjTemplateName(obj) {
    console.log(obj)
  }
  OnAdd() {
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
      if(!this.TemplateNoteList.some(item=> item.TemplateName == this._NursingStationService.myform.get('TemplateName').value.TemplateName)){
        this.toastr.warning('Please select valid Note', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.vDescription = this._NursingStationService.myform.get('TemplateName').value.TemplateDesc || ''; 
    this._NursingStationService.myform.get('TemplateName').setValue('');
  }
//Doctor List
getDoctorNotelist() {
    var vdata = {
      'AdmId': this.vAdmissionID 
    }
    this._NursingStationService.getDoctorNotelist(vdata).subscribe(data => {
      this.dsDoctorNoteList.data = data as DocNote[];
      this.chargelist = data as DocNote[];
      this.dsDoctorNoteList.sort = this.sort
      this.dsDoctorNoteList.paginator = this.paginator
      console.log(this.dsDoctorNoteList.data); 
    });
  }
  deleteTableRow(element) { 
    let index = this.chargelist.indexOf(element);
    if (index >= 0) {
      this.chargelist.splice(index, 1);
      this.dsDoctorNoteList.data = [];
      this.dsDoctorNoteList.data = this.chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });  
}
  // getWardNameList() {
  //   this._NursingStationService.getWardNameList().subscribe(data => {
  //     this.wardList = data;
  //   })
  // }
  doctNoteId:any;
  onSubmit() {   
      const currentDate = new Date();
      const datePipe = new DatePipe('en-US');
      const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
      const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');

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
    if(!this._NursingStationService.myform.get("DoctNoteId").value){ 
        let DocNoteTemplateInsertObj={
      
          "admID": this.vAdmissionID,
      
          "tDate": formattedDate,
      
          "tTime": formattedTime,
      
          "doctorsNotes":  this._NursingStationService.myform.get("Description").value || '', 
      
          "doctNoteId": 0,
      
          "createdBy": this.accountService.currentUserValue.user.id,
      
        } 
      let submitData = {  
        "saveTDoctorsNotesParam": DocNoteTemplateInsertObj
      };
      console.log(submitData); 
      this._NursingStationService.DoctorNoteInsert(submitData).subscribe(response => { 
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); 
          this.getDoctorNotelist();
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
   else{ 
    let updateTDoctorsNotesParamObj={
      
      "doctNoteId": this._NursingStationService.myform.get("DoctNoteId").value,
      
      "admID": this.vAdmissionID,
  
      "tDate": formattedDate,
  
      "tTime": formattedTime,
  
      "doctorsNotes":  this._NursingStationService.myform.get("Description").value || '',  
  
      "modifiedBy": this.accountService.currentUserValue.user.id,
  
    }   
    let submitData = {  
      "updateTDoctorsNotesParam": updateTDoctorsNotesParamObj
    };
    console.log(submitData); 
    this._NursingStationService.DoctorNoteUpdate(submitData).subscribe(response => {  
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
        this.getDoctorNotelist();
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
  } 
  OnEdit(row) {
    console.log(row)
    var m_data = {
      "TemplateId": row.TemplateId,
     // "TemplateName": row.TemplateName,
      "Description": row.DoctorsNotes, 
      "UpdatedBy": row.UpdatedBy,
      "DoctNoteId":row.DoctNoteId
    }
    this._NursingStationService.DoctorNotepoppulateForm(m_data);
  } 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }  
  onClose() { 
    // this._NursingStationService.myform.reset();
    this._matDialog.closeAll();
    //this.onClearPatientInfo();
    this._NursingStationService.myform.get('TemplateName').setValue('')
    this._NursingStationService.myform.get('Description').setValue('')
    this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
    this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
    this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
    this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
    this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
    this._NursingStationService.myform.get('HandOverType').setValue('Morning') 
    this.HandOverNoteList = [];
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
    this.vVisitDate = '';
    this.vAdmissionTime = '';
  }
  HandOverNoteList:any=[];
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
        VDate:formattedDate,
        MTime:formattedTime,
        ShiftInfo: this._NursingStationService.myform.get('HandOverType').value,
        PatHand_I: this._NursingStationService.myform.get('staffName').value,
        PatHand_S: this._NursingStationService.myform.get('Stable').value,
        PatHand_B: this._NursingStationService.myform.get('SYMPTOMS').value,
        PatHand_A: this._NursingStationService.myform.get('Assessment').value,
        PatHand_R: this._NursingStationService.myform.get('Instruction').value ,
        CreatedBy:this.accountService.currentUserValue.user.userName || ''
      }
    )
   // this.dsHandOverNoteList.data = this.HandOverNoteList   
   this.onSubmitHandOver();
   this.vStaffNursName = "HANDOVER GIVER DETAILS\n\nStaff Nurse Name : \nDesignation : "
   this.vSYMPTOMS = "Presenting SYMPTOMS\n\nVitals : \nAny Status Changes : "
   this.vInstruction = "BE CLEAR ABOUT THE REQUESTS:\n(If any special Instruction)"
   this.VStable = "THE PATIENT IS - Stable/Unstable\nBut i have a womes\nLEVEL OF WORRIES\nHigh/Medium/Low"
   this.VAssessment = "ON THE BASIC OF ABOVE\nAssessment give \nAny Need\nAny Risk"
   this._NursingStationService.myform.get('HandOverType').setValue('Morning')
  
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
    "Stable":row.PatHand_S,
    "Assessment":row.PatHand_A,
    "docHandId":row.DocHandId
  } 
  this._NursingStationService.DoctorNotepoppulateForm(m_data);
}
onSubmitHandOver() {   
  const currentDate = new Date();
  const datePipe = new DatePipe('en-US');
  const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
  const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');

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
if(!this._NursingStationService.myform.get("docHandId").value){  
  let saveTDoctorPatientHandoverParam 
  this.HandOverNoteList.forEach(element=>{
     saveTDoctorPatientHandoverParam={
      "admID": this.vAdmissionID,
      "tDate": element.VDate,
      "tTime": element.MTime,
      "shiftInfo": element.ShiftInfo,
      "patHand_I": element.PatHand_I,
      "patHand_S": element.PatHand_S,
      "patHand_B": element.PatHand_B,
      "patHand_A": element.PatHand_A,
      "patHand_R": element.PatHand_R,
      "createdBy": this.accountService.currentUserValue.user.id,
      "docHandId": 0
    }
  })   
  let submitData = {  
    "saveTDoctorPatientHandoverParam": saveTDoctorPatientHandoverParam
  };
  console.log(submitData); 
  this._NursingStationService.HandOverInsert(submitData).subscribe(response => { 
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.getHandOverNotelist()
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
else{ 
  let updateTDoctorPatientHandoverParam 
  this.HandOverNoteList.forEach(element=>{
    updateTDoctorPatientHandoverParam={
      "docHandId": this._NursingStationService.myform.get("docHandId").value,
      "admID":  this.vAdmissionID,
      "tDate": element.VDate,
      "tTime": element.MTime,
      "shiftInfo": element.ShiftInfo,
      "patHand_I": element.PatHand_I,
      "patHand_S": element.PatHand_S,
      "patHand_B": element.PatHand_B,
      "patHand_A": element.PatHand_A,
      "patHand_R": element.PatHand_R,
      "modifiedBy":this.accountService.currentUserValue.user.id, 
    }
  }) 
let submitData = {  
  "updateTDoctorPatientHandoverParam": updateTDoctorPatientHandoverParam
};
console.log(submitData); 
this._NursingStationService.HandOverUpdate(submitData).subscribe(response => { 
  if (response) {
    this.toastr.success('Record Updated Successfully.', 'Updated !', {
      toastClass: 'tostr-tost custom-toast-success',
    }); 
    this.getHandOverNotelist()
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
this._NursingStationService.myform.get('HandOverType').setValue('Morning')
this.dsHandOverNoteList.data = [];
}
getHandOverNotelist() {
  var vdata = {
    'AdmId':this.vAdmissionID 
  }
  this._NursingStationService.getHandOverNotelist(vdata).subscribe(data => {
    this.dsHandOverNoteList.data = data as DocNote[];
    this.HandOverNoteList = data as DocNote[];
    this.dsHandOverNoteList.sort = this.sort
    this.dsHandOverNoteList.paginator = this.paginator
    console.log(this.dsHandOverNoteList.data); 
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
}
export class DocNote {

  AdmID: number;
  TDate: Date;
  TTime: Date;
  DoctorsNotes: any;
  IsAddedBy: any;
  DoctNoteId: any;
  VDate:any;
  MTime: Date;
  ShiftInfo: any;
  PatHand_I: any;
  PatHand_S: any;
  PatHand_B:any;
  PatHand_A:any;
  PatHand_R:any;  
 
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




