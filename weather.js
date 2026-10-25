const API_KEY = "10aaaec430f48bca6e141cb95b37a5b5";
const city = "Tokyo";

const body = document.body;
const message = document.getElementById("weather-message");
const info = document.getElementById("weather-info");

// 天候情報取得
async function getWeather() {
  try {
    console.log("天候情報を取得中...");
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("天候データ:", data);
    
    const weather = data.weather[0].main;
    const temp = Math.round(data.main.temp);
    const hour = new Date().getHours();

    info.textContent = `現在の天気：${data.weather[0].description} / 気温：${temp}℃`;

    // 昼夜判定
    if (hour >= 18 || hour < 6) {
      body.className = "theme-night";
      message.textContent = "夜でも学びは止まらない。INIADで未来を考える。";
      console.log("テーマ: 夜");
      return;
    }

    // 天候別UI
    if (weather === "Clear") {
      body.className = "theme-sunny";
      message.textContent = "晴れた日は、新しいアイデアが生まれる。";
      console.log("テーマ: 晴れ");
    } else if (weather === "Rain") {
      body.className = "theme-rainy";
      message.textContent = "雨の日こそ、じっくり考える学びの時間。";
      console.log("テーマ: 雨");
    } else {
      body.className = "theme-default";
      message.textContent = "今日の環境とともに、学びを体験する。";
      console.log("テーマ: デフォルト");
    }
  } catch (error) {
    console.error("天候情報の取得に失敗:", error);
    info.textContent = "天候情報を取得できませんでした";
    body.className = "theme-default";
  }
}

// ページ読み込み後に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', getWeather);
} else {
  getWeather();
}

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// スクロールアニメーション（オプション）
// ===== アップグレード版スクロール演出 =====

// 1. パララックス効果（スクロールで文字を少し遅く動かす＝奥行きが出る）
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-inner');
  // スクロール量の40%のスピードで文字を動かす
  if(heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
    heroContent.style.opacity = 1 - (scrolled / 700); // 下にいくと薄くなる
  }
});

// 2. 順番に表示させるアニメーション（Intersection Observer）
const observerOptions = {
  threshold: 0.15, // 要素が15%見えたら発火
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 順番に表示させるための遅延計算
      const target = entry.target;
      // グリッド内の何番目かを取得（親要素の子要素リストからインデックスを探す）
      const index = Array.from(target.parentNode.children).indexOf(target);
      
      // インデックスに応じて遅延時間を増やす (0.1秒ずつずらす)
      const delay = index * 100; 

      setTimeout(() => {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0) scale(1)'; // 少し拡大しながら戻る
      }, delay);
      
      observer.unobserve(target); // 一度表示したら監視を終了
    }
  });
}, observerOptions);

// 対象要素の設定
document.querySelectorAll('.day-card, .life-item, .voice-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px) scale(0.95)'; // 初期位置：少し下＆少し縮小
  el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 1, 0.3, 1), transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
  observer.observe(el);
});

// アニメーション対象要素
document.querySelectorAll('.day-card, .life-item, .voice-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});