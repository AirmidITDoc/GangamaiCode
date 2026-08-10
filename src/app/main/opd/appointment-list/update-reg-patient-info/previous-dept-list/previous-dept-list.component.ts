import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../../appointmentlist.service';

@Component({
    selector: 'app-previous-dept-list',
    templateUrl: './previous-dept-list.component.html',
    styleUrls: ['./previous-dept-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PreviousDeptListComponent {
    displayedColumns: string[] = [
        'visitDate',
        'opdNo',
        'departmentName',
        'doctorName'
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
            if (this.data.Label == 'Lab') {
                this.getLabDocVisitList(this.registerObj);
            } else {
                this.getLastVisitDoctorList(this.registerObj)
            }
        }
    }

    getLastVisitDoctorList(Obj) {
        const vdata = {
            "first": 0,
            "rows": 20,
            "sortField": "RegId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "RegId",
                    "fieldValue": String(Obj.regId),//"140306",
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._opappointmentService.getLastVisitDoctorList(vdata).subscribe(data => {
            this.dsLastDepartmentname.data = data.data as RegInsert[]
        })
    }

    getLabDocVisitList(Obj) {
        const vdata = {
            "first": 0,
            "rows": 20,
            "sortField": "RegId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "RegId",
                    "fieldValue": String(Obj.labPatRegId),//"140306",
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._opappointmentService.getLabVisitDoctorList(vdata).subscribe(data => {
            // this.dsLastDepartmentname.data = data.data as RegInsert[]
            console.log(data)
            this.dsLastDepartmentname.data = (data.data as RegInsert[]).map(item => {
                if (item.regDate) {
                    return {
                        ...item,
                        visitDate: item.regDate
                    };
                }
                return item;
            });

        })
    }

    getDoctor(contact) {
        console.log(contact)
        this.dialogRef.close(contact)
    }
    onClose() {
        this.dialogRef.close();
    }
}
