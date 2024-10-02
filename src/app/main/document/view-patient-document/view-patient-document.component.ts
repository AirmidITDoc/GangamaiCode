import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { DocumentManagementService } from "../document-management.service";

@Component({
    selector: "app-view-patient-document",
    templateUrl: "./view-patient-document.component.html",
    styleUrls: ["./view-patient-document.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ViewPatientDocumentManagementComponent implements OnInit {
    ParentDataList: any;
    msg: any;
    IsLoading: string = "";
    docList: any = [];
    constructor(
        public _documentManagementService: DocumentManagementService,
        public toastr: ToastrService
    ) {}

    ngOnInit(): void {}
}
