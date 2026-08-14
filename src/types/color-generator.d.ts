declare module 'color-generator' {
  interface Color {
    hexString(): string
    rgbArray?(): number[]
    rgb?(): { r: number; g: number; b: number }
    toString?(): string
  }

  export default function genColor(saturation?: number, lightness?: number): Color
}
