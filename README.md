# Link! Like! LoveLive! PlayReport Concater

## What is This ?
スマートフォンアプリ『Link! Like! ラブライブ!』内のゲーム『スクールアイドルステージ』のプレイレポートを結合するツールです。

通常、プレイレポートは一部しか表示されません。
スクロールで全体を確認できますが、他のユーザーと共有する場合には全体が分かるように何枚かに分けてスクリーンショットを撮る必要があります。

![分割したスクリーンショット1]("./img/playreport_split_01.png")
![分割したスクリーンショット2]("./img/playreport_split_02.png")
![分割したスクリーンショット3]("./img/playreport_split_03.png")

このツールを使用することで、これらのスクリーンショットを一枚にまとめることができます。

![結合したスクリーンショット]("./img/playreport_concat.png")

また、スコアに影響するステータス画面やボーナス画面も一緒に結合することができます。

![ステータス画面]("./img/stats.png")
![ボーナス画面]("./img/bonus.png")

![全体結合]("./img/playreport_all_concat.png")

## 技術的な話

フロントエンドは Typescirpt + React、バックエンドは Python + Flask で記述されています。

フロントエンドは firebase hosting で静的サイトとしてホスティングしています。

フロントエンド側で browser-image-compression(https://www.npmjs.com/package/browser-image-compression) を利用して画像を圧縮。
圧縮した画像をサーバーに送信し、処理された画像を受け取って表示します。

バックエンドはエンドポイントがひとつなので firebase functions で関数として実装しています。

受け取った画像は numpy の ndarray として受け取ります。

プレイレポートを 2 枚選び、グレースケールに変換して画像の差分を取ります。
これはプレイレポートの結合すべき部分を抜き出すためです。

![差分画像](./img/diff.png)

圧縮時のノイズがあるためこれを独自のフィルタで取り除きます。
ノイズを取り除かなければ、のちの処理が上手く走らないためです。

![ノイズ削減画像](./img/noise_filttered.png)

元の画像から抜き出すべき部分の高さの上限 $h_u$ と高さの下限 $h_b$ を求めます。
画像の下端から差が小さい部分を辿って $h_b$ を求めます。
$h_b$ が求められたら今度は差が大きい部分を辿って $h_u$ を求めます。 

![高さを求める](./img/cul_h.png)

$h_u$ と $h_b$ が求められたらプレイレポートから必要な部分だけを切り出し、opencv の stiching 関数で連結します。

![連結](./img/stitched.png)

連結した部分の画像と、その他の部分を numpy の vstack 関数で連結し直して出力します。

![完全版](./img/concat.png)

別途、ステータス画面やボーナス画面があれば横に連結して出力します。

![ボーナス](./img/with_bonus.png)

