import "./style.css";
import { MyApp } from "./app/app";

const canvas = document.querySelector('canvas.webgl');
const video = document.querySelector('video.videoInput');
const myApp = new MyApp(canvas, video, true);