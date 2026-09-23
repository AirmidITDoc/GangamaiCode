import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, Optional, Output, Self, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LanguageOption, SpeechRecognitionService } from '../../services/speech-recognition.service';
import {
    type EditorConfig,
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Bookmark,
    CloudServices,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Mention,
    Paragraph,
    PasteFromOffice,
    PlainTableOutput,
    RemoveFormat,
    ShowBlocks,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableLayout,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    SourceEditing,
    Strikethrough
} from 'ckeditor5';

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

@Component({
    selector: 'airmid-editor',
    templateUrl: './airmid-editor.component.html',
    styleUrls: ['./airmid-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AirmidEditorComponent {
    editor = ClassicEditor;
    editorConfig: any = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'sourceEditing',
                // 'showBlocks',
                '|',
                'heading',
                'style',
                '|',
                'fontSize',
                'fontFamily',
                // 'fontColor',
                // 'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                // 'strikethrough',
                // 'subscript',
                // 'superscript',
                // 'code',
                'removeFormat',
                '|',
                'emoji',
                // 'horizontalLine',
                // 'link',
                // 'bookmark',
                // 'insertTable',
                'insertTableLayout',
                'highlight',
                // 'blockQuote',
                // 'codeBlock',
                // 'htmlEmbed',
                '|',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'outdent',
                'indent',
                'insertImage',
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            Alignment,
            Autoformat,
            AutoImage,
            AutoLink,
            Autosave,
            BlockQuote,
            Bold,
            Bookmark,
            CloudServices,
            Code,
            CodeBlock,
            Emoji,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            HorizontalLine,
            HtmlComment,
            HtmlEmbed,
            // NOTE: `Image` removed — it isn't a real ckeditor5 export and was
            // never imported above, so referencing it would throw at runtime.
            // ImageBlock + ImageInline already provide full image support.
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Mention,
            Paragraph,
            PasteFromOffice,
            PlainTableOutput,
            RemoveFormat,
            ShowBlocks,
            SourceEditing,
            Strikethrough,
            Style,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableLayout,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Underline
        ],
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
        },
        image: {
            toolbar: [
                'insertImage',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        initialData: '',
        licenseKey: LICENSE_KEY,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        mention: {
            feeds: []
            // feeds: [
            //     {
            //         marker: '@',
            //         feed: (queryText: string) => {
            //             return this.mentionItems
            //                 .filter(item =>
            //                     item.text
            //                         ?.toLowerCase()
            //                         .includes(queryText.toLowerCase())
            //                 )
            //                 .slice(0, 10)

            //                 .map(item => ({
            //                     id: `@${item.text}`,   // what gets written into the doc
            //                     text: item.text,       // used by itemRenderer below
            //                     originalId: item.id    // keep your real db id if needed
            //                 }));
            //         },
            //         itemRenderer: (item: any) => {
            //             const itemElement = document.createElement('span');
            //             itemElement.classList.add('custom-item');
            //             itemElement.id = `mention-list-item-id-${item.originalId}`;
            //             itemElement.textContent = item.text; // shows the name in the popup
            //             return itemElement;
            //         }
            //     }
            // ]
        },
        placeholder: 'Type or paste your content here!',
        style: {
            definitions: [
                {
                    name: 'Article category',
                    element: 'h3',
                    classes: ['category']
                },
                {
                    name: 'Title',
                    element: 'h2',
                    classes: ['document-title']
                },
                {
                    name: 'Subtitle',
                    element: 'h3',
                    classes: ['document-subtitle']
                },
                {
                    name: 'Info box',
                    element: 'p',
                    classes: ['info-box']
                },
                {
                    name: 'CTA Link Primary',
                    element: 'a',
                    classes: ['button', 'button--green']
                },
                {
                    name: 'CTA Link Secondary',
                    element: 'a',
                    classes: ['button', 'button--black']
                },
                {
                    name: 'Marker',
                    element: 'span',
                    classes: ['marker']
                },
                {
                    name: 'Spoiler',
                    element: 'span',
                    classes: ['spoiler']
                }
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };

    languages: LanguageOption[] = [];
    selectedLang = 'en-US';

    @Input() data: string = '';
    @Input() mentionItems: any[] = [];

    private destroy: Subject<void> = new Subject();
    control = new FormControl();

    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";

    private _disabled: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;
    stateChanges: Subject<void> = new Subject();
    @Output() valueChange = new EventEmitter<string>();

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    @Input()
    get placeholder(): string {
        return this._placeholder ?? this.label;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }

    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    get errorState(): boolean {
        return this.ngControl.control !== null ? !!this.ngControl.control : false;
    }

    get activeErrors(): string[] {
        try {
            if (!this.formGroup || this.formGroup[this.formControlName] || !this.validations || this.validations.length <= 0) {
                return [];
            }
            // Find active validation
            return this.validations
                .filter((validation: any) => this.formGroup.controls[this.formControlName].hasError(validation.name.toLowerCase()))
                .map((validation: any) => validation.Message);
        } catch (error) {
            console.log("Html Editor Error => ", error);
        }
    }

    @Input()
    get value(): (string | []) {
        return this.control.value;
    }
    set value(value: (string | [])) {
        if (value != this.control.value) {
            this.control.setValue(value);
            this.stateChanges.next();
        }
    }

    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    constructor(@Optional() @Self() public ngControl: NgControl | null,
        public speechService: SpeechRecognitionService) {
        if (ngControl) {
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }

    onChange(event: any): void {
        const editorData = event.editor.getData();
        this.valueChange.emit(editorData);
    }

    editorInstance: any;
    onReady(editor: any): void {
        this.editorInstance = editor;

        // Custom rendering for mentions inside the editor content itself.
        // Without this, CKEditor falls back to plain inline text for the
        // `mention` model attribute — this gives you a styleable chip
        // (`<span class="mention" data-mention="@Name">@Name</span>`)
        // so selected mentions are visibly distinct once inserted.
        editor.conversion.for('editingDowncast').attributeToElement({
            model: 'mention',
            view: (modelAttributeValue: any, { writer }: any) => {
                if (!modelAttributeValue) {
                    return;
                }
                return writer.createAttributeElement('span', {
                    class: 'mention',
                    'data-mention': modelAttributeValue.id
                }, {
                    priority: 20,
                    id: modelAttributeValue.uid
                });
            },
            converterPriority: 'high'
        });

        // Set initial data (from parent)
        if (this.value) {
             editor.setData(this.value);
            // editor.setData(this.value as string);
        }

        // Listen for live typing without cursor reset
        editor.model.document.on('change:data', () => {
            const data = editor.getData();
            this.valueChange.emit(data);
        });
    }

    //////////////// mic code /////////////////
    ngOnInit(): void {
        this.languages = this.speechService.supportedLanguages;
    }

    onLangChange() {
        if (this.speechService.isListening) {
            this.speechService.stopRecognition();
        }
    }

    onMicToggle() {
        const lang = this.selectedLang || 'en-US';

        this.speechService.toggleRecognition(lang, (text: string) => {
            // Append to existing editor content
            const newValue = this.value ? `${this.value} ${text}` : text;

            // Update both local value + editor content
            this.value = newValue;
            if (this.editorInstance) {
                this.editorInstance.setData(newValue);
            }

            // Emit upwards so parent stays in sync
            this.valueChange.emit(newValue);
        });
    }

    private resetEditorFocusAfterSetData(): void {
        // Let CKEditor finish its internal re-render from setData() first
        setTimeout(() => {
            if (!this.editorInstance) { return; }
            this.editorInstance.editing.view.focus();
            const model = this.editorInstance.model;
            model.change((writer: any) => {
                writer.setSelection(
                    writer.createPositionAt(model.document.getRoot(), 'end')
                );
            });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] && this.editorInstance) {
            const newVal = changes['value'].currentValue;
            if (newVal !== this.editorInstance.getData()) {
                this.editorInstance.setData(newVal || '');
                this.resetEditorFocusAfterSetData();
            }
        }
    }

    writeValue(value: string | null): void {
        this.control.setValue(value, { emitEvent: false });

        if (this.editorInstance && value !== this.editorInstance.getData()) {
            this.editorInstance.setData(value || '');
            this.resetEditorFocusAfterSetData();
        }
    }
}