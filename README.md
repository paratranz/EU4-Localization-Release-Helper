# EU4-Localization-Release-Helper
Release EU4 Chinese localization with joy.

## Usage
Put files in `pre-release` folder, and run 
```
$ npm install
$ npm start $game_version
```
replace `$game_version` with your current releasing EU4 version
like `1.27` (do not need patch version)

## Typical Pre-Release Directory Structure
```
+-- common
|   +-- countries
|   +-- cultures
|   +-- province_names
+-- decisions
|   +-- Russia.txt
|   +-- TimuridNation.txt
|   +-- YuanNation.txt
|   ... (depends, may be more)
+-- events
+-- history
|   +-- countries
|   +-- wars
+-- gfx
|   +-- fonts
|   +-- interface
+-- interface
|   +-- chatfont.gfx
|   +-- contentview.gui
|   +-- core.gfx
|   +-- topbar.gui
+-- localisation
+-- missions
+-- base.jpg (thumb for base mod)
+-- sup.jpg (thumb for sup mod)
```

## Typical Release Directory Structure
```
+-- eu4_chinese
|   +-- gfx
|   +-- interface
|   +-- localisation
|   +-- thumb.jpg
+-- eu4_chinese_sup
|   +-- common
|   +-- decisions
|   +-- events
|   +-- history
|   +-- missions
|   +-- thumb.jpg
+-- eu4_chinese.mod
+-- eu4_chinese_sup.mod
+-- patch_****.zip
```