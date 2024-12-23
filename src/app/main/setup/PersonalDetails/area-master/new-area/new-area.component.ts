import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaMasterService } from '../area-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrls: ['./new-area.component.scss']
})
export class NewAreaComponent implements OnInit {

  areaForm: FormGroup;
  isActive:boolean=true
  constructor(
      public _AreaMasterService: AreaMasterService,
      public dialogRef: MatDialogRef<NewAreaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  autocompleteModecity: string = "City";

  cityId = 0;

  ngOnInit(): void {
      this.areaForm = this._AreaMasterService.createAreaForm();
      if(this.data){
     this.isActive=this.data.isActive
      this.areaForm.patchValue(this.data);}
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
   
      if (this.areaForm.valid) {
          this._AreaMasterService.AreaMasterSave(this.areaForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }
  
  getValidationCityMessages() {
    return {
        cityId: [
            { name: "required", Message: "City Name is required" }
        ]
    };
}
  onClear(val: boolean) {
      this.areaForm.reset();
      this.dialogRef.close(val);
  }

  selectChangecity(obj: any){
    console.log(obj);
    this.cityId=obj
  }
}
