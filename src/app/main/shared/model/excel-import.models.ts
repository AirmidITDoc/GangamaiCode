// ═══════════════════════════════════════════════════════════════════
//  Excel Import — Shared Models
// ═══════════════════════════════════════════════════════════════════

/**
 * Configuration for a single importable column.
 */
export interface ImportColumn {
  /** Field key used in the API payload */
  key: string;
  /** Human-readable label shown in UI */
  label?: string;
  /** Material icon name (optional) */
  icon?: string;
  /** Whether this column must be mapped before import */
  required?: boolean;
}

/**
 * A single row in the column-mapping step.
 */
export interface ColumnMapping {
  targetColumn: ImportColumn;
  sourceColumn: string | null;
}

/**
 * Full configuration passed to the import dialog via MAT_DIALOG_DATA.
 */
export interface ExcelImportConfig {
  /** Dialog / feature title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Columns definition for mapping */
  columns: ImportColumn[];
  /** POST endpoint to call for preview validation (optional) */
  previewApi?: string;
  /** POST endpoint to save the data */
  importApi: string;
  /** Max rows shown in preview (default: 10) */
  previewLimit?: number;
  /** MatDialog width override */
  width?: string;
}

/**
 * Value emitted when the dialog closes.
 */
export interface ImportDialogResult {
  success: boolean;
  count?: number;
}