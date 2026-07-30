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

    // Presentation beats — gestures aim toward the reading column on the left.
    if (uActType < 0.5) {
      // Opening: warm welcome, slight bow, face the audience.
      p.y -= act * 0.04 * head;
      p.z += act * 0.07 * chest;
      p.x -= act * 0.05 * rightArm;
    } else if (uActType < 1.5) {
      // Point at the line: reach left, lean in, head follows the hand.
      p.x -= act * 0.16 * rightArm;
      p.x -= act * 0.06 * chest;
      p.z += act * 0.13 * chest;
      p.x -= act * 0.03 * head;
    } else if (uActType < 2.5) {
      // Present: both hands open toward the column.
      p.x -= act * 0.13 * arms;
      p.z += act * 0.10 * chest;
      p.y += act * 0.02 * chest;
    } else if (uActType < 3.5) {
      // Reflect: pause, tilt the head, settle back.
      p.x += act * 0.05 * head * sign(side + 0.001);
      p.z -= act * 0.06 * chest;
      p.x -= act * 0.04 * rightArm;
    } else if (uActType < 4.5) {
      // Invite: step toward the audience, open reach.
      p.z += act * 0.15 * (chest + hips * 0.45);
      p.x -= act * 0.07 * arms;
      p.y -= act * 0.015 * legs;
    } else {
      // Emphasise: a single punctuating gesture on the beat.
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

/** Straight cross-dissolve between poses — no rim light, tint, or scanlines. */
export const actorFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;

  varying vec2 vUv;

  void main() {
    vec4 poseA = texture2D(uTexA, vUv);
    vec4 poseB = texture2D(uTexB, vUv);
    vec4 color = mix(poseA, poseB, uMix);

    if (color.a < 0.01) {
      discard;
    }

    gl_FragColor = color;
  }
`

export const planeVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Soft elliptical contact shadow so the figure sits on the page. */
export const shadowFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5)) * 2.0;
    float falloff = smoothstep(1.0, 0.0, d);
    gl_FragColor = vec4(0.0, 0.0, 0.0, falloff * falloff * uOpacity);
  }
`
