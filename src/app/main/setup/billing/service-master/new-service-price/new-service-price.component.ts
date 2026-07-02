import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Servicedetail, ServiceMaster, ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";
import { TariffComponent } from "../tariff/tariff.component";

@Component({
  selector: 'app-new-service-price',
  templateUrl: './new-service-price.component.html',
  styleUrls: ['./new-service-price.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewServicePriceComponent {


  constructor(public _serviceMasterService: ServiceMasterService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,

    public dialogRef: MatDialogRef<ServiceMasterComponent>,
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'classId',
    'className',
    'classRate',
    'patientRate',
    'cpRate'
    // 'action'
  ];

  ServiceId = 0;
 vTariffId: any = 0;
  registerObj = new ServiceMaster({});
  DSServicedetailList = new MatTableDataSource<Servicedetail>();

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data;
      this.ServiceId = this.registerObj.serviceId;
    }
    this.getClassList()
  }


  classList: any = [];
  getClassList() {
    debugger
    if (this.ServiceId) {
      const param = {
        "first": 0,
        "rows": 999,
        "sortField": "ServiceDetailId",
        "sortOrder": 0,
        "filters": [
          { "fieldName": "ServiceId", "fieldValue": String(this.ServiceId), "opType": "Equals" },
          { "fieldName": "TariffId", "fieldValue": String(this.vTariffId), "opType": "Equals" }
        ],
        "Columns": [],
        "exportType": "JSON"
      }
      console.log(param)
      this._serviceMasterService.getClassMasterListRetrive(param).subscribe(Menu => {

        this.DSServicedetailList.data = Menu.data as Servicedetail[];
        console.log(this.DSServicedetailList.data)
      });
    } else {

      const param1 = {
        "first": 0,
        "rows": 999,
        "sortField": "ClassId",
        "sortOrder": 0,
        "filters": [
        ],
        "exportType": "JSON",
        "columns": [
        ]
      }
      this._serviceMasterService.getClassMasterList(param1).subscribe(Menu => {
        this.DSServicedetailList.data = Menu.data as Servicedetail[];
        this.DSServicedetailList.data.forEach(element => {
          this.classList.push({
            ...element,          // copy existing data
            patientRate: 0,      // new field
            cprate: 0,            // new field (fix name)
            isRateEdited: false //if dont want then comment
          });
        });
        this.DSServicedetailList.data = this.classList
        console.log(this.DSServicedetailList.data)
      });
    }
  }
}
