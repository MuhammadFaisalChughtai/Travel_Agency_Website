"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  Code as CodeIcon,
  Eye,
  Edit3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
  Minus,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from "lucide-react";

interface RichHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichHtmlEditor({
  value,
  onChange,
  placeholder = "Write or paste your rich blog content here...",
  className = "",
  minHeight = "360px",
}: RichHtmlEditorProps) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("visual");
  const [activeTableContext, setActiveTableContext] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<"text" | "bg" | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync incoming value to visual editor when value changes externally (e.g. AI or initial load)
  useEffect(() => {
    if (value !== lastHtmlRef.current) {
      lastHtmlRef.current = value || "";
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  // Initial load into visual editor
  useEffect(() => {
    if (visualEditorRef.current && visualEditorRef.current.innerHTML !== (value || "")) {
      visualEditorRef.current.innerHTML = value || "";
    }
  }, [mode]);

  // Check if cursor is currently inside a table element
  const checkTableContext = useCallback(() => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) {
      setActiveTableContext(false);
      return;
    }
    const node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : (sel.anchorNode as HTMLElement);
    const inTable = !!node?.closest("table");
    setActiveTableContext(inTable);
  }, []);

  const handleVisualInput = () => {
    if (!visualEditorRef.current) return;
    const html = visualEditorRef.current.innerHTML;
    lastHtmlRef.current = html;
    onChange(html);
    checkTableContext();
  };

  const executeCommand = (command: string, cmdValue: string | undefined = undefined) => {
    if (mode !== "visual") return;
    visualEditorRef.current?.focus();
    document.execCommand(command, false, cmdValue);
    handleVisualInput();
  };

  const handleHeading = (tag: string) => {
    if (mode !== "visual") return;
    visualEditorRef.current?.focus();
    if (tag === "p") {
      document.execCommand("formatBlock", false, "<p>");
    } else {
      document.execCommand("formatBlock", false, `<${tag}>`);
    }
    handleVisualInput();
  };

  const handleAddLink = () => {
    if (mode !== "visual") return;
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "";
    const url = prompt("Enter link URL (e.g. https://...):", "https://");
    if (!url || url.trim() === "" || url === "https://") return;

    if (selectedText) {
      document.execCommand("createLink", false, url.trim());
    } else {
      const linkText = prompt("Enter link display text:", url) || url;
      const linkHtml = `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      document.execCommand("insertHTML", false, linkHtml);
    }
    handleVisualInput();
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        insertImageToEditor(data.url);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePromptImageUrl = () => {
    const url = prompt("Enter image URL (https://...):");
    if (url && url.trim()) {
      insertImageToEditor(url.trim());
    }
  };

  const insertImageToEditor = (src: string) => {
    if (mode !== "visual") {
      const imgTag = `<img src="${src}" alt="Image" style="max-width:100%; height:auto; border-radius:12px; margin:16px 0;" />`;
      onChange(value + "\n" + imgTag);
      return;
    }
    visualEditorRef.current?.focus();
    const imgHtml = `<p><img src="${src}" alt="Image" style="max-width:100%; height:auto; border-radius:12px; margin:16px 0; box-shadow:0 4px 14px rgba(0,0,0,0.06);" /></p><p><br></p>`;
    document.execCommand("insertHTML", false, imgHtml);
    handleVisualInput();
  };

  // TABLE MANIPULATION
  const insertTable = (rows = 3, cols = 3) => {
    if (mode !== "visual") return;
    visualEditorRef.current?.focus();

    let headerCells = "";
    for (let c = 1; c <= cols; c++) {
      headerCells += `<th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; background-color: #f1f5f9; color: #1e293b;">Header ${c}</th>`;
    }

    let bodyRows = "";
    for (let r = 1; r <= rows; r++) {
      let cells = "";
      for (let c = 1; c <= cols; c++) {
        cells += `<td style="border: 1px solid #cbd5e1; padding: 10px 14px; color: #334155;">Data ${r}.${c}</td>`;
      }
      bodyRows += `<tr style="${r % 2 === 0 ? "background-color: #f8fafc;" : "background-color: #ffffff;"}">${cells}</tr>`;
    }

    const tableHtml = `
      <div class="table-wrapper" style="overflow-x: auto; margin: 1.5rem 0;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; font-size: 0.95rem; border-radius: 8px; overflow: hidden;">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <p><br></p>
    `;

    document.execCommand("insertHTML", false, tableHtml);
    handleVisualInput();
    setShowTableMenu(false);
  };

  const getTableElements = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return null;
    const node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : (sel.anchorNode as HTMLElement);
    const cell = node?.closest("td, th") as HTMLTableCellElement | null;
    const row = node?.closest("tr") as HTMLTableRowElement | null;
    const table = node?.closest("table") as HTMLTableElement | null;
    return { cell, row, table };
  };

  const addRow = (below = true) => {
    const elements = getTableElements();
    if (!elements || !elements.row || !elements.table) {
      alert("Please click inside a table row first.");
      return;
    }
    const { row } = elements;
    const colCount = row.cells.length;
    const newRow = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.style.border = "1px solid #cbd5e1";
      td.style.padding = "10px 14px";
      td.style.color = "#334155";
      td.innerHTML = "New cell";
      newRow.appendChild(td);
    }

    if (below) {
      row.after(newRow);
    } else {
      row.before(newRow);
    }
    handleVisualInput();
  };

  const addColumn = (right = true) => {
    const elements = getTableElements();
    if (!elements || !elements.cell || !elements.row || !elements.table) {
      alert("Please click inside a table cell first.");
      return;
    }
    const { cell, table } = elements;
    const cellIndex = cell.cellIndex;

    const rows = table.querySelectorAll("tr");
    rows.forEach((r) => {
      const isHeader = r.parentElement?.tagName.toLowerCase() === "thead" || r.cells[0]?.tagName.toLowerCase() === "th";
      const newCell = document.createElement(isHeader ? "th" : "td");
      newCell.style.border = "1px solid #cbd5e1";
      newCell.style.padding = "10px 14px";
      if (isHeader) {
        newCell.style.fontWeight = "700";
        newCell.style.backgroundColor = "#f1f5f9";
        newCell.style.color = "#1e293b";
        newCell.innerHTML = "Header";
      } else {
        newCell.style.color = "#334155";
        newCell.innerHTML = "Data";
      }

      const targetCell = r.cells[cellIndex];
      if (targetCell) {
        if (right) {
          targetCell.after(newCell);
        } else {
          targetCell.before(newCell);
        }
      } else {
        r.appendChild(newCell);
      }
    });
    handleVisualInput();
  };

  const deleteRow = () => {
    const elements = getTableElements();
    if (!elements || !elements.row || !elements.table) return;
    const { row, table } = elements;
    row.remove();
    if (table.rows.length === 0) {
      const wrapper = table.closest(".table-wrapper") || table;
      wrapper.remove();
    }
    handleVisualInput();
  };

  const deleteColumn = () => {
    const elements = getTableElements();
    if (!elements || !elements.cell || !elements.table) return;
    const { cell, table } = elements;
    const cellIndex = cell.cellIndex;
    const rows = table.querySelectorAll("tr");
    rows.forEach((r) => {
      if (r.cells[cellIndex]) {
        r.cells[cellIndex].remove();
      }
    });
    handleVisualInput();
  };

  const deleteTable = () => {
    const elements = getTableElements();
    if (!elements || !elements.table) return;
    const wrapper = elements.table.closest(".table-wrapper") || elements.table;
    wrapper.remove();
    handleVisualInput();
  };

  // Prettify / Format HTML helper for HTML Code mode
  const formatHtml = () => {
    try {
      let formatted = "";
      const reg = /(>)(<)(\/*)/g;
      const xml = (value || "").replace(reg, "$1\r\n$2$3");
      let pad = 0;
      xml.split("\r\n").forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }
        formatted += "  ".repeat(pad) + node + "\n";
        pad += indent;
      });
      onChange(formatted.trim());
    } catch {
      // keep as is
    }
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(value || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`border border-slate-300 rounded-xl bg-white shadow-xs overflow-hidden flex flex-col ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""
      } ${className}`}
    >
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* TOP HEADER: MODE TABS & FULLSCREEN */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/80">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              mode === "visual"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              mode === "html"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <CodeIcon className="w-3.5 h-3.5" />
            HTML Source Code
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              mode === "preview"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Right Actions: Prettify, Copy, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {mode === "html" && (
            <>
              <button
                type="button"
                onClick={formatHtml}
                title="Format / Indent HTML Code"
                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Format HTML
              </button>
              <button
                type="button"
                onClick={copyHtmlCode}
                title="Copy HTML to clipboard"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? "Copied" : "Copy"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* VISUAL MODE TOOLBAR */}
      {mode === "visual" && (
        <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 select-none">
          {/* History */}
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Heading Dropdown */}
          <select
            onChange={(e) => handleHeading(e.target.value)}
            defaultValue="p"
            className="text-xs font-medium bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Text Styling */}
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            title="Bold (Ctrl+B)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors font-bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            title="Italic (Ctrl+I)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            title="Underline (Ctrl+U)"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            title="Strikethrough"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Colors */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(showColorPicker === "text" ? null : "text")}
              title="Text Color"
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors flex items-center gap-0.5"
            >
              <Palette className="w-4 h-4 text-slate-800" />
            </button>
            {showColorPicker === "text" && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-2 z-30 grid grid-cols-5 gap-1.5 w-44">
                {[
                  "#1e293b",
                  "#483434",
                  "#6b4f4f",
                  "#064e3b",
                  "#d4af37",
                  "#dc2626",
                  "#ea580c",
                  "#2563eb",
                  "#7c3aed",
                  "#059669",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      executeCommand("foreColor", color);
                      setShowColorPicker(null);
                    }}
                    className="w-6 h-6 rounded border border-black/20 hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(showColorPicker === "bg" ? null : "bg")}
              title="Highlight Color"
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
            >
              <Highlighter className="w-4 h-4 text-amber-500" />
            </button>
            {showColorPicker === "bg" && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-2 z-30 grid grid-cols-4 gap-1.5 w-36">
                {[
                  "#fef08a",
                  "#bbf7d0",
                  "#fed7aa",
                  "#e0e7ff",
                  "#eed6c4",
                  "#fff3e4",
                  "#f3f4f6",
                  "#ffffff",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      executeCommand("hiliteColor", color);
                      setShowColorPicker(null);
                    }}
                    className="w-6 h-6 rounded border border-black/20 hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            title="Align Left"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            title="Align Center"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            title="Align Right"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bullet List"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            title="Quote"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            title="Horizontal Divider"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* Links & Images */}
          <button
            type="button"
            onClick={handleAddLink}
            title="Insert Link"
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            <LinkIcon className="w-4 h-4 text-blue-600" />
          </button>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload & Insert Image"
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={handlePromptImageUrl}
              title="Insert Image by URL"
              className="text-[10px] text-slate-500 hover:text-slate-800 underline px-1"
            >
              URL
            </button>
          </div>

          <span className="w-px h-5 bg-slate-300 mx-1" />

          {/* TABLE DROPDOWN & ACTIONS */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTableMenu(!showTableMenu)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                activeTableContext
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>

            {showTableMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-300 rounded-xl shadow-xl p-2 z-30 w-52 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Insert Table
                </p>
                <button
                  type="button"
                  onClick={() => insertTable(3, 3)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center justify-between"
                >
                  <span>3 &times; 3 Table</span>
                  <span className="text-[10px] text-slate-400">Header + 3 Rows</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(5, 4)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center justify-between"
                >
                  <span>4 &times; 5 Table</span>
                  <span className="text-[10px] text-slate-400">Header + 5 Rows</span>
                </button>

                <div className="border-t border-slate-200 my-1" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Current Table Edit
                </p>
                <button
                  type="button"
                  onClick={() => {
                    addRow(true);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Row Below
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addRow(false);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" /> Add Row Above
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addColumn(true);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Column Right
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addColumn(false);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" /> Add Column Left
                </button>

                <div className="border-t border-slate-200 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    deleteRow();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Row
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteColumn();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Column
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTable();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 rounded flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Entire Table
                </button>
              </div>
            )}
          </div>

          {/* Quick Context Table Actions Pill if inside table */}
          {activeTableContext && (
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] text-emerald-800 ml-auto">
              <span className="font-bold">In Table:</span>
              <button
                type="button"
                onClick={() => addRow(true)}
                className="hover:underline font-medium text-emerald-700"
              >
                +Row
              </button>
              <span className="text-emerald-300">|</span>
              <button
                type="button"
                onClick={() => addColumn(true)}
                className="hover:underline font-medium text-emerald-700"
              >
                +Col
              </button>
              <span className="text-emerald-300">|</span>
              <button
                type="button"
                onClick={deleteRow}
                className="hover:underline font-medium text-rose-600"
              >
                -Row
              </button>
              <span className="text-emerald-300">|</span>
              <button
                type="button"
                onClick={deleteColumn}
                className="hover:underline font-medium text-rose-600"
              >
                -Col
              </button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("removeFormat")}
              title="Clear Formatting"
              className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* EDITOR CONTENT AREA */}
      <div className="relative flex-1 bg-white">
        {/* 1. VISUAL MODE (contentEditable DOM editor) */}
        <div
          style={{ display: mode === "visual" ? "block" : "none" }}
          className="p-5 overflow-y-auto"
        >
          <div
            ref={visualEditorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleVisualInput}
            onKeyUp={checkTableContext}
            onMouseUp={checkTableContext}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="rich-visual-editor outline-none focus:outline-none text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none"
          />
        </div>

        {/* 2. HTML SOURCE CODE MODE */}
        {mode === "html" && (
          <div className="p-0 h-full flex flex-col">
            <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-2 border-b border-slate-800 flex items-center justify-between font-mono">
              <span>RAW HTML SOURCE CODE (Unfiltered - Tables & Styles Preserved)</span>
              <span className="text-slate-400">{value?.length || 0} characters</span>
            </div>
            <textarea
              value={value}
              onChange={(e) => {
                const val = e.target.value;
                lastHtmlRef.current = val;
                onChange(val);
              }}
              style={{ minHeight }}
              spellCheck={false}
              placeholder="Paste or write exact raw HTML code here..."
              className="w-full flex-1 p-4 font-mono text-xs text-emerald-400 bg-slate-950 focus:outline-none resize-y leading-relaxed border-none selection:bg-indigo-600"
            />
          </div>
        )}

        {/* 3. LIVE PREVIEW MODE */}
        {mode === "preview" && (
          <div className="p-6 overflow-y-auto bg-slate-50/50" style={{ minHeight }}>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Website Article Preview
              </div>
              <div
                className="prose-article preview-content"
                dangerouslySetInnerHTML={{ __html: value || "<p class='text-slate-400 italic'>No content written yet.</p>" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer / Info Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>HTML Tables & Inline CSS Styles fully preserved</span>
        </div>
        <div>
          {mode === "visual" && <span>Mode: WYSIWYG Visual Editor</span>}
          {mode === "html" && <span>Mode: Raw Source HTML</span>}
          {mode === "preview" && <span>Mode: Live Preview</span>}
        </div>
      </div>

      {/* Styles for Visual Editor & Preview to ensure tables look gorgeous */}
      <style jsx global>{`
        .rich-visual-editor:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          display: block;
        }
        .rich-visual-editor h1,
        .preview-content h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .rich-visual-editor h2,
        .preview-content h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .rich-visual-editor h3,
        .preview-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #334155;
          margin-top: 1rem;
          margin-bottom: 0.4rem;
        }
        .rich-visual-editor p,
        .preview-content p {
          margin-bottom: 0.85rem;
          line-height: 1.75;
          color: #334155;
        }
        .rich-visual-editor ul,
        .preview-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-visual-editor ol,
        .preview-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-visual-editor li,
        .preview-content li {
          margin-bottom: 0.25rem;
        }
        .rich-visual-editor blockquote,
        .preview-content blockquote {
          border-left: 4px solid #6b4f4f;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #64748b;
          font-style: italic;
          background: #f8fafc;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0 8px 8px 0;
        }
        /* TABLE STYLING */
        .rich-visual-editor table,
        .preview-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1.25rem 0 !important;
          font-size: 0.9rem !important;
          border: 1px solid #cbd5e1 !important;
        }
        .rich-visual-editor th,
        .preview-content th {
          background-color: #f1f5f9 !important;
          color: #1e293b !important;
          font-weight: 700 !important;
          padding: 10px 14px !important;
          border: 1px solid #cbd5e1 !important;
          text-align: left !important;
        }
        .rich-visual-editor td,
        .preview-content td {
          padding: 10px 14px !important;
          border: 1px solid #cbd5e1 !important;
          color: #334155 !important;
        }
        .rich-visual-editor tr:nth-child(even) td,
        .preview-content tr:nth-child(even) td {
          background-color: #f8fafc;
        }
        .rich-visual-editor td:focus,
        .rich-visual-editor th:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: -2px;
        }
        .rich-visual-editor a,
        .preview-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rich-visual-editor img,
        .preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
