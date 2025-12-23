import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { OtReservationService } from '../ot-reservation.service';
import { DatePipe } from '@angular/common';
import { OtrequestlistComponent } from '../otrequestlist/otrequestlist.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { OtReserInsert } from '../ot-reservation.component';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
  selector: 'app-ot-operative-note',
  templateUrl: './ot-operative-note.component.html',
  styleUrls: ['./ot-operative-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OtOperativeNoteComponent {

  OperativeFormSave: FormGroup;
  registerObj2 = new OtReserInsert({});
  registerObj1 = new OtReserInsert({});
  registerObj3 = new otOperNote({});
  vreservationId: any;
  opIpId: any;
  opiptype: any;
  vRegNo: any;
  vOPDNo: any;
  vIPDNo: any;
  vPatientName: any;
  vTemplateDesc: any;
  Tempdesc: any;
  OTOperativeNotesId:any;
  isItemIdSelected: boolean = false;

  constructor(public _OtReservationService: OtReservationService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<OtOperativeNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.OperativeFormSave = this.operativeForm();
    this.OperativeFormSave.markAllAsTouched();

    console.log(this.data)

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName
      this.opiptype = this.registerObj1.opIpType
      this.opIpId = this.registerObj1.opIpId

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._OtReservationService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
          });
        }, 500);

         setTimeout(() => {
          this._OtReservationService.getotOperativeById(this.data.otReservationId).subscribe((response) => {
            this.registerObj3 = response;
            console.log("Get Operative Data:", this.registerObj2)
            this.OTOperativeNotesId = this.registerObj3.operativeNotesId
            this.vTemplateDesc=this.registerObj3.operativeNotes
          });
        }, 500);
      }
    }
  }

  operativeForm(): FormGroup {
    return this._formBuilder.group({
      operativeNotesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otreservationId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      operativeNotes: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],

      // extra field      
      TemplateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  onChangetemp(e) {
    console.log(e)
    this.Tempdesc = e.templateDescription
    if (e.templateId > 0)
      this.isItemIdSelected = true
  }

  onAddTemplate(e) {
    this.vTemplateDesc = this.Tempdesc
  }

  OnSave() {
    this.OperativeFormSave.get('otreservationId').setValue(this.vreservationId)
    this.OperativeFormSave.get('opiptype').setValue(this.opiptype)
    this.OperativeFormSave.get('opipid').setValue(this.opIpId)
    this.OperativeFormSave.get('operativeNotesId').setValue(this.OTOperativeNotesId || 0)

    if (!this.OperativeFormSave.invalid) {
      this.OperativeFormSave.removeControl('TemplateId')
      console.log(this.OperativeFormSave.value)
      this._OtReservationService.operativeSave(this.OperativeFormSave.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.OperativeFormSave.invalid) {
        for (const controlName in this.OperativeFormSave.controls) {
          if (this.OperativeFormSave.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }

  onClose() {
    this.OperativeFormSave.reset();
    this._matDialog.closeAll();
  }

  onClear(val: boolean) {
    this.OperativeFormSave.reset();
    this.dialogRef.close(val);
  }
}

export class otOperNote {
    operativeNotesId:any;
    operativeNotes:any;

    /**
     * Constructor
     *
     * @param otOperNote
     */

    constructor(otOperNote) {
        {
            this.operativeNotesId = otOperNote.operativeNotesId || ''
            this.operativeNotes = otOperNote.operativeNotes || ''
            // this.isPrimary = OtReserInsert.isPrimary || ''
            // this.isPrimary = OtReserInsert.isPrimary || ''
        }
    }
}