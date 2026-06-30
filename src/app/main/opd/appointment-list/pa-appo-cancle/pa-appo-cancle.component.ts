import { AppointmentlistService } from '../appointmentlist.service';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { Visitdata } from 'app/main/dashboard/new-finacialdashboard/new-finacialdashboard.component';
import { VisitMaster1 } from '../appointment-list.component';
@Component({
  selector: 'app-pa-appo-cancle',
  templateUrl: './pa-appo-cancle.component.html',
  styleUrls: ['./pa-appo-cancle.component.scss']
})
export class PaAppoCancleComponent {
  VisitId: any
  CancleTaskForm: FormGroup
  Personaldata = new VisitMaster1({});
  Reason: any
  dataSourceAdmission = new MatTableDataSource<VisitMaster1>();


  constructor(public _AppointmentlistService: AppointmentlistService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<PaAppoCancleComponent>,

  ) { }


  ngOnInit(): void {
    console.log(this.data);
    this.CancleTaskForm = this.CreateCancleeForm()

    if (this.data) {
      this.Personaldata = this.data;
      this.VisitId = this.Personaldata.visitId;
      // this.GetAdmissionCancleStausData()
    }
  }

  CreateCancleeForm() {
    return this.formBuilder.group({
      VisitDate: [(new Date()).toISOString(), Validators.required],
      Reason: ['']
    });
  }

  Response: any
  // GetAdmissionCancleStausData() {

  //     const SelectQuery =
  //     {
  //         "searchFields": [
  //             {
  //                 "fieldName": "VisitId",
  //                 "fieldValue": String(this.VisitId),
  //                 "opType": "Equals"
  //             }
  //         ],
  //         "mode": "AdmissionCancleStaus"
  //     }

  //     console.log(SelectQuery);
  //     this._AppointmentlistService.getAdmissionDetailList(SelectQuery).subscribe(data => {
  //         console.log(data)
  //         this.Response = data[0].CancelStatus

  //         console.log(this.Response)
  //         Swal.fire(this.Response)

  //     });
  // }
  AdmissionMsg = ''
  AppointmentCancle() {
    Swal.fire({
      title: 'Do you want to Cancle Appointment',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'OK',

    }).then((flag) => {

      if (flag.isConfirmed) {
        const submitData = {
          "visitId": this.VisitId
        };
        console.log(submitData);
        this._AppointmentlistService.Appointmentcancle(submitData).subscribe(response => {
          this.toastr.success(response.message);
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    });

  }
  onClose() {
    this._matDialog.closeAll()
  }
}
