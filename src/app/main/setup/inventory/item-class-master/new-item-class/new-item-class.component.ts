import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemClassMasterService } from '../item-class-master.service';

@Component({
  selector: 'app-new-item-class',
  templateUrl: './new-item-class.component.html',
  styleUrls: ['./new-item-class.component.scss']
})
export class NewItemClassComponent implements OnInit {

  classForm: FormGroup;
  isActive:boolean=true;

  constructor(
      public _ItemClassMasterService: ItemClassMasterService,
      public dialogRef: MatDialogRef<NewItemClassComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.classForm = this._ItemClassMasterService.createItemclassForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.classForm.patchValue(this.data);
     }
  }

  Saveflag: boolean= false;
  onSubmit() {
    this.Saveflag=true
   
      if (this.classForm.valid) {
          this._ItemClassMasterService.itemclassMasterSave(this.classForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.classForm.reset();
      this.dialogRef.close(val);
  }
}
