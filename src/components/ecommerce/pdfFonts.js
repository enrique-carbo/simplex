/* import pdfMake from "pdfmake/build/pdfmake";

const pdfFonts = {
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
  };

if (typeof window !== 'undefined') {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = pdfFonts;
export default pdfMake; */

let pdfMake;
let pdfFonts;

try {
  pdfMake = require('pdfmake/build/pdfmake');
  pdfFonts = require('pdfmake/build/vfs_fonts');
  
  if (pdfMake && pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.warn('pdfMake or pdfFonts not loaded correctly');
  }
} catch (error) {
  console.error('Error loading pdfMake or pdfFonts:', error);
}

export default pdfMake;