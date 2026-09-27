# 第18講 — 最前線:どの仮定が壊されているか

[← 前の講](17-fixed-budget.md) ｜ [README](README.md) ｜ [次の講 →](19-open-problems.md)

---

## この講の目標

**最近 5〜10 年の BAI 研究を、「第13〜15講で置いた仮定のどれを外しているか」で整理する。**

---

## 18.0 仮定の一覧 — この講の地図

第13〜15講で構築した理論は、次の仮定の上に立っていました。

| # | 仮定 | どこで使ったか |
|---|---|---|
| **A** | $\delta\to0$ の漸近を見る | 定理 15.10 の主張そのもの |
| **B** | 腕は有限個・互いに独立(非構造) | 命題 14.3($\mathrm{Alt}$ の分解) |
| **C** | $w^*(\hat\nu(t))$ を毎ステップ厳密に解ける | 定義 15.1(tracking) |
| **D** | 最適腕が一意 | 定義 4.10 の注意、定理 15.10 |
| **E** | 1 ラウンドに 1 本、コスト一様 | $\tau$ を「ラウンド数」と定義したこと |
| **F** | 報酬は 1 次元、目的は平均の最大化 | $a^*(\nu)=\arg\max\mu_a$ |
| **G** | 分布族が既知の指数型 | 命題 11.9、命題 14.3 |

**この 7 つが、そのまま研究の 7 方向になっています。**以下、順に見ます。

---

## 18.1 【仮定 A を外す】非漸近・moderate confidence

### 問題

第15講 §15.5 の実測:$\delta=10^{-6}$ でも $\mathbb{E}[\tau]/\log(1/\delta)$ は $T^*$ の $1.17$ 倍、$\delta=0.1$ では $1.75$ 倍。**実務で使う $\delta=0.05\sim0.1$ の領域では、Track-and-Stop は最適ですらありません。**

**そして、この $1.17$ 倍という数字は「軽い閾値」で走らせた結果です。**第15講 §15.5.1 の分解を、どの閾値の話かを明示して整理し直します($K=4$、`bai_demo.py` の 4 腕ベルヌーイ、$T^*=102.28$)。

**(i) $\delta$-正当性の証明がない軽い閾値 $\beta(t,\delta)=\log\frac{1+\log t}{\delta}$(実測に使ったもの)**

$$\frac{\mathbb{E}[\tau]}{T^*\log(1/\delta)}\ \approx\ \frac{\beta(\tau,\delta)}{\log(1/\delta)}\ =\ \underbrace{1}_{\text{下界}}+\underbrace{\frac{\log(1+\log\tau)}{\log(1/\delta)}}_{\text{超過}}$$

| $\delta$ | 実測比 | 予測比 | 超過分 |
|---:|---:|---:|---:|
| $10^{-1}$ | 1.75 | 1.85 | 0.85 |
| $10^{-3}$ | 1.35 | 1.30 | 0.30 |
| $10^{-6}$ | 1.17 | 1.15 | 0.15 |

**(ii) 理論保証のある閾値 $\beta_t(\delta)=K\log(t^2+t)+f^{-1}(\delta)$(定理 15.6 / L&S Lemma 33.7)**

不動点 $\tau=T^*\beta_\tau(\delta)$ を解くと【検証:数値】:

閾値が $K\log(\tau^2+\tau)+f^{-1}(\delta)$ という**和**なので、比も 2 項の**和**に分解できます($\log(1/\delta)$ で割るだけ):

| $\delta$ | $\tau$ | 比 $\dfrac{\tau}{T^*\log\frac1\delta}$ | $=\dfrac{K\log(\tau^2+\tau)}{\log(1/\delta)}$ | $+\ \dfrac{f^{-1}(\delta)}{\log(1/\delta)}$ |
|---:|---:|---:|---:|---:|
| $10^{-1}$ | 8412 | **35.7** | 31.4 | 4.3 |
| $10^{-3}$ | 9163 | **13.0** | 10.6 | 2.4 |
| $10^{-6}$ | 10121 | **7.2** | 5.3 | 1.8 |

(端数は四捨五入。$\delta=10^{-6}$ なら $5.34+1.82=7.16$。)

