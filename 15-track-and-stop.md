# 第15講 — Track-and-Stop

[← 前の講](14-characteristic-time.md) ｜ [README](README.md) ｜ [次の講 →](16-other-algorithms.md)

---

## この講の目標

1. Track-and-Stop(サンプリング則 + 停止則 + 選択規則)を厳密に定義する。
2. **Chernoff 停止則の $\delta$-正当性を完全に証明する**(ガウスの場合、L&S Lemma 33.7 の道筋)。
3. **D-tracking / C-tracking** を定義し、強制探索の役割を理解する。
4. 漸近最適性 $\lim_{\delta\to0}\mathbb{E}[\tau_\delta]/\log(1/\delta)=T^*(\nu)$ の証明の骨格を追う。
5. 「下界がアルゴリズムを設計する」の完成形を見る。

---

## 15.1 アルゴリズム

### 定義 15.1(Track-and-Stop)【厳密】

環境クラス $\mathcal{E}=\mathcal{D}^K$(1 パラメータ指数型分布族の非構造クラス)、信頼水準 $\delta$、閾値関数 $\beta:\mathbb{N}\times(0,1)\to\mathbb{R}$ を入力とする。

**記法**: $\hat\mu(t)=(\hat\mu_1(t),\dots,\hat\mu_K(t))$ を経験平均、$\hat\nu(t)$ を対応するプラグイン環境、$\hat a_t=\arg\max_a\hat\mu_a(t)$。

**(1) 停止統計量(Chernoff 統計量)**
$$Z(t):=\inf_{\nu'\in\mathrm{Alt}(\hat\nu(t))}\sum_{a=1}^K N_a(t)\,d\big(\hat\mu_a(t),\mu'_a\big)\ \overset{\text{命題 14.3}}{=}\ \min_{b\ne\hat a_t}\Big[N_{\hat a_t}(t)\,d\big(\hat\mu_{\hat a_t}(t),\hat m_b\big)+N_b(t)\,d\big(\hat\mu_b(t),\hat m_b\big)\Big],$$
$$\hat m_b:=\frac{N_{\hat a_t}(t)\hat\mu_{\hat a_t}(t)+N_b(t)\hat\mu_b(t)}{N_{\hat a_t}(t)+N_b(t)}.$$
($\hat\mu$ に同着の最適腕があるときは $Z(t)=0$ とする。)

**(2) 停止則**
$$\tau_\delta:=\min\{t\ge K\ :\ Z(t)>\beta(t,\delta)\}.$$

**(3) 選択規則** $\psi:=\hat a_{\tau_\delta}$。

**(4) サンプリング則(D-tracking)** 最初に各腕を 1 回ずつ引く。$t\ge K$ で
$$U_t:=\Big\{a\in[K]\ :\ N_a(t)<\sqrt{t}-\tfrac{K}{2}\Big\}$$
とおき、
$$A_{t+1}=\begin{cases}\displaystyle\operatorname*{arg\,min}_{a\in U_t}N_a(t) & (U_t\ne\emptyset)\quad\text{【強制探索】}\\[2mm] \displaystyle\operatorname*{arg\,max}_{a\in[K]}\big(t\,w_a^*(\hat\nu(t))-N_a(t)\big) & (U_t=\emptyset)\quad\text{【tracking】}\end{cases}$$

> L&S Algorithm 21 も本質的に同じです(強制探索の閾値の形が少し違う)。【検証:PDF】(L&S p.409–410)
> GK16 では上の形を **D-tracking**(direct tracking)と呼びます。

### 15.1.1 各部品の役割

| 部品 | 何をしているか | どの講の帰結か |
|---|---|---|
| $Z(t)$ | 「$\hat a_t$ が最適」の一般化尤度比 | 第11講 命題 11.9 |
| $\beta(t,\delta)$ | 時間一様性を買う閾値 | 第8・9講 |
| tracking | 下界の $w^*(\nu)$ を経験版で追いかける | 第13・14講 |
| 強制探索 | $\hat\mu(t)\to\mu$ を保証する | 本講 §15.4 |

> **停止則と選択規則は $\delta$-正当性(第15.2節)を、サンプリング則は効率(第15.4節)を担当します。両者は独立に設計・解析できる。**これが Track-and-Stop の設計思想で、命題 8.6(信頼列は任意の停止時刻で有効)がその根拠です。

---

## 15.2 $\delta$-正当性の証明

