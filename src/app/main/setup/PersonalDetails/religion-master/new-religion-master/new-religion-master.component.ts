import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReligionMasterService } from '../religion-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-religion-master',
  templateUrl: './new-religion-master.component.html',
  styleUrls: ['./new-religion-master.component.scss'],
  
})
export class NewReligionMasterComponent implements OnInit {
  religionForm: FormGroup;
  constructor(   public _ReligionMasterService: ReligionMasterService,
    public dialogRef: MatDialogRef<NewReligionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.religionForm = this._ReligionMasterService.CreateReligionForm();
    var m_data = {
      religionId: this.data?.religionId,
      religionName: this.data?.religionName.trim(),
      isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.religionForm.patchValue(m_data);
  }

  saveflag : boolean = false ;
  onSubmit() {
    this.saveflag = true;
    
    if (this.religionForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
    if (this.religionForm.valid) {
        this._ReligionMasterService.religionMasterSave(this.religionForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
  }
}

onClear(val: boolean) {
    this.religionForm.reset();
    this.dialogRef.close(val);
}

}