> **【訂正】** この講の以前の版では、隙間の主因を $f^{-1}(\delta)/\log(1/\delta)=1.82$ と書いていました。**これは二重に誤りです。**
> 1. **実測($1.17$)は $f^{-1}$ を使わない別の閾値で取ったもの**なので、$1.82$ では説明になりません(そもそも「原因」が「結果」より大きい)。
> 2. **$f^{-1}$ の閾値を実際に使った場合ですら、$f^{-1}$ 項は主因ではありません。**$\delta=10^{-6}$ での $7.2$ 倍のうち $f^{-1}$ 由来は $1.8$ で、残りの $5.3$ は **$\delta$ に依存しない $K\log(t^2+t)\approx2K\log\tau$ 項**です。$\delta\to0$ でこの項の寄与 $2K\log\tau/\log(1/\delta)$ は $0$ に落ちますが、その速さは $1/\log(1/\delta)$ でしかありません。

**したがって隙間の主因は、$\delta$ が小さい領域では「$K$ 腕を union bound で束ねる代償」($K\log(t^2+t)$)であり、$\delta$ が大きい領域ではそれに加えて $f^{-1}(\delta)/\log(1/\delta)$ の遅い収束です。**tracking の収束や $\hat\nu(t)$ の推定誤差は、この 2 つに比べれば副次的です(実測比と予測比が数 % で合っていることがその証拠)。

| 要因 | $\delta=10^{-6}$、$K=4$ での寄与(比への**加算**) | $\delta\to0$ での振る舞い |
|---|---:|---|
| $\beta$ の $K\log(t^2+t)$ 項 | $+5.3$ | **項そのものは $\delta$ に依存しない**($K$ 腕を union bound で束ねる代償)。比への寄与は $\approx2K\log\tau/\log(1/\delta)\to0$ だが、**速さは $1/\log(1/\delta)$ しかない** |
| 閾値 $f^{-1}(\delta)/\log(1/\delta)$ | $+1.8$ | $\to1$。ただし極めて遅い(§8.4 の表:$\delta=10^{-50}$ でようやく $1.157$) |
| tracking の収束の遅れ | 実測と予測の差(数 %)に含まれる | 有限時間の効果 |
| $\hat\nu(t)$ の推定誤差 | 同上 | 有限時間の効果 |

> **$\delta\to0$ で比が $1$ に行くこと自体は正しい**(定理 15.10)。問題は**その速さがどちらの項も $1/\log(1/\delta)$ でしかない**ことです。超過分($\text{比}-1$)を半分にするには $\log(1/\delta)$ を倍にする、つまり **$\delta$ の桁数を倍にする**必要があります($\delta=10^{-6}$ の $6.2$ を半分にするには $\delta=10^{-12}$ が要る)。**これが「漸近最適だが実用性能が悪い」の正体です。**

### 研究の方向

1. **閾値を鋭くする** — Kaufmann & Koolen, *Mixture Martingales Revisited*, JMLR 22, 2021(arXiv:1811.11419)。混合マルチンゲールを BAI 用に最適化。【要出典確認】
2. **非漸近な解析枠組み** — Barrier, Garivier, Kocák, *A Non-Asymptotic Approach to Best-Arm Identification for Gaussian Bandits*, AISTATS 2022。【要出典確認】
3. **有限 $\delta$ での instance-optimality の定義** — **まだ定まっていません。**「$\delta\to0$ で $T^*$」に代わる有限 $\delta$ の最適性規準が何であるべきか、合意がない。

> **ここは第19講の種として最有力です。** 応用側(自動実験室、創薬)が欲しがっているのは正確にこの領域($n$ が数十〜数百、$\delta=0.05$)。理論側の空白と応用側の需要が一致しています。

---

## 18.2 【仮定 B・C を外す】構造付き設定と計算量ギャップ

### 18.2.1 線形バンディット / transductive / combinatorial

