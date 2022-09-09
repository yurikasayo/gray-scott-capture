#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 vUv2;

out vec4 outColor;

uniform sampler2D map;
uniform sampler2D image;
uniform vec2 resolution;

uniform vec2 D;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

void main() {
    vec2 pix = 1.0 / resolution;

    vec2 s0 = texture(map, vUv2).xy;
    vec2 s1 = texture(map, vUv2 + vec2(pix.x, 0.0)).xy;
    vec2 s2 = texture(map, vUv2 - vec2(pix.x, 0.0)).xy;
    vec2 s3 = texture(map, vUv2 + vec2(0.0, pix.y)).xy;
    vec2 s4 = texture(map, vUv2 - vec2(0.0, pix.y)).xy;
    
    vec2 lap = (s1 + s2 + s3 + s4 - 4.0 * s0) / 1.0 * 1.0;

    vec2 s;
    vec3 hsb = rgb2hsb(texture(image, vUv2).rgb);
    float f = mix(0.045, 0.055, fract(hsb.x * 10.0 + hsb.y));
    float k = mix(0.060, 0.070, 1.0-hsb.z);
    s.x = max(0.0, min(1.0, s0.x + D.x * lap.x - s0.x * s0.y * s0.y + f * (1.0 - s0.x)));
    s.y = max(0.0, min(1.0, s0.y + D.y * lap.y + s0.x * s0.y * s0.y - (f + k) * s0.y));

    outColor = vec4(s, 0.0, 1.0);
}