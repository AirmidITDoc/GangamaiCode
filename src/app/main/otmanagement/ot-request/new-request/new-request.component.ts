import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { OtReqInsert } from '../ot-request.component';
import { OtRequestService } from '../ot-request.service';

@Component({
    selector: 'app-new-request',
    templateUrl: './new-request.component.html',
    styleUrls: ['./new-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
    requestForm: FormGroup;
    requestSurgeryForm: FormGroup;
    requestAttendentForm: FormGroup;
    requestDiagnosisForm: FormGroup;

    vSelectedOption: any = "OP";
    vrequestType: any = "1";
    vpacrequired: any = "1";
    vequipmentsRequired: any = "1";
    vinfective: any = "1";

    isActive: boolean = true;
    autocompleteModeDepartment: string = "Department";
    autocompleteModeSiteDescription: string = "SiteDescription";
    autocompleteModeSurgeryCategory: string = "OttypeMaster";
    // autocompleteModeSurgeryCategory: String = "SurgeryCategory";
    autocompleteModeDoctorSurgeon: string = "DoctorSurgion";
    autocompleteModeSurgeryMaster: string = "SurgeryMaster";
    autocompleteModeDoctorType: string = "DoctorType";
    autocompleteModeConDoctor: string = "ConDoctor";
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeOTTable: string = "OttableMaster";
    autocompleteModeLocation: string = "Location";
    autocompleteModeResourseType: string = "ResourcesTypes";
    autocompleteModebloodGroup: string = "BloodGroupTypes";

    vRegNo: any;
    vPatientName: any;
    vrequestId: any;
    vOPDNo: any;
    vIPDNo: any;
    screenFromString = 'Common-form';
    opIpId: any;
    surgCategoryName: any;
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
    AllTypeDescription: any = []

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

    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    opIpType: number;
    RegId: string;
    // registerObj: any;
    registerObj1 = new OtReqInsert({});
    registerObj2 = new OtReqInsert({});
    partTypes: string[] = ["Left", "Middle", "Right"];

    dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
    dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
    Chargelist: any[] = [];
    Chargelist1: any[] = [];
    RtrvDescriptionList: any = [];
    @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
    @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;

    constructor(public _OtRequestService: OtRequestService,
        public dialogRef: MatDialogRef<NewRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        private ref: MatDialogRef<NewRequestComponent>,
        public datePipe: DatePipe,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService) { }


    ngOnInit(): void {
        this.requestForm = this.createRequestForm();
        this.requestForm.markAllAsTouched();

        this.requestSurgeryForm = this.createRequestSurgeryArrayForm();
        this.reqSurgeryArray.push(this.createRequestSurgeryArrayForm())

        this.requestAttendentForm = this.createRequestAttendentArrayForm();
        this.reqAttendingArray.push(this.createRequestAttendentArrayForm())

        this.requestDiagnosisForm = this.createRequestDignosis();
        this.requestDignosisArray.push(this.createRequestDignosis())

        if ((this.data?.otrequestId) > 0) {
            this.registerObj1 = this.data

            this.vRegNo = this.registerObj1.regNo
            this.vOPDNo = this.registerObj1.opdNo
            this.vIPDNo = this.registerObj1.opdNo
            this.vPatientName = this.registerObj1.patientName
            this.opIpType = this.registerObj1.opiptype

            setTimeout(() => {
                this._OtRequestService.getotTableById(this.data.ottable).subscribe((response) => {
                    this.registerObj2 = response;
                    console.log("Get ottable Data:", this.registerObj2)
                    this.ddlLocation.SetSelection(this.registerObj2.locationId);
                });
            }, 500);

            setTimeout(() => {
                this._OtRequestService.getotRequestById(this.data.otrequestId).subscribe((response) => {
                    this.registerObj2 = response;
                    console.log("Get Data:", this.registerObj2)
                    this.vrequestId = this.registerObj2.otrequestId
                    this.opIpId = this.registerObj2.opipid
                    this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
                    this.vrequestType = this.registerObj2.requestType == true ? '1' : '0';
                    this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
                    this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
                    this.vinfective = this.registerObj2.infective == true ? '1' : '0';
                });
            }, 500);

            // if (this.registerObj1?.estimateTime) {
            //     const date = new Date(this.registerObj1.estimateTime);

            //     if (!isNaN(date.getTime())) {
            //         const hours = date.getHours().toString().padStart(2, '0');
            //         const minutes = date.getMinutes().toString().padStart(2, '0');

            //         const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

            //         setTimeout(() => {
            //             this.requestForm.get('estimateTime')?.setValue(formattedTime);
            //         });
            //         console.log("Control value after patch:", this.requestForm.get('estimateTime')?.value);
            //     }
            // }

            console.log("Data:", this.registerObj1)
            this.requestForm.patchValue(this.registerObj1);
            // this.requestForm.get('estimateTime')?.setValue(Number(this.registerObj1.estimateTime).toFixed(2))

            this.selectChangedepdoctorType(this.registerObj1)
            this.getdiagnosisList(this.registerObj1);
            this.getRequestSurgeryDetList(this.registerObj1);
            this.getRequestAttendentDetList(this.registerObj1);
        }
    }

    createRequestForm(): FormGroup {
        return this._formBuilder.group({
            otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otRequestDate: [new Date()],
            otRequestTime: ['', [Validators.required]],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: ["OP"],
            bloodGroup: ['0'],
            categoryType: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ottable: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],  // means location theater
            surgeryDate: [new Date(), [Validators.required]],
            estimateTime: ['', [Validators.required]],//"10:00:00AM",
            diagnosis: [[]],
            comments: [''],
            requestType: ['1'],
            pacrequired: ['1'],
            equipmentsRequired: ['1'],
            clearanceMedical: false,
            clearanceFinancial: false,
            infective: ['1'],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],

            tOtRequestSurgeryDetails: this._formBuilder.array([]),
            tOtRequestAttendingDetails: this._formBuilder.array([]),
            tOtRequestDiagnoses: this._formBuilder.array([]),

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
            bodyPartId: [0]
        });
    }

    createRequestSurgeryArrayForm(element: any = {}, index: number = 0): FormGroup {
        // debugger
        return this._formBuilder.group({
            otrequestSurgeryDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryCategoryId: [element.surgeryCategoryId],
            surgeryId: [element.surgeryId],
            surgeryPart: [element.surgeryPart],
            surgeryFromTime: [element.surgeryFromTime],
            surgeryEndTime: [element.surgeryEndTime],
            surgeryDuration: [element.surgeryDuration],
            isPrimary: [String(element.isPrimary ?? false)],
            surgeonId: [element.surgeonId],
            anesthetistId: [element.anestheticsId],
            seqNo: [index + 1]
        });
    }
    get reqSurgeryArray(): FormArray {
        return this.requestForm.get('tOtRequestSurgeryDetails') as FormArray;
    }

    createRequestAttendentArrayForm(element: any = {}, index: number = 0): FormGroup {
        // debugger
        return this._formBuilder.group({
            otrequestAttendingDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorTypeId: [element.doctorTypeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorId: [element.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            seqNo: [index + 1]
        });
    }
    get reqAttendingArray(): FormArray {
        return this.requestForm.get('tOtRequestAttendingDetails') as FormArray;
    }

    createRequestDignosis(element: any = {}): FormGroup {
        return this._formBuilder.group({
            otrequestDiagnosisDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otrequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
        });
    }
    get requestDignosisArray(): FormArray {
        return this.requestForm.get('tOtRequestDiagnoses') as FormArray;
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

    patientInfoReset() {
        this.requestForm.get('opipid').setValue('');
        this.requestForm.get('opipid').reset();
        this.vRegNo = '';
        this.vPatientName = '';
        this.vIPDNo = '';

        this.registerObj1 = new OtReqInsert({});
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
        console.log(this.dateTimeObj)
    }
    onChangeReg(event) {
        if (event.value == 'OP') {
            this.opIpType = 0;
            this.opIpId = "";
        }
        else if (event.value == 'IP') {
            this.opIpType = 1;
            this.opIpId = "";
        }
        this.patientInfoReset();
    }
    // vTariffName=''
    // vCompanyName=''
    // vWardName=''
    // vBedName=''
    // vRefDocName=''

    getSelectedObjIP(obj) {
        if ((obj.regID ?? 0) > 0) {
            this.registerObj1 = obj
            console.log("Admitted patient:", this.registerObj1)
            this.vRegNo = obj.regNo
            this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
            this.vIPDNo = obj.ipdNo
            this.opIpId = obj.admissionID;
            this.opIpType = 1
            //   this.vTariffName = obj.tariffName
            // this.vCompanyName = obj.companyName
            //   this.vWardName = obj.roomName
            // this.vBedName = obj.bedName
            //  this.vRefDocName = obj.refDocName
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
            this.opIpType = 0
        }
    }

    opstartTime: any;
    onChangeTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opstartTime = time
        this.requestForm.get('estimateTime')?.setValue(time, { emitEvent: false });
    }

    getdiagnosisList(obj) {
        this.addDiagnolist = [];
        this.AllTypeDescription = [];

        const vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj.otrequestId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtRequestService.getRtrvdiagnosisList(vdata).subscribe(response => {

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
                    this.requestForm.get('diagnosis').setValue(this.addDiagnolist);
                    console.log("DIAGNOSIS DATA:", this.requestForm.get('diagnosis').value)
                }
            }
        });

    }

    addDiagnolist: any = [];
    selectChangeDiagnosis(selectedChips: string[]) {
        this.addDiagnolist = selectedChips;
        this.requestForm.get('diagnosis')?.setValue(this.addDiagnolist);
    }

    selectChangeSurgeryCategory(obj: any) {
        this.surgCategoryName = obj.text
    }
    selectChangeSurgery(obj: any) {
        this.surgName = obj.surgeryName
        this.ddlSurgerytype.SetSelection(obj.siteDescId);
        setTimeout(() => {
            this._OtRequestService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
                this.surgCategoryName = response.siteDescriptionName;
                console.log("Get siteDisc Data:", this.surgCategoryName)
            });
        }, 100);
    }
    selectChangeSurgeon(obj: any) {
        this.surgeonName = obj.text
    }
    selectChangeAnesth(obj: any) {
        this.AnthName = obj.text
    }
    selectChangedoctorType(obj: any) {
        this.doctorType = obj.text
    }
    selectChangedoctor(obj: any) {
        this.AnthName1 = obj.text
    }
    onChangeOtTable(e) {
        this.ddlLocation.SetSelection(e.locationId);
    }

    FetchList: any = [];
    getRequestSurgeryDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj.otrequestId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtRequestService.getRtrvRequestSurgeryList(m_data2).subscribe(records => {
            this.FetchList = records.data as OtReqInsert[];
            this.FetchList.forEach(element => {

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
                        surgeryDuration: Number(element.surgeryDuration).toFixed(2),
                        surgeryFromTime: surgeryFromTime,
                        surgeryEndTime: surgeryEndTime,
                        isPrimary: element.isPrimary,
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

    // focusNext(nextId: string) {
    //   setTimeout(() => {
    //     document.getElementById(nextId)?.focus();
    //   }, 0);
    // }

    focusNext(nextId: string) {
        setTimeout(() => {
            const nextElement = document.getElementById(nextId);
            if (nextElement) {
                // Try to focus inner input/select if present
                const inputEl = nextElement.querySelector('input, select, textarea, [tabindex]');
                if (inputEl) {
                    (inputEl as HTMLElement).focus();
                } else {
                    (nextElement as HTMLElement).focus();
                }
            }
        }, 0);
    }

    /////////////////////////////// surgery detail part /////////////////////////////

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

    onAdd() {
        if (!this.requestForm.get("surgeryCategoryId")?.value) {
            this.toastr.warning('Please select a surgery Type', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeryId")?.value || this.requestForm.get("surgeryId")?.value == "0") {
            this.toastr.warning('Please select a Surgery', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeryPart")?.value) {
            this.toastr.warning('Please select a Surgery Part', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeryDuration")?.value) {
            this.toastr.warning('Please enter Duration', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeryFromTime")?.value) {
            this.toastr.warning('Please enter From time', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeryEndTime")?.value) {
            this.toastr.warning('Please enter To time', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("surgeonId")?.value || this.requestForm.get("surgeonId")?.value == "0") {
            this.toastr.warning('Please select a Surgeon', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("anesthetistId")?.value || this.requestForm.get("anesthetistId")?.value == "0") {
            this.AnthName = ""
        }
        // if (!this.requestForm.get("anesthetistId")?.value || this.requestForm.get("anesthetistId")?.value == "0") {
        //   this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        //     toastClass: 'tostr-tost custom-toast-warning',
        //   });
        //   return;
        // }
        // debugger

        const selectedPrimary = this.requestForm.get('isPrimary').value;
        const alreadyHasPrimary = this.dssurgeryDetailList.data.some(x => x.isPrimary === "true" || x.isPrimary === true);
        if (selectedPrimary && alreadyHasPrimary) {
            this.toastr.warning("Primary surgery already added. You can only select one primary.");
            return;
        }
        const newEntry = {
            surgeryCategoryName: this.surgCategoryName,
            surgeryCategoryId: this.requestForm.get('surgeryCategoryId').value,
            surgeryId: this.requestForm.get('surgeryId').value,//
            surgeryName: this.surgName,
            surgeryPart: this.requestForm.get('surgeryPart').value,
            surgeryDuration: this.requestForm.get('surgeryDuration').value,
            surgeryFromTime: this.requestForm.get('surgeryFromTime').value,
            surgeryEndTime: this.requestForm.get('surgeryEndTime').value,
            isPrimary: String(this.requestForm.get('isPrimary').value),
            surgeonId: this.requestForm.get('surgeonId').value,//
            surgeonName: this.surgeonName,
            anestheticsId: this.requestForm.get('anesthetistId').value, //
            anestheticsName: this.AnthName,
        };
        // this.Chargelist.push(newEntry);
        if (this.editIndex !== null) {
            this.Chargelist[this.editIndex] = newEntry;
            this.editIndex = null;
        } else {
            this.Chargelist.push(newEntry);
        }
        this.dssurgeryDetailList.data = [...this.Chargelist];

        //  Also add surgeon & anesthetist to second table (attendants) ---
        // if (this.surgeonName) {
        //   let surgeonEntry = {
        //     doctorTypeId: null,
        //     doctorType: "Surgeon",
        //     doctorId: newEntry.surgeonId,
        //     doctorName: this.surgeonName
        //   };
        //   this.Chargelist1.push(surgeonEntry);
        // }

        // if (this.AnthName) {
        //   let anesthetistEntry = {
        //     doctorTypeId: null,
        //     doctorType: "Anesthetist",
        //     doctorId: newEntry.anestheticsId,
        //     doctorName: this.AnthName
        //   };
        //   this.Chargelist1.push(anesthetistEntry);
        // }

        this.dsattendentDetailList.data = [...this.Chargelist1];

        // --- NEW: sum all row durations and compare against estimateTime ---
        const totalMinutes = this.Chargelist.reduce((sum, row) => {
            return sum + this.parseDurationToMinutes(row.surgeryDuration);
        }, 0);

        const currentEstimate = this.requestForm.get('estimateTime')?.value;
        const currentEstimateMinutes = this.parseDurationToMinutes(currentEstimate);

        if (totalMinutes > currentEstimateMinutes) {
            const newEstimate = this.minutesToDurationFormat(totalMinutes);
            this.requestForm.get('estimateTime')?.setValue(newEstimate, { emitEvent: false });
        }
        // else: estimateTime remains unchanged
        // --- END NEW ---

        this.requestForm.patchValue({
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
        console.log("Editing row:", contact);

        // Patch values into the form
        this.requestForm.patchValue({
            surgeryCategoryId: contact.surgeryCategoryId ?? '',
            surgeryId: contact.surgeryId ?? '',
            surgeryPart: contact.surgeryPart ?? '',
            surgeryDuration: contact.surgeryDuration ?? '',
            surgeryFromTime: contact.surgeryFromTime ?? '',
            surgeryEndTime: contact.surgeryEndTime ?? '',
            isPrimary: contact.isPrimary === "true",
            // isPrimary: contact.isPrimary ?? false,
            surgeonId: contact.surgeonId ?? '',
            anesthetistId: contact.anestheticsId ?? ''
        });

        // Set display names if you have them separately
        this.surgCategoryName = contact.surgeryCategoryName ?? '';
        this.surgName = contact.surgeryName ?? '';
        this.surgeonName = contact.surgeonName ?? '';
        this.AnthName = contact.anestheticsName ?? '';

        // Remove this contact from list so it can be re-added after editing
        const index = this.Chargelist.indexOf(contact);
        if (index > -1) {
            this.Chargelist.splice(index, 1);
            this.dssurgeryDetailList.data = [...this.Chargelist];
        }
    }

    previewUrl: string | ArrayBuffer | null = null;

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Optional: use device camera directly
    openCamera() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // opens back camera on mobile
        input.onchange = (event: any) => this.onFileSelected(event);
        input.click();
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
    /////////////////////////////// surgery detail part end /////////////////////////////

    /////////////////////////////// attendent detail part /////////////////////////////
    onAdd1() {
        // debugger
        if (!this.requestForm.get("doctorTypeId")?.value || this.requestForm.get("doctorTypeId")?.value == "0") {
            this.toastr.warning('Please select a Doctor Type', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.requestForm.get("doctorId")?.value || this.requestForm.get("doctorId")?.value == "0") {
            this.toastr.warning('Please select a Doctor', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const newEntry = {
            doctorTypeId: this.requestForm.get('doctorTypeId').value,//
            doctorType: this.doctorType,
            doctorId: this.requestForm.get('doctorId').value, //
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

        this.requestForm.patchValue({
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
        console.log("Editing row:", contact);
        // Patch values into the form
        this.requestForm.patchValue({
            doctorTypeId: contact.doctorTypeId ?? '',
            doctorId: contact.doctorId ?? ''
        });

        this.doctorType = contact.doctorType ?? '';
        this.AnthName1 = contact.doctorName ?? '';

        // Remove this contact from list so it can be re-added after editing
        const index = this.Chargelist1.indexOf(contact);
        if (index > -1) {
            this.Chargelist1.splice(index, 1);
            this.dsattendentDetailList.data = [...this.Chargelist1];
        }
        this._OtRequestService.getDoctorsByDoctorType(contact.doctorTypeId).subscribe((data: any[]) => {
            this.ddlDoctor.options = data;
            // this.ddlDoctor.bindGridAutoComplete();
            const incomingDoctorId = contact.doctorId;
            setTimeout(() => {
                this.ddlDoctor.bindGridAutoComplete();
                if (incomingDoctorId) {
                    const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                    if (matchedDoctor) {
                        this.requestForm.get('doctorId')?.setValue(matchedDoctor.value);
                    }
                }
            }, 100);
        });
    }

    FetchList1: any = [];
    getRequestAttendentDetList(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "OTRequestId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OTRequestId", "fieldValue": String(obj.otrequestId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._OtRequestService.getRtrvRequestAttendentList(m_data2).subscribe(records => {
            this.FetchList1 = records.data as OtReqInsert[];
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

    drop2(event: CdkDragDrop<any[]>) {
        const data = this.dsattendentDetailList.data; // Extract raw array from MatTableDataSource
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

    /////////////////////////////// attendent detail part end/////////////////////////////

    onSubmit() {
        const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
        const formattedTime = formattedDate + this.dateTimeObj.time;

        const surgeryDate = this.datePipe.transform(this.requestForm.get('surgeryDate')?.value, 'yyyy-MM-dd');
        // const time = this.requestForm.get('estimateTime')?.value;
        // if (surgeryDate && time) {
        //     const combinedDateTime = `${surgeryDate} ${time}`;
        //     this.requestForm.get('estimateTime')?.setValue(combinedDateTime, { emitEvent: false });
        // }
        // let est = this.requestForm.get('estimateTime')?.value;
        // if (est) {
        //     const parts = est.split(" ");

        //     // If first two parts are a date → remove one
        //     if (parts.length >= 3 && parts[0] === parts[1]) {
        //         est = parts.slice(1).join(" ");
        //     }
        //     this.requestForm.get('estimateTime')?.setValue(est, { emitEvent: false });
        // }

        this.requestForm.get('opipid').setValue(this.opIpId);
        this.requestForm.get('otrequestId')?.setValue(this.vrequestId || 0);
        this.requestForm.get('otRequestDate').setValue(formattedDate);
        this.requestForm.get('otRequestTime').setValue(formattedTime);
        this.requestForm.get('surgeryDate')?.setValue(this.datePipe.transform(this.requestForm.get('surgeryDate')?.value, 'yyyy-MM-dd'));

        if (this.addDiagnolist.length > 0) {
            this.addDiagnolist.forEach(element => {
                this.AllTypeDescription.push({
                    descriptionName: element.descriptionName,
                    descriptionType: "Diagnosis"
                });
            });
        }

        console.log(this.requestForm.value)
        if (!this.requestForm.invalid) {
            debugger
            this.requestForm.get('otrequestId')?.setValue(this.vrequestId ?? 0);
            this.requestForm.get('opiptype')?.setValue(this.requestForm.get('opiptype')?.value === 'IP' ? '1' : '0');
            this.requestForm.get('requestType')?.setValue(this.requestForm.get('requestType')?.value === '1' ? true : false);
            this.requestForm.get('pacrequired')?.setValue(this.requestForm.get('pacrequired')?.value === '1' ? true : false);
            this.requestForm.get('equipmentsRequired')?.setValue(this.requestForm.get('equipmentsRequired')?.value === '1' ? true : false);
            this.requestForm.get('infective')?.setValue(this.requestForm.get('infective')?.value === '1' ? true : false);

            this.reqSurgeryArray.clear();
            if (this.dssurgeryDetailList.data.length === 0) {
                this.toastr.warning('Data is not available in list ,please add surgery details in the list.', 'Warning');
                return;
            }
            this.dssurgeryDetailList.data.forEach(item => {
                this.reqSurgeryArray.push(this.createRequestSurgeryArrayForm(item));
            });

            this.reqAttendingArray.clear();
            this.dsattendentDetailList.data.forEach(item => {
                this.reqAttendingArray.push(this.createRequestAttendentArrayForm(item));
            });

            this.requestDignosisArray.clear();
            this.AllTypeDescription.forEach(item => {
                this.requestDignosisArray.push(this.createRequestDignosis(item));
            });

            this.requestDignosisArray.clear();
            if (this.AllTypeDescription.length === 0) {
                const requestDiagnosisForm: FormGroup = this.createRequestDignosis({});
                this.requestDignosisArray.push(requestDiagnosisForm);
            } else {
                this.AllTypeDescription.forEach(element => {
                    const requestDiagnosisForm: FormGroup = this.createRequestDignosis(element);
                    this.requestDignosisArray.push(requestDiagnosisForm);
                });
            }

            const formValue = { ...this.requestForm.value };
            const controlsToRemove = ['TheaterLocation', 'bodyPartId', 'surgeryCategoryId', 'surgeryId', 'surgeryPart', 'surgeryFromTime', 'surgeryEndTime', 'surgeryDuration', 'isPrimary',
                'surgeonId', 'anesthetistId', 'recourceType', 'doctorTypeId', 'doctorId', 'diagnosis'];
            controlsToRemove.forEach(key => delete formValue[key]);

            console.log(formValue)
            this._OtRequestService.requestSave(formValue).subscribe((response) => {
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
                        validateFormGroup(control, fieldKey); // ✅ recursion for deeper levels
                    } else {
                        if (control?.invalid) {
                            invalidFields.push(fieldKey);
                        }
                    }
                });
            };

            validateFormGroup(this.requestForm);

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
                });
                return;
            }
        }
    }

    selectChangedepdoctorType(obj: any) {
        if (obj.value) {
            this.doctorType = obj.text
            this._OtRequestService.getDoctorsByDoctorType(obj.value).subscribe((data: any[]) => {
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
            });
        }
        // else {
        //   this._OtRequestService.getDoctorsByDoctorType(obj.doctorTypeId).subscribe((data: any[]) => {
        //     debugger
        //     this.ddlDoctor.options = data;
        //     // this.ddlDoctor.bindGridAutoComplete();
        //     const incomingDoctorId = obj.doctorId;
        //     setTimeout(() => {
        //       this.ddlDoctor.bindGridAutoComplete();
        //       if (incomingDoctorId) {
        //         const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
        //         if (matchedDoctor) {
        //           this.requestForm.get('doctorId')?.setValue(matchedDoctor.value);
        //         }
        //       }
        //     }, 100);
        //   });
        // }
    }

    OnPrint(Param) {
        const param = {
            searchFields: [
                {
                    fieldName: "OTRequestId",
                    fieldValue: String(Param),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(this.opIpType),
                    opType: "Equals"
                }
            ],
            mode: "OTRequestReport"
        };

        console.log(param);

        this._OtRequestService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "OT Request Report Viewer"
                }
            });
            matDialog.afterClosed().subscribe(result => {
            });
        });
    }

    getValidationMessages() {
        return {
            DepartmentName: [
                { name: "required", Message: "Department Name is required" }
            ],
            SurgeryCategory: [
                { name: "required", Message: "SurgeryCategory  is required" }
            ],
            Site: [
                { name: "required", Message: "Site Name is required" }
            ],
            SurgeryProcedure: [
                { name: "required", Message: "SurgeryProcedure Name is required" }
            ],
            SurgeonName: [
                { name: "required", Message: "Surgeon Name is required" }
            ],
            SurgeryType: [
                { name: "required", Message: "SurgeryType Name is required" },
                { name: "maxlength", Message: "SurgeryType Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],

        };
    }
    onClose() {
        this.ref.close();
    }
    onClear(val: boolean) {
        // this.requestForm.reset();
        this.dialogRef.close(val);
        this.requestForm.get('opiptype').setValue('OP')
        this.requestForm.get('requestType').setValue('1')
        this.requestForm.get('pacrequired').setValue('1')
        this.requestForm.get('equipmentsRequired').setValue('1')
        this.requestForm.get('infective').setValue('1')
    }

    calculateToTime() {
        const duration = this.requestForm.get('surgeryDuration')?.value;
        const start = this.requestForm.get('surgeryFromTime')?.value;

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

        this.requestForm.get('surgeryEndTime')?.setValue(`${endH}:${endM}`);
    }

    onChangeDuration(event: any) {
        // debugger
        const durationHours = parseFloat(this.requestForm.get('surgeryDuration')?.value); // e.g. 1.5
        const startTime = this.requestForm.get('surgeryFromTime')?.value; // "HH:mm"

        if (durationHours && startTime) {
            const [sh, sm] = startTime.split(':').map(Number);

            const startMinutes = sh * 60 + sm;
            const durationMinutes = Math.round(durationHours * 60);

            const endMinutes = startMinutes + durationMinutes;
            const eh = Math.floor(endMinutes / 60) % 24;
            const em = endMinutes % 60;

            const endTime = `${this.pad(eh)}:${this.pad(em)}`;
            this.requestForm.get('surgeryEndTime')?.setValue(endTime);
        }
    }

    onChangeTimefrom(event: any) {
        const duration = this.requestForm.get('surgeryDuration')?.value;
        const startTime = this.requestForm.get('surgeryFromTime')?.value;

        if (duration) {
            this.onChangeDuration(null); // reuse logic for calculating end time
        } else {
            const endTime = this.requestForm.get('surgeryEndTime')?.value;
            if (endTime) {
                this.calculateDuration(startTime, endTime);
            }
        }
    }

    onChangeTimeto(event: any) {
        const startTime = this.requestForm.get('surgeryFromTime')?.value;
        const endTime = this.requestForm.get('surgeryEndTime')?.value;

        if (startTime && endTime) {
            this.calculateDuration(startTime, endTime);
        }
    }

    calculateDuration(startTime: string, endTime: string) {
        // debugger
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        let durationMinutes = endMinutes - startMinutes;
        if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

        const dh = Math.floor(durationMinutes / 60);
        const dm = durationMinutes % 60;

        const duration = `${this.pad(dh)}:${this.pad(dm)}`;
        this.requestForm.get('surgeryDuration')?.setValue(duration);
    }

    pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
    selectedImage: string | null = null;
    penColor: string = '#ff0000';
    penSize: number = 3;

    @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D | null;
    private isDrawing = false;

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

}