腕 $a$ が特徴ベクトル $x_a\in\mathbb{R}^d$ を持ち、$\mu_a=\langle\theta,x_a\rangle$ とする(線形バンディット)。このとき
$$\mathrm{Alt}(\nu)=\{\theta' : \langle\theta',x_{a^*}\rangle<\max_b\langle\theta',x_b\rangle\}$$
となり、**$\mathrm{Alt}$ が $\theta$ の空間の(凸多面体の補集合の)和集合**になります。命題 14.3 の「2 腕だけ動かせばよい」という分解は使えません。

代わりに、線形の場合は次の形になります(**ガウス、既知分散**):
$$T^*(\nu)^{-1}=\sup_{w\in\Sigma_K}\ \min_{b\ne a^*}\ \frac{\langle\theta,x_{a^*}-x_b\rangle^2}{2\|x_{a^*}-x_b\|^2_{V(w)^{-1}}},\qquad V(w)=\sum_a w_a x_ax_a^\top.$$

> これは実験計画法の **$XY$-最適計画** の形です(G-最適計画・E-最適計画の親戚)。導出は「$\inf_{\theta'}$ を Mahalanobis 距離で解く」だけなので、演習にできます(演習 18-1)。
> **【検証:数値】** `check_linear_bandit_closed_form`:ランダムな $d\in[2,5]$、正定値 $V$、$\theta,x$ の $500$ 組で、閉形式と Lagrange 解が一致(最大相対誤差 $7.0\times10^{-16}$)。さらに制約領域内のランダム点で下回らないことも確認。

**問題**: 腕が $K=\binom{d}{m}$ 個(組合せ的)あると、$\min_{b}$ が指数個の項の最小値になり、**$\sup_w$ が計算できない**。

> **これが「下界は書けるがアルゴリズムがない」ギャップ**です。線形・組合せ・transductive のすべてで生じます。

### 18.2.2 主要文献【要出典確認】

- Soare, Lazaric, Munos, *Best-Arm Identification in Linear Bandits*, NeurIPS 2014 — 最初の定式化
- Fiez, Jain, Jamieson, Ratliff, *Sequential Experimental Design for Transductive Linear Bandits*, NeurIPS 2019
- Degenne, Ménard, Shang, Valko, *Gamification of Pure Exploration for Linear Bandits*, ICML 2020(arXiv:2007.00953)
- Jedra & Proutiere, *Optimal Best-arm Identification in Linear Bandits*, NeurIPS 2020
- Parupudi & Ghatak, *An Algorithm for Fixed Budget Best Arm Identification with Combinatorial Exploration*, arXiv:2502.01429(v1: 2025年2月、v2: 2026年1月)【検証:原文(arXiv 要旨)】 — 複数の腕を同時にサンプルできる設定。$\log_2K$ 個のグループを作り尤度比検定 + Hamming 復号で最良腕を特定する

---

## 18.3 【仮定 C を外す】ゲームを解くアルゴリズム

### アイデア

第14講 定理 14.2 で見たとおり、
$$T^*(\nu)^{-1}=\sup_{w\in\Sigma_K}\min_{q\in\Sigma_{K-1}}\Phi(w,q)$$
は鞍点問題です。**Track-and-Stop はこれを毎ステップ厳密に解きますが、その必要はありません。**

**Degenne, Koolen, Ménard, *Non-Asymptotic Pure Exploration by Solving Games*, NeurIPS 2019** のアイデア:

- $w$ 側と $q$ 側にそれぞれ **online learning アルゴリズム**(例:AdaHedge、指数化勾配法)を走らせる。
- 各ラウンドで 1 回だけ更新する。
- **online learning の後悔保証**により、$T$ ラウンド後の平均戦略が鞍点に $O(\sqrt{\log K/T})$ で近づく。
- 結果として、**厳密に解かなくても漸近最適性が保たれ、かつ非漸近保証が付く。**

> **利点**:
> 1. 計算量が $O(K)$/ラウンド(Track-and-Stop は $\sup_w\inf_{\nu'}$ を解く)。
> 2. **非漸近的な保証が自然に出る**(online learning の後悔が明示的な項として現れる)。
> 3. 構造付き設定に拡張しやすい(§18.2 の計算量ギャップへの答えの 1 つ)。
>
> **第14講 定理 14.2(Sion のミニマックス定理)がこの系統の理論的基盤です。**あの定理を「存在定理」としてでなく「アルゴリズムの設計原理」として読むのがこの分野の作法。

**関連**:
- Degenne & Koolen, *Pure Exploration with Multiple Correct Answers*, NeurIPS 2019(仮定 D も外す)
- Ménard, *Gradient Ascent for Active Exploration in Bandit Problems*, 2019【要出典確認】
- Wang, Tzeng, Proutiere, *Fast Pure Exploration via Frank-Wolfe*, NeurIPS 2021【要出典確認】

---

## 18.4 【仮定 D を外す】複数の正解・複数の最適腕

第4講 §4.4 で見たとおり、最適腕が複数あると $T^*(\nu)=\infty$ になり、有限時間で止まる正当な学習者が存在しません。

### 対処 1:問題を緩める

- **$\varepsilon$-best arm**: $\mu_\psi\ge\mu^*-\varepsilon$ を要求する。$T^*$ が有限になる。
- **top-$m$ 識別**: 上位 $m$ 本の集合を当てる。
- **閾値バンディット**: $\mu_a\ge\theta$ なる腕の集合を当てる。

これらは「複数の正解を許す純粋探索」の枠組み(Degenne & Koolen 2019)で統一的に扱えます。**答えが複数あるとき、$\mathrm{Alt}$ の定義と $T^*$ の形が変わります。**

### 対処 2:同着を正面から扱う【検証:原文(arXiv 要旨)】

Lan V. Truong, *Optimal Best-Arm Identification under Fixed Confidence with Multiple Optima*(arXiv:2505.15643、v1: 2025年5月、v2: 2026年3月、IEEE Trans. Inform. Theory)は、**最適腕の個数(cardinality)が既知であることを使って**より鋭い情報理論的下界を導き、**同着を意識した停止規則(tie-aware stopping rule)**を入れた Track-and-Stop の変種でその下界に漸近的に一致する、と報告しています。

> **ポイントは「$|a^*(\nu)|$ を既知とする」という仮定の追加です。**第4講で見た「複数最適腕だと止まれない」は $|a^*(\nu)|$ が未知だから起きる現象で、個数が分かっていれば「上位 $m$ 本を当てる」問題に近づく、という構図。**「できない」を「何を足せばできるか」に翻訳する典型例です。**

> **これは「教科書に載っていない」典型例です。** L&S §33.2 は「最適腕が複数だと止まれない」と書いて終わっていますが、その先に定式化の余地があった。**教科書の「できません」と書いてある箇所は、研究の入口です。**

---

## 18.5 【仮定 E を外す】バッチ・コスト・腕の増減

**応用側(実験科学)からの要求が集中する領域です。**

| 実験科学の現実 | 破られる仮定 | 研究状況 |
|---|---|---|
| 24 サンプル並列で測る | 1 ラウンド 1 本 | **バッチ複雑度**の研究あり(Tuynman & Degenne, *The Batch Complexity of Bandit Pure Exploration*, arXiv:2502.01425)【検証:原文(arXiv 要旨)】 |
| 腕ごとに測定コストが違う | コスト一様 | cost-aware pure exploration(Wu, Shi, Zhou, Shen, *Cost-Aware Optimal Pairwise Pure Exploration*, AISTATS 2025, arXiv:2503.07877)【検証:原文(arXiv 要旨)】 |
| 測定が破壊的、腕が増減する | 固定腕集合 | **ほぼ未整理** |
| 予算が数十〜数百回 | $\delta\to0$ | §18.1 と同じ |
| ノイズが腕ごとに違い未知 | 既知分散 | 経験 Bernstein(第9講)で部分的に対処 |

### バッチ設定で何が壊れるか【厳密】

D-tracking の $\arg\max_a(t\,w_a^*(\hat\nu(t))-N_a(t))$ は「1 本だけ選ぶ」規則です。$B$ 本まとめて引くとき、単純に上位 $B$ 本を取ると、**同じ腕に集中しすぎる**か、**$w^*$ からの乖離が $B$ 倍になる**。

正しくは「$B$ 本の配分を $w^*$ の比率に合わせる」問題(apportionment 問題)になり、離散最適化が入ります。**さらに、バッチ内では適応できないので、下界そのものが変わります**(バッチ数 $\times$ バッチサイズのトレードオフ)。

> **バッチ複雑度は $T^*(\nu)$ とは別の量になります。**この量が何かを決めること自体が研究になります。

---

## 18.6 【仮定 F を外す】リスク考慮・多目的 — 田畑研の路線

### 18.6.1 リスク考慮型

平均だけでなく分散(あるいは CVaR、分位点)も考慮する。**平均分散基準**では、腕 $a$ の評価を
$$\mathrm{MV}_a:=\mu_a-\rho\,\sigma_a^2\qquad(\rho\ge0)$$
などで測る。

**技術的な難所**: $\mu_a$ と $\sigma_a^2$ が**同じサンプルから推定される**ので、2 つの推定量が独立でない。信頼区間の設計が素直にいきません。ここで経験 Bernstein(第9講 定理 9.11)が要ります。

- Hou, Tan, Zhong, *Almost Optimal Variance-Constrained Best Arm Identification*(VA-LUCB)【要出典確認】
- Nonaga, Tabata, Mizuno, Komatsuzaki, *Risk-Averse Best Arm Set Identification with Fixed Budget and Fixed Confidence*, arXiv:2506.22253

### 18.6.2 多目的・パレート集合識別

目的が 2 つ以上あると、最適腕は**半順序**でしか定まらない。「パレート最適な腕の集合」を識別する問題になります。

**破られるもの**: $a^*(\nu)=\arg\max_a\mu_a$ という定義。$\mathrm{Alt}(\nu)$ の定義も変わる(「パレート集合が異なる環境」)。**答えのサイズが未知**という難しさも加わります。

- Auer, Chiang, Ortner, Drugan, *Pareto Front Identification from Stochastic Bandit Feedback*, AISTATS 2016【要出典確認】
- Kone, Kaufmann, Richert, *Adaptive Algorithms for Relaxed Pareto Set Identification*, NeurIPS 2023 / *Bandit Pareto Set Identification: the Fixed Budget Setting*, 2024(arXiv:2311.03992)【要出典確認】
- **Nonaga et al. (arXiv:2506.22253)**:リスク考慮 × パレート集合識別 × 両設定統一。**田畑研の直近のテーマ。**

> **arXiv:2506.22253 の技術的な核**(既存ノート `research/notes/2506.22253.md` の分析より):「平均と分散が同じサンプルから推定されるため独立でない」という一点。ここが非自明で、貢献の大半がその帰結。**新規性の核は狭いが、修士研究のサイズとしては妥当。**

---

## 18.7 【仮定 G を外す】ノンパラメトリック・分布族が未知

指数型分布族を仮定しないと、$d(\mu,\mu')$ が定義できず、$T^*(\nu)$ の形が変わります。

- **劣ガウスのみ仮定**: 下界の $\mathrm{KL}$ が「劣ガウス性と平均だけから決まる最小の KL」に置き換わる。
- **有界のみ仮定**: 分布全体の空間での $\inf$ になり、$\mathrm{KL}$ の最小化が無限次元問題に。
- **e-process ベースの手法**は分布族の仮定を弱められる:betting martingale(Waudby-Smith & Ramdas)など。【要出典確認】

関連:*Reward Maximization for Pure Exploration: Minimax Optimal Good Arm Identification for Nonparametric Multi-Armed Bandits*(arXiv:2410.15564)【要出典確認】

---

## 18.8 anytime-valid 推測との合流

第11講 §11.4 で見たとおり、BAI の停止規則は **e-process** の言葉で書けます。しかし 2 つのコミュニティ(バンディット / safe anytime-valid inference)は別々に発展してきました。

**合流点**:

| バンディットの言葉 | SAVI の言葉 |
|---|---|
| Chernoff 停止則の閾値 $\beta(t,\delta)$ | e-process の閾値 $1/\delta$ |
| 時間一様信頼区間 | confidence sequence |
| 混合マルチンゲール | method of mixtures / universal portfolio |
| $\delta$-正当性 | anytime validity |
| GLR 統計量 | (e-process ではない)→ 補正が要る |

**研究の方向**: 「BAI の停止規則を e-process として書き直す」。閾値の設計が e-value の設計問題になり、SAVI 側の道具(betting、universal inference、reverse information projection)が使えるようになります。

- Ramdas, Grünwald, Vovk, Shafer, *Game-Theoretic Statistics and Safe Anytime-Valid Inference*, Statist. Sci. 38(4), 2023(arXiv:2210.01948、v1: 2022年10月)【検証:原文(arXiv 要旨)】 — SAVI の定義そのもの:「**任意の停止時刻で妥当であり続ける**証拠の尺度(検定には e-process、推定には信頼列)」

> **【訂正:用語の衝突に注意】** 以前の版はここに Komiyama, Jang, Honda, *Rate-optimal Design for Anytime Best Arm Identification*(AISTATS 2026、arXiv:2510.23199)を挙げていましたが、**これは SAVI の意味の "anytime" ではありません。**同論文の "anytime" は「**予算 $n$ を事前に知らずに走らせられる**固定予算アルゴリズム」(budget-agnostic)という意味で、第17講の話題です。SAVI の "anytime-valid"(任意の停止時刻で第一種過誤が保証される)とは別概念なので、§17.5 に移しました。
>
> **"anytime" は文献によって少なくとも 3 つの意味で使われます**:(a) 予算を知らなくてよい(固定予算)、(b) 任意の停止時刻で妥当(SAVI)、(c) いつ止めても答えを返せる(any-time algorithm 一般)。**論文を読むときは必ずどれかを確認してください。**

> **「まだ書かれていない論文がいくつもある」領域です。**既存の BAI アルゴリズムを 1 つ取り、その停止規則を e-process として書き直し、SAVI の最適性規準で評価する — というテンプレートで論文が書けます。

---

## 18.9 ベイズ的設定

事前分布 $\Pi$ を置き、
- **ベイズ単純リグレット** $\int R_n^{\mathrm{simple}}(\pi,\nu)\Pi(d\nu)$
- **事後収束率**

を最適化する定式化。Russo の TTTS はもともとこの文脈で提案されました。

- Russo, *Simple Bayesian Algorithms for Best Arm Identification*, COLT 2016 / Ann. Statist. 48(6), 2020
- Atsidakou, Katariya, Sanghavi, Kveton, *Bayesian Fixed-Budget Best-Arm Identification*【要出典確認】
- *Fixed Confidence Best Arm Identification in the Bayesian Setting*(arXiv:2402.10429)【要出典確認】

> **第17講の非存在定理との関係**: 頻度論的に「すべての $\nu$ で最良」が存在しなくても、**事前分布で平均すれば最適化問題が well-posed になる**可能性があります。ベイズ的定式化が固定予算の突破口になるかは、まだ分かっていません。

---

## 18.10 まとめ — 7 方向の地図

```
                        第13〜15講の理論
                              │
   ┌──────┬──────┬──────┬─────┴─────┬──────┬──────┬──────┐
   A      B/C     C      D          E      F      G     (+ SAVI 合流)
   │      │      │      │          │      │      │
 非漸近  構造付き ゲーム  複数正解   バッチ  リスク  ノンパラ
        線形/組合 論的   多重最適   コスト  多目的
        transd.  解法              腕増減
   │      │      │      │          │      │      │
   ↓      ↓      ↓      ↓          ↓      ↓      ↓
 閾値の  計算量  online 定式化の    下界    半順序  分布族
 最適化  ギャップ learning 拡張    自体が   での    フリー
                              変わる  Alt    e-process
```

**田畑研の路線は F(リスク・多目的)と E(応用側の制約)の交点にあります。**第19講で、ここから種を出します。

---

## 演習(詳細は [B-exercises.md](B-exercises.md) §18)

- **★18-1** 線形バンディット(ガウス、既知分散 $1$)について、
  $$\inf_{\theta':\langle\theta',x_{a^*}-x_b\rangle\le0}\ \frac12\sum_a w_a\langle\theta-\theta',x_a\rangle^2=\frac{\langle\theta,x_{a^*}-x_b\rangle^2}{2\|x_{a^*}-x_b\|_{V(w)^{-1}}^2}$$
  を導出せよ($V(w)=\sum_aw_ax_ax_a^\top$ が正則と仮定)。
- **★18-2** §18.1 の表の「隙間の内訳」を、`bai_demo.py` の設定で数値的に確認せよ。閾値だけで隙間の何割を説明できるか。
- **★18-3** バッチサイズ $B$ で D-tracking を実行すると何が壊れるか、$K=2$、$w^*=(0.5,0.5)$、$B=3$ の具体例で示せ。
- **★18-4** §18.6 の「平均と分散が同じサンプルから推定されるため独立でない」問題を、$X\sim\mathcal{N}(\mu,\sigma^2)$ の $\hat\mu$ と $\hat\sigma^2$ が独立であること(ガウス特有)と対比して説明せよ。**ガウス以外では独立でない**ことを確認すること。
- **☆18-5** §18.3 のゲーム論的アプローチについて、$K=2$ の場合に指数化勾配法で鞍点を求めるコードを書き、`tstar_highprec.py` の $w^*$ と一致するか確認せよ。
- **☆18-6** arXiv:2506.22253 の §2(Problem Setting)を読み、パレート優越の定義と gap 量を記号表にまとめよ(`research/notes/2506.22253.md` の Step 2 に相当)。

---

[← 前の講](17-fixed-budget.md) ｜ [次の講: 未解決問題と研究テーマ →](19-open-problems.md)
