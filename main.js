import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

AFRAME.registerComponent('spark-model', {
    schema: { src: {type: 'string'} },
    init: function () {
        const splat = new SplatMesh({ url: this.data.src });
        this.el.setObject3D('mesh', splat);
    }
});

window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const startButton = document.getElementById("startButton");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");
    const overlay = document.getElementById("overlay");

    startButton.addEventListener('click', async () => {
        // ボタンを押したら即座にオーバーレイを消す
        overlay.style.display = 'none';
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
            console.log("AR System Starting...");
            await arSystem.start(); // ここでカメラが起動するまで待つ
            console.log("AR System Started!");
            
            // カメラが動き出してからUIを出す
            uiContainer.style.display = 'flex';
        }
    });

    // ターゲットイベント
    const t0 = document.getElementById("target-0");
    const t1 = document.getElementById("target-1");

    t0.addEventListener("targetFound", () => { shopButton.style.display = 'block'; });
    t0.addEventListener("targetLost", () => { shopButton.style.display = 'none'; });
    t1.addEventListener("targetFound", () => { shopButton.style.display = 'block'; });
    t1.addEventListener("targetLost", () => { shopButton.style.display = 'none'; });

    document.getElementById("backButton").addEventListener('click', () => location.reload());
});