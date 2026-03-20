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
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  minDateTime!: string;

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.olddate = this.registerObj.batchExpDate;
      this.sampleNo = this.registerObj.sampleNo.split(' ')[0]
      this.sampleform = this.createsampleForm()
    }
    this.setMinDateTime();
    this.validateDateTime();

  }

  setMinDateTime() {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    this.minDateTime = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  validateDateTime() {
    this.sampleform.get('SampleCollectionTime')?.valueChanges.subscribe(value => {
      if (!value) return;

      const selected = new Date(value);
      const now = new Date();

      if (selected < now) {
        this.sampleform.get('SampleCollectionTime')?.setErrors({ pastDate: true });
      } else {
        this.sampleform.get('SampleCollectionTime')?.setErrors(null);
      }
    });
  }

  createsampleForm() {
    return this._formBuilder.group({

      sampleNo: [parseInt(this.sampleNo) || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      SampleCollectionTime: [this.date]

    });
  }

  onSubmit() {
    if (this.sampleform.get('SampleCollectionTime')?.hasError('pastDate')) {
      this.toastr.warning(
        'Date & time must be current or future.',
        'Warning'
      );
      return;
    }
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
