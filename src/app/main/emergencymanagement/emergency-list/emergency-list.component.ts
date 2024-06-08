import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { EmergencyListService } from './emergency-list.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NewEmergencyComponent } from './new-emergency/new-emergency.component';

@Component({
  selector: 'app-emergency-list',
  templateUrl: './emergency-list.component.html',
  styleUrls: ['./emergency-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmergencyListComponent implements OnInit {
  displayedColumns = [
    'Date',
    'RegNo',
    'PatientName',
    'MobileNo',
    'Doctorname' 
  ];

  sIsLoading: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator; 
  dsEmergencyList= new MatTableDataSource<EmergencyList>();
  constructor(
    public _EmergencyListService:EmergencyListService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  getEmergencyList() {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "FromDate":this.datePipe.transform(this._EmergencyListService.MySearchGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate":  this.datePipe.transform(this._EmergencyListService.MySearchGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    // console.log(vdata);
      this._EmergencyListService.getEmergencyList(vdata).subscribe(data => {
      this.dsEmergencyList.data = data as EmergencyList[];
    // console.log(this.dsEmergencyList.data)
      this.dsEmergencyList.sort = this.sort;
      this.dsEmergencyList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  newEmergency(){ 
    const dialogRef = this._matDialog.open(NewEmergencyComponent,
      {
        maxWidth: "100%",
        height: '70%',
        width: '65%', 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getEmergencyList();
    });
  }
}
export class EmergencyList {
 
  PatientName:string;
  Date: Number;
  RegNo:number;
  MobileNo:number;
  Doctorname:number; 
  constructor(EmergencyList) {
    {
      this.Date = EmergencyList.Date || 0;
      this.RegNo = EmergencyList.RegNo || 0;
      this.MobileNo = EmergencyList.MobileNo || 0; 
      this.Doctorname = EmergencyList.Doctorname || '';
      this.PatientName = EmergencyList.PatientName || '';
    }
  }
}