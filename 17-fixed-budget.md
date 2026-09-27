# 第17講 — 固定予算設定と「複雑度の非存在」

[← 前の講](16-other-algorithms.md) ｜ [README](README.md) ｜ [次の講 →](18-frontier.md)

---

## この講の目標

1. 固定予算設定の主要アルゴリズム(一様探索、逐次棄却、逐次半減)と、その保証を述べる。
2. 複雑度 $H_1,H_2$ を定義し、$H_2\le H_1\le(1+\log K)H_2$ を確認する。
3. **固定信頼度の下界の論法が、固定予算ではなぜ効かないのか**を、証明のどの行が壊れるかまで特定する。
4. **Degenne (COLT 2023) の「複雑度の非存在」定理**の主張を正確に述べ、その意味を理解する。
5. 2022〜2026 年の進展を整理する。

> **この講は「答えのない場所」の紹介です。** 第13〜15講で見た固定信頼度の美しい理論が、設定を少し変えるだけで崩れる。**現在の主戦場の 1 つです。**

---

## 17.1 設定と複雑度

### 定義 17.1(復習)【厳密】

ホライズン $n$ が与えられ、方策 $\pi=(\pi_t)_{t=1}^{n+1}$($\pi_{n+1}$ が推薦)。誤り確率
$$e_n(\pi,\nu):=\mathbb{P}_{\nu\pi}\big(A_{n+1}\notin a^*(\nu)\big)$$
を最小化する。

### 定義 17.2(ギャップベース複雑度)【厳密, 検証:PDF】

腕を $\mu_1\ge\mu_2\ge\cdots\ge\mu_K$ と並べ替えて $\Delta_i=\mu_1-\mu_i$ とすると
$$H_1(\mu):=\sum_{i=1}^K\min\left\{\frac{1}{\Delta_i^2},\ \frac{1}{\Delta_{\min}^2}\right\},\qquad H_2(\mu):=\max_{i:\Delta_i>0}\frac{i}{\Delta_i^2}.$$

> **$i=1$ の扱いに注意。**最適腕では $\Delta_1=0$ なので $1/\Delta_1^2=\infty$ ですが、**$H_1$ の $\min$ がちょうどこれを $1/\Delta_{\min}^2$ に置き換える役目を果たします**(L&S 式 (33.9) と同じ)。$H_2$ の方は $\max_{i:\Delta_i>0}$ で $i=1$ を除いているので問題になりません。**「$\Delta_1:=\Delta_2$ と規約する」書き方でも数値は変わりません**が($\Delta_{\min}=\Delta_2$ なので)、L&S は規約を置かず $\min$ に仕事をさせています。

### 命題 17.3【厳密, 検証:PDF, 検証:数値】

$$H_2(\mu)\ \le\ H_1(\mu)\ \le\ (1+\log K)\,H_2(\mu),$$
両方の不等式は本質的にタイト。

> L&S 式 (33.9)【検証:PDF】(p.413)。
> **【検証:数値】** `check_H1_H2`:ランダムな $K\in[2,11]$、ランダムなギャップで $20{,}000$ 例を検査。反例 $0$ 件。$H_1/((1+\log K)H_2)$ の最大は $0.68$。

**$H_2\le H_1$ の証明.** $i^*\ (\ge2)$ を $H_2$ の最大値を与える添字とする。$\Delta_2\le\cdots\le\Delta_{i^*}$ より $j=2,\dots,i^*$ について $1/\Delta_j^2\ge1/\Delta_{i^*}^2$。また $H_1$ の $i=1$ の項は $1/\Delta_{\min}^2=1/\Delta_2^2\ge1/\Delta_{i^*}^2$。合わせて
$$H_1\ \ge\ \underbrace{\frac{1}{\Delta_2^2}}_{i=1\ \text{の項}}+\sum_{j=2}^{i^*}\frac{1}{\Delta_j^2}\ \ge\ \frac{i^*}{\Delta_{i^*}^2}\ =\ H_2.\qquad\square$$

> **$i=1$ の項が効いていることに注意。**これがないと $(i^*-1)/\Delta_{i^*}^2$ までしか出ず、$H_2$ に 1 つ足りません。

