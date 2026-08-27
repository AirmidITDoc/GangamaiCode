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
    Underline,
    SourceEditing
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
            Image,

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
        // mention: {
        //     feeds: [
        //         {
        //             marker: '@',
        //             feed: [
        //                 /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
        //             ]
        //         }
        //     ]
        // },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: (queryText: string) => {
                        return this.mentionItems
                            .filter(item =>
                                item.text
                                    .toLowerCase()
                                    .includes(queryText.toLowerCase())
                            )
                            .slice(0, 10);
                    }
                }
            ]
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
    ////////////////////////
    @Input() mentionItems: any[] = [];
    ///////////////////////
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
    // writeValue(value: string | null): void {
    //     this.control.setValue(value);
    // }

    // added by raksha 27/9/25
    writeValue(value: string | null): void {
        // update Angular side
        this.control.setValue(value, { emitEvent: false });

        // update CKEditor if already initialized
        if (this.editorInstance && value !== this.editorInstance.getData()) {
            this.editorInstance.setData(value || '');
        }
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

        // Set initial data (from parent)
        if (this.value) {
            editor.setData(this.value);
        }

        // Listen for live typing without cursor reset
        editor.model.document.on('change:data', () => {
            const data = editor.getData();
            this.valueChange.emit(data);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] && this.editorInstance) {
            const newVal = changes['value'].currentValue;
            if (newVal !== this.editorInstance.getData()) {
                this.editorInstance.setData(newVal);
            }
        }
    }

    //////////////// mic code /////////////////
    ngOnInit(): void {
        this.languages = this.speechService.supportedLanguages;
    }

    onLangChange() {
        debugger
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

}
