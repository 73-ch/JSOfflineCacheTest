const path = require("path");

module.exports = {
  mode: 'development',//webpack4以降はモード指定しなければいけない

  entry: {index: './src/index.js'},//エントリーポイント。連想配列にすることでappというキーに対してはindex.jsがentryとセットできる
  output: {
    path: path.join(__dirname, "public"),
    publicPath: "/js/", //ブラウザからバンドルにアクセスする際のパス
    filename: '[name].js', //バンドルのファイル名。[name]の部分にはentryで指定したキーが入る
  },
  devtool: 'inline-source-map',//ブラウザでのデバッグ用にソースマップを出力する

  //webpack-dev-server用設定
  devServer: {
    open: true,//ブラウザを自動で開く
    contentBase: path.join(__dirname, 'public'),// HTML等コンテンツのルートディレクトリ
    watchContentBase: true,//コンテンツの変更監視をする
    port: 3000, // ポート番号
  }
};