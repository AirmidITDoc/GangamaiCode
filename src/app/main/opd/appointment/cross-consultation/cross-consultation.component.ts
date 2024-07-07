import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Admission, AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { map, startWith } from 'rxjs/operators';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CrossConsultationComponent implements OnInit {


  InfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  DepartmentList: any = [];
  DoctorList: any = [];
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

  // filteredOptionsDep: Observable<string[]>;
  filteredOptionsDep: any;
  filteredOptionsDoc: any;
  // filteredOptionsDoc: Observable<string[]>;
  saveflag: boolean = true;

  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  PatientHeaderObj: AdvanceDetailObj;
  VisitId: any;
  PatientName: any;
  vUnitId: any;
  vPatienttypeId: any;
  vOPIPNo: any;
  VisitDate: any;
  date: Date;


  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _opappointmentService: AppointmentSreviceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<CrossConsultationComponent>,
    private router: Router
  ) {
    
    this.date = new Date();
    if (this.data) {
      this.selectedAdvanceObj = data;
      console.log(this.selectedAdvanceObj);
      this.PatientHeaderObj = this.data;

      this.VisitId = this.selectedAdvanceObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.vOPIPNo=this.PatientHeaderObj.RegId;
      this.VisitDate=this.PatientHeaderObj.VistDateTime;
      this.selectedAdvanceObj.AgeDay= this.selectedAdvanceObj.AgeDay.trim();
      this.selectedAdvanceObj.AgeMonth= this.selectedAdvanceObj.AgeMonth.trim();
      this.selectedAdvanceObj.AgeYear= this.selectedAdvanceObj.AgeYear.trim();
      this.getDepartmentList();
     
    }
  }

  ngOnInit(): void {

    this.InfoFormGroup = this.createCrossConForm();
  

    // if (this.advanceDataStored.storage) {
    //   this.selectedAdvanceObj = this.advanceDataStored.storage;
    //   this.PatientHeaderObj = this.data;
    //   console.log(this.selectedAdvanceObj);
    //   this.VisitId = this.selectedAdvanceObj.VisitId;
    //   this.PatientName = this.PatientHeaderObj.PatientName;
    //   this.vOPIPNo=this.PatientHeaderObj.RegId;
    //   this.VisitDate=this.PatientHeaderObj.VistDateTime;
    //   // this.RegId = this.selectedAdvanceObj.RegId;
    //   // this.RegNo = this.selectedAdvanceObj.RegNo;
    //   // this.AgeYear = this.selectedAdvanceObj.AgeYear;
    //   // this.vOPIPId = this.selectedAdvanceObj.VisitId;
    //   // this.PatientName = this.selectedAdvanceObj.PatientName;
    //   // this.Doctorname = this.selectedAdvanceObj.Doctorname;
    //   // this.CompanyId = this.selectedAdvanceObj.CompanyId;
    //   // this.CompanyName = this.selectedAdvanceObj.CompanyName;
    //   // this.Tarrifname = this.selectedAdvanceObj.TariffName;
    //   // this.vTariffId = this.selectedAdvanceObj.TariffId;
    //   // this.vClassId = this.selectedAdvanceObj.ClassId;
    //   // this.vClassName = this.selectedAdvanceObj.ClassName;
    //   // this.vMobileNo = this.selectedAdvanceObj.MobileNo;
    // }

    this.filteredOptionsDep = this.InfoFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );
  }

  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: ['', [
        Validators.required,
      ]],
      DoctorID:  ['', [
        Validators.required,
      ]],
      VisitDate: '',
      VisitTime: '',
      AuthorityName: '',
      ABuckleNo: '',
      PoliceStation: '',

    });
  }


  // getDepartmentList() {

  //   this._opappointmentService.getDepartmentCombo().subscribe(data => {
  //     this.DepartmentList = data;
  //     this.optionsDep = this.DepartmentList.slice();
  //     this.filteredOptionsDep = this.InfoFormGroup.get('Departmentid').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterdept(value) : this.DepartmentList.slice()),
  //     );
     
  //   });

  // }
  getDepartmentList() {
    debugger
    this._opappointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.selectedAdvanceObj) {
        const ddValue = this.DepartmentList.filter(c => c.Departmentid == this.selectedAdvanceObj.DepartmentId);
        this.InfoFormGroup.get('Departmentid').setValue(ddValue[0]);
        this.InfoFormGroup.updateValueAndValidity();
        return;
      }
    });
    this.OnChangeDoctorList(this.selectedAdvanceObj,true);
  }
  
  // getDepartmentList() {
  //   this._AdmissionService.getDepartmentCombo().subscribe(data => {
  //       this.DepartmentList = data;
  //       if (this.PatientHeaderObj) {
  //         const ddValue = this.DepartmentList.filter(c => c.Departmentid == this.PatientHeaderObj.DepartmentId);
  //         this.InfoFormGroup.get('Departmentid').setValue(ddValue[0]);
        
  //         this.InfoFormGroup.updateValueAndValidity();
  //         return;
  //       }
  //       });
  //       this.OnChangeDoctorList(this.PatientHeaderObj)
  // }

  

  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }
  }
  

  getOptionTextDep(option) {

    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextDoc(option) {

    return option && option.Doctorname ? option.Doctorname : '';

  }
  // OnChangeDoctorList(departmentObj) {
  //   debugger
  //   this.isDepartmentSelected = true;
  //   this._opappointmentService.getDoctorMasterCombo(departmentObj.DepartmentId
  //     ).subscribe(
  //     data => {
  //       this.DoctorList = data;
  //       console.log(this.DoctorList )
  //       this.optionsDoc = this.DoctorList.slice();
  //       this.filteredOptionsDoc = this.InfoFormGroup.get('DoctorID').valueChanges.pipe(
  //         startWith(''),
  //         map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
  //       );
  //     })

  //   }


    
  OnChangeDoctorList(departmentObj,flag) {
    debugger
    if(flag)
      departmentObj.DepartmentId= departmentObj.DepartmentId
    else
    departmentObj.DepartmentId=departmentObj.Departmentid

    if (departmentObj) {
      this._opappointmentService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(data => {
        this.DoctorList = data;
        console.log( this.DoctorList)
        // const ddValue = this.DoctorList.filter(c => c.DoctorID == this.selectedAdvanceObj.DoctorId);
        //  this.InfoFormGroup.get('DoctorID').setValue(ddValue[0]);
       
      });
    }
    if(this.selectedAdvanceObj){
      if(this.DoctorList.length > 0){
      const ddValue = this.DoctorList.filter(c => c.DoctorID == this.selectedAdvanceObj.DoctorId);
       this.InfoFormGroup.get('DoctorID').setValue(ddValue[0]);
       this.InfoFormGroup.updateValueAndValidity();      
    }
  }}


  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }

  onClose() {
    this.dialogRef.close();
  }
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;

  public onEnterdept(event): void {
    if (event.which === 13) {
      this.deptdoc.nativeElement.focus();
    }
  }
  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      
      this.saveflag = false;
    }
  }
  onChangeDoctor(option) {
    if (option)
      this.saveflag = false;
  }


  onSubmit() {
    if(!this.DoctorList.some(item => item.Doctorname ===this.InfoFormGroup.get('DoctorID').value.Doctorname)){
      this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.InfoFormGroup.get('Departmentid').value){
      if(!this.DepartmentList.some(item => item.departmentName ===this.InfoFormGroup.get('Departmentid').value.departmentName)){
        this.toastr.warning('Please Select valid DepartmentName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.submitted = true;
    this.isLoading = 'submit';
    let submissionObj = {};
    let crossConsult = {};

    crossConsult['VisitID'] = 0;
    crossConsult['RegId'] = this.PatientHeaderObj.RegId;
    crossConsult['VisitDate'] = this.datePipe.transform(this.InfoFormGroup.get("VisitDate").value, 'MM/dd/yyyy') || this.dateTimeObj.date
    crossConsult['VisitTime'] = this.datePipe.transform(this.InfoFormGroup.get("VisitDate").value, 'MM/dd/yyyy HH:mm:ss') || this.dateTimeObj.time,
    crossConsult['UnitId'] = this.PatientHeaderObj.HospitalId;
    crossConsult['PatientTypeId'] = this.PatientHeaderObj.PatientTypeId;
    crossConsult['ConsultantDocId'] = this.InfoFormGroup.get('DoctorID').value.DoctorId || 0;
    crossConsult['RefDocId'] = this.PatientHeaderObj.RefDoctorId || 0;

    crossConsult['TariffId'] = this.PatientHeaderObj.TariffId;
    crossConsult['CompanyId'] = this.PatientHeaderObj.CompanyId || 0;
    crossConsult['AddedBy'] = this.accountService.currentUserValue.user.id;
    crossConsult['updatedBy'] = 0,
    crossConsult['IsCancelled'] = 0;
    crossConsult['IsCancelledBy'] = 0;
    crossConsult['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',

    crossConsult['ClassId'] = this.PatientHeaderObj.ClassId;
    crossConsult['DepartmentId'] = this.InfoFormGroup.get('Departmentid').value.Departmentid; 
    crossConsult['PatientOldNew'] = 1,//this.Patientnewold;
    crossConsult['FirstFollowupVisit'] = 0,
    crossConsult['appPurposeId'] = 0,
    crossConsult['FollowupDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900', 
      // crossConsult['PhoneAppId'] = 0,//this.PatientHeaderObj.App

      crossConsult['CrossConsulFlag'] = 1

    submissionObj['crossConsultationSave'] = crossConsult;

    console.log(submissionObj);
    this._opappointmentService.CrossConsultationInsert(submissionObj).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Cross Consultation Saved Successfully  !', 'success').then((result) => {
          if (result.isConfirmed) {
            
            this._matDialog.closeAll();
          }
          // this.getVisitList();
        });
      } else {
        Swal.fire('Error !', 'Cross Consultation not Updated', 'error');
      }
      this.isLoading = '';
    });
    this.saveflag = true;
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}
