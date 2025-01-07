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
import { CategoryMasterService } from './category-master.service';
import { NewCategoryMasterComponent } from './new-category-master/new-category-master.component';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<CategoryMasterList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    // 'IsCancelled',
    'SurgeryCategoryId',
    'SurgeryCategoryName',
    'IsActive',
    'action'
  ];

  constructor(public _categoryMasterService: CategoryMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._categoryMasterService.myformSearch.controls; }

  getCategoryList(){
    debugger
    this.sIsLoading = 'loading-data';

    const categoryNameSearch = this._categoryMasterService.myformSearch.get("CategoryNameSearch").value || '';
  
    const D_data = {
      "SurgeryCategoryName": categoryNameSearch.trim() ? categoryNameSearch + '%' : '%', // Use '%' if search is empty
    };

    // var D_data = {
    //   "SurgeryCategoryName": this._categoryMasterService.myformSearch.get("CategoryNameSearch").value + '%' || '%',
    // }
    console.log("CategoryList:",D_data)
    this._categoryMasterService.getSurgeryCategoryListlist(D_data).subscribe(Visit => {
    this.dataSource.data = Visit as CategoryMasterList[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  newCategory(){
    const dialogRef = this._matDialog.open(NewCategoryMasterComponent,
      {
        maxWidth: "50%",
        width: "40%",
        height: "35%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCategoryList();
    });
  }
  
  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewCategoryMasterComponent,
      {
        maxWidth: "50%",
        width: "40%",
        height: "35%",
        data:{
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCategoryList();
    });
  }

  onDeactive(SurgeryCategoryId){
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
        const tableItem = this.dataSource.data.find(item => item.SurgeryCategoryId === SurgeryCategoryId);
        console.log("table:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_OT_SurgeryCategoryMaster set IsActive=0 where SurgeryCategoryId=" + SurgeryCategoryId;
        } else {
            Query = "Update M_OT_SurgeryCategoryMaster set IsActive=1 where SurgeryCategoryId=" + SurgeryCategoryId;
        }
    
        console.log("query:", Query);
    
        this._categoryMasterService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'SurgeryCategory Status has been Changed.', 'success');
                    this.getCategoryList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
  });
  }

  isLoading = true;

  CancleCategory(contact) {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 
    
    debugger
    Swal.fire({
      title: 'Do you want to cancel the Surgery Category?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        debugger
        let surgeryCategoryCancel = {};
        surgeryCategoryCancel['surgeryCategoryId'] = contact.SurgeryCategoryId;
        surgeryCategoryCancel['isCancelled'] = 1;
        surgeryCategoryCancel['isCancelledBy'] = this.accountService.currentUserValue.user.id;
        surgeryCategoryCancel['isCancelledDateTime'] = formattedDate;
  
        let submitData = {
          "cancelMOTSurgeryCategoryMasterParam": surgeryCategoryCancel,
        };

        console.log(submitData);
  
        this.isLoading = true;
  
        this._categoryMasterService.SurgeryCategoryCancle(submitData).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Record Cancelled Successfully.', 'Cancelled!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Record Data not Cancelled! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
            this.getCategoryList();
  
            this.isLoading = false;
          },
          (error) => {
            
            this.toastr.error('An error occurred while canceling the appointment.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.isLoading = false;
          }
        );
      } else {
        this.getCategoryList();
      }
    });
  }

  onClear() {
    this._categoryMasterService.myformSearch.reset({
      TemplateNameSearch: "",
    });
    this.getCategoryList();
  }

}
export class CategoryMasterList {
  SurgeryCategoryId:number;
  SurgeryCategoryName:string;
  IsDeleted:String;
  IsActive:string;
  IsCancelled: boolean;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CategoryMasterList) {
    {
      this.SurgeryCategoryId = CategoryMasterList.SurgeryCategoryId || '';
      this.SurgeryCategoryName = CategoryMasterList.SurgeryCategoryName || '';
      this.IsDeleted = CategoryMasterList.IsDeleted;
      this.IsActive = CategoryMasterList.IsActive || '';
      this.IsCancelled = CategoryMasterList.IsCancelled;
    }
  }
}