# 第13講 — サンプル複雑度の下界

[← 前の講](12-bandit-formulation.md) ｜ [README](README.md) ｜ [次の講 →](14-characteristic-time.md)

---

## この講の目標

**固定信頼度 BAI のサンプル複雑度下界を、完全に証明する。**

$$\boxed{\ \mathbb{E}_{\nu\pi}[\tau]\ \ge\ T^*(\nu)\ \mathrm{kl}(\delta,1-\delta)\ }$$

これがコースの中核です。第1〜11講で作った道具がすべてここで使われます。

---

## 13.0 証明の全体像(先に読む)

**5 ステップです。**細部に入る前に骨格を頭に入れてください。

| Step | 内容 | 使う道具 | 講 |
|---|---|---|---|
| **1** | $\mathrm{KL}\big(\mathbb{P}_\nu^{\mathcal{F}_\tau},\mathbb{P}_{\nu'}^{\mathcal{F}_\tau}\big)=\sum_a\mathbb{E}_\nu[N_a(\tau)]\mathrm{KL}(\nu_a,\nu'_a)$ | canonical model + **任意停止定理** | 3, 6 |
| **2** | $\mathrm{KL}(P,Q)\ge\mathrm{kl}(P(A),Q(A))$ | **データ処理不等式** | 10 |
| **3** | $A$ = 「止まって $a^*(\nu)$ を推薦」に取ると $\mathbb{P}_\nu(A)\ge1-\delta$、$\mathbb{P}_{\nu'}(A)\le\delta$ | **$\delta$-正当性** | 4, 12 |
| **4** | 全ての $\nu'\in\mathrm{Alt}(\nu)$ で $\sum_a\mathbb{E}_\nu[N_a(\tau)]\mathrm{KL}(\nu_a,\nu'_a)\ge\mathrm{kl}(\delta,1-\delta)$ | 1〜3 をつなぐ | — |
| **5** | $w_a=\mathbb{E}_\nu[N_a(\tau)]/\mathbb{E}_\nu[\tau]$ とおいて $\sup_w\inf_{\nu'}$ に化ける | 最適化(単なる定義) | 14 |

**測度論を使うのは Step 1 だけです。** Step 2 は情報理論、Step 3 は定義の書き換え、Step 4-5 は代数と最適化。

---

## 13.1 設定と仮定

### 定義 13.1(対立集合)【厳密】

環境クラス $\mathcal{E}$ と $\nu\in\mathcal{E}$ に対し
$$\mathrm{Alt}(\nu):=\big\{\nu'\in\mathcal{E}\ :\ a^*(\nu)\cap a^*(\nu')=\emptyset\big\}.$$
$a^*(\nu)=\{1\}$(一意)のときは $\mathrm{Alt}(\nu)=\{\nu'\in\mathcal{E} : 1\notin a^*(\nu')\}$、すなわち「腕 1 が最適でなくなる環境」全体。

> L&S の $\mathcal{E}_{\mathrm{alt}}(\nu)=\{\nu'\in\mathcal{E}:i^*(\nu')\cap i^*(\nu)=\emptyset\}$ と同じ($i^*$ が本資料の $a^*$)。【検証:PDF】(L&S 印刷ページ p.406 = PDF 415 ページ)

### 仮定 13.2(標準的な正則性)【厳密】

以下、環境クラス $\mathcal{E}$ について次を仮定する。

