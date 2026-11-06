"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseAndValidateCsv, executeCsvImport, ImportPreviewResult } from "@/lib/actions/import-export";
import {
  ArrowUpDown,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export function ImportExportManager() {
  const router = useRouter();
  const [csvText, setCsvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      await parseCsv(content);
    };
    reader.readAsText(uploadedFile);
  };

  const parseCsv = async (content: string) => {
    setIsParsing(true);
    setImportResult(null);
    try {
      const result = await parseAndValidateCsv(content);
      setPreview(result);
    } catch (err: any) {
      alert("Failed to parse CSV: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!preview || preview.validRows === 0) return;

    setIsImporting(true);
    try {
      const validItems = preview.rows.filter((r) => r.isValid).map((r) => r.data);
      const res = await executeCsvImport(validItems);
      setImportResult(res);
      if (res.success) {
        setCsvText("");
        setFile(null);
        setPreview(null);
        router.refresh();
      }
    } catch (err: any) {
      alert("Import error: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const sampleCsvContent = `SKU,Product Name,Category,Purchase Cost,Selling Price,Stock Quantity,Low Stock Threshold,Status,Weight,Weight Unit,Length,Width,Height,Material,Colour,Size,HSN Code,GST %,Keywords,Notes
DEMO-SKU-101,Ultra Portable Wireless Mouse,Electronics,450,999,50,10,Listed,85,g,11,6,3.5,ABS Matte,Space Gray,Standard,84716060,18,mouse wireless optical,Demo batch 1
DEMO-SKU-102,Solid Walnut Headphone Stand,Furniture,800,1899,15,5,Ready for Listing,650,g,28,14,14,Solid Walnut Wood,Natural Walnut,Single Stand,94033090,12,headphone stand wood desk,Demo batch 1
DEMO-SKU-103,Nylon Braided USB-C Cable 2M,Accessories,150,499,120,25,Listed,60,g,200,1,1,Braided Nylon,Stealth Black,2 Metres,85444299,18,usb-c cable fast charging,High turnover`;

  const downloadSampleTemplate = () => {
    const blob = new Blob([sampleCsvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "innovexa-sample-import-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          CSV Import & Export Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Bulk manage your catalog through standardized CSV format with validation and error preview.
        </p>
      </div>

      {/* 2-Column: Export Card & Import Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Export Product Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate and download a complete, formatted CSV export of all products in your workspace, including SKUs, costs, selling prices, tax codes, and inventory levels.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="/api/export?includeArchived=true"
              download
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All Products (Including Archived)</span>
            </a>

            <a
              href="/api/export?includeArchived=false"
              download
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Active Products Only</span>
            </a>
          </div>
        </div>

        {/* Template Download Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Sample Import Template
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download the official Innovexa CSV format template pre-populated with required column headers (SKU, Product Name, Category, Costs, Weights, GST) to ensure flawless imports.
            </p>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Download CSV Template (.csv)</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-blue-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Import Products from CSV
          </h2>
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {file ? file.name : "Click or drag and drop your CSV file here"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports standard UTF-8 encoded .csv files up to 10MB
          </p>
        </div>

        {/* Or direct paste option */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
            Or paste raw CSV text:
          </label>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              if (e.target.value.trim()) {
                parseCsv(e.target.value);
              } else {
                setPreview(null);
              }
            }}
            placeholder="Paste comma-separated rows with header line here..."
            className="w-full p-3 font-mono text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Import Results Banner */}
        {importResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              importResult.success
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300"
            }`}
          >
            {importResult.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            )}
            <div>
              <p className="font-bold text-sm">
                {importResult.success
                  ? `Successfully imported ${importResult.importedCount} product(s)!`
                  : "Import completed with errors."}
              </p>
              {importResult.errors.length > 0 && (
                <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
                  {importResult.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Validation Preview Before Execution */}
        {preview && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60">
              <div className="flex items-center gap-4 text-xs">
                <span>
                  Total Rows: <strong>{preview.totalRows}</strong>
                </span>
                <span className="text-emerald-600 font-semibold">
                  Valid: {preview.validRows}
                </span>
                {preview.invalidRows > 0 && (
                  <span className="text-rose-600 font-semibold">
                    Errors: {preview.invalidRows}
                  </span>
                )}
              </div>

              <button
                onClick={handleExecuteImport}
                disabled={isImporting || preview.validRows === 0}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {isImporting
                  ? "Importing..."
                  : `Execute Import (${preview.validRows} Valid Items)`}
              </button>
            </div>

            {/* Preview Table */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Row #</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Product Name</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3">Price (₹)</th>
                    <th className="py-2 px-3">Stock</th>
                    <th className="py-2 px-3">Validation Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {preview.rows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={
                        row.isValid
                          ? "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          : "bg-rose-50/50 dark:bg-rose-950/20"
                      }
                    >
                      <td className="py-2 px-3 font-mono">{row.rowNumber}</td>
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <span className="text-emerald-600 font-semibold">Valid</span>
                        ) : (
                          <span className="text-rose-600 font-semibold">Error</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-medium">
                        {row.data.product_name || "—"}
                      </td>
                      <td className="py-2 px-3 font-mono">{row.data.sku || "—"}</td>
                      <td className="py-2 px-3">{row.data.selling_price ?? 0}</td>
                      <td className="py-2 px-3">{row.data.stock_quantity ?? 0}</td>
                      <td className="py-2 px-3 text-rose-600 text-[11px]">
                        {row.errors.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
