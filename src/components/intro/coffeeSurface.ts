/**
 * ============================================================================
 *  Suprafața de cafea — randare WebGL
 * ============================================================================
 *
 *  Un singur shader face trei lucruri, în ordinea în care se văd:
 *
 *   1. deplasează suprafața lichidului în cercuri concentrice, pornind din
 *      punctul de impact al bobului (`ripple`);
 *   2. adaugă reflexii pe crestele undelor, ca lumina să pară că se mișcă
 *      odată cu apa;
 *   3. desface imaginea în două panouri care alunecă în lateral, ca o cortină
 *      (`split`), cu marginea ondulată de ACEEAȘI undă — de asta tranziția
 *      pare o consecință a impactului, nu o animație separată.
 *
 *  Undele sunt limitate la discul de lichid, ca marginea de ceramică a ceștii
 *  să rămână perfect rigidă. O ceașcă din care se unduiește și porțelanul
 *  arată imediat fals.
 * ============================================================================
 */

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uCanvasAspect;
uniform float uTexAspect;
uniform vec2  uCenter;      // centrul ceștii, în coordonate de textură
uniform float uLiquidRadius;// raza discului de lichid
uniform float uRipple;      // secunde de la impact (<0 = încă nu a lovit)
uniform float uSplit;       // 0..0.5 — cât de mult s-au depărtat panourile
uniform float uFade;        // 0..1 — stingerea finală

const float WAVE_SPEED = 0.55;
const float WAVE_FREQ  = 118.0;
const float WAVE_OMEGA = 26.0;
const float WAVE_WIDTH = 0.085;
const float DECAY      = 1.55;
const float AMPLITUDE  = 0.028;

