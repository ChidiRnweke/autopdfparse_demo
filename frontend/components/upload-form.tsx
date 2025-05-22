"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, FileIcon, X } from "lucide-react";
import PDFViewer from "@/components/pdf-viewer";

const providers = [
  {
    id: "anthropic",
    name: "Anthropic",
    iconSrc: "/anthropic.svg",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    iconSrc: "/google.svg",
  },
  {
    id: "openai",
    name: "OpenAI",
    iconSrc: "/openai.svg",
  },
];

type PDFData = {
  pageNumber: number;
  extractedText: string;
  isLayoutDependent: boolean;
};

const modelsByProvider = {
  anthropic: {
    layout: [
      { id: "claude-3-haiku-latest", name: "Claude 3 Haiku", default: true },
      { id: "claude-3-7-sonnet-latest", name: "Claude 3.7 Sonnet" },
    ],
    description: [
      {
        id: "claude-3.7-sonnet-latest",
        name: "Claude 3.7 Sonnet",
        default: true,
      },
      { id: "claude-3-5-haiku-latest", name: "Claude 3 Haiku" },
    ],
  },
  gemini: {
    layout: [
      {
        id: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Flash Lite",
        default: true,
      },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    ],
    description: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", default: true },
      { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
    ],
  },
  openai: {
    layout: [
      { id: "gpt-4.1-nano", name: "GPT-4.1 Nano", default: true },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
      { id: "gpt-4.1", name: "GPT-4.1" },
    ],
    description: [
      { id: "gpt-4.1", name: "GPT-4.1", default: true },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
      { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
    ],
  },
};

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("");
  const [layoutModel, setLayoutModel] = useState("");
  const [descriptionModel, setDescriptionModel] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfData, setPdfData] = useState<PDFData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPdfUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setPdfUrl(URL.createObjectURL(droppedFile));
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  // Add useEffect to handle model selection when provider changes
  useEffect(() => {
    if (provider) {
      const providerKey = provider as keyof typeof modelsByProvider;
      const providerModels = modelsByProvider[providerKey];

      // Find default layout model or use the first one
      const defaultLayoutModel = providerModels.layout.find((m) => m.default);
      const layoutModelId = defaultLayoutModel
        ? defaultLayoutModel.id
        : providerModels.layout[0].id;

      // Find default description model or use the first one
      const defaultDescriptionModel = providerModels.description.find(
        (m) => m.default
      );
      const descriptionModelId = defaultDescriptionModel
        ? defaultDescriptionModel.id
        : providerModels.description[0].id;

      // Set state in next tick to ensure UI updates
      setTimeout(() => {
        setLayoutModel(layoutModelId);
        setDescriptionModel(descriptionModelId);

        console.log("Models set via useEffect:", {
          layout: layoutModelId,
          description: descriptionModelId,
        });
      }, 0);
    }
  }, [provider]);

  const handleProviderChange = (value: string) => {
    // Only set the provider, the useEffect will handle setting the default models
    setProvider(value);

    if (!value) {
      setLayoutModel("");
      setDescriptionModel("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !apiKey || !provider || !layoutModel || !descriptionModel)
      return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("layout_model", layoutModel);
    formData.append("description_model", descriptionModel);

    const results = await fetch(`/api/${provider}/parse`, {
      method: "POST",
      body: formData,
    });

    if (!results.ok) {
      setIsUploading(false);
      alert("Error processing the file. Please try again.");
      return;
    }
    const data = await results.json();
    setPdfData(
      data.pages.map(
        (page: {
          page_number: number;
          content: string;
          _from_llm: boolean;
        }) => ({
          pageNumber: page.page_number,
          extractedText: page.content,
          isLayoutDependent: page._from_llm,
        })
      )
    );

    // Simulate processing delay
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessed(true);
      router.push(`#results`);
    }, 2000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div>
            <Label
              htmlFor="file-upload"
              className="text-base font-medium mb-1 block"
            >
              Upload PDF Document
            </Label>

            <div
              className={`
                border-2 border-dashed rounded-lg transition-all
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
                    : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                }
                ${file ? "p-3" : "p-8"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Drag and drop your PDF here
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    PDF files only
                  </p>

                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Browse Files
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-2 rounded border border-gray-200 dark:border-gray-700 mr-3">
                    <FileIcon className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(file.size / 1024)} KB • PDF Document
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider" className="font-medium">
              Select Model Provider
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {providers.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all cursor-pointer
                    ${
                      provider === p.id
                        ? "border-primary bg-primary/5 shadow-md dark:bg-primary/20 dark:border-primary/70"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Image
                        src={p.iconSrc}
                        alt={`${p.name} logo`}
                        width={24}
                        height={24}
                        className="dark:invert dark:brightness-90"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{p.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {provider && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Model Selection</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select models for different processing tasks
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label
                      htmlFor="layout-model"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      Layout Model
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-300">
                        Easier task
                      </span>
                    </Label>
                  </div>
                  <Select
                    value={layoutModel}
                    onValueChange={setLayoutModel}
                    disabled={!provider}
                  >
                    <SelectTrigger
                      id="layout-model"
                      className="bg-white dark:bg-slate-800 h-9"
                    >
                      <SelectValue
                        placeholder={
                          provider
                            ? "Select a layout model"
                            : "Select a provider first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {provider &&
                        modelsByProvider[
                          provider as keyof typeof modelsByProvider
                        ].layout.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    For document structure and layout extraction
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label
                      htmlFor="description-model"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      Description Model
                      <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 text-xs text-amber-800 dark:text-amber-300">
                        Harder task
                      </span>
                    </Label>
                  </div>
                  <Select
                    value={descriptionModel}
                    onValueChange={setDescriptionModel}
                    disabled={!provider}
                  >
                    <SelectTrigger
                      id="description-model"
                      className="bg-white dark:bg-slate-800 h-9"
                    >
                      <SelectValue
                        placeholder={
                          provider
                            ? "Select a description model"
                            : "Select a provider first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {provider &&
                        modelsByProvider[
                          provider as keyof typeof modelsByProvider
                        ].description.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    For content analysis and understanding
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-5"
          disabled={
            !file ||
            !apiKey ||
            !provider ||
            !layoutModel ||
            !descriptionModel ||
            isUploading
          }
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process PDF
            </>
          )}
        </Button>
      </form>

      {isProcessed && pdfUrl && (
        <div id="results" className="mt-8">
          <PDFViewer pdfUrl={pdfUrl} pdfData={pdfData} />
        </div>
      )}
    </div>
  );
}
