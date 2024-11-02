import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { map, startWith, takeUntil } from "rxjs/operators";
import {  TestmasterComponent } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { element } from "protractor";
import { ToastrService } from "ngx-toastr";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PainAssesList } from "app/main/nursingstation/clinical-care-chart/clinical-care-chart.component";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ConsentModule } from "app/main/nursingstation/consent/consent.module";


@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    testForm: FormGroup;
    constructor(
        public _TestmasterService: TestmasterService,
        public dialogRef: MatDialogRef<TestFormMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        this.testForm = this._TestmasterService.createPathtestForm();
        var m_data = {
          testId: this.data?.testId,
          unitName: this.data?.unitName.trim(),
        //   printSeqNo: this.data?.printSeqNo,
        //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
        //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
        // isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.testForm.patchValue(m_data);
    }
    onSubmit() {
        if (this.testForm.valid) {
          debugger
            this._TestmasterService.unitMasterSave(this.testForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
  
    onClear(val: boolean) {
        this.testForm.reset();
        this.dialogRef.close(val);
    }
  }
  