# backend
パッケージは venv で管理
`venv/Scripts/activate`
で仮想環境が起動する
`deactivate`
で終了

firebase関連の参考
https://qiita.com/hirune/items/c6aa002117036c0af0a5

firebase_functions は flask の派生クラスなので、基本的なやりとりは flask でできる。
使わないといけないのは `https_fn.on_request()` だけ

# frontend

パッケージは bun で管理
`bun run dev` で開発環境が起動する
`bun build` でビルドが走る