import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { DoctorMaster } from "../doctor-master.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DoctorMasterService } from "../doctor-master.service";
import { ToastrService } from "ngx-toastr";
import { SignatureViewComponent } from "../signature-view/signature-view.component";
import { AirmidAutocompleteComponent } from "app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component";
import { AirmidTextboxComponent } from "app/main/shared/componets/airmid-textbox/airmid-textbox.component";

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewDoctorComponent implements OnInit, AfterViewChecked {

    myForm: FormGroup
    @ViewChild('ddlDepartment') ddlDepartment: AirmidAutocompleteComponent;
    @ViewChild('ddlGender') ddlGender: AirmidAutocompleteComponent;
    registerObj = new DoctorMaster({});
    signature: any;
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModecity: string = "City";
    autocompleteModedoctorty: string = "DoctorType";
    sanitizeImagePreview: any;
    constructor(
        public _doctorService: DoctorMasterService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewDoctorComponent>,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) { }
    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }
    onViewSignature() {
        const dialogRef = this.matDialog.open(SignatureViewComponent,
            {
                width: '900px',
                height: '400px',
                data: {

                }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            this.sanitizeImagePreview = result;
            this.myForm.value.signature = this.sanitizeImagePreview;
        });
    }
    toggleSelectAll() {

    }
    ngOnInit(): void {
        this.myForm = this._doctorService.createdDoctormasterForm();
        if ((this.data?.doctorId ?? 0) > 0) {
            this._doctorService.getDoctorById(this.data.doctorId).subscribe((response) => {
                this.registerObj = response;
                this.ddlDepartment.SetSelection(this.registerObj.mDoctorDepartmentDets);
                if (this.registerObj.signature) {
                    this._doctorService.getSignature(this.registerObj.signature).subscribe(data => {
                        this.sanitizeImagePreview = data;
                        this.myForm.value.signature = data;
                    });
                }
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.myForm.reset();
            this.myForm.get('isActive').setValue(true);
            this.myForm.get('IsConsultant').setValue(true);
        }
    }
    removeDepartment(item) {
        let removedIndex = this.myForm.value.MDoctorDepartmentDets.findIndex(x => x.departmentId == item.departmentId);
        this.myForm.value.MDoctorDepartmentDets.splice(removedIndex, 1);
        this.ddlDepartment.SetSelection(this.myForm.value.MDoctorDepartmentDets.map(x => x.departmentId));
    }
    onSubmit() {
        debugger
        if (this.myForm.valid) {
            this._doctorService.doctortMasterInsert(this.myForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClose();
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }

    onClear(val: boolean) {
        this.myForm.reset();
    }
    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getValidationMessages() {
        return {
            PrefixID: [
                { name: "required", Message: "Prefix Name is required" }
            ],
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            MiddleName: [
                { name: "required", Message: "Middle Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "required", Message: "Last Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            Address: [
                { name: "required", Message: "Address is required" }
            ],
            Phone: [
                { name: "required", Message: "Phone no is required" },
                { name: "pattern", Message: "Enter valid numbers" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            GenderId: [
                { name: "required", Message: "Gender is required" }
            ],
            Education: [
                { name: "required", Message: "Education is required" },
                { name: "pattern", Message: "only char allowed." }
            ],
            esino: [
                { name: "required", Message: "ESINO is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            RegNo: [
                { name: "required", Message: "RegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            mahRegNo: [
                { name: "required", Message: "mahRegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            RefDocHospitalName: [
                { name: "required", Message: "RefDoc Hospital Name is required" }
            ],
            Pancardno: [
                { name: "required", Message: "Pancard No is required" }
            ],
            AadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }
            ],
            City: [
                { name: "required", Message: "City is required" }
            ],
            DoctorTypeId: [
                { name: "required", Message: "Doctor Type is required" }
            ],
            Departmentid: [
                { name: "required", Message: "Department is required" }
            ]
        };
    }
}



export class DepartmenttList {
    DeptId: number;
    DeptName: number;


    constructor(DepartmenttList) {
        this.DeptId = DepartmenttList.DeptId || '';
        this.DeptName = DepartmenttList.DeptName || '';
    }
}