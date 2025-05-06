import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { DoctorMaster } from "../doctor-master.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DoctorMasterService } from "../doctor-master.service";
import { ToastrService } from "ngx-toastr";
import { SignatureViewComponent } from "../signature-view/signature-view.component";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { AirmidTextboxComponent } from "app/main/shared/componets/airmid-textbox/airmid-textbox.component";
import { DatePipe } from "@angular/common";

@Component({
    selector: "app-new-doctor",
    templateUrl: "./new-doctor.component.html",
    styleUrls: ["./new-doctor.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewDoctorComponent implements OnInit, AfterViewChecked {

    myForm: FormGroup
    @ViewChild('ddlDepartment') ddlDepartment: AirmidDropDownComponent;
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    registerObj = new DoctorMaster({});
    signature: any;
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModecity: string = "City";
    autocompleteModedoctorty: string = "DoctorType";
    sanitizeImagePreview: any;
    doctorId:any=0;
    constructor(
        public _doctorService: DoctorMasterService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewDoctorComponent>,
        private readonly changeDetectorRef: ChangeDetectorRef,
        public datePipe: DatePipe,        
    ) { }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        this.myForm = this._doctorService.createdDoctormasterForm();
        console.log(this.myForm.value)
        this.myForm.markAllAsTouched();
        if(this.data){
            console.log("info:",this.data)
            this.doctorId=this.data.doctorId
            this.myForm.get('firstName').setValue(this.data.firstName)
            this.myForm.get('middleName').setValue(this.data.middleName)
            this.myForm.get('lastName').setValue(this.data.lastName)
            this.myForm.get('panCardNo').setValue(this.data.panCardNo)
            this.myForm.get('aadharCardNo').setValue(this.data.aadharCardNo)
            this.myForm.get('phone').setValue(this.data.phone)
            this.myForm.get('address').setValue(this.data.address)
            this.myForm.get('esino').setValue(this.data.esino)
            this.myForm.get('regNo').setValue(this.data.regNo)
            this.myForm.get('education').setValue(this.data.education)
            this.myForm.get('mahRegNo').setValue(this.data.mahRegNo)
            this.myForm.get('refDocHospitalName').setValue(this.data.refDocHospitalName)
            this.myForm.get('prefixId').setValue(this.data.prefixId)
            this.myForm.get('genderId').setValue(this.data.genderId)
            this.myForm.get('doctorTypeId').setValue(this.data.doctorTypeId)
            this.myForm.get('isActive').setValue(this.data.isActive)
        }
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
                this.myForm.controls["mahRegDate"].setValue(this.registerObj.mahRegDate);
                this.myForm.controls["regDate"].setValue(this.registerObj.regDate);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            // this.myForm.reset();
            this.myForm.get('isActive').setValue(true);
            this.myForm.get('isConsultant').setValue(true);
        }
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
    
    removeDepartment(item) {
        let removedIndex = this.myForm.value.mDoctorDepartmentDets.findIndex(x => x.departmentId == item.departmentId);
        this.myForm.value.mDoctorDepartmentDets.splice(removedIndex, 1);
        this.ddlDepartment.SetSelection(this.myForm.value.mDoctorDepartmentDets.map(x => x.departmentId));
    }
    ageYear = 0;
    ageMonth = 0;
    ageDay = 0;
    onSubmit() {
        debugger
        let DateOfBirth1 = this.myForm.get("dateofBirth").value
        if (DateOfBirth1) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth1);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.ageYear = (todayDate.getFullYear() - dob.getFullYear());
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                (this.ageMonth)--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate(); // Days in previous month
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }
        }
        this.myForm.get('ageYear').setValue(String(this.ageYear))
        this.myForm.get('ageMonth').setValue(String(this.ageMonth))
        this.myForm.get('ageDay').setValue(String(this.ageDay))
        
        // const regDateValue = this.myForm.get('regDate')?.value;
        // console.log('regDateValue:', regDateValue);

        // const regDateformatted = this.datePipe.transform(regDateValue, 'yyyy-MM-dd');
        // console.log('Formatted Reg Date:', regDateformatted);

        // const MagRegDateValue = this.myForm.get('mahRegDate')?.value;
        // const MagRegformatted = this.datePipe.transform(MagRegDateValue, 'yyyy-MM-dd');
        // console.log('Formatted Reg Date:', MagRegformatted);

        // this.myForm.get('regDate').setValue(regDateformatted)
        // this.myForm.get('mahRegDate').setValue(MagRegformatted)

        if (!this.myForm.invalid) {
            const formData = { ...this.myForm.value };

            // data.RegDate=this.registerObj.regDate;
            // data.MahRegDate=this.registerObj.mahRegDate;
            const transformedDep = (formData.mDoctorDepartmentDets || []).map((dep: any) => {
                return {
                    docDeptId: 0,
                    doctorId: 0,
                    departmentId: dep.departmentId
                };
            });
    
            formData.mDoctorDepartmentDets = transformedDep;
            formData.doctorId=this.doctorId
            console.log(formData)

            this._doctorService.doctortMasterInsert(formData).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClose();
            }, (error) => {
                this.toastr.error(error.message);
            });
        }else {
            let invalidFields = [];

            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                if (this.myForm.controls[controlName].invalid) {
                    invalidFields.push(`My Form: ${controlName}`);
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
        this.myForm.reset();
        this.dialogRef.close();
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
            prefixId: [
                { name: "required", Message: "Prefix Name is required" }
            ],
            firstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            middleName: [
                { name: "required", Message: "Middle Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" }
            ],
            phone: [
                { name: "required", Message: "Phone no is required" },
                { name: "pattern", Message: "Enter valid numbers" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            genderId: [
                { name: "required", Message: "Gender is required" }
            ],
            education: [
                { name: "required", Message: "Education is required" },
                { name: "pattern", Message: "only char allowed." }
            ],
            esino: [
                { name: "required", Message: "ESINO is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            regNo: [
                { name: "required", Message: "RegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            mahRegNo: [
                { name: "required", Message: "mahRegNo is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            refDocHospitalName: [
                { name: "required", Message: "RefDoc Hospital Name is required" }
            ],
            panCardNo: [
                { name: "required", Message: "Pancard No is required" }
            ],
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }
            ],
            city: [
                { name: "required", Message: "City is required" }
            ],
            doctorTypeId: [
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