**ガウス(単位分散)の場合に完全に証明します。**一般の指数型分布族でも同じ構造ですが、集中不等式が族に依存します。

### 15.2.1 決定的な包含関係

### 補題 15.2【厳密】

$\mathcal{E}=\mathcal{E}_\mathcal{N}^K(1)$、$\nu\in\mathcal{E}$ が一意な最適腕 $a^*=a^*(\nu)$ を持つとする。任意の $t$ について
$$\big\{Z(t)>\beta(t,\delta)\big\}\cap\big\{\hat a_t\ne a^*\big\}\ \subset\ \left\{\sum_{a=1}^K\frac{N_a(t)}{2}\big(\hat\mu_a(t)-\mu_a\big)^2\ >\ \beta(t,\delta)\right\}.$$

**証明.** $\hat a_t\ne a^*$ とする。このとき $\nu$ の最適腕 $a^*$ は $\hat\nu(t)$ の最適腕ではないので、定義 13.1 より
$$\nu\in\mathrm{Alt}\big(\hat\nu(t)\big).$$
$Z(t)$ は $\mathrm{Alt}(\hat\nu(t))$ 上の下限なので、特に $\nu'=\nu$ を代入した値以下:
$$Z(t)\ \le\ \sum_{a=1}^K N_a(t)\,d\big(\hat\mu_a(t),\mu_a\big)=\sum_{a=1}^K\frac{N_a(t)}{2}\big(\hat\mu_a(t)-\mu_a\big)^2$$
(ガウス単位分散で $d(x,y)=(x-y)^2/2$)。$Z(t)>\beta(t,\delta)$ と合わせる。$\square$

> **この 3 行が $\delta$-正当性の全部です。**「間違えているなら、真の環境は対立仮説の中にある。だから統計量は『真の環境からの距離』以下。統計量が大きいのに間違えているなら、真の環境から遠く外れている」。
> 残りは「真の環境から遠く外れる確率」を集中不等式で抑えるだけ。

### 系 15.3【厳密】

$$\mathbb{P}_{\nu\pi}\big(\tau_\delta<\infty,\ \psi\ne a^*\big)\ \le\ \mathbb{P}_{\nu\pi}\left(\exists t\ge K:\ \sum_{a=1}^K\frac{N_a(t)}{2}\big(\hat\mu_a(t)-\mu_a\big)^2>\beta(t,\delta)\right).$$

**証明.** $\{\tau_\delta<\infty,\psi\ne a^*\}=\{\tau_\delta<\infty,\ \hat a_{\tau_\delta}\ne a^*\}\subset\bigcup_{t\ge K}\big(\{Z(t)>\beta(t,\delta)\}\cap\{\hat a_t\ne a^*\}\big)$ に補題 15.2。$\square$

### 15.2.2 閾値の構成

reward stack model(第3講 §3.3.3)を使う。腕 $a$ の $s$ 番目のサンプルまでの経験平均を $\hat\mu_{a,s}$ と書くと、$(\hat\mu_{a,s})_s$ は $\mathcal{N}(\mu_a,1)$ の i.i.d. 列から作られ、**腕ごとに独立**。$\hat\mu_a(t)=\hat\mu_{a,N_a(t)}$。
$$S_{a,s}:=\frac{s}{2}\big(\hat\mu_{a,s}-\mu_a\big)^2$$
とおくと、示すべきは
$$\mathbb{P}\left(\exists t:\ \sum_a S_{a,N_a(t)}>\beta(t,\delta)\right)\le\delta.$$

### 補題 15.4(1 腕の時間一様境界 = L&S Lemma 33.8)【厳密】

