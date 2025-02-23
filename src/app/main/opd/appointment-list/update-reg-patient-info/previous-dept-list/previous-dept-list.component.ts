import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../../appointmentlist.service';

@Component({
  selector: 'app-previous-dept-list',
  templateUrl: './previous-dept-list.component.html',
  styleUrls: ['./previous-dept-list.component.scss']
})
export class PreviousDeptListComponent {
  displayedColumns: string[] = [
    'VisitDate',
    'DepartmentName',
    'DoctorName'
  ]

  registerObj: any;

  dsLastDepartmentname = new MatTableDataSource<RegInsert>();

  constructor(
   
    public _opappointmentService: AppointmentlistService,
    private dialogRef: MatDialogRef<PreviousDeptListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this._opappointmentService.getLastVisitDoctorList(vdata).subscribe(data => {
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
