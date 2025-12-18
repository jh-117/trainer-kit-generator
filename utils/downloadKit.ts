// utils/downloadKit.ts
import JSZip from 'jszip';
import { GeneratedKit } from '../types';
import { generatePowerPoint } from './pptxGenerator';
import { createStyledPdf, generateFlashcardsPdf } from './pdfGenerator';

export const downloadKit = async (
  kit: GeneratedKit
): Promise<void> => {
  // @ts-ignore
  const zip = new JSZip();

  // 1. Generate PowerPoint with enhanced styling
  const pptxBlob = await generatePowerPoint(kit.slides);
  zip.file("Training_Presentation.pptx", pptxBlob);
  
  // 2. Generate Professional PDFs
  const guideBlob = createStyledPdf("Facilitator Guide", kit.facilitatorGuideMarkdown);
  zip.file("Facilitator_Guide.pdf", guideBlob);

  const handoutBlob = createStyledPdf("Participant Handout", kit.handoutMarkdown);
  zip.file("Participant_Handout.pdf", handoutBlob);
  
  const flashcardsBlob = generateFlashcardsPdf(kit.flashcards);
  zip.file("Flashcards.pdf", flashcardsBlob);

  // 3. Generate and download zip
  const content = await zip.generateAsync({ type: "blob" });
  
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  
  const safeTitle = kit.slides[0]?.title
    .replace(/[^a-z0-9]/gi, '_')
    .substring(0, 30) || 'TrainerKit';
  link.download = `TrainerKit_${safeTitle}.zip`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};