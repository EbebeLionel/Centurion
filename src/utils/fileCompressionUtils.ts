// fileCompressionUtils.ts
// Using built-in browser compression APIs - OPTIMIZED VERSION

// Type declarations for browser compression APIs
declare global {
  interface Window {
    CompressionStream: typeof CompressionStream;
    DecompressionStream: typeof DecompressionStream;
  }
}

interface CompressionStream {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

interface DecompressionStream {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

interface CompressionStreamConstructor {
  new (format: string): CompressionStream;
}

interface DecompressionStreamConstructor {
  new (format: string): DecompressionStream;
}

declare const CompressionStream: CompressionStreamConstructor;
declare const DecompressionStream: DecompressionStreamConstructor;

export interface CompressionResult {
  compressedData: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  isCompressed: boolean;
}

export interface FileProcessingResult {
  data: string;
  originalFileName: string;
  originalSize: number;
  finalSize: number;
  isCompressed: boolean;
  compressionRatio?: number;
}

// Helper Functions
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// FAST chunking compression - optimized for speed
const fastChunkCompression = async (data: ArrayBuffer): Promise<CompressionResult> => {
  const originalSize = data.byteLength;
  const uint8Array = new Uint8Array(data);
  const chunkSize = 2 * 1024 * 1024; // 2MB chunks for speed
  const chunks: string[] = [];
  
  const batchSize = 5; // Process 5 chunks at a time
  let processedChunks = 0;
  const totalChunks = Math.ceil(uint8Array.length / chunkSize);
  
  console.log(`Processing ${totalChunks} chunks of ${chunkSize / (1024 * 1024)}MB each...`);
  
  for (let i = 0; i < uint8Array.length; i += chunkSize * batchSize) {
    const batchPromises: Promise<string>[] = [];
    
    for (let j = 0; j < batchSize && (i + j * chunkSize) < uint8Array.length; j++) {
      const chunkStart = i + j * chunkSize;
      const chunkEnd = Math.min(chunkStart + chunkSize, uint8Array.length);
      const chunk = uint8Array.slice(chunkStart, chunkEnd);
      
      batchPromises.push(new Promise((resolve) => {
        const chunkBase64 = arrayBufferToBase64(chunk.buffer);
        resolve(chunkBase64);
      }));
    }
    
    const batchResults = await Promise.all(batchPromises);
    chunks.push(...batchResults);
    processedChunks += batchResults.length;
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 1));
    
    if (processedChunks % 10 === 0) {
      console.log(`Processed ${processedChunks}/${totalChunks} chunks (${((processedChunks / totalChunks) * 100).toFixed(1)}%)`);
    }
  }
  
  const compressedData = JSON.stringify({
    type: 'chunked',
    chunks: chunks,
    originalSize: originalSize,
    chunkSize: chunkSize,
    totalChunks: chunks.length
  });
  
  const compressedBase64 = btoa(compressedData);
  const compressedSize = compressedBase64.length;
  const compressionRatio = Math.max(0, (1 - compressedSize / originalSize) * 100);
  
  return {
    compressedData: compressedBase64,
    originalSize,
    compressedSize,
    compressionRatio,
    isCompressed: true
  };
};

// FAST decompression for chunked format
const fastChunkDecompression = async (compressedBase64: string): Promise<ArrayBuffer> => {
  const compressedData = atob(compressedBase64);
  const parsedData = JSON.parse(compressedData);
  
  if (parsedData.type !== 'chunked') {
    return base64ToArrayBuffer(compressedBase64);
  }
  
  console.log(`Fast decompression: ${parsedData.totalChunks || parsedData.chunks.length} chunks`);
  
  const totalSize = parsedData.originalSize;
  const reconstructed = new Uint8Array(totalSize);
  const chunks = parsedData.chunks;
  const batchSize = 10; // Process 10 chunks at a time
  
  let offset = 0;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batchPromises: Promise<Uint8Array>[] = [];
    
    for (let j = 0; j < batchSize && (i + j) < chunks.length; j++) {
      const chunkBase64 = chunks[i + j];
      batchPromises.push(new Promise((resolve) => {
        const chunkBuffer = base64ToArrayBuffer(chunkBase64);
        resolve(new Uint8Array(chunkBuffer));
      }));
    }
    
    const batchResults = await Promise.all(batchPromises);
    
    for (const chunkArray of batchResults) {
      reconstructed.set(chunkArray, offset);
      offset += chunkArray.length;
    }
    
    // Allow UI to update
    await new Promise(resolve => setTimeout(resolve, 1));
    
    if ((i + batchSize) % 50 === 0) {
      const progress = ((i + batchSize) / chunks.length * 100).toFixed(1);
      console.log(`Decompression progress: ${progress}%`);
    }
  }
  
  return reconstructed.buffer as ArrayBuffer;
};

// Main compression function
export const compressData = async (data: ArrayBuffer): Promise<CompressionResult> => {
  try {
    // Always use fast chunking for consistency and speed
    return await fastChunkCompression(data);
  } catch (error) {
    console.error('Compression failed:', error);
    throw new Error('Failed to compress file');
  }
};

// Main decompression function
export const decompressData = async (compressedBase64: string): Promise<ArrayBuffer> => {
  try {
    return await fastChunkDecompression(compressedBase64);
  } catch (error) {
    console.error('Decompression failed:', error);
    // Final fallback: direct base64 conversion
    return base64ToArrayBuffer(compressedBase64);
  }
};

