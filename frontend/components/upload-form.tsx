"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import PDFViewer from "@/components/pdf-viewer"

const providers = [
  { id: "anthropic", name: "Anthropic" },
  { id: "gemini", name: "Google Gemini" },
  { id: "openai", name: "OpenAI" },
]

const modelsByProvider = {
  anthropic: [
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
  ],
  gemini: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  ],
}

export default function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [provider, setProvider] = useState("")
  const [model, setModel] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setPdfUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleProviderChange = (value: string) => {
    setProvider(value)
    setModel("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !apiKey || !provider || !model) return

    setIsUploading(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsUploading(false)
      setIsProcessed(true)
      router.push(`#results`)
    }, 2000)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload PDF Document</Label>
            <div className="mt-1 flex items-center gap-4">
              <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
              {file && (
                <p className="text-sm text-gray-500">
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Select Provider</Label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger id="provider" className="mt-1">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">Select Model</Label>
              <Select value={model} onValueChange={setModel} disabled={!provider}>
                <SelectTrigger id="model" className="mt-1">
                  <SelectValue placeholder={provider ? "Select a model" : "Select a provider first"} />
                </SelectTrigger>
                <SelectContent>
                  {provider &&
                    modelsByProvider[provider as keyof typeof modelsByProvider].map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!file || !apiKey || !provider || !model || isUploading}>
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
          <h2 className="text-2xl font-bold">AutoPDFParse Results</h2>
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      )}
    </div>
  )
}
