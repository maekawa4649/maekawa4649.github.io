// .reveal を付けた要素が画面内に入ったタイミングで .is-visible を付与し、
// style.css 側の transition でフェードインさせる。
const revealTargets = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // 一度表示したら監視をやめる(スクロールで往復しても再アニメーションしない)
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((target) => revealObserver.observe(target));