> **$H_2$ の直感**: 「$\Delta_i$ が小さい腕が $i$ 個ある」という状況の難しさ。$i$ 本の腕を区別するのに、各々 $1/\Delta_i^2$ 回ずつ必要。

---

## 17.2 アルゴリズムと上界

### 17.2.1 一様探索【厳密, 検証:PDF】

各腕を $\lfloor n/K\rfloor$ 回ずつ引き、経験平均最大の腕を推薦。**$1$-劣ガウス**($\mathcal{E}_{\mathrm{SG}}^K(1)$、ガウスに限らない)で
$$e_n\ \le\ \sum_{i:\Delta_i>0}\mathbb{P}\big(\hat\mu_i(n)\ge\hat\mu_1(n)\big)\ \le\ \sum_{i:\Delta_i>0}\exp\left(-\frac{\lfloor n/K\rfloor\,\Delta_i^2}{4}\right).$$
【検証:PDF】(L&S p.413。$\hat\mu_i-\hat\mu_1$ が $\sqrt{2/\lfloor n/K\rfloor}$-劣ガウスであることから直ちに従う)

### 17.2.2 逐次半減(Sequential Halving)【厳密, 検証:PDF】

### 定義 17.4【厳密】

$L=\lceil\log_2 K\rceil$ 段階に予算を分割する。$\mathcal{A}_1=[K]$ から始め、段階 $\ell=1,\dots,L$ で

1. $T_\ell=\left\lfloor\dfrac{n}{L|\mathcal{A}_\ell|}\right\rfloor$ 回ずつ、$\mathcal{A}_\ell$ の各腕を引く。
2. **その段階のサンプルだけ**で経験平均を計算する。
3. 上位半分($\lceil|\mathcal{A}_\ell|/2\rceil$ 本)を $\mathcal{A}_{\ell+1}$ とする。

最後に残った 1 本を推薦。

### 定理 17.5(L&S Theorem 33.10)【証明省略, 検証:PDF】

$\nu\in\mathcal{E}_{\mathrm{SG}}^K(1)$(**$1$-劣ガウス**。ガウスに限らない)、$\mu_1\ge\cdots\ge\mu_K$ とすると、逐次半減について
$$e_n\ \le\ 3\log_2(K)\ \exp\left(-\frac{n}{16\,H_2(\mu)\,\log_2(K)}\right).$$

【検証:PDF】(L&S p.412。定数 $3$ と $16$、および環境クラスが $\mathcal{E}^k_{\mathrm{SG}}(1)$ であることを原文で確認済み)。証明は L&S Exercise 33.8。

> 平均の順序 $\mu_1\ge\cdots\ge\mu_K$ の仮定は **$H_2$ をきれいに定義するためだけ**のもので、アルゴリズム自体は腕の並べ替えについて完全に対称です(L&S が明記)。

> **重要な設計ポイント**: 段階 2 で「その段階のサンプルだけ」を使うのは、**独立性を保つため**です。全サンプルを使うと、腕が残るかどうかが過去のサンプルに依存し、集中不等式が使えなくなる(第9講 §9.6.1 と同じ問題)。**サンプルを捨てることで独立性を買っている。**

### 17.2.3 逐次棄却(Successive Rejects)【要出典確認】

$K-1$ 段階で 1 本ずつ棄却する。段階 $k$ で各活性腕を $n_k$ 回引き、経験平均最小の腕を除去。$n_k$ は
$$n_k=\left\lceil\frac{1}{\overline{\log}(K)}\cdot\frac{n-K}{K+1-k}\right\rceil,\qquad \overline{\log}(K)=\frac12+\sum_{i=2}^K\frac1i$$
と設計される。

$$e_n\ \le\ \frac{K(K-1)}{2}\exp\left(-\frac{n-K}{\overline{\log}(K)\,H_2(\mu)}\right).$$

> Audibert, Bubeck, Munos, COLT 2010。**定数は原論文で確認してください。**【要出典確認】
> $\overline{\log}(K)\approx\log K$ なので、逐次半減とほぼ同じオーダー。

