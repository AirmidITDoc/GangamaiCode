import { Pipe, PipeTransform } from '@angular/core';
import { FileKind } from 'app/core/models/documentmanagement/document.model';

const ICONS: Record<FileKind, string> = {
  pdf: 'picture_as_pdf',
  image: 'image',
  doc: 'description',
  xls: 'table_chart',
  text: 'article',
  other: 'insert_drive_file',
};

const LABELS: Record<FileKind, string> = {
  pdf: 'PDF',
  image: 'Image',
  doc: 'Word Doc',
  xls: 'Spreadsheet',
  text: 'Text File',
  other: 'File',
};

@Pipe({ name: 'fileKindIcon' })
export class FileKindIconPipe implements PipeTransform {
  transform(kind: FileKind): string {
    return ICONS[kind] ?? 'insert_drive_file';
  }
}

@Pipe({ name: 'fileKindLabel' })
export class FileKindLabelPipe implements PipeTransform {
  transform(kind: FileKind): string {
    return LABELS[kind] ?? 'File';
  }
}
