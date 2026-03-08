import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const overlay = document.getElementById("overlay");
    const uiContainer = document.getElementById("ui-container");
    const shopButton = document.getElementById("shopButton");

    let mindarThree = null;

    const startAR = async () => {
        console.log("AR起動プロセス開始...");
        
        try {
            // MindARの初期化
            mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.getElementById("ar-container"),
                imageTargetSrc: 'img/targetsc1.mind',
            });

            const { renderer, scene, camera } = mindarThree;

            // Sparkモデルの読み込み
            // ※パスが正しいか確認してください (model/A.spz)
            const splatA = new SplatMesh({ url: "model/A.spz" });
            const splatB = new SplatMesh({ url: "model/B.spz" });
            
            splatA.visible = false;
            splatB.visible = false;

            // マーカーに対するアンカー設定
            const anchor0 = mindarThree.addAnchor(0);
            anchor0.group.add(splatA);

            const anchor1 = mindarThree.addAnchor(1);
            anchor1.group.add(splatB);

            // 検出時の挙動
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

            // ARシステムの開始
            await mindarThree.start();
            console.log("MindARスタート成功");

            // レンダリングループ
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });

            // UIの切り替え
            overlay.style.display = 'none';
            uiContainer.style.display = 'flex';

        } catch (err) {
            console.error("起動エラー:", err);
            alert("ARの起動に失敗しました。コンソールを確認してください。");
        }
    };

    startButton.addEventListener('click', startAR);

    document.getElementById("backButton").addEventListener('click', () => {
        location.reload();
    });
});