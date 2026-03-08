import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

AFRAME.registerComponent('spark-model', {
    schema: { src: { type: 'string' } },
    init: function () {
        const splat = new SplatMesh({ url: this.data.src });
        this.el.setObject3D('mesh', splat);
    }
});

window.addEventListener("load", () => {
    const startButton = document.getElementById("startButton");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");
    const sceneEl = document.querySelector('a-scene');

    startButton.addEventListener('click', async () => {
        document.getElementById("overlay").style.display = 'none';
        uiContainer.style.display = 'flex';
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) await arSystem.start();
    });

    const targets = [
        { id: "target-0", url: "https://www.meiji.co.jp/products/icecream/4902705098626.html" },
        { id: "target-1", url: "https://www.meiji.co.jp/sweets/icecream/essel/otona/" }
    ];

    targets.forEach(t => {
        const el = document.getElementById(t.id);
        el.addEventListener("targetFound", () => {
            window.activeUrl = t.url;
            shopButton.style.display = 'block';
        });
        el.addEventListener("targetLost", () => {
            shopButton.style.display = 'none';
        });
    });

    document.getElementById("backButton").addEventListener('click', () => location.reload());
    shopButton.addEventListener('click', () => { if(window.activeUrl) window.open(window.activeUrl); });
});