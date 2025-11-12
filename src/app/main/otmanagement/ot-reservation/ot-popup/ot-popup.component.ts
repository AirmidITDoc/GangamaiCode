import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtReservationService } from '../ot-reservation.service';

@Component({
  selector: 'app-ot-popup',
  templateUrl: './ot-popup.component.html',
  styleUrls: ['./ot-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OtPopupComponent {
 reservationDateForm: FormGroup;
  registeredObj: any;
  vPatientName: any;
  vHeadingName: any = ''
  screenFromString = 'Common-form';

  constructor(
    public _OtReservationService: OtReservationService,
    private formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OtPopupComponent>,
    public datePipe: DatePipe,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.reservationDateForm=this._OtReservationService.CreateForm()
    if (this.data) {
      this.registeredObj = this.data;
      this.vPatientName = this.registeredObj.patientName + "-" + this.registeredObj.regNo
      console.log(this.registeredObj)
    }
  }

  onSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedDateTime = formattedTime + ' ' + formattedDate

    Swal.fire({
      title: 'Do you want to Change the Reservation Date?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      debugger
      if (flag.isConfirmed) {

        let bookingcancle = {};
        bookingcancle['otBookingID'] = 0;
        bookingcancle['oldOTBookingID'] = this.registeredObj?.OTBookingID;
        bookingcancle['oP_IP_ID'] = this.registeredObj?.OP_IP_ID;
        bookingcancle['opDate'] = this.dateTimeObj.date
        bookingcancle['opTime'] = this.dateTimeObj.time
        bookingcancle['createdBy'] = this._loggedService.currentUserValue.user.id;
        bookingcancle['reason'] = this.reservationDateForm.get('Reason').value || ''
        let submitData = {
          "saveOTBookingParamPostPone": bookingcancle,
        };
        console.log(submitData);

        this._OtReservationService.getBookingDatePostpone(submitData).subscribe(
          (response) => {
            if (response) {
              this.onClose();
            }
          }
        );
      }
    });
  }

  onClose() {
    this.reservationDateForm.reset();
    this.dialogRef.close();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
}
