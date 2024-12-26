import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentSreviceService } from '../../appointment-srevice.service';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { MatTableDataSource } from '@angular/material/table';
import { RegInsert } from '../../appointment.component';

@Component({
  selector: 'app-previous-department-list',
  templateUrl: './previous-department-list.component.html',
  styleUrls: ['./previous-department-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PreviousDepartmentListComponent implements OnInit {
  displayedColumns: string[] = [
    'VisitDate',
    'DepartmentName',
    'DoctorName'
  ]

  registerObj: any;

  dsLastDepartmentname = new MatTableDataSource<RegInsert>();

  constructor(
    public _AppointmentSreviceService: AppointmentSreviceService,
    public _opappointmentService: AppointmentSreviceService,
    private dialogRef: MatDialogRef<PreviousDepartmentListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    public _registerService: RegistrationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
      this.getLastVisitDoctorList(this.registerObj)
    }
  }

  getLastVisitDoctorList(Obj) {
    var vdata = {
      'RegId': Obj.RegId || 0
    }
    this._AppointmentSreviceService.getLastVisitDoctorList(vdata).subscribe(data => {
      this.dsLastDepartmentname.data = data as RegInsert[]
    })
  }
  getDoctor(contact){
    console.log(contact)
  this.dialogRef.close(contact)
  }
  onClose() {
    this.dialogRef.close();
  }
}
