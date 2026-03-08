import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// A-Frameコンポーネントの定義
AFRAME.registerComponent('spark-model', {
    schema: { src: { type: 'string' } },
    init: function () {
        const el = this.el;
        const src = this.data.src;

        // Spark 2.0 の作法でメッシュを作成
        const splat = new SplatMesh({ url: src });
        
        // A-FrameのObject3D(Three.jsのGroup)に直接追加
        el.setObject3D('mesh', splat);
        
        // 初期状態の調整（必要に応じて）
        splat.position.set(0, 0, 0);
        splat.quaternion.set(1, 0, 0, 0);
        
        this.splat = splat;
        console.log("Spark 2.0: SplatMesh loaded into A-Frame entity.");
    },
    tick: function (time, timeDelta) {
        // 必要ならここでアニメーション（butterflyの例のように回転させるなど）
        // if (this.splat) this.splat.rotation.y += 0.01;
    }
});

window.addEventListener("load", () => {
    const startButton = document.getElementById("startButton");
    const sceneEl = document.querySelector('a-scene');
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");

    startButton.addEventListener('click', async () => {
        // ボタン押下で即座にUIを切り替え
        overlay.style.setProperty('display', 'none', 'important');
        
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
            // カメラ起動。await することで青い画面でのスタックを防ぎます
            await arSystem.start();
            uiContainer.style.setProperty('display', 'flex', 'important');
        }
    });

    // 検出時のリンク制御
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