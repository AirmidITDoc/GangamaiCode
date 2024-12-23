import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UnitmasterService } from '../unitmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit {
  
    unitForm: FormGroup;
    isActive:boolean=true;

    constructor(
        public _UnitmasterService: UnitmasterService,
        public dialogRef: MatDialogRef<NewUnitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.unitForm = this._UnitmasterService.createUnitmasterForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.unitForm.patchValue(this.data);
        }
    }

    saveflag : boolean = false;
    onSubmit() {
    this.saveflag = true;
    
    if (this.unitForm.valid) {
    debugger
        this._UnitmasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
      }
    }

    onClear(val: boolean) {
        this.unitForm.reset();
        this.dialogRef.close(val);
    }
}
