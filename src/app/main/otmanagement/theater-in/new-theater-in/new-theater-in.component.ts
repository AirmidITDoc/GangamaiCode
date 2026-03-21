import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { TheaterInService } from '../theater-in.service';

@Component({
    selector: 'app-new-theater-in',
    templateUrl: './new-theater-in.component.html',
    styleUrls: ['./new-theater-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewTheaterInComponent {
    theaterInForm: FormGroup;
    autocompleteModeDepartment: string = "Department";
    autocompleteModeSiteDescriptionId: string = "SiteDescription";
    autocompleteModeotTableCategory: string = "OttypeMaster";
    autocompleteModeDoctorSurgeon: string = "DoctorSurgion";
    autocompleteModeSurgeryMaster: string = "SurgeryMaster";
    autocompleteModeDoctorType: string = "DoctorType";
    autocompleteModeConDoctor: string = "ConDoctor";
    autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeOTTable: string = "OttableMaster";
    autocompleteModeLocation: string = "Location";

    vRegNo: any;
    vPatientName: any;
    vbookingId: any;
    vOPDNo: any;
    vIPDNo: any;
    screenFromString = 'Common-form';
    opIpId: any;
    surgId: any;
    surgName: any;
    surgeonId: any;
    surgeonName: any;
    anestypeId: any;
    anesthesiaType: any;
    AnthId: any;
    AnthName: any;
    AnthId1: any;
    AnthName1: any;
    editIndex: number | null = null;
    editIndex1: number | null = null;
    dateTimeObj: any;
    opTime: any;
    opendTime: any;
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
        // 'Action'
    ];

    displayedColumns1: string[] = [
        'sequence',
        'surgeon',
        'anesthesia',
        // 'Action'
    ];

    @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;
    opIpType: number;
    RegId: string;
    registerObj: any;
    registerObj1 = new OtReqInsert({});
    BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
    dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
    Chargelist: any[] = [];
    Chargelist1: any[] = [];
    opstartTime: any;
    opTheaterInTime: any;
    addDiagnolist: any = [];
    vSelectedOption: any = "OP";
    registerObj2 = new OtReserInsert({});
    @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
    @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
    vreservationId: any;
    AllTypeDescription: any = []
    RtrvDescriptionList: any = [];

    constructor(
        public _TheaterinService: TheaterInService,
        public dialogRef: MatDialogRef<NewTheaterInComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService) { }

    ngOnInit(): void {
        this.theaterInForm = this._TheaterinService.createTheaterInForm();
        this.theaterInForm.markAllAsTouched();

        if ((this.data?.otReservationId) > 0) {
            this.registerObj1 = this.data
            console.log(this.registerObj1)
            this.vRegNo = this.registerObj1.regNo
            this.vOPDNo = this.registerObj1.opdNo
            this.vIPDNo = this.registerObj1.opdNo
            this.vPatientName = this.registerObj1.patientName

            setTimeout(() => {
                this._TheaterinService.getotTableById(this.data.ottable).subscribe((response) => {
                    this.registerObj2 = response;
                    console.log("Get ottable Data:", this.registerObj2)
                    this.ddlLocation.SetSelection(this.registerObj2.locationId);
                });
            }, 500);

            if (this.data.otReservationId) {
                setTimeout(() => {
                    this._TheaterinService.getotReservationById(this.data.otReservationId).subscribe((response) => {
                        this.registerObj2 = response;
                        console.log("Get Data:", this.registerObj2)
                        this.vreservationId = this.registerObj2.otreservationId
                        this.opIpId = this.registerObj2.opipid
                        this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
                        this.theaterInForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate)
                    });
                }, 500);
            }

            if (this.registerObj1?.estimateTime) {
                const date = new Date(this.registerObj1.estimateTime);
                if (!isNaN(date.getTime())) {
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');

                    const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

                    setTimeout(() => {
                        this.theaterInForm.get('estimateTime')?.setValue(formattedTime);
                    });
                }
            }

            this.theaterInForm.patchValue(this.registerObj1);
            this.getdiagnosisList(this.registerObj1);
            this.getReservationSurgeryDetList(this.registerObj1);
            this.getReservationAttendentDetList(this.registerObj1);
        }
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

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
        console.log(this.dateTimeObj)
    }

    onChangeTheaterInTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opTheaterInTime = time
        this.theaterInForm.get('theaterInTime')?.setValue(time, { emitEvent: false });
    }

    onChangeTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opTime = time
        this.theaterInForm.get('estimateTime')?.setValue(time, { emitEvent: false });
    }

    onChangeStartTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opstartTime = time
        this.theaterInForm.get('startTime')?.setValue(time, { emitEvent: false });
    }

    onChangeEndTime(event: any) {
        let time = event.target.value;
        if (time && time.length >= 5) {
            time = time.substring(0, 5);
        }
        console.log("Time changed:", time); // "11:51"
        this.opendTime = time
        this.theaterInForm.get('endTime')?.setValue(time, { emitEvent: false });
    }

    selectChangeDiagnosis(selectedChips: string[]) {
        this.addDiagnolist = selectedChips;
        this.theaterInForm.get('diagnosis')?.setValue(this.addDiagnolist);
    }

    selectChangeSurgery(obj: any) {
        this.surgName = obj.text
    }
    selectChangeSurgeon(obj: any) {
        this.surgeonName = obj.text
    }
    selectChangeAnesth(obj: any) {
        this.AnthName = obj.text
    }
    selectChangeanesthesiaType(obj: any) {
        this.anesthesiaType = obj.text
    }
    selectChangeAnesth1(obj: any) {
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

        this._TheaterinService.getRtrvdiagnosisList(vdata).subscribe(response => {

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
                    this.theaterInForm.get('diagnosis').setValue(this.addDiagnolist);
                    console.log("DIAGNOSIS DATA:", this.theaterInForm.get('diagnosis').value)
                }
            }
        });
    }

    /////////////////////////////// surgery detail part /////////////////////////////
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

        this._TheaterinService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
            this.FetchList = records.data as OtReserInsert[];
            this.FetchList.forEach(element => {

                const from = new Date(element.surgeryFromTime);
                const end = new Date(element.surgeryEndTime);

                const surgeryFromTime = from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const surgeryEndTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                this.Chargelist.push(
                    {
                        surgeryCategoryName: element.surgeryCategoryName,
                        surgeryCategoryId: element.surgeryCategoryId,
                        surgeryId: element.surgeryId,//
                        surgeryName: element.surgeryName,
                        surgeryPart: element.surgeryPart,
                        surgeryDuration: element.surgeryDuration,
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

        this._TheaterinService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
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

    /////////////////////////////// surgery detail part end /////////////////////////////

    onSubmit() { }

    onClear(val: boolean) {
        this.dialogRef.close(val);
        // this.theaterInForm.get('opIpType').setValue('OP')
    }

    onChangeDuration(event: any) {
        // debugger
        const durationHours = parseFloat(this.theaterInForm.get('duration')?.value); // e.g. 1.5
        const startTime = this.theaterInForm.get('fromTime')?.value; // "HH:mm"

        if (durationHours && startTime) {
            const [sh, sm] = startTime.split(':').map(Number);

            const startMinutes = sh * 60 + sm;
            const durationMinutes = Math.round(durationHours * 60);

            const endMinutes = startMinutes + durationMinutes;
            const eh = Math.floor(endMinutes / 60) % 24;
            const em = endMinutes % 60;

            const endTime = `${this.pad(eh)}:${this.pad(em)}`;
            this.theaterInForm.get('toTime')?.setValue(endTime);
        }
    }

    onChangeTimefrom(event: any) {
        const duration = this.theaterInForm.get('duration')?.value;
        const startTime = this.theaterInForm.get('fromTime')?.value;

        if (duration) {
            this.onChangeDuration(null); // reuse logic for calculating end time
        } else {
            const endTime = this.theaterInForm.get('toTime')?.value;
            if (endTime) {
                this.calculateDuration(startTime, endTime);
            }
        }
    }

    onChangeTimeto(event: any) {
        const startTime = this.theaterInForm.get('fromTime')?.value;
        const endTime = this.theaterInForm.get('toTime')?.value;

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
        this.theaterInForm.get('duration')?.setValue(duration);
    }

    pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
}
