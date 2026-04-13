import { ComplaintListService } from '../complaint-list.service';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from 'sweetalert2';
import { OtReserInsert } from 'app/main/otmanagement/ot-reservation/ot-reservation.component';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-new-complaint',
    templateUrl: './new-complaint.component.html',
    styleUrls: ['./new-complaint.component.scss']
})
export class NewComplaintComponent {
    ComplaintForm: FormGroup;
    isActive: boolean = true;
    patientform: FormGroup
    opIpType: boolean = false;
    opIpId: any;
    RegId: string;
    vRegNo: any;
    vPatientName: any;
    vOPDNo="";
    vIPDNo="";
    vSelectedOption: any = 'OP';
 registerObj = new complaintDetail({})
    autocompletedepartment: string = "Department";

    constructor(public _ComplaintListService: ComplaintListService, public datePipe: DatePipe,
        public toastr: ToastrService, private _formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog, private _loggedService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
        public dialogRef: MatDialogRef<NewComplaintComponent>

    ) { }
Updateflag=false
    ngOnInit(): void {
      
        debugger
        if (this.data) {
                console.log(this.data)
            this.registerObj=this.data 
            this.Updateflag=true
            this.vPatientName=this.registerObj.patientName
            this.opIpId=this.registerObj.opdipdNo
            this.vRegNo=this.registerObj.regId
            // this.ComplaintForm.patchValue(this.data);
        }
        this.ComplaintForm = this.createComplaintForm();
        this.ComplaintForm.markAllAsTouched();
        this.patientform = this.getpatientsearchform();


    }

    getpatientsearchform() {
        return this._formBuilder.group({
            opiptype: ['OP'],
            opipid: '',
            IsDischargedit: false,
            PatientName: '',
            RegID: '',
        });
    }

    createComplaintForm(): FormGroup {
        return this._formBuilder.group({
            complaintId: [0],
            patientName: [this.vPatientName, [Validators.required, Validators.maxLength(50)]],
            regId: [this.RegId, [Validators.required]],
            opdipdNo: [this.opIpId, [Validators.required]],
            departmentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            mobileNo: [''],
            emailId: [''],
            address: [''],
            complaint: [''],
            complaintDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            complaintTime: [(new Date()).toISOString()],
            isDischarge: this.isDischarge

        });
    }
    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onSubmit() {
debugger

            // let VOpipId = this.opIpId?.trim() ? this.vOPDNo : this.vIPDNo || '';

        this.ComplaintForm.get('complaintDate').setValue(this.datePipe.transform(this.ComplaintForm.get('complaintDate').value, 'yyyy-MM-dd'))
        this.ComplaintForm.get('complaintTime').setValue(this.datePipe.transform(new Date(), "HH:mm:ss"))
        this.ComplaintForm.get('patientName').setValue(this.vPatientName)
        this.ComplaintForm.get('regId').setValue(this.vRegNo)
        this.ComplaintForm.get('opdipdNo').setValue(this.opIpId)

        if (!this.ComplaintForm.invalid) {
            console.log(this.ComplaintForm.value)
            this._ComplaintListService.insertComplaint(this.ComplaintForm.value).subscribe((response) => {
                this._matDialog.closeAll();
            });
        } else {
            const invalidFields = [];

            if (this.ComplaintForm.invalid) {
                for (const controlName in this.ComplaintForm.controls) {
                    if (this.ComplaintForm.controls[controlName].invalid) {
                        invalidFields.push(`Complaint Form: ${controlName}`);
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


    onChangeReg(event) {
        if (event.value == 'OP') {
            this.opIpType = false;
            this.opIpId = "";
        }
        else if (event.value == 'IP') {
            this.opIpType = true;
            this.opIpId = "";
        }
        this.patientInfoReset();
    }


    getSelectedObjIP(obj) {
        console.log(obj)
        if ((obj.regID ?? 0) > 0) {
            this.registerObj1 = obj
            console.log("Admitted patient:", this.registerObj1)
            this.vRegNo = obj.regNo
            this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
            this.vIPDNo = obj.ipdNo
            this.opIpId = obj.admissionID;
        }
    }
    registerObj1 = new OtReserInsert({});
    getSelectedObjOP(obj) {
        if ((obj.regId ?? 0) > 0) {
            this.registerObj1 = obj
            console.log("Visite Patient:", this.registerObj1)
            this.vRegNo = obj.regNo
            this.vOPDNo = obj.opdNo
            const nameField = obj.formattedText;
            const extractedName = nameField.split('|')[0].trim();
            this.vPatientName = extractedName;
            this.opIpId = obj.visitId;
        }
    }
    vCheckBox: boolean = false;
    isDischarge = false;
    getSelectedObjDC(obj) {

        console.log(obj)
        if ((obj.regID ?? 0) > 0) {
            console.log("Discharge patient:", obj)
            this.registerObj1 = obj
            this.vRegNo = obj.regNo
            this.vIPDNo = obj.ipdNo
            const nameField = obj.formattedText;
            const extractedName = nameField.split('|')[0].trim();
            this.vPatientName = extractedName;
            this.isDischarge = obj.isDischarged
            this.opIpId = obj.admissionID;
            this.opIpType = true
        }
    }

    patientInfoReset() {
        this.patientform.get('opipid').setValue('');
        this.patientform.get('opipid').reset();
        this.vRegNo = '';
        this.vPatientName = '';
        this.vIPDNo = '';
        this.registerObj1 = new OtReserInsert({});
    }

    getDischargedList(event) {
        if (event.checked == true) {
            this.vCheckBox = true;
            this.patientform.get('opiptype')?.setValue('IP');
            this.patientInfoReset()
        }
        else {
            this.vCheckBox = false;
            this.patientInfoReset();
        }
        // this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    }

    getValidationMessages() {
        return {
            mobileNo: [
                { name: "required", Message: "mobileNo is required" },
                // { name: "pattern", Message: "Only Numbers allowed." }
            ],
            address: [
                { name: "required", Message: "address is required" },
                // { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            emailId: [
                { name: "required", Message: "emailId is required" },
                // { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            departmentId: []

        }
    }
    onClear(val: boolean) {
        this.dialogRef.close(val);
    }
}



export class complaintDetail {
    complaintId: any;
    patientName: any;
    regId: any;
    opdipdNo: any;
    departmentId: any;
    mobileNo: any;
    emailId: any;
    address: any;
     complaint: any;
    complaintDate: any;
   complaintTime: any;
    isDischarge: any;

      
        constructor(complaintDetail) {
            {
                this.complaintId = complaintDetail.complaintId || 0;
                this.patientName = complaintDetail.patientName || '';
                this.regId = complaintDetail.regId || '';
                this.opdipdNo = complaintDetail.opdipdNo || '';
                this.departmentId = complaintDetail.departmentId || 0;
                this.mobileNo = complaintDetail.mobileNo || '';
                this.emailId = complaintDetail.emailId || '';
                this.address = complaintDetail.address || '';
                 this.complaint = complaintDetail.complaint || '';
                this.complaintDate = complaintDetail.complaintDate || ''
                  this.complaintTime = complaintDetail.complaintTime || '';
                this.isDischarge = complaintDetail.isDischarge || ''
             
            }
        }
    }