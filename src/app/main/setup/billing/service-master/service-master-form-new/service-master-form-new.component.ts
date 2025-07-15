import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form-new.component.html",
    styleUrls: ["./service-master-form-new.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ServiceMasterFormNewComponent implements OnInit {
    constructor(public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,

        public dialogRef: MatDialogRef<ServiceMasterComponent>,
    ) { }

    ServiceList: any[] = [];
    ColumnList: any[] = [];
    getClassValue(item: any, classId: number): number {
        return item.columnValues.find(x => x.classId === classId)?.classValue ?? 0;
    }

    setClassValue(item: any, classId: number, value: any) {
        const found = item.columnValues.find(x => x.classId === classId);
        if (found) {
            found.classValue = value;
        } else {
            item.columnValues.push({
                classId: classId,
                classValue: Number(value)
            });
        }
    }
    ngOnInit(): void {
        this._serviceMasterService.getServicesNew(1).subscribe((response) => {
            this.ServiceList = response.data;
            this.ColumnList = response.columns;
        });
    }


    onSubmit() {
        var data = { TariffId: 1, Data: this.ServiceList,Columns:[] };
        this._serviceMasterService.saveServicesNew(data).subscribe(() => {
            debugger
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}