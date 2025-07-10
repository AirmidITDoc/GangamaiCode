import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'airmid-fileupload',
    templateUrl: './airmid-fileupload.component.html',
    styleUrls: ['./airmid-fileupload.component.scss']
})
export class AirmidFileuploadComponent {
    @Input() multiple: boolean = false;
    @Input() accept
    @Input() auto = true
    @Input() chooseLabel = 'Choose'
    @Input() uploadLabel = 'Upload'
    @Input() cancelLabel = 'Cance'
    @Input() deleteButtonIcon = 'delete'
    @Input() refType: PageNames
    @Input() refId: Number = 0;
    @Input() files: AirmidFileModel[] = [];
    @Output() filesChange = new EventEmitter<AirmidFileModel[]>();
    @ViewChild('fileUpload')
    fileUpload: ElementRef
    inputFileName: string
    constructor(private sanitizer: DomSanitizer) {

    }

    onClick(event) {
        if (this.fileUpload)
            this.fileUpload.nativeElement.click()
    }

    onInput(event) {

    }

    onFileSelected(event) {
        let selectedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        if (!this.multiple) {
            this.files = []
        }
        for (let i = 0; i < selectedFiles.length; i++) {
            let selectedFile = selectedFiles[i];
            var nextSrNo = (this.files.length > 0) ? Math.max(...this.files.map((x: { srNo: any; }) => x.srNo)) + 1 : 1;
            this.files.push({
                srNo: nextSrNo, file: selectedFile, refId: this.refId, refType: this.refType,
                id: 0,
                docName: selectedFile.name,
                docSavedName: '',
                isDelete: false
            });
        }
        this.filesChange.emit(this.files);
    }

    removeFile(event, srNO) {
        let ix
        if (this.files && -1 !== (ix = this.files.findIndex(x => x.srNo == srNO))) {
            if (this.files[ix].docSavedName)
                this.files[ix].isDelete = true;
            else
                this.files.splice(ix, 1)
            this.clearInputElement()
            this.filesChange.emit(this.files);
        }
    }

    clearInputElement() {
        this.fileUpload.nativeElement.value = ''
    }
    get filteredFiles() {
        return this.files?.filter(x => !x.isDelete) || [];
    }

}
export class AirmidFileModel {
    srNo: Number;
    id: Number;
    refId: Number;
    refType: Number;
    docName: string;
    docSavedName: string;
    file: File;
    isDelete: boolean;
    constructor(AirmidFileModel: { srNo: number, id: number; refId: number; refType: number; docName: string; docSavedName: string; file: File, isDelete: boolean }) {
        this.srNo = AirmidFileModel.srNo || 0;
        this.id = AirmidFileModel.id || 0;
        this.refId = AirmidFileModel.refId || 0;
        this.refType = AirmidFileModel.refType || 0;
        this.docName = AirmidFileModel.docName || '';
        this.docSavedName = AirmidFileModel.docSavedName || '';
        this.file = AirmidFileModel.file || null;
        this.isDelete = AirmidFileModel.isDelete || false;
    }
}
export enum PageNames {
    Doctor = 1
}
