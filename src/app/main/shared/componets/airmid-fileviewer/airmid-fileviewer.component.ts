import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { ApiCaller } from 'app/core/services/apiCaller';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'airmid-fileviewer',
    templateUrl: './airmid-fileviewer.component.html',
    styleUrls: ['./airmid-fileviewer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AirmidFileViewerComponent {
    @Output() onCloseDialog = new EventEmitter<any>();
    @Input() refId: number = 0;
    @Input() refType: PageNames = PageNames.NONE;
    @Input() multiple: boolean = false;
    @Input() title: string = '';
    @Input() patientName: string = '';
    safeUrl: SafeResourceUrl;

    constructor(private _service: ApiCaller,
        public dialogRef: MatDialogRef<AirmidFileViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer

    ) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    }
    ngOnDestroy() {
        if (this.data.url.startsWith('blob:')) {
            URL.revokeObjectURL(this.data.url);
        }
    }

}