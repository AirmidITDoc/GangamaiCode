import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'airmid-fileupload',
    templateUrl: './airmid-fileupload.component.html',
    styleUrls: ['./airmid-fileupload.component.scss']
})
export class AirmidFileuploadComponent {
    @Input() multiple:boolean=false;
    @Input() accept
    @Input() auto = true
    @Input() chooseLabel = 'Choose'
    @Input() uploadLabel = 'Upload'
    @Input() cancelLabel = 'Cance'
    @Input() deleteButtonIcon = 'delete'
    @ViewChild('fileUpload')
    fileUpload: ElementRef

    inputFileName: string

    @Input()
    files: File[] = []

    constructor(private sanitizer: DomSanitizer) {

    }

    onClick(event) {
        if (this.fileUpload)
            this.fileUpload.nativeElement.click()
    }

    onInput(event) {

    }

    onFileSelected(event) {
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        console.log('event::::::', event)
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            //if(!this.isFileSelected(file)){
            if (this.validate(file)) {
                //      if(this.isImage(file)) {
                file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                //      }
                if (!this.isMultiple()) {
                    this.files = []
                }
                this.files.push(files[i]);
                //  }
            }
            //}
        }
    }

    removeFile(event, file) {
        let ix
        if (this.files && -1 !== (ix = this.files.indexOf(file))) {
            this.files.splice(ix, 1)
            this.clearInputElement()
        }
    }

    validate(file: File) {
        for (const f of this.files) {
            if (f.name === file.name
                && f.lastModified === file.lastModified
                && f.size === f.size
                && f.type === f.type
            ) {
                return false
            }
        }
        return true
    }

    clearInputElement() {
        this.fileUpload.nativeElement.value = ''
    }


    isMultiple(): boolean {
        return this.multiple
    }

}
