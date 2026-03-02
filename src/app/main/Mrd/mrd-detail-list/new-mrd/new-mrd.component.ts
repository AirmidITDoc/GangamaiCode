import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MrdService } from '../../mrd.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MrdDetailsService } from '../mrd-details.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from 'app/main/opd/registration/registration.component';



@Component({
  selector: 'app-new-mrd',
  templateUrl: './new-mrd.component.html',
  styleUrls: ['./new-mrd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewMrdComponent {
  
NewMrdForm:FormGroup
searchFormGroup:FormGroup
dateTimeString: any;
rmdrecordId=0
 RegId1 = "0";
    registerObj = new RegInsert({});
    PatientName:any
    OPIPID=0
    
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  isTimeChanged: boolean = false;
  minDate: Date;
  timeflag = 0;
   screenFromString = 'Common-form';
  date: string;
 autocompleteModeunit: string = "Hospital";
  
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdDetailsService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,   public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewMrdComponent>,
    public datePipe: DatePipe) {
     
    let mydate = new Date()
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));
   
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
       this.NewMrdForm = this.createMrdForm();
         this.searchFormGroup = this.createSearchForm();
       if(this.data){
        console.log(this.data)
        this.rmdrecordId=this.data.rmdrecordId
        this.NewMrdForm.patchValue(this.data)
       }
    
       

     }

         createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    }

  createMrdForm() {

        return this.formBuilder.group({
      rmdrecordId: this.rmdrecordId,
      recievedDate: [(new Date()).toISOString()],
      recievedTime: [(new Date()).toISOString()],
      unitId: [this.accountService.currentUserValue.user.unitId],
      opipid: ['', Validators.required],
      mrdno: ['', Validators.required],
      location: [''],
      isInOut: [false, Validators.required],
      outFileId: '1',
    
    });
  }

  
    getSelectedObj(obj) {
        console.log(obj)
        this.RegId1 = obj.regID;
        this.registerObj = obj;
        this.OPIPID=   this.registerObj.admissionID

        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
        // setTimeout(() => {
        //     this._IPSettlementService.getRegistraionById(this.RegId1).subscribe((response) => {
        //         this.registerObj = response;
        //         this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName

        //     });  
        // }, 500);                   "
        // this.GetDetails(this.RegId1)
    } 

  onSubmit() {
    debugger

  //   let selectedDate = this.datePipe.transform(this.NewMrdForm.get('recievedDate')?.value, 'yyyy-MM-dd');
  //   let timeValue = this.NewMrdForm.get('recievedTime')?.value;
  //   let time = new Date(timeValue);
  //  let hours = time.getHours();
  //   let minutes = time.getMinutes();

  //   let combinedDateTime = new Date(
  //     selectedDate + 'T' + this.pad(hours) + ':' + this.pad(minutes) + ':00'
  //   );

    this.NewMrdForm.get('recievedDate').setValue(this.datePipe.transform(this.NewMrdForm.get('recievedDate').value, 'yyyy-MM-dd'))
    this.NewMrdForm.get('recievedTime').setValue(this.datePipe.transform(this.NewMrdForm.get('recievedDate').value, "MM-dd-yyyy hh:mm"))

    this.NewMrdForm.get('rmdrecordId').setValue(this.rmdrecordId)
    if (!this.NewMrdForm.invalid) {
      console.log(this.NewMrdForm.value)
      this._MrdService.MrdInsert(this.NewMrdForm.value).subscribe((response) => {
      
        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.NewMrdForm.invalid) {
        for (const controlName in this.NewMrdForm.controls) {
          if (this.NewMrdForm.controls[controlName].invalid) {
            invalidFields.push(`MRD Info Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }


    pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      opipid: [
        { name: "required", Message: "opipid is required" }
      ],
      mrdno: [
        { name: "required", Message: "mrdno is required" }
      ],
      location: [
        { name: "required", Message: "location is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ],
      UnitId: [
        { name: "required", Message: "policeStation is required" }
      ],
    };
  }
   


  public now: Date = new Date();
  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US").split(',');
      let splitTime = this.NewMrdForm.get('recievedDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.NewMrdForm.get('recievedTime').value);
      let splitDate = selectedDate.toLocaleString("en-US").split(',');
      let splitTime = this.NewMrdForm.get('recievedTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      // this.phdatetime = splitTime[1]
      // console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
   }
}


