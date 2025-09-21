// Utility functions for file handling and text extraction
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker - use local worker file
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
}

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        if (file.type === "application/pdf") {
          // Handle PDF files
          const text = await extractTextFromPDF(arrayBuffer);
          resolve(text);
        } else if (file.type === "text/plain") {
          // Handle text files
          const text = new TextDecoder().decode(arrayBuffer);
          resolve(text);
        } else if (
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // For Word documents, we'll need a different approach
          // For now, let's try to extract what we can
          const text = new TextDecoder().decode(arrayBuffer);
          resolve(text);
        } else {
          // Default to text extraction
          const text = new TextDecoder().decode(arrayBuffer);
          resolve(text);
        }
      } catch (error) {
        console.error("Error extracting text from file:", error);
        reject(new Error(`Failed to extract text from file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    // Read as ArrayBuffer for proper binary file handling
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to extract text from PDF using pdfjs
const extractTextFromPDF = async (
  arrayBuffer: ArrayBuffer
): Promise<string> => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  return allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const extractCompanyAndRole = (
  jobDescription: string
): { company: string; role: string } => {
  // Simple extraction logic - in a real app, you might want more sophisticated parsing
  const lines = jobDescription.split("\n").filter((line) => line.trim());

  // Look for common patterns
  let company = "";
  let role = "";

  // Try to find company name (often in first few lines)
  for (const line of lines.slice(0, 5)) {
    if (
      line.toLowerCase().includes("company:") ||
      line.toLowerCase().includes("organization:")
    ) {
      company = line.split(":")[1]?.trim() || "";
      break;
    }
  }

  // Try to find role/position (often in title or first line)
  for (const line of lines.slice(0, 3)) {
    if (
      line.toLowerCase().includes("position:") ||
      line.toLowerCase().includes("role:") ||
      line.toLowerCase().includes("job title:")
    ) {
      role = line.split(":")[1]?.trim() || "";
      break;
    }
  }

  // Fallback: use first line as role if not found
  if (!role && lines.length > 0) {
    role = lines[0].trim();
  }

  // Fallback: try to extract from common patterns
  if (!company) {
    const companyMatch = jobDescription.match(
      /(?:at|join|with)\s+([A-Z][a-zA-Z\s&.]+?)(?:\s|,|\.|\n)/
    );
    if (companyMatch) {
      company = companyMatch[1].trim();
    }
  }

  return { company: company || "Company", role: role || "Position" };
};
