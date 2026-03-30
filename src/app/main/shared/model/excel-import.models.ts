// ═══════════════════════════════════════════════════════════════════
//  Excel Import — Shared Models
// ═══════════════════════════════════════════════════════════════════

export interface ImportColumn {
  key: string;
  label?: string;
  required?: boolean;
}

export interface ColumnMapping {
  targetColumn: ImportColumn;
  sourceColumn: string | null;
}

export interface ExcelImportConfig {
  title?: string;
  subtitle?: string;
  columns: ImportColumn[];
  /** POST endpoint — sends FormData (file + mapping), returns PreviewRow[] */
  previewApi: string;
  /** POST endpoint — sends FormData (file + mapping) to save */
  importApi: string;
  previewLimit?: number;
  width?: string;
}

/**
 * Shape of each row returned by the preview API.
 *
 * Your API should return an array of these objects.
 * Example response:
 * [
 *   {
 *     rowIndex: 1,
 *     data: { name: "John", age: 30 },
 *     isValid: true,
 *     errors: {}
 *   },
 *   {
 *     rowIndex: 2,
 *     data: { name: "", age: -1 },
 *     isValid: false,
 *     errors: { name: "Name is required", age: "Age must be positive" }
 *   }
 * ]
 */
export interface PreviewRow {
  /** 1-based row number from the Excel file */
  rowIndex: number;
  /** The mapped data for this row */
  data: Record<string, any>;
  /** Whether this row passed all validations */
  isValid: boolean;
  /** Map of fieldKey → error message for invalid fields */
  errors: Record<string, string>;
}

export interface PreviewApiResponse {
  rows: PreviewRow[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
}

export interface ImportDialogResult {
  success: boolean;
  count?: number;
}