**(A1)** 任意の $\nu,\nu'\in\mathcal{E}$ と $a\in[K]$ について $\nu_a\ll\nu'_a$ かつ $\nu'_a\ll\nu_a$。
**(A2)** $\displaystyle\sup_{\nu,\nu'\in\mathcal{E}}\max_{a}\int\left|\log\frac{d\nu_a}{d\nu'_a}\right|d\nu_a<\infty$ ではなく、**各組 $(\nu,\nu')$ ごとに** $C(\nu,\nu'):=\max_a\int|\log(d\nu_a/d\nu'_a)|\,d\nu_a<\infty$。

> **どんなクラスで満たされるか**:
> - $\mathcal{E}_\mathcal{N}^K(\sigma^2)$(既知分散ガウス、平均は $\mathbb{R}$ 全体):満たす。$C(\nu,\nu')=\max_a\mathbb{E}|(\mu_a-\mu'_a)X+\text{const}|<\infty$。
> - ベルヌーイで平均が $(0,1)$ の**コンパクト部分集合**に入る場合:満たす。**平均 $0$ や $1$ を許すと (A1) が壊れます。**
> - 1 パラメータ指数型分布族で自然パラメータが内点にある場合:満たす。
>
> (A1) が壊れるクラス(例:平均 $0$ を許すベルヌーイ)では、$\mathrm{KL}=\infty$ となる $\nu'$ が現れて下界が自明になる、という形で処理します。**理論の本質は変わりませんが、ステートメントに例外条項が増えるので、ここでは (A1)(A2) を仮定します。**

---

## 13.2 Step 1 — 発散分解(停止時刻版)

第6講で証明済みですが、下界の文脈で再掲します。

### 定理 13.3【厳密】

仮定 13.2 の下、$\nu,\nu'\in\mathcal{E}$、方策 $\pi$、停止時刻 $\tau$ が $\mathbb{E}_{\nu\pi}[\tau]<\infty$ を満たすとする。このとき $\mathbb{P}_{\nu\pi}(\tau<\infty)=1$ であり
$$\mathrm{KL}\Big(\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau},\ \mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau}\Big)\ =\ \sum_{a=1}^K\mathbb{E}_{\nu\pi}\big[N_a(\tau)\big]\ \mathrm{KL}(\nu_a,\nu'_a).$$

**証明.** $\mathbb{E}[\tau]<\infty$ より $\tau<\infty$ a.s.。定理 6.11 より $\mathrm{KL}(\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau},\mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau})=\mathbb{E}_{\nu\pi}[L_\tau]$、定理 6.10 より $\mathbb{E}_{\nu\pi}[L_\tau]=\sum_a\mathbb{E}_{\nu\pi}[N_a(\tau)]\mathrm{KL}(\nu_a,\nu'_a)$。$\square$

> **依存関係を明示しておきます。**
> - 定理 6.10 の証明 = 補題 6.9(マルチンゲール性 + 条件付き有界増分)+ 任意停止定理 定理 6.2(c)。
> - 補題 6.9 の証明 = 第3講 定理 3.8(尤度比から $\pi$ が消える)+ 第2講 定理 2.4, 2.5。
> - 定理 6.11 の証明 = 第4講 命題 4.8(停止 σ-加法族)+ 単調収束定理。
>
> **この 3 段が「BAI に測度論が要る」の全部です。**

---

## 13.3 Step 2–3 — データ処理と $\delta$-正当性

### 補題 13.4【厳密】

$(\pi,\tau,\psi)$ を $\mathcal{E}$ 上で信頼水準 $\delta\in(0,1/2)$ で正当な学習者(定義 4.10)とする。$\nu\in\mathcal{E}$ が一意な最適腕 $a^*(\nu)$ を持ち、$\mathbb{E}_{\nu\pi}[\tau]<\infty$ とする。このとき、任意の $\nu'\in\mathrm{Alt}(\nu)$ について
$$\mathrm{KL}\Big(\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau},\ \mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau}\Big)\ \ge\ \mathrm{kl}(\delta,1-\delta).$$

**証明.**

**事象を定める.** $A:=\{\tau<\infty\}\cap\{\psi\in a^*(\nu)\}$ とおく。$\psi$ は $\mathcal{F}_\tau$-可測(定義 4.9)、$\{\tau<\infty\}\in\mathcal{F}_\tau$(命題 4.8.2 と $\{\tau<\infty\}=\bigcup_t\{\tau\le t\}$)なので $A\in\mathcal{F}_\tau$。

**$\mathbb{P}_\nu(A)$ の評価.** $\mathbb{E}_{\nu\pi}[\tau]<\infty$ より $\mathbb{P}_{\nu\pi}(\tau<\infty)=1$。正当性より $\mathbb{P}_{\nu\pi}(\tau<\infty,\ \psi\notin a^*(\nu))\le\delta$。よって
$$\mathbb{P}_{\nu\pi}(A)=\mathbb{P}_{\nu\pi}(\tau<\infty)-\mathbb{P}_{\nu\pi}(\tau<\infty,\ \psi\notin a^*(\nu))\ \ge\ 1-\delta.$$

