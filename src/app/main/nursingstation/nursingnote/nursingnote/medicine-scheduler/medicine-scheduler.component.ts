import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NursingnoteService } from '../../nursingnote.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from '../nursingnote.component';
import { Observable, observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-medicine-scheduler',
  templateUrl: './medicine-scheduler.component.html',
  styleUrls: ['./medicine-scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MedicineSchedulerComponent implements OnInit {
  displayedItemColumn: string[] = [
    'ItemName',
    'DoseName',
    'Route',
    'Frequency',
    'NurseName',
    'Action'
  ]

  timeValue: string = ''; // This will hold the selected time value
  screenFromString = 'dose';
  isLoading = true;
  sIsLoading: string = '';
  MedicineItemForm: FormGroup
  isItemIdSelected: boolean = false;
  isDoseSelected: boolean = false
  vRoute: any;
  vFrequency: any;
  vNurseName: any;
  registerObj: any;
  date: any;

  dsItemList = new MatTableDataSource<MedicineItemList>();

  constructor(
    public _NursingStationService: NursingnoteService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MedicineSchedulerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    let mydate = new Date()
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));
    console.log(this.date)

    // var now = new Date();
    // now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.MedicineItemForm = this.createMedicineItemForm();
    if (this.data) {
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
    }
  }
  createMedicineItemForm() {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Route: '',
      Frequency: '',
      NurseName: '',
      DoseDateTime: '',
      Qty: ''
    })
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.MedicineItemForm.reset();
    this.dialogRef.close();
  }
  OnClear() {
    this.MedicineItemForm.reset();
  }
  vDoseId: any;
  doseList: any = [];
  filteredOptionsDosename: Observable<string[]>
  getDoseList() {
    this._NursingStationService.getDoseList().subscribe((data) => {
      this.doseList = data;
      console.log(this.doseList)
      this.filteredOptionsDosename = this.MedicineItemForm.get('DoseId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDosename(value) : this.doseList.slice()),
      );
    });
  }
  private _filterDosename(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoseName ? value.DoseName.toLowerCase() : value.toLowerCase();
      return this.doseList.filter(option => option.DoseName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDose(option) {
    return option && option.DoseName ? option.DoseName : '';
  }


  Chargelist: any = [];
  onAddMedicine() {
    if (this.registerObj.Qty == this.dsItemList.data.length) {
      this.toastr.warning('selected item Qty is 0,You cannot add new scheduler', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.MedicineItemForm.get('ItemId').setValue('')
      this.MedicineItemForm.get('Qty').setValue('')
      this.MedicineItemForm.get('Route').setValue('');
      this.MedicineItemForm.get('Frequency').setValue('');
      this.MedicineItemForm.get('NurseName').setValue('');
      this.MedicineItemForm.get('DoseDateTime').setValue('');
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
        DrugId: this.registerObj.ItemId || 0,
        DrugName: this.registerObj.ItemName || '',
        // DoseId: this.MedicineItemForm.get('DoseId').value.DoseId || 0, 
        // DoseName: this.MedicineItemForm.get('DoseId').value.DoseName || '',
        DoseDateTime: this.MedicineItemForm.get('DoseDateTime').value || '01/01/1900',   
        Route: this.MedicineItemForm.get('Route').value || '',
        Frequency: this.MedicineItemForm.get('Frequency').value || 0,
        NurseName: this.MedicineItemForm.get('NurseName').value || '',
      });
    this.dsItemList.data = this.Chargelist
    console.log(this.dsItemList.data);
    this.MedicineItemForm.get('Route').setValue('');
    this.MedicineItemForm.get('Frequency').setValue('');
    this.MedicineItemForm.get('NurseName').setValue('');
    this.MedicineItemForm.get('DoseDateTime').setValue('');
 
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
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
debugger
    if (!this.dsItemList.data.length) {
      this.toastr.warning('Please add Scheduler in list !,list is blank', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

    let saveTNursingMedicationChartParamsObj = [];
    this.dsItemList.data.forEach(element => {
      // let saveTNursingMedicationChartParams = {}
      // saveTNursingMedicationChartParams['medChartId'] = 0;
      // saveTNursingMedicationChartParams['admID'] = this.registerObj.AdmissionID;
      // saveTNursingMedicationChartParams['mDate'] = formattedDate;
      // saveTNursingMedicationChartParams['mTime'] = formattedTime;
      // saveTNursingMedicationChartParams['durgId'] = this.registerObj.ItemId || 0;
      // saveTNursingMedicationChartParams['doseID'] = 0;
      // saveTNursingMedicationChartParams['route'] = element.Route || '';
      // saveTNursingMedicationChartParams['freq'] = element.Frequency || '';
      // saveTNursingMedicationChartParams['nurseName'] = element.NurseName || '';
      // saveTNursingMedicationChartParams['doseName'] = this.datePipe.transform(element.DoseDateTime, 'h:mm a') || '';
      // saveTNursingMedicationChartParams['createdBy'] = this.accountService.currentUserValue.user.id;


      let saveTNursingMedicationChartParams = {

        "medChartId": 0,

        "admID":this.registerObj.AdmissionID,

        "mDate": formattedDate, 

        "mTime": formattedTime,

        "durgId":  this.registerObj.ItemId,

        "doseID": 0,

        "route":element.Route || '',

        "freq": element.Frequency || '',

        "nurseName": element.NurseName || '',

        "doseName":  this.datePipe.transform(element.DoseDateTime, 'h:mm a') || '',

        "createdBy": this.accountService.currentUserValue.user.id,

      }   
      saveTNursingMedicationChartParamsObj.push(saveTNursingMedicationChartParams)
    })

    let submitData = {
      "saveTNursingMedicationChartParams": saveTNursingMedicationChartParamsObj
    };
    console.log(submitData);
    this._NursingStationService.insertMedicationChart(submitData).subscribe(response=>{
      console.log(response)
      debugger
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this._matDialog.closeAll();
        this.onClose();
      } else {
        this.toastr.error('Record Data not saved !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }




  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('NurseName') NurseName: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }

  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.NurseName.nativeElement.focus();
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  ///[^a-zA-Z0-9]/
  keyPressOk(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
