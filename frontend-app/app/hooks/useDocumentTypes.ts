import { useState, useEffect } from "react";
import { getDocumentTypesByCourse } from "../config/documentConfig";

export interface DocType {
  name: string;
  label: string;
  required: boolean;
}

export function useDocumentTypes(missingDocTypes: string[] = [], courseType: string | null = null) {
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  
  // Load document types based on course type and mark required ones
  useEffect(() => {
    // Get document types filtered by course if specified
    const courseDocTypes = getDocumentTypesByCourse(courseType);
    
    // Map to DocType format and mark required docs
    const mappedTypes = courseDocTypes.map(doc => ({
      name: doc.name,
      label: doc.label,
      required: missingDocTypes.some(missing => 
        doc.name.toLowerCase().includes(missing.toLowerCase())
      )
    }));
    
    setDocTypes(mappedTypes);
  }, [missingDocTypes, courseType]);

  return docTypes;
}