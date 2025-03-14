import { useState, useCallback } from "react";
import { uploadUserDocuments } from "../utils/apis/documents";

export interface DocType {
  name: string;
  label: string;
  required: boolean;
}

export function useDocumentUpload(onSuccess?: () => void) {
  const [fileInputs, setFileInputs] = useState<{
    [docType: string]: File | null;
  }>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFileInputs((prev) => ({ ...prev, [docType]: selectedFile }));
      }
    },
    []
  );

  const handleRemoveFile = useCallback((docType: string) => {
    setFileInputs((prev) => ({ ...prev, [docType]: null }));
  }, []);

  const handleUpload = useCallback(
    async (userId: string | number, docTypes: DocType[]) => {
      setError(null);
      setSuccess(null);
      setUploading(true);

      // Gather files and docTypeNames
      const files: File[] = [];
      const docTypeNames: string[] = [];

      for (const { name: docTypeName } of docTypes) {
        const file = fileInputs[docTypeName];
        if (file) {
          files.push(file);
          docTypeNames.push(docTypeName);
        }
      }

      if (files.length === 0) {
        setError("Моля, изберете поне един файл за качване.");
        setUploading(false);
        return false;
      }

      try {
        const response = await uploadUserDocuments({
          userId: String(userId),
          files,
          docTypeNames,
        });

        if (response.success) {
          setSuccess("Документите са качени успешно!");
          if (onSuccess) onSuccess();
          return true;
        } else {
          setError(`Грешка при качване: ${response.error}`);
          return false;
        }
      } catch (error) {
        console.error("Error uploading documents:", error);
        setError("Възникна грешка при качване на документи.");
        return false;
      } finally {
        setUploading(false);
      }
    },
    [fileInputs, onSuccess]
  );

  const resetFiles = useCallback(() => {
    setFileInputs({});
  }, []);

  const resetMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const selectedFilesCount = Object.values(fileInputs).filter(Boolean).length;

  return {
    fileInputs,
    uploading,
    error,
    success,
    selectedFilesCount,
    handleFileChange,
    handleRemoveFile,
    handleUpload,
    resetFiles,
    resetMessages,
  };
}