### 17.2.4 一様探索 vs 適応的手法【検証:PDF】

L&S に面白い指摘があります(p.413)。

- **全ギャップが等しい**($\Delta_2=\cdots=\Delta_K=\Delta$)場合:$H_2=K/\Delta^2$。指数部は逐次半減が $\Theta(n\Delta^2/(K\log K))$、一様探索が $\Theta(n\Delta^2/K)$。**一様探索の方が良い**($\log K$ 分)。ただし L&S は「**$n$ が十分大きければ**(at least if $n$ is sufficiently large)」と条件を付けています(有限 $n$ では $3\log_2K$ の前係数と $\lfloor n/K\rfloor$ の切り捨てが効くため)。
- **1 本だけ近い**($\Delta_2=\Delta$ 小、$\Delta_i=1$ for $i>2$)場合:$H_2=\Theta(1/\Delta^2)$。指数部は逐次半減が $\Theta(n\Delta^2)$、一様探索が $\Theta(n\Delta^2/K)$。**逐次半減が $K$ 倍良い。**
  - 補足:$H_2=\max\{2/\Delta^2,\ K\}$ なので $\Delta$ が小さければ $H_2=2/\Delta^2$。厳密には指数部は $\Theta(n\Delta^2/\log K)$ ですが、L&S はここを $\Theta(n\Delta^2)$ と書いています($\log K$ を定数扱い)。$K$ 倍という結論は変わりません。

> **「適応的手法が常に良い」わけではない。**これは固定信頼度設定にはない現象で、§17.4 の非存在定理の予兆でもあります。

### 17.2.5 下界【要出典確認】

Carpentier & Locatelli, *Tight (Lower) Bounds for the Fixed Budget Best Arm Identification Bandit Problem*, COLT 2016 は、$H_2$ が正しい複雑度であることを示すミニマックス型の下界を与えています:任意のアルゴリズムに対し、ある $\nu$ が存在して
$$e_n\ \ge\ \exp\left(-\frac{C\,n}{H_2(\mu)}\right)$$
の形。**ただしこれはミニマックス的(最悪ケース)であって、instance-optimal ではありません。**定数 $C$ と $\log$ の有無は原論文で確認してください。【要出典確認 — 定数未確認】

> **この「ミニマックスでは $H_2$ が正しいが instance-optimal ではない」という状態が、§17.4 の非存在定理の伏線です。**ミニマックス最適性は「最悪の $\nu$ で最良」を要求するだけなので、各 $\nu$ で最良である必要がありません。Degenne が否定したのは後者の方です。

---

## 17.3 固定信頼度の論法はどこで壊れるか

**第13講の証明を、そのまま固定予算に持ち込んでみます。**

### 17.3.1 やってみる【厳密】

$\nu$、$\nu'\in\mathrm{Alt}(\nu)$、方策 $\pi$、ホライズン $n$(**決定的**)とする。

**Step 1'(発散分解、固定ホライズン版)** 第3講 定理 3.9 より **任意停止定理は不要**で
$$\mathrm{KL}\big(\mathbb{P}_{\nu\pi},\mathbb{P}_{\nu'\pi}\big)=\sum_a\mathbb{E}_{\nu\pi}[N_a(n)]\,\mathrm{KL}(\nu_a,\nu'_a)=n\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a),$$
ただし $w_a:=\mathbb{E}_{\nu\pi}[N_a(n)]/n\in\Sigma_K$。**ここは固定予算の方がむしろ簡単。**