**$\mathbb{P}_{\nu'}(A)$ の評価.** $\nu'\in\mathrm{Alt}(\nu)$ より $a^*(\nu)\cap a^*(\nu')=\emptyset$、したがって $\{\psi\in a^*(\nu)\}\subset\{\psi\notin a^*(\nu')\}$。よって
$$A\subset\{\tau<\infty\}\cap\{\psi\notin a^*(\nu')\}$$
であり、$\nu'$ に対する正当性より
$$\mathbb{P}_{\nu'\pi}(A)\ \le\ \mathbb{P}_{\nu'\pi}\big(\tau<\infty,\ \psi\notin a^*(\nu')\big)\ \le\ \delta.$$

**データ処理不等式.** 系 10.7 より
$$\mathrm{KL}\Big(\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau},\mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau}\Big)\ \ge\ \mathrm{kl}\big(\mathbb{P}_{\nu\pi}(A),\ \mathbb{P}_{\nu'\pi}(A)\big).$$
$\mathrm{kl}(x,y)$ は($x>y$ の領域で)$x$ について増加、$y$ について減少するので、$\mathbb{P}_\nu(A)\ge1-\delta$、$\mathbb{P}_{\nu'}(A)\le\delta$、$\delta<1/2$ より
$$\mathrm{kl}\big(\mathbb{P}_{\nu\pi}(A),\mathbb{P}_{\nu'\pi}(A)\big)\ \ge\ \mathrm{kl}(1-\delta,\delta)=\mathrm{kl}(\delta,1-\delta).$$
最後の等式は命題 10.12。$\square$

> **単調性の確認**(演習ではなく、ここで書いておきます):$\partial_x\mathrm{kl}(x,y)=\log\frac{x(1-y)}{y(1-x)}$ で、$x>y$ なら正。$\partial_y\mathrm{kl}(x,y)=\frac{y-x}{y(1-y)}$ で、$x>y$ なら負。$\square$
>
> **$\mathbb{P}_{\nu'\pi}(\tau=\infty)$ を心配しなくてよい理由**: $\nu'$ の下では止まらないかもしれませんが、$A\subset\{\tau<\infty\}$ なのでそもそも $A$ の外です。**正当性の定義(定義 4.10)が $\{\tau<\infty\}$ を明示的に含んでいるのは、まさにこの議論のためです。**

---

## 13.4 Step 4–5 — 主定理

### 定義 13.5(特性時間)【厳密】

$\Sigma_K:=\{w\in[0,1]^K : \sum_a w_a=1\}$(確率単体)とする。$\nu\in\mathcal{E}$ に対し
$$\boxed{\ T^*(\nu)^{-1}\ :=\ \sup_{w\in\Sigma_K}\ \inf_{\nu'\in\mathrm{Alt}(\nu)}\ \sum_{a=1}^K w_a\,\mathrm{KL}(\nu_a,\nu'_a)\ }$$
を定め、$T^*(\nu)$ を **$\nu$ の特性時間**(characteristic time)という。$T^*(\nu)^{-1}=0$ のときは $T^*(\nu)=+\infty$ と規約する。

> L&S の $c^*(\nu)$ と同じ量。【検証:PDF】(L&S 式 (33.4) は 定理 33.5 の中にあり、**印刷ページ p.407** = PDF 416 ページ。L&S は重み $w$ を $\alpha\in\mathcal{P}_{K-1}$、$\mathrm{KL}$ を $D(\cdot,\cdot)$ と書きます)

### 定理 13.6(BAI のサンプル複雑度下界)【厳密】

仮定 13.2 の下、$(\pi,\tau,\psi)$ を $\mathcal{E}$ 上で信頼水準 $\delta\in(0,1/2)$ で正当な学習者とする。一意な最適腕を持つ任意の $\nu\in\mathcal{E}$ について
$$\mathbb{E}_{\nu\pi}[\tau]\ \ge\ T^*(\nu)\ \mathrm{kl}(\delta,1-\delta)\ \ge\ T^*(\nu)\,\log\frac{1}{2.4\,\delta}.$$

**証明.**

$\mathbb{E}_{\nu\pi}[\tau]=\infty$ なら自明。以下 $\mathbb{E}_{\nu\pi}[\tau]<\infty$ とする。

**Step 4.** 定理 13.3 と 補題 13.4 を合わせると、すべての $\nu'\in\mathrm{Alt}(\nu)$ について
$$\sum_{a=1}^K\mathbb{E}_{\nu\pi}\big[N_a(\tau)\big]\ \mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \mathrm{kl}(\delta,1-\delta).\tag{$\star$}$$

**Step 5.** $\sum_a N_a(\tau)=\tau$ なので $\sum_a\mathbb{E}_{\nu\pi}[N_a(\tau)]=\mathbb{E}_{\nu\pi}[\tau]$。$\mathrm{kl}(\delta,1-\delta)>0$($\delta<1/2$)と $(\star)$ より $\mathbb{E}_{\nu\pi}[\tau]>0$ なので
$$w_a:=\frac{\mathbb{E}_{\nu\pi}[N_a(\tau)]}{\mathbb{E}_{\nu\pi}[\tau]}\qquad(a\in[K])$$
は $\Sigma_K$ の元。$(\star)$ の両辺を $\mathbb{E}_{\nu\pi}[\tau]$ で割ると、すべての $\nu'\in\mathrm{Alt}(\nu)$ で
$$\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \frac{\mathrm{kl}(\delta,1-\delta)}{\mathbb{E}_{\nu\pi}[\tau]}.$$
右辺は $\nu'$ に依らないので、左辺の $\nu'$ に関する下限を取っても不等式は保たれる:
$$\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \frac{\mathrm{kl}(\delta,1-\delta)}{\mathbb{E}_{\nu\pi}[\tau]}.$$
左辺は $w\in\Sigma_K$ に対する値なので、定義 13.5 の $\sup$ 以下:
$$T^*(\nu)^{-1}\ \ge\ \inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \frac{\mathrm{kl}(\delta,1-\delta)}{\mathbb{E}_{\nu\pi}[\tau]}.$$
整理して $\mathbb{E}_{\nu\pi}[\tau]\ge T^*(\nu)\,\mathrm{kl}(\delta,1-\delta)$。最後の不等式は命題 10.12。

**$T^*(\nu)=\infty$ の場合**: $T^*(\nu)^{-1}=0$ なら上の式は $0\ge\mathrm{kl}(\delta,1-\delta)/\mathbb{E}[\tau]>0$ となり矛盾。よって $\mathbb{E}_{\nu\pi}[\tau]<\infty$ という仮定が成り立たず、$\mathbb{E}_{\nu\pi}[\tau]=\infty$。$\square$

> **Step 5 に確率論はありません。**$w$ を「腕を引いた回数の割合」と定義して、不等式が全ての $\nu'$ で成り立つことから $\inf$ を取り、$w$ が単体の元であることから $\sup$ で上から抑える。**それだけです。**

---

## 13.5 別ルート:Bretagnolle–Huber を使う(L&S 版)

L&S Theorem 33.5 は、Step 2–3 を Bretagnolle–Huber に置き換えたものです。定数が $\log\frac{1}{4\delta}$ になります。

### 定理 13.7(L&S Theorem 33.5)【厳密, 検証:PDF】

同じ設定で
$$\mathbb{E}_{\nu\pi}[\tau]\ \ge\ T^*(\nu)\,\log\frac{1}{4\delta}.$$

**証明(Step 2–3 のみ差し替え).** $\nu'\in\mathrm{Alt}(\nu)$ とし
$$E:=\{\tau<\infty\}\cap\{\psi\notin a^*(\nu')\}\ \in\ \mathcal{F}_\tau$$
とおく。

- $\nu'$ に対する正当性より $\mathbb{P}_{\nu'\pi}(E)\le\delta$。
- $E^c=\{\tau=\infty\}\cup\big(\{\tau<\infty\}\cap\{\psi\in a^*(\nu')\}\big)$。$a^*(\nu)\cap a^*(\nu')=\emptyset$ より $\{\psi\in a^*(\nu')\}\subset\{\psi\notin a^*(\nu)\}$。$\mathbb{P}_{\nu\pi}(\tau=\infty)=0$ と $\nu$ に対する正当性より
$$\mathbb{P}_{\nu\pi}(E^c)\ \le\ 0+\mathbb{P}_{\nu\pi}\big(\tau<\infty,\ \psi\notin a^*(\nu)\big)\ \le\ \delta.$$

Bretagnolle–Huber(定理 10.11)を $P=\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau}$、$Q=\mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau}$、$A=E^c$ に適用すると
$$2\delta\ \ge\ \mathbb{P}_{\nu\pi}(E^c)+\mathbb{P}_{\nu'\pi}(E)\ \ge\ \frac12\exp\Big(-\mathrm{KL}\big(\mathbb{P}_{\nu\pi}^{\mathcal{F}_\tau},\mathbb{P}_{\nu'\pi}^{\mathcal{F}_\tau}\big)\Big),$$
すなわち
$$\sum_a\mathbb{E}_{\nu\pi}[N_a(\tau)]\,\mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \log\frac{1}{4\delta}.$$
あとは Step 5 と同じ。$\square$

【検証:PDF】(L&S 印刷ページ p.407 の証明と一致。L&S も同じ $E=\{\tau<\infty,\ \psi\notin i^*(\nu')\}$ を取り、$E^c\subseteq\{\tau=\infty\}\cup\{\tau<\infty,\ \psi\notin i^*(\nu)\}$ を経由しています)

### 2 つのルートの比較【検証:数値】

$$\mathrm{kl}(\delta,1-\delta)\ \ge\ \log\frac{1}{2.4\delta}\ \ge\ \log\frac{1}{4\delta}.$$

| $\delta$ | $\mathrm{kl}(\delta,1-\delta)$ | $\log\frac{1}{2.4\delta}$ | $\log\frac{1}{4\delta}$ | 比 $\frac{\mathrm{kl}(\delta,1-\delta)}{\log(1/(4\delta))}$ |
|---|---|---|---|---|
| $0.1$ | 1.7578 | 1.4271 | 0.9163 | **1.92** |
| $0.01$ | 4.5032 | 3.7297 | 3.2189 | 1.40 |
| $10^{-6}$ | 13.8155 | 12.9400 | 12.4292 | 1.11 |

($\mathrm{kl}(\delta,1-\delta)=(1-2\delta)\log\frac{1-\delta}{\delta}$ から直接計算。例えば $\delta=0.1$ なら $0.8\times\log9=0.8\times2.1972=1.7578$。)

**DPI ルート(KCG)の方が真に強い。**差は加法定数($\log(4/2.4)=0.511$)なので $\delta\to0$ の漸近では相対的に消えますが、実務的な $\delta=0.1$ では下界の値が **1.92 倍**違います。【検証:数値】(`check_delta_functions`)

---

## 13.6 12 行にまとめる

**白紙から再現する練習用の圧縮版です。**

> $\nu$、最適腕 $1$、$\delta$-正当なアルゴリズム、$\mathbb{E}_\nu[\tau]<\infty$。
>
> 1. $L_t=\sum_{s\le t}\log\frac{p_{A_s}(X_s)}{p'_{A_s}(X_s)}$(**方策の項は約分で消える**)。
> 2. $M_t=L_t-\sum_aN_a(t)\mathrm{KL}(\nu_a,\nu'_a)$ は $\mathbb{P}_\nu$-マルチンゲール、条件付き増分は有界。
> 3. **任意停止定理**より $\mathbb{E}_\nu[L_\tau]=\sum_a\mathbb{E}_\nu[N_a(\tau)]\mathrm{KL}(\nu_a,\nu'_a)$。← **測度論はここだけ**
> 4. $\mathcal{F}_\tau$ 上で $d\mathbb{P}_\nu/d\mathbb{P}_{\nu'}=e^{L_\tau}$、よって左辺 $=\mathrm{KL}(\mathbb{P}_\nu^{\mathcal{F}_\tau},\mathbb{P}_{\nu'}^{\mathcal{F}_\tau})$。
> 5. $A=\{\tau<\infty,\ \psi=1\}\in\mathcal{F}_\tau$ に**データ処理不等式**:$\mathrm{KL}\ge\mathrm{kl}(\mathbb{P}_\nu(A),\mathbb{P}_{\nu'}(A))$。
> 6. $\delta$-正当性:$\mathbb{P}_\nu(A)\ge1-\delta$、$\nu'\in\mathrm{Alt}(\nu)$ なら $\mathbb{P}_{\nu'}(A)\le\delta$。
> 7. $\mathrm{kl}$ の単調性より $\ge\mathrm{kl}(1-\delta,\delta)=\mathrm{kl}(\delta,1-\delta)\ge\log\frac{1}{2.4\delta}$。
> 8. よって全ての $\nu'\in\mathrm{Alt}(\nu)$ で $\sum_a\mathbb{E}_\nu[N_a(\tau)]\mathrm{KL}(\nu_a,\nu'_a)\ge\mathrm{kl}(\delta,1-\delta)$。
> 9. $w_a:=\mathbb{E}_\nu[N_a(\tau)]/\mathbb{E}_\nu[\tau]\in\Sigma_K$ で割る。
> 10. $\nu'$ について $\inf$ を取る:$\inf_{\nu'}\sum_aw_a\mathrm{KL}\ge\mathrm{kl}(\delta,1-\delta)/\mathbb{E}_\nu[\tau]$。
> 11. $w\in\Sigma_K$ なので左辺 $\le\sup_w\inf_{\nu'}=T^*(\nu)^{-1}$。
> 12. $\therefore\ \mathbb{E}_\nu[\tau]\ge T^*(\nu)\,\mathrm{kl}(\delta,1-\delta)$。$\blacksquare$

---

## 13.7 何が起きているのか

### 13.7.1 下界の正体は 2 人ゲームの値【直感 + 厳密】

$$T^*(\nu)^{-1}=\sup_{w\in\Sigma_K}\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a)$$

- $\sup_w$: **こちら(アルゴリズム)の手番**。「どの腕にどれだけリソースを割くか」を選ぶ。
- $\inf_{\nu'}$: **敵(自然)の手番**。「最も紛らわしい偽の世界」を選ぶ。
- 目的関数 $\sum_a w_a\mathrm{KL}(\nu_a,\nu'_a)$: 「単位時間あたりに蓄積される識別情報」。

**下界は確率論というより最適化・ゲーム論の対象です。**第14講でこの構造(凹凸性、鞍点、Sion のミニマックス定理)を詳しく扱います。

### 13.7.2 下界がアルゴリズムを設計する【直感】

Step 5 の不等式
$$\inf_{\nu'}\sum_a w_a\mathrm{KL}(\nu_a,\nu'_a)\ \ge\ \frac{\mathrm{kl}(\delta,1-\delta)}{\mathbb{E}_\nu[\tau]}$$
で等号が成り立つのは、$w$ が $\sup$ を達成するとき、すなわち
$$w=w^*(\nu):=\operatorname*{arg\,max}_{w\in\Sigma_K}\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\mathrm{KL}(\nu_a,\nu'_a)$$
のときです。

**つまり、下界に到達するアルゴリズムは、腕 $a$ を割合 $w_a^*(\nu)$ で引かねばならない。**

> **これがこの分野で最も美しい点です。** 下界の証明の途中に出てきただけの最適化問題の解 $w^*(\nu)$ が、そのまま最適アルゴリズムの設計図になっている。累積リグレット最小化には、この性質はありません(下界の $2/\Delta_a^2$ は「引きすぎるな」という上限であって、設計図ではない)。
>
> **Track-and-Stop(第15講)は、$\nu$ を知らないので $\hat\nu(t)$ から $w^*(\hat\nu(t))$ を計算し、それを追いかける(track する)だけのアルゴリズムです。**

### 13.7.3 L&S の観察(下界の性質)【検証:PDF】

L&S §33.2.1 に次の注意があります【検証:PDF】(印刷ページ p.408 = PDF 417 ページ。L&S の (a)〜(d) をそのまま対応させています)。

**(a)** $\mathcal{E}=\mathcal{E}_\mathcal{N}^K(1)$ で最適腕が一意なら、$\sup$ を達成する $w^*(\nu)$ は**一意**。指数型分布族の非構造クラスでも一意性は保たれる。
**(b)** Step 5 の不等式が最もタイトになるのは $\mathbb{E}[N_a(\tau)]/\mathbb{E}[\tau]=w_a^*(\nu)$ のとき。**すなわち、下界に一致するには $\delta\to0$ で腕を $w^*$ の割合で引くしかない。**
**(c)** $K=2$、単位分散ガウスなら $T^*(\nu)=8/\Delta^2$、$w^*=(1/2,1/2)$。
**(d)** $K=2$、分散 $\sigma_1^2,\sigma_2^2$ なら $T^*(\nu)=\dfrac{2(\sigma_1+\sigma_2)^2}{\Delta^2}$。

(c)(d) は第14講で導出し、数値で確認します。

---

## 13.8 この下界の限界【厳密な指摘】

**定理 13.6 は $\delta\to0$ の主張ではありません**(任意の $\delta<1/2$ で成り立つ)。しかし、次の意味で「漸近的」です。

1. **上界が一致するのは $\delta\to0$ でのみ。** 第15講の Track-and-Stop は $\lim_{\delta\to0}\mathbb{E}[\tau]/\log(1/\delta)=T^*(\nu)$ を達成しますが、有限の $\delta$ では一致しません。第12講 §12.5 の実測では $\delta=10^{-6}$ でまだ $1.17$ 倍。
2. **$\nu$ ごとの下界(instance-dependent)。** ミニマックス的な主張ではありません。
3. **最適腕が一意でない $\nu$ は扱えない。** $T^*(\nu)=\infty$ になります(第4講 §4.4 の注意)。この場合の理論は近年進展中(第18講)。
4. **固定予算設定には移植できない。** 第17講で理由を述べます。

> **1 が第18講の主題(非漸近・moderate confidence)、4 が第17講の主題です。この 2 つが現在の主戦場。**

---

## 13.9 まとめ

- 下界の証明は 5 ステップ。**測度論を使うのは Step 1(発散分解の停止時刻版)だけ。**
- Step 2 = データ処理不等式、Step 3 = $\delta$-正当性の書き換え、Step 4-5 = 代数と最適化。
- 主定理:$\mathbb{E}_\nu[\tau]\ge T^*(\nu)\,\mathrm{kl}(\delta,1-\delta)\ge T^*(\nu)\log\frac{1}{2.4\delta}$。
- L&S 版(Bretagnolle–Huber)は $\log\frac{1}{4\delta}$。DPI 版の方が真に強い。
- $T^*(\nu)^{-1}=\sup_w\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_aw_a\mathrm{KL}(\nu_a,\nu'_a)$ は **2 人ゲームの値**。
- **$\sup$ を達成する $w^*(\nu)$ が最適アルゴリズムの設計図になる。**

---

## 演習(詳細は [B-exercises.md](B-exercises.md) §13)

- **★13-1(最重要)** §13.6 の 12 行を、何も見ずに紙に書け。書けなかった行だけ本文に戻ること。これを 3 回繰り返す。
- **★13-2** 補題 13.4 で $\mathrm{kl}(x,y)$ の単調性を使った箇所を、偏微分を計算して正当化せよ。
- **★13-3** 定理 13.7(L&S 版)を、Bretagnolle–Huber から自分で導け。$E$ の取り方が定理 13.6 の $A$ と違う理由を説明せよ。
- **★13-4** $\mathbb{E}_\nu[\tau]=\infty$ の場合と $T^*(\nu)=\infty$ の場合の扱いを、証明の中で明示的に書き下せ。
- **★13-5** 仮定 13.2 (A1) が壊れる例(平均 $0$ を許すベルヌーイ)で、定理 13.6 の主張がどう変わるかを検討せよ。
- **☆13-6** $\delta\ge1/2$ のとき定理 13.6 は何を主張するか。$\mathrm{kl}(\delta,1-\delta)$ の符号を調べて答えよ。
- **☆13-7** $\psi$ が外部乱数に依存してよい場合(ランダム化された選択規則)、定理 13.6 は成り立つか。標本空間を拡張して確認せよ。

---

[← 前の講](12-bandit-formulation.md) ｜ [次の講: 特性時間と最適配分 →](14-characteristic-time.md)
