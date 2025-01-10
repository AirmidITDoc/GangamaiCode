import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Row } from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ConsentMasterService } from './consent-master.service';
import { NewConsentMasterComponent } from './new-consent-master/new-consent-master.component';

@Component({
  selector: 'app-consent-master',
  templateUrl: './consent-master.component.html',
  styleUrls: ['./consent-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ConsentMasterComponent implements OnInit {

  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtConsentMasterList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = [
    'ConsentId',
    'ConsentName',
    'ConsentDesc',
    'DepartmentName',
    'CreatedBy',
    'IsActive',
    'action'
  ];

  constructor(public _otConsentService: ConsentMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getotConsentList();
  }

  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  // field validation 
  get f() { return this._otConsentService.myformSearch.controls; }

  getotConsentList(){
    debugger;
    this.sIsLoading = 'loading-data';
  
    // Check if there is a valid search term
    const otConsentNameSearch = this._otConsentService.myformSearch.get("OtConsentNameSearch").value || '';
  
    const D_data = {
      "ConsentName": otConsentNameSearch.trim() ? otConsentNameSearch + '%' : '%', // Use '%' if search is empty
    };
  
    console.log("TableList:", D_data);
  
    this._otConsentService.getOTConsentList(D_data).subscribe(
      Visit => {
        this.dataSource.data = Visit as OtConsentMasterList[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
      },
      error => {
        console.error("Error loading table data:", error);
        this.sIsLoading = '';
      }
    );
  }

  newConsent(){
    const dialogRef = this._matDialog.open(NewConsentMasterComponent,
      {
        maxWidth: "55vw",
        height: '50%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotConsentList();
    });
  }

  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewConsentMasterComponent,
      {
        maxWidth: "55vw",
        height: '50%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotConsentList();
    });
  }

  onClear() {
    this._otConsentService.myformSearch.reset({
      OtConsentNameSearch: "",
    });
    this.getotConsentList();
  }

}
export class OtConsentMasterList {
  ConsentId:number;
  ConsentName:string;
  IsActive:string;
  ConsentDesc:any;
  DepartmentName:any;
  CreatedBy:any;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.ConsentId = OtSiteDescMasterList.ConsentId || '';
      this.ConsentName = OtSiteDescMasterList.ConsentName || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';      
      this.ConsentDesc = OtSiteDescMasterList.ConsentDesc || '';
      this.DepartmentName = OtSiteDescMasterList.DepartmentName || '';
      this.CreatedBy=OtSiteDescMasterList.CreatedBy || '';
    }
  }
}
