import { Font } from "@react-pdf/renderer";

let registered = false;

export const PDF_FONT = "NotoSansSC";

function fontSrc(file: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/fonts/${file}`;
  }
  return `/fonts/${file}`;
}

export function registerPdfFonts() {
  if (registered) return;
  registered = true;
  Font.register({
    family: PDF_FONT,
    fonts: [
      {
        src: fontSrc("NotoSansSC-Regular.ttf"),
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: fontSrc("NotoSansSC-Regular.ttf"),
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: fontSrc("NotoSansSC-Bold.ttf"),
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
}
