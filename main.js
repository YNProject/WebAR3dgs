import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");

    // --- 1. MindAR のセットアップ ---
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.getElementById("ar-container"),
        imageTargetSrc: 'img/targetsc1.mind', // あなたの .mind ファイル
    });

    const { renderer, scene, camera } = mindarThree;

    // --- 2. Spark モデル (SplatMesh) の作成 ---
    // モデルA (バナナチョコ)
    const butterflyA = new SplatMesh({ url: "model/A.spz" });
    butterflyA.visible = false;
    
    // モデルB (大人ラベル)
    const butterflyB = new SplatMesh({ url: "model/B.spz" });
    butterflyB.visible = false;

    // MindARのアンカー（ターゲット）にモデルを紐付け
    const anchorA = mindarThree.addAnchor(0);
    anchorA.group.add(butterflyA);

    const anchorB = mindarThree.addAnchor(1);
    anchorB.group.add(butterflyB);

    // --- 3. 検出イベント ---
    anchorA.onTargetFound = () => {
        butterflyA.visible = true;
        shopButton.style.display = 'block';
        shopButton.onclick = () => window.open("https://www.meiji.co.jp/...", "_blank");
    };
    anchorA.onTargetLost = () => { butterflyA.visible = false; shopButton.style.display = 'none'; };

    anchorB.onTargetFound = () => {
        butterflyB.visible = true;
        shopButton.style.display = 'block';
    };
    anchorB.onTargetLost = () => { butterflyB.visible = false; shopButton.style.display = 'none'; };

    // --- 4. 開始処理 ---
    startButton.addEventListener('click', async () => {
        overlay.style.display = 'none';
        uiContainer.style.display = 'flex';
        
        await mindarThree.start();
        
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    });

    document.getElementById("backButton").addEventListener('click', () => location.reload());
});