**Step 2'–3'(Bretagnolle–Huber)** $E:=\{A_{n+1}\notin a^*(\nu')\}$ とすると
$$e_n(\pi,\nu)+e_n(\pi,\nu')\ \ge\ \mathbb{P}_{\nu\pi}(E^c)+\mathbb{P}_{\nu'\pi}(E)\ \ge\ \frac12\exp\big(-\mathrm{KL}(\mathbb{P}_{\nu\pi},\mathbb{P}_{\nu'\pi})\big),$$
すなわち
$$\max\big\{e_n(\pi,\nu),\ e_n(\pi,\nu')\big\}\ \ge\ \frac14\exp\left(-n\sum_a w_a\,\mathrm{KL}(\nu_a,\nu'_a)\right).\tag{17.1}$$

### 17.3.2 何が言えて、何が言えないか【厳密な指摘】

**(17.1) から言えること**: $\nu'$ について $\inf$ を取ると
$$\max\big\{e_n(\pi,\nu),\ \sup_{\nu'\in\mathrm{Alt}(\nu)}e_n(\pi,\nu')\big\}\ \ge\ \frac14\exp\left(-n\inf_{\nu'\in\mathrm{Alt}(\nu)}\sum_a w_a\mathrm{KL}(\nu_a,\nu'_a)\right)\ \ge\ \frac14\exp\left(-\frac{n}{T^*(\nu)}\right).$$

**言えないこと**: $e_n(\pi,\nu)$ **単独**の下界。

**理由を正確に述べます。**

固定信頼度では、$\delta$-正当性が**すべての $\nu$ で同時に**成り立つので、$\mathbb{P}_\nu(A)\ge1-\delta$ と $\mathbb{P}_{\nu'}(A)\le\delta$ が**同じ $\delta$** で言えました。だから (17.1) の左辺の $\max$ が $\delta$ で抑えられ、$\mathbb{E}[\tau]$ の下界に化けた。

固定予算では、$e_n(\pi,\nu)$ と $e_n(\pi,\nu')$ は**別々の量**で、アルゴリズムは片方を犠牲にして他方を良くできます。(17.1) は「両方同時には良くできない」としか言っていない。

> **これが「トレードオフが生じる」の数学的な内容です。**
> - 固定信頼度: 誤り確率を $\delta$ で**揃えて**しまい、可変なのはサンプル数だけ → 各 $\nu$ ごとに $\mathbb{E}[\tau]$ を独立に最適化できる → 単一の最適アルゴリズムが存在しうる。
> - 固定予算: サンプル数を $n$ で**揃えて**しまい、可変なのは誤り確率 → 各 $\nu$ の誤り確率が競合する → 「すべての $\nu$ で最良」が存在するとは限らない。

### 17.3.3 もう一つの見方:$w$ が $\nu$ に依存できるか【直感】

(17.1) の $w=w(\pi,\nu)$ は「アルゴリズムが $\nu$ の上で実際に使う配分」です。理想は $w(\pi,\nu)=w^*(\nu)$ ですが、$\pi$ は $\nu$ を知りません。

- **固定信頼度**: $\pi$ は $\hat\nu(t)$ を推定してから $w^*(\hat\nu(t))$ に切り替えられる。推定にかかる時間は $\tau$ を伸ばすだけで、$\delta\to0$ では相対的に無視できる。→ **適応が効く。**
- **固定予算**: 推定に使った予算は取り戻せない。しかも誤り確率の**指数**を議論しているので、$o(n)$ の無駄は指数に効かないはずだが、**適応そのものが指数を改善しない**ことが Degenne の結果です。

---

## 17.4 複雑度の非存在(Degenne, COLT 2023)

### 定理 17.6(Degenne 2023)【検証:原文(arXiv 要旨), 定理番号は要確認】

**(a)** 固定予算の識別問題が「複雑度」— すべてのバンディット問題例で同一のアルゴリズムが達成する誤り確率の下界 — を持つならば、その複雑度は**最良の非適応的サンプリング手続き**によって決まる。

**(b)** 2 腕ベルヌーイの最適腕識別を含むいくつかの固定予算識別問題には、そのような複雑度は**存在しない**。すなわち、**すべての問題例で最良のレートを同時に達成する単一のアルゴリズムは存在しない。**

> R. Degenne, *On the Existence of a Complexity in Fixed Budget Bandit Identification*, COLT 2023, PMLR vol. 195。arXiv:2303.09468(v1: 2023年3月16日、v2: 6月30日)。
> **【検証:原文(arXiv 要旨)】** 要旨の該当箇所を照合済み:(a) は "if a fixed budget task admits a complexity, defined as a lower bound on the probability of error which is attained by the same algorithm on all bandit problems, then that complexity is determined by the best non-adaptive sampling procedure"、(b) は "there is no such complexity for several fixed budget identification tasks including Bernoulli best arm identification with two arms: there is no single algorithm that attains everywhere the best possible rate" に対応します。**上の (a)(b) の日本語は要旨の忠実な訳です。**ただし**本文中の定理番号と正確な仮定(識別タスクのクラス、レートの定義)は未確認**なので、引用時は本文にあたってください。

### 17.4.1 この定理が言っていること【直感】

固定信頼度では
$$\lim_{\delta\to0}\frac{\mathbb{E}_\nu[\tau_\delta]}{\log(1/\delta)}\ \ge\ T^*(\nu)$$
という「すべての $\nu$ で同時に成り立つ下界」があり、それを**すべての $\nu$ で同時に達成する**アルゴリズム(Track-and-Stop)が存在しました。

固定予算で対応するものを考えると:
$$\text{「レート」}\quad R(\pi,\nu):=\liminf_{n\to\infty}-\frac{1}{n}\log e_n(\pi,\nu)$$
に対して、各 $\nu$ ごとの最良レート $R^*(\nu):=\sup_\pi R(\pi,\nu)$ を定義できます。

**問題**: $R(\pi,\nu)=R^*(\nu)$ を**すべての $\nu$ で同時に**満たす $\pi$ は存在するか?

**Degenne の答え: 2 腕ベルヌーイですら、存在しない。**

> **したがって「固定予算 BAI の複雑度」という概念自体が well-defined でない。**
> 「$T^*(\nu)$ に対応する量は何か」という 30 年来の問いに対する答えが、**「そんな量はない」**だったわけです。

### 17.4.2 Qin の open problem【検証:原文(arXiv メタデータ)】

Chao Qin, *Open Problem: Optimal Best Arm Identification with Fixed Budget*, COLT 2022(PMLR vol. 178)は、この問題を公式に open problem として提出したものです。Degenne の結果はこれに対する(否定的な)回答の一部と位置づけられます。

> **arXiv 番号は 2303.00950** ですが、**arXiv への投稿(2023年3月2日)が学会発表(COLT 2022、2022年7月)より後**なので、番号から年を推測しないでください。arXiv の journal-ref にも COLT 2022 / PMLR 178 と記載されています。

---

## 17.5 その後の展開(2023–2026)

### 17.5.1 大偏差の視点【検証:原文(arXiv 要旨)】

Po-An Wang, Ruo-Chun Tzeng, Alexandre Proutiere, *Best Arm Identification with Fixed Budget: A Large Deviation Perspective*(arXiv:2312.12137、2023年12月)は、固定予算の誤り確率の指数を大偏差原理の枠組みで解析し、達成可能な指数を特徴づける試みです。**腕の選択比率の LDP と報酬分布の LDP を結び付ける**のが技術的な核で、そこから **Continuous Rejects**(ギャップの観測に応じて任意の時点で腕を棄却できる適応的アルゴリズム)を導き、逐次棄却より良いと報告しています。「複雑度が存在しない」ことと矛盾せず、**「どのアルゴリズムがどの問題例で良いか」を記述する**方向。

### 17.5.2 固定予算 ≤ 固定信頼度 + $\log$ 因子(2026)【要出典確認】

Balagopalan, Li, Zhao, Nguyen, Daitche, Nassif, Jun, *Fixed Budget is No Harder Than Fixed Confidence in Best-Arm Identification up to Logarithmic Factors*(arXiv:2602.03972、2026年2月投稿、5月改訂)は、**固定信頼度アルゴリズムを固定予算アルゴリズムに変換するメタアルゴリズム FC2FB** を与え、対数因子までサンプル複雑度の保証を保つことを示しています。【検証:原文(arXiv 要旨)】

> **これは Degenne の結果と矛盾しません。** Degenne は「**厳密に**最良の指数をすべての例で同時に達成することはできない」と言っており、Balagopalan らは「**対数因子までなら**移植できる」と言っている。**対数因子の中に非存在が隠れている**、という構図です。
>
> **arXiv 番号・著者・主張は 2026年8月時点で Web 上のメタデータを確認しましたが、本文は未確認です。引用前に必ず原論文を読んでください。**【要出典確認】

### 17.5.3 予算を知らないで走らせる(2026)【検証:原文(arXiv 要旨)】

Komiyama, Jang, Honda, *Rate-optimal Design for Anytime Best Arm Identification*(AISTATS 2026、arXiv:2510.23199、v1: 2025年10月)は、**ホライズン $n$ を事前に知らずに**走らせられる固定予算アルゴリズム **Almost Tracking** を与えています。既存手法が段階の切れ目でサンプルを大量に捨てる(定理 17.5 の設計ポイント参照)のを避けられるのが実用上の利点。

> **ここでの "anytime" は「予算を知らなくてよい」という意味**であって、第11講の e-process の "anytime-valid"(任意の停止時刻で妥当)ではありません。**同じ語が別の意味で使われる典型例なので注意してください。**
>
> **第17.2.2 節の「サンプルを捨てて独立性を買う」設計への直接の対案**という位置づけで読むと分かりやすい。

### 17.5.4 まだ開いていること

| 問い | 状態 |
|---|---|
| 固定予算の「複雑度」に代わる正しい定式化は何か | **開いている** |
| 非存在は 2 腕ベルヌーイ特有か、より広いクラスでも起きるか | 部分的に既知 |
| 「複雑度が存在する」識別タスクの特徴づけ | **開いている** |
| ベイズ的(事前分布つき)な定式化なら複雑度は存在するか | 一部進展【要出典確認】 |
| 田畑研の設定(bad arm existence checking、分類バンディット)での非存在 | **未検討と思われる** ← 第19講の種 |

---

## 17.6 まとめ

- 固定予算の複雑度は $H_1,H_2$ で記述される。$H_2\le H_1\le(1+\log K)H_2$(数値検証済み)。
- 逐次半減:$e_n\le3\log_2K\exp\left(-\frac{n}{16H_2\log_2K}\right)$。**サンプルを捨てて独立性を買う**設計。
- **一様探索が適応的手法より良い場合がある**(全ギャップが等しいとき)。
- **固定信頼度の下界の論法は Step 1' までは同じで、Step 3' で壊れる。** 誤り確率が $\nu$ ごとに別の量なので、$\max$ しか抑えられない。
- **Degenne (COLT 2023): 固定予算 BAI には複雑度が存在しない**(2 腕ベルヌーイですら)。**「最適とは何か」の定義がまだない。**
- 2026 年に「対数因子までは固定信頼度と同等」という結果。**認識がこの 3 年で何度も更新されている領域。**

---

## 演習(詳細は [B-exercises.md](B-exercises.md) §17)

- **★17-1** 命題 17.3 の $H_2\le H_1$ を証明せよ。$H_1\le(1+\log K)H_2$ も試みよ(ヒント:$\frac{1}{\Delta_i^2}\le\frac{H_2}{i}$ と調和級数)。
- **★17-2(最重要)** §17.3 の議論を自分で再現し、「固定信頼度ではできて固定予算ではできないこと」を 1 段落で書け。第13講の証明のどの行が対応するかを明示すること。
- **★17-3** L&S §17.2.4 の 2 つのケース(全ギャップ等しい / 1 本だけ近い)について、逐次半減と一様探索の指数を計算し、どちらが良いかを確かめよ。
- **★17-4** 逐次半減を実装し、$\mu=(0.6,0.45,0.35,0.25)$、$n=500,1000,2000$ で誤り率を測り、定理 17.5 の上界と比べよ。
- **☆17-5** Degenne (arXiv:2303.09468) の Abstract と Introduction を読み、「複雑度」の正確な定義を書き写せ。本文の定理 17.6 の記述が正しいか確認せよ。
- **☆17-6** 固定信頼度アルゴリズムを $n$ で打ち切る素朴な変換の誤り確率を $\mathbb{P}(\tau>n)+\delta$ で評価し、$\delta$ を $n$ の関数として最適化せよ。得られるレートを 定理 17.5 と比べよ。

---

[← 前の講](16-other-algorithms.md) ｜ [次の講: 最前線 →](18-frontier.md)
