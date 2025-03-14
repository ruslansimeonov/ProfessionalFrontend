import React from "react";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import VerifiedIcon from "@mui/icons-material/VerifiedUser";
import { getDocumentDescription as getDocumentDescFromConfig } from "../config/documentConfig";

/**
 * Get appropriate icon based on document type or file extension
 */
export function getDocumentIcon(documentType: string | undefined, url: string) {
  // Default icon if documentType is undefined
  if (!documentType) {
    const fileExtension = url?.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return React.createElement(PdfIcon, { color: "error" });
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")
    ) {
      return React.createElement(ImageIcon, { color: "primary" });
    } else {
      return React.createElement(FileIcon, { color: "action" });
    }
  }

  if (
    documentType.toLowerCase().includes("id") ||
    documentType.toLowerCase().includes("passport") ||
    documentType.toLowerCase().includes("license")
  ) {
    return React.createElement(VerifiedIcon, { color: "info" });
  }

  const fileExtension = url?.split(".").pop()?.toLowerCase();
  if (fileExtension === "pdf") {
    return React.createElement(PdfIcon, { color: "error" });
  } else if (
    ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")
  ) {
    return React.createElement(ImageIcon, { color: "primary" });
  }

  return React.createElement(FileIcon, { color: "action" });
}

/**
 * Format date to be more readable
 */
export function formatDate(dateString: Date | string | undefined): string {
  if (!dateString) return "Неизвестна дата";

  try {
    return new Date(dateString).toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Невалидна дата";
  }
}

/**
 * Get document type description
 * @deprecated Use getDocumentDescription from config/documentConfig instead
 */
export function getDocumentDescription(
  documentType: string | undefined
): string {
  return getDocumentDescFromConfig(documentType);
}

/**
 * Check if a specific document type is missing
 */
export function isDocTypeMissing(
  docType: string,
  missingDocTypes: string[]
): boolean {
  return missingDocTypes.some((missingType) =>
    docType.toLowerCase().includes(missingType.toLowerCase())
  );
}
