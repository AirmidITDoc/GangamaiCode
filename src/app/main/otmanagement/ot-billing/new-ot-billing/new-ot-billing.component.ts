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
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { OtBillingService } from '../ot-billing.service';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import Swal from 'sweetalert2';
import { OtAnethesia } from '../ot-billing.component';

@Component({
  selector: 'app-new-ot-billing',
  templateUrl: './new-ot-billing.component.html',
  styleUrls: ['./new-ot-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOtBillingComponent {
  billForm: FormGroup;
  vSelectedOption: any = "OP";
  vpacrequired: any = "1";
  vequipmentsRequired: any = "1";
  vinfective: any = "1";
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
  dsattendentDetailList = new MatTableDataSource<OtAnethesia>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeotTableCategory: String = "OttypeMaster";
  addDiagnolist: any = [];
  surgCategoryName: any;
  dateTimeObj: any;
 isDatePckrDisabled: boolean = false;
  autocompleteModeSiteDescription: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompletePaymentMode: String = "PaymentMode";

  displayedColumns1: string[] = [
    'surgeryCategoryName',
    'surgeryName',
    'surgeryPart',
    'surgeryDuration',
    'surgeryFromTime',
    'surgeryEndTime',
    'surgeryDate',
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
    // 'fromTime',
    // 'toTime',
    'priceType',
    'baseRs',
    'basePer',
    'grossAmt',
    'concPer',
    'concAmt',
    'netAmt',
    // 'Action'
  ]

  constructor(public _otBillService: OtBillingService,
    public dialogRef: MatDialogRef<NewOtBillingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.billForm = this._otBillService.createOtbillForm();
    this.billForm.markAllAsTouched();
    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._otBillService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
            this.vpacrequired = this.registerObj2.pacrequired == true ? '1' : '0';
            this.vequipmentsRequired = this.registerObj2.equipmentsRequired == true ? '1' : '0';
            this.vinfective = this.registerObj2.infective == true ? '1' : '0';
            this.billForm.get('surgeryDate1')?.setValue(this.registerObj2.surgeryDate)
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
            this.billForm.get('estimateTime')?.setValue(formattedTime);
          });
        }
      }

      this.billForm.patchValue(this.registerObj1);
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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  selectChangeSurgeryCategory(obj: any) {
    this.surgCategoryName = obj.text
  }
  selectChangeSurgery(obj: any) {
    this.surgName = obj.surgeryName
    this.ddlSurgerytype.SetSelection(obj.siteDescId);
    setTimeout(() => {
      this._otBillService.getotsiteDiscById(obj.siteDescId).subscribe((response) => {
        this.surgCategoryName = response.siteDescriptionName;
        console.log("Get siteDisc Data:", this.surgCategoryName)
      });
    }, 100);
  }

  //////////////////////// details part start ////////////////////////////

  onAdd() {
    if (!this.billForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.billForm.get("surgeryDuration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.billForm.get("surgeryFromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.billForm.get("surgeryEndTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryCategoryName: this.surgCategoryName,
      surgeryCategoryId: this.billForm.get('surgeryCategoryId').value,
      surgeryId: this.billForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      surgeryPart: this.billForm.get('surgeryPart').value,
      surgeryDuration: this.billForm.get('surgeryDuration').value,
      surgeryFromTime: this.billForm.get('surgeryFromTime').value,
      surgeryEndTime: this.billForm.get('surgeryEndTime').value,
      surgeryDate: this.billForm.get('surgeryDate').value,
      surgeryAmt: this.billForm.get('surgeryAmt').value,
      discPer: this.billForm.get('DiscPer').value,
      concAmt: this.billForm.get('concAmt').value,
      InfectivePer: this.billForm.get('InfectivePer').value,
      infectiveAmt: this.billForm.get('InfectiveAmt').value,
      netAmt: this.billForm.get('netAmt').value,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex !== null) {
      this.Chargelist[this.editIndex] = newEntry;
      this.editIndex = null;
    } else {
      this.Chargelist.push(newEntry);
    }
    debugger
   
    this.dsDetailList.data = [...this.Chargelist];
    this.dsattendentDetailList.data = [...this.Chargelist1];

    // Recalculate totals
    this.calculateTotals();

    this.billForm.patchValue({
      surgeryCategoryId: '',
      surgeryId: '',
      surgeryPart: '',
      surgeryDuration: '',
      surgeryFromTime: '',
      surgeryEndTime: '',
      surgeryDate: '',
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


  //   ///, index: number
  // onDiscountbaseChange(row: OtAnethesia) {
  //     debugger
  //     // if (index === 0) {  // Only trigger if changed in first row (Surgeon)
  //       const surgeonDiscountPerc = row.basePer || 0;

  //       let baseAmt=this.dsattendentDetailList.data[0].baseRs

  //       // Apply same discount % to ALL other rows
  //       // this.dsattendentDetailList.data.forEach((r, i) => {
  //       //   if (i !== 0) {
  //       //     row.basePer = surgeonDiscountPerc;
  //       //   }
  //         // Recalculate concession amount and net amount
  //        let baseperAmt = (baseAmt * row.basePer) / 100;
  //         row.grossAmt = baseAmt - baseperAmt;
  //         row.netAmt = baseAmt - baseperAmt;
  //       // });

  //       // Optional: refresh table
  //       this.dsattendentDetailList.data = [...this.dsattendentDetailList.data];
  //     // }
  //   }


  ///, index: number
  onDiscountbaseChange(row: OtAnethesia, i) {
    debugger

    console.log(row, i)
    const surgeonDiscountPerc = row.basePer || 0;

    let baseAmt = this.dsattendentDetailList.data[0].baseRs

    // if(row.s)
    let baseperAmt = (baseAmt * row.basePer) / 100;
    // row.grossAmt = baseAmt - baseperAmt;
    // row.netAmt = baseAmt - baseperAmt;

    row.grossAmt = baseperAmt;
    row.netAmt = baseperAmt;

    this.dsattendentDetailList.data = [...this.dsattendentDetailList.data];

  }


  // Main function: When discount % changes in first row , index: number
  onDiscountChange(row: OtAnethesia) {
    debugger
    const surgeonDiscountPerc = row.concPer || 0;
      row.concAmt = (row.grossAmt * row.concPer) / 100;
      row.netAmt = row.grossAmt - row.concAmt;
    this.dsattendentDetailList.data = [...this.dsattendentDetailList.data];
    // }
  }


  // // Main function: When discount % changes in first row , index: number
  // onDiscountChange(row: OtAnethesia) {
  //   debugger
  //   // if (index === 0) {  // Only trigger if changed in first row (Surgeon)
  //   const surgeonDiscountPerc = row.concPer || 0;

  //   // Apply same discount % to ALL other rows
  //   this.dsattendentDetailList.data.forEach((r, i) => {
  //     if (i !== 0) {
  //       r.concPer = surgeonDiscountPerc;
  //     }
  //     // Recalculate concession amount and net amount
  //     r.concAmt = (r.grossAmt * r.concPer) / 100;
  //     r.netAmt = r.grossAmt - r.concAmt;
  //   });

  //   // Optional: refresh table
  //   this.dsattendentDetailList.data = [...this.dsattendentDetailList.data];
  //   // }
  // }

  // Initial calculation of base amounts
  calculateAllAmounts() {
    this.dsattendentDetailList.data.forEach(row => {
      row.baseRs = (row.concPer / 100) * this.vtotalNetAmt;
      row.concAmt = (row.baseRs * (row.concPer || 0)) / 100;
      row.netAmt = row.baseRs - row.concAmt;
    });
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

    this.billForm.patchValue({
      surgeryCategoryId: contact.surgeryCategoryId ?? '',
      surgeryId: contact.surgeryId ?? '',
      surgeryPart: contact.surgeryPart ?? '',
      surgeryDuration: contact.surgeryDuration ?? '',
      surgeryFromTime: contact.surgeryFromTime ?? '',
      surgeryEndTime: contact.surgeryEndTime ?? '',
      surgeryDate: formattedDate,
      // surgeryDate: contact.surgeryDate ?? '',
      surgeryAmt: contact.surgeryAmt ?? '',
      DiscPer: contact.discPer ?? '',
      concAmt: contact.concAmt ?? '',
      InfectivePer: contact.InfectivePer ?? '',
      InfectiveAmt: contact.infectiveAmt ?? '',
      netAmt: contact.netAmt ?? '',
    });

    this.surgName = contact.surgeryName ?? '';
    this.surgCategoryName = contact.surgeryCategoryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dsDetailList.data = [...this.Chargelist];
    }
  }

  calculateAmt() {
    const surgeryAmt = +this.billForm.get('surgeryAmt')?.value || 0;
    const discPer = +this.billForm.get('DiscPer')?.value || 0;
    const InfectivePer = +this.billForm.get('InfectivePer')?.value || 0;

    const concAmt = +((surgeryAmt * discPer) / 100).toFixed(2);
    const infectiveAmt = +(((surgeryAmt - concAmt) * InfectivePer) / 100).toFixed(2);
    const netAmt = +(surgeryAmt - concAmt + infectiveAmt).toFixed(2);

    this.billForm.patchValue({
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

    row.concAmt = (surgeryAmt * discPer) / 100;
    row.infectiveAmt = (surgeryAmt * InfectivePer) / 100;
    row.netAmt = surgeryAmt - row.concAmt + row.infectiveAmt;

    this.dsDetailList.data = [...this.dsDetailList.data];

    this.calculateTotals();
  }
  vtotalNetAmt: any
  calculateTotals() {
    debugger
    let totalGross = 0;
    let totalDisc = 0;
    let totalNet = 0;

    this.dsDetailList.data.forEach((row: any) => {
      const amt = parseFloat(row.surgeryAmt) || 0;
      const disc = parseFloat(row.concAmt) || 0;
      const net = parseFloat(row.netAmt) || 0;

      totalGross += amt;
      totalDisc += disc;
      totalNet += net;
    });
    this.vtotalNetAmt = totalNet.toFixed(2)

    this.billForm.patchValue({
      totalGrossAmt: totalGross.toFixed(2),
      totalDiscAmt: totalDisc.toFixed(2),
      totalNetAmt: totalNet.toFixed(2)
    });

    if(this.vtotalNetAmt > 0)
    this.dsattendentDetailList.data[0].baseRs=this.vtotalNetAmt
     console.log(  this.dsattendentDetailList.data[0].baseRs)
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

    this._otBillService.getRtrvReservationSurgeryList(m_data2).subscribe(records => {
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
            surgeryDate: this.registerObj1.surgeryDate ?? '',
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

    this._otBillService.getRtrvReservationAttendentList(m_data2).subscribe(records => {
      this.FetchList1 = records.data as OtReserInsert[];
      this.FetchList1.forEach(element => {

        this.Chargelist1.push(
          {
            doctorTypeId: element.doctorTypeId,//
            doctorType: element.doctorType,
            doctorId: element.doctorId, //
            doctorName: element.doctorName,

            // extra fields
            baseRs: element.baseRs,
            basePer: element.basePer,
            grossAmt: element.grossAmt,
            concPer: element.concPer,
            concAmt: element.concAmt,
            netAmt: element.netAmt,
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
  

  onSubmit() {

  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.billForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.billForm.get('surgeryDuration')?.value); // e.g. 1.5
    const startTime = this.billForm.get('surgeryFromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.billForm.get('surgeryEndTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.billForm.get('surgeryDuration')?.value;
    const startTime = this.billForm.get('surgeryFromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.billForm.get('surgeryEndTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.billForm.get('surgeryFromTime')?.value;
    const endTime = this.billForm.get('surgeryEndTime')?.value;

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
    this.billForm.get('surgeryDuration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
