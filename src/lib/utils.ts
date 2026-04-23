import {
  BreadcrumbItemData,
  NavMainItem,
  SecondSidebarCardData,
  SupportedFileType,
} from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join class names together.
 * It uses `clsx` to handle conditional logic and `twMerge` to merge Tailwind CSS classes.
 * Example usage:
 * const buttonClass = cn("btn", isPrimary && "btn-primary", isDisabled && "btn-disabled")
 * This will result in "btn btn-primary" if isPrimary is true, "btn btn-disabled" if isDisabled is true, and just "btn" if neither is true.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Converts a URL pathname into an array of breadcrumb items.
 * Each breadcrumb item contains a label (formatted in title case) and a corresponding href.
 * For example, the pathname "/dashboard/clients" would be converted to:
 * [
 *   { label: "Dashboard", href: "/dashboard" },
 *   { label: "Clients", href: "/dashboard/clients" }
 * ]
 * If the pathname is empty or just "/", it returns a single breadcrumb item for the dashboard.
 */
function toTitleCase(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Converts a URL pathname into an array of breadcrumb items.
 * Each breadcrumb item contains a label (formatted in title case) and a corresponding href.
 * For example, the pathname "/dashboard/clients" would be converted to:
 * [
 *   { label: "Dashboard", href: "/dashboard" },
 *   { label: "Clients", href: "/dashboard/clients" }
 * ]
 * If the pathname is empty or just "/", it returns a single breadcrumb item for the dashboard.
 */
export function pathnameToBreadcrumbs(pathname: string): BreadcrumbItemData[] {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return [{ label: "Dashboard", href: "/dashboard" }]
  }

  return segments.map((segment, index) => ({
    label: toTitleCase(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }))
}

/** Resolves the active nav item based on the current pathname.
 * It matches exact paths and nested paths (e.g. /clients/123 -> /clients).
 */
export function getActiveNavItemByPathname(
  pathname: string,
  navItems: NavMainItem[]
): NavMainItem {
  const normalizedPathname = pathname.toLowerCase()

  const matchedItem = navItems.find((item) => {
    const normalizedUrl = item.url.toLowerCase()

    return (
      normalizedPathname === normalizedUrl ||
      normalizedPathname.startsWith(`${normalizedUrl}/`)
    )
  })

  return matchedItem ?? navItems[0]
}

/** Utility function to handle promise rejections in an async/await style.
 * It takes a promise and returns a tuple where the first element is the error (if any) and the second element is the resolved data (if successful).
 * This allows for cleaner error handling without needing to use try/catch blocks.
 * Example usage:
 * const [error, data] = await catchError(someAsyncFunction())
 * if (error) {
 *   // handle error
 * } else {
 *   // use data
 * }
 */
export const catchError = async <T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> => {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((error) => [error] as [Error])
}

/** Utility function to filter an array of SecondSidebarCardData based on a search string.
 * It checks if the search string is included in either the title or description of each client, ignoring case.
 * If the search string is empty, it returns the original array without filtering.
 * This is useful for implementing a search feature in a sidebar or list of items.
 */
export const filterSearchData = (
  data: SecondSidebarCardData[],
  search: string
) => {
  if (!search) return data

  const needle = search.toLowerCase()

  return data.filter((client) => {
    const name = client.title.toLowerCase()
    const email = client.description?.toLowerCase() ?? ""

    return name.includes(needle) || email.includes(needle)
  })
}

/** Utility function to determine the supported file type based on a given MIME type string.
 * It checks if the MIME type corresponds to a PDF or an image format and returns the appropriate SupportedFileType.
 * If the MIME type is null or does not match any supported formats, it returns "unsupported".
 * Example usage:
 * getFileTypeFromMime("application/pdf") // returns "pdf"
 * getFileTypeFromMime("image/jpeg") // returns "image"
 * getFileTypeFromMime("text/plain") // returns "unsupported"
 */
export const getFileTypeFromMime = (
  mimeType: string | null
): SupportedFileType => {
  if (!mimeType) return "unsupported"

  if (mimeType.includes("application/pdf")) {
    return "pdf"
  }

  if (mimeType.startsWith("image/")) {
    return "image"
  }

  return "unsupported"
}

/** Utility function to handle file downloads in the browser.
 * It takes the current downloading state, the file URL, and state setters for downloading and error handling.
 * If a download is already in progress or the file URL is null, it does nothing.
 * Otherwise, it fetches the file, creates a temporary anchor element to trigger the download, and handles any errors that may occur during the process.
 * Example usage:
 * handleDownload(isDownloading, filePreviewUrl, setIsDownloading, setHasError)
 * This will initiate a download of the file at filePreviewUrl if not already downloading, and update the state accordingly.
 */
export const handleDownload = async (
  isDownloading: boolean,
  filePreviewUrl: string | null,
  setIsDownloading: (value: boolean) => void,
  setHasError: (value: boolean) => void,
  name: string
) => {
  if (!filePreviewUrl || isDownloading) return

  setIsDownloading(true)

  try {
    const response = await fetch(filePreviewUrl)

    if (!response.ok) {
      throw new Error("No se pudo descargar el archivo")
    }

    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)
    const extension = blob.type.includes("pdf") ? "pdf" : "bin"
    const fileName = `${name}.${extension}`

    const anchor = document.createElement("a")
    anchor.href = downloadUrl
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(downloadUrl)
  } catch {
    setHasError(true)
  } finally {
    setIsDownloading(false)
  }
}

/** Utility function to detect the MIME type of a file from its preview URL.
 * It first attempts a `HEAD` request to read the `content-type` header and falls back
 * to a `GET` request when the header is unavailable or the `HEAD` request fails.
 * If the operation has not been cancelled, it updates loading, error, and MIME type state.
 */
export const detectMimeType = async (
  setIsLoading: (value: boolean) => void,
  setHasError: (value: boolean) => void,
  setMimeType: (value: string | null) => void,
  filePreviewUrl: string,
  cancelled: boolean
) => {
  setIsLoading(true)
  setHasError(false)

  try {
    const headResponse = await fetch(filePreviewUrl, {
      method: "HEAD",
    })

    let contentType = headResponse.headers.get("content-type")

    if ((!headResponse.ok || !contentType) && !cancelled) {
      const fallbackResponse = await fetch(filePreviewUrl)

      if (!fallbackResponse.ok) {
        throw new Error("No se pudo leer el archivo")
      }

      contentType =
        fallbackResponse.headers.get("content-type") ||
        (await fallbackResponse.blob()).type ||
        null
    }

    if (!cancelled) {
      setMimeType(contentType)
    }
  } catch {
    if (!cancelled) {
      setHasError(true)
    }
  } finally {
    if (!cancelled) {
      setIsLoading(false)
    }
  }
}
