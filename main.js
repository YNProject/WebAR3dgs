import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// A-Frame用のコンポーネントとしてSparkを登録
AFRAME.registerComponent('spark-model', {
    schema: { src: {type: 'string'} },
    init: function () {
        // Sparkエンジンを使用して.spzファイルを読み込み、Three.jsのメッシュを作成
        const splat = new SplatMesh({ url: this.data.src });
        
        // A-FrameのエンティティにThree.jsオブジェクトとして追加
        this.el.setObject3D('mesh', splat);
        console.log("Spark Engine: Model injected into A-Frame scene.");
    }
});

window.addEventListener("load", () => {
    const startButton = document.getElementById("startButton");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");
    const sceneEl = document.querySelector('a-scene');

    startButton.addEventListener('click', async () => {
        document.getElementById("overlay").style.setProperty('display', 'none', 'important');
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
            // カメラとARシステムの起動を待機（これで青画面をスキップ）
            await arSystem.start();
            uiContainer.style.setProperty('display', 'flex', 'important');
        }
    });

    // 検出・消失のロジック
    const setupEvents = (id, url) => {
        const target = document.getElementById(id);
        target.addEventListener("targetFound", () => {
            window.activeUrl = url;
            shopButton.style.display = 'block';
        });
        target.addEventListener("targetLost", () => {
            shopButton.style.display = 'none';
        });
    };

    setupEvents("target-0", "https://www.meiji.co.jp/products/icecream/4902705098626.html");
    setupEvents("target-1", "https://www.meiji.co.jp/sweets/icecream/essel/otona/");

    shopButton.addEventListener('click', () => { if(window.activeUrl) window.open(window.activeUrl, '_blank'); });
    document.getElementById("backButton").addEventListener('click', () => location.reload());
});