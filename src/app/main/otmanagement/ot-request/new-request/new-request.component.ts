import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../ot-request.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  requestForm: FormGroup;

  personalFormGroup: FormGroup;
  Regflag: boolean = false;
  Patientnewold: any = 1;
  admissionFormGroup: FormGroup;
  Regdisplay: boolean = false;
  searchFormGroup: FormGroup;

  vSelectedOption: any = "OP";
  vsurgeryType: any = "1";

  isActive: boolean = true;
  autocompleteModeDepartment: String = "Department";
  autocompleteModeSiteDescriptionId: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "DoctorType"
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
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

  displayedColumns: string[] = [
    'surgeryType',
    'surgeryName',
    'surgerypart',
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

  @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;
  opIpType: number;
  RegId: string;
  registerObj: any;
  registerObj1 = new OtReqInsert({});
  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  partTypes: string[] = ["Left", "Middle", "Right"];

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];

  constructor(public _OtRequestService: OtRequestService,
    public dialogRef: MatDialogRef<NewRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private ref: MatDialogRef<NewRequestComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.requestForm = this._OtRequestService.createRequestForm();
    this.requestForm.markAllAsTouched();

    if ((this.data?.otBookingId) > 0) {
      this.registerObj = this.data
      this.vbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.visitId
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.opdNo
      this.vPatientName = this.registerObj.patientName

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }

      if (this.registerObj?.otRequestTime) {
        const date = new Date(this.registerObj.otRequestTime);

        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.requestForm.get('otRequestTime')?.setValue(formattedTime);
          });

          console.log("Raw from backend:", this.registerObj.otRequestTime);
          console.log("Formatted:", formattedTime);
          console.log("Control value after patch:", this.requestForm.get('otRequestTime')?.value);
        }
      }

      console.log(this.registerObj)
      this.requestForm.patchValue(this.registerObj);
      this.selectChangedoctorType(this.registerObj)
    }
    this.requestForm.get("this.isCancelledDate")?.setValue('1900-01-01')
    this.requestForm.get("doctorTypeId")?.setValue(this.registerObj.categoryId)
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

  patientInfoReset() {
    this.requestForm.get('opIpId').setValue('');
    this.requestForm.get('opIpId').reset();
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

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.requestForm.get('Diagnosis')?.setValue(this.addDiagnolist);
  }

  // onAdd() {

  //   debugger

  //   let newEntry = {
  //     surgeryType: this.requestForm.get('surgeryType').value,
  //     surgeryName: this.requestForm.get('surgeryId').value,
  //     duration: this.requestForm.get('duration').value,
  //     fromTime: this.requestForm.get('fromTime').value,
  //     toTime: this.requestForm.get('toTime').value,
  //     isprimary: this.requestForm.get('isprimary').value,
  //   };
  //   this.Chargelist.push(newEntry);
  //   this.dssurgeryDetailList.data = [...this.Chargelist];
  // }

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
  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    if (!this.requestForm.get("surgeryType")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("duration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("fromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("toTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("surgeonId")?.value) {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.requestForm.get("anestheticsDr")?.value) {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryType: this.requestForm.get('surgeryType').value,
      surgeryId: this.requestForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgerypart: this.requestForm.get('surgerypart').value,
      duration: this.requestForm.get('duration').value,
      fromTime: this.requestForm.get('fromTime').value,
      toTime: this.requestForm.get('toTime').value,
      isprimary: this.requestForm.get('isprimary').value,
      surgeonId: this.requestForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.requestForm.get('anestheticsDr').value, //
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

    this.requestForm.patchValue({
      surgeryType: '',
      surgeryId: '',
      surgerypart: '',
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
    this.requestForm.patchValue({
      surgeryType: contact.surgeryType ?? '',
      surgeryId: contact.surgeryId ?? '',
      surgerypart: contact.surgerypart ?? '',
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
      anestypeId: this.requestForm.get('anestypeId').value,//
      anesthesiaType: this.anesthesiaType,
      anestheticsId1: this.requestForm.get('anestheticsDr1').value, //
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

    this.requestForm.patchValue({
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
    this.requestForm.patchValue({
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
    let opdate = this.datePipe.transform(this.requestForm.get('otRequestDate')?.value, 'yyyy-MM-dd');
    const time = this.requestForm.get('otRequestTime')?.value;
    let combinedDateStartTime: string | null = null;
    if (opdate && time) {
      combinedDateStartTime = `${opdate}T${time}:00`;
    }
    // const combinedDateStartTime = `${opdate}T${this.opstartTime}:00`;

    this.requestForm.get('otbookingDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
    this.requestForm.get('opIpId').setValue(this.opIpId);
    this.requestForm.get('otbookingId')?.setValue(this.vbookingId || 0);
    this.requestForm.get('otRequestDate').setValue(this.datePipe.transform(this.requestForm.get('otRequestDate').value, 'yyyy-MM-dd'));
    this.requestForm.get('otRequestTime').setValue(combinedDateStartTime);
    this.requestForm.get('categoryId').setValue(this.requestForm.get('doctorTypeId').value);
    if (!this.requestForm.invalid) {
      if (this.requestForm.get('opIpType').value == 'IP') { this.requestForm.get('opIpType').setValue(1) }
      else { this.requestForm.get('opIpType').setValue(0) }
      this.requestForm.removeControl('doctorTypeId')
      console.log(this.requestForm.value)
      this._OtRequestService.requestSave(this.requestForm.value).subscribe((response) => {
        this.OnPrint(response)
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.requestForm.invalid) {
        for (const controlName in this.requestForm.controls) {
          if (this.requestForm.controls[controlName].invalid) {
            invalidFields.push(`request Form: ${controlName}`);
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

  selectChangedoctorType(obj: any) {
    if (obj.value) {
      this._OtRequestService.getSurgeonsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        this.surgeonList.bindGridAutoComplete();
      });
    } else {
      this._OtRequestService.getSurgeonsByDoctorType(obj.categoryId).subscribe((data: any[]) => {
        this.surgeonList.options = data;
        // this.surgeonList.bindGridAutoComplete();
        const incomingDoctorId = obj.surgeonId;
        setTimeout(() => {
          this.surgeonList.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.requestForm.get('surgeonId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
  }

  OnPrint(Param) {
    const param = {
      searchFields: [
        {
          fieldName: "OTBookingId",
          fieldValue: String(Param.otbookingId),
          opType: "Equals"
        },
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(Param.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTRequest"
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
    this.requestForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.requestForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.requestForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.requestForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.requestForm.get('duration')?.value;
    const startTime = this.requestForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.requestForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.requestForm.get('fromTime')?.value;
    const endTime = this.requestForm.get('toTime')?.value;

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
    this.requestForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}





