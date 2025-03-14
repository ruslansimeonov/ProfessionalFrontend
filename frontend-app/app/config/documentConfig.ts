type COURSE_TYPES = ["Начално обучение", "Опреснително обучение"];

/**
 * Document types configuration for the application
 * Centralizes document definitions to avoid duplication
 */

export interface DocumentTypeConfig {
  name: string; // API identifier
  label: string; // UI display name
  description: string; // Longer description
  courseTypes: COURSE_TYPES; // Course types this document is required for
}

/**
 * Master list of all document types in the system
 */
export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    name: "DiplomaCopy",
    label: "Диплома за завършено образование",
    description: "Диплома за завършено образование (минимум 10 клас)",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "DriverLicense",
    label: "Шофьорска книжка",
    description: "Шофьорска книжка",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "MedicalCertificateGeneral",
    label: "Медицинско удостоверение",
    description: "Медицинско удостоверение от личен лекар",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "PsychiatricCertificate",
    label: "Психиатрично удостоверение",
    description: "Психиатрично удостоверение",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "PassportPhotos",
    label: "Снимки паспортен формат",
    description: "Снимки паспортен формат",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "ExistingLicenseCopy",
    label: "Съществуваща валидна лицензия",
    description: "Копие на съществуваща валидна лицензия",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "MedicalCertificateRefresher",
    label: "Медицинско удостоверение за опреснителен курс",
    description: "Медицинско удостоверение специално за опреснителен курс",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
  {
    name: "PassportId",
    label: "Паспорт/Лична карта",
    description: "Копие на паспорт или лична карта",
    courseTypes: ["Начално обучение", "Опреснително обучение"],
  },
];

/**
 * Get document types filtered by course type
 */
export function getDocumentTypesByCourse(
  courseType: string | null
): DocumentTypeConfig[] {
  if (!courseType) {
    return DOCUMENT_TYPES;
  }

  return DOCUMENT_TYPES.filter((doc) =>
    doc.courseTypes?.some(
      (type) => type.toLowerCase() === courseType.toLowerCase()
    )
  );
}

/**
 * Get document label by name
 */
export function getDocumentLabel(documentName: string): string {
  const docType = DOCUMENT_TYPES.find(
    (doc) => doc.name.toLowerCase() === documentName.toLowerCase()
  );
  return docType?.label || documentName;
}

/**
 * Get document description by name
 */
export function getDocumentDescription(
  documentName: string | undefined
): string {
  if (!documentName) return "Документ";

  const docType = DOCUMENT_TYPES.find((doc) =>
    documentName.toLowerCase().includes(doc.name.toLowerCase())
  );
  return docType?.description || documentName;
}
