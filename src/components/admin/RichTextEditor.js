import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import {
    FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl,
    FaLink, FaImage, FaTable, FaUndo, FaRedo, FaQuoteRight, FaEraser,
} from 'react-icons/fa';

const TEXT_COLORS = ['#111827', '#4f46e5', '#dc2626', '#059669', '#d97706', '#2563eb'];
const HIGHLIGHTS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'];

const Btn = ({ onClick, active, title, children, disabled }) => (
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`px-2.5 py-1.5 rounded text-sm flex items-center justify-center transition-colors disabled:opacity-40 ${
            active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
);

const Divider = () => <span className="w-px h-6 bg-gray-200 mx-1" />;

const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Image,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    // Sync external content changes (e.g. when loading a post to edit).
    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, editor]);

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-2">
                <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><FaBold /></Btn>
                <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><FaItalic /></Btn>
                <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><FaUnderline /></Btn>
                <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><FaStrikethrough /></Btn>
                <Divider />
                <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">H2</Btn>
                <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Subheading">H3</Btn>
                <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><FaListUl /></Btn>
                <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list"><FaListOl /></Btn>
                <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><FaQuoteRight /></Btn>
                <Divider />
                <Btn onClick={addLink} active={editor.isActive('link')} title="Link"><FaLink /></Btn>
                <Btn onClick={addImage} title="Insert image (URL)"><FaImage /></Btn>
                <Divider />
                {/* Text color */}
                <span className="flex items-center gap-0.5" title="Text color">
                    {TEXT_COLORS.map((c) => (
                        <button key={c} type="button" onMouseDown={(e) => e.preventDefault()}
                            onClick={() => editor.chain().focus().setColor(c).run()}
                            className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c }} />
                    ))}
                </span>
                <Divider />
                {/* Highlight */}
                <span className="flex items-center gap-0.5" title="Highlight">
                    {HIGHLIGHTS.map((c) => (
                        <button key={c} type="button" onMouseDown={(e) => e.preventDefault()}
                            onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
                            className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: c }} />
                    ))}
                </span>
                <Divider />
                {/* Table */}
                <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert table"><FaTable /></Btn>
                {editor.isActive('table') && (
                    <>
                        <Btn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add column">+Col</Btn>
                        <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add row">+Row</Btn>
                        <Btn onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete column">-Col</Btn>
                        <Btn onClick={() => editor.chain().focus().deleteRow().run()} title="Delete row">-Row</Btn>
                        <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete table">×Tbl</Btn>
                    </>
                )}
                <Divider />
                <Btn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting"><FaEraser /></Btn>
                <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><FaUndo /></Btn>
                <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><FaRedo /></Btn>
            </div>
            <EditorContent editor={editor} className="blog-content prose-editor px-4 py-3 min-h-[300px] focus:outline-none" />
        </div>
    );
};

export default RichTextEditor;
