# BF6 Squad Shuffle

[※ このリポジトリの日本語での説明はこちらです。](./README-JP.md)

This repository contains a Battlefield 6 Portal TypeScript rule script that shuffles players by squad when the game mode starts.

## Questions / Support

If you have questions or feedback, feel free to contact me on the PlumRice Discord server 😄

Please use the appropriate thread/channel for discussions related to this project.

https://discord.gg/Zy65k8AxH2

## What It Does

When `OnGameModeStarted` is fired, the script:

* Gets all players currently in the game with `mod.AllPlayers()`.
* Does nothing when fewer than two players are in the game.
* Finds squad leaders, then converts them into a randomized squad list.
* Keeps each squad together while assigning squads between Team 1 and Team 2.
* Tracks the player count difference between teams and assigns the next squad to the smaller side.
* Skips `SetTeam` when a player is already on the target team.

The script uses helper functions from `modlib`, including:

* `modlib.FilteredArray` to filter Portal arrays.
* `modlib.ConvertArray` to convert `mod.Array` into a JavaScript array.
* `modlib.Equals` to compare Portal objects.
* `modlib.getTeamId` to compare team object IDs.

## Important Notes

This script is intended to run at game start. It does not continuously rebalance teams after players join or leave.

The script has a guard for one-player test sessions because BF6 Portal may throw a `SetTeam` / `SwitchTeam` exception when a team switch cannot be completed.

Squad assignment order is randomized with `mod.RandomizedArray`, so the resulting team composition may differ each round.

## Installation

0. Install Node.js.
   If you are new to JavaScript, download the Windows x64 `.msi` installer from:
   https://nodejs.org/en/download
1. Download this repository.
2. Place the official Battlefield 6 SDK `PortalSDK/code` folder into this project's `code` directory.
3. Run `npm install`.

## Usage

1. Edit the script in the `mods` folder.
2. Run `npm run build`.
3. Upload `dist/Script.ts` and `dist/Strings.json` to the BF Portal Rule Editor.

## Tests

This project uses `bfportal-vitest-mock` and `vitest`.

Run:

```bash
npm run test
```

The current tests verify that:

* The script does not call `SetTeam` when fewer than two players are present.
* Players are moved by squad.
* Players already on the target team are skipped.

## Checks

```bash
npm run lint
npm run test
npm run build
```
