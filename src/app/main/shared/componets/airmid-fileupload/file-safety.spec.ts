import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AirmidFileViewerComponent } from '../airmid-fileviewer/airmid-fileviewer.component';
import { AirmidFileuploadComponent, AirmidFileModel, PageNames } from './airmid-fileupload.component';
import { verifiedImageType } from './file-safety';

describe('Uploaded file safety', () => {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

    it('requires an allowed extension and matching image signature', async () => {
        expect(await verifiedImageType(new Blob([new Uint8Array(png)]), 'report.PNG')).toBe('image/png');
        expect(await verifiedImageType(new Blob(['%PDF-1.7']), 'report.png')).toBeNull();
        expect(await verifiedImageType(new Blob([new Uint8Array(png)]), 'report.pdf')).toBeNull();
        expect(await verifiedImageType(new Blob(['<svg></svg>']), 'report.svg')).toBeNull();
        expect(await verifiedImageType(new Blob([new Uint8Array([0xff, 0xd8, 0xff])]), 'report.jpeg')).toBe('image/jpeg');
        expect(await verifiedImageType(new Blob(['GIF89a']), 'report.gif')).toBe('image/gif');
        expect(await verifiedImageType(new Blob(['RIFF0000WEBP']), 'report.webp')).toBe('image/webp');
    });

    it('rejects radiology PDFs and mismatched images without discarding existing files', async () => {
        const api = jasmine.createSpyObj<ApiCaller>('ApiCaller', ['PostFromData']);
        const toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error', 'warning']);
        const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        const ref = jasmine.createSpyObj<MatDialogRef<AirmidFileuploadComponent>>('MatDialogRef', ['close']);
        const component = new AirmidFileuploadComponent(api, toastr, new ElementRef(document.createElement('div')), dialog, {}, ref);
        component.imageOnly = true;
        component.multiple = false;
        component.files = [{ id: 5, srNo: 1, refId: 1, refType: PageNames.PATIENT_PATHFILES,
            Document: null, docName: 'existing.pdf', docSavedName: 'existing', isDelete: false, base64: '' }];
        const input = document.createElement('input');
        input.type = 'file';
        const selection = new DataTransfer();
        selection.items.add(new File(['%PDF-1.7'], 'report.png', { type: 'image/png' }));
        input.files = selection.files;
        const event = new Event('change');
        Object.defineProperty(event, 'target', { value: input });
        await component.onFileSelected(event);
        expect(component.files.length).toBe(1);
        expect(component.files[0].id).toBe(5);
        expect(toastr.error).toHaveBeenCalled();

        component.files.push({ id: 0, srNo: 2, refId: 1, refType: PageNames.PATIENT_PATHFILES,
            Document: new File(['%PDF-1.7'], 'report.pdf'), docName: 'report.pdf',
            docSavedName: '', isDelete: false, base64: '' } as AirmidFileModel);
        await component.onSubmit();
        expect(api.PostFromData).not.toHaveBeenCalled();
    });

    it('accepts a matching image for radiology', async () => {
        const api = jasmine.createSpyObj<ApiCaller>('ApiCaller', ['PostFromData']);
        const toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error', 'warning']);
        const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        const ref = jasmine.createSpyObj<MatDialogRef<AirmidFileuploadComponent>>('MatDialogRef', ['close']);
        const component = new AirmidFileuploadComponent(api, toastr, new ElementRef(document.createElement('div')), dialog, {}, ref);
        component.imageOnly = true;
        component.multiple = true;
        const input = document.createElement('input');
        input.type = 'file';
        const selection = new DataTransfer();
        selection.items.add(new File([new Uint8Array(png)], 'report.png', { type: 'image/png' }));
        input.files = selection.files;
        const event = new Event('change');
        Object.defineProperty(event, 'target', { value: input });
        await component.onFileSelected(event);
        expect(component.files.length).toBe(1);
        expect(component.files[0].docName).toBe('report.png');
        expect(toastr.error).not.toHaveBeenCalled();
    });

    it('never embeds a PDF in the shared viewer', async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, MatButtonModule, MatIconModule],
            declarations: [AirmidFileViewerComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { url: 'blob:https://example.test/test', fileName: 'report.pdf', type: 'pdf' } },
                { provide: MatDialogRef, useValue: { close: () => {} } },
                { provide: ApiCaller, useValue: {} }
            ]
        }).overrideComponent(AirmidFileViewerComponent, { set: { animations: [] } }).compileComponents();
        const fixture = TestBed.createComponent(AirmidFileViewerComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('embed, iframe, object')).toBeNull();
        expect(fixture.nativeElement.querySelector('a').getAttribute('download')).toBe('report.pdf');
        fixture.destroy();
    });

    it('forces stored PDF content to download-only even when the server labels it HTML', async () => {
        const api = jasmine.createSpyObj<ApiCaller>('ApiCaller', ['downloadFile']);
        api.downloadFile.and.returnValue(of(new Blob(['<script>alert(1)</script>'], { type: 'text/html' })));
        const toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error', 'warning']);
        const dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        const ref = jasmine.createSpyObj<MatDialogRef<AirmidFileuploadComponent>>('MatDialogRef', ['close']);
        const createUrl = spyOn(URL, 'createObjectURL').and.returnValue('blob:https://example.test/test');
        const component = new AirmidFileuploadComponent(api, toastr, new ElementRef(document.createElement('div')), dialog, {}, ref);
        component.viewFile({ id: 5, srNo: 1, refId: 1, refType: PageNames.PATIENT_PATHFILES,
            Document: null, docName: 'report.pdf', docSavedName: 'stored', isDelete: false, base64: '' });
        await new Promise(resolve => setTimeout(resolve, 0));
        const urlSource = createUrl.calls.mostRecent().args[0];
        expect(urlSource instanceof Blob).toBeTrue();
        if (urlSource instanceof Blob) expect(urlSource.type).toBe('application/octet-stream');
        expect(dialog.open.calls.mostRecent().args[1].data).toEqual(jasmine.objectContaining({ type: 'other' }));
    });
});
