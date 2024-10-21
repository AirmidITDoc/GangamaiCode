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

  onSubmit(){
    if (this._GenderMasterService.myform.valid) {
        console.log('Form Submitted:', this._GenderMasterService.myform.value);
      } else {
        console.log('Form is invalid.');
      }
  }

  close(){
this.dialogRef.close()
  }

  onClear(){}
}
