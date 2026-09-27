# 第16講 — その他の固定信頼度アルゴリズム

[← 前の講](15-track-and-stop.md) ｜ [README](README.md) ｜ [次の講 →](17-fixed-budget.md)

---

## この講の目標

1. Track-and-Stop 以外の主要アルゴリズム(逐次棄却、LUCB、UGapE、Top-Two)を、**下界との関係**で位置づける。
2. **Top-Two 型の $\beta$-最適性**を定義し、「$\beta=1/2$ で $T^*$ の 2 倍以内」を**自分で証明する**。
3. 各アルゴリズムが「下界のどこを近似しているか」を整理する。

> **なぜ Track-and-Stop 以外を学ぶのか。** Track-and-Stop は漸近最適ですが、毎ステップ $w^*(\hat\nu(t))$ を解く必要があり、構造付き設定(腕が指数個)では計算不能になります。また有限 $\delta$ での性能は良くありません。実務と最新研究では、**より軽い / より頑健な**アルゴリズムが使われます。

---

## 16.1 分類 — 下界のどこを近似しているか

第13講の下界
$$\mathbb{E}[\tau]\ \ge\ T^*(\nu)\,\mathrm{kl}(\delta,1-\delta),\qquad T^*(\nu)^{-1}=\sup_{w}\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\mathrm{KL}(\nu_a,\nu'_a)$$
に対して、各アルゴリズムは次のように対応します。

| アルゴリズム | サンプリング則の考え方 | 下界との関係 |
|---|---|---|
| 一様サンプリング | $w=(1/K,\dots,1/K)$ 固定 | $T^*$ の $\Theta(K)$ 倍まで悪化しうる |
| **逐次棄却**(SE) | 生き残った腕を一様に | ギャップベース、$T^*$ より緩い |
| **LUCB** | 経験最良腕 + 最も紛らわしい挑戦者 | $\inf_{\nu'}$ の argmin を近似 |
| **UGapE** | ギャップの信頼上界が最大の腕 | 同上、統一枠組み |
| **Top-Two** | 経験最良腕を確率 $\beta$、挑戦者を $1-\beta$ | $w_1=\beta$ に制約した $\sup_w$ |
| **Track-and-Stop** | $w^*(\hat\nu(t))$ を直接追跡 | $\sup_w\inf_{\nu'}$ を毎回解く |
| **ゲーム論的**(第18講) | 鞍点を online learning で近似 | $\sup_w\inf_{\nu'}$ を逐次的に解く |

**停止則はどれも共通で使えます**(第15講 §15.2 の議論はサンプリング則に依存しない)。**アルゴリズムの違いはサンプリング則だけです。**

---

## 16.2 逐次棄却(Successive Elimination)

### 定義 16.1【厳密】

活性集合 $S_1=[K]$ から始める。ラウンド $r=1,2,\dots$ で:

1. $S_r$ のすべての腕を 1 回ずつ引く。
2. 各腕の信頼区間 $[\mathrm{LCB}_a,\mathrm{UCB}_a]$ を(時間一様な形で)更新。
3. $\max_{b\in S_r}\mathrm{LCB}_b>\mathrm{UCB}_a$ なる $a$ を $S_r$ から除去して $S_{r+1}$ とする。
4. $|S_{r+1}|=1$ なら停止し、その腕を推薦。

### 定理 16.2(サンプル複雑度)【証明省略, 要出典確認】

$[0,1]$ 値報酬・時間一様な Hoeffding 区間を使うと、確率 $1-\delta$ 以上で正しく停止し
$$\tau\ =\ O\!\left(\sum_{a\ne a^*}\frac{1}{\Delta_a^2}\log\frac{K}{\delta\,\Delta_a}\right).$$

> Even-Dar, Mannor, Mansour, JMLR 7:1079–1105, 2006。定数と $\log$ の中身は版によって異なるので、引用時は原論文を確認してください。

**下界との比較**: $T^*(\nu)\asymp\sum_{a\ne1}\frac{\sigma_a^2}{\Delta_a^2}+\frac{\sigma_1^2}{\Delta_{\min}^2}$(第14講 命題 14.11)なので、逐次棄却は**オーダーとしては最適に近い**が、
- $\log\frac{K}{\delta\Delta_a}$ の $\log\frac1{\Delta_a}$ が余分($T^*\log\frac1\delta$ には現れない)、
- 定数が最適でない、
という 2 点で $\delta\to0$ の漸近最適性は持ちません。

> **利点**: 実装が単純、計算量が $O(K)$/ラウンド、構造付き設定に拡張しやすい。**現場ではこれで十分なことが多い。**

---

## 16.3 LUCB と KL-LUCB

### 定義 16.3(LUCB)【厳密】

各ラウンドで **2 本**引く:
$$h_t:=\operatorname*{arg\,max}_a\hat\mu_a(t)\quad(\text{leader}),\qquad \ell_t:=\operatorname*{arg\,max}_{a\ne h_t}\mathrm{UCB}_a(t)\quad(\text{challenger}),$$
の 2 本。停止は $\mathrm{LCB}_{h_t}(t)>\mathrm{UCB}_{\ell_t}(t)$ となったとき。

> **なぜこの 2 本か【直感】**: 「腕 $h_t$ が最適」を反証しうる最有力候補は、信頼上界が最も高い腕 $\ell_t$。$\inf_{\nu'\in\mathrm{Alt}}$ の argmin(最も紛らわしい対立仮説)を、信頼区間で近似している。

### 定理 16.4【証明省略, 要出典確認】

$H_1(\nu):=\sum_{a}\Delta_a^{-2}$($\Delta_{a^*}:=\Delta_{\min}$ と規約)とすると、LUCB は $\delta$-正当で
$$\mathbb{E}[\tau]=O\!\left(H_1(\nu)\log\frac{H_1(\nu)}{\delta}\right).$$

> Kalyanakrishnan, Tewari, Auer, Stone, ICML 2012。

### KL-LUCB

信頼区間を Hoeffding 型から **KL 型**(第9講 定理 9.8)に置き換えたもの:
$$\mathrm{UCB}_a(t)=\max\{q\ge\hat\mu_a(t) : N_a(t)\,d(\hat\mu_a(t),q)\le\beta(t,\delta)\}.$$

> KCG2016 §4 / Kaufmann & Kalyanakrishnan, COLT 2013。**$\mu$ が $0$ や $1$ に近いとき Hoeffding 型より大幅に良い**(第9講 §9.4 の数値表)。

---

## 16.4 UGapE — 固定信頼度と固定予算の統一

### 定義 16.5(ギャップの信頼上界)【厳密】

$$B_a(t):=\max_{b\ne a}\ \mathrm{UCB}_b(t)-\mathrm{LCB}_a(t)$$
は「腕 $a$ が最適でない度合い」の信頼上界。$B_a(t)<0$ なら腕 $a$ が最適だと確定。

**UGapE**: $J_t:=\arg\min_a B_a(t)$(最も有望な腕)とし、
$$u_t:=\operatorname*{arg\,max}_{b\ne J_t}\mathrm{UCB}_b(t),\qquad \ell_t:=J_t$$
のうち**信頼区間が広い方**を引く。停止は $B_{J_t}(t)<\varepsilon$。

> Gabillon, Ghavamzadeh, Lazaric, NeurIPS 2012。**同じ探索則で固定信頼度(停止則を付ける)と固定予算(予算まで走らせる)の両方を扱える**のが特徴。$(\varepsilon,m)$-best arm(上位 $m$ 本を $\varepsilon$ 精度で)にも一般化されています。
>
> **田畑研の arXiv:2506.22253(リスク考慮型パレート集合識別)は、この UGapE の骨格を半順序に拡張したものです。**第18・19講で扱います。

---

## 16.5 Top-Two 型と $\beta$-最適性

**現在最も実用的とされる系統です。**

### 定義 16.6(Top-Two の枠組み)【厳密】

パラメータ $\beta\in(0,1)$ を固定。各ラウンドで

1. **leader** $h_t$ を選ぶ(例:経験最良腕、Thompson サンプルの argmax)。
2. **challenger** $c_t\ne h_t$ を選ぶ(例:2 番目の Thompson サンプル、$Z_{h_t,b}(t)$ を最小にする $b$)。
3. 確率 $\beta$ で $h_t$ を、確率 $1-\beta$ で $c_t$ を引く。

代表例:
- **TTTS**(Top-Two Thompson Sampling):$h_t,c_t$ を事後分布からのサンプルで選ぶ(Russo, COLT 2016 / Ann. Statist. 2020)
- **TTUCB / T3C / EB-TCI**:leader を経験最良腕、challenger を GLR 最小化で選ぶ(Jourdan, Degenne, Baudry, de Heide, Kaufmann, NeurIPS 2022)【要出典確認】

### 定義 16.7($\beta$-最適な特性時間)【厳密】

$$T_\beta(\nu)^{-1}:=\sup_{\substack{w\in\Sigma_K\\ w_{a^*}=\beta}}\ \inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a).$$

明らかに $T_\beta(\nu)\ge T^*(\nu)$ で、等号は $\beta=w^*_{a^*}(\nu)$ のとき。

### 命題 16.8($\beta=1/2$ で 2 倍以内)【厳密】

任意の $\nu$(一意な最適腕を持つ)と $\beta\in(0,1)$ について
$$\frac{T_\beta(\nu)}{T^*(\nu)}\ \le\ \max\left\{\frac{w^*_{a^*}}{\beta},\ \frac{1-w^*_{a^*}}{1-\beta}\right\}.$$
特に $\beta=1/2$ なら $T_{1/2}(\nu)\le2\,T^*(\nu)$。

**証明.** $a^*=1$ とする。$w^*=w^*(\nu)$、$w_1^*=:\alpha$ とおく。$w\in\Sigma_K$ を
$$w_1:=\beta,\qquad w_b:=w_b^*\cdot\frac{1-\beta}{1-\alpha}\quad(b\ne1)$$
と定めると、$\sum_bw_b=(1-\alpha)\cdot\frac{1-\beta}{1-\alpha}=1-\beta$ なので $w\in\Sigma_K$ かつ $w_1=\beta$。

$c:=\min\left\{\dfrac{\beta}{\alpha},\ \dfrac{1-\beta}{1-\alpha}\right\}$ とおくと、成分ごとに $w_a\ge c\,w_a^*$。

$g(w):=\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_aw_a\mathrm{KL}(\nu_a,\nu'_a)$ は
- **正斉次**($g(cw)=c\,g(w)$、$c>0$):各 $\nu'$ について被積分関数が $w$ の線形関数だから。
- **成分ごとに単調非減少**($w\ge w'\Rightarrow g(w)\ge g(w')$):$\mathrm{KL}\ge0$ だから。

したがって
$$T_\beta(\nu)^{-1}\ \ge\ g(w)\ \ge\ g(c\,w^*)\ =\ c\,g(w^*)\ =\ \frac{c}{T^*(\nu)},$$
すなわち $T_\beta(\nu)\le T^*(\nu)/c=T^*(\nu)\max\{\alpha/\beta,\ (1-\alpha)/(1-\beta)\}$。

$\beta=1/2$ なら $\max\{2\alpha,2(1-\alpha)\}\le2$。$\square$

**【検証:数値】** `check_top_two_beta`(ガウス単位分散)。$T_\beta$ は $w_1=\beta$ 固定で**厳密に**解けます:$f_b(w_b)=\frac{w_1w_b\Delta_b^2}{2(w_1+w_b)}$ が $w_b$ について増加なので、$\sum_{b\ne1}w_b=1-\beta$ のもとで $\min_b f_b$ を最大化する点は**全 $b$ で $f_b$ が等値**になる点であり、$f_b=y$ を解いた $w_b(y)=\frac{2yw_1}{w_1\Delta_b^2-2y}$ を $y$ について二分するだけで求まります。

| $\mu$ | $T^*$ | $w_1^*$ | $\beta$ | $T_\beta$ | $T_\beta/T^*$ | 命題 16.8 の上界 |
|---|---|---|---|---|---|---|
| $(1,0.5,0.2)$ | 35.877 | 0.45259 | 0.5 | 36.217 | **1.0095** | 1.0948 |
| $(1,0.5,0.2)$ | 35.877 | 0.45259 | 0.3 | 40.117 | 1.1182 | 1.5086 |
| $(1,0.5,0.2)$ | 35.877 | 0.45259 | 0.7 | 46.798 | 1.3044 | 1.8247 |
| $(0,-0.3,-0.35,-1.2)$ | 115.551 | 0.41654 | 0.5 | 118.856 | **1.0286** | 1.1669 |
| $(0,-0.3,-0.35,-1.2)$ | 115.551 | 0.41654 | 0.3 | 123.314 | 1.0672 | 1.3885 |
| $(0,-0.3,-0.35,-1.2)$ | 115.551 | 0.41654 | 0.7 | 160.666 | 1.3904 | 1.9449 |

**定義 16.7 の「等号は $\beta=w^*_{a^*}$ のとき」も数値で確認済み**:$\beta=w_1^*$ を入れると上の二分法が $T_\beta=T^*$ を機械精度($10^{-16}$)で返します。

> **実際の劣化は上界よりずっと小さい**($\beta=1/2$ で $1\%$〜$3\%$)。理由は第14講 **系 14.10'** です:単位分散ガウスでは
> $$\frac{1}{1+\sqrt{K-1}}\ \le\ w_1^*(\nu)\ \le\ \frac12$$
> なので、$w_1^*$ は必ず $1/2$ 以下で、しかも $K$ が中程度なら $1/2$ にそこそこ近い。命題 16.8 の上界に $\beta=1/2$ と系 14.10' を入れると
> $$\frac{T_{1/2}}{T^*}\ \le\ \max\{2w_1^*,\ 2(1-w_1^*)\}=2(1-w_1^*)\ \le\ 2-\frac{2}{1+\sqrt{K-1}}$$
> ($w_1^*\le1/2$ より $1-w_1^*\ge w_1^*$)。$K=3$ なら $\le1.172$、$K=4$ なら $\le1.268$。**上表の実測($1.0095$, $1.0286$)はさらに小さい。**
>
> **$\beta=1/2$ 決め打ちが実務で通用する理由がここにあります。**

> **この命題が Top-Two 型の理論的な立脚点です。** $w^*$ を解かなくても、「最良腕を半分、挑戦者を半分」と決め打つだけで **最悪でも 2 倍**。しかも計算量は $O(K)$/ラウンド。
>
> **$\beta$ を適応的に調整する**と $T^*$ に到達できます(Jourdan et al. 2022 の "adaptive $\beta$")。【要出典確認】

### 16.5.1 なぜ Top-Two が実務で強いのか【直感】

- **計算量**: $w^*(\hat\nu(t))$ を解かないので $O(K)$。腕が多い/構造付きの設定でスケールする。
- **頑健性**: $\hat\nu(t)$ の推定誤差が $w^*$ の計算を通じて増幅されない。
- **非漸近性能**: 実験的に Track-and-Stop より良いことが多い(有限 $\delta$ での比較)。【要出典確認】
- **ベイズ的解釈**: TTTS は事後分布からサンプルするので、事前情報を自然に入れられる。

---

## 16.6 lil'UCB — LIL に基づく停止

### 定義 16.9【厳密の骨格】

第8講 §8.2 の重複対数の法則より、時間一様な信頼幅は $\sqrt{\frac{2\sigma^2\log\log N_a(t)}{N_a(t)}}$ のオーダーが最良。lil'UCB はこの形の信頼幅を使い、
$$A_{t+1}=\operatorname*{arg\,max}_a\left(\hat\mu_a(t)+c(\varepsilon,\beta)\sqrt{\frac{2\sigma^2(1+\varepsilon)\log\left(\frac{\log((1+\varepsilon)N_a(t))}{\delta'}\right)}{N_a(t)}}\right)$$
を引き、**ある腕が「他の全ての腕の合計の $\lambda$ 倍以上」引かれた**時点、すなわち $\exists a:\ N_a(t)\ \ge\ 1+\lambda\sum_{b\ne a}N_b(t)$ で停止する。

> **パラメータは 4 つ($\varepsilon,\beta,\lambda,\delta'$)で、役割が別々です。**$\varepsilon$ は信頼幅の LIL 項の緩め方、$\beta$(と $\varepsilon$)が前係数 $c(\varepsilon,\beta)$、$\lambda$ が停止則、$\delta'$ が $\delta$ から定まる 1 腕あたりの水準。**停止則の $\lambda$ を $1/\varepsilon$ と書いている資料を見かけますが、原論文では独立なパラメータです。**前係数と $\lambda$ の具体値は原論文の Theorem 2 とその周辺で確認してください。【要出典確認 — 4 つのパラメータの存在と停止則の形は確認済み、定数は未確認】
>
> Jamieson, Malloy, Nowak, Bubeck, *lil' UCB: An Optimal Exploration Algorithm for Multi-Armed Bandits*, COLT 2014(arXiv:1312.7308)【検証:原文(arXiv 要旨)】。**サンプル複雑度は $O(\sum_a\Delta_a^{-2}\log\log\Delta_a^{-2})$ で、$\delta$ 依存の項が $\log(1/\delta)$、$\Delta$ 依存の項が $\log\log$ という分離が得られる。**要旨は「LIL に基づく下界と定数倍の範囲で一致する」と述べています。
>
> **第8講の stitching(定理 8.4)がここで効きます。**$\log\log$ の境界を持っているかどうかで、$\Delta$ が小さい腕の扱いが変わる。
>
> **停止則が「union bound を避けている」のがこのアルゴリズムの技術的な売りです**(要旨に明記)。第15講 補題 15.5(L&S Prop 33.9)が $K$ 腕を束ねるのに $K\log(t^2+t)$ を払っていたのと対照的な設計。

---

## 16.7 比較表

| アルゴリズム | サンプル複雑度 | 計算量/ラウンド | 漸近最適 | 実装難度 |
|---|---|---|---|---|
| 一様 | $O(K\Delta_{\min}^{-2}\log\frac1\delta)$ | $O(1)$ | ✗($\Theta(K)$ 倍) | ★ |
| 逐次棄却 | $O(\sum_a\Delta_a^{-2}\log\frac{K}{\delta\Delta_a})$ | $O(K)$ | ✗ | ★ |
| LUCB | $O(H_1\log\frac{H_1}{\delta})$ | $O(K)$ | ✗ | ★★ |
| KL-LUCB | 同上(KL 版で定数改善) | $O(K)$ | ✗ | ★★ |
| lil'UCB | $O(\sum_a\Delta_a^{-2}\log\log\Delta_a^{-2}+\ldots)$ | $O(K)$ | ✗ | ★★ |
| UGapE | $O(H_1\log\frac{K}{\delta})$ | $O(K)$ | ✗ | ★★ |
| **Top-Two($\beta$ 固定)** | $T_\beta(\nu)\log\frac1\delta$、$\le2T^*$ | $O(K)$ | $\beta$ 最適時のみ | ★★ |
| **Top-Two(適応 $\beta$)** | $T^*(\nu)\log\frac1\delta$ | $O(K)$ | ✓ | ★★★ |
| **Track-and-Stop** | $T^*(\nu)\log\frac1\delta$ | $w^*$ を解く | ✓ | ★★★ |

> 複雑度の $O$ の中身は文献ごとに定数・$\log$ の詳細が異なります。**表は「オーダーの構造を比較する」ためのもので、引用には使わないでください。**【要出典確認】

---

## 16.8 まとめ

- アルゴリズムの違いは**サンプリング則だけ**。停止則(Chernoff / 信頼区間)と正当性の議論は共通。
- 逐次棄却 / LUCB / UGapE は**ギャップベース**。オーダー最適だが漸近最適ではない。
- **Top-Two は「$w_1=\beta$ に制約した下界 $T_\beta$」を達成する。$\beta=1/2$ で $T^*$ の 2 倍以内(命題 16.8、自分で証明できる)。**
- Track-and-Stop は漸近最適だが $w^*$ を毎回解く必要がある。
- **計算量と最適性のトレードオフ**が、この分野のアルゴリズム設計の主軸。

---

## 演習(詳細は [B-exercises.md](B-exercises.md) §16)

- **★16-1** 命題 16.8 を何も見ずに証明せよ。$g$ の正斉次性と単調性をどこで使ったか明示すること。
- **★16-2** $K=3$、単位分散ガウス $\mu=(1,0.5,0.2)$ について $w_1^*=0.4526$(第14講)。$\beta=1/2$ のとき命題 16.8 の上界はいくつか。実際の $T_{1/2}$ を数値で求め、上界と比べよ。
- **★16-3** LUCB のサンプリング則が「$\inf_{\nu'\in\mathrm{Alt}}$ の argmin を近似している」という主張を、第14講 命題 14.3 と対応づけて説明せよ。
- **★16-4** 逐次棄却を実装し、`bai_demo.py` の設定($\mu=(0.6,0.45,0.35,0.25)$、$\delta=10^{-3}$)で Track-and-Stop と比較せよ。
- **☆16-5** Top-Two の $\beta$ を適応的に更新する方法を 1 つ設計し、$T^*$ に収束する理由を論じよ(答えは 1 つではない。文献と突き合わせること)。
- **☆16-6** 命題 16.8 の上界がタイトになる $\nu$ と $\beta$ の例を作れ。

---

[← 前の講](15-track-and-stop.md) ｜ [次の講: 固定予算設定 →](17-fixed-budget.md)
