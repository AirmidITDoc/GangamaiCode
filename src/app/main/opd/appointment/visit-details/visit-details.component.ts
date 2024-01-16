import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { CasepaperVisitDetails } from '../../new-casepaper/new-casepaper.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VisitDetailsComponent implements OnInit {

  tableColumns = [
    
    'VisitId',
    'VisitTime',
    'DocName'
    
  ];
  isLoadingStr: string = '';
  dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();
  selectedRowIndex: number = 0;
  screenFromString = 'admission-form';
  sIsLoading: string = "";
  
  
  constructor(
    private dialogRef: MatDialogRef<VisitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _opappointmentService: AppointmentSreviceService,
  ) {
    

   }

  // const ESCAPE_KEYCODE = 27;

@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 27) {
        this. close();
    }
}




  close(){
    this.dialogRef.close();
  }

  highlight(row: any) {
    if(row && row.position) {
      this.selectedRowIndex = row.position;
      // console.log(this.selectedRowIndex);
    }
   
  }

  arrowUpEvent(row: object, index: number) {
    var nextrow = this.dataSource1.data[index - 2];
    this.highlight(nextrow);
  }

  arrowDownEvent(row: object, index: number) {
    var nextrow = this.dataSource1.data[index];
    this.highlight(nextrow);
  }

  ngOnInit(): void {
    this.getregisterList();
    setTimeout(() => {
      document.getElementById('ele-1').focus();
    }, 1000);
  }

 
  getregisterList(){
    debugger;
    this.sIsLoading = 'loading';
    var D_data = {
    
      "VisitId":this.data.VisitId
    }
    console.log(D_data);
    this.sIsLoading = 'loading-data';
    this._opappointmentService.getVisitedList(D_data).subscribe(Visit => {
      this.dataSource1.data = Visit as CasepaperVisitDetails[];

      console.log(this.dataSource1.data);
     
      this.sIsLoading = '';

     
    })
    
  }

  selectedRow(index?: number, ele?: CasepaperVisitDetails) {
    let selectedData;
    if(index) {
      selectedData = this.dataSource1.data[index-1];
    } else if(ele) {
      selectedData = ele;
    }
    this.dialogRef.close(selectedData);
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onTableClick() {
    let focusId = 'ele-'+this.selectedRowIndex;
    document.getElementById(focusId).focus();
  }

}


function onKeydownHandler(event: Event, KeyboardEvent: { new(type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent; prototype: KeyboardEvent; readonly DOM_KEY_LOCATION_STANDARD: 0; readonly DOM_KEY_LOCATION_LEFT: 1; readonly DOM_KEY_LOCATION_RIGHT: 2; readonly DOM_KEY_LOCATION_NUMPAD: 3; }) {
  throw new Error('Function not implemented.');
}

