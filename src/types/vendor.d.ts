declare module 'pdf-parse' {
  export interface PdfParseResult {
    text: string;
  }

  export class PDFParse {
    constructor(options: { data: Buffer | Uint8Array | ArrayBuffer });
    getText(): Promise<PdfParseResult>;
    destroy(): Promise<void>;
  }
}

declare module 'mammoth' {
  const mammoth: {
    extractRawText: (input: { buffer: Buffer }) => Promise<{ value: string }>;
  };
  export default mammoth;
}
