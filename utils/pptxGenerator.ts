// utils/pptxGenerator.ts
import PptxGenJS from 'pptxgenjs';
import { Slide } from '../types';

// Helper to convert URL to Base64 for reliable PPTX embedding
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Failed to convert image to base64", error);
    return "";
  }
};

// Helper to strip markdown symbols for clean text output
export const stripMarkdown = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/__(.*?)__/g, '$1')     // Bold
    .replace(/_(.*?)_/g, '$1')       // Italic
    .replace(/`([^`]+)`/g, '$1')     // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
};

export const generatePowerPoint = async (
  slides: Slide[], 
  imageSeeds: Record<number, number>
): Promise<Blob> => {
  const pptx = new PptxGenJS();
  
  // Configure presentation
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'TrainerKit GenAI';
  pptx.company = 'TrainerKit';
  pptx.title = slides[0]?.title || 'Training Presentation';
  
  // Theme configuration
  const theme = {
    primaryColor: '4F46E5',      // Indigo 600
    accentColor: '6366F1',        // Indigo 500
    textColor: 'FFFFFF',          // White
    subtextColor: 'E2E8F0',       // Slate 200
    overlayColor: '0F172A',       // Slate 900
  };

  // Fetch all slide background images first
  const slideImages = await Promise.all(slides.map(async (s, i) => {
    const seed = i + (imageSeeds[i] || 0);
    const searchTerm = s.visualSearchTerm || s.title;
    const bgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      searchTerm + " high quality professional corporate business stock photo"
    )}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;
    return await urlToBase64(bgUrl);
  }));

  // Generate slides with enhanced styling
  slides.forEach((s, i) => {
    const slide = pptx.addSlide();
    
    // A. Background Image
    const bgData = slideImages[i];
    if (bgData) {
      slide.addImage({ 
        data: bgData, 
        x: 0, y: 0, w: '100%', h: '100%',
        sizing: { type: 'cover', w: '100%', h: '100%' }
      });
    } else {
      // Fallback gradient
      slide.addShape(pptx.ShapeType.rect, { 
        x: 0, y: 0, w: '100%', h: '100%', 
        fill: { color: '1E293B' } 
      });
    }

    // B. Dark Overlay for Readability (70% opacity)
    slide.addShape(pptx.ShapeType.rect, { 
      x: 0, y: 0, w: '100%', h: '100%', 
      fill: { color: theme.overlayColor, transparency: 30 }
    });
    
    // C. Slide Transitions
    // @ts-ignore - transition property exists in newer pptxgenjs
    slide.transition = { 
      type: 'fade', 
      duration: 800 
    };

    // D. Content based on slide type
    if (i === 0) {
      // Title Slide - Enhanced styling
      slide.addText(stripMarkdown(s.title), { 
        x: 0.5, y: 2.5, w: '90%', h: 2, 
        fontSize: 54, 
        fontFace: 'Arial', 
        bold: true, 
        color: theme.textColor, 
        align: 'center',
        shadow: { 
          type: 'outer', 
          color: '000000', 
          blur: 5, 
          offset: 3, 
          opacity: 0.6 
        }
      });
      
      // Subtitle with accent
      slide.addShape(pptx.ShapeType.rect, {
        x: 3, y: 4.3, w: 4, h: 0.1,
        fill: { color: theme.accentColor }
      });
      
      slide.addText("Generated Training Module", {
        x: 0.5, y: 4.6, w: '90%', h: 1,
        fontSize: 22, 
        fontFace: 'Arial', 
        color: theme.subtextColor, 
        align: 'center'
      });
      
      // Branding footer
      slide.addText("Powered by TrainerKit GenAI", {
        x: 0.5, y: 6.8, w: '90%', h: 0.4,
        fontSize: 12, 
        fontFace: 'Arial', 
        color: '94A3B8', 
        align: 'center',
        italic: true
      });
      
    } else {
      // Content Slides - Professional layout
      
      // Header with underline
      slide.addText(stripMarkdown(s.title), { 
        x: 0.5, y: 0.5, w: '90%', h: 1, 
        fontSize: 40, 
        fontFace: 'Arial', 
        bold: true, 
        color: theme.textColor,
        shadow: { 
          type: 'outer', 
          color: '000000', 
          blur: 3, 
          offset: 2, 
          opacity: 0.5 
        }
      });
      
      // Accent line under title
      slide.addShape(pptx.ShapeType.line, {
        x: 0.5, y: 1.4, w: 9, h: 0,
        line: { color: theme.accentColor, width: 4 }
      }); 

      // Content bullets with proper spacing
      const bulletItems = s.content.map(c => ({ 
        text: stripMarkdown(c), 
        options: { 
          fontSize: 22, 
          color: theme.subtextColor, 
          breakLine: true, 
          bullet: { 
            type: 'bullet' as const, 
            characterCode: '2022',
            indent: 20,
            marginPt: 10
          }, 
          paraSpaceBefore: 8,
          paraSpaceAfter: 8
        } 
      }));
      
      slide.addText(bulletItems, { 
        x: 0.7, y: 1.9, w: 8.6, h: 4.8, 
        valign: 'top',
        lineSpacing: 32
      });
      
      // Slide number badge
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 9, y: 6.8, w: 0.5, h: 0.3,
        fill: { color: theme.primaryColor, transparency: 20 }
      });
      
      slide.addText(`${i}`, { 
        x: 9, y: 6.8, w: 0.5, h: 0.3, 
        fontSize: 14, 
        color: theme.textColor,
        align: 'center',
        valign: 'middle',
        bold: true
      });
    }

    // Speaker Notes for all slides
    if (s.speakerNotes) {
      slide.addNotes(stripMarkdown(s.speakerNotes));
    }
  });

  return await pptx.write({ outputType: 'blob' }) as Blob;
};