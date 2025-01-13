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
import { NewOttypeMasterComponent } from './new-ottype-master/new-ottype-master.component';
import { OttypeMasterService } from './ottype-master.service';

@Component({
  selector: 'app-ottype-master',
  templateUrl: './ottype-master.component.html',
  styleUrls: ['./ottype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OttypeMasterComponent implements OnInit {

  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtTypeMasterList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = [
    'OtTypeId',
    'OtTypeName',
    'AddedBy',
    'IsActive',
    'action'
  ];

  constructor(public _otTypeMasterService: OttypeMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getotTypeList();
  }

  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._otTypeMasterService.myformSearch.controls; }

  getotTypeList(){
    debugger;
    this.sIsLoading = 'loading-data';
  
    // Check if there is a valid search term
    const otTypeNameSearch = this._otTypeMasterService.myformSearch.get("OtTypeNameSearch").value || '';
  
    const D_data = {
      "TypeName": otTypeNameSearch.trim() ? otTypeNameSearch + '%' : '%', // Use '%' if search is empty
    };
  
    console.log("TypeList:", D_data);
  
    this._otTypeMasterService.getOTTypelist(D_data).subscribe(
      Visit => {
        this.dataSource.data = Visit as OtTypeMasterList[];
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

  newOtType(){
    const dialogRef = this._matDialog.open(NewOttypeMasterComponent,
      {
        maxWidth: "50%",
        width: "40%",
        height: "32%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTypeList();
    });
  }

  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewOttypeMasterComponent,
      {
        maxWidth: "50%",
        width: "40%",
        height: "32%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTypeList();
    });
  }

  onClear() {
    this._otTypeMasterService.myformSearch.reset({
      OtTypeNameSearch: "",
    });
    this.getotTypeList();
  }

  onDeactive(OTTypeId){
    debugger
    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
    debugger

      if (result.isConfirmed) {
        let Query;
        const tableItem = this.dataSource.data.find(item => item.OTTypeId === OTTypeId);
        console.log("Type:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_OT_TypeMaster set IsActive=0 where OTTypeId=" + OTTypeId;
        } else {
            Query = "Update M_OT_TypeMaster set IsActive=1 where OTTypeId=" + OTTypeId;
        }
    
        console.log("query:", Query);
    
        this._otTypeMasterService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'OTType Status has been Changed.', 'success');
                    this.getotTypeList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
  });
  }

}
export class OtTypeMasterList {
  OTTypeId:number;
  TypeName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTypeMasterList) {
    {
      this.OTTypeId = OtTypeMasterList.OTTypeId || '';
      this.TypeName = OtTypeMasterList.TypeName || '';
      this.IsActive=OtTypeMasterList.IsActive || '';
    }
  }
}