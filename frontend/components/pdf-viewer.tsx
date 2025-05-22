"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileText, Layers } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PDFViewerProps {
  pdfUrl: string;
  pdfData: {
    pageNumber: number;
    extractedText: string;
    isLayoutDependent: boolean;
  }[];
}

export default function PDFViewer({ pdfUrl, pdfData }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(pdfData.length);
  const [viewMode, setViewMode] = useState<"side-by-side" | "tabbed">(
    "side-by-side"
  );
  const [iframeKey, setIframeKey] = useState(0);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setIframeKey((prevKey) => prevKey + 1); // Force iframe refresh
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setIframeKey((prevKey) => prevKey + 1); // Force iframe refresh
    }
  };

  // Get current page data
  const currentPageData =
    pdfData.find((p) => p.pageNumber === currentPage) || pdfData[0];

  // Determine screen size for responsive layout
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewMode(window.innerWidth < 768 ? "tabbed" : "side-by-side");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("side-by-side")}
              className={
                viewMode === "side-by-side"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <Layers className="h-4 w-4 mr-1" />
              Side by Side
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("tabbed")}
              className={
                viewMode === "tabbed"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              <FileText className="h-4 w-4 mr-1" />
              Tabbed View
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {viewMode === "tabbed" ? (
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf">PDF Document</TabsTrigger>
            <TabsTrigger value="text">Extracted Text</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
                  <iframe
                    key={iframeKey}
                    src={`${pdfUrl}#page=${currentPage}`}
                    className="w-full h-full border-0"
                    title={`PDF Page ${currentPage}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="text" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center">
                  <Badge
                    variant={
                      currentPageData.isLayoutDependent
                        ? "destructive"
                        : "secondary"
                    }
                    className="mr-2"
                  >
                    {currentPageData.isLayoutDependent
                      ? "Layout Dependent"
                      : "Layout Independent"}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-md min-h-[400px] overflow-auto prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentPageData.extractedText}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">PDF Document</h3>
              <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
                <iframe
                  key={iframeKey}
                  src={`${pdfUrl}#page=${currentPage}`}
                  className="w-full h-full border-0"
                  title={`PDF Page ${currentPage}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Extracted Text</h3>
                <Badge
                  variant={
                    currentPageData.isLayoutDependent
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {currentPageData.isLayoutDependent
                    ? "Layout Dependent"
                    : "Layout Independent"}
                </Badge>
              </div>
              <div className="bg-gray-50 p-4 rounded-md min-h-[400px] overflow-auto prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentPageData.extractedText}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
