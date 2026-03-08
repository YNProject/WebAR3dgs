window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const startButton = document.getElementById("startButton");
    const backButton = document.getElementById("backButton");
    const shopButton = document.getElementById("shopButton");
    const uiContainer = document.getElementById("ui-container");
    const overlay = document.getElementById("overlay");

    let currentActiveUrl = null;

    const config = [
        {
            target: document.getElementById("target-0"),
            display: document.getElementById("display-0"), // 3Dエンティティ
            particleContainer: document.getElementById("particle-container-0"),
            particleImg: "#particle-img-0",
            audio: document.getElementById("audio1"),
            url: "https://www.meiji.co.jp/products/icecream/4902705098626.html",
            color: "#FFE135",
            textColor: "#000",
            particleTimer: null
        },
        {
            target: document.getElementById("target-1"),
            display: document.getElementById("display-1"), // 3Dエンティティ
            particleContainer: document.getElementById("particle-container-1"),
            particleImg: "#particle-img-1",
            audio: document.getElementById("audio2"),
            url: "https://www.meiji.co.jp/sweets/icecream/essel/otona/",
            color: "#7B3F00",
            textColor: "#FFF",
            particleTimer: null
        }
    ];

    // パーティクル生成（均等放射状版）
    const createParticles = (item) => {
        const count = 15;        
        const distance = 1.0;    
        const duration = 2000;   

        for (let i = 0; i < count; i++) {
            const p = document.createElement('a-image');
            p.setAttribute('src', item.particleImg);
            p.setAttribute('width', '0.12');
            p.setAttribute('height', '0.12');
            p.setAttribute('material', 'transparent: true; alphaTest: 0.05; depthTest: false;');
            
            const angle = (i / count) * Math.PI * 2; 
            p.setAttribute('position', '0 0 0');

            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;

            p.setAttribute('animation__move', `property: position; to: ${destX} ${destY} 0; dur: ${duration}; easing: easeOutQuad`);
            p.setAttribute('animation__fade', `property: material.opacity; from: 1; to: 0; dur: ${duration}; easing: linear`);

            item.particleContainer.appendChild(p);

            setTimeout(() => {
                if(p.parentNode) p.parentNode.removeChild(p);
            }, duration);
        }
    };

    // AR演出開始（3Dモデル表示用）
    const startARDisplay = (item) => {
        item.audio.play();
        item.display.setAttribute("visible", true); // モデルを表示

        // エフェクトを1.5秒おきに繰り返す
        createParticles(item); 
        item.particleTimer = setInterval(() => {
            createParticles(item);
        }, 1500);
    };

    const stopARDisplay = (item) => {
        clearInterval(item.particleTimer);
        item.audio.pause();
        item.audio.currentTime = 0;
        item.display.setAttribute("visible", false); // モデルを非表示
        item.particleContainer.innerHTML = ''; 
    };

    // --- イベントリスナー ---

    startButton.addEventListener('click', () => {
        overlay.style.display = 'none';
        uiContainer.setAttribute('style', 'display: flex !important');
        shopButton.style.display = 'none';
        document.body.classList.add('ar-active');

        // iOS対策：音声を一度再生して即停止（ロック解除）
        config.forEach(item => {
            item.audio.play().then(() => {
                item.audio.pause();
                item.audio.currentTime = 0;
            }).catch(e => console.log(e));
        });

        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) arSystem.start();
    });

    shopButton.addEventListener('click', () => {
        if (currentActiveUrl) window.open(currentActiveUrl, '_blank');
    });

    backButton.addEventListener('click', () => {
        location.reload(); // 全リセット
    });

    config.forEach(item => {
        // 初期状態は非表示
        item.display.setAttribute("visible", false);

        item.target.addEventListener("targetFound", () => {
            document.body.classList.add('target-found');
            currentActiveUrl = item.url;
            shopButton.style.display = 'block';
            shopButton.style.backgroundColor = item.color;
            shopButton.style.color = item.textColor;
            shopButton.style.borderColor = item.color;

            startARDisplay(item);
        });

        item.target.addEventListener("targetLost", () => {
            document.body.classList.remove('target-found');
            currentActiveUrl = null;
            shopButton.style.display = 'none';
            stopARDisplay(item);
        });
    });
});