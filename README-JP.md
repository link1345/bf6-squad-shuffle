# BF6 Squad Shuffle

[English README is here.](./README.md)

このリポジトリは、Battlefield 6 Portalのルールエディタ向けTypeScriptです。
ゲームモード開始時に、ゲームへ参加しているプレイヤーを分隊単位でチームシャッフルします。

## 何をするか

`OnGameModeStarted`が呼ばれたとき、下記の処理をします。

* `mod.AllPlayers()`で現在ゲームに参加している全プレイヤーを取得する。
* プレイヤーが2人未満なら何もしない。
* 分隊長を抽出し、分隊一覧を作る。
* 分隊一覧を`mod.RandomizedArray`でランダム化する。
* 分隊を崩さずに、Team 1とTeam 2へ振り分ける。
* チーム人数差を見て、次の分隊を人数が少ない側へ入れる。
* すでに移動先チームにいるプレイヤーには`SetTeam`を呼ばない。

下記の`modlib`関数を使っています。

* `modlib.FilteredArray`: Portal配列を条件でフィルタする。
* `modlib.ConvertArray`: `mod.Array`をJavaScript配列へ変換する。
* `modlib.Equals`: Portalオブジェクトを比較する。
* `modlib.getTeamId`: TeamオブジェクトのIDを取得して比較する。

## 注意点

このスクリプトはゲーム開始時のシャッフル用です。
プレイヤーが途中参加・途中退出した後に、継続的なチームバランス調整はしません。

1人だけの検証環境では、BF6 Portal側で`SetTeam` / `SwitchTeam`例外が出ることがあります。
そのため、プレイヤーが2人未満のときは何もせず終了します。

分隊の処理順は`mod.RandomizedArray`でランダム化されるため、ラウンドごとにチーム構成が変わる可能性があります。

## インストール

0. Node.jsをインストールする。
   JSについて何も分からない場合は、下記リンクからWindows x64用の`.msi`インストーラをダウンロードしてインストールするのがお勧めです。
   https://nodejs.org/ja/download
1. このリポジトリをダウンロードする。
2. Battlefield 6公式SDKの`PortalSDK/code`フォルダを、このプロジェクトの`code`フォルダに入れる。
3. `npm install`を実行する。

## 使い方

1. `mods`フォルダ内のスクリプトを編集する。
2. `npm run build`を実行する。
3. `dist/Script.ts`と`dist/Strings.json`をBF Portalのルールエディタに登録する。

## テスト

このプロジェクトでは`bfportal-vitest-mock`と`vitest`を使っています。

実行コマンド:

```bash
npm run test
```

現在のテストでは、下記を確認しています。

* プレイヤーが2人未満のときに`SetTeam`を呼ばないこと。
* プレイヤーが分隊単位で移動されること。
* すでに移動先チームにいるプレイヤーはスキップされること。

## 確認コマンド

```bash
npm run lint
npm run test
npm run build
```
