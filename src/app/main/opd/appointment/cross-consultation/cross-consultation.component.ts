import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
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
  screenFromString = 'admission-form';
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
    private formBuilder: UntypedFormBuilder,
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
      this.registerObj1 = this.data;
      console.log(this.registerObj1);
      this.VisitId = this.selectedAdvanceObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.vOPIPNo=this.PatientHeaderObj.RegId;
      this.vOPIPNo=this.selectedAdvanceObj.OPDNo;
      this.VisitDate=this.PatientHeaderObj.VistDateTime;
      this.selectedAdvanceObj.AgeDay= this.selectedAdvanceObj.AgeDay.trim();
      this.selectedAdvanceObj.AgeMonth= this.selectedAdvanceObj.AgeMonth.trim();
      this.selectedAdvanceObj.AgeYear= this.selectedAdvanceObj.AgeYear.trim();
      this.getDepartmentList();
      this.getDoctorList();
    }
  }

  ngOnInit(): void {

    this.InfoFormGroup = this.createCrossConForm();
    this.setDropdownObjs();

   
    this.filteredOptionsDep = this.InfoFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.InfoFormGroup.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

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

  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this.InfoFormGroup.get('Departmentid').setValue(toSelect);

    const toSelect1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DoctorId);
    this.InfoFormGroup.get('DoctorID').setValue(toSelect1);
    
    this.InfoFormGroup.updateValueAndValidity();
  }
 
  

  registerObj1 = new AdmissionPersonlModel({});
  
  getDepartmentList() {
    debugger
    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.registerObj1) {
        const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.registerObj1.DepartmentId);
        this.InfoFormGroup.get('Departmentid').setValue(ddValue[0]);
        //  this.OnChangeDoctorList(this.registerObj1);
        this.InfoFormGroup.updateValueAndValidity();
        return;
      }
    });

  }

  getDoctorList() {
    debugger

    this._AdmissionService.getDoctorMasterNew().subscribe(data => {
      this.DoctorList = data;
      if (this.data) {
        const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.DoctorId);
        this.InfoFormGroup.get('DoctorID').setValue(ddValue[0]);
        this.InfoFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  private _filteradmittedDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
 

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  OnChangeDoctorList(departmentObj) {
    debugger
  //   if(flag)
  //   departmentObj.DepartmentId=departmentObj.DepartmentId
  // else
  // departmentObj.DepartmentId=departmentObj.Departmentid

    this.InfoFormGroup.get('DoctorID').reset();
    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
      data => {
        this.DoctorList = data;
        // this.InfoFormGroup.get('DoctorId').setValue(this.DoctorList[0]);      
        return;
      });
      this.filteredOptionsDoc = this.InfoFormGroup.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => this._filteradmittedDoctor1(value)),
  
      );
  
  }

  
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
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
      if(!this.DepartmentList.some(item => item.DepartmentName ===this.InfoFormGroup.get('Departmentid').value.DepartmentName)){
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
    crossConsult['AddedBy'] = this.accountService.currentUserValue.userId;
    crossConsult['updatedBy'] = 0,
    crossConsult['IsCancelled'] = 0;
    crossConsult['IsCancelledBy'] = 0;
    crossConsult['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',

    crossConsult['ClassId'] = this.PatientHeaderObj.ClassId;
    crossConsult['DepartmentId'] = this.InfoFormGroup.get('Departmentid').value.DepartmentId; 
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
