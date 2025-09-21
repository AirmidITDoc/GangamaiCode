import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { ExpensesComponent } from '../expenses.component';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-new-expenses',
  templateUrl: './new-expenses.component.html',
  styleUrls: ['./new-expenses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewExpensesComponent {

  myForm: FormGroup
  screenFromString = 'Common-form';
  dateTimeObj: any;
  vExpType: any = "0";
  vReason:any;

  constructor(public _ExpensesService: ExpensesService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewExpensesComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this._ExpensesService.CreateMyForm();
    this.myForm.markAllAsTouched();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onNewSave() {

  }

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }

}
