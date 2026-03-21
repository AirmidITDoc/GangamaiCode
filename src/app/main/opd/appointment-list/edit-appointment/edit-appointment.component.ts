import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RegInsert } from '../../registration/registration.component';
import { AppointmentlistService } from '../appointmentlist.service';


@Component({
    selector: 'app-edit-appointment',
    templateUrl: './edit-appointment.component.html',
    styleUrls: ['./edit-appointment.component.scss']
})
export class EditAppointmentComponent {
    VisitFormGroup: FormGroup;
    screenFromString = 'appointment';

    autocompleteModepatienttype: string = "PatientType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecompany: string = "Company";
    // autocompleteModesubcompany: string = "SubCompany";
    autocompletedepartment: string = "Department";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModerefdoc: string = "RefDoctor";
    // autocompleteModepurpose: string = "Purpose";
    autocompleteModeClass: string = "Class";

    selectedTabIndex = 0;

    isCompanySelected: boolean = false;
    registerObj = new RegInsert({});
    patienttype = 0
    companyDet = new RegInsert({});
    currentDate = new Date();
    vPhoneAppId = 0
    RegId: any = 0;
    PatientName: any = '';
    vRegNo = 0
    vhealthCardNo = 0
    HealthCardExpDate: any;
    VisitFlagDisp: boolean = false;

    @ViewChild('ddldoctor') ddldoctor: AirmidDropDownComponent;

    constructor(
        public _AppointmentlistService: AppointmentlistService,
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<EditAppointmentComponent>,
        public _matDialog: MatDialog,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        public matDialog: MatDialog,
        private commonService: PrintserviceService,
        private _configue: ConfigService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

    ) { }
    FromRegistration: any;
    chkregisterd: boolean = false;
    Is9_Digit_National_Id: boolean = false;
    vVistId = 0
    ngOnInit(): void {

        //this code for Mediforte 9 digit national id
        const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is9_Digit_National_Id = id === "1";

        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAllAsTouched();

        console.log(this.data)

        if (this.data) {
            this.vVistId = this.data.visitId
            if (this.data.companyId > 0) {
                this.isCompanySelected = true

            }
            debugger
            setTimeout(() => {
                this._AppointmentlistService.getDoctorsByDepartment(this.data.departmentId).subscribe((data: any) => {
                    this.ddldoctor.options = data;
                    this.ddldoctor.bindGridAutoComplete();
                });
            }, 500);
            this.VisitFormGroup.get("ConsultantDocId")?.setValue(this.data?.doctorId)

            this.FromRegistration = this.data?.Obj

            // this.VisitFormGroup = this.createVisitdetailForm();

            // this.selectChangedepartment(this.registerObj)
            this.getSelectedObj(this.FromRegistration)
        }
    }


    createVisitdetailForm() {
        return this._formBuilder.group({

            visitId: [this.data?.visitId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            ClassId: [this.data?.classId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],

            PatientTypeId: [this.data.patientTypeId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            TariffId: [this.data?.tariffId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DepartmentId: [this.data.departmentId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],

            ConsultantDocId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RefDocId: [this.data?.refDocId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            CompanyId: [this.data?.companyId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],

        });
    }


    getSelectedObj(obj) {

        this.RegId = obj.regId;
        if ((this.RegId ?? 0) > 0) {
            console.log(obj)
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(response)
                });

            }, 100);
        }

    }
    setdoctor(data) {

        this._AppointmentlistService.getDoctorsByDepartment(data).subscribe((data: any) => {
            console.log(data)
            this.ddldoctor.options = data;
            this.ddldoctor.bindGridAutoComplete();
            const incomingDoctorId = data || 0;
            if (incomingDoctorId) {
                const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                if (matchedDoctor) {
                    this.VisitFormGroup.get('ConsultantDocId')?.setValue(matchedDoctor.value);
                }
            }
        });
    }

