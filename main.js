import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

window.addEventListener("load", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");

    const startAR = async () => {
        try {
            // MindARの読み込みチェック
            if (!window.MINDAR || !window.MINDAR.IMAGE) {
                throw new Error("MindARライブラリがまだ準備できていません。");
            }

            // --- MindAR Three.js 初期化 ---
            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.getElementById("ar-container"),
                imageTargetSrc: 'img/targetsc1.mind', // マーカーファイルのパス
            });

            const { renderer, scene, camera } = mindarThree;

            // --- Spark モデル (SPZ) の読み込み ---
            const splatA = new SplatMesh({ url: "model/A.spz" });
            const splatB = new SplatMesh({ url: "model/B.spz" });
            
            // 初期状態は非表示
            splatA.visible = false;
            splatB.visible = false;

            // マーカー0（バナナチョコ）への紐付け
            const anchor0 = mindarThree.addAnchor(0);
            anchor0.group.add(splatA);

            // マーカー1（大人ラベル）への紐付け
            const anchor1 = mindarThree.addAnchor(1);
            anchor1.group.add(splatB);

            // --- 検出イベントの設定 ---
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

            // --- カメラ起動 ---
            await mindarThree.start();

            // レンダリングループ (Sparkの描画に必須)
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });

            // 表示切り替え
            overlay.style.display = 'none';
            uiContainer.style.display = 'flex';

        } catch (err) {
            console.error(err);
            alert("エラーが発生しました: " + err.message);
        }
    };

    startButton.addEventListener('click', startAR);
    document.getElementById("backButton").addEventListener('click', () => location.reload());
});