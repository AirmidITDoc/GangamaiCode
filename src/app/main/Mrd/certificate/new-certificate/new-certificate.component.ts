import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ReplaySubject, Subject } from 'rxjs';
import { MrdService } from '../../mrd.service';

@Component({
    selector: 'app-new-certificate',
    templateUrl: './new-certificate.component.html',
    styleUrls: ['./new-certificate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCertificateComponent implements OnInit {
    createMrdcertificate: FormGroup
    myForm: FormGroup
    public tools: object = {
        type: 'MultiRow',
        items: ['Undo', 'Redo', '|',
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'SubScript', 'SuperScript', '|',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
            'CreateTable', '|',
            'CreateLink', 'Image', '|',
            'Indent', 'Outdent', '|',
            'ClearFormat', '|', 'FullScreen',
            // 'SourceCode',
        ]
    };


    minDate: Date;
    Today: Date = new Date();
    selectedAdvanceObj: OPIPPatientModel;
    PatientName: any = '';
    OPIP: any = '';
    Bedname: any = '';
    wardname: any = '';
    classname: any = '';
    tariffname: any = '';
    AgeYear: any = '';
    ipno: any = '';
    patienttype: any = '';
    Adm_Vit_ID: any = 0;
    Injuries: any;
    PatientHeaderObj: any;
    RegId: any;
    vAdmissionID: any;
    isRegIdSelected: boolean = false;

    autocompleteModeDepartment: string = "Department";

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(private _fuseSidebarService: FuseSidebarService,
        public _MrdService: MrdService,
        public formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private advanceDataStored: AdvanceDataStored,
        // private _FormBuilder: FormBuilder,
        public dialogRef: MatDialogRef<NewCertificateComponent>,
        public datePipe: DatePipe) {
        dialogRef.disableClose = true;
    }


    doctorNameCmbList: any = [];

    public doctorFilterCtrl: FormControl = new FormControl();
    public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

    //department filter
    public departmentFilterCtrl: FormControl = new FormControl();
    public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();


    ngOnInit(): void {
        this.createMrdcertificate = this.createMrdcertificateForm();
        this.myForm = this.createMyForm();
        this.minDate = new Date();


        if (this.advanceDataStored.storage) {
            this.selectedAdvanceObj = this.advanceDataStored.storage;
            console.log(this.selectedAdvanceObj);
            this.PatientHeaderObj = this.advanceDataStored.storage;
        }

    }


    createMyForm() {
        return this.formBuilder.group({
            RegID: '',
            // PatientName: '',
            // WardName: '',
            // StoreId: '',
            // RegID: [''],
            // Op_ip_id: ['1'],
            // AdmissionID: 0

        })
    }


    createMrdcertificateForm() {


        return this.formBuilder.group({
            // AppointmentDate:[(new Date()).toISOString()],
            CertificateNo: '',
            CertificateDate: [(new Date()).toISOString()],
            CertificateTime: [(new Date()).toISOString()],
            DateofDeath: [(new Date()).toISOString()],
            // TimeofDeath: [{ value: this.registerObj.Adm_Vit_Date }],
            CauseofDeath: ['', Validators.required],
            PlaceOfDeath: ['', Validators.required],
            ResponsiblePersonName: [''],
            SMCNo: ['', Validators.required],
            Diagnsis: '',
            Departmentid: '',
            DoctorId: '',
            DOA: [(new Date()).toISOString()],
        });
    }
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    selectChangedepartment(obj: any) {
        // debugger
        if (obj.value) {
            this._MrdService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
                console.log(data)
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
            });
        } else {
            this._MrdService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
                console.log(data)
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
                const incomingDoctorId = obj.docNameId || obj.doctorId;
                if (incomingDoctorId) {
                    const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                    if (matchedDoctor) {
                        this.createMrdcertificate.get('DoctorId')?.setValue(matchedDoctor.value);
                    }
                }
            });
        }
    }
    onSubmit() {

        const MLCId = 0//this.registerObj1.OTCathLabBokingID;


        console.log()
        // if (this.Adm_Vit_ID) {

        if (!MLCId) {
            const m_data = {
                "certificateDelete": {
                    "certificateId": 0
                },
                "certificateInsert": {
                    "certificateNo": 0,
                    "opD_IPD_Id": this.vAdmissionID || 0,
                    "certificateDate": this.dateTimeObj.date,
                    "certificateTime": this.dateTimeObj.time,
                    "opD_IPD_Type": 1,
                    "dateofDeath": this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
                    "timeofDeath": this.dateTimeObj.time, // this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
                    "causeofDeath": this.createMrdcertificate.get('CauseofDeath').value || '',
                    "placeOfDeath": this.createMrdcertificate.get('PlaceOfDeath').value || '',
                    "responsiblePersonName": this.createMrdcertificate.get('ResponsiblePersonName').value || '',
                    "smcNo": this.createMrdcertificate.get('SMCNo').value || '',
                    "diagnsis": this.createMrdcertificate.get('Diagnsis').value || '',
                    "addedBy": this.accountService.currentUserValue.userId


                }
            }
            console.log(m_data);
            this._MrdService.DeathcertificateInsert(m_data).subscribe(response => {

            });
        }


    }

    getSelectedObj(obj) {
        console.log(obj)
        this.RegId = obj.regId;
        this.vAdmissionID = obj.opD_IPD_Id;
        this.PatientName = obj.firstName + ' ' + obj.middleName + ' ' + obj.lastName

    }

    getValidationMessages() {
        return {
            DepartmentId: [
                // { name: "required", Message: "Department is required" }
            ],
            DoctorId: [
                // { name: "required", Message: "DoctorName Name is required" }
            ],
        };
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        console.log('dateTimeObj ==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }
    onClose() {
        this.dialogRef.close();
    }
}


