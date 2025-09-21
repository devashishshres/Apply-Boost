// Utility functions for file handling and text extraction

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // For simple text extraction, we'll read as text
    // In a real implementation, you might want to use a library like pdf-parse for PDFs
    reader.readAsText(file);
  });
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  
  return allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const extractCompanyAndRole = (jobDescription: string): { company: string; role: string } => {
  // Simple extraction logic - in a real app, you might want more sophisticated parsing
  const lines = jobDescription.split('\n').filter(line => line.trim());
  
  // Look for common patterns
  let company = '';
  let role = '';
  
  // Try to find company name (often in first few lines)
  for (const line of lines.slice(0, 5)) {
    if (line.toLowerCase().includes('company:') || line.toLowerCase().includes('organization:')) {
      company = line.split(':')[1]?.trim() || '';
      break;
    }
  }
  
  // Try to find role/position (often in title or first line)
  for (const line of lines.slice(0, 3)) {
    if (line.toLowerCase().includes('position:') || 
        line.toLowerCase().includes('role:') || 
        line.toLowerCase().includes('job title:')) {
      role = line.split(':')[1]?.trim() || '';
      break;
    }
  }
  
  // Fallback: use first line as role if not found
  if (!role && lines.length > 0) {
    role = lines[0].trim();
  }
  
  // Fallback: try to extract from common patterns
  if (!company) {
    const companyMatch = jobDescription.match(/(?:at|join|with)\s+([A-Z][a-zA-Z\s&.]+?)(?:\s|,|\.|\n)/);
    if (companyMatch) {
      company = companyMatch[1].trim();
    }
  }
  
  return { company: company || 'Company', role: role || 'Position' };
};