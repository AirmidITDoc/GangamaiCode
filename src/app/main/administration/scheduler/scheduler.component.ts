import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { SchdulerService } from './scheduler.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';
import { ManageschedulerComponent } from './managescheduler/managescheduler.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SchdulerComponent implements OnInit {
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
        gridConfig: gridModel = {
            apiUrl: "Scheduler/List",
            columnsList: [
                { heading: "SchedulerName", key: "bankName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Hours", key: "hours", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "StartDate", key: "startDate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "EndData", key: "endDate", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data) // EDIT Records
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._SchdulerService.deactivateTheStatus(data.bankId).subscribe((response: any) => {
                                    this.toastr.success(response.Message);
                                    this.grid.bindGridData;
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "bankId",
            sortOrder: 0,
            filters: [
                { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ]
        }
    
        constructor(public _SchdulerService: SchdulerService,
             public _matDialog: MatDialog,
            public toastr: ToastrService,) { }
    
        ngOnInit(): void { }
    
        onSearchClear() {
            this._SchdulerService.myformSearch.reset({
                BankNameSearch: "",
                IsDeletedSearch: "2",
            });
    
        }
    
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(ManageschedulerComponent,
                {
                    maxWidth: "90vw",
                    height: '80%',
                    width: '90%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
                console.log('The dialog was closed - Action', result);
            });
        }
    
    }
//   myformSearch: FormGroup;
//   constructor(private formBuilder: UntypedFormBuilder,
//     private _ActRoute: Router,
//     public _matDialog: MatDialog,
//     public _UserService: CreateUserService,
//     private _SchdulerService: SchdulerService,
//     private dialogRef: MatDialogRef<SchdulerComponent>) { }

//   ngOnInit(): void {
//     this.myformSearch = this.createSearchForm();
//     this.getSchedulerList();
//   }
//   sIsLoading: string = '';
//   dataSource1 = new MatTableDataSource<ScheduleMaster>();
//   @ViewChild(MatSort) sort: MatSort;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   hasSelectedContacts: boolean;
//   displayedColumns: string[] = [
//     "SchedulerName",
//     "Hours",
//     "StartDate",
//     "EndDate",
//     "action"
//   ]
//   ScheduleName: string = "";
//   getSchedulerList() {
//     this.sIsLoading = 'loading-data';
//     this._SchdulerService.getSchedulers(this.ScheduleName).subscribe(Visit => {
//       this.dataSource1.data = Visit as unknown as ScheduleMaster[];
//       this.dataSource1.sort = this.sort;
//       this.dataSource1.paginator = this.paginator;
//       this.sIsLoading = '';
//       //this.click = false;
//     },
//       error => {
//         this.sIsLoading = '';
//       });
//   }
//   addScheduler() {
//     const dialogRef = this._matDialog.open(ManageschedulerComponent,
//       {
//         maxWidth: "85vw",
//         height: "auto",
//         width: '100%',
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       this.getSchedulerList();
//     });
//   }
//   editScheduler(data) {
//     const dialogRef = this._matDialog.open(ManageschedulerComponent,
//       {
//         maxWidth: "85vw",
//         height: "auto",
//         width: '100%',
//         data: data
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       this.getSchedulerList();
//     });
//   }

//   onDelete(id) {
//     Swal.fire({
//       title: "Are you sure to remove this scheduler?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this._SchdulerService.deleteScheduler(id).subscribe((ddata) => {
          
//           Swal.fire({
//             title: "Deleted!",
//             text: "Scheduler has been deleted.",
//             icon: "success"
//           });
//           this.getSchedulerList();
//         });
//       }
//     });
//   }

//   onClear() {
//     this.myformSearch.get("ScheduleName").setValue('');
//   }

//   onShow() {
    
//     this.ScheduleName=this.myformSearch.get("ScheduleName").value;
//     this.getSchedulerList();
//   }
//   createSearchForm(): FormGroup {
//     return this.formBuilder.group({
//       ScheduleName: ['']
//     });
//   }
// }
// export class ScheduleMaster {
//   Id: number;
//   ScheduleName: string;
//   StartDate: string;
//   EndDate: string;
//   Hours: string;
//   constructor(RoleMaster) {
//     {
//       this.Id = RoleMaster.RoleId || 0;
//       this.ScheduleName = RoleMaster.RoleName || "";
//       this.StartDate = RoleMaster.StartDate || "";
//       this.EndDate = RoleMaster.EndDate || "";
//       this.Hours = RoleMaster.Hours || "";
//     }
//   }

// }
