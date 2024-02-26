import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Admission } from 'app/main/ipd/Admission/admission/admission.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss']
})
export class CrossConsultationComponent implements OnInit {

 
  InfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: Admission;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  DepartmentList: any = [];
  DoctorList: any = [];
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

  filteredOptionsDep: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;


  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  PatientHeaderObj: AdvanceDetailObj;
  VisitId:any;
  PatientName:any;
  vUnitId:any;
  vPatienttypeId:any;


  date: Date;

  
  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _opappointmentService: AppointmentSreviceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<CrossConsultationComponent>,
    private router: Router
  ) {
    //  this.date = new Date().toISOString().slice(0, 16);
     this.date = new Date();
     
   }

  ngOnInit(): void {

    this.InfoFormGroup = this.createCrossConForm();
   
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }

    this.getDepartmentList();
    if (this.data) {
      this.PatientHeaderObj = this.data;
      this.VisitId = this.PatientHeaderObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
    
      console.log(this.PatientHeaderObj);
      }
     

  }

  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: '',
      DoctorID: '',
      VisitDate: '',
      VisitTime: '',
      AuthorityName: '',
      ABuckleNo: '',
      PoliceStation: '',

    });
  }


  getDepartmentList() {
    
    this._opappointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.InfoFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      // if (this.configService.configParams.DepartmentId) {
      //   debugger
      //   const ddValue = this.DepartmentList.filter(c => c.Departmentid == this.configService.configParams.DepartmentId);
      //   this.VisitFormGroup.get('Departmentid').setValue(ddValue[0]);
      //   this.OnChangeDoctorList(ddValue[0]);
      //   this.VisitFormGroup.updateValueAndValidity();
      //   return;
      // }
    });

  }

  private _filterDep(value: any): string[] {
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
  OnChangeDoctorList(departmentObj) {
    debugger
    this.isDepartmentSelected = true;
    this._opappointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.InfoFormGroup.get('DoctorID').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
  }


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
      // if(this.deptdoc) this.deptdoc.focus();
      this.deptdoc.nativeElement.focus();
    }
  }
  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      // if(this.refdoc) this.refdoc.focus();
      // this.refdoc.nativeElement.focus();
    }
  }



 onSubmit() {

  this.submitted = true;
  this.isLoading = 'submit';
  let submissionObj = {};
  let crossConsult = {};

  crossConsult['VisitId'] = 0;
      crossConsult['RegID'] = this.PatientHeaderObj.RegId;
      crossConsult['VisitDate'] = this.datePipe.transform(this.InfoFormGroup.get("VisitDate").value, 'MM/dd/yyyy') || this.dateTimeObj.date
      crossConsult['VisitTime'] = this.datePipe.transform(this.InfoFormGroup.get("VisitDate").value, 'MM/dd/yyyy HH:mm:ss') || this.dateTimeObj.time,
      crossConsult['UnitId'] = this.PatientHeaderObj.HospitalId;
      crossConsult['PatientTypeId'] = this.PatientHeaderObj.PatientTypeId;
      crossConsult['ConsultantDocId'] = this.InfoFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      crossConsult['RefDocId'] = this.PatientHeaderObj.RefDoctorId || 0;

      crossConsult['TariffId'] = this.PatientHeaderObj.TariffId;
      crossConsult['CompanyId'] = this.PatientHeaderObj.CompanyId || 0;
      crossConsult['AddedBy'] = this.accountService.currentUserValue.user.id;
      crossConsult['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
      crossConsult['IsCancelled'] = 0;
      crossConsult['IsCancelledBy'] = 0;
      crossConsult['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',

      crossConsult['ClassId'] = this.PatientHeaderObj.ClassId;
      crossConsult['DepartmentId'] = this.InfoFormGroup.get('Departmentid').value.Departmentid; //? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      crossConsult['PatientOldNew'] = 1,//this.Patientnewold;
      crossConsult['FirstFollowupVisit'] = 0, // this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
      crossConsult['appPurposeId'] = 0,//this.PatientHeaderObj.App
      crossConsult['FollowupDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900', // this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
      crossConsult['PhoneAppId'] = 0,//this.PatientHeaderObj.App
      
      crossConsult['CrossConsulFlag'] = 1



      submissionObj['crossConsultationSave'] = crossConsult;

      console.log(submissionObj);
      this._opappointmentService.CrossConsultationInsert(submissionObj).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Cross Consultation Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
              // this.getPrint(response);
              this._matDialog.closeAll();
            }
            // this.getVisitList();
          });
        } else {
          Swal.fire('Error !', 'Cross Consultation not Updated', 'error');
        }
        this.isLoading = '';
      });
}


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}
