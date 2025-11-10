import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { InOperationService } from '../in-operation.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-new-in-operation',
  templateUrl: './new-in-operation.component.html',
  styleUrls: ['./new-in-operation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewInOperationComponent {
  inOperForm: FormGroup;
  screenFromString = 'Common-form';
  opIpType: boolean = false;
  opIpId: any;
  RegId: string;
  vInstruction: any;
  votbookingId: any = ""
  vsurgeryType: any = "1";
  isActive: boolean = true;
  vSelectedOption: any = 'OP';
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  surgName: any;
  surgeonName: any;
  editIndex: number | null = null;
  AnthName: any;
  anesthesiaType: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  movedatetime: any;
  timeflag = 0
  minDate: Date;

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

  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeotTableCategory: String = "OttypeMaster";
  autocompleteModeSiteDescription: String = "SiteDescription";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeResourseType: string = "ResourcesTypes";

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  AnthName1: any;
  editIndex1: number | null = null;
  partTypes: string[] = ["Left", "Middle", "Right"];
  @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
  @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  vreservationId: any;
  registerObj2 = new OtReserInsert({});
  registerObj1 = new OtReserInsert({});
  AllTypeDescription: any = []
  RtrvDescriptionList: any = [];
  surgCategoryName: any;
  vpacrequired: any = "1";
  vequipmentsRequired: any = "1";
  vinfective: any = "1";
  doctorType: any;
  doctorTypeId: any;

  constructor(public _inOpearionService: InOperationService,
    public dialogRef: MatDialogRef<NewInOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<NewInOperationComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.inOperForm = this._inOpearionService.createInOperationForm();
    this.inOperForm.markAllAsTouched();

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName

      setTimeout(() => {
        this._inOpearionService.getotTableById(this.data.ottable).subscribe((response) => {
          this.registerObj2 = response;
          // console.log("Get ottable Data:", this.registerObj2)
          this.ddlLocation.SetSelection(this.registerObj2.locationId);
        });
      }, 500);

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._inOpearionService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
            this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj2.infective == true ? '1' : '0';
            this.inOperForm.get('surgeryDate')?.setValue(this.registerObj2.surgeryDate)
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
            this.inOperForm.get('estimateTime')?.setValue(formattedTime);
          });
        }
      }

      this.inOperForm.patchValue(this.registerObj1);
      this.getdiagnosisList(this.registerObj1);
      this.getReservationSurgeryDetList(this.registerObj1);
      this.getReservationAttendentDetList(this.registerObj1);
    }
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

  patientInfoReset() {
    this.inOperForm.get('opIpId').setValue('');
    this.inOperForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.registerObj1 = new OtReserInsert({});
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

  selectChangeSurgeryCategory(obj: any) {
    this.surgCategoryName = obj.text
  }
  selectChangeSurgery(obj: any) {
    this.surgName = obj.surgeryName
    this.ddlSurgerytype.SetSelection(obj.siteDescId);
    setTimeout(() => {
      this._inOpearionService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
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
  selectChangedoctor(obj: any) {
    this.AnthName1 = obj.text
  }
  onChangeOtTable(e) {
    this.ddlLocation.SetSelection(e.locationId);
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.inOperForm.get('diagnosis')?.setValue(this.addDiagnolist);
  }
  selectChangeanesthesiaType(obj: any) {
    this.anesthesiaType = obj.text
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.inOperForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.inOperForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.inOperForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.inOperForm.get('surgeryDuration')?.value;
    const startTime = this.inOperForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.inOperForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.inOperForm.get('surgeryFromTime')?.value;
    const endTime = this.inOperForm.get('surgeryEndTime')?.value;

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
    this.inOperForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onChangeDuration1(event: any) {

  }
  onChangeTimefrom1(event: any) {

  }
  onChangeTimeto1(event: any) {

  }

  onClear(val: boolean) {
    this.inOperForm.reset();
    this.dialogRef.close(val);
  }

  selectChangeanesthesiaType1(obj: any) {
    this.anesthesiaType = obj.text
  }
  selectChangeAnesth1(obj: any) {
    this.AnthName1 = obj.text
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

    this._inOpearionService.getRtrvdiagnosisList(vdata).subscribe(response => {

      if (response && Array.isArray(response.data)) {
        this.RtrvDescriptionList = response.data;
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                otreservationDiagnosisDetId: element.otreservationDiagnosisDetId,
                descriptionName: element.descriptionName
              }
            )
          })
          this.inOperForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("DIAGNOSIS DATA:", this.inOperForm.get('diagnosis').value)
        }
      }
    });
  }
  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    // if (!this.inOperForm.get("surgeryCategoryId")?.value) {
    //   this.toastr.warning('Please select a surgery Type', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if (!this.inOperForm.get("surgeryId")?.value || this.inOperForm.get("surgeryId")?.value == "0") {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeryPart")?.value) {
      this.toastr.warning('Please select a Surgery Part', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeonId")?.value || this.inOperForm.get("surgeonId")?.value == "0") {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("anesthetistId")?.value || this.inOperForm.get("anesthetistId")?.value == "0") {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // debugger
    // const surgeryDate = this.inOperForm.get('surgeryDate')?.value;
    // const surgeryFromTime = this.inOperForm.get('surgeryFromTime')?.value;

    // let combinedDateTime = null;

    // if (surgeryDate && surgeryFromTime) {
    //   combinedDateTime = new Date(surgeryDate);
    //   const [hours, minutes] = surgeryFromTime.split(':');
    //   combinedDateTime.setHours(+hours, +minutes, 0, 0);
    // }

    let newEntry = {
      surgeryCategoryName: this.surgCategoryName,
      surgeryCategoryId: this.inOperForm.get('surgeryCategoryId').value,
      surgeryId: this.inOperForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.inOperForm.get('surgeryPart').value,
      surgeryDuration: this.inOperForm.get('surgeryDuration').value,
      // surgeryFromTime: combinedDateTime,
      surgeryFromTime: this.inOperForm.get('surgeryFromTime').value,
      surgeryEndTime: this.inOperForm.get('surgeryEndTime').value,
      isPrimary: this.inOperForm.get('isPrimary').value,
      surgeonId: this.inOperForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.inOperForm.get('anesthetistId').value, //
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

    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.inOperForm.patchValue({
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
    // debugger
    console.log("Editing row:", contact);
    this.inOperForm.patchValue({
      surgeryCategoryId: contact.surgeryCategoryId ?? '',
      surgeryId: contact.surgeryId ?? '',
      surgeryPart: contact.surgeryPart ?? '',
      surgeryDuration: contact.surgeryDuration ?? '',
      surgeryFromTime: contact.surgeryFromTime ?? '',
      surgeryEndTime: contact.surgeryEndTime ?? '',
      isPrimary: contact.isPrimary ?? false,
      surgeonId: contact.surgeonId ?? '',
      anesthetistId: contact.anestheticsId ?? ''
    });

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

  FetchList: any = [];
  getReservationSurgeryDetList(obj) {
    var m_data2 = {
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

    this._inOpearionService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
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
    if (!this.inOperForm.get("doctorTypeId")?.value || this.inOperForm.get("doctorTypeId")?.value == "0") {
      this.toastr.warning('Please select a Doctor Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("doctorId")?.value || this.inOperForm.get("doctorId")?.value == "0") {
      this.toastr.warning('Please select a Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let newEntry = {
      doctorTypeId: this.inOperForm.get('doctorTypeId').value,//
      doctorType: this.doctorType,
      doctorId: this.inOperForm.get('doctorId').value, //
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

    this.inOperForm.patchValue({
      recourceType: '',
      doctorTypeId: '',
      doctorId: ''
    });
    this.doctorType = '';
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
    // debugger
    console.log("Editing row:", contact);
    this.inOperForm.patchValue({
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
      this._inOpearionService.getDoctorsByDoctorType(obj.value).subscribe((data: any[]) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
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
    var m_data2 = {
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

    this._inOpearionService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
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

  /////////////////////////////// attendent detail part end/////////////////////////////

  onSubmit() {

  }

  onChangeDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperForm.get('theaterinDt').setValue(isoDateString);
    }
  }

  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperForm.get('theaterintime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }


  onChangeOutDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperForm.get('theateroutDt').setValue(isoDateString);
    }
  }

  onChangeOutTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperForm.get('theaterouttime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
}
