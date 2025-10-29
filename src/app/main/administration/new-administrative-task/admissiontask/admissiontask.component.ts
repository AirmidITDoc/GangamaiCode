import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AdministrationService } from '../../administration.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-admissiontask',
  templateUrl: './admissiontask.component.html',
  styleUrls: ['./admissiontask.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AdmissiontaskComponent {
  AdmissionTaskForm: FormGroup
  date: any;
  dateTimeString: any;
  isTimeChanged: boolean = false;
  AdmissionId = 0
    dateLabel: string = 'Admission Date';
    timeLabel: string = 'Admission Time';
  vIPDNo: any;
  isDatePckrDisabled: boolean = false;

  constructor(
    public _AdministrationService: AdministrationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService, private _formbuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService ,  @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.AdmissionTaskForm.get('AdmissionTime').setValue(this.now);
        if (this.AdmissionTaskForm.get('AdmissionTime'))
          this.AdmissionTaskForm.get('AdmissionTime').setValue(this.now);
      }
    }, 1);
  }

  ngOnInit(): void {

   
    this.AdmissionTaskForm = this.CreateDischargeForm()
    this.AdmissionTaskForm.get('RegID').setValue('');
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);

     if(this.data){
      console.log(this.date)
      // this.vIPDNo=this.vIPDNo
      
    }

  }


  CreateDischargeForm() {
    return this._formbuilder.group({
      RegID: '',
      Op_ip_id: '1',
      // IsDischargedit: 0, 
      // IsIPDnoEdit: 0,
      AdmissionDate: [(new Date()).toISOString(), Validators.required],
      AdmissionTime: [''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      NewIpdNo: ['', Validators.required]
    });
  }


  DischargeCancel() {
    // if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
    //   this.toastr.warning('Please select patient', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-Warning',
    //   });
    //   return
    // }

    Swal.fire({
      title: 'Do you want to cancel the Discharge ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {

        let SubmitDate = {
          "admissionID": this.AdmissionId
        }
        console.log(SubmitDate)
        this._AdministrationService.SaveDischargeCancel(SubmitDate).subscribe(response => {
          // this.resetform();
        });
      }
    })
  }
  AdmisssionCancel() {
    // if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
    //   this.toastr.warning('Please select patient', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-Warning',
    //   });
    //   return
    // }

    Swal.fire({
      title: 'Do you want to Admission Cancel ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        var data = {
          'admissionID': this.AdmissionId,
          // 'admissionDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
          // 'admissionTime':formattedDate+this.dateTimeObj.time
        }
        console.log(data);
        this._AdministrationService.AdmissionCancel(data).subscribe(response => {
          // this.resetform()

        });

      }
    });
  }


  public now: Date = new Date();
  OnAdmDateTimeUpdate() {
    // if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
    //   this.toastr.success('Please select patient', 'Save !', {
    //     toastClass: 'tostr-tost custom-toast-success',
    //   });
    //   return
    // }
    Swal.fire({
      title: 'Do you want to Update Admission Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {

        const formattedDate = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.AdmissionTaskForm.get('AdmissionDate').setValue(formattedDate);
        // this.AdmissionTaskForm.get('AdmissionTime').setValue(formattedDate + ' ' + formattedTime);
        let Admissiontime = formattedDate + ' ' + formattedTime



        debugger
        if (!this.AdmissionTaskForm.invalid) {
          var data = {
            'admissionID': this.AdmissionId,
            'admissionDate': formattedDate,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd"),
            'admissionTime': Admissiontime,// this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionTime').value, 'yyyy-MM-dd HH:mm'),
            'ipdno': this.AdmissionTaskForm.get('NewIpdNo').value
          }
          console.log(data);
          this._AdministrationService.getDateTimeChange(data).subscribe(response => {
            // this.resetform()

          });
        } else {
          let invalidFields = [];

          if (this.AdmissionTaskForm.invalid) {
            for (const controlName in this.AdmissionTaskForm.controls) {
              if (this.AdmissionTaskForm.controls[controlName].invalid) {
                invalidFields.push(`MlcInfo Form: ${controlName}`);
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
    });
  }

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
  onChangeTime(event) {
    if (event) {
      let selectedDate = new Date(this.AdmissionTaskForm.get('AdmissionDate').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AdmissionTaskForm.get('AdmissionTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    // this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
 @Input() isDisableFuture: boolean = false;
    myFilter = (d: Date | null): boolean => {
    return this.isDisableFuture ? d <= new Date() : true;
  };

onClose(){
  this._matDialog.closeAll()
}
}
