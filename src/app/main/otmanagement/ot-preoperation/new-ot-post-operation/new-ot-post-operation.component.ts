import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { OtPreoperationService } from '../ot-preoperation.service';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-new-ot-post-operation',
  templateUrl: './new-ot-post-operation.component.html',
  styleUrls: ['./new-ot-post-operation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOtPostOperationComponent {
  postOperationForm: FormGroup;
  vSelectedOption: any = "OP";
  vpacrequired: any = "1";
  vequipmentsRequired: any = "1";
  vinfective: any = "1";

  autocompleteModeSiteDescription: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompletePaymentMode: String = "PaymentMode";

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
  opIpType: number;
  RegId: string;
  registerObj: any;
  registerObj1 = new OtReserInsert({});
  registerObj2 = new OtReserInsert({});
  partTypes: string[] = ["Left", "Middle", "Right"];
  @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
  @ViewChild('ddlSurgerytype') ddlSurgerytype: AirmidDropDownComponent;
  AllTypeDescription: any = []
  RtrvDescriptionList: any = [];
  vreservationId: any;
  dsDetailList = new MatTableDataSource<OtReserInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReserInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeotTableCategory: String = "OttypeMaster";
  addDiagnolist: any = [];
  surgCategoryName: any;

  displayedColumns1: string[] = [
    'surgeryCategoryName',
    'surgeryName',
    'surgeryPart',
    'surgeryDuration',
    'surgeryFromTime',
    'surgeryEndTime',
    'surgeryDt',
    'surgeryAmt',
    'discPer',
    'concAmt',
    'InfectivePer',
    'infectiveAmt',
    'netAmt',
    'Action'
  ];

  displayedColumns2: string[] = [
    'sequence',
    'resourceType',
    'attendentType',
    'attendent',
    'fromTime',
    'toTime',
    'priceType',
    'base',
    'basePer',
    'grossAmt',
    // 'Action'
  ]

  constructor(public _OTPostOperationService: OtPreoperationService,
    public dialogRef: MatDialogRef<NewOtPostOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.postOperationForm = this._OTPostOperationService.createOtPostOperationForm();
    this.postOperationForm.markAllAsTouched();
    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName

      setTimeout(() => {
        this._OTPostOperationService.getotTableById(this.data.ottable).subscribe((response) => {
          this.registerObj2 = response;
          // console.log("Get ottable Data:", this.registerObj2)
          this.ddlLocation.SetSelection(this.registerObj2.locationId);
        });
      }, 500);

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._OTPostOperationService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
            this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj2.infective == true ? '1' : '0';
            this.postOperationForm.get('surgeryDate1')?.setValue(this.registerObj2.surgeryDate)
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
            this.postOperationForm.get('estimateTime')?.setValue(formattedTime);
          });
        }
      }

      this.postOperationForm.patchValue(this.registerObj1);
      this.getdiagnosisList(this.registerObj1);
      this.getReservationSurgeryDetList(this.registerObj1);
      this.getReservationAttendentDetList(this.registerObj1);
    }
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
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
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

    this._OTPostOperationService.getRtrvRservdiagnosisList(vdata).subscribe(response => {

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
          this.postOperationForm.get('diagnosis').setValue(this.addDiagnolist);
          console.log("DIAGNOSIS DATA:", this.postOperationForm.get('diagnosis').value)
        }
      }
    });
  }
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.postOperationForm.get('diagnosis')?.setValue(this.addDiagnolist);
  }
  selectChangeSurgeryCategory(obj: any) {
    this.surgCategoryName = obj.text
  }
  selectChangeSurgery(obj: any) {
    this.surgName = obj.surgeryName
    this.ddlSurgerytype.SetSelection(obj.siteDescId);
    setTimeout(() => {
      this._OTPostOperationService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
        this.surgCategoryName = response.siteDescriptionName;
        console.log("Get siteDisc Data:", this.surgCategoryName)
      });
    }, 100);
  }
  onChangeOtTable(e) {
    this.ddlLocation.SetSelection(e.locationId);
  }

  //////////////////////// details part start ////////////////////////////

  onAdd() {
    if (!this.postOperationForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryCategoryName: this.surgCategoryName,
      surgeryCategoryId: this.postOperationForm.get('surgeryCategoryId').value,
      surgeryId: this.postOperationForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.postOperationForm.get('surgeryPart').value,
      surgeryDuration: this.postOperationForm.get('surgeryDuration').value,
      surgeryFromTime: this.postOperationForm.get('surgeryFromTime').value,
      surgeryEndTime: this.postOperationForm.get('surgeryEndTime').value,
      surgeryDt: this.postOperationForm.get('surgeryDate').value,
      surgeryAmt: this.postOperationForm.get('surgeryAmt').value,
      discPer: this.postOperationForm.get('DiscPer').value,
      concAmt: this.postOperationForm.get('concAmt').value,
      InfectivePer: this.postOperationForm.get('InfectivePer').value,
      infectiveAmt: this.postOperationForm.get('InfectiveAmt').value,
      netAmt: this.postOperationForm.get('netAmt').value,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex !== null) {
      this.Chargelist[this.editIndex] = newEntry;
      this.editIndex = null;
    } else {
      this.Chargelist.push(newEntry);
    }
    this.dsDetailList.data = [...this.Chargelist];
    this.dsattendentDetailList.data = [...this.Chargelist1];

    // Recalculate totals
    this.calculateTotals();

    this.postOperationForm.patchValue({
      surgeryCategoryId: '',
      surgeryId: '',
      surgeryPart: '',
      surgeryDuration: '',
      surgeryFromTime: '',
      surgeryEndTime: '',
      surgeryDt: '',
      surgeryAmt: '',
      DiscPer: '',
      concAmt: '',
      InfectivePer: '',
      InfectiveAmt: '',
      netAmt: '',
    });

    this.surgName = '';
    this.surgeonName = '';
    this.AnthName = '';
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsDetailList.data = [];
      this.dsDetailList.data = this.Chargelist;
      this.calculateTotals();
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit(contact: any) {
    debugger
    console.log("Editing row:", contact);

    let formattedDate = null;
    const rawDate = contact.surgeryDate || contact.surgeryDt;

    if (rawDate) {
      // Check if format is dd/MM/yyyy
      if (rawDate.includes('/')) {
        const [day, month, year] = rawDate.split('/').map(Number);
        formattedDate = new Date(year, month - 1, day); // ✅ Correct local date
      }
      // Check if it's ISO or SQL type
      else if (rawDate.includes('-')) {
        const cleanDate = rawDate.split('T')[0].split(' ')[0];
        const [year, month, day] = cleanDate.split('-').map(Number);
        formattedDate = new Date(year, month - 1, day);
      }
    }

    this.postOperationForm.patchValue({
      surgeryCategoryId: contact.surgeryCategoryId ?? '',
      surgeryId: contact.surgeryId ?? '',
      surgeryPart: contact.surgeryPart ?? '',
      surgeryDuration: contact.surgeryDuration ?? '',
      surgeryFromTime: contact.surgeryFromTime ?? '',
      surgeryEndTime: contact.surgeryEndTime ?? '',
      surgeryDate: formattedDate,
      // surgeryDate: contact.surgeryDt ?? '',
      surgeryAmt: contact.surgeryAmt ?? '',
      DiscPer: contact.discPer ?? '',
      concAmt: contact.concAmt ?? '',
      InfectivePer: contact.InfectivePer ?? '',
      InfectiveAmt: contact.infectiveAmt ?? '',
      netAmt: contact.netAmt ?? '',
    });

    // Set display names if you have them separately
    this.surgName = contact.surgeryName ?? '';
    this.surgCategoryName = contact.surgeryCategoryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dsDetailList.data = [...this.Chargelist];
    }
  }

  calculateAmt() {
    const surgeryAmt = +this.postOperationForm.get('surgeryAmt')?.value || 0;
    const discPer = +this.postOperationForm.get('DiscPer')?.value || 0;
    const InfectivePer = +this.postOperationForm.get('InfectivePer')?.value || 0;

    const concAmt = +((surgeryAmt * discPer) / 100).toFixed(2);
    const infectiveAmt = +(((surgeryAmt - concAmt) * InfectivePer) / 100).toFixed(2);
    const netAmt = +(surgeryAmt - concAmt + infectiveAmt).toFixed(2);

    this.postOperationForm.patchValue({
      concAmt,
      InfectiveAmt: infectiveAmt,
      netAmt
    });
  }

  onTableValueChange(row: any) {
    debugger
    const surgeryAmt = parseFloat(row.surgeryAmt) || 0;
    const discPer = parseFloat(row.discPer) || 0;
    const InfectivePer = parseFloat(row.InfectivePer) || 0;

    // Calculations
    row.concAmt = (surgeryAmt * discPer) / 100;
    row.infectiveAmt = (surgeryAmt * InfectivePer) / 100;
    row.netAmt = surgeryAmt - row.concAmt + row.infectiveAmt;

    // Refresh table view
    this.dsDetailList.data = [...this.dsDetailList.data];

    // Update totals
    this.calculateTotals();
  }

  calculateTotals() {
    debugger
    let totalGross = 0;
    let totalDisc = 0;
    let totalNet = 0;

    // Loop through all rows in table data
    this.dsDetailList.data.forEach((row: any) => {
      const amt = parseFloat(row.surgeryAmt) || 0;
      const disc = parseFloat(row.concAmt) || 0;
      const net = parseFloat(row.netAmt) || 0;

      totalGross += amt;
      totalDisc += disc;
      totalNet += net;
    });

    // Update the form controls
    this.postOperationForm.patchValue({
      totalGrossAmt: totalGross.toFixed(2),
      totalDiscAmt: totalDisc.toFixed(2),
      totalNetAmt: totalNet.toFixed(2)
    });
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

    this._OTPostOperationService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
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

            /// extra fields
            surgeryDt: this.registerObj1.surgeryDate ?? '',
            surgeryAmt: element.surgeryAmt ?? '',
            DiscPer: element.discPer ?? '',
            concAmt: element.concAmt ?? '',
            InfectivePer: element.InfectivePer ?? '',
            InfectiveAmt: element.infectiveAmt ?? '',
            netAmt: element.netAmt ?? '',
          });
      })
      this.dsDetailList.data = this.Chargelist
      this.calculateTotals();
      console.log("surgeryDet Data:", this.dsDetailList.data)
    });

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

    this._OTPostOperationService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
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
  //////////////////////// details part end ////////////////////////////

  //////////////////////// PartOfBody start ////////////////////////////
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

  //////////////////////// PartOfBody end ////////////////////////////

  onSubmit() {

  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.postOperationForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.postOperationForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.postOperationForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.postOperationForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.postOperationForm.get('surgeryDuration')?.value;
    const startTime = this.postOperationForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.postOperationForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.postOperationForm.get('surgeryFromTime')?.value;
    const endTime = this.postOperationForm.get('surgeryEndTime')?.value;

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
    this.postOperationForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
