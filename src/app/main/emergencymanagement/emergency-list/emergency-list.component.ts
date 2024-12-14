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
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-emergency-list',
  templateUrl: './emergency-list.component.html',
  styleUrls: ['./emergency-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmergencyListComponent implements OnInit {
  displayedColumns = [
    'EmgDate',
    'PatientName',
    'MobileNo',
    'Address',
    'City',
    'DepartementName',
    'Doctorname', 
    'AddedBy',
    'Action'
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
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getEmergencyList();
  }

  getEmergencyList() {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "From_Dt":this.datePipe.transform(this._EmergencyListService.MySearchGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt":  this.datePipe.transform(this._EmergencyListService.MySearchGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "FirstName":this._EmergencyListService.MySearchGroup.get('F_Name').value + '%' || '%',
      "LastName":this._EmergencyListService.MySearchGroup.get('L_Name').value + '%' || '%'
    }
    console.log("gafhgfh:",vdata);

    this._EmergencyListService.getEmergencyList(vdata).subscribe(data => {
    this.dsEmergencyList.data = data as EmergencyList[];

    console.log("hjhjdjadf:",this.dsEmergencyList.data)

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
        height: '85%',
        width: '75%', 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getEmergencyList();
    });
  }

  OnEdit(contact){ 
    debugger
    const dialogRef = this._matDialog.open(NewEmergencyComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '75%', 
        data: {
          Obj: contact
        }
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
  Address:any;
  City:string;
  DepartementName:any;
  AddedBy:any;

  constructor(EmergencyList) {
    {
      this.Date = EmergencyList.Date || 0;
      this.RegNo = EmergencyList.RegNo || 0;
      this.MobileNo = EmergencyList.MobileNo || 0; 
      this.Doctorname = EmergencyList.Doctorname || '';
      this.PatientName = EmergencyList.PatientName || '';
      this.Address=EmergencyList.Address || '',
      this.City=EmergencyList.City || '',
      this.DepartementName=EmergencyList.DepartementName || ''
      this.AddedBy=EmergencyList.AddedBy || ''
    }
  }
}