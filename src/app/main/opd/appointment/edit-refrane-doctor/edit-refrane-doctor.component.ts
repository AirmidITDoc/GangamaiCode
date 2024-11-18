import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { AdvanceDetailObj, RegInsert } from '../appointment.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-refrane-doctor',
  templateUrl: './edit-refrane-doctor.component.html',
  styleUrls: ['./edit-refrane-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditRefraneDoctorComponent implements OnInit {

  dateTimeObj: any;
  
  VisitId:any;
  Doctor1List: any = [];
  DoctorList :any =[];
  RefDocName:any="S.R Patil";
  PatientHeaderObj = new SearchInforObj({});
  RefDoctorId:any;
  screenFromString = 'admission-form';
  searchFormGroup: FormGroup;
  AdmittedDoc1: any;
  PatientName: any;
  VisitDate:any;
  RegID:any=0;
  filteredOptionsRefrenceDoc: any;
  RefDoctorList: any = [];
  isRefDoctorSelected: boolean = false;
  constructor(
  
    public _OpAppointmentService: AppointmentSreviceService,
    private formBuilder: FormBuilder,
    private dialogRef :MatDialogRef<EditRefraneDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    private router: Router,
    
    ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    if (this.data) {

      this.PatientHeaderObj = this.data.registerObj;
      console.log(this.PatientHeaderObj )
      this.VisitId = this.PatientHeaderObj.VisitId;
      // this.PatientName = this.PatientHeaderObj.PatientName;
      // this.RefDoctorId = this.PatientHeaderObj.RefDoctorId;
      // this.VisitDate=this.PatientHeaderObj.VistDateTime;
      this.RegID = this.PatientHeaderObj.RegId;

    
    }

    // this.getDoctor1List();
    this.getRefDoctorList();
   
    this.filteredOptionsRefrenceDoc = this.searchFormGroup.get('refDoctorId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterrefDoctorId(value)),

    );
  }

  createSearchForm() {
    return this.formBuilder.group({
      refDoctorId: ['', [
        Validators.required]],
     
    });
  }
  setDropdownObjs() {
               
        this.searchFormGroup.updateValueAndValidity();
      }


  // getDoctor1List() {
  //   this._OpAppointmentService.getDoctorMaster1Combo().subscribe(data => {
  //     this.Doctor1List = data;
  //     this.filteredDoctorone.next(this.Doctor1List.slice());
  //   })
  // }
  
  
  private _filterrefDoctorId(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.RefDoctorList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }

  getRefDoctorList() {
    this._OpAppointmentService.getRefDoctorMasterCombo().subscribe(data => {
      this.RefDoctorList = data;
      if (this.PatientHeaderObj) {
        const ddValue = this.RefDoctorList.filter(c => c.DoctorId == this.PatientHeaderObj.RefDocId);
        this.searchFormGroup.get('refDoctorId').setValue(ddValue[0]);
        this.searchFormGroup.updateValueAndValidity();
        return;
      }
    });
  }

  getOptionTextRefDoc(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    debugger
    if (this.searchFormGroup.get('refDoctorId').value) {
      if (!this.RefDoctorList.some(item => item.DoctorName === this.searchFormGroup.get('refDoctorId').value.DoctorName)) {
        this.toastr.warning('Please Select valid RefDoctorName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    this.RefDoctorId = this.searchFormGroup.get('refDoctorId').value.DoctorId;
   
   let query = '';
   if (this.data.FormName == "Appointment") {
      query = "Update VisitDetails set RefDocId= " + this.RefDoctorId + " where Visitid=" + this.VisitId + " ";
   }
 
    console.log(query);
    this._OpAppointmentService.UpdateQueryByStatement(query).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Refrance Doctor Data Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Refrance Doctor Data  not Updated', 'error');
      }
      // this.isLoading = '';

    });

  }
  onCancleRefDoc (){
    this.RefDoctorId =0;
   let query = '';
   if (this.data.FormName == "Appointment") {
      query = "Update VisitDetails set RefDocId= " + this.RefDoctorId + " where Visitid=" + this.VisitId + " ";
   }
 
    console.log(query);
    this._OpAppointmentService.UpdateQueryByStatement(query).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Refrance Doctor Data  Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Refrance Doctor Data  not Updated', 'error');
      }
      // this.isLoading = '';

    });

  }
  
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

