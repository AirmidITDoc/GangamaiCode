import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-edit-refrane-doctor',
  templateUrl: './edit-refrane-doctor.component.html',
  styleUrls: ['./edit-refrane-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditRefraneDoctorComponent implements OnInit {

  dateTimeObj: any;
  // registerObj = new AdmissionPersonlModel({});
  VisitId:any;
  Doctor1List: any = [];
  DoctorList :any =[];
  PatientHeaderObj: AdvanceDetailObj;
  RefDoctorId:any;
  screenFromString = 'admission-form';
  searchFormGroup: FormGroup;
  AdmittedDoc1: any;
  PatientName: any;
  
  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  
  constructor(
    //  public _AdmissionService: AdmissionService,
    public _OpAppointmentService: AppointmentSreviceService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    // public dialogRef: MatDialogRef<ListComponent>,
    private router: Router,
    // private advanceDataStored: AdvanceDataStored
    ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    if (this.data) {

      this.PatientHeaderObj = this.data.registerObj;
      this.VisitId = this.PatientHeaderObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.RefDoctorId = this.PatientHeaderObj.RefDoctorId;
     
      console.log(this.PatientHeaderObj);
    }

    this.getDoctor1List();

    this.doctoroneFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDoctorone();
    });
  }

  createSearchForm() {
    return this.formBuilder.group({
      DoctorId:'',
     
    });
  }
  setDropdownObjs() {
    debugger;
      
        // const toSelectDoc1 = this.Doctor1List.find(c => c.DoctorID == this.registerObj.DoctorId);
        // this.searchFormGroup.get('DoctorID').setValue(toSelectDoc1);
               
        this.searchFormGroup.updateValueAndValidity();
      }


   // doctorone filter code  
   private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  getDoctor1List() {
    this._OpAppointmentService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }
  
  onClose() {
    // this.dialogRef.close();
  }

  onSubmit() {
    debugger;
    this.RefDoctorId = this.searchFormGroup.get('DoctorId').value.DoctorId;
    
   let query = "Update VisitDetails set RefDocId= " + this.RefDoctorId +" where VisitId=" + this.VisitId + " ";
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

  
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

