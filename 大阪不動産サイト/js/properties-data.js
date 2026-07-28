/* ==========================================================================
   物件データ(bukken.json由来のダミー賃貸物件情報)
   物件一覧・チャットボットの双方から参照する共通データです。
   ========================================================================== */

const RENT_BANDS = [
  {
    "key": "0-80000",
    "label": "〜8万円"
  },
  {
    "key": "80000-100000",
    "label": "8万円〜10万円"
  },
  {
    "key": "100000-130000",
    "label": "10万円〜13万円"
  },
  {
    "key": "130000-160000",
    "label": "13万円〜16万円"
  },
  {
    "key": "160000-999999999",
    "label": "16万円〜"
  }
];
const AREA_OPTIONS = ["梅田駅","大阪駅","中津駅"];
const MADORI_OPTIONS = ["1K","1DK","2DK","1LDK","2LDK","3LDK"];
const FEATURE_OPTIONS = ["ペット可","オートロック","宅配ボックス","浴室乾燥","床暖房","ネット無料"];

const PROPERTIES = [
  {
    "id": "UM001",
    "name": "グラン梅田レジデンス",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "芝田"
    ],
    "neighborhood": "芝田",
    "address": "大阪市北区芝田2丁目",
    "access": "梅田駅 徒歩5分",
    "rent": 118000,
    "rentBand": "100000-130000",
    "maintenanceFee": 8000,
    "rentManYen": 11.8,
    "layout": "1LDK",
    "areaSqm": 35.2,
    "age": "築8年",
    "features": [
      "オートロック",
      "宅配ボックス",
      "浴室乾燥",
      "ネット無料"
    ],
    "description": "梅田駅徒歩5分の好立地に位置する1LDK物件。オートロックや宅配ボックスなど設備が充実しており、単身者やカップルに人気の住まいです。周辺には商業施設が多く生活利便性も高い物件です。",
    "url": "property-UM001.html",
    "image": "images/UM001.svg"
  },
  {
    "id": "UM002",
    "name": "梅田ステーションハイツ",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "角田町"
    ],
    "neighborhood": "角田町",
    "address": "大阪市北区角田町",
    "access": "大阪駅 徒歩6分",
    "rent": 85000,
    "rentBand": "80000-100000",
    "maintenanceFee": 6000,
    "rentManYen": 8.5,
    "layout": "1K",
    "areaSqm": 25.1,
    "age": "築12年",
    "features": [
      "独立洗面台",
      "2口ガスコンロ",
      "オートロック"
    ],
    "description": "大阪駅徒歩6分の利便性抜群の1K物件。独立洗面台や2口コンロなど、単身者に嬉しい設備が揃っています。繁華街に近く、仕事帰りの買い物にも便利です。",
    "url": "property-UM002.html",
    "image": "images/UM002.svg"
  },
  {
    "id": "UM003",
    "name": "茶屋町アーバンコート",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "茶屋町"
    ],
    "neighborhood": "茶屋町",
    "address": "大阪市北区茶屋町",
    "access": "梅田駅 徒歩4分",
    "rent": 132000,
    "rentBand": "130000-160000",
    "maintenanceFee": 10000,
    "rentManYen": 13.2,
    "layout": "1LDK",
    "areaSqm": 40.5,
    "age": "築5年",
    "features": [
      "ペット可",
      "宅配ボックス",
      "浴室乾燥",
      "追い焚き"
    ],
    "description": "茶屋町エリアの人気物件。ペット可で設備も充実しており、梅田周辺で快適な生活を求める方におすすめです。商業施設が多く生活環境も良好です。",
    "url": "property-UM003.html",
    "image": "images/UM003.svg"
  },
  {
    "id": "UM004",
    "name": "中津プレミアムタワー",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津"
    ],
    "neighborhood": "中津",
    "address": "大阪市北区中津1丁目",
    "access": "中津駅 徒歩2分",
    "rent": 155000,
    "rentBand": "130000-160000",
    "maintenanceFee": 12000,
    "rentManYen": 15.5,
    "layout": "2LDK",
    "areaSqm": 52.8,
    "age": "築3年",
    "features": [
      "タワマン",
      "コンシェルジュ",
      "床暖房"
    ],
    "description": "中津駅徒歩2分のタワーマンション。コンシェルジュサービスや床暖房など高級設備が揃っており、快適なタワーライフを楽しめます。",
    "url": "property-UM004.html",
    "image": "images/UM004.svg"
  },
  {
    "id": "UM005",
    "name": "大阪駅前シティハウス",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "梅田"
    ],
    "neighborhood": "梅田",
    "address": "大阪市北区梅田2丁目",
    "access": "大阪駅 徒歩3分",
    "rent": 79000,
    "rentBand": "0-80000",
    "maintenanceFee": 5000,
    "rentManYen": 7.9,
    "layout": "1K",
    "areaSqm": 23,
    "age": "築14年",
    "features": [
      "オートロック",
      "IHコンロ",
      "エレベーター"
    ],
    "description": "大阪駅徒歩3分の好立地。単身者向けのコンパクトな1Kで、通勤・通学に便利な物件です。",
    "url": "property-UM005.html",
    "image": "images/UM005.svg"
  },
  {
    "id": "UM006",
    "name": "梅田ガーデンヒルズ",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "鶴野町"
    ],
    "neighborhood": "鶴野町",
    "address": "大阪市北区鶴野町",
    "access": "梅田駅 徒歩7分",
    "rent": 124000,
    "rentBand": "100000-130000",
    "maintenanceFee": 9000,
    "rentManYen": 12.4,
    "layout": "1LDK",
    "areaSqm": 38,
    "age": "築7年",
    "features": [
      "ペット可",
      "宅配ボックス",
      "浴室乾燥"
    ],
    "description": "ペット可の人気物件。梅田エリアに近く、静かな住環境で落ち着いた生活を送りたい方におすすめです。",
    "url": "property-UM006.html",
    "image": "images/UM006.svg"
  },
  {
    "id": "UM007",
    "name": "北梅田コンフォートレジデンス",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津",
      "豊崎"
    ],
    "neighborhood": "豊崎",
    "address": "大阪市北区豊崎3丁目",
    "access": "中津駅 徒歩4分",
    "rent": 98000,
    "rentBand": "80000-100000",
    "maintenanceFee": 7000,
    "rentManYen": 9.8,
    "layout": "1DK",
    "areaSqm": 30.2,
    "age": "築10年",
    "features": [
      "独立洗面台",
      "2口コンロ",
      "オートロック"
    ],
    "description": "中津駅近くの便利な立地。1DKでゆとりのある間取りが魅力で、単身者やカップルに人気です。",
    "url": "property-UM007.html",
    "image": "images/UM007.svg"
  },
  {
    "id": "UM008",
    "name": "梅田ロイヤルパーク",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "堂山町"
    ],
    "neighborhood": "堂山町",
    "address": "大阪市北区堂山町",
    "access": "梅田駅 徒歩6分",
    "rent": 168000,
    "rentBand": "160000-999999999",
    "maintenanceFee": 15000,
    "rentManYen": 16.8,
    "layout": "2LDK",
    "areaSqm": 55,
    "age": "築4年",
    "features": [
      "ペット可",
      "床暖房",
      "宅配ボックス"
    ],
    "description": "梅田エリアの高級2LDK。床暖房やペット可など設備が充実しており、快適な生活を実現できます。",
    "url": "property-UM008.html",
    "image": "images/UM008.svg"
  },
  {
    "id": "UM009",
    "name": "大阪グランドスクエア",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "梅田"
    ],
    "neighborhood": "梅田",
    "address": "大阪市北区梅田1丁目",
    "access": "大阪駅 徒歩5分",
    "rent": 69000,
    "rentBand": "0-80000",
    "maintenanceFee": 5000,
    "rentManYen": 6.9,
    "layout": "1K",
    "areaSqm": 21.5,
    "age": "築18年",
    "features": [
      "エレベーター",
      "IHコンロ"
    ],
    "description": "大阪駅徒歩5分のリーズナブルな1K物件。初めての一人暮らしにもおすすめです。",
    "url": "property-UM009.html",
    "image": "images/UM009.svg"
  },
  {
    "id": "UM010",
    "name": "茶屋町スマートレジデンス",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "茶屋町"
    ],
    "neighborhood": "茶屋町",
    "address": "大阪市北区茶屋町",
    "access": "梅田駅 徒歩3分",
    "rent": 107000,
    "rentBand": "100000-130000",
    "maintenanceFee": 8000,
    "rentManYen": 10.7,
    "layout": "1LDK",
    "areaSqm": 33,
    "age": "築9年",
    "features": [
      "ネット無料",
      "浴室乾燥",
      "宅配ボックス"
    ],
    "description": "茶屋町の中心に位置する便利な物件。ネット無料でテレワークにも最適です。",
    "url": "property-UM010.html",
    "image": "images/UM010.svg"
  },
  {
    "id": "UM011",
    "name": "中津エクセルハイツ",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津"
    ],
    "neighborhood": "中津",
    "address": "大阪市北区中津2丁目",
    "access": "中津駅 徒歩3分",
    "rent": 75000,
    "rentBand": "0-80000",
    "maintenanceFee": 4000,
    "rentManYen": 7.5,
    "layout": "1K",
    "areaSqm": 22,
    "age": "築15年",
    "features": [
      "オートロック",
      "エアコン新品"
    ],
    "description": "中津駅近くのリーズナブルな物件。エアコン新品で快適に過ごせます。",
    "url": "property-UM011.html",
    "image": "images/UM011.svg"
  },
  {
    "id": "UM012",
    "name": "梅田スカイビュータワー",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "芝田"
    ],
    "neighborhood": "芝田",
    "address": "大阪市北区芝田1丁目",
    "access": "梅田駅 徒歩2分",
    "rent": 182000,
    "rentBand": "160000-999999999",
    "maintenanceFee": 18000,
    "rentManYen": 18.2,
    "layout": "2LDK",
    "areaSqm": 60,
    "age": "築2年",
    "features": [
      "タワマン",
      "ジム",
      "ラウンジ",
      "床暖房"
    ],
    "description": "梅田駅徒歩2分の新築タワーマンション。ジムやラウンジなど共用施設が充実しています。",
    "url": "property-UM012.html",
    "image": "images/UM012.svg"
  },
  {
    "id": "UM013",
    "name": "大阪駅前スマートハウス",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "梅田"
    ],
    "neighborhood": "梅田",
    "address": "大阪市北区梅田3丁目",
    "access": "大阪駅 徒歩4分",
    "rent": 92000,
    "rentBand": "80000-100000",
    "maintenanceFee": 6000,
    "rentManYen": 9.2,
    "layout": "1DK",
    "areaSqm": 28.5,
    "age": "築11年",
    "features": [
      "独立洗面台",
      "宅配ボックス"
    ],
    "description": "大阪駅近くの便利な1DK物件。独立洗面台付きで使い勝手の良い間取りです。",
    "url": "property-UM013.html",
    "image": "images/UM013.svg"
  },
  {
    "id": "UM014",
    "name": "豊崎アーバンレジデンス",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津",
      "豊崎"
    ],
    "neighborhood": "豊崎",
    "address": "大阪市北区豊崎4丁目",
    "access": "中津駅 徒歩6分",
    "rent": 88000,
    "rentBand": "80000-100000",
    "maintenanceFee": 6000,
    "rentManYen": 8.8,
    "layout": "1K",
    "areaSqm": 26,
    "age": "築13年",
    "features": [
      "2口ガスコンロ",
      "オートロック"
    ],
    "description": "豊崎エリアの静かな住環境が魅力の物件。2口コンロで自炊派にもおすすめです。",
    "url": "property-UM014.html",
    "image": "images/UM014.svg"
  },
  {
    "id": "UM015",
    "name": "梅田プレミアムヒルズ",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "堂島"
    ],
    "neighborhood": "堂島",
    "address": "大阪市北区堂島2丁目",
    "access": "大阪駅 徒歩7分",
    "rent": 146000,
    "rentBand": "130000-160000",
    "maintenanceFee": 12000,
    "rentManYen": 14.6,
    "layout": "1LDK",
    "areaSqm": 42,
    "age": "築6年",
    "features": [
      "ペット可",
      "宅配ボックス",
      "浴室乾燥",
      "追い焚き"
    ],
    "description": "堂島エリアの高級1LDK。ペット可で設備も充実しており、快適な生活を求める方に最適です。",
    "url": "property-UM015.html",
    "image": "images/UM015.svg"
  },
  {
    "id": "UM016",
    "name": "梅田セントラルレジデンス",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "曽根崎"
    ],
    "neighborhood": "曽根崎",
    "address": "大阪市北区曽根崎2丁目",
    "access": "梅田駅 徒歩8分",
    "rent": 115000,
    "rentBand": "100000-130000",
    "maintenanceFee": 9000,
    "rentManYen": 11.5,
    "layout": "2DK",
    "areaSqm": 48,
    "age": "築10年",
    "features": [
      "オートロック",
      "宅配ボックス",
      "ネット無料"
    ],
    "description": "梅田駅徒歩8分、繁華街から少し離れた静かな立地の2DK物件。オートロック・宅配ボックス完備で、単身赴任や二人暮らしにもおすすめです。",
    "url": "property-UM016.html",
    "image": "images/UM016.svg"
  },
  {
    "id": "UM017",
    "name": "中津ファミリーコート",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津"
    ],
    "neighborhood": "中津",
    "address": "大阪市北区中津3丁目",
    "access": "中津駅 徒歩9分",
    "rent": 178000,
    "rentBand": "160000-999999999",
    "maintenanceFee": 13000,
    "rentManYen": 17.8,
    "layout": "3LDK",
    "areaSqm": 68.5,
    "age": "築7年",
    "features": [
      "ペット可",
      "宅配ボックス",
      "エレベーター"
    ],
    "description": "中津駅徒歩9分、ファミリー向けの3LDK。ペット可・エレベーター完備で、お子様連れのご家族にも暮らしやすい住まいです。",
    "url": "property-UM017.html",
    "image": "images/UM017.svg"
  },
  {
    "id": "UM018",
    "name": "大阪駅前レジデンスタワー",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "梅田"
    ],
    "neighborhood": "梅田",
    "address": "大阪市北区梅田4丁目",
    "access": "大阪駅 徒歩5分",
    "rent": 195000,
    "rentBand": "160000-999999999",
    "maintenanceFee": 16000,
    "rentManYen": 19.5,
    "layout": "2LDK",
    "areaSqm": 58,
    "age": "築1年",
    "features": [
      "タワマン",
      "床暖房",
      "宅配ボックス",
      "エレベーター"
    ],
    "description": "築1年、大阪駅徒歩5分の新築タワーマンション。床暖房完備で高層階からの眺望も魅力です。",
    "url": "property-UM018.html",
    "image": "images/UM018.svg"
  },
  {
    "id": "UM019",
    "name": "茶屋町コンパクトハウス",
    "station": "梅田駅",
    "areaKeywords": [
      "梅田駅",
      "梅田",
      "茶屋町"
    ],
    "neighborhood": "茶屋町",
    "address": "大阪市北区茶屋町",
    "access": "梅田駅 徒歩6分",
    "rent": 72000,
    "rentBand": "0-80000",
    "maintenanceFee": 4500,
    "rentManYen": 7.2,
    "layout": "1K",
    "areaSqm": 20.5,
    "age": "築16年",
    "features": [
      "エアコン新品",
      "エレベーター"
    ],
    "description": "茶屋町エリアのリーズナブルな1K。梅田駅徒歩6分で通勤・通学にも便利、初めての一人暮らしにおすすめです。",
    "url": "property-UM019.html",
    "image": "images/UM019.svg"
  },
  {
    "id": "UM020",
    "name": "中津グリーンテラス",
    "station": "中津駅",
    "areaKeywords": [
      "中津駅",
      "中津"
    ],
    "neighborhood": "中津",
    "address": "大阪市北区中津4丁目",
    "access": "中津駅 徒歩7分",
    "rent": 129000,
    "rentBand": "100000-130000",
    "maintenanceFee": 9500,
    "rentManYen": 12.9,
    "layout": "2DK",
    "areaSqm": 46.2,
    "age": "築9年",
    "features": [
      "ペット可",
      "浴室乾燥",
      "宅配ボックス"
    ],
    "description": "中津駅徒歩7分、緑の多い住宅街に佇む2DK。ペット可・浴室乾燥完備で、快適な二人暮らしに適した物件です。",
    "url": "property-UM020.html",
    "image": "images/UM020.svg"
  },
  {
    "id": "UM021",
    "name": "堂島リバーサイドヒルズ",
    "station": "大阪駅",
    "areaKeywords": [
      "大阪駅",
      "大阪",
      "堂島"
    ],
    "neighborhood": "堂島",
    "address": "大阪市北区堂島3丁目",
    "access": "大阪駅 徒歩9分",
    "rent": 158000,
    "rentBand": "130000-160000",
    "maintenanceFee": 12000,
    "rentManYen": 15.8,
    "layout": "1LDK",
    "areaSqm": 44,
    "age": "築4年",
    "features": [
      "床暖房",
      "宅配ボックス",
      "浴室乾燥",
      "ネット無料"
    ],
    "description": "堂島川沿いの落ち着いたエリアに立つ1LDK。床暖房・浴室乾燥など設備も充実し、快適な住環境が魅力です。",
    "url": "property-UM021.html",
    "image": "images/UM021.svg"
  }
];
