export const actorVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  uniform float uLean;
  uniform float uPulse;
  uniform float uActPhase;
  uniform float uActType;

  varying vec2 vUv;

  float region(float y, float lo, float hi) {
    return smoothstep(lo, lo + 0.08, y) * (1.0 - smoothstep(hi - 0.08, hi, y));
  }

  void main() {
    vUv = uv;

    vec3 p = position;
    float h = uv.y;
    float side = uv.x - 0.5;
    float act = uActPhase;
    float leftArm = smoothstep(0.05, 0.35, 0.5 - uv.x);
    float rightArm = smoothstep(0.05, 0.35, uv.x - 0.5);

    float head = region(h, 0.78, 1.0);
    float chest = region(h, 0.52, 0.82);
    float arms = region(h, 0.48, 0.88) * (leftArm + rightArm);
    float hips = region(h, 0.28, 0.52);
    float legs = region(h, 0.0, 0.35);

    // Presenter idle: subtle weight shift while speaking.
    p.x += sin(uTime * 0.95 + h * 2.2) * 0.022 * h * uBreath;
    p.y += sin(uTime * 1.55) * 0.014 * h * uBreath;
    p.z += sin(uTime * 0.85 + h * 2.4) * 0.032 * h * uBreath;

    // Presentation beats — gestures aim toward the slide deck on the left.
    if (uActType < 0.5) {
      // Opening: warm welcome, slight bow, face the audience.
      p.y -= act * 0.04 * head;
      p.z += act * 0.07 * chest;
      p.x -= act * 0.05 * rightArm;
    } else if (uActType < 1.5) {
      // Point at slide: reach left, lean in, head follows finger.
      p.x -= act * 0.16 * rightArm;
      p.x -= act * 0.06 * chest;
      p.z += act * 0.13 * chest;
      p.x -= act * 0.03 * head;
    } else if (uActType < 2.5) {
      // Present data: both hands open toward the deck.
      p.x -= act * 0.13 * arms;
      p.z += act * 0.10 * chest;
      p.y += act * 0.02 * chest;
    } else if (uActType < 3.5) {
      // Reflect: pause, tilt head, hand near chin.
      p.x += act * 0.05 * head * sign(side + 0.001);
      p.z -= act * 0.06 * chest;
      p.x -= act * 0.04 * rightArm;
    } else if (uActType < 4.5) {
      // Invite: step toward audience, open welcoming reach.
      p.z += act * 0.15 * (chest + hips * 0.45);
      p.x -= act * 0.07 * arms;
      p.y -= act * 0.015 * legs;
    } else {
      // Emphasize key stat: punch gesture left on the beat.
      float punch = sin(act * 3.14159);
      p.x -= punch * 0.14 * rightArm;
      p.z += punch * 0.10 * chest;
      p.y -= punch * 0.03 * head;
    }

    p.x += uLean * h * h * 0.24;
    p.y += uPulse * 0.05 * h;
    p.z += uPulse * 0.08 * smoothstep(0.2, 1.0, h);

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
  uniform float uActPhase;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
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

    float transition = 1.0 - abs(uMix * 2.0 - 1.0);
    float tear = noise(vec2(vUv.y * 32.0, uTime * 4.5)) - 0.5;
    uvA.x += tear * 0.035 * transition;
    uvB.x += tear * 0.035 * transition;

    vec4 poseA = texture2D(uTexA, uvA);
    vec4 poseB = texture2D(uTexB, uvB);

    float grain = noise(vUv * 7.0);
    float blend = smoothstep(grain - 0.30, grain + 0.30, uMix);
    vec4 color = mix(poseA, poseB, blend);

    if (color.a < 0.01) {
      discard;
    }

    float aL = texture2D(uTexA, uvA - vec2(uTexel.x * 2.0, 0.0)).a;
    float aR = texture2D(uTexA, uvA + vec2(uTexel.x * 2.0, 0.0)).a;
    float aD = texture2D(uTexA, uvA - vec2(0.0, uTexel.y * 2.0)).a;
    float aU = texture2D(uTexA, uvA + vec2(0.0, uTexel.y * 2.0)).a;
    float edge = clamp(color.a * 4.0 - (aL + aR + aD + aU), 0.0, 1.0);

    vec3 rgb = color.rgb;
    rgb = mix(rgb, rgb * vec3(1.03, 1.04, 1.06), 0.25);
    rgb += mix(uAccent, uAccent2, vUv.y) * edge * (0.22 + uPulse * 0.45 + uActPhase * 0.18);

    float sweep = fract(uTime * 0.1);
    float band = smoothstep(0.04, 0.0, abs(vUv.y - sweep));
    rgb += uAccent * band * 0.1;

    float boundary = smoothstep(0.42, 0.5, blend) * smoothstep(0.58, 0.5, blend);
    rgb += uAccent * boundary * 1.4 * transition;

    float groundFade = smoothstep(0.0, 0.07, vUv.y);
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
  uniform vec3 uAccent2;
  uniform float uProgress;

  varying vec2 vUv;

  void main() {
    vec2 grid = vUv * 20.0;
    grid.y += uTime * 0.35 + uProgress * 10.0;

    vec2 cell = abs(fract(grid) - 0.5);
    float line = 1.0 - smoothstep(0.0, 0.035, min(cell.x, cell.y));

    float depthFade = smoothstep(0.0, 0.38, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    float sideFade = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);

    float glow = line * depthFade * sideFade;
    vec3 col = mix(uAccent, uAccent2, vUv.y);

    gl_FragColor = vec4(col * glow, glow * 0.28);
  }
`

export const glowFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  uniform float uPulse;
  uniform float uActPhase;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float core = smoothstep(0.55, 0.0, d);
    float breathe = 0.65 + sin(uTime * 1.2) * 0.08 + uPulse * 0.4 + uActPhase * 0.28;
    vec3 col = mix(uAccent, uAccent2, d);
    gl_FragColor = vec4(col, core * core * 0.32 * breathe);
  }
`