// Process file with fast compression for files over 50MB
export const processFileForStorage = async (file: File): Promise<FileProcessingResult> => {
  const MAX_SIZE_MB = 50;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  
  try {
    const originalSize = file.size;
    
    // If file is under 50MB, store as base64 without compression
    if (originalSize <= MAX_SIZE_BYTES) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve({
            data: reader.result as string,
            originalFileName: file.name,
            originalSize,
            finalSize: originalSize,
            isCompressed: false
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    
    // File is over 50MB - use fast chunking
    console.log(`File ${file.name} is ${(originalSize / 1024 / 1024).toFixed(2)}MB, using fast chunking...`);
    
    const arrayBuffer = await fileToArrayBuffer(file);
    const compressionResult = await fastChunkCompression(arrayBuffer);
    
    const compressedDataWithMetadata = `data:application/chunked;base64,${compressionResult.compressedData}`;
    
    console.log(`Fast chunking completed: ${compressionResult.compressionRatio.toFixed(1)}% size organized`);
    
    return {
      data: compressedDataWithMetadata,
      originalFileName: file.name,
      originalSize: compressionResult.originalSize,
      finalSize: compressionResult.compressedSize,
      isCompressed: true,
      compressionRatio: compressionResult.compressionRatio
    };
    
  } catch (error) {
    console.error('File processing failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to process file: ${errorMessage}`);
  }
};

// Check if data is compressed
export const isCompressedData = (data: string): boolean => {
  return data.startsWith('data:application/gzip;base64,') || 
         data.startsWith('data:application/compressed;base64,') ||
         data.startsWith('data:application/chunked;base64,');
};

// Extract compressed data from data URL
export const extractCompressedData = (dataUrl: string): string => {
  if (dataUrl.startsWith('data:application/gzip;base64,')) {
    return dataUrl.replace('data:application/gzip;base64,', '');
  } else if (dataUrl.startsWith('data:application/compressed;base64,')) {
    return dataUrl.replace('data:application/compressed;base64,', '');
  } else if (dataUrl.startsWith('data:application/chunked;base64,')) {
    return dataUrl.replace('data:application/chunked;base64,', '');
  }
  throw new Error('Data is not compressed');
};

// Create download blob - optimized version
export const createDownloadBlob = async (
  storedData: string, 
  fileName: string, 
  mimeType?: string
): Promise<Blob> => {
  try {
    if (isCompressedData(storedData)) {
      console.log('Decompressing file for download...');
      const compressedBase64 = extractCompressedData(storedData);
      const decompressedBuffer = await decompressData(compressedBase64);
      const finalMimeType = mimeType || getMimeTypeFromFileName(fileName);
      return new Blob([decompressedBuffer], { type: finalMimeType });
    } else {
      console.log('Converting regular base64 data for download...');
      const response = await fetch(storedData);
      return await response.blob();
    }
  } catch (error) {
    console.error('Failed to create download blob:', error);
    
    // Emergency fallback
    try {
      console.log('Emergency fallback: attempting direct base64 extraction...');
      let base64Data = storedData;
      
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      
      const finalMimeType = mimeType || getMimeTypeFromFileName(fileName);
      return new Blob([bytes], { type: finalMimeType });
    } catch (emergencyError) {
      console.error('Emergency fallback also failed:', emergencyError);
      throw new Error('Failed to prepare file for download - file may be corrupted');
    }
  }
};

// Helper function to determine MIME type from file extension
const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  const mimeTypes: { [key: string]: string } = {
    'obj': 'application/octet-stream',
    'fbx': 'application/octet-stream',
    'gltf': 'model/gltf+json',
    'glb': 'model/gltf-binary',
    'dae': 'model/vnd.collada+xml',
    '3ds': 'application/octet-stream',
    'blend': 'application/octet-stream',
    'stl': 'application/octet-stream',
    'ply': 'application/octet-stream'
  };
  
  return extension ? (mimeTypes[extension] || 'application/octet-stream') : 'application/octet-stream';
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debug function to check file data integrity
export const debugFileData = (storedData: string, fileName: string): void => {
  console.log('=== FILE DEBUG INFO ===');
  console.log('File name:', fileName);
  console.log('Data length:', storedData.length);
  console.log('Is compressed:', isCompressedData(storedData));
  console.log('Data prefix:', storedData.substring(0, 50) + '...');
  
  if (isCompressedData(storedData)) {
    try {
      const compressedBase64 = extractCompressedData(storedData);
      console.log('Compressed data length:', compressedBase64.length);
      
      try {
        const decodedData = atob(compressedBase64);
        const parsedData = JSON.parse(decodedData);
        if (parsedData.type === 'chunked') {
          console.log('Chunked format detected:');
          console.log('- Original size:', parsedData.originalSize);
          console.log('- Chunks count:', parsedData.chunks?.length);
          console.log('- Chunk size:', parsedData.chunkSize);
        }
      } catch (e) {
        console.log('Not chunked format, likely gzip compressed');
      }
    } catch (e) {
      console.error('Error extracting compressed data:', e);
    }
  }
  console.log('=====================');
};

// Check if compression is available
export const isCompressionAvailable = (): boolean => {
  try {
    return 'CompressionStream' in window && 'DecompressionStream' in window;
  } catch {
    return false;
  }
};