import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { OtReserInsert } from '../ot-reservation.component';
import { OtReservationService } from '../ot-reservation.service';
import { OtrequestlistComponent } from '../otrequestlist/otrequestlist.component';


@Component({
    selector: 'app-new-reservation',
    templateUrl: './new-reservation.component.html',
    styleUrls: ['./new-reservation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {

    reservationForm: FormGroup;
    reservationSurgeryForm: FormGroup;
    reservationAttendentForm: FormGroup;
    reservationDiagnosisForm: FormGroup;
    screenFromString = 'Common-form';
    opIpType: boolean = false;
    opIpId: any;
    RegId: string;
    vSelectedOption: any = 'OP';
    vrequestType: any = "1";
    vreservationType: any = "1";
    vpacrequired: any = "1";
    vequipmentsRequired: any = "1";
    vinfective: any = "1";

    autocompleteModeDepartment: string = "Department";
    autocompleteModeSiteDescription: string = "SiteDescription";
    autocompleteModeotTableCategory: string = "OttypeMaster";
    autocompleteModeDoctorSurgeon: string = "DoctorSurgion";
    autocompleteModeSurgeryMaster: string = "SurgeryMaster";
    autocompleteModeDoctorType: string = "DoctorType";
    autocompleteModeConDoctor: string = "ConDoctor";
    autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeResourseType: string = "ResourcesTypes";
    autocompleteModebloodGroup: string = "BloodGroupTypes";
    autocompleteModestatus: string = "State";
    autocompleteModeSurgery: string = "SurgeryMaster";
    autocompleteModeOTTable: string = "OttableMaster";
    autocompleteModeLocation: string = "Location";

    vRegNo: any;
    vPatientName: any;
    vbookingId: any;
    vOPDNo: any;
    vIPDNo: any;
    surgId: any;
    surgName: any;
    surgeonId: any;
    surgeonName: any;
    doctorTypeId: any;
    doctorType: any;
    AnthId: any;
    AnthName: any;
    AnthId1: any;
    AnthName1: any;
    editIndex: number | null = null;
    editIndex1: number | null = null;
    surgCategoryName: any;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

    displayedColumns: string[] = [
        'sequence',
        'surgeryCategoryName',
        'surgeryName',
        'surgeryPart',
        'surgeryDuration',
        'surgeryFromTime',
        'surgeryEndTime',
        'isPrimary',
        'surgeon',
        'anesthesia',
        'Action'
    ];

    displayedColumns1: string[] = [
        'sequence',
        'surgeon',
        'anesthesia',
        'Action'
    ];

    registerObj1 = new OtReserInsert({});
    partTypes: string[] = ["Left", "Middle", "Right"];
    @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
    @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
    @ViewChild('ddlSurgeryName') ddlSurgeryName: AirmidDropDownComponent;

    dssurgeryDetailList = new MatTableDataSource<OtReserInsert>();
    dsattendentDetailList = new MatTableDataSource<OtReserInsert>();
    Chargelist: any[] = [];
    Chargelist1: any[] = [];
    addDiagnolist: any = [];
    dateTimeObj: any;
    vrequestId: any;
    vreservationId: any;
    registerObj2 = new OtReserInsert({});
    AllTypeDescription: any = []
    RtrvDescriptionList: any = [];
    vanesthesiaType: any;

    constructor(public _OtReservationService: OtReservationService,
        public dialogRef: MatDialogRef<NewReservationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ref: MatDialogRef<NewReservationComponent>,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: FormBuilder,
        public datePipe: DatePipe,
        private _matDialog: MatDialog,
        public toastr: ToastrService) { }

    ngOnInit(): void {
        this.reservationForm = this.createReservationForm();
        this.reservationForm.markAllAsTouched();

        this.reservationSurgeryForm = this.createReservationSurgeryArrayForm();
        this.reqSurgeryArray.push(this.createReservationSurgeryArrayForm())

        this.reservationAttendentForm = this.createReservationAttendentArrayForm();
        this.reqAttendingArray.push(this.createReservationAttendentArrayForm())

        this.reservationDiagnosisForm = this.createReservationDignosis();
        this.reservationDignosisArray.push(this.createReservationDignosis())

        if ((this.data?.otReservationId) > 0) {
            this.registerObj1 = this.data
            console.log(this.registerObj1)
            this.vRegNo = this.registerObj1.regNo
            this.vOPDNo = this.registerObj1.opdNo
            this.vIPDNo = this.registerObj1.opdNo
            this.vPatientName = this.registerObj1.patientName
            this.vrequestId = this.registerObj1.otRequestId;
            this.opIpType = this.registerObj1.opIpType
            // this.reservationForm.get('estimateTime')?.setValue(this.registerObj1.estimateTime.trim())
            this.reservationForm.get('isAnaesthetistPaid')?.setValue(this.registerObj1.isAnaesthetistPaid)
            this.reservationForm.get('isMaterialReplacement')?.setValue(this.registerObj1.isMaterialReplacement)

            setTimeout(() => {
                this._OtReservationService.getotTableById(this.data.ottable).subscribe((response) => {
                    this.registerObj2 = response;
                    // console.log("Get ottable Data:", this.registerObj2)
                    this.ddlLocation.SetSelection(this.registerObj2.locationId);
                });
            }, 500);

            if (this.data.otReservationId) {
                setTimeout(() => {
                    this._OtReservationService.getotReservationById(this.data.otReservationId).subscribe((response) => {
                        this.registerObj2 = response;
                        console.log("Get Data:", this.registerObj2)
                        this.vanesthesiaType = this.registerObj2.anesthesiaType
                        this.vreservationId = this.registerObj2.otreservationId
                        this.opIpId = this.registerObj2.opipid
                        this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
                        this.vreservationType = this.registerObj2.reservationType == true ? '1' : '0';
                        this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
                        this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
                        this.vinfective = this.registerObj2.infective == true ? '1' : '0';
                        this.reservationForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate)
                        this.reservationForm.get('anesthesiaType')?.setValue(this.registerObj2.anesthesiaType)
                    });
                }, 500);
            }


            // if (this.registerObj1?.estimateTime) {
            //   const date = new Date(this.registerObj1.estimateTime);
            //   if (!isNaN(date.getTime())) {
            //     const hours = date.getHours().toString().padStart(2, '0');
            //     const minutes = date.getMinutes().toString().padStart(2, '0');

            //     const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

            //     setTimeout(() => {
            //       this.reservationForm.get('estimateTime')?.setValue(formattedTime);
            //     });
            //   }
            // }

            this.reservationForm.patchValue(this.registerObj1);
            this.reservationForm.get('estimateTime')?.setValue(Number(this.registerObj1.estimateTime).toFixed(2) ?? null)

            this.getdiagnosisList(this.registerObj1);
            this.getReservationSurgeryDetList(this.registerObj1);
            this.getReservationAttendentDetList(this.registerObj1);
        }

        /////// calendar code required///////
        // if (this.data) {
        //   console.log("CalenderData:", this.data)

        //   if (this.data?.startTime) {
        //     const date = new Date(this.data.startTime);
        //     if (!isNaN(date.getTime())) {
        //       const hours = date.getHours().toString().padStart(2, '0');
        //       const minutes = date.getMinutes().toString().padStart(2, '0');

        //       const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        //       setTimeout(() => {
        //         this.reservationForm.get('estimateTime')?.setValue(formattedTime);
        //       });
        //     }
        //   }

        //   if (this.data?.endTime) {
        //     const date = new Date(this.data.endTime);
        //     if (!isNaN(date.getTime())) {
        //       const hours = date.getHours().toString().padStart(2, '0');
        //       const minutes = date.getMinutes().toString().padStart(2, '0');

        //       const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        //       setTimeout(() => {
        //         this.reservationForm.get('opendTime')?.setValue(formattedTime);
        //       });
        //     }
        //   }
        //   // this.reservationForm.get('ottableId').setValue(this.data?.otTableId);
        //   this.reservationForm.get('surgeryDuration').setValue(this.data?.duration);

        // }
    }

    createReservationForm(): FormGroup {
        return this._formBuilder.group({
            otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otreservationDate: [new Date()],
            otreservationTime: ['', [Validators.required]],
            otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: ["OP"],
            bloodGroup: ['0'],
            categoryType: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ottable: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],  // means location theater
            surgeryDate: [new Date().toISOString(), [Validators.required]],
            estimateTime: ['', [Validators.required]],
            diagnosis: [[]],
            comments: [''],
            reservationType: ['1'],
            pacrequired: ['1'],
            equipmentsRequired: ['1'],
            clearanceMedical: false,
            clearanceFinancial: false,
            infective: ['1'],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],
            isAnaesthetistPaid: false,
            isMaterialReplacement: false,

            tOtReservationSurgeryDetails: this._formBuilder.array([]),
            tOtReservationAttendingDetails: this._formBuilder.array([]),
            tOtReservationDiagnoses: this._formBuilder.array([]),

            ////////surgery det parameters ////////////
            surgeryCategoryId: [''],
            surgeryId: [0],
            surgeryPart: [''],
            surgeryFromTime: [''],
            surgeryEndTime: [''],
            surgeryDuration: [''],
            isPrimary: [false],
            surgeonId: [0],
            anesthetistId: [0],

            ////////attendent det parameters ////////////
            recourceType: [0],
            doctorTypeId: [0],
            doctorId: [0],

            // new fields
            TheaterLocation: [],
            // MobileNo: [],
            bodyPartId: [0],
            anesthesiaType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsDischargedit: 0,
        });
    }

    createReservationSurgeryArrayForm(element: any = {}, index: number = 0): FormGroup {
        // debugger
        return this._formBuilder.group({
            otreservationSurgeryDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryCategoryId: [element.surgeryCategoryId],
            surgeryId: [element.surgeryId],
            surgeryPart: [element.surgeryPart],
            surgeryFromTime: [element.surgeryFromTime],
            surgeryEndTime: [element.surgeryEndTime],
            surgeryDuration: [Number(element.surgeryDuration)],
            isPrimary: [String(element.isPrimary ?? false)],
            surgeonId: [element.surgeonId],
            anesthetistId: [element.anestheticsId],
            seqNo: [index + 1]
        });
    }
    get reqSurgeryArray(): FormArray {
        return this.reservationForm.get('tOtReservationSurgeryDetails') as FormArray;
    }

    createReservationAttendentArrayForm(element: any = {}, index: number = 0): FormGroup {
        // debugger
        return this._formBuilder.group({
            otreservationAttendingDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorTypeId: [element.doctorTypeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorId: [element.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            seqNo: [index + 1]
        });
    }
    get reqAttendingArray(): FormArray {
        return this.reservationForm.get('tOtReservationAttendingDetails') as FormArray;
    }

    createReservationDignosis(element: any = {}): FormGroup {
        return this._formBuilder.group({
            otreservationDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            descriptionType: [element.descriptionType ?? ''],
            descriptionName: [element.descriptionName ?? '']
        });
    }
    get reservationDignosisArray(): FormArray {
        return this.reservationForm.get('tOtReservationDiagnoses') as FormArray;
    }

    patientInfoReset() {
        this.reservationForm.get('opipid').setValue('');
        this.reservationForm.get('opipid').reset();
        this.vRegNo = '';
        this.vPatientName = '';
        this.vIPDNo = '';
        this.registerObj1 = new OtReserInsert({});
    }

    /////////////////////////////// ot request detail part /////////////////////////////
    onChangeOtRequest(obj: any) {

        if (obj.otReservationId > 0) {
            const name = obj.patientName?.split('|')[0]?.trim();
            Swal.fire({
                icon: 'warning',
                title: 'OT Reservation already completed',
                text: `${name} already has a reservation.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        if (obj.isCancelled > 0) {
            const name = obj.patientName?.split('|')[0]?.trim();
            Swal.fire({
                icon: 'warning',
                title: 'Cancelled',
                text: `${name} OT request is already cancelled.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        this.resetOtRequestData();

        this.registerObj1 = obj
        this.vPatientName = this.registerObj1.patientName;
        this.opIpType = obj.opipType == '1' ? true : false;
        console.log("search data:", this.registerObj1);

        if (obj.otRequestId) {
            this._OtReservationService.getotRequestById(obj.otRequestId).subscribe((response) => {
                this.registerObj2 = response;
                console.log("Get otrequest Data:", this.registerObj2);

                this.vrequestId = this.registerObj2.otrequestId;
                this.opIpId = this.registerObj2.opipid;
                const mappedOpIpType = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
                this.registerObj2.opiptype = mappedOpIpType;

                // Update selected option
                this.vSelectedOption = mappedOpIpType;
                this.reservationForm.get('opiptype').setValue(mappedOpIpType);

                this.reservationForm.patchValue(this.registerObj2);
                this.reservationForm.get('estimateTime')?.setValue(Number(this.registerObj2.estimateTime).toFixed(2) ?? null)

                // this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
                this.reservationForm.get('pacrequired').setValue(this.registerObj2.pacrequired ? '1' : '0')
                this.reservationForm.get('infective').setValue(this.registerObj2.infective ? '1' : '0')
                this.reservationForm.get('equipmentsRequired').setValue(this.registerObj2.equipmentsRequired ? '1' : '0')
                this.reservationForm.get('reservationType').setValue(this.registerObj2.requestType ? '1' : '0')

                setTimeout(() => {
                    this._OtReservationService.getotTableById(this.registerObj2.ottable).subscribe((response) => {
                        this.registerObj2 = response;
                        this.ddlLocation.SetSelection(this.registerObj2.locationId);
                    });
                }, 200);

                // if (this.registerObj2?.estimateTime) {
                //     const date = new Date(this.registerObj2.estimateTime);
                //     if (!isNaN(date.getTime())) {
                //         const hours = date.getHours().toString().padStart(2, '0');
                //         const minutes = date.getMinutes().toString().padStart(2, '0');

                //         const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

                //         setTimeout(() => {
                //             this.reservationForm.get('estimateTime')?.setValue(formattedTime);
                //         });
                //     }
                // }

                // this.reservationForm.patchValue(this.registerObj2);
                this.getotReqdiagnosisList(obj.otRequestId);
                this.getRequestSurgeryDetList(obj.otRequestId);
                this.getRequestAttendentDetList(obj.otRequestId);
            });
        }
    }

    resetOtRequestData() {
        this.registerObj2 = null;

        //reset arrays after select
        this.Chargelist = [];
        this.Chargelist1 = [];

        this.dssurgeryDetailList.data = [];
        this.dsattendentDetailList.data = [];

        // this.reservationForm?.reset();
    }

    FetchotRequestList: any = [];
    getRequestSurgeryDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvRequestSurgeryList(m_data2).subscribe(records => {
            this.FetchotRequestList = records.data as OtReqInsert[];
            this.FetchotRequestList.forEach(element => {

                const parseBackendDate = (dateStr: string) => {
                    if (!dateStr) return null;
                    const [datePart, timePart] = dateStr.split(' ');
                    const [dd, mm, yyyy] = datePart.split('-');

                    return new Date(`${yyyy}-${mm}-${dd}T${timePart}`);
                };

                const from = new Date(element.surgeryFromTime);
                const end = element.surgeryEndTime ? new Date(element.surgeryEndTime) : null;
                // const end = parseBackendDate(element.surgeryEndTime);

                const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                // const surgeryEndTime = end ? end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
                const surgeryEndTime = end && !isNaN(end.getTime()) ? end.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '';

                this.Chargelist.push(
                    {
                        surgeryCategoryName: element.surgeryCategoryName,
                        surgeryCategoryId: element.surgeryCategoryId,
                        surgeryId: element.surgeryId,//
                        surgeryName: element.surgeryName,
                        surgeryPart: element.surgeryPart,
                        // surgeryDuration: element.surgeryDuration,            
                        surgeryDuration: Number(element.surgeryDuration).toFixed(2),
                        surgeryFromTime: surgeryFromTime,
                        surgeryEndTime: surgeryEndTime,
                        isPrimary: String(element.isPrimary),
                        surgeonId: element.surgeonId,//
                        surgeonName: element.surgeonName,
                        anestheticsId: element.anesthetistId, //
                        anestheticsName: element.anestheticsName,
                    });
            })
            this.dssurgeryDetailList.data = this.Chargelist
            console.log("surgeryDet Data:", this.dssurgeryDetailList.data)
        });
    }

    FetchotRequestList1: any = [];
    getRequestAttendentDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvRequestAttendentList(m_data2).subscribe(records => {
            this.FetchotRequestList1 = records.data as OtReqInsert[];
            this.FetchotRequestList1.forEach(element => {

                this.Chargelist1.push(
                    {
                        doctorTypeId: element.doctorTypeId,//
                        doctorType: element.doctorType,
                        doctorId: element.doctorId, //
                        doctorName: element.doctorName,
                    });
            })
            this.dsattendentDetailList.data = this.Chargelist1
            console.log("attendentDet Data:", this.dsattendentDetailList.data)
        });
    }
    getotReqdiagnosisList(obj) {
        this.addDiagnolist = [];
        this.AllTypeDescription = [];

        const vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvotReqdiagnosisList(vdata).subscribe(response => {

            if (response && Array.isArray(response.data)) {
                this.RtrvDescriptionList = response.data;
                // Process Diagnosis
                const Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
                if (Diagnosis.length > 0) {
                    Diagnosis.forEach(element => {
                        this.addDiagnolist.push(
                            {
                                otrequestDiagnosisDetId: element.otrequestDiagnosisDetId,
                                descriptionName: element.descriptionName
                            }
                        )
                    })
                    this.reservationForm.get('diagnosis').setValue(this.addDiagnolist);
                    console.log("DIAGNOSIS DATA:", this.reservationForm.get('diagnosis').value)
                }
            }
        });
    }
    /////////////////////////////// ot request detail part /////////////////////////////

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
        // console.log(this.dateTimeObj)
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

    selectChangeDiagnosis(selectedChips: string[]) {
        this.addDiagnolist = selectedChips;
        this.reservationForm.get('diagnosis')?.setValue(this.addDiagnolist);
    }

    getSelectedObjIP(obj) {
        if ((obj.regID ?? 0) > 0) {
            this.registerObj1 = obj
            console.log("Admitted patient:", this.registerObj1)
            this.vRegNo = obj.regNo
            this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
            this.vIPDNo = obj.ipdNo
            this.opIpId = obj.admissionID;
        }
    }

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

    isDischarge: any;
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

    vCheckBox: boolean = false;
    getDischargedList(event) {
        if (event.checked == true) {
            this.vCheckBox = true;
            this.reservationForm.get('opiptype')?.setValue('IP');
            this.patientInfoReset()
        }
        else {
            this.vCheckBox = false;
            this.patientInfoReset();
        }
        // this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    }

    selectChangeSurgeryCategory(obj: any) {
        this.surgCategoryName = obj.text

        this._OtReservationService.getSurgerynameBySurgeryType(obj.value).subscribe((data: any) => {
            debugger
            this.ddlSurgeryName.options = data;
            this.ddlSurgeryName.bindGridAutoComplete();
        });
    }
    selectChangeSurgery(obj: any) {
        this.surgName = obj.surgeryName
        // this.reservationForm.get('surgeryDuration')?.setValue(obj.totalDuration);
        // this.ddlSurgerytype.SetSelection(obj.siteDescId);
        // setTimeout(() => {
        //     this._OtReservationService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
        //         this.surgCategoryName = response.siteDescriptionName;
        //         console.log("Get siteDisc Data:", this.surgCategoryName)
        //     });
        // }, 100);
    }
    selectChangeSurgeon(obj: any) {
        this.surgeonName = obj.text
    }

    selectChangeAnesth(obj: any) {
        this.AnthName = obj.text
    }
    selectChangeanesthesiaType(obj: any) {
        this.doctorType = obj.text
    }
    selectChangedoctor(obj: any) {
        this.AnthName1 = obj.text
    }
    onChangeOtTable(e) {
        this.ddlLocation.SetSelection(e.locationId);
    }

    getdiagnosisList(obj) {
        this.addDiagnolist = [];
        this.AllTypeDescription = [];

        const vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "OTReservationId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvdiagnosisList(vdata).subscribe(response => {

            if (response && Array.isArray(response.data)) {
                this.RtrvDescriptionList = response.data;
                // Process Diagnosis
                const Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
                if (Diagnosis.length > 0) {
                    Diagnosis.forEach(element => {
                        this.addDiagnolist.push(
                            {
                                otreservationDiagnosisDetId: element.otreservationDiagnosisDetId,
                                descriptionName: element.descriptionName
                            }
                        )
                    })
                    this.reservationForm.get('diagnosis').setValue(this.addDiagnolist);
                    console.log("DIAGNOSIS DATA:", this.reservationForm.get('diagnosis').value)
                }
            }
        });
    }

    opstartTime: any;
    opendTime: any;
    optime: any;

    calculateToTime() {
        const duration = this.reservationForm.get('surgeryDuration')?.value;
        const start = this.reservationForm.get('surgeryFromTime')?.value;

        if (!start || duration === null) return;

        // split duration 1.30 → ["1","30"]
        const parts = duration.toString().split('.');
        const hrs = Number(parts[0]);  // before decimal
        const mins = parts[1] ? Number(parts[1].padEnd(2, '0')) : 0; // after decimal as minutes

        const [h, m] = start.split(':').map(Number);

        const startDate = new Date();
        startDate.setHours(h, m, 0);

        // Add hours + minutes
        startDate.setHours(startDate.getHours() + hrs);
        startDate.setMinutes(startDate.getMinutes() + mins);

        const endH = startDate.getHours().toString().padStart(2, '0');
        const endM = startDate.getMinutes().toString().padStart(2, '0');

        this.reservationForm.get('surgeryEndTime')?.setValue(`${endH}:${endM}`);
    }

    onChangeTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opstartTime = time
        this.reservationForm.get('estimateTime')?.setValue(time, { emitEvent: false });
    }

    onChangeDuration(event: any) {
        // debugger
        const durationHours = parseFloat(this.reservationForm.get('surgeryDuration')?.value); // e.g. 1.5
        const startTime = this.reservationForm.get('surgeryFromTime')?.value; // "HH:mm"

        if (durationHours && startTime) {
            const [sh, sm] = startTime.split(':').map(Number);

            const startMinutes = sh * 60 + sm;
            const durationMinutes = Math.round(durationHours * 60);

            const endMinutes = startMinutes + durationMinutes;
            const eh = Math.floor(endMinutes / 60) % 24;
            const em = endMinutes % 60;

            const endTime = `${this.pad(eh)}:${this.pad(em)}`;
            this.reservationForm.get('surgeryEndTime')?.setValue(endTime);
        }
    }

    onChangeTimefrom(event: any) {
        const duration = this.reservationForm.get('surgeryDuration')?.value;
        const startTime = this.reservationForm.get('surgeryFromTime')?.value;

        if (duration) {
            this.onChangeDuration(null); // reuse logic for calculating end time
        } else {
            const endTime = this.reservationForm.get('surgeryEndTime')?.value;
            if (endTime) {
                this.calculateDuration(startTime, endTime);
            }
        }
    }

    onChangeTimeto(event: any) {
        const startTime = this.reservationForm.get('surgeryFromTime')?.value;
        const endTime = this.reservationForm.get('surgeryEndTime')?.value;

        if (startTime && endTime) {
            this.calculateDuration(startTime, endTime);
        }
    }

    calculateDuration(startTime: string, endTime: string) {
        debugger
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        let durationMinutes = endMinutes - startMinutes;
        if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

        const dh = Math.floor(durationMinutes / 60);
        const dm = durationMinutes % 60;

        const duration = `${this.pad(dh)}:${this.pad(dm)}`;
        this.reservationForm.get('surgeryDuration')?.setValue(duration);
    }

    pad(num: number): string {
        return num.toString().padStart(2, '0');
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

    /////////////////////////////// surgery detail part /////////////////////////////
    getCurrentTime(): string {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    parseDurationToMinutes(duration: any): number {
        if (!duration) return 0;
        const parts = duration.toString().split('.');
        const hrs = Number(parts[0]) || 0;
        const mins = parts[1] ? Number(parts[1].padEnd(2, '0')) : 0;
        return hrs * 60 + mins;
    }

    // Helper: convert total minutes back to "H.MM" format
    minutesToDurationFormat(totalMinutes: number): string {
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${hrs}.${mins.toString().padStart(2, '0')}`;
    }

    remainingTime: string = '00.00';
    onAdd() {

        if (!this.reservationForm.get("surgeryCategoryId")?.value) {
            this.toastr.warning('Please select a surgery Type', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeryId")?.value || this.reservationForm.get("surgeryId")?.value == "0") {
            this.toastr.warning('Please select a Surgery', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeryPart")?.value) {
            this.toastr.warning('Please select a Surgery Part', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeryDuration")?.value) {
            this.toastr.warning('Please enter Duration', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeryFromTime")?.value) {
            this.toastr.warning('Please enter From time', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeryEndTime")?.value) {
            this.toastr.warning('Please enter To time', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("surgeonId")?.value || this.reservationForm.get("surgeonId")?.value == "0") {
            this.toastr.warning('Please select a Surgeon', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (!this.reservationForm.get("anesthetistId")?.value || this.reservationForm.get("anesthetistId")?.value == "0") {
            this.AnthName = ""
        }
        const selectedPrimary = this.reservationForm.get('isPrimary').value;
        const alreadyHasPrimary = this.dssurgeryDetailList.data.some(x => x.isPrimary === "true" || x.isPrimary === true);
        if (selectedPrimary && alreadyHasPrimary) {
            this.toastr.warning("Primary surgery already added. You can only select one primary.");
            return;
        }

        const newEntry = {
            surgeryCategoryName: this.surgCategoryName,
            surgeryCategoryId: this.reservationForm.get('surgeryCategoryId').value,
            surgeryId: this.reservationForm.get('surgeryId').value,
            surgeryName: this.surgName,
            surgeryPart: this.reservationForm.get('surgeryPart').value,
            surgeryDuration: this.reservationForm.get('surgeryDuration').value,
            surgeryFromTime: this.reservationForm.get('surgeryFromTime').value,
            surgeryEndTime: this.reservationForm.get('surgeryEndTime').value,
            isPrimary: String(this.reservationForm.get('isPrimary').value),
            surgeonId: this.reservationForm.get('surgeonId').value,
            surgeonName: this.surgeonName,
            anestheticsId: this.reservationForm.get('anesthetistId').value,
            anestheticsName: this.AnthName,
        };

        debugger
        // --- Check BEFORE adding: will this entry push total over the estimate? ---
        const existingMinutes = this.Chargelist.reduce((sum, row, idx) => {
            // if editing, exclude the row being replaced from the existing total
            if (this.editIndex !== null && idx === this.editIndex) return sum;
            return sum + this.parseDurationToMinutes(row.surgeryDuration);
        }, 0);

        const newRowMinutes = this.parseDurationToMinutes(newEntry.surgeryDuration);
        const totalMinutes = existingMinutes + newRowMinutes;

        const currentEstimate = this.reservationForm.get('estimateTime')?.value;
        const currentEstimateMinutes = this.parseDurationToMinutes(currentEstimate);

        if (totalMinutes > currentEstimateMinutes) {
            const newEstimate = this.minutesToDurationFormat(totalMinutes);

            Swal.fire({
                title: 'Estimate time exceeded',
                text: `Total duration (${newEstimate}) exceeds the current estimate (${currentEstimate || '00.00'}). Do you want to change the estimate time automatically?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it',
                cancelButtonText: 'No, I will change it manually'
            }).then((result) => {
                if (result.isConfirmed) {
                    // YES: auto-update estimate, then add the entry
                    this.reservationForm.get('estimateTime')?.setValue(newEstimate, { emitEvent: false });
                    this.finalizeAdd(newEntry);
                } else {
                    // NO: don't touch estimate automatically, just inform the user
                    this.toastr.warning("Please change the estimate hours manually.");
                    // this.finalizeAdd(newEntry);
                }
            });
        } else {
            // Within estimate, add directly
            this.finalizeAdd(newEntry);
        }
    }

    // Pushes/updates the row, refreshes tables, recalculates remaining time, and resets the form
    private finalizeAdd(newEntry: any) {
        debugger
        if (this.editIndex !== null) {
            this.Chargelist[this.editIndex] = newEntry;
            this.editIndex = null;
        } else {
            this.Chargelist.push(newEntry);
        }
        this.dssurgeryDetailList.data = [...this.Chargelist];
        this.dsattendentDetailList.data = [...this.Chargelist1];

        // Recalculate remaining time = estimateTime - sum of all durations
        this.updateRemainingTime();

        this.reservationForm.patchValue({
            surgeryCategoryId: '',
            surgeryId: '',
            surgeryPart: '',
            surgeryDuration: '',
            surgeryFromTime: '',
            surgeryEndTime: '',
            isPrimary: false,
            surgeonId: '',
            anesthetistId: ''
        });
        this.surgName = '';
        this.surgeonName = '';
        this.AnthName = '';
        this.surgCategoryName = '';
    }

    // Recalculates remaining time = estimateTime - sum of all added durations
    updateRemainingTime() {
        debugger
        const estimateMinutes = this.parseDurationToMinutes(this.reservationForm.get('estimateTime')?.value);
        const totalMinutes = this.Chargelist.reduce((sum, row) => {
            return sum + this.parseDurationToMinutes(row.surgeryDuration);
        }, 0);
        const remainingMinutes = estimateMinutes - totalMinutes;
        this.remainingTime = this.minutesToDurationFormat(Math.max(remainingMinutes, 0));
    }

    // onAdd() {
    //     if (!this.reservationForm.get("surgeryId")?.value || this.reservationForm.get("surgeryId")?.value == "0") {
    //         this.toastr.warning('Please select a Surgery', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (!this.reservationForm.get("surgeryPart")?.value) {
    //         this.toastr.warning('Please select a Surgery Part', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     // if (!this.reservationForm.get("surgeryDuration")?.value) {
    //     //   this.toastr.warning('Please enter Duration', 'Warning !', {
    //     //     toastClass: 'tostr-tost custom-toast-warning',
    //     //   });
    //     //   return;
    //     // }
    //     // if (!this.reservationForm.get("surgeryFromTime")?.value) {
    //     //   this.toastr.warning('Please enter From time', 'Warning !', {
    //     //     toastClass: 'tostr-tost custom-toast-warning',
    //     //   });
    //     //   return;
    //     // }
    //     // if (!this.reservationForm.get("surgeryEndTime")?.value) {
    //     //   this.toastr.warning('Please enter To time', 'Warning !', {
    //     //     toastClass: 'tostr-tost custom-toast-warning',
    //     //   });
    //     //   return;
    //     // }
    //     if (!this.reservationForm.get("surgeonId")?.value || this.reservationForm.get("surgeonId")?.value == "0") {
    //         this.toastr.warning('Please select a Surgeon', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (!this.reservationForm.get("anesthetistId")?.value || this.reservationForm.get("anesthetistId")?.value == "0") {
    //         this.AnthName = ""
    //     }

    //     const selectedPrimary = this.reservationForm.get('isPrimary').value;
    //     const alreadyHasPrimary = this.dssurgeryDetailList.data.some(x => x.isPrimary === "true" || x.isPrimary === true);
    //     if (selectedPrimary && alreadyHasPrimary) {
    //         this.toastr.warning("Primary surgery already added. You can only select one primary.");
    //         return;
    //     }

    //     // let fromTime = this.reservationForm.get('surgeryFromTime')?.value;

    //     // if (!fromTime) {
    //     //   fromTime = this.getCurrentTime();
    //     //   this.reservationForm.patchValue({
    //     //     surgeryFromTime: fromTime
    //     //   });
    //     // }
    //     debugger
    //     let fromTime = this.reservationForm.get('surgeryFromTime')?.value;

    //     if (!fromTime) {
    //         fromTime = this.getCurrentTime();
    //         this.reservationForm.patchValue({ surgeryFromTime: fromTime });
    //     }

    //     this.calculateToTime();

    //     const endTime = this.reservationForm.get('surgeryEndTime')?.value;

    //     if (!endTime) {
    //         this.toastr.warning('Unable to calculate surgery end time');
    //         return;
    //     }

    //     const newEntry = {
    //         surgeryCategoryName: this.surgCategoryName,
    //         surgeryCategoryId: this.reservationForm.get('surgeryCategoryId').value,
    //         surgeryId: this.reservationForm.get('surgeryId').value,//
    //         surgeryName: this.surgName,
    //         surgeryPart: this.reservationForm.get('surgeryPart').value,
    //         surgeryDuration: this.reservationForm.get('surgeryDuration').value,
    //         // surgeryFromTime: this.reservationForm.get('surgeryFromTime').value,
    //         surgeryFromTime: fromTime,
    //         surgeryEndTime: this.reservationForm.get('surgeryEndTime').value,
    //         isPrimary: String(this.reservationForm.get('isPrimary').value),
    //         surgeonId: this.reservationForm.get('surgeonId').value,//
    //         surgeonName: this.surgeonName,
    //         anestheticsId: this.reservationForm.get('anesthetistId').value, //
    //         anestheticsName: this.AnthName,
    //     };
    //     // this.Chargelist.push(newEntry);
    //     if (this.editIndex !== null) {
    //         this.Chargelist[this.editIndex] = newEntry;
    //         this.editIndex = null;
    //     } else {
    //         this.Chargelist.push(newEntry);
    //     }
    //     this.dssurgeryDetailList.data = [...this.Chargelist];

    //     //  Also add surgeon & anesthetist to second table (attendants) ---
    //     // if (this.surgeonName) {
    //     //   let surgeonEntry = {
    //     //     doctorTypeId: null,
    //     //     doctorType: "Surgeon",
    //     //     doctorId: newEntry.surgeonId,
    //     //     doctorName: this.surgeonName
    //     //   };
    //     //   this.Chargelist1.push(surgeonEntry);
    //     // }

    //     // if (this.AnthName) {
    //     //   let anesthetistEntry = {
    //     //     doctorTypeId: null,
    //     //     doctorType: "Anesthetist",
    //     //     doctorId: newEntry.anestheticsId,
    //     //     doctorName: this.AnthName
    //     //   };
    //     //   this.Chargelist1.push(anesthetistEntry);
    //     // }

    //     this.dsattendentDetailList.data = [...this.Chargelist1];

    //     // --- NEW: sum all row durations and compare against estimateTime ---
    //     const totalMinutes = this.Chargelist.reduce((sum, row) => {
    //         return sum + this.parseDurationToMinutes(row.surgeryDuration);
    //     }, 0);

    //     const currentEstimate = this.reservationForm.get('estimateTime')?.value;
    //     const currentEstimateMinutes = this.parseDurationToMinutes(currentEstimate);

    //     if (totalMinutes > currentEstimateMinutes) {
    //         const newEstimate = this.minutesToDurationFormat(totalMinutes);
    //         this.reservationForm.get('estimateTime')?.setValue(newEstimate, { emitEvent: false });
    //     }
    //     // else: estimateTime remains unchanged
    //     // --- END NEW ---

    //     this.reservationForm.patchValue({
    //         surgeryCategoryId: '',
    //         surgeryId: '',
    //         surgeryPart: '',
    //         surgeryDuration: '',
    //         surgeryFromTime: '',
    //         surgeryEndTime: '',
    //         isPrimary: false,
    //         surgeonId: '',
    //         anesthetistId: ''
    //     });

    //     this.surgName = '';
    //     this.surgeonName = '';
    //     this.AnthName = '';
    //     this.surgCategoryName = '';
    // }

    deleteTableRow(event, element) {
        const index = this.Chargelist.indexOf(element);
        if (index >= 0) {
            this.Chargelist.splice(index, 1);
            this.dssurgeryDetailList.data = [];
            this.dssurgeryDetailList.data = this.Chargelist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    onEdit(contact: any) {
        // debugger
        console.log("Editing row:", contact);
        this.reservationForm.patchValue({
            surgeryCategoryId: contact.surgeryCategoryId ?? '',
            surgeryId: contact.surgeryId ?? '',
            surgeryPart: contact.surgeryPart ?? '',
            surgeryDuration: contact.surgeryDuration ?? '',
            surgeryFromTime: contact.surgeryFromTime ?? '',
            surgeryEndTime: contact.surgeryEndTime ?? '',
            isPrimary: contact.isPrimary === "true",
            surgeonId: contact.surgeonId ?? '',
            anesthetistId: contact.anestheticsId ?? ''
        });

        setTimeout(() => {
            this._OtReservationService.getSurgerynameBySurgeryType(contact.surgeryCategoryId).subscribe((data: any) => {
                this.ddlSurgeryName.options = data;
                this.ddlSurgeryName.bindGridAutoComplete();
            });
        }, 500);
        this.reservationForm.get("surgeryId")?.setValue(contact.surgeryId)

        this.surgName = contact.surgeryName ?? '';
        this.surgCategoryName = contact.surgeryCategoryName ?? '';
        this.surgeonName = contact.surgeonName ?? '';
        this.AnthName = contact.anestheticsName ?? '';

        const index = this.Chargelist.indexOf(contact);
        if (index > -1) {
            this.Chargelist.splice(index, 1);
            this.dssurgeryDetailList.data = [...this.Chargelist];
        }
    }

    drop1(event: CdkDragDrop<any[]>) {
        const data = this.dssurgeryDetailList.data; // Extract raw array from MatTableDataSource
        moveItemInArray(data, event.previousIndex, event.currentIndex);
        this.dssurgeryDetailList.data = data; // Update table with reordered data
    }
    @ViewChild(CdkScrollable, { static: true }) scrollable1!: CdkScrollable;
    onDragMoved1(event: CdkDragMove) {
        const scrollContainer = this.scrollable1.getElementRef().nativeElement;
        const scrollRect = scrollContainer.getBoundingClientRect();
        const pointerY = event.pointerPosition.y;

        const edgeMargin = 60; // px from top/bottom where scrolling starts
        const scrollSpeed = 40; // 🔥 increase for faster scrolling

        if (pointerY < scrollRect.top + edgeMargin) {
            scrollContainer.scrollTop -= scrollSpeed;
        } else if (pointerY > scrollRect.bottom - edgeMargin) {
            scrollContainer.scrollTop += scrollSpeed;
        }
    }

    convertToISOFormat(dateStr: string): string {
        // convert in to "2025-11-15T02:01:00"
        const [datePart, timePart] = dateStr.split(" ");
        const [DD, MM, YYYY] = datePart.split("-");
        return `${YYYY}-${MM}-${DD}T${timePart}`;
    }

    FetchList: any = [];
    getReservationSurgeryDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTReservationId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
            this.FetchList = records.data as OtReserInsert[];
            this.FetchList.forEach(element => {

                // const fromISO = this.convertToISOFormat(element.surgeryFromTime);
                // const endISO = this.convertToISOFormat(element.surgeryEndTime);
                // const from = new Date(fromISO);
                // const end = new Date(endISO);
                const from = element.surgeryFromTime ? new Date(element.surgeryFromTime) : null;
                const end = element.surgeryEndTime ? new Date(element.surgeryEndTime) : null;
                // const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const surgeryFromTime = from && !isNaN(from.getTime()) ? from.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '';
                // const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const surgeryEndTime = end && !isNaN(end.getTime()) ? end.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '';

                this.Chargelist.push(
                    {
                        surgeryCategoryName: element.surgeryCategoryName,
                        surgeryCategoryId: element.surgeryCategoryId,
                        surgeryId: element.surgeryId,//
                        surgeryName: element.surgeryName,
                        surgeryPart: element.surgeryPart,
                        // surgeryDuration: element.surgeryDuration,
                        surgeryDuration: Number(element.surgeryDuration).toFixed(2),
                        surgeryFromTime: surgeryFromTime,
                        surgeryEndTime: surgeryEndTime,
                        // isPrimary: element.isPrimary,            
                        isPrimary: String(element.isPrimary).trim().toLowerCase(),
                        surgeonId: element.surgeonId,//
                        surgeonName: element.surgeonName,
                        anestheticsId: element.anesthetistId, //
                        anestheticsName: element.anestheticsName,
                    });
            })
            this.dssurgeryDetailList.data = this.Chargelist
            console.log("surgeryDet Data:", this.dssurgeryDetailList.data)
        });

    }
    /////////////////////////////// surgery detail part end /////////////////////////////

    /////////////////////////////// attendent detail part /////////////////////////////
    onAdd1() {
        if (!this.reservationForm.get("doctorTypeId")?.value || this.reservationForm.get("doctorTypeId")?.value == "0") {
            this.toastr.warning('Please select a Doctor Type', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.reservationForm.get("doctorId")?.value || this.reservationForm.get("doctorId")?.value == "0") {
            this.toastr.warning('Please select a Doctor', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const newEntry = {
            doctorTypeId: this.reservationForm.get('doctorTypeId').value,//
            doctorType: this.doctorType,
            doctorId: this.reservationForm.get('doctorId').value, //
            doctorName: this.AnthName1,
        };
        // this.Chargelist.push(newEntry);
        if (this.editIndex1 !== null) {
            this.Chargelist1[this.editIndex1] = newEntry;
            this.editIndex1 = null;
        } else {
            this.Chargelist1.push(newEntry);
        }
        this.dsattendentDetailList.data = [...this.Chargelist1];

        this.reservationForm.patchValue({
            recourceType: '',
            doctorTypeId: '',
            doctorId: ''
        });
        this.doctorType = '';
        this.AnthName1 = '';
    }

    deleteTableRow1(event, element) {
        const index = this.Chargelist1.indexOf(element);
        if (index >= 0) {
            this.Chargelist1.splice(index, 1);
            this.dsattendentDetailList.data = [];
            this.dsattendentDetailList.data = this.Chargelist1;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    onEdit1(contact: any) {
        // debugger
        console.log("Editing row:", contact);
        this.reservationForm.patchValue({
            doctorTypeId: contact.doctorTypeId ?? '',
            doctorId: contact.doctorId ?? ''
        });

        this.doctorType = contact.doctorType ?? '';
        this.AnthName1 = contact.doctorName ?? '';

        const index = this.Chargelist1.indexOf(contact);
        if (index > -1) {
            this.Chargelist1.splice(index, 1);
            this.dsattendentDetailList.data = [...this.Chargelist1];
        }
    }

    selectChangedepdoctorType(obj: any) {
        if (obj.value) {
            this.doctorType = obj.text
            this._OtReservationService.getDoctorsByDoctorType(obj.value).subscribe((data: any[]) => {
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
            });
        }
        // else {
        //   this._OtReservationService.getDoctorsByDoctorType(obj.doctorTypeId).subscribe((data: any[]) => {
        //     debugger
        //     this.ddlDoctor.options = data;
        //     // this.ddlDoctor.bindGridAutoComplete();
        //     const incomingDoctorId = obj.doctorId;
        //     setTimeout(() => {
        //       this.ddlDoctor.bindGridAutoComplete();
        //       if (incomingDoctorId) {
        //         const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
        //         if (matchedDoctor) {
        //           this.reservationForm.get('doctorId')?.setValue(matchedDoctor.value);
        //         }
        //       }
        //     }, 100);
        //   });
        // }
    }

    drop2(event: CdkDragDrop<any[]>) {
        const data = this.dsattendentDetailList.data;
        moveItemInArray(data, event.previousIndex, event.currentIndex);
        this.dsattendentDetailList.data = data; // Update table with reordered data
    }

    @ViewChild(CdkScrollable, { static: true }) scrollable2!: CdkScrollable;
    onDragMoved2(event: CdkDragMove) {
        const scrollContainer = this.scrollable2.getElementRef().nativeElement;
        const scrollRect = scrollContainer.getBoundingClientRect();
        const pointerY = event.pointerPosition.y;

        const edgeMargin = 60; // px from top/bottom where scrolling starts
        const scrollSpeed = 40; // 🔥 increase for faster scrolling

        if (pointerY < scrollRect.top + edgeMargin) {
            scrollContainer.scrollTop -= scrollSpeed;
        } else if (pointerY > scrollRect.bottom - edgeMargin) {
            scrollContainer.scrollTop += scrollSpeed;
        }
    }

    FetchList1: any = [];
    getReservationAttendentDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTReservationId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTReservationId", "fieldValue": String(obj.otReservationId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtReservationService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
            this.FetchList1 = records.data as OtReserInsert[];
            this.FetchList1.forEach(element => {

                this.Chargelist1.push(
                    {
                        doctorTypeId: element.doctorTypeId,//
                        doctorType: element.doctorType,
                        doctorId: element.doctorId, //
                        doctorName: element.doctorName,
                    });
            })
            this.dsattendentDetailList.data = this.Chargelist1
            console.log("attendentDet Data:", this.dsattendentDetailList.data)
        });

    }

    //////////////////// body parts code //////////////////////
    selectedImage: string | null = null;
    uploadedImage: string | null = null;
    penColor: string = '#ff0000';
    penSize: number = 3;

    @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D | null;
    private isDrawing = false;

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.uploadedImage = e.target.result; // Base64 URL
            };
            reader.readAsDataURL(file);
        }
    }

    openEditor(imageSrc: string) {
        this.selectedImage = imageSrc;
        setTimeout(() => this.loadImageOnCanvas(), 0);
    }

    private loadImageOnCanvas() {
        const canvas = this.canvas.nativeElement;
        this.ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = this.selectedImage!;

        img.onload = () => {
            this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        // Remove previous listeners
        canvas.replaceWith(canvas.cloneNode(true));
        const newCanvas = (this.canvas.nativeElement = document.querySelector('canvas')!);
        this.ctx = newCanvas.getContext('2d');
        img.onload = () => {
            this.ctx?.clearRect(0, 0, newCanvas.width, newCanvas.height);
            this.ctx?.drawImage(img, 0, 0, newCanvas.width, newCanvas.height);
        };

        // --- Drawing Events ---
        newCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        newCanvas.addEventListener('mousemove', (e) => this.draw(e));
        newCanvas.addEventListener('mouseup', () => this.stopDrawing());
        newCanvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    private startDrawing(event: MouseEvent) {
        this.isDrawing = true;
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        this.ctx?.beginPath();
        this.ctx?.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    }

    private draw(event: MouseEvent) {
        if (!this.isDrawing || !this.ctx) return;
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.ctx.lineWidth = this.penSize;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.penColor;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    private stopDrawing() {
        if (!this.ctx) return;
        this.isDrawing = false;
        this.ctx.closePath();
    }

    saveMarkedImage() {
        const canvas = this.canvas.nativeElement;
        const markedImage = canvas.toDataURL('image/png');
        console.log(markedImage)
        const link = document.createElement('a');
        // link.download = 'marked-body.png';
        // link.href = markedImage;
        // link.click();
    }

    closeEditor() {
        this.selectedImage = null;
    }

    clearCanvas() {
        const canvas = this.canvas.nativeElement;
        const img = new Image();
        img.src = this.selectedImage!;
        img.onload = () => {
            this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }

    deleteUploadedImage(): void {
        this.uploadedImage = null;
    }

    /////////////////// body parts code end ///////////////////
    /////////////////////////////// attendent detail part end/////////////////////////////

    onSubmit() {

        const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
        const formattedTime = formattedDate + this.dateTimeObj.time;

        // const surgeryDate = this.datePipe.transform(this.reservationForm.get('surgeryDate')?.value, 'yyyy-MM-dd');
        // const time = this.reservationForm.get('estimateTime')?.value;
        // if (surgeryDate && time) {
        //   const combinedDateTime = `${surgeryDate} ${time}`;
        //   this.reservationForm.get('estimateTime')?.setValue(combinedDateTime, { emitEvent: false });
        // }
        debugger
        this.reservationForm.get('opipid').setValue(this.opIpId);
        this.reservationForm.get('otrequestId')?.setValue(this.vrequestId || 0);
        this.reservationForm.get('otreservationDate').setValue(formattedDate);
        this.reservationForm.get('otreservationTime').setValue(formattedTime);
        this.reservationForm.get('surgeryDate')?.setValue(this.datePipe.transform(this.reservationForm.get('surgeryDate')?.value, 'yyyy-MM-dd'));

        if (this.addDiagnolist.length > 0) {
            this.addDiagnolist.forEach(element => {
                this.AllTypeDescription.push({
                    descriptionName: element.descriptionName,
                    descriptionType: "Diagnosis"
                });
            });
        }

        if (!this.reservationForm.invalid) {
            debugger
            if (this.dssurgeryDetailList.data.length === 0) {
                this.toastr.warning('Data is not available in list ,please add surgery details in the list.', 'Warning');
                return;
            }

            this.reservationForm.get('otrequestId')?.setValue(this.vrequestId ?? 0);
            this.reservationForm.get('otreservationId')?.setValue(this.vreservationId ?? 0);
            if (this.isDischarge == 1) {
                this.reservationForm.get('opiptype')?.setValue('1');
            } else {
                this.reservationForm.get('opiptype')?.setValue(this.reservationForm.get('opiptype')?.value === 'IP' ? '1' : '0');
            }
            this.reservationForm.get('reservationType')?.setValue(this.reservationForm.get('reservationType')?.value === '1' ? true : false);
            this.reservationForm.get('pacrequired')?.setValue(this.reservationForm.get('pacrequired')?.value === '1' ? true : false);
            this.reservationForm.get('equipmentsRequired')?.setValue(this.reservationForm.get('equipmentsRequired')?.value === '1' ? true : false);
            this.reservationForm.get('infective')?.setValue(this.reservationForm.get('infective')?.value === '1' ? true : false);

            this.reqSurgeryArray.clear();
            this.dssurgeryDetailList.data.forEach(item => {
                this.reqSurgeryArray.push(this.createReservationSurgeryArrayForm(item));
            });

            this.reqAttendingArray.clear();
            this.dsattendentDetailList.data.forEach(item => {
                this.reqAttendingArray.push(this.createReservationAttendentArrayForm(item));
            });

            this.reservationDignosisArray.clear();
            this.AllTypeDescription.forEach(item => {
                this.reservationDignosisArray.push(this.createReservationDignosis(item));
            });

            this.reservationDignosisArray.clear();
            if (this.AllTypeDescription.length === 0) {
                const reservationDiagnosisForm: FormGroup = this.createReservationDignosis({});
                this.reservationDignosisArray.push(reservationDiagnosisForm);
            } else {
                this.AllTypeDescription.forEach(element => {
                    const reservationDiagnosisForm: FormGroup = this.createReservationDignosis(element);
                    this.reservationDignosisArray.push(reservationDiagnosisForm);
                });
            }

            const formValue = { ...this.reservationForm.value };
            const controlsToRemove = ['TheaterLocation', 'bodyPartId', 'surgeryCategoryId', 'surgeryId', 'surgeryPart', 'surgeryFromTime', 'surgeryEndTime', 'surgeryDuration', 'isPrimary',
                'surgeonId', 'anesthetistId', 'recourceType', 'doctorTypeId', 'doctorId', 'diagnosis', 'IsDischargedit'];
            controlsToRemove.forEach(key => delete formValue[key]);

            console.log(formValue)

            this._OtReservationService.reservationSave(formValue).subscribe((response) => {
                this.OnPrint(response)
                this.onClear(true);
            });
        } else {
            const invalidFields: string[] = [];

            const validateFormGroup = (formGroup: FormGroup | FormArray, parentKey: string = '') => {
                Object.keys(formGroup.controls).forEach(key => {
                    const control = formGroup.get(key);
                    const fieldKey = parentKey ? `${parentKey}.${key}` : key;

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        validateFormGroup(control, fieldKey);
                    } else {
                        if (control?.invalid) {
                            invalidFields.push(fieldKey);
                        }
                    }
                });
            };
            validateFormGroup(this.reservationForm);
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
                });
                return;
            }
        }
    }

    onOTReservation(): void {
        const dialogRef = this._matDialog.open(OtrequestlistComponent, {
            width: '80%',
            height: '80%',
            panelClass: 'custom-dialog'
        });
        dialogRef.afterClosed().subscribe(selectedData => {
            console.log("Back Side data:", selectedData)
            if (selectedData) {
                this.registerObj1 = selectedData

                this.vRegNo = selectedData.regNo
                this.vOPDNo = selectedData.opdNo
                this.vIPDNo = selectedData.ipdNo
                this.vPatientName = selectedData.patientName
                this.opIpId = selectedData.opIpId
                this.opIpType = selectedData.opIpType
                if (selectedData.opIpType == 0) {
                    this.vSelectedOption = "OP"
                }
                else {
                    this.vSelectedOption = "IP"
                }
                // this.votbookingId = selectedData.otBookingId

                if (selectedData?.otreservationTime) {
                    const date = new Date(selectedData.otreservationTime);
                    if (!isNaN(date.getTime())) {
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');

                        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

                        setTimeout(() => {
                            this.reservationForm.get('opstartTime')?.setValue(formattedTime);
                        });
                    }
                }

                this.reservationForm.patchValue({
                    surgeonId: selectedData.surgeonId,
                    surgeryId: selectedData.surgeryId,
                });
            }
        });
    }

    OnPrint(Param) {
        const opip = this.opIpType == true ? 1 : 0
        const param = {
            searchFields: [
                {
                    fieldName: "OTReservationId",
                    fieldValue: String(Param),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(opip),
                    opType: "Equals"
                }
            ],
            mode: "OTReservation"
        };

        console.log(param);

        this._OtReservationService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "OtReservation Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
    }

    getValidationMessages() {
        return {
            SurgeryName: [
                { name: "required", Message: "Surgery Name is required" },
                { name: "maxlength", Message: "Surgery Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            SurgeronName1: [
                { name: "required", Message: "Surgeron Name 1 is required" },
                { name: "maxlength", Message: "Surgeron Name 1 should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            SurgeronName2: [
                { name: "required", Message: "Surgeron Name 2 is required" },
                { name: "maxlength", Message: "Country Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            anesthetistId: [
                { name: "required", Message: "Anathesia doctor 1 Name is required" },
                { name: "maxlength", Message: "Anathesia doctor 1 Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            Anathesiadoctor2: [
                { name: "required", Message: "Anathesia doctor 2 Name is required" },
                { name: "maxlength", Message: "Anathesia doctor 2 Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            OTTable: [
                { name: "required", Message: "OT Table Name is required" },
                { name: "maxlength", Message: "OT Table Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            AnathesiaType: [
                { name: "required", Message: "Anathesia Type is required" },
                { name: "maxlength", Message: "Anathesia Type should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
        };
    }
    onClose() {
        this.ref.close();
    }
    onClear(val: boolean) {
        this.reservationForm.reset();
        this.dialogRef.close(val);
    }

    onEnterKey(event: KeyboardEvent) {
        event.preventDefault();

        const form = (event.target as HTMLElement).closest('form');
        if (!form) return;

        const focusable = Array.from(
            form.querySelectorAll<HTMLElement>(
                'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.hasAttribute('disabled') && !el.hasAttribute('readonly'));

        const index = focusable.indexOf(event.target as HTMLElement);
        if (index > -1 && index < focusable.length - 1) {
            focusable[index + 1].focus();
        }
    }

}





