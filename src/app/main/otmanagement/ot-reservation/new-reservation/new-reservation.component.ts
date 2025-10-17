import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { OtReservationService } from '../ot-reservation.service';
import { DatePipe } from '@angular/common';
import { OtrequestlistComponent } from '../otrequestlist/otrequestlist.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {

  reservationForm: FormGroup;
  screenFromString = 'Common-form';
  opIpType: boolean = false;
  opIpId: any;
  RegId: string;
  registerObj: any;
  personalFormGroup: FormGroup;
  Regflag: boolean = false;
  Patientnewold: any = 1;
  admissionFormGroup: FormGroup;
  Regdisplay: boolean = false;
  searchFormGroup: FormGroup;
  vInstruction: any;
  votbookingId: any = ""
  vsurgeryType: any = "1";
  isActive: boolean = true;
  vSelectedOption: any = 'OP';

  autocompleteModeDepartment: String = "Department";
  autocompleteModeSiteDescriptionId: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";

  autocompleteModestatus: string = "State";
  autocompleteModeSurgery: String = "SurgeryMaster";
  autocompleteModeOTTable: String = "OttableMaster";

  vRegNo: any;
  vPatientName: any;
  vbookingId: any;
  vOPDNo: any;
  vIPDNo: any;
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

  displayedColumns: string[] = [
    'surgeryType',
    'surgeryName',
    'duration',
    'fromTime',
    'toTime',
    'isprimary',
    'surgeon',
    'anesthesia',
    'Action'
  ];

  displayedColumns1: string[] = [
    'surgeon',
    'anesthesia',
    'Action'
  ];

  // @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;

  registerObj1 = new OtReqInsert({});
  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];

  constructor(public _OtReservationService: OtReservationService,
    public dialogRef: MatDialogRef<NewReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<NewReservationComponent>,
    public _AdmissionService: AdmissionService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private _matDialog: MatDialog,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.reservationForm = this._OtReservationService.createReservationForm();
    this.reservationForm.markAllAsTouched();

    if ((this.data?.otreservationId) > 0) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.ipdNo
      this.vPatientName = this.registerObj.patientName
      this.votbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.opIpId
      this.vInstruction = this.registerObj.instruction

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }
      this.reservationForm.patchValue(this.registerObj);
      this.reservationForm.get("anestheticsDr")?.setValue(this.registerObj?.anestheticsDrID)
      this.reservationForm.get("anestheticsDr1")?.setValue(this.registerObj?.anestheticsDrID1)
      this.reservationForm.get("unBooking")?.setValue(false)
      // this.reservationForm.get('ottableId').setValue(this.registerObj?.ottableId);
    }

    if (this.registerObj?.opstartTime) {
      const date = new Date(this.registerObj.opstartTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('opstartTime')?.setValue(formattedTime);
        });
      }
    }

    if (this.registerObj?.opendTime) {
      const date = new Date(this.registerObj.opendTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('opendTime')?.setValue(formattedTime);
        });
      }
    }

    if (this.registerObj?.duration) {
      const date = new Date(this.registerObj.otRequestTime);

      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('duration')?.setValue(formattedTime);
        });
      }
    }
    this.reservationForm.get("this.isCancelledDate")?.setValue('1900-01-01')

    /////// calendar code ///////
    if (this.data) {
      console.log("CalenderData:", this.data)

      if (this.data?.startTime) {
        const date = new Date(this.data.startTime);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.reservationForm.get('opstartTime')?.setValue(formattedTime);
          });
        }
      }

      if (this.data?.endTime) {
        const date = new Date(this.data.endTime);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.reservationForm.get('opendTime')?.setValue(formattedTime);
          });
        }
      }
      // this.reservationForm.get('ottableId').setValue(this.data?.otTableId);
      this.reservationForm.get('duration').setValue(this.data?.duration);

    }
  }

  patientInfoReset() {
    this.reservationForm.get('opIpId').setValue('');
    this.reservationForm.get('opIpId').reset();
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
      this.opIpType = false;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = true;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.reservationForm.get('Diagnosis')?.setValue(this.addDiagnolist);
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
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
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

  opstartTime: any;
  opendTime: any;
  optime: any;

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
    const durationHours = parseFloat(this.reservationForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.reservationForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.reservationForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.reservationForm.get('duration')?.value;
    const startTime = this.reservationForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.reservationForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.reservationForm.get('fromTime')?.value;
    const endTime = this.reservationForm.get('toTime')?.value;

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
    this.reservationForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    if (!this.reservationForm.get("surgeryType")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("duration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("fromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("toTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("surgeonId")?.value) {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.reservationForm.get("anestheticsDr")?.value) {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryType: this.reservationForm.get('surgeryType').value,
      surgeryId: this.reservationForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      duration: this.reservationForm.get('duration').value,
      fromTime: this.reservationForm.get('fromTime').value,
      toTime: this.reservationForm.get('toTime').value,
      isprimary: this.reservationForm.get('isprimary').value,
      surgeonId: this.reservationForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.reservationForm.get('anestheticsDr').value, //
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
    //     anestypeId: null,
    //     anesthesiaType: "Surgeon",
    //     anestheticsId1: newEntry.surgeonId,
    //     anestheticsName1: this.surgeonName
    //   };
    //   this.Chargelist1.push(surgeonEntry);
    // }

    // if (this.AnthName) {
    //   let anesthetistEntry = {
    //     anestypeId: null,
    //     anesthesiaType: "Anesthetist",
    //     anestheticsId1: newEntry.anestheticsId,
    //     anestheticsName1: this.AnthName
    //   };
    //   this.Chargelist1.push(anesthetistEntry);
    // }

    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.reservationForm.patchValue({
      surgeryType: '',
      surgeryId: '',
      duration: '',
      fromTime: '',
      toTime: '',
      isprimary: false,
      surgeonId: '',
      anestheticsDr: ''
    });

    this.surgName = '';
    this.surgeonName = '';
    this.AnthName = '';
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
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
    debugger
    console.log("Editing row:", contact);

    // Patch values into the form
    this.reservationForm.patchValue({
      surgeryType: contact.surgeryType ?? '',
      surgeryId: contact.surgeryId ?? '',
      duration: contact.duration ?? '',
      fromTime: contact.fromTime ?? '',
      toTime: contact.toTime ?? '',
      isprimary: contact.isprimary ?? false,
      surgeonId: contact.surgeonId ?? '',
      anestheticsDr: contact.anestheticsId ?? ''
    });

    // Set display names if you have them separately
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

  /////////////////////////////// surgery detail part end /////////////////////////////

  /////////////////////////////// attendent detail part /////////////////////////////
  onAdd1() {
    debugger

    let newEntry = {
      anestypeId: this.reservationForm.get('anestypeId').value,//
      anesthesiaType: this.anesthesiaType,
      anestheticsId1: this.reservationForm.get('anestheticsDr1').value, //
      anestheticsName1: this.AnthName1,
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
      anestypeId: '',
      anestheticsDr1: ''
    });
    this.anesthesiaType = '';
    this.AnthName1 = '';
  }

  deleteTableRow1(event, element) {

    let index = this.Chargelist1.indexOf(element);
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
    debugger
    console.log("Editing row:", contact);

    // Patch values into the form
    this.reservationForm.patchValue({
      anestypeId: contact.anestypeId ?? '',
      anestheticsDr1: contact.anestheticsId1 ?? ''
    });

    this.anesthesiaType = contact.anesthesiaType ?? '';
    this.AnthName1 = contact.anestheticsName1 ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist1.indexOf(contact);
    if (index > -1) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [...this.Chargelist1];
    }
  }

  /////////////////////////////// attendent detail part end/////////////////////////////

  onSubmit() {
    let opdate = this.datePipe.transform(this.reservationForm.get('opdate')?.value, 'yyyy-MM-dd');
    const durationtime = this.reservationForm.get('duration')?.value;
    let combineddurationTime: string | null = null;
    if (opdate && durationtime) {
      combineddurationTime = durationtime;
    }
    const starttime = this.reservationForm.get('opstartTime')?.value;
    let combinedDateStartTime: string | null = null;
    if (opdate && starttime) {
      combinedDateStartTime = `${opdate}T${starttime}:00`;
    }
    const endtime = this.reservationForm.get('opendTime')?.value;
    let combinedDateEndTime: string | null = null;
    if (opdate && endtime) {
      combinedDateEndTime = `${opdate}T${endtime}:00`;
    }

    this.reservationForm.get('reservationDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
    this.reservationForm.get('reservationTime').setValue(this.dateTimeObj?.time);
    this.reservationForm.get('duration')?.setValue(combineddurationTime);
    this.reservationForm.get('opstartTime')?.setValue(combinedDateStartTime);
    this.reservationForm.get('opendTime')?.setValue(combinedDateEndTime);
    this.reservationForm.get('opdate').setValue(this.datePipe.transform(this.reservationForm.get('opdate').value, 'yyyy-MM-dd'));
    this.reservationForm.get('opIpId').setValue(this.opIpId);
    this.reservationForm.get('otrequestId').setValue(Number(this.votbookingId ?? 0));

    if (!this.reservationForm.invalid) {
      if (this.reservationForm.get('opIpType').value == 'IP') { this.reservationForm.get('opIpType').setValue(true) }
      else { this.reservationForm.get('opIpType').setValue(false) }
      console.log(this.reservationForm.value)
      this._OtReservationService.reservationSave(this.reservationForm.value).subscribe((response) => {
        console.log(response)
        this.OnPrint(response)
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.reservationForm.invalid) {
        for (const controlName in this.reservationForm.controls) {
          if (this.reservationForm.controls[controlName].invalid) {
            invalidFields.push(`reservation Form: ${controlName}`);
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

  onOTRequest(): void {
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
        this.votbookingId = selectedData.otBookingId

        if (selectedData?.otRequestTime) {
          const date = new Date(selectedData.otRequestTime);
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
    const param = {
      searchFields: [
        {
          fieldName: "OTReservationId",
          fieldValue: String(Param.OTReservationId),
          opType: "Equals"
        },
        {
          fieldName: "OPIPType",
          fieldValue: String(Param.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTReservationReport"
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
      anestheticsDr: [
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





