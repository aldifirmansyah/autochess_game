# Fighter Asset Download Commands

## ✅ Already Generated
The basic fighter sprites have been generated using the Python script:
- `warrior_blue.png` - Blue warrior with sword and shield
- `warrior_red.png` - Red warrior with sword and shield  
- `archer_blue.png` - Blue archer with bow and arrow
- `archer_red.png` - Red archer with bow and arrow
- `tank_blue.png` - Blue tank with heavy armor
- `tank_red.png` - Red tank with heavy armor

## 🎨 Additional Asset Download Commands

### 1. Download from OpenGameArt.org
```bash
# Download free fighter sprites
curl -L -o "fighter_pack.zip" "https://opengameart.org/sites/default/files/fighter_sprites.zip"
unzip fighter_pack.zip
```

### 2. Download from Kenney.nl (Professional Quality)
```bash
# Download character pack
curl -L -o "kenney_characters.zip" "https://kenney.nl/content/3-assets/25-characters/characters.zip"
unzip kenney_characters.zip
```

### 3. Download from GitHub Repositories
```bash
# Download 2D Character Pack
curl -L -o "2d_characters.zip" "https://github.com/0x72/2D-Character-Pack/archive/refs/heads/master.zip"
unzip 2d_characters.zip

# Download RPG Character Pack
curl -L -o "rpg_characters.zip" "https://github.com/0x72/RPG-Character-Pack/archive/refs/heads/master.zip"
unzip rpg_characters.zip
```

### 4. Download from Itch.io (Free Assets)
```bash
# Note: Itch.io requires manual download from browser
# Visit: https://itch.io/game-assets/free
# Search for: "fighter sprites", "character pack", "rpg characters"
```

### 5. Download from Game-icons.net
```bash
# Download weapon icons
curl -L -o "weapons.zip" "https://game-icons.net/icons/000000/transparent/1x1/delapouite/anvil-impact.png"
```

## 🛠️ Processing Commands

### Convert Images to Correct Format
```bash
# Install ImageMagick if not available
brew install imagemagick

# Convert to 32x32 PNG with transparency
for file in *.png; do
    convert "$file" -resize 32x32 -background transparent -gravity center -extent 32x32 "processed_$file"
done
```

### Batch Rename Files
```bash
# Rename files to match game convention
for file in *.png; do
    # Example: rename downloaded files to match game format
    mv "$file" "${file// /_}"  # Replace spaces with underscores
done
```

## 🎯 Quick Setup Commands

### Generate Basic Sprites (Already Done)
```bash
python3 generate_sprites.py
```

### Test Sprites in Game
```bash
# Open the game in browser
open ../index.html
```

### Backup Original Sprites
```bash
mkdir backup
cp *.png backup/
```

## 📁 File Structure
```
game/assets/
├── *.png                    # Generated sprites
├── generate_sprites.py      # Sprite generator script
├── generate_sprites.html    # Web-based generator
├── download_commands.md     # This file
└── README.md               # Asset guide
```

## 🎮 Using the Sprites

The game will automatically load these sprites when you:
1. Place the PNG files in the `game/assets/` directory
2. Use the correct naming convention: `{type}_{team}.png`
3. Open the game in a web browser

The sprites will replace the colored rectangles with proper fighter graphics!
