import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ComponentPortal, Overlay, OverlayRef, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DietRequestService } from '../diet-request.service';
import { RequestMaster } from '../patient-diet-reauest.component';



@Component({
  selector: 'app-requestcardpopup',
  templateUrl: './requestcardpopup.component.html',
  styleUrls: ['./requestcardpopup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestcardpopupComponent {
  @Input() doctorData: any;
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  doctorDetails: any = null;
  isLoading: boolean = false;

  Accepted: boolean = false
  Delivered: boolean = false
  Acceptedcnt = 0
  Deliveredcnt = 0


  dataSource = new MatTableDataSource<RequestMaster>();


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
    }
    else {
      // Use available data from doctorData if doctorId is not available
      this.doctorDetails = this.doctorData;
    }
  }

  detailList: any[] = [];
  GetDetails(data) {
    console.log(data);

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
      console.log(response.data)
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
