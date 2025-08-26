#!/bin/bash

# Professional Fighter Asset Downloader
# This script downloads high-quality fighter sprites from various sources

echo "🎮 Downloading Professional Fighter Assets..."

# Create directories
mkdir -p professional_assets
mkdir -p backup

# Backup existing sprites
echo "📦 Backing up existing sprites..."
cp *.png backup/ 2>/dev/null || echo "No existing sprites to backup"

# Download from OpenGameArt.org (free fighter sprites)
echo "🌐 Downloading from OpenGameArt.org..."
curl -L -o "professional_assets/opengameart_fighters.zip" \
  "https://opengameart.org/sites/default/files/fighter_sprites.zip" \
  --max-time 30 --retry 3 || echo "OpenGameArt download failed"

# Download from Kenney.nl (high quality)
echo "🎨 Downloading from Kenney.nl..."
curl -L -o "professional_assets/kenney_characters.zip" \
  "https://kenney.nl/content/3-assets/25-characters/characters.zip" \
  --max-time 30 --retry 3 || echo "Kenney download failed"

# Download from GitHub repositories
echo "📚 Downloading from GitHub repositories..."

# 2D Character Pack
curl -L -o "professional_assets/2d_characters.zip" \
  "https://github.com/0x72/2D-Character-Pack/archive/refs/heads/master.zip" \
  --max-time 60 --retry 3 || echo "2D Character Pack download failed"

# RPG Character Pack
curl -L -o "professional_assets/rpg_characters.zip" \
  "https://github.com/0x72/RPG-Character-Pack/archive/refs/heads/master.zip" \
  --max-time 60 --retry 3 || echo "RPG Character Pack download failed"

# Extract downloaded files
echo "📂 Extracting downloaded assets..."

for file in professional_assets/*.zip; do
    if [ -f "$file" ]; then
        echo "Extracting $file..."
        unzip -q "$file" -d "professional_assets/extracted/" 2>/dev/null || echo "Failed to extract $file"
    fi
done

# List downloaded files
echo "📋 Downloaded files:"
ls -la professional_assets/

echo ""
echo "🎯 Next steps:"
echo "1. Check the 'professional_assets/extracted/' directory for downloaded sprites"
echo "2. Find suitable warrior, archer, and tank sprites"
echo "3. Rename them to match the game format: {type}_{team}.png"
echo "4. Copy them to the main assets directory"
echo ""
echo "💡 Alternative: Use the generated sprites in the current directory"
echo "   They are already properly named and ready to use!"

# Show current sprites
echo ""
echo "🎮 Current sprites ready to use:"
ls -la *.png 2>/dev/null || echo "No sprites found in current directory"
