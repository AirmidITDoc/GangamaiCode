import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import { fuseAnimations } from '@fuse/animations';
import { NewAbhaIntegrationService } from '../../new-abha-integration.service';
// import { AirmidFileViewerComponent } from '../airmid-fileviewer/airmid-fileviewer.component';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FileUploadComponent {
  @Input() multiple: boolean = false;
  @Input() accept
  @Input() auto = true
  @Input() chooseLabel = 'Choose'
  @Input() uploadLabel = 'Upload'
  @Input() cancelLabel = 'Cance'
  @Input() deleteButtonIcon = 'delete'
  @Input() opipid: number = 0;
  opipNumber: any;
  regno: any;
  opipType: any;

  @Input() files = [];
  @Output() filesChange = new EventEmitter<[]>();
  @ViewChild('fileUpload')
  fileUpload: ElementRef
  inputFileName: string
  selectedFile: File | null = null;
  savedFiles: any[] = [];

  constructor(private sanitizer: DomSanitizer, private _service: ApiCaller, el: ElementRef, public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FileUploadComponent>,
    public _abhaIntegrationService: NewAbhaIntegrationService) {
    // super(el);
  }

  ngOnInit(): void {
    if (this.data) {

      console.log('file upload:', this.data.data)
      this.opipid = this.data.data.visitId ?? this.data.data.admissionID;
      this.opipNumber = this.data.data.opdNo ?? this.data.data.ipdNo
      this.regno = this.data.regNo
      this.opipType = this.data.data.visitId ? 0 : 1;
      // this.multiple = this.data.multiple;
    }
    if (this.opipid > 0) {
      this.getSavedFiles()
    }
  }

  getSavedFiles() {
    if (!(this.opipid > 0)) return;

    const data = {
      first: 0,
      rows: 10,
      sortField: "FileId",
      sortOrder: 0,
      filters: [
        {
          fieldName: "OpIpId",
          fieldValue: String(this.opipid),
          opType: "Equals"
        }
      ],
      exportType: "JSON",
      columns: [
        { data: "string", name: "string" }
      ]
    };

    this._abhaIntegrationService.getfilelist(data).subscribe((res: any) => {
      this.savedFiles = res?.data ?? res ?? [];
    });
  }

  onSubmit(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('files', this.selectedFile, this.selectedFile.name);

    const cleanVisitNo = String(this.opipNumber).replace(/[-/]/g, '');

    this._abhaIntegrationService.opFileUpload(this.regno, cleanVisitNo, this.opipid, this.opipType, formData).subscribe((data) => {
      // this.selectedFile = null;
      this.dialogRef.close();
    });
  }

  onClick(event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event) {

  }

  onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
  }

  removeFile(event, srNO) {
    let ix
    // if (this.files && -1 !== (ix = this.files.findIndex(x => x.srNo == srNO))) {
    //   if (this.files[ix].docSavedName)
    //     this.files[ix].isDelete = true;
    //   else
    //     this.files.splice(ix, 1)
    //   this.clearInputElement()
    //   this.filesChange.emit(this.files);
    // }
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

  getPreview(file: File): string | null {
    if (file == null || !file.type.startsWith('image/')) return null;
    return URL.createObjectURL(file);
  }

  downloadFile(file: any): void {
    this._service.downloadFile("Files/get-file?Id=" + file.id, null, 2, file.docName).subscribe((data) => {

    });
  }

  viewFile(file: any): void {
    // Case: newly uploaded (local File object)
    if (file.Document instanceof File) {
      const ext = file.docName.split('.').pop()?.toLowerCase();
      const url = URL.createObjectURL(file.Document);

      this.openViewer(url, file.docName, this.getFileType(ext));
      return;
    }

    // Case: already saved in DB -> fetch from backend
    this._service.downloadFile("Files/get-file?Id=" + file.id, null, 2, file.docName, false)
      .subscribe((blob: Blob) => {
        const ext = file.docName.split('.').pop()?.toLowerCase();
        const url = URL.createObjectURL(blob);

        this.openViewer(url, file.docName, this.getFileType(ext));
      });
  }

  private getFileType(ext: string | undefined): string {
    if (!ext) return 'other';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'other';
  }

  private openViewer(url: string, fileName: string, type: string): void {
    // this._matDialog.open(AirmidFileViewerComponent, {
    //   width: '80%',
    //   height: '90%',
    //   data: { url, fileName, type }
    // });
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
}
