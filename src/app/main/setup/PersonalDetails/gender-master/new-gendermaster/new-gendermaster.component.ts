import { Component, OnInit } from '@angular/core';
import { GenderMasterService } from '../gender-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-gendermaster',
    templateUrl: './new-gendermaster.component.html',
    styleUrls: ['./new-gendermaster.component.scss']
})
export class NewGendermasterComponent implements OnInit {

    constructor(public _GenderMasterService: GenderMasterService,
        public dialogRef: MatDialogRef<NewGendermasterComponent>,
        public toastr: ToastrService, public _matDialog: MatDialog) { }

    ngOnInit(): void {
    }
    genderName = [{ name: "required", Message: "Gender Name is required" },
    { name: "maxlength", Message: "Gender name should not be greater than 50 char." },
    { name: "pattern", Message: "Special char not allowed." }
    ];
    onSubmit() {
        debugger
        if (this._GenderMasterService.myform.valid) {
            console.log('Form Submitted:', this._GenderMasterService.myform.value);
        } else {
            console.log('Form is invalid.');
        }
    }

    close() {
        this.dialogRef.close()
    }

    onClear() { }
}
