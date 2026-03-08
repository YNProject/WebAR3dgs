import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// A-FrameにSparkモデルを表示する機能を登録
AFRAME.registerComponent('spark-model', {
    schema: {
        src: {type: 'string'}
    },
    init: function () {
        const el = this.el;
        const src = this.data.src;

        // SplatMeshの作成
        const splat = new SplatMesh({ url: src });
        
        // A-Frameのエンティティ（Object3D）にSparkモデルを追加
        el.setObject3D('mesh', splat);
        
        this.splat = splat;
        console.log("Spark Model Loaded:", src);
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

    // AR開始ボタン
    startButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        uiContainer.style.display = 'flex';
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) arSystem.start();
    });

    // ターゲット検出イベント
    const target0 = document.getElementById("target-0");
    const target1 = document.getElementById("target-1");

    target0.addEventListener("targetFound", () => {
        currentUrl = "https://www.meiji.co.jp/products/icecream/4902705098626.html";
        shopButton.style.display = 'block';
    });
    target0.addEventListener("targetLost", () => { shopButton.style.display = 'none'; });

    target1.addEventListener("targetFound", () => {
        currentUrl = "https://www.meiji.co.jp/sweets/icecream/essel/otona/";
        shopButton.style.display = 'block';
    });
    target1.addEventListener("targetLost", () => { shopButton.style.display = 'none'; });

    shopButton.addEventListener('click', () => {
        if (currentUrl) window.open(currentUrl, '_blank');
    });

    backButton.addEventListener('click', () => {
        location.reload();
    });
});