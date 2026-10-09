import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DietRequestService } from '../diet-request.service';
import { RequestMaster } from '../patient-diet-reauest.component';

@Component({
  selector: 'app-requestcardpopup',
  templateUrl: './requestcardpopup.component.html',
  styleUrls: ['./requestcardpopup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestcardpopupComponent implements OnInit {
  @Input() doctorData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();
  // emitted after the cards render, so the parent overlay can re-check above/below
  @Output() loaded = new EventEmitter<void>();

  doctorDetails: any = null;
  isLoading: boolean = false;

  Accepted: boolean = false;
  Delivered: boolean = false;
  Acceptedcnt = 0;
  Deliveredcnt = 0;

  dataSource = new MatTableDataSource<RequestMaster>();
  detailList: any[] = [];

  constructor(
    public _DietRequestService: DietRequestService,
    private _formBuilder: FormBuilder,
    private commonService: PrintserviceService,
    public _matDialog: MatDialog,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.doctorData) {
      this.GetDetails(this.doctorData);
    } else {
      this.doctorDetails = this.doctorData;
    }
  }

  GetDetails(data) {
    const DietReqId = String(data.dietReqId);

    const requestData = {
      "first": 0,
      "rows": 999,
      "sortField": "DietReqDetId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "DietReqId", "fieldValue": DietReqId, "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": []
    };

    this._DietRequestService.getRequestdetaillist(requestData).subscribe((response) => {
      this.detailList = response.data || [];
      setTimeout(() => this.loaded.emit()); // wait for cards to render
    }, (error) => {
      this.toastr.error(error.message);
    });
  }

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }
}