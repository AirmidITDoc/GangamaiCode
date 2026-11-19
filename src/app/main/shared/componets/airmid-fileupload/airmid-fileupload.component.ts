import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
// import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';
import { BaseFormControlComponent } from '../base-form-control-component';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import { fuseAnimations } from '@fuse/animations';
import { AirmidImageviewComponent } from '../airmid-imageview/airmid-imageview.component';
import { AirmidFileViewerComponent } from '../airmid-fileviewer/airmid-fileviewer.component';
import { ToastrService } from 'ngx-toastr';
import { verifiedImageType } from './file-safety';

@Component({
    selector: 'airmid-fileupload',
    templateUrl: './airmid-fileupload.component.html',
    styleUrls: ['./airmid-fileupload.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AirmidFileuploadComponent extends BaseFormControlComponent implements OnInit {
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
    imageOnly = false;
    validatingFiles = false;

    // constructor(private sanitizer: DomSanitizer, private _service: ApiCaller, el: ElementRef,public _matDialog: MatDialog,
    //     @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AirmidFileuploadComponent>) {
    //     super(el);
    // }

    allowedExtensions: string[] = [
        'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp',
        'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'
    ];

    constructor(private _service: ApiCaller, private toastr: ToastrService, el: ElementRef, public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AirmidFileuploadComponent>) {
        super(el);
    }

    ngOnInit(): void {
        if (this.data) {
            this.refId = this.data.refId;
            this.refType = this.data.refType;
            this.multiple = this.data.multiple;
            this.imageOnly = this.data.imageOnly === true;
            // if (this.imageOnly) {
            //     this.accept = '.jpg,.jpeg,.png,.gif,.webp';
            // }
            if (this.imageOnly) {
                this.accept = '.jpg,.jpeg,.png,.gif,.webp';
            } else if (!this.accept) {
                this.accept = '.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.doc,.docx,.xls,.xlsx,.csv,.txt';
            }
        }
        if (this.refId > 0) {
            this._service.GetData("Files/get-files?RefId=" + this.refId + "&RefType=" + this.refType).subscribe((data) => {
                this.files = data;
            });
        }
    }
    // onSubmit(): void {
    //     debugger
    //     if (this.files.length > 0) {
    //         this._service.PostFromData("Files/save-files", { MDoctorFiles: this.files }).subscribe((data) => {
    //             this.dialogRef.close();
    //         });
    //     }
    // }

    async onSubmit(): Promise<void> {

        if (this.validatingFiles) {
            this.toastr.warning(
                'Please wait for file validation to finish.',
                'Upload'
            );
            return;
        }

        this.validatingFiles = true;

        try {

            for (const file of this.files) {

                if (
                    !file.isDelete &&
                    file.Document instanceof File
                ) {

                    const isValid = await this.validateFile(
                        file.Document
                    );

                    if (!isValid) {
                        return;
                    }
                }
            }

        } catch (error) {

            console.error('File validation failed', error);

            this.toastr.error(
                'Could not validate the selected files.',
                'Upload'
            );

            return;

        } finally {
            this.validatingFiles = false;
        }

        if (this.files.length > 0) {

            this._service.PostFromData(
                "Files/save-files",
                { MDoctorFiles: this.files }
            ).subscribe((data) => {

                if (data) {
                    this.dialogRef.close();
                }

            });

        }
    }

    // async onSubmit(): Promise<void> {
    //     if (this.validatingFiles) {
    //         this.toastr.warning('Please wait for file validation to finish.', 'Upload');
    //         return;
    //     }
    //     if (this.imageOnly) {
    //         this.validatingFiles = true;
    //         try {
    //             for (const file of this.files) {
    //                 if (!file.isDelete && file.Document instanceof File && !await verifiedImageType(file.Document, file.docName)) {
    //                     this.toastr.error('Only valid JPEG, PNG, GIF or WebP images can be uploaded here. PDF uploads are temporarily unavailable.', 'Invalid file');
    //                     return;
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('File validation failed', error);
    //             this.toastr.error('Could not validate the selected files. Please try again.', 'Upload');
    //             return;
    //         } finally {
    //             this.validatingFiles = false;
    //         }
    //     }
    //     if (this.files.length > 0) {
    //         this._service.PostFromData("Files/save-files", { MDoctorFiles: this.files }).subscribe((data) => {
    //             this.dialogRef.close();
    //             if (data) this.dialogRef.close();
    //         });
    //     }
    // }

    onClick(event) {
        if (this.fileUpload)
            this.fileUpload.nativeElement.click()
    }

    onInput(event) {

    }

    // async onFileSelected(event: Event): Promise<void> {
    //     const input = event.target as HTMLInputElement;
    //     const selectedFiles = Array.from(input.files || []);
    //     if (this.validatingFiles || selectedFiles.length === 0) return;
    //     this.validatingFiles = true;
    //     try {
    //         if (this.imageOnly) {
    //             for (const selectedFile of selectedFiles) {
    //                 if (!await verifiedImageType(selectedFile, selectedFile.name)) {
    //                     this.toastr.error('Only valid JPEG, PNG, GIF or WebP images can be uploaded here. PDF uploads are temporarily unavailable.', 'Invalid file');
    //                     input.value = '';
    //                     return;
    //                 }
    //             }
    //         }
    //         if (!this.multiple) {
    //             this.files = [];
    //         }
    //         for (const selectedFile of selectedFiles) {
    //             const nextSrNo = (this.files.length > 0) ? Math.max(...this.files.map((x: { srNo: any; }) => x.srNo)) + 1 : 1;
    //             this.files.push({
    //                 srNo: nextSrNo, Document: selectedFile, refId: this.refId, refType: this.refType,
    //                 id: 0,
    //                 docName: selectedFile.name,
    //                 docSavedName: '',
    //                 isDelete: false, base64: ''
    //             });
    //         }
    //         this.filesChange.emit(this.files);
    //         input.value = '';
    //     } catch (error) {
    //         console.error('File validation failed', error);
    //         this.toastr.error('Could not validate the selected files. Please try again.', 'Upload');
    //         input.value = '';
    //     } finally {
    //         this.validatingFiles = false;
    //     }
    // }

    async onFileSelected(event: Event): Promise<void> {

        const input = event.target as HTMLInputElement;
        const selectedFiles = Array.from(input.files || []);

        if (this.validatingFiles || selectedFiles.length === 0) return;

        this.validatingFiles = true;

        try {

            const validFiles: File[] = [];

            // Validate all selected files first
            for (const selectedFile of selectedFiles) {

                const isValid = await this.validateFile(selectedFile);

                if (isValid) {
                    validFiles.push(selectedFile);
                }
            }

            // If no valid files, don't add anything
            if (validFiles.length === 0) {
                input.value = '';
                return;
            }

            // Single file selection
            if (!this.multiple) {
                this.files = [];
            }

            // Add only validated files
            for (const selectedFile of validFiles) {

                const nextSrNo = this.files.length > 0
                    ? Math.max(...this.files.map(x => x.srNo)) + 1
                    : 1;

                this.files.push({
                    srNo: nextSrNo,
                    Document: selectedFile,
                    refId: this.refId,
                    refType: this.refType,
                    id: 0,
                    docName: selectedFile.name,
                    docSavedName: '',
                    isDelete: false,
                    base64: ''
                });
            }

            this.filesChange.emit(this.files);

        } catch (error) {

            console.error('File validation failed', error);

            this.toastr.error(
                'Could not validate the selected files.',
                'Upload'
            );

        } finally {

            this.validatingFiles = false;
            input.value = '';

        }
    }

    // onFileSelected(event) {
    //     const selectedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    //     if (!this.multiple) {
    //         this.files = []
    //     }
    //     for (let i = 0; i < selectedFiles.length; i++) {
    //         const selectedFile = selectedFiles[i];
    //         const nextSrNo = (this.files.length > 0) ? Math.max(...this.files.map((x: { srNo: any; }) => x.srNo)) + 1 : 1;
    //         this.files.push({
    //             srNo: nextSrNo, Document: selectedFile, refId: this.refId, refType: this.refType,
    //             id: 0,
    //             docName: selectedFile.name,
    //             docSavedName: '',
    //             isDelete: false, base64: ''
    //         });
    //     }
    //     this.filesChange.emit(this.files);
    // }

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

    viewFile(file: AirmidFileModel): void {
        // Case: newly uploaded (local File object)
        if (file.Document instanceof File) {
            // const ext = file.docName.split('.').pop()?.toLowerCase();
            // const url = URL.createObjectURL(file.Document);

            // this.openViewer(url, file.docName, this.getFileType(ext));
            void this.openViewer(file.Document, file.docName);
            return;
        }

        // Case: already saved in DB -> fetch from backend
        this._service.downloadFile("Files/get-file?Id=" + file.id, null, 2, file.docName, false)
            // .subscribe((blob: Blob) => {
            //     const ext = file.docName.split('.').pop()?.toLowerCase();
            //     const url = URL.createObjectURL(blob);

            //     this.openViewer(url, file.docName, this.getFileType(ext));
            // });
            .subscribe({
                next: (blob: Blob) => void this.openViewer(blob, file.docName),
                error: () => this.toastr.error('Unable to load the file.', 'File preview')
            });
    }

    private getFileType(ext: string | undefined): string {
        if (!ext) return 'other';
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    }

    // private openViewer(url: string, fileName: string, type: string): void {
    //     this._matDialog.open(AirmidFileViewerComponent, {
    //         width: '80%',
    //         height: '90%',
    //         data: { url, fileName, type }
    //     });
    // }
    private async openViewer(blob: Blob, fileName: string): Promise<void> {
        try {
            const imageType = await verifiedImageType(blob, fileName);
            const safeBlob = new Blob([blob], { type: imageType || 'application/octet-stream' });
            const url = URL.createObjectURL(safeBlob);
            this._matDialog.open(AirmidFileViewerComponent, {
                width: '80%',
                height: '90%',
                data: { url, fileName, type: imageType ? 'image' : 'other' }
            });
        } catch (error) {
            console.error('File preview failed', error);
            this.toastr.error('Unable to open the file preview.', 'File preview');
        }
    }

    // private isAllowedFile(file: File): boolean {

    //     const extension = file.name.split('.').pop()?.toLowerCase();

    //     if (!extension || !this.allowedExtensions.includes(extension)) {
    //         return false;
    //     }

    //     if (this.imageOnly) {
    //         return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    //     }

    //     return true;
    // }

    async validateFile(file: File): Promise<boolean> {

        const extension = file.name.split('.').pop()?.toLowerCase();

        // Check allowed extension
        if (!extension || !this.allowedExtensions.includes(extension)) {
            this.toastr.error(
                `File type not allowed: ${file.name}`,
                'Invalid file'
            );
            return false;
        }

        // Validate image files using actual file content
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
            const validImage = await verifiedImageType(file, file.name);

            if (!validImage) {
                this.toastr.error(
                    'Invalid image file.',
                    'Invalid file'
                );
                return false;
            }
        }

        // Basic PDF JavaScript check
        if (extension === 'pdf') {

            const content = await file.text();

            const dangerousPatterns = [
                /\/JavaScript\b/i,
                /\/JS\b/i,
                /\/Launch\b/i,
                /\/EmbeddedFiles\b/i,
                /\/AA\b/i
            ];

            if (dangerousPatterns.some(pattern => pattern.test(content))) {
                this.toastr.error(
                    `PDF contains unsupported active content: ${file.name}`,
                    'Invalid PDF'
                );
                return false;
            }
        }

        return true;
    }

}
export class AirmidFileModel {
    srNo: number;
    id: number;
    refId: number;
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
    NONE = "NONE", DOCTOR = "Doctor", DOCTOR_SIGNATURE = "Doctor_Signature",
    PATIENT = "Patient_Files", PATIENT_SIGNATURE = "Patient_Signature", PATIENT_PHOTO = "Patient_Photo", PATIENT_PATHFILES = "Patient_PathFiles",
    HOSPITAL_LOGO = "Logo", USER_SIGNATURE = "User_Signature", Stamp = "Stamp_Upload",
    LABPATIENT = "LabPatient_Files", NABH = "NABH", Img_Upload = "Img_Upload", EMP_FILES = "Emp_Files", EMP_PHOTO = 'Employee_Photo',
    TrustHusbandPhoto = 'TrustHusband_Photo', TrustWifePhoto = 'TrustWife_Photo'
}