    selectChangedepartment(obj: any) {

        if (obj.value) {
            this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
                this.ddldoctor.options = data;
                this.ddldoctor.bindGridAutoComplete();
            });
        } else {
            this._AppointmentlistService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
                console.log(data)
                if (data) {

                    this.ddldoctor.options = data;
                    this.ddldoctor.bindGridAutoComplete();
                    const incomingDoctorId = obj.consultantDocId || obj.doctorId;
                    if (incomingDoctorId) {
                        const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                        if (matchedDoctor) {
                            this.VisitFormGroup.get('ConsultantDocId')?.setValue(matchedDoctor.value);
                        }
                    }
                }
            });
        }
    }


    OnViewReportPdf(element) {
        this.commonService.Onprint("VisitId", this.vVistId, "AppointmentReceipt");
    }

    onChangePatient(value) {

        const mode = "Company"
        if (value.text != "Self") {
            this._AppointmentlistService.getMaster(mode, 1);
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.text == "Self") {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('CompanyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
            this.patienttype = 1;
        }
    }

    onChangeCompany(value) {
        this._AppointmentlistService.getCompanyById(value.value).subscribe((response) => {
            this.companyDet = response;
            console.log("Company Data:", this.companyDet)
            this.VisitFormGroup.get('TariffId').setValue(this.companyDet.traiffId);
        });
    }

    // getregdetails() {

    //   if (RegId > 0) {
    //     setTimeout(() => {
    //       this._AppointmentlistService.getRegistraionById(RegId).subscribe((response) => {
    //         this.registerObj = response;
    //         // console.log(this.registerObj)
    //       });
    //     }, 500);
    //   }

    // }


    WhatsAppAppointmentSend(el, vmono) {
        const m_data = {
            "insertWhatsappsmsInfo": {
                "mobileNumber": vmono || 0,
                "smsString": '',
                "isSent": 0,
                "smsType": 'Appointment',
                "smsFlag": 0,
                "smsDate": this.currentDate,
                "tranNo": el,
                "PatientType": 2,//el.PatientType,
                "templateId": 0,
                "smSurl": "info@gmail.com",
                "filePath": '',
                "smsOutGoingID": 0
            }
        }
        this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
            if (response) {
                this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
            } else {
                this.toastr.error('API Error!', 'Error WhatsApp!', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });

    }

    PrevregisterObj: any;




    vDepId = 0;
    vDocId = 0;


    onSave() {
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to Update this OPD Appointment?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, Update it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {

                // const formValues = this.personalFormGroup.getRawValue() as RegInsert;

                //     console.log(formValues)
                console.log('Visit Form : ', this.VisitFormGroup.value)
                if (!this.VisitFormGroup.invalid) {

                    if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
                        this.toastr.warning('Please select valid Company ', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }
                    this.Onsave()

                } else {
                    const invalidFields = [];

                    if (this.VisitFormGroup.invalid) {
                        for (const controlName in this.VisitFormGroup.controls) { if (this.VisitFormGroup.controls[controlName].invalid) { invalidFields.push(`Visit Form: ${controlName}`); } }
                    }

                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
                    }

                }
            }
        });
    }

    Onsave() {


        this.VisitFormGroup.get("DepartmentId").setValue(Number(this.VisitFormGroup.get('DepartmentId').value))
        this.VisitFormGroup.get("RefDocId").setValue(Number(this.VisitFormGroup.get('RefDocId').value))
        debugger
        if (!this.isCompanySelected)
            //   this.VisitFormGroup.get("CompanyId").setValue(Number(this.VisitFormGroup.get('CompanyId').value))
            // else
            this.VisitFormGroup.get("CompanyId").setValue(0)


        console.log(this.VisitFormGroup.value);
        this._AppointmentlistService.Editappointment(this.VisitFormGroup.value).subscribe((response) => {
            this.OnViewReportPdf(response)
            this.onClear(true);
            this._matDialog.closeAll();
        });
    }


    getValidationMessages() {
        const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
        const minLen = this.Is9_Digit_National_Id ? 7 : 12;
        return {
            RegId: [],

            patientTypeId: [
                { name: "required", Message: "Country Name is required" }
            ],
            tariffId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            departmentId: [
                { name: "required", Message: "Department Name is required" }
            ],
            DoctorID: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            refDocId: [
                { name: "required", Message: "Ref Doctor Name is required" }
            ],
            PurposeId: [
                { name: "required", Message: "Purpose Name is required" }
            ],
            CompanyId: [
                { name: "required", Message: "Company Name is required" }
            ],
            SubCompanyId: [
                { name: "required", Message: "SubCompany Name is required" }
            ],
            ClassId: [
                { name: "required", Message: "SubCompany Name is required" }
            ],

        };
    }

    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    onClear(val: boolean) {
        // this.VisitFormGroup.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    onSelectPatient(row: any) {
        this.getSelectedObj(row);

    }

}

