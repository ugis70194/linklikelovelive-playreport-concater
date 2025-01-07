# Link! Like! LoveLive! PlayReport Concater

## What is This ?
スマートフォンアプリ『Link! Like! ラブライブ!』内のゲーム『スクールアイドルステージ』のプレイレポートを結合するツールです。

通常、プレイレポートは一部しか表示されません。
スクロールで全体を確認できますが、他のユーザーと共有する場合には全体が分かるように何枚かに分けてスクリーンショットを撮る必要があります。

![分割したスクリーンショット1](img/playreport_bright_0.png)
![分割したスクリーンショット2](img/playreport_bright_1.png)
![分割したスクリーンショット3](img/playreport_bright_2.png)

このツールを使用することで、これらのスクリーンショットを一枚にまとめることができます。

![結合したスクリーンショット](./img/concated_playreport.png)

## 技術的な話

フロントエンドは Typescirpt + React、バックエンドは Python + Flask で記述されています。

フロントエンドは firebase hosting で静的サイトとしてホスティングしています。

フロントエンド側で [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) を利用して画像を圧縮。
圧縮した画像をサーバーに送信し、処理された画像を受け取って表示します。

バックエンドはエンドポイントがひとつなので firebase functions で関数として実装しています。

受け取った画像は numpy の ndarray として受け取ります。

まず、スクリーンショットからプレイレポート部分だけを切り抜きます。
プレイレポートでない部分はプレイレポート部分と比べて暗くなっているので、適当な閾値で画像を二値化して明るい領域がどこからどこまでなのか、画像を上から見て top を、下から見て bottom を決定します。
画像を転置して同じ処理をすることで left と right も産出できます。
これによりプレイレポート部分の左上の座標 (top, left) と 右下の座標 (bottom, right) が決定されるので、これをもとに切り抜きます。

![](./img/playreport_bright_0.png)
![](./img/playreport_bright_1.png)
![](./img/playreport_bright_2.png)

プレイレポートを 2 枚選び、グレースケールに変換して画像の差分を取ります。
これはプレイレポートの結合すべき部分を抜き出すためです。

![差分画像](./img/diff_playreport.png)

元の画像から抜き出すべき部分の高さの上限 $h_u$ と高さの下限 $h_b$ を求めます。
これはプレイレポートを切り抜く関数を流用しています。

$h_u$ と $h_b$ が求められたらプレイレポートから必要な部分だけを切り出し、opencv の stiching 関数で連結します。

![](./img/cliped_skillreport_0.png)
![](./img/cliped_skillreport_1.png)
![](./img/cliped_skillreport_2.png)

![](./img/concated_skillreport.png)

連結した部分の画像と、その他の部分を numpy の vstack 関数で連結し直して出力します。

![完全版](./img/concated_playreport.png)

別途、ステータス画面やボーナス画面があれば横に連結して出力します。
こちらの機能は[pyscript版](https://www.bing.com/search?q=プレイレポート結合ツール&form=ANNTH1&refig=5ca1f78ce8264c0e82e665d56512f785&pc=HCTS)でのみ提供しています。

## やらなかったこと

画像を圧縮したかったのですが、時間がかかるためやらないことにしました。

画像をサイズを小さくできればユーザー側が負担する通信量を減らせるため圧縮を試みましたが、フロントエンド側で画像を圧縮しようとすると一枚あたり 1500 ms かかってしまいました。
サイズを縮小すればもっと高速化できることがわかりましたが、縮小すると特徴点がつぶれて sitiching 処理が上手くいかない場合が多かったので、縮小は断念しました。

必要な部分だけを crop して使おうと Jimp で crop 処理を行ってみましたが、処理時間削減どころか 10% 増える結果になってしまいました。

以上、 2 ケースを根拠に処理に時間がかかりすぎるため画像圧縮は断念することにしました。

pyscript を利用したフロントエンド側ですべて処理する旧版より通信量は削減されているので、通信量を削減する目標は達成されています。
そのため、時間がかかる圧縮は行わない方がユーザーの利益になると判断しました。

## 困ったこと

function をデプロイしたら memory limit 超過で無限にインスタンスが落ちる
メモリ割り当てが 216Mbi になっていたのでとりあえず Cloud Run コンソールから yaml をいじって 512Mbi にした。
