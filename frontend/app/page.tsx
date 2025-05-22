import { Suspense } from "react";
import UploadForm from "@/components/upload-form";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Github, FileCode, Zap } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-end mb-4">
          <ModeToggle />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Try AutoPDFParse out
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Extract content from PDFs that have text, images and tables with
            ease using{" "}
            <Link
              href="https://github.com/ChidiRnweke/AutoPDFParse"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-2"
            >
              AutoPDFParse.
            </Link>{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 dark:bg-slate-800/80 dark:border-purple-900 hover:shadow-md transition-all">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full mb-4">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Two-Step Processing
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                First detects if a page contains complex data (tables, images),
                then processes accordingly - simple extraction or detailed
                description.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 dark:bg-slate-800/80 dark:border-blue-900 hover:shadow-md transition-all">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mb-4">
                <FileCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Drop-in Replacement for your favorite PDF to text library
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Easily replaces standard PDF packages with minimal code changes.
                Perfect for enhancing existing workflows with a stronger
                baseline.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 dark:bg-slate-800/80 dark:border-indigo-900 hover:shadow-md transition-all">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                RAG-Ready & Cost-Effective
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Optimized for RAG workflows with cost-efficient processing. Uses
                smaller models where possible, only scaling up when needed.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            href="https://github.com/ChidiRnweke/AutoPDFParse"
            target="_blank"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Github className="h-5 w-5" />
            View on GitHub
          </Link>
        </div>

        <Card className="mb-8 border-t-4 border-t-purple-500 dark:border-t-purple-700">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Test Your PDFs
            </h2>
            <p className="text-center mb-6 text-slate-600 dark:text-slate-300">
              Upload any PDF document and compare how different AI models
              process its content - no installation required.
            </p>
            <Suspense fallback={<div>Loading form...</div>}>
              <UploadForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
