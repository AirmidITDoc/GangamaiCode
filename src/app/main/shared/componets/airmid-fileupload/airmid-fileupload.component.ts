import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
    selector: 'airmid-fileupload',
    templateUrl: './airmid-fileupload.component.html',
    styleUrls: ['./airmid-fileupload.component.scss']
})
export class AirmidFileuploadComponent implements OnInit {
    @Input() multiple: boolean = false;
    @Input() accept
    @Input() auto = true
    @Input() chooseLabel = 'Choose'
    @Input() uploadLabel = 'Upload'
    @Input() cancelLabel = 'Cance'
    @Input() deleteButtonIcon = 'delete'
    @Input() refType: PageNames
    @Input() refId: number = 0;
    @Input() files: AirmidFileModel[] = [];
    @Output() filesChange = new EventEmitter<AirmidFileModel[]>();
    @ViewChild('fileUpload')
    fileUpload: ElementRef
    inputFileName: string
    constructor(private sanitizer: DomSanitizer, private _service: ApiCaller,
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AirmidFileuploadComponent>) {

    }
    ngOnInit(): void {
        if (this.data) {
            this.refId = this.data.refId;
            this.refType = this.data.refType;
            this.multiple = this.data.multiple;
        }
        if (this.refId > 0) {
            this._service.GetData("Files/get-files?RefId=" + this.refId + "&RefType=" + this.refType).subscribe((data) => {
                this.files = data;
            });
        }
    }
    onSubmit(): void {
        if (this.files.length > 0) {
            this._service.PostFromData("Files/save-files", { MDoctorFiles: this.files }).subscribe((data) => {

            });
        }
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
                srNo: nextSrNo, Document: selectedFile, refId: this.refId, refType: this.refType,
                id: 0,
                docName: selectedFile.name,
                docSavedName: '',
                isDelete: false, base64: ''
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
    onClose() {
        this.dialogRef.close();
    }
    getFileIcon(fileName: string): string {
        const ext = fileName.split('.').pop()?.toLowerCase();

        switch (ext) {
            case 'pdf':
                return 'picture_as_pdf';
            case 'doc':
            case 'docx':
                return 'description';
            case 'xls':
            case 'xlsx':
                return 'table_chart';
            case 'ppt':
            case 'pptx':
                return 'slideshow';
            case 'txt':
                return 'article';
            case 'zip':
            case 'rar':
                return 'folder_zip';
            case 'mp3':
            case 'wav':
                return 'audiotrack';
            case 'mp4':
            case 'mov':
            case 'avi':
                return 'movie';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                return 'image';
            default:
                return 'insert_drive_file'; // default generic file icon
        }
    }

    getPreview(file: File): string | null {
        if (file == null || !file.type.startsWith('image/')) return null;
        return URL.createObjectURL(file);
    }

    downloadFile(file: AirmidFileModel): void {
        this._service.downloadFile("Files/get-file?Id=" + file.id, null, 2, file.docName).subscribe((data) => {

        });
    }
}
export class AirmidFileModel {
    srNo: Number;
    id: Number;
    refId: Number;
    refType: PageNames;
    docName: string;
    docSavedName: string;
    Document: File;
    isDelete: boolean;
    base64: string;
    constructor(AirmidFileModel: { srNo: number, id: number; refId: number; base64: string, refType: PageNames; docName: string; docSavedName: string; document: File, isDelete: boolean }) {
        this.srNo = AirmidFileModel.srNo || 0;
        this.id = AirmidFileModel.id || 0;
        this.refId = AirmidFileModel.refId || 0;
        this.refType = AirmidFileModel.refType || PageNames.NONE;
        this.docName = AirmidFileModel.docName || '';
        this.docSavedName = AirmidFileModel.docSavedName || '';
        this.Document = AirmidFileModel.document || null;
        this.isDelete = AirmidFileModel.isDelete || false;
        this.base64 = AirmidFileModel.base64 || '';
    }
}
export enum PageNames {
    NONE = "NONE", DOCTOR = "Doctor", DOCTOR_SIGNATURE = "Doctor_Signature",PATIENT = "Patient", PATIENT_SIGNATURE = "Patient_Signature"
}
