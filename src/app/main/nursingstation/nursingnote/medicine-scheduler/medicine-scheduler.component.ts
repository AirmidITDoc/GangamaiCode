import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MedicineItemList } from '../nursingnote.component';
import { NursingnoteService } from '../nursingnote.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-medicine-scheduler',
  templateUrl: './medicine-scheduler.component.html',
  styleUrls: ['./medicine-scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MedicineSchedulerComponent {
  MedicineItemForm: FormGroup
  MedicineItemLoopForm: FormGroup
  registerObj: any;
  dsItemList = new MatTableDataSource<MedicineItemList>();
  vRoute: any;
  vFrequency: any;
  vNurseName: any;
  date: any;
  displayedItemColumn: string[] = [
    'ItemName',
    'DoseName',
    'Route',
    'Frequency',
    'NurseName',
    'Action'
  ]

  timeflag = 0
  isTimeChanged: boolean = false;
  phdatetime: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  minDate: Date;
  doseDateTime:any;

  constructor(
    public _NursingStationService: NursingnoteService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public dialogRef: MatDialogRef<MedicineSchedulerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));
    console.log(this.date)
  }

  onChangeDate(value) {

    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.MedicineItemForm.get('DoseDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);

      const time = this.MedicineItemForm.get('DoseTime')?.value;
      this.setDoseDateTime(time, value); // pass event directly
    }
  }

  onChangeTime(event) {
 
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.MedicineItemForm.get('DoseTime').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.MedicineItemForm.get('DoseTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.phdatetime = splitTime[1]
      console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);

      const date = this.MedicineItemForm.get('DoseDate')?.value;
      this.setDoseDateTime(date, event); // pass event directly
    }
  }

  setDoseDateTime(date: Date | null, time: any): void {
    // debugger;
    if (!date || !time) return;
  
    let hours: number, minutes: number;
  
    // If time is a string (e.g., "14:30")
    if (typeof time === 'string') {
      [hours, minutes] = time.split(':').map(Number);
    } 
    // If time is a Date object
    else if (time instanceof Date) {
      hours = time.getHours();
      minutes = time.getMinutes();
    } 
    else {
      console.error('Unsupported time format:', time);
      return;
    }
  
    const combined = new Date(date);
    combined.setHours(hours);
    combined.setMinutes(minutes);
    combined.setSeconds(0);
    combined.setMilliseconds(0);
  
    this.MedicineItemForm.patchValue({ DoseDateTime: combined });
    console.log(this.MedicineItemForm.value.DoseDateTime);
    this.doseDateTime = this.MedicineItemForm.value.DoseDateTime;
  }
  
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  ngOnInit(): void {
    this.MedicineItemForm = this.createMedicineItemForm();
    this.MedicineItemLoopForm = this.createMedicineItemLoopForm();
    if (this.data) {
      this.registerObj = this.data
      console.log("Medication:", this.registerObj)
    }
  }

  createMedicineItemForm() {
    return this._formBuilder.group({
      ItemId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      DoseId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      Route: ['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(50)]],
      Frequency: ['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(50)]],
      NurseName: ['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(50)]],
      DoseDate: '',
      DoseTime: '',
      Qty: '',
      DoseDateTime:''
    })
  }

  createMedicineItemLoopForm() {
    return this._formBuilder.group({
      nursingMedicationChart:''
    })
  }

  keyPressOnlyCharacters(event: KeyboardEvent): boolean {
  const inp = String.fromCharCode(event.keyCode || event.which);
  if (/^[a-zA-Z ]$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

  Chargelist: any = [];
  onAddMedicine() {
    debugger
    if (this.registerObj.qty == this.dsItemList.data.length) {
      this.toastr.warning('selected item Qty is 0,You cannot add new scheduler', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.MedicineItemForm.get('ItemId').setValue('')
      this.MedicineItemForm.get('Qty').setValue('')
      this.MedicineItemForm.get('Route').setValue('');
      this.MedicineItemForm.get('Frequency').setValue('');
      this.MedicineItemForm.get('NurseName').setValue('');
      this.MedicineItemForm.get('DoseDate').setValue('');
      this.MedicineItemForm.get('DoseTime').setValue('');
      return;
    }

    if ((this.MedicineItemForm.get('ItemId').value == '' || this.MedicineItemForm.get('ItemId').value == null || this.MedicineItemForm.get('ItemId').value == undefined)) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vRoute == '' || this.vRoute == null || this.vRoute == undefined)) {
      this.toastr.warning('Please enter a Route', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vFrequency == '' || this.vFrequency == null || this.vFrequency == undefined)) {
      this.toastr.warning('Please enter a Frequency', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vNurseName == '' || this.vNurseName == null || this.vNurseName == undefined)) {
      this.toastr.warning('Please enter a NurseName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.Chargelist.push(
      {
        DrugId: this.registerObj.itemId || 0,
        DrugName: this.registerObj.itemName || '',
        // DoseDateTime: this.MedicineItemForm.get('DoseDateTime').value || '01/01/1900',
        DoseDateTime:this.doseDateTime || '01/01/1900',
        Route: this.MedicineItemForm.get('Route').value || '',
        Frequency: this.MedicineItemForm.get('Frequency').value || 0,
        NurseName: this.MedicineItemForm.get('NurseName').value || '',
      });
    this.dsItemList.data = this.Chargelist
    console.log(this.dsItemList.data);
    this.MedicineItemForm.get('Route').setValue('');
    this.MedicineItemForm.get('Frequency').setValue('');
    this.MedicineItemForm.get('NurseName').setValue('');
    this.MedicineItemForm.get('DoseDate').setValue('');
    this.MedicineItemForm.get('DoseTime').setValue('');

  }
  deleteTableRow(event, element) {
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onSubmit() {
    debugger
    if (!this.dsItemList.data.length) {
      this.toastr.warning('Please add Scheduler in list !,list is blank', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

    let saveTNursingMedicationChartParamsObj = [];
    this.dsItemList.data.forEach(element => {

      let saveTNursingMedicationChartParams = {

        "medChartId": 0,
        "admId": this.registerObj.admissionID,
        "mdate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "mtime": this.datePipe.transform(new Date(), 'shortTime'),
        "durgId": this.registerObj.itemId,
        "doseId": 0,
        "route": element.Route || '',
        "freq": element.Frequency || '',
        "isAddedBy": this._loggedService.currentUserValue.userId,
        "nurseName": element.NurseName || '',
        "isCancelled": true,
        // "doseName": element.DoseDateTime || '',
        "doseName": this.datePipe.transform(element.DoseDateTime, 'h:mm a') || '',
      }

      saveTNursingMedicationChartParamsObj.push(saveTNursingMedicationChartParams)
    })

    this.MedicineItemLoopForm.get('nursingMedicationChart').setValue(saveTNursingMedicationChartParamsObj)
    console.log(this.MedicineItemLoopForm.value);
    this._NursingStationService.insertMedicationChart(this.MedicineItemLoopForm.value).subscribe(response => {
      console.log(response)
        this.toastr.success(response.message);
        this._matDialog.closeAll();
        this.onClose();
    }, error => {
      this.toastr.error(error.message);
    });
  }


  onClose() {
    this.MedicineItemForm.reset();
    this.dialogRef.close();
  }

  OnClear() {
    this.MedicineItemForm.reset();
  }

}
