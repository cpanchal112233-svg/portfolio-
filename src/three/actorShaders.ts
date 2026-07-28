export const actorVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  uniform float uLean;
  uniform float uPulse;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 p = position;
    float h = uv.y; // 0 at the feet, 1 at the head

    // Idle life: weight shift, chest rise, and a slow depth sway.
    p.x += sin(uTime * 1.15 + h * 2.1) * 0.030 * h * uBreath;
    p.y += sin(uTime * 1.70) * 0.014 * h * uBreath;
    p.z += sin(uTime * 0.85 + h * 2.8) * 0.045 * h * uBreath;

    // Lean into whatever line is being narrated.
    p.x += uLean * h * h * 0.30;

    // Reaction jolt whenever the focused line changes.
    p.y += uPulse * 0.06 * h;
    p.z += uPulse * 0.10 * smoothstep(0.2, 1.0, h);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

export const actorFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uAccent;
  uniform vec2 uTexel;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uvA = vUv;
    vec2 uvB = vUv;

    // Hologram tear while one pose dissolves into the next.
    float transition = 1.0 - abs(uMix * 2.0 - 1.0);
    float tear = noise(vec2(vUv.y * 40.0, uTime * 6.0)) - 0.5;
    uvA.x += tear * 0.05 * transition;
    uvB.x += tear * 0.05 * transition;

    vec4 poseA = texture2D(uTexA, uvA);
    vec4 poseB = texture2D(uTexB, uvB);

    // Noise-driven dissolve so the swap reads as a rebuild, not a crossfade.
    float grain = noise(vUv * 7.0);
    float blend = smoothstep(grain - 0.35, grain + 0.35, uMix);
    vec4 color = mix(poseA, poseB, blend);

    if (color.a < 0.01) {
      discard;
    }

    // Silhouette edge detection for the rim light.
    float aL = texture2D(uTexA, uvA - vec2(uTexel.x * 2.0, 0.0)).a;
    float aR = texture2D(uTexA, uvA + vec2(uTexel.x * 2.0, 0.0)).a;
    float aD = texture2D(uTexA, uvA - vec2(0.0, uTexel.y * 2.0)).a;
    float aU = texture2D(uTexA, uvA + vec2(0.0, uTexel.y * 2.0)).a;
    float edge = clamp(color.a * 4.0 - (aL + aR + aD + aU), 0.0, 1.0);

    vec3 rgb = color.rgb;

    // Cool grade so the actor belongs to the scene lighting.
    rgb = mix(rgb, rgb * vec3(0.86, 0.97, 1.06), 0.55);

    // Rim glow, stronger on reaction.
    rgb += uAccent * edge * (0.55 + uPulse * 0.9);

    // Scanline sweep travelling up the body.
    float sweep = fract(uTime * 0.16);
    float band = smoothstep(0.06, 0.0, abs(vUv.y - sweep));
    rgb += uAccent * band * 0.30;

    // Fine hologram line structure.
    float lines = sin(vUv.y * 900.0) * 0.5 + 0.5;
    rgb += uAccent * lines * 0.028;

    // Energy at the dissolve boundary.
    float boundary = smoothstep(0.42, 0.5, blend) * smoothstep(0.58, 0.5, blend);
    rgb += uAccent * boundary * 2.2 * transition;

    // Ground fade so the feet melt into the platform glow.
    float groundFade = smoothstep(0.0, 0.10, vUv.y);

    gl_FragColor = vec4(rgb, color.a * groundFade);
  }
`

export const floorVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const floorFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uAccent;
  uniform float uProgress;

  varying vec2 vUv;

  void main() {
    // Grid that drifts toward the viewer as the page advances.
    vec2 grid = vUv * 26.0;
    grid.y += uTime * 0.35 + uProgress * 12.0;

    vec2 cell = abs(fract(grid) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.045, min(cell.x, cell.y));

    // Fade out toward the horizon and the edges.
    float depthFade = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
    float sideFade = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);

    float glow = line * depthFade * sideFade;

    gl_FragColor = vec4(uAccent * glow, glow * 0.55);
  }
`

export const glowFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uAccent;
  uniform float uPulse;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    float breathe = 0.75 + sin(uTime * 1.4) * 0.12 + uPulse * 0.6;
    gl_FragColor = vec4(uAccent, core * core * 0.55 * breathe);
  }
`
