import { Framebuffer } from './webgl/framebuffer';
import { Plane } from './webgl/plane';
import { Shader } from './webgl/shader';

import vertexShader from './shaders/color.vert';
import simulateShader from './shaders/simulate.frag';
import addShader from './shaders/add.frag';

export class Simulator {
    constructor(renderer, size, texture) {
        this.renderer = renderer;
        this.texture = texture;

        this.size = size;
        this.source = new Framebuffer(this.renderer, this.size.width, this.size.height, true, [1.0, 0.0, 0.0, 0.0]);

        this.plane = new Plane(this.renderer, 2, 2);

        this.shader = new Shader(this.renderer, vertexShader, simulateShader);
        this.shader.createAttributes({position: 3, uv2: 2});
        this.shader.createUniforms({
            resolution: 'vec2',
            map: 'sampler2D',
            image: 'sampler2D',
            D: 'vec2',
        });

        this.addShader = new Shader(this.renderer, vertexShader, addShader);
        this.addShader.createAttributes({position: 3, uv2: 2});
        this.addShader.createUniforms({
            resolution: 'vec2',
            map: 'sampler2D',
            image: 'sampler2D',
        });

        const that = this;
        this.param = {
            D1: 0.2,
            D2: 0.08,
            reset() {
                that.reset();
            },
        }

        this.addSource();
    }

    resize(size) {
        this.size = size;
        this.source.resize(size.width, size.height);
    }

    reset() {
        this.source.clearColor([1.0, 0.0, 0.0]);
        this.addSource();
    }

    addSource() {
        const uniforms = {
            map: this.source.texture,
            image: this.texture,
        };
        this.renderer.set(this.plane, this.addShader, uniforms);
        this.source.render();
    }

    simulate() {
        this.addSource();
        for (let i = 0; i < 30; i++) {
            const uniforms = {
                map: this.source.texture,
                image: this.texture,
                D: [this.param.D1, this.param.D2],
                f: this.param.f,
                k: this.param.k,
            };
            this.renderer.set(this.plane, this.shader, uniforms);
            this.source.render();
        }
    }
}