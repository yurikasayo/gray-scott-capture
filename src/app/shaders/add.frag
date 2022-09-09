#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 vUv2;

out vec4 outColor;

uniform sampler2D map;
uniform sampler2D image;
uniform vec2 resolution;

void main() {
    vec4 color = texture(image, vUv2);
    float gray = length(color.rgb);
    float intencity = step(0.06, fwidth(gray)) * 0.1 ;

    vec2 s = texture(map, vUv2).xy;
    s.x = max(0.0, s.x - intencity);
    s.y = min(1.0, s.y + intencity);

    outColor = vec4(s, 0.0, 1.0);
}