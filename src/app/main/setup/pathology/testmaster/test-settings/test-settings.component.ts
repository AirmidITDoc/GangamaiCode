import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { TemplatedetailList, TestList, TestMaster } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { element } from "protractor";


@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TestSettingsComponent {

  testSettingForm: FormGroup;
  autocompleteModeCategoryId: string = "PathCategory";

  constructor(
    public _TestmasterService: TestmasterService,
    public dialogRef: MatDialogRef<TestSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.testSettingForm = this.createSettingForm();
    this.testSettingForm.markAllAsTouched();
  }

  createSettingForm() {
    return this._formBuilder.group({
      specimenId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      specimenQty: ['', [Validators.maxLength(50)]],
      specimenConId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isConsent: [false, [Validators.required]],
      barcode: [''],
      disease: [],
      isFasting: [false, [Validators.required]],
      CategoryId: [0],
      reported: [''],
      information: [''],
      days: [''],
      hrs: [''],
      min: [''],
    })
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onSubmit() {

  }
  onClose(val: boolean) {
    this.dialogRef.close(val);
  }
}