$g(s):=\log(s(s+1))$ とおくと、任意の $\delta'\in(0,1)$ について
$$\mathbb{P}\big(\exists s\in\mathbb{N}_+:\ S_{a,s}\ \ge\ g(s)+\log(1/\delta')\big)\ \le\ \delta'.$$

**証明.** 第9講 補題 9.12 と同じ。$s$ を固定すると $\sqrt s(\hat\mu_{a,s}-\mu_a)\sim\mathcal{N}(0,1)$ なので、$u>0$ で
$$\mathbb{P}(S_{a,s}\ge u)=\mathbb{P}\big(|\mathcal{N}(0,1)|\ge\sqrt{2u}\big)\le e^{-u}$$
(標準正規の両側裾に対する評価 $\mathbb{P}(|Z|\ge z)\le e^{-z^2/2}$ を $z=\sqrt{2u}$ で使う)。$u=g(s)+\log(1/\delta')$ とすると右辺は $\dfrac{\delta'}{s(s+1)}$。union bound と $\sum_{s\ge1}\frac{1}{s(s+1)}=1$。$\square$

> **注**: ここで使った $\mathbb{P}(|Z|\ge z)\le e^{-z^2/2}$ は、標準正規に対して $z\ge0$ で成り立ちます(実際 $\mathbb{P}(|Z|\ge z)\le e^{-z^2/2}$ は $z\ge0$ で正しい。$z=0$ で $1\le1$、$z$ が大きいと $\mathbb{P}(|Z|\ge z)\approx\sqrt{2/\pi}z^{-1}e^{-z^2/2}$)。**素朴な union bound($2e^{-u}$)より $2$ 倍だけ得しています。**この種の定数は L&S Corollary 5.5 で丁寧に扱われています。

### 補題 15.5($K$ 腕を束ねる = L&S Proposition 33.9)【証明省略, 検証:PDF】

$g:\mathbb{N}_+\to(0,\infty)$ を増加関数とし、各 $a\in[K]$ について補題 15.4 の性質を持つ**独立な**列 $(S_{a,s})_s$ を考える。$x\ge K$ に対し
$$\mathbb{P}\left(\exists s\in\mathbb{N}_+^K:\ \sum_{a=1}^K S_{a,s_a}\ \ge\ K\,g\!\left(\sum_a s_a\right)+x\right)\ \le\ \left(\frac{x}{K}\right)^Ke^{K-x}=:f(x).$$

> 第9講 命題 9.13 と同じ。出典: L&S Proposition 33.9【検証:PDF】(印刷ページ p.412 = PDF 421 ページ。内側の引数が $\sum_as_a$ であること、右辺が $(x/k)^k\exp(k-x)$ であることを原文で確認済み)。証明の骨格と、L&S 原文が条件を「$x\ge0$」と書いている誤りについては第9講の注を参照(正しくは $x\ge K$)。

### 定理 15.6(Chernoff 停止則の $\delta$-正当性)【厳密】

$f(x)=e^{K-x}(x/K)^K$($x\ge K$)とし
$$\beta(t,\delta):=K\log(t^2+t)+f^{-1}(\delta)$$
とする。このとき Track-and-Stop は信頼水準 $\delta$ で正当。すなわち
$$\mathbb{P}_{\nu\pi}\big(\tau_\delta<\infty,\ \psi\ne a^*(\nu)\big)\ \le\ \delta.$$

**証明.** $g(s)=\log(s(s+1))$ は $\mathbb{N}_+$ 上で増加(補題 15.5 が要求するのはこれだけ。正値性は不要 — 第9講の注を参照)。各時刻 $t\ge K$ で $\sum_aN_a(t)=t$ かつ $N_a(t)\ge1$ なので、補題 15.5 を $s_a=N_a(t)$ に適用すると
$$K\,g\!\left(\sum_a N_a(t)\right)=K\,g(t)=K\log\big(t(t+1)\big)=K\log(t^2+t),$$
すなわち
$$\mathbb{P}\left(\exists t\ge K:\ \sum_a S_{a,N_a(t)}\ \ge\ K\log(t^2+t)+x\right)\ \le\ f(x).$$
$x=f^{-1}(\delta)$ と取れば右辺は $\delta$。系 15.3 と合わせて結論。$\square$

> **なぜ「$\exists t$」を「$\exists s\in\mathbb{N}_+^K$」で抑えられるのか**: 各時刻 $t$ で $(N_1(t),\dots,N_K(t))$ は $\mathbb{N}_+^K$ の 1 点であり、$\sum_aN_a(t)=t$。したがって
> $$\bigcup_{t\ge K}\left\{\textstyle\sum_aS_{a,N_a(t)}\ge Kg(t)+x\right\}\ \subset\ \left\{\exists s\in\mathbb{N}_+^K:\ \textstyle\sum_aS_{a,s_a}\ge Kg(\sum_as_a)+x\right\}.$$
> **$(N_a(t))_a$ がランダムであることは問題になりません。**補題 15.5 が「すべての $s$ について同時に」を主張しているからです。**これが時間一様性(第8講)の使い方の典型例です。**

> これが L&S Lemma 33.7 です。【検証:PDF】(L&S p.410)
>
> **$f$ の性質**【検証:数値】(`check_threshold_function`):$f$ は $[K,\infty)$ で狭義減少、$f(K)=1$、$f(\infty)=0$。逆関数は Newton 法で高精度に計算できる(相対誤差 $10^{-15}$)。漸近的に
> $$f^{-1}(\delta)=\log\frac1\delta+K\log\frac{\log(1/\delta)}{K}+K+O\!\left(\frac{K^2\log\log(1/\delta)}{\log(1/\delta)}\right).$$
> 数値検証で $\delta=10^{-30}$、$K=4$ のとき厳密 $85.318$ vs 展開 $84.473$(誤差 $0.845$)。

### 15.2.3 閾値の代替【要出典確認】

実務では次がよく使われます。

| 閾値 | 出典 | 備考 |
|---|---|---|
| $\beta(t,\delta)=\log\frac{2t(K-1)}{\delta}$ | Garivier–Kaufmann (COLT 2016)、ベルヌーイ | 【要出典確認】広く引用されるが原論文で確認すること |
| $\beta(t,\delta)=\log\frac{1+\log t}{\delta}$ | 実験で使われる簡略形 | **理論保証がない。**`bai_demo.py` はこれを使っている |
| Kaufmann–Koolen (JMLR 2021) の混合境界 | BAI 用に最適化 | 【要出典確認】現在の最良 |

> **`bai_demo.py` の閾値 $\log\frac{1+\log t}{\delta}$ には $\delta$-正当性の証明がありません。**実験的には $\delta$ を守ることが多い(Chernoff 統計量が $K-1$ 個の対立仮説の $\min$ を取っていて保守的なため)のですが、**理論的な主張には使えません。**論文に書くときは定理 15.6 か GK2016 の閾値を使ってください。

---

## 15.3 停止性($\tau_\delta<\infty$)

$\delta$-正当性だけでは足りません。「止まる」ことも要ります。

### 命題 15.7【証明の骨格】

$\nu$ が一意な最適腕を持ち、D-tracking を使うなら $\mathbb{P}_{\nu\pi}(\tau_\delta<\infty)=1$、さらに $\mathbb{E}_{\nu\pi}[\tau_\delta]<\infty$。

**骨格.**
1. **強制探索**により、すべての腕が $N_a(t)\ge\sqrt t-K/2-1$ 回以上引かれる。したがって $N_a(t)\to\infty$ a.s.。
2. 強大数の法則より $\hat\mu_a(t)\to\mu_a$ a.s.(各腕)。
3. $Z(t)$ の下からの評価:$\hat a_t=a^*$ かつ $\hat\mu(t)\approx\mu$ なら
$$Z(t)=\min_{b\ne a^*}\Big[N_{a^*}(t)d(\hat\mu_{a^*},\hat m_b)+N_b(t)d(\hat\mu_b,\hat m_b)\Big]\ \gtrsim\ \min_{b}\frac{N_{a^*}(t)N_b(t)}{N_{a^*}(t)+N_b(t)}\cdot\frac{\Delta_b^2}{2}\ \gtrsim\ c\sqrt t$$
(強制探索の保証 $N_a(t)\gtrsim\sqrt t$ だけを使っても $Z(t)\gtrsim\sqrt t$)。
4. 一方 $\beta(t,\delta)=K\log(t^2+t)+f^{-1}(\delta)=O(\log t)$。$\sqrt t$ が $\log t$ を追い越すので、有限時刻で $Z(t)>\beta(t,\delta)$ となる。

**これは骨格です。**厳密には「$\hat\mu(t)\to\mu$ の収束が十分速いこと」を大偏差の評価で押さえ、$\mathbb{E}[\tau_\delta]<\infty$ まで言う必要があります。完全な証明は GK2016 の Proposition 13 相当。【要出典確認】

> **要点は「強制探索だけで停止性が出る」**ことです。tracking の性能とは無関係に、$\sqrt t$ 対 $\log t$ の競争で勝てる。**停止性と効率が分離されている**のはここでも同じです。

---

## 15.4 サンプリング則と漸近最適性

### 15.4.1 なぜ tracking なのか

第13講 §13.7.2 の帰結:下界に一致するには
$$\frac{N_a(t)}{t}\ \longrightarrow\ w_a^*(\nu)$$
が必要。$\nu$ は未知なので $\hat\nu(t)$ で代用する。**問題は 2 つ。**

1. **$\hat\nu(t)\to\nu$ の保証がない。**サンプリングが偏ると、ある腕がほとんど引かれず $\hat\mu_a(t)$ が真値に収束しない。→ **強制探索**で解決。
2. **$w^*(\cdot)$ の連続性。**$\hat\nu(t)$ に同着があると $w^*(\hat\nu(t))$ が定義できない/不連続。→ 強制探索 + 一意性の仮定で、有限時刻以降は解消。

### 定義 15.8(2 種類の tracking)【厳密】

**D-tracking**(direct):定義 15.1 の通り。$\arg\max_a\big(t\,w_a^*(\hat\nu(t))-N_a(t)\big)$ を引く。

**C-tracking**(cumulative):$\varepsilon_t:=\frac{1}{2}(K^2+t)^{-1/2}$ とし、$w^*(\hat\nu(s))$ を
$$\Sigma_K^{\varepsilon}:=\{w\in\Sigma_K : w_a\ge\varepsilon\ \forall a\}$$
に $L^\infty$ 射影したものを $\tilde w(s)$ とする。そして
$$A_{t+1}=\operatorname*{arg\,max}_{a}\left(\sum_{s=0}^{t}\tilde w_a(s)-N_a(t)\right).$$

> **違い**: D-tracking は「今の推定に基づく目標」を追う。C-tracking は「これまでの目標の累積」を追う。C-tracking の方が解析しやすく(累積の追跡誤差が $O(K)$ で抑えられる)、強制探索が射影に組み込まれています。GK2016 は両方を扱っています。

### 補題 15.9(tracking の誤差)【証明省略】

C-tracking では、すべての $t$ と $a$ について
$$\left|N_a(t)-\sum_{s=0}^{t-1}\tilde w_a(s)\right|\ \le\ K\ \ (\text{定数}).$$

> 出典: GK2016 Lemma 7 相当【要出典確認】。証明は「$\arg\max$ で選ぶと、遅れている腕が必ず選ばれる」という組合せ的な議論(いわゆる apportionment / Frame–Stewart 型の補題)。

### 定理 15.10(漸近最適性)【証明の骨格, 検証:PDF】

$\mathcal{E}=\mathcal{E}_\mathcal{N}^K(1)$、$\nu\in\mathcal{E}$ が一意な最適腕を持つとする。定理 15.6 の閾値を使った Track-and-Stop について
$$\lim_{\delta\to0}\frac{\mathbb{E}_{\nu\pi}[\tau_\delta]}{\log(1/\delta)}=T^*(\nu).$$

> L&S Theorem 33.6 【検証:PDF】(p.410)。GK2016 Theorem 14 に対応。

**証明の骨格.**

**下界側**は第13講 定理 13.6 から($\mathrm{kl}(\delta,1-\delta)/\log(1/\delta)\to1$)。

**上界側**:

1. **($\hat\nu\to\nu$)** 強制探索より $N_a(t)\ge\sqrt t-K/2-1$、大数の法則より $\hat\mu(t)\to\mu$ a.s.。
2. **($\hat w\to w^*$)** $\nu$ が一意な最適腕を持つとき、$\nu'\mapsto w^*(\nu')$ は $\nu$ の近傍で連続(第14講 定理 14.9 の解が一意で、暗黙関数定理的な議論が通る)。よって $w^*(\hat\nu(t))\to w^*(\nu)$ a.s.。
3. **(tracking)** 補題 15.9(または D-tracking の対応する補題)より $N_a(t)/t\to w_a^*(\nu)$ a.s.。
4. **($Z(t)$ の増大率)** $(\hat\mu(t),N(t)/t)\to(\mu,w^*(\nu))$ と $Z(t)=t\cdot\inf_{\nu'\in\mathrm{Alt}(\hat\nu(t))}\sum_a\frac{N_a(t)}{t}d(\hat\mu_a(t),\mu'_a)$、および $\inf$ の連続性から
$$\frac{Z(t)}{t}\ \longrightarrow\ \inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a^*(\nu)\,d(\mu_a,\mu'_a)=\frac{1}{T^*(\nu)}\quad\text{a.s.}$$
5. **(停止時刻)** $\tau_\delta=\min\{t:Z(t)>\beta(t,\delta)\}$、$\beta(t,\delta)=f^{-1}(\delta)+O(\log t)$、$f^{-1}(\delta)\sim\log(1/\delta)$。4 より $Z(t)\approx t/T^*(\nu)$ なので、$t/T^*(\nu)\approx\log(1/\delta)$ すなわち $\tau_\delta\approx T^*(\nu)\log(1/\delta)$。
6. **(期待値への持ち上げ)** a.s. の主張を $\mathbb{E}[\tau_\delta]$ の主張にするには一様可積分性が要る。GK2016 は $\mathbb{P}(\tau_\delta>t)$ の指数的な減衰を示して処理している。

**5 と 6 が厳密でない部分です。**5 は「$Z(t)/t$ の収束と $\beta$ の増大の交点」という直感で、実際には $\limsup$ と $\liminf$ を分けて評価する必要があります。6 は技術的ですが自明ではありません。**完全な証明は GK2016 §5 を参照してください。**【要出典確認】

---

## 15.5 実測との突き合わせ【検証:数値】

`research/code/bai_demo.py`(ベルヌーイ 4 腕 $\mu=(0.60,0.45,0.35,0.25)$、$T^*=102.28$)。

| $\delta$ | $\mathbb{E}[\tau]$ | $\mathbb{E}[\tau]/\log(1/\delta)$ | $T^*$ との比 |
|---:|---:|---:|---:|
| $10^{-1}$ | $412\pm27$ | 179 | 1.75 |
| $10^{-2}$ | $637\pm32$ | 138 | 1.35 |
| $10^{-3}$ | $950\pm38$ | 138 | 1.35 |
| $10^{-4}$ | $1151\pm46$ | 125 | 1.22 |
| $10^{-5}$ | $1416\pm49$ | 123 | 1.20 |
| $10^{-6}$ | $1665\pm55$ | **120** | **1.17** |

$w^*=(0.439,0.425,0.094,0.042)$ に $N_a(t)/t$ が $t\approx500$ で収束することも確認されています。

### 15.5.1 隙間の正体を数値で分解する【厳密 + 検証:数値】

**この実測は `bai_demo.py` の閾値、すなわち $\beta(t,\delta)=\log\frac{1+\log t}{\delta}$(§15.2.3)で走らせたものです。**定理 15.6 の閾値ではありません。この点を押さえると隙間がきれいに説明できます。

$Z(t)\approx t/T^*(\nu)$(定理 15.10 の骨格 4)なので、停止条件 $Z(\tau)\approx\beta(\tau,\delta)$ から
$$\frac{\mathbb{E}[\tau]}{T^*\log(1/\delta)}\ \approx\ \frac{\beta(\tau,\delta)}{\log(1/\delta)}\ =\ 1+\frac{\log(1+\log\tau)}{\log(1/\delta)}.$$

| $\delta$ | 実測 $\mathbb{E}[\tau]$ | 実測比 $\frac{\mathbb{E}[\tau]}{T^*\log(1/\delta)}$ | 予測 $1+\frac{\log(1+\log\tau)}{\log(1/\delta)}$ |
|---:|---:|---:|---:|
| $10^{-1}$ | 412 | 1.75 | 1.85 |
| $10^{-2}$ | 637 | 1.35 | 1.44 |
| $10^{-3}$ | 950 | 1.35 | 1.30 |
| $10^{-4}$ | 1151 | 1.22 | 1.23 |
| $10^{-5}$ | 1416 | 1.20 | 1.18 |
| $10^{-6}$ | 1665 | 1.17 | 1.15 |

**予測と実測が数 % で合っています。隙間は事実上すべて閾値です。**

**ただし、この閾値には $\delta$-正当性の証明がありません(§15.2.3)。**理論保証のある定理 15.6 の閾値 $\beta(t,\delta)=K\log(t^2+t)+f^{-1}(\delta)$ を使うと、同じ不動点計算($\tau=T^*\beta(\tau,\delta)$)で

| $\delta$ | $f^{-1}(\delta)$($K=4$) | $\tau$ の不動点 | $\tau/(T^*\log\frac1\delta)$ |
|---:|---:|---:|---:|
| $10^{-1}$ | 9.95 | 約 8400 | **35.7** |
| $10^{-3}$ | 16.60 | 約 9200 | **13.0** |
| $10^{-6}$ | 25.17 | 約 10100 | **7.2** |

となり、**桁が変わります**($K\log(t^2+t)\approx2K\log t$ の項が $\delta$ に依らず効き続けるため)。

> **読み取り**:
> - $\mathbb{E}[\tau]/\log(1/\delta)$ は $T^*=102.28$ に向かって単調に降りる。**定理 15.10 と整合。**
> - **隙間の主要因は閾値**であって、tracking の精度でも $T^*$ の計算誤差でもない。上の 2 つの表がその分解です。
> - **理論保証つきの閾値で走らせると $\delta=10^{-6}$ でも $7$ 倍。**「$\delta\to0$ で漸近最適」は正しいが、$\log(1/\delta)$ が $2K\log\tau$ を圧倒するまで待つ必要があり、それは $\delta$ が天文学的に小さい領域です。**漸近最適性と実用性能の乖離は、ここに集中しています。**
> - **第18講の非漸近解析は、まさにこの隙間を詰める研究です。**Kaufmann–Koolen (2021) が閾値の $\log t$ 項を削ることに注力しているのは、この表を見れば当然の方向だと分かります。

---

## 15.6 まとめ

- Track-and-Stop = **Chernoff 停止則 + tracking サンプリング則 + 経験的最良腕の推薦**。
- **$\delta$-正当性の核は補題 15.2 の 3 行**:「間違えているなら真の環境は対立側 → 統計量は真の環境からの距離以下 → 統計量が大きいなら真の環境から外れている」。
- 閾値 $\beta(t,\delta)=K\log(t^2+t)+f^{-1}(\delta)$、$f(x)=e^{K-x}(x/K)^K$ は 補題 15.4(1 腕の時間一様境界)+ 補題 15.5($K$ 腕の束ね)から構成される。
- **停止性は強制探索だけで出る**($\sqrt t$ vs $\log t$)。正当性・停止性・効率が分離して設計できる。
- 漸近最適性 $\mathbb{E}[\tau_\delta]/\log(1/\delta)\to T^*(\nu)$。**証明の骨格は「$\hat\nu\to\nu$ → $\hat w\to w^*$ → $Z(t)/t\to1/T^*$」。**
- 実測では $\delta=10^{-6}$ でまだ $T^*$ の $1.17$ 倍。**隙間の主因は閾値**で、$1+\log(1+\log\tau)/\log(1/\delta)$ という式で数 % の精度で説明できる(§15.5.1)。しかもこの $1.17$ は**理論保証のない軽い閾値**での値で、定理 15.6 の閾値なら $7$ 倍になる。

---

## 演習(詳細は [B-exercises.md](B-exercises.md) §15)

- **★15-1(最重要)** 補題 15.2 を何も見ずに証明せよ。「$\hat a_t\ne a^*\Rightarrow\nu\in\mathrm{Alt}(\hat\nu(t))$」の一行がなぜ成り立つかを説明すること。
- **★15-2** 定理 15.6 の証明で、「時刻 $t$ に関する $\exists$」を「$s\in\mathbb{N}_+^K$ に関する $\exists$」に置き換える箇所を明示し、$(N_a(t))_a$ がランダムでも問題にならない理由を書け。また、補題 15.5 の証明で $g$ の**増加性**をどこで使ったか示し、**正値性は不要である**ことを確認せよ。
- **★15-3** 補題 15.4 を、標準正規の裾の評価 $\mathbb{P}(|Z|\ge z)\le e^{-z^2/2}$ から導け。この裾評価自体を証明せよ。
- **★15-4** `bai_demo.py` の閾値 $\log\frac{1+\log t}{\delta}$ と 定理 15.6 の閾値 $K\log(t^2+t)+f^{-1}(\delta)$ を、$K=4$、$\delta=0.01$、$t=100,1000,10000$ で数値比較せよ。前者は何倍小さいか。
- **★15-5** 定理 15.10 の証明の骨格 1〜5 を、それぞれどの講の結果に依存しているか対応付けよ。
- **☆15-6** D-tracking の強制探索条件 $N_a(t)<\sqrt t-K/2$ の $\sqrt t$ を $t^{1/4}$ に変えると、命題 15.7 の議論はどうなるか。$t^{1/4}$ 対 $\log t$ でもまだ勝てることを確認せよ。
- **☆15-7** 補題 15.9(C-tracking の追跡誤差 $\le K$)を、$K=2$ の場合に証明せよ。

---

[← 前の講](14-characteristic-time.md) ｜ [次の講: その他のアルゴリズム →](16-other-algorithms.md)
