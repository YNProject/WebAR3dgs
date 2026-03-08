import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// A-Frame用のSparkコンポーネント登録
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

    // 起動処理
    startButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        uiContainer.setAttribute('style', 'display: flex !important');
        
        // A-Frameのシーンがロードされるのを待ってから開始
        if (sceneEl.hasLoaded) {
            startSystem();
        } else {
            sceneEl.addEventListener('loaded', startSystem);
        }
    });

    const startSystem = () => {
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
            arSystem.start(); // ここでカメラが起動します
        }
    };

    // ターゲットイベント
    document.getElementById("target-0").addEventListener("targetFound", () => {
        currentUrl = "https://www.meiji.co.jp/products/icecream/4902705098626.html";
        shopButton.style.display = 'block';
        document.body.classList.add('target-found');
    });
    
    document.getElementById("target-1").addEventListener("targetFound", () => {
        currentUrl = "https://www.meiji.co.jp/sweets/icecream/essel/otona/";
        shopButton.style.display = 'block';
        document.body.classList.add('target-found');
    });

    // 消失イベント
    ["target-0", "target-1"].forEach(id => {
        document.getElementById(id).addEventListener("targetLost", () => {
            shopButton.style.display = 'none';
            document.body.classList.remove('target-found');
        });
    });

    shopButton.addEventListener('click', () => { if (currentUrl) window.open(currentUrl, '_blank'); });
    backButton.addEventListener('click', () => { location.reload(); });
});