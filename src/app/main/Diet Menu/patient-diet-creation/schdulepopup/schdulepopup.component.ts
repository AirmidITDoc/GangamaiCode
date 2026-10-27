import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Optional, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DietCreationService } from '../diet-creation.service';


interface FoodItem { dietName: string; dietMenuName: string; mealName: string; }
@Component({
  selector: 'app-schdulepopup',
  templateUrl: './schdulepopup.component.html',
  styleUrls: ['./schdulepopup.component.scss']
})
export class SchdulepopupComponent {
  @Input() dietData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();
  @Output() loaded = new EventEmitter<void>();

  detailList: any[] = [];
  isLoading = false;

  Accepted: boolean = false;
  Delivered: boolean = false;
  Acceptedcnt = 0;
  Deliveredcnt = 0;

  dataSource = new MatTableDataSource<RequestMaster>();

   constructor(
    public _DietRequestService: DietCreationService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) private injectedData: any
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dietData'] && this.dietData?.dietPlanId) {
      this.GetDetails(this.dietData);
    }
  }

   ngOnInit(): void {
    const data = this.dietData ?? this.injectedData;   // portal gives injectedData
    if (data?.dietPlanId) {
      this.GetDetails(data);
    }
  }

  GetDetails(data: any) {
    this.isLoading = true;

    const requestData = {
      first: 0,
      rows: 999,
      sortField: 'DietPlanId',
      sortOrder: 0,
      filters: [
        { fieldName: 'DietPlanId', fieldValue: String(data.dietPlanId), opType: 'Equals' }
      ],
      exportType: 'JSON',
      columns: []
    };

    this._DietRequestService.getRequestdetaillist(requestData).subscribe({
      next: (res: any) => {
        console.log('schedule popup response', res);
        this.detailList = Array.isArray(res) ? res : (res?.data ?? []);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.loaded.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.message);
      }
    });
  }

  onMouseEnter() { this.mouseEnter.emit(); }
  onMouseLeave() { this.mouseLeave.emit(); }
}


export class RequestMaster {
  visitId: number;
  isCancelled: any;
  isAccept: any;
  isDelived: any;
  detIsCancelled: any;
  allAccepted: any;
  allDelivered: any;
  acceptedCount: any;
  deliveredCount: any;
  notAcceptedCount: any;
  notDeliveredCount: any;
  /**
   * Constructor
   *
   * @param RequestMaster
   */
  constructor(RequestMaster) {
    {
      this.visitId = RequestMaster.visitId || 0;
      this.isCancelled = RequestMaster.isCancelled || 0;
      this.isAccept = RequestMaster.isAccept || '';
      this.isDelived = RequestMaster.isDelived || "";
      this.detIsCancelled = RequestMaster.detIsCancelled || "";
      this.allAccepted = RequestMaster.allAccepted || 0;
      this.allDelivered = RequestMaster.allDelivered || '';
      this.acceptedCount = RequestMaster.acceptedCount || "";
      this.deliveredCount = RequestMaster.deliveredCount || "";
      this.notAcceptedCount = RequestMaster.notAcceptedCount || "";
      this.notDeliveredCount = RequestMaster.notDeliveredCount || "";

    }
  }

}