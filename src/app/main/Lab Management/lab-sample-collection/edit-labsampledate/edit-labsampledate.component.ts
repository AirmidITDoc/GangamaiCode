import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { LabSampleCollectionService } from '../lab-sample-collection.service';

@Component({
  selector: 'app-edit-labsampledate',
  templateUrl: './edit-labsampledate.component.html',
  styleUrls: ['./edit-labsampledate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditLabsampledateComponent {

  olddate: any;
  newExpdate: any;
  sampleform: FormGroup;
  registerObj: any;
  sampleNo: any
  date: any;

  constructor(
    public _SampleCollectionService: LabSampleCollectionService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditLabsampledateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private elementRef: ElementRef,
  ) {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.olddate = this.registerObj.batchExpDate;
      this.sampleNo = this.registerObj.sampleNo.split(' ')[0]
      this.sampleform = this.createsampleForm()
    }

  }

  createsampleForm() {
    return this._formBuilder.group({

      sampleNo: [parseInt(this.sampleNo) || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      SampleCollectionTime: [this.date]

    });
  }

  onSubmit() {
    console.log(this.sampleform.value);
    this._SampleCollectionService.SampleEditdate(this.sampleform.value).subscribe(response => {
      this._matDialog.closeAll();

    });
  }

  OnReset() {
    this.sampleform.reset();
    this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }

}
