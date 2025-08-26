# Fighter Assets

This directory contains assets for the 2D fighting game fighters.

## Current Assets

The game currently uses simple geometric shapes for fighters, but you can replace them with proper sprites.

## Recommended Free Asset Sources

### 1. OpenGameArt.org
- **URL**: https://opengameart.org/
- **Search terms**: "fighter", "warrior", "archer", "tank", "character sprite"
- **License**: Various free licenses
- **Best for**: 2D sprites, character animations

### 2. Itch.io (Free Assets)
- **URL**: https://itch.io/game-assets/free
- **Search terms**: "fighter sprites", "character pack", "rpg characters"
- **License**: Various, check individual assets
- **Best for**: Complete character packs, animations

### 3. Kenney.nl
- **URL**: https://kenney.nl/assets
- **License**: CC0 (completely free)
- **Best for**: Game-ready assets, consistent style

### 4. Game-icons.net
- **URL**: https://game-icons.net/
- **License**: CC BY 3.0
- **Best for**: Simple icons, weapon sprites

### 5. Flaticon.com
- **URL**: https://www.flaticon.com/
- **License**: Free with attribution
- **Best for**: Simple character icons

## Asset Requirements

For this game, you'll need:

### Fighter Types
1. **Warrior**: Balanced fighter with sword/shield
2. **Archer**: Ranged fighter with bow
3. **Tank**: Heavy fighter with armor

### Recommended Specifications
- **Size**: 32x32 or 64x64 pixels
- **Format**: PNG with transparency
- **Style**: Consistent art style across all fighters
- **Animations**: Idle, walking, attacking (optional)

### File Naming Convention
```
warrior_blue.png
warrior_red.png
archer_blue.png
archer_red.png
tank_blue.png
tank_red.png
```

## Implementation

To use custom sprites, you'll need to:

1. Place sprite files in this `assets/` directory
2. Update the `game.js` file to load and use the sprites
3. Modify the `Fighter.draw()` method to render sprites instead of rectangles

## Quick Start with Placeholder Sprites

If you want to test with custom sprites immediately, you can:

1. Download free sprites from the sources above
2. Rename them according to the naming convention
3. Place them in this directory
4. The game will automatically use them if they exist

## Creating Your Own Sprites

If you want to create custom sprites:

### Tools
- **Aseprite**: Professional sprite editor
- **Piskel**: Free online sprite editor
- **GIMP**: Free image editor
- **Photoshop**: Professional image editor

### Tips
- Keep sprites simple and readable at small sizes
- Use consistent color palettes
- Include transparent backgrounds
- Test sprites in the game context
