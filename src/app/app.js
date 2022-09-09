import GUI from 'lil-gui';
import * as Stats from 'stats-js';
import { Renderer } from './webgl/renderer';
import { Display } from './display';
import { Simulator } from './simulator';
import { Texture } from './webgl/texture';

export class MyApp {
    constructor(canvas, video, debug) {
        this.canvas = canvas;
        this.video = video;
        this.debug = debug;

        this.setVideo(this.video);

        this.renderer = new Renderer(canvas);
        
        this.videoTexture = null;
        this.display = null;
        this.simulator = null;

        if (this.debug) {
            this.setStats();
        }

        this.loop();
    }

    init() {
        const width = this.video.width;
        const height = this.video.height;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.textureSize = {
            width: width * 2,
            height: height * 2
        };

        this.videoTexture = new Texture(this.renderer, this.video);
        this.display = new Display(this.renderer, this.canvas.width, this.canvas.height);
        this.simulator = new Simulator(this.renderer, this.textureSize, this.videoTexture.texture);

        this.setGui();
    }

    setVideo(video) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        }).then(stream => {
            video.srcObject = stream
        }).catch(e => {
            console.log(e)
        })
    
        video.addEventListener('loadedmetadata', () => {
            video.play();
            if (video.width == 0) {
                video.width = video.srcObject.getVideoTracks()[0].getSettings().width;
                video.height = video.srcObject.getVideoTracks()[0].getSettings().height;
            }
            this.init();
        })
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));

        if (this.debug) {
            this.stats.end();
            this.stats.begin();
        }
        if (this.simulator) {
            this.videoTexture.update();
            this.simulator.simulate();
            this.display.setTexture(this.simulator.source.texture);
            this.display.setColorTexture(this.videoTexture.texture);
            this.display.render();
        }
    }

    setGui() {
        this.gui = new GUI();
        this.gui.add(this.simulator.param, "reset");
    }

    setStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        this.stats.dom.style.pointerEvents = 'none';
        this.stats.dom.style.userSelect = 'none';
        document.body.appendChild(this.stats.dom);
    }
}