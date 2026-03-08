import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    
    const startAR = async () => {
        console.log("1. 起動ボタンが押されました");
        
        try {
            // MindARのチェック
            if (typeof window.MINDAR === 'undefined') {
                throw new Error("MindARライブラリがロードされていません。インターネット接続を確認してください。");
            }

            const mindarThree = new window.MINDAR.IMAGE.MindARThree({
                container: document.getElementById("ar-container"),
                imageTargetSrc: 'img/targetsc1.mind',
            });

            const { renderer, scene, camera } = mindarThree;

            console.log("2. Sparkモデルを読み込みます...");
            // モデルの読み込み。URLが間違っているとここで止まります。
            const splatA = new SplatMesh({ url: "model/A.spz" });
            const splatB = new SplatMesh({ url: "model/B.spz" });
            
            splatA.visible = false;
            splatB.visible = false;

            const anchor0 = mindarThree.addAnchor(0);
            anchor0.group.add(splatA);

            const anchor1 = mindarThree.addAnchor(1);
            anchor1.group.add(splatB);

            anchor0.onTargetFound = () => { splatA.visible = true; document.getElementById("shopButton").style.display = 'block'; };
            anchor0.onTargetLost = () => { splatA.visible = false; document.getElementById("shopButton").style.display = 'none'; };

            anchor1.onTargetFound = () => { splatB.visible = true; document.getElementById("shopButton").style.display = 'block'; };
            anchor1.onTargetLost = () => { splatB.visible = false; document.getElementById("shopButton").style.display = 'none'; };

            console.log("3. カメラを起動します...");
            await mindarThree.start();
            
            console.log("4. 描画ループを開始します");
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });

            document.getElementById("overlay").style.display = 'none';
            document.getElementById("ui-container").style.display = 'flex';

        } catch (err) {
            console.error("重大なエラー:", err);
            alert("エラー内容: " + err.message);
        }
    };

    startButton.addEventListener('click', startAR);
});