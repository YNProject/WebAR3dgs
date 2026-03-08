import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// ライブラリの準備を待つ関数
const waitForMindAR = () => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (window.MINDAR && window.MINDAR.IMAGE) {
                console.log("MindAR のロードを確認しました");
                resolve();
            } else if (attempts > 50) { // 最大5秒待機
                reject(new Error("MindARライブラリの読み込みがタイムアウトしました。"));
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");

    const startAR = async () => {
        try {
            // ライブラリの準備が整うまで待つ
            await waitForMindAR();

            // --- MindAR Three.js 初期化 ---
            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.getElementById("ar-container"),
                imageTargetSrc: 'img/targetsc1.mind',
            });

            const { renderer, scene, camera } = mindarThree;

            // --- Spark モデル (SPZ) の読み込み ---
            const splatA = new SplatMesh({ url: "model/A.spz" });
            const splatB = new SplatMesh({ url: "model/B.spz" });
            
            splatA.visible = false;
            splatB.visible = false;

            const anchor0 = mindarThree.addAnchor(0);
            anchor0.group.add(splatA);

            const anchor1 = mindarThree.addAnchor(1);
            anchor1.group.add(splatB);

            // --- 検出イベント ---
            anchor0.onTargetFound = () => {
                splatA.visible = true;
                shopButton.style.display = 'block';
                shopButton.onclick = () => window.open("https://www.meiji.co.jp/products/icecream/4902705098626.html", "_blank");
            };
            anchor0.onTargetLost = () => { splatA.visible = false; shopButton.style.display = 'none'; };

            anchor1.onTargetFound = () => {
                splatB.visible = true;
                shopButton.style.display = 'block';
                shopButton.onclick = () => window.open("https://www.meiji.co.jp/sweets/icecream/essel/otona/", "_blank");
            };
            anchor1.onTargetLost = () => { splatB.visible = false; shopButton.style.display = 'none'; };

            // --- AR起動 ---
            await mindarThree.start();

            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });

            overlay.style.display = 'none';
            uiContainer.style.display = 'flex';

        } catch (err) {
            console.error(err);
            alert("エラー: " + err.message);
        }
    };

    startButton.addEventListener('click', startAR);
});