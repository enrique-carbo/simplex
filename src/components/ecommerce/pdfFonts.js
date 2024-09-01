import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Importa las fuentes como archivos
import RobotoRegular from '/fonts/Roboto-Regular.ttf';
import RobotoBold from '/fonts/Roboto-Bold.ttf';
import RobotoItalic from '/fonts/Roboto-Italic.ttf';
import RobotoBoldItalic from '/fonts/Roboto-BoldItalic.ttf';

// Función para convertir la fuente a base64
const fontToBase64 = async (fontUrl) => {
  const response = await fetch(fontUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Configuración de fuentes
const fonts = {
  Roboto: {
    normal: 'Roboto-Regular',
    bold: 'Roboto-Bold',
    italics: 'Roboto-Italic',
    bolditalics: 'Roboto-BoldItalic'
  }
};

// Cargar las fuentes en el sistema de archivos virtual
const loadFonts = async () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.vfs['Roboto-Regular'] = await fontToBase64(RobotoRegular);
  pdfMake.vfs['Roboto-Bold'] = await fontToBase64(RobotoBold);
  pdfMake.vfs['Roboto-Italic'] = await fontToBase64(RobotoItalic);
  pdfMake.vfs['Roboto-BoldItalic'] = await fontToBase64(RobotoBoldItalic);
};

// Inicializar pdfMake con las fuentes
loadFonts().then(() => {
  pdfMake.fonts = fonts;
});

export default pdfMake;