void main() {
  // --- încadrare de tip "cover" -------------------------------------------
  vec2 fit = vec2(1.0);
  if (uCanvasAspect > uTexAspect) {
    fit.y = uTexAspect / uCanvasAspect;
  } else {
    fit.x = uCanvasAspect / uTexAspect;
  }
  vec2 uv = (vUv - 0.5) * fit + 0.5;

  // --- cortina -------------------------------------------------------------
  // Marginea nu este dreaptă: o unduiește aceeași undă care a plecat din
  // punctul de impact, ca panourile să pară tăiate de lichid, nu de o riglă.
  float edgeWave = sin(vUv.y * 11.0 - uRipple * 3.2) * 0.018 * smoothstep(0.0, 0.12, uSplit);
  float split = uSplit + edgeWave;

  float alpha = 1.0;
  if (vUv.x > 0.5) {
    uv.x -= split;
    alpha = step(0.5 + split, vUv.x + edgeWave * 0.0);
    if (uv.x < 0.5 - 0.0001) alpha = 0.0;
  } else {
    uv.x += split;
    if (uv.x > 0.5 + 0.0001) alpha = 0.0;
  }

  // --- unde concentrice ----------------------------------------------------
  // Spațiu corectat pe aspect, ca cercurile să fie cercuri și pe ecran lat.
  vec2 p = vec2(uv.x * uTexAspect, uv.y);
  vec2 c = vec2(uCenter.x * uTexAspect, uCenter.y);
  vec2 delta = p - c;
  float dist = length(delta);

  // Doar în interiorul lichidului; ceramica rămâne nemișcată.
  float liquid = 1.0 - smoothstep(uLiquidRadius * 0.78, uLiquidRadius, dist);

  float wave = 0.0;
  float crest = 0.0;

  if (uRipple > 0.0) {
    float front = uRipple * WAVE_SPEED;      // frontul undei se depărtează
    float band = dist - front;
    float envelope =
      exp(-(band * band) / (WAVE_WIDTH * WAVE_WIDTH)) *
      exp(-uRipple * DECAY);

    float phase = dist * WAVE_FREQ - uRipple * WAVE_OMEGA;
    wave  = sin(phase) * envelope * liquid;
    crest = cos(phase) * envelope * liquid;

    // Coroana de la impact: un puls scurt și puternic chiar în centru.
    float crown = exp(-uRipple * 9.0) * exp(-(dist * dist) / 0.0035);
    wave += crown * 2.2 * liquid;
    crest += crown * 3.0 * liquid;
  }

  vec2 dir = dist > 0.0001 ? delta / dist : vec2(0.0);
  vec2 offset = dir * wave * AMPLITUDE;
  offset.x /= uTexAspect; // înapoi în spațiul de textură

  vec4 color = texture2D(uTexture, clamp(uv + offset, 0.001, 0.999));

  // Lumina prinsă pe crestele undelor — reflexie caldă, de cupru.
  color.rgb += vec3(0.85, 0.55, 0.30) * crest * 0.20;

  // Halou cald pe muchiile cortinei, ca marginile să nu pară tăiate cu foarfeca.
  float edgeGlow = smoothstep(0.045, 0.0, abs(vUv.x - (0.5 + sign(vUv.x - 0.5) * split)));
  color.rgb += vec3(0.72, 0.42, 0.20) * edgeGlow * smoothstep(0.01, 0.2, uSplit) * 0.55;

  gl_FragColor = vec4(color.rgb, alpha * uFade);
}
`;

export type SurfaceUniforms = {
  /** Secunde de la impactul bobului. Negativ = bobul încă nu a atins lichidul. */
  ripple: number;
  /** 0 → cortină închisă, 0.5 → complet deschisă. */
  split: number;
  /** 1 → opac, 0 → invizibil. */
  fade: number;
};

/** Centrul ceștii în cadrul sursă, măsurat manual. Vezi ASSETS.md. */
export const CUP_CENTER = { x: 0.502, y: 0.475 };
/** Raza discului de lichid, în spațiu corectat pe aspect. */
export const LIQUID_RADIUS = 0.219;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export class CoffeeSurface {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private texture: WebGLTexture;
  private buffer: WebGLBuffer;
  private locations: Record<string, WebGLUniformLocation | null>;
  private texAspect: number;
  private disposed = false;

  private constructor(
    private canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    texture: WebGLTexture,
    buffer: WebGLBuffer,
    image: HTMLImageElement,
  ) {
    this.gl = gl;
    this.program = program;
    this.texture = texture;
    this.buffer = buffer;
    this.texAspect = image.naturalWidth / image.naturalHeight;

    this.locations = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uCanvasAspect: gl.getUniformLocation(program, "uCanvasAspect"),
      uTexAspect: gl.getUniformLocation(program, "uTexAspect"),
      uCenter: gl.getUniformLocation(program, "uCenter"),
      uLiquidRadius: gl.getUniformLocation(program, "uLiquidRadius"),
      uRipple: gl.getUniformLocation(program, "uRipple"),
      uSplit: gl.getUniformLocation(program, "uSplit"),
      uFade: gl.getUniformLocation(program, "uFade"),
    };
  }

  /**
   * Creează randorul. Returnează `null` dacă WebGL nu este disponibil —
   * apelantul trebuie să afișeze varianta statică.
   */
  static create(canvas: HTMLCanvasElement, image: HTMLImageElement): CoffeeSurface | null {
    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ?? null;

    if (!gl) return null;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return null;

    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }

    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!buffer || !texture) return null;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), // un singur triunghi acoperă ecranul
      gl.STATIC_DRAW,
    );

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return new CoffeeSurface(canvas, gl, program, texture, buffer, image);
  }

  /** Adaptează bufferul la dimensiunea reală a ferestrei. */
  resize() {
    if (this.disposed) return;
    // Plafonăm la 2 pentru a nu randa 3× mai mulți pixeli pe telefoane moderne.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(this.canvas.clientWidth * dpr);
    const height = Math.round(this.canvas.clientHeight * dpr);
    if (width === 0 || height === 0) return;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, width, height);
  }

  render({ ripple, split, fade }: SurfaceUniforms) {
    if (this.disposed) return;
    const gl = this.gl;

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const position = gl.getAttribLocation(this.program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.uniform1i(this.locations.uTexture, 0);
    gl.uniform1f(this.locations.uCanvasAspect, this.canvas.width / this.canvas.height);
    gl.uniform1f(this.locations.uTexAspect, this.texAspect);
    gl.uniform2f(this.locations.uCenter, CUP_CENTER.x, 1 - CUP_CENTER.y);
    gl.uniform1f(this.locations.uLiquidRadius, LIQUID_RADIUS);
    gl.uniform1f(this.locations.uRipple, ripple);
    gl.uniform1f(this.locations.uSplit, split);
    gl.uniform1f(this.locations.uFade, fade);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /**
   * Poziția pe ecran (în px CSS) a centrului ceștii și scara la care este
   * randată textura. Folosite ca bobul care cade să aterizeze exact pe
   * suprafața lichidului, la orice dimensiune de fereastră.
   */
  projectCenter(): { x: number; y: number; textureWidth: number } {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const canvasAspect = w / h;

    // "cover": textura este scalată până acoperă ambele axe.
    const textureWidth = canvasAspect > this.texAspect ? w : h * this.texAspect;
    const textureHeight = textureWidth / this.texAspect;

    return {
      x: (w - textureWidth) / 2 + CUP_CENTER.x * textureWidth,
      y: (h - textureHeight) / 2 + CUP_CENTER.y * textureHeight,
      textureWidth,
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const gl = this.gl;
    gl.deleteTexture(this.texture);
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.program);
    // Eliberează contextul imediat, ca browserul să nu țină un GPU context
    // în plus după ce introducerea s-a terminat.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
