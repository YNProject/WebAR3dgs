import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// Sparkモデルを表示するためのA-Frameコンポーネント
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
    const backButton = document.getElementById("backButton");
    const shopButton = document.getElementById("shopButton");
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");

    let currentUrl = "";

    // AR起動
    startButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        uiContainer.style.display = 'flex'; // ボタンを表示
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
            arSystem.start();
        }
    });

    // 検出イベント管理
    const setupTarget = (id, url) => {
        const target = document.getElementById(id);
        target.addEventListener("targetFound", () => {
            currentUrl = url;
            shopButton.style.display = 'block';
        });
        target.addEventListener("targetLost", () => {
            shopButton.style.display = 'none';
        });
    };

    setupTarget("target-0", "https://www.meiji.co.jp/products/icecream/4902705098626.html");
    setupTarget("target-1", "https://www.meiji.co.jp/sweets/icecream/essel/otona/");

    // ボタンクリック
    shopButton.addEventListener('click', () => { if (currentUrl) window.open(currentUrl, '_blank'); });
    backButton.addEventListener('click', () => { location.reload(); });
});