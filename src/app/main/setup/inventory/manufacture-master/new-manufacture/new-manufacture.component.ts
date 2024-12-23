import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ManufactureMasterService } from '../manufacture-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-manufacture',
  templateUrl: './new-manufacture.component.html',
  styleUrls: ['./new-manufacture.component.scss']
})
export class NewManufactureComponent implements OnInit {

  manufForm: FormGroup;
  isActive:boolean=true;

  constructor(
      public _ManufactureMasterService: ManufactureMasterService,
      public dialogRef: MatDialogRef<NewManufactureComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

    ngOnInit(): void {
      this.manufForm = this._ManufactureMasterService.createManufactureForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.manufForm.patchValue(this.data);
      }
    }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true
   
      if (this.manufForm.valid) {
          this._ManufactureMasterService.manufactureMasterSave(this.manufForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) 
  {
    this.manufForm.reset();
    this.dialogRef.close(val);
  }

}
