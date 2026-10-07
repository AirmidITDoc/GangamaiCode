import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietRequestService } from '../diet-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-diet-req-wokflow',
  templateUrl: './diet-req-wokflow.component.html',
  styleUrls: ['./diet-req-wokflow.component.scss']
})
export class DietReqWokflowComponent {

  requests: DietRequest[] = [];

  totalRows = 0;

  loading = false;

  errorMessage = '';

  selectedRequest: DietRequest | null = null;

  showDetails = false;

  filters = {
    fromDate: this.formatDate(new Date()),
    toDate: this.formatDate(new Date()),
    dietReqId: null as number | null
  };

  page = 0;

  pageSize = 10;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  ReqId = 0
  constructor(
    private _DietRequestService: DietRequestService, public _matDialog: MatDialog, public datePipe: DatePipe
    , @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    debugger


    this.ReqId = this.data.dietReqId
    this.loadRequests();

  }

  // ============================================================
  // LOAD DATA
  // ============================================================

  loadRequests(): void {

    this.loading = true;
    this.errorMessage = '';

    const filters: any[] = [];

    filters.push(

      {
        "fieldName": "From_Dt",
        "fieldValue": String(this.fromDate),
        "opType": "Contains"
      },
      {
        "fieldName": "To_Dt",
        "fieldValue": String(this.toDate),
        "opType": "Contains"
      },
      {
        "fieldName": "DietReqId",
        "fieldValue": String(this.ReqId),
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999,
      "sortField": "DietReqId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };

    this._DietRequestService.getRequestlist(data).subscribe((response) => {

      next: (response: DietRequestResponse) => {

        this.totalRows = response.total_row || 0;

        this.requests = response.data || [];

      }
    });
  }

  // ============================================================
  // SEARCH
  // ============================================================

  applyFilter(): void {

    this.page = 0;

    this.loadRequests();
  }

  clearFilter(): void {

    const today = this.formatDate(new Date());

    this.filters = {
      fromDate: today,
      toDate: today,
      dietReqId: null
    };

    this.page = 0;

    this.loadRequests();
  }

  refresh(): void {

    this.loadRequests();
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  get totalPages(): number {

    return Math.ceil(this.totalRows / this.pageSize);
  }

  get currentPage(): number {

    return this.page + 1;
  }

  nextPage(): void {

    if (this.page + 1 < this.totalPages) {

      this.page++;

      this.loadRequests();
    }
  }

  previousPage(): void {

    if (this.page > 0) {

      this.page--;

      this.loadRequests();
    }
  }

  // ============================================================
  // WORKFLOW
  // ============================================================

  getCurrentStep(request: DietRequest): number {

    if (request.isCancelled) {
      return 0;
    }

    /*
      STEP 1
      Patient Review
      Request exists.

      STEP 2
      Diet Plan Creation
      Header exists and DietMenu exists.

      STEP 3
      Kitchen Order Management
      Some/all details accepted.

      STEP 4
      Meal Delivery
      Some/all meals delivered.

      STEP 5
      Reports
      All meals delivered.
    */

    if (!request.totalDetailCount) {
      return 2;
    }

    if (request.allDelivered === 1) {
      return 5;
    }

    if (request.deliveredCount > 0) {
      return 4;
    }

    if (request.allAccepted === 1) {
      return 4;
    }

    if (request.acceptedCount > 0) {
      return 3;
    }

    return 2;
  }

  getStepClass(
    request: DietRequest,
    step: number
  ): string {

    if (request.isCancelled) {

      return 'cancelled';
    }

    const currentStep =
      this.getCurrentStep(request);

    if (step < currentStep) {

      return 'completed';
    }

    if (step === currentStep) {

      return 'current';
    }

    return 'pending';
  }

  isStepComplete(
    request: DietRequest,
    step: number
  ): boolean {

    if (request.isCancelled) {
      return false;
    }

    return this.getCurrentStep(request) > step;
  }

  // ============================================================
  // OVERALL STATUS
  // ============================================================

  getOverallStatus(
    request: DietRequest
  ): string {

    if (request.isCancelled) {

      return 'Cancelled';
    }

    if (
      request.allDelivered === 1 &&
      request.totalDetailCount > 0
    ) {

      return 'Completed';
    }

    if (request.allAccepted === 1) {

      return 'Ready for Delivery';
    }

    if (request.deliveredCount > 0) {

      return 'Partially Delivered';
    }

    if (request.acceptedCount > 0) {

      return 'Kitchen In Progress';
    }

    return 'Pending Kitchen';
  }

  getOverallStatusClass(
    request: DietRequest
  ): string {

    if (request.isCancelled) {

      return 'status-cancelled';
    }

    if (
      request.allDelivered === 1 &&
      request.totalDetailCount > 0
    ) {

      return 'status-completed';
    }

    if (
      request.deliveredCount > 0 ||
      request.acceptedCount > 0
    ) {

      return 'status-progress';
    }

    return 'status-pending';
  }

  // ============================================================
  // PROGRESS
  // ============================================================

  getProgress(
    request: DietRequest
  ): number {

    if (request.isCancelled) {

      return 0;
    }

    const total =
      Number(request.totalDetailCount || 0);

    if (total === 0) {

      return 40;
    }

    const acceptedRatio =
      Math.min(
        request.acceptedCount / total,
        1
      );

    const deliveredRatio =
      Math.min(
        request.deliveredCount / total,
        1
      );

    /*
      20% Patient/Diet plan
      20% Kitchen
      40% Delivery
      20% Reports
    */

    let progress =
      20 +
      acceptedRatio * 20 +
      deliveredRatio * 40;

    if (
      request.allDelivered === 1
    ) {

      progress = 100;
    }

    return Math.round(
      Math.min(progress, 100)
    );
  }

  // ============================================================
  // ACCEPTANCE %
  // ============================================================

  getAcceptedPercentage(
    request: DietRequest
  ): number {

    if (!request.totalDetailCount) {
      return 0;
    }

    return Math.round(
      (
        request.acceptedCount /
        request.totalDetailCount
      ) * 100
    );
  }

  // ============================================================
  // DELIVERY %
  // ============================================================

  getDeliveredPercentage(
    request: DietRequest
  ): number {

    if (!request.totalDetailCount) {
      return 0;
    }

    return Math.round(
      (
        request.deliveredCount /
        request.totalDetailCount
      ) * 100
    );
  }

  // ============================================================
  // VIEW DETAILS
  // ============================================================

  viewDetails(
    request: DietRequest
  ): void {

    this.selectedRequest = request;

    this.showDetails = true;
  }

  closeDetails(): void {

    this.showDetails = false;

    this.selectedRequest = null;
  }

  // ============================================================
  // DATE
  // ============================================================

  private formatDate(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

export interface DietRequest {

  dietReqId: number;

  dietReqNo: number | string;

  date: string;

  dietMenuId: number;

  dietMenuCode: string;

  dietMenuName: string;

  createdBy: number;

  createdByUser: string;

  createdDate: string;

  modifiedBy?: number;

  modifiedDate?: string;

  modifiedUser?: string;

  isCancelled: boolean;

  cancelledUser?: string;

  totalDetailCount: number;

  acceptedCount: number;

  notAcceptedCount: number;

  deliveredCount: number;

  notDeliveredCount: number;

  allAccepted: number;

  allDelivered: number;
}


export interface DietRequestResponse {

  total_row: number;

  data: DietRequest[];
}

