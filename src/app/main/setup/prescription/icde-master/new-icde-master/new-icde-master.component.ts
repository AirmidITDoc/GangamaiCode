import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ICDEMasterService } from '../icde-master.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { OperatorComparer } from 'app/core/models/gridRequest';


@Component({
    selector: 'app-new-icde-master',
    templateUrl: './new-icde-master.component.html',
    styleUrls: ['./new-icde-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewICDEMasterComponent {

    ICDEForm: FormGroup;
    isActive: boolean = true;
    ICdeDatasource = new MatTableDataSource<Icdedetails>();
    constructor(
        public _ICDEMasterService: ICDEMasterService,
        public dialogRef: MatDialogRef<NewICDEMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.ICDEForm = this._ICDEMasterService.createICDEForm();
        this.ICDEForm.markAllAsTouched();
        if ((this.data?.icdid ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.ICDEForm.patchValue(this.data);
        }
    }

    chkSatus = false
    DiagnosisName = ''

    allcolumns = [
        { heading: "ICD Diagnosis Name", key: "diagnosisName", sort: true, align: 'left', emptySign: 'NA', width: 600 },
        { heading: "ICD version", key: "icdversion", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ICD Code", key: "icdcode", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    ]
    onSubmit() {

        if (!this.ICDEForm.invalid) {
            console.log(this.ICDEForm.value)
            const filters: any[] = [];

            this.DiagnosisName = this.ICDEForm.get("diagnosisName").value

            const data = {
                "first": 0,
                "rows": 100,
                "sortField": "Icdid",
                "sortOrder": 0,
                "filters": [{ fieldName: "DiagnosisName", fieldValue: this.DiagnosisName, opType: OperatorComparer.StartsWith }],
                "exportType": "JSON",
                "columns": []
            };

            this._ICDEMasterService.getbyICDEId(data).subscribe((response) => {
                this.ICdeDatasource.data = response.data;

                console.log(this.ICdeDatasource.data)
                this.chkSatus = true
            });


            if (this.ICdeDatasource.data.length > 0) {
                debugger
                let Icdecode = this.ICDEForm.get("icdcode").value;
                let isDuplicate = this.ICdeDatasource.data.some(item => item.icdcode == Icdecode);


                if (this.chkSatus) {

                    if (isDuplicate) {
                        Swal.fire("Duplicate ICDE ...");
                    } else {
                        this._ICDEMasterService.IcdeMasterInsert(this.ICDEForm.value).subscribe((response) => {
                            this.onClear(true);
                        });
                    }
                }
            }
        } {
            const invalidFields = [];
            if (this.ICDEForm.invalid) {
                for (const controlName in this.ICDEForm.controls) {
                    if (this.ICDEForm.controls[controlName].invalid) {
                        invalidFields.push(`dose Form: ${controlName}`);
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

    onClear(val: boolean) {
        this.ICDEForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            icdversion: [
                { name: "required", Message: "icdversione is required" },

            ],
            icdcode: [
                { name: "required", Message: "icdcode" },

            ],
            diagnosisName: [
                { name: "required", Message: "diagnosisName" }
            ],
            shortName: [
                { name: "required", Message: "shortName" }
            ]
        }
    }

}




export class Icdedetails {
    icdid: any;
    icdcode: any;

    constructor(Icdedetails) {
        {
            this.icdid = Icdedetails.icdid || "";
            this.icdcode = Icdedetails.icdcode || "";
        }
    }
}