"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  detectMimeType,
  getFileTypeFromMime,
  handleDownload,
} from "@/lib/utils"
import { AlertCircle, Download, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useReducer, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface InvoiceFilePreviewCardProps {
  filePreviewUrl: string | null
}

interface InvoiceFilePreviewState {
  mimeType: string | null
  isLoading: boolean
  isDownloading: boolean
  hasError: boolean
  pdfPages: number
  pdfWidth: number
}

type InvoiceFilePreviewAction =
  | { type: "setMimeType"; payload: string | null }
  | { type: "setIsLoading"; payload: boolean }
  | { type: "setIsDownloading"; payload: boolean }
  | { type: "setHasError"; payload: boolean }
  | { type: "setPdfPages"; payload: number }
  | { type: "setPdfWidth"; payload: number }

const initialState: InvoiceFilePreviewState = {
  mimeType: null,
  isLoading: false,
  isDownloading: false,
  hasError: false,
  pdfPages: 0,
  pdfWidth: 600,
}

function invoiceFilePreviewReducer(
  state: InvoiceFilePreviewState,
  action: InvoiceFilePreviewAction
): InvoiceFilePreviewState {
  switch (action.type) {
    case "setMimeType":
      return { ...state, mimeType: action.payload }
    case "setIsLoading":
      return { ...state, isLoading: action.payload }
    case "setIsDownloading":
      return { ...state, isDownloading: action.payload }
    case "setHasError":
      return { ...state, hasError: action.payload }
    case "setPdfPages":
      return { ...state, pdfPages: action.payload }
    case "setPdfWidth":
      return { ...state, pdfWidth: action.payload }
    default:
      return state
  }
}

export default function InvoiceFilePreviewCard({
  filePreviewUrl,
}: InvoiceFilePreviewCardProps) {
  const [state, dispatch] = useReducer(invoiceFilePreviewReducer, initialState)
  const pdfContainerRef = useRef<HTMLDivElement | null>(null)
  const fileType = getFileTypeFromMime(state.mimeType)

  const setMimeType = (value: string | null) => {
    dispatch({ type: "setMimeType", payload: value })
  }

  const setIsLoading = (value: boolean) => {
    dispatch({ type: "setIsLoading", payload: value })
  }

  const setIsDownloading = (value: boolean) => {
    dispatch({ type: "setIsDownloading", payload: value })
  }

  const setHasError = (value: boolean) => {
    dispatch({ type: "setHasError", payload: value })
  }

  const setPdfPages = (value: number) => {
    dispatch({ type: "setPdfPages", payload: value })
  }

  const setPdfWidth = (value: number) => {
    dispatch({ type: "setPdfWidth", payload: value })
  }

  const mimeTypeDetectionRequestRef = useRef(0)

  useEffect(() => {
    if (!filePreviewUrl) return

    const requestId = ++mimeTypeDetectionRequestRef.current

    void detectMimeType(
      (value: boolean) => {
        if (mimeTypeDetectionRequestRef.current === requestId) {
          setIsLoading(value)
        }
      },
      (value: boolean) => {
        if (mimeTypeDetectionRequestRef.current === requestId) {
          setHasError(value)
        }
      },
      (value) => {
        if (mimeTypeDetectionRequestRef.current === requestId) {
          setMimeType(value)
        }
      },
      filePreviewUrl,
      false
    )

    return () => {
      if (mimeTypeDetectionRequestRef.current === requestId) {
        mimeTypeDetectionRequestRef.current += 1
      }
    }
  }, [filePreviewUrl])

  useEffect(() => {
    const container = pdfContainerRef.current

    if (!container) return

    const updateWidth = () => {
      const nextWidth = Math.max(Math.floor(container.clientWidth) - 16, 240)
      setPdfWidth(nextWidth)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [filePreviewUrl, fileType])

  if (!filePreviewUrl) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardDescription>Archivo adjunto</CardDescription>
          <CardTitle>Vista previa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin archivo adjunto.</p>
        </CardContent>
      </Card>
    )
  }

  if (state.isLoading) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardDescription>Archivo adjunto</CardDescription>
          <CardTitle>Vista previa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (state.hasError) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardDescription>Archivo adjunto</CardDescription>
          <CardTitle>Vista previa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>No se pudo cargar la vista previa del archivo.</p>
          </div>
          <Link
            href={filePreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Abrir archivo
            <ExternalLink className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardDescription className="sr-only">Archivo adjunto</CardDescription>
        <CardTitle className="sr-only">Vista previa</CardTitle>

        <div className="w-full flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() =>
              void handleDownload(
                state.isDownloading,
                filePreviewUrl,
                setIsDownloading,
                setHasError,
                "factura-adjunta"
              )
            }
            disabled={state.isDownloading}
            aria-label="Descargar archivo"
          >
            {state.isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>

          <Link
            href={filePreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" id="invoice-file-preview-card">
        {fileType === "pdf" && (
          <div
            ref={pdfContainerRef}
            className="overflow-auto border bg-muted/20 p-2"
          >
            <Document
              file={filePreviewUrl}
              loading={<Skeleton className="h-96 w-full" />}
              error={
                <p className="text-sm text-destructive">
                  No se pudo renderizar el PDF.
                </p>
              }
              onLoadSuccess={(pdf) => setPdfPages(pdf.numPages)}
            >
              {Array.from({ length: state.pdfPages || 1 }, (_, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <Page
                    pageNumber={index + 1}
                    width={state.pdfWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              ))}
            </Document>
          </div>
        )}

        {fileType === "image" && (
          <div className="overflow-hidden rounded-md border bg-muted/20">
            <img
              src={filePreviewUrl}
              alt="Vista previa del archivo de la factura"
              className="h-auto max-h-180 w-full object-contain"
            />
          </div>
        )}

        {fileType === "unsupported" && (
          <p className="text-sm text-muted-foreground">
            Este tipo de archivo no admite vista previa embebida.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
