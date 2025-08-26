#!/usr/bin/env python3
"""
Better Fighter Sprite Generator
Creates more detailed and recognizable fighter sprites
"""

from PIL import Image, ImageDraw
import os

def create_warrior_sprite(team, size=32):
    """Create a warrior sprite with sword and shield"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (torso)
    draw.rectangle([12, 16, 20, 24], fill='#8B4513', outline='#654321', width=1)  # Brown armor
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Helmet
    draw.ellipse([12, 6, 20, 12], fill='#C0C0C0', outline='#808080', width=1)  # Silver helmet
    draw.rectangle([14, 4, 18, 8], fill=team_colors[team], outline='#333333', width=1)  # Team colored crest
    
    # Arms
    draw.rectangle([8, 18, 12, 22], fill='#8B4513', outline='#654321', width=1)   # Left arm (shield arm)
    draw.rectangle([20, 18, 24, 22], fill='#8B4513', outline='#654321', width=1)  # Right arm (sword arm)
    
    # Shield (left hand)
    draw.ellipse([4, 16, 14, 26], fill='#8B4513', outline='#654321', width=2)  # Shield
    draw.ellipse([6, 18, 12, 24], fill=team_colors[team], outline='#333333', width=1)  # Shield emblem
    
    # Sword (right hand)
    draw.rectangle([24, 20, 28, 22], fill='#C0C0C0', outline='#808080', width=1)  # Sword blade
    draw.rectangle([26, 18, 28, 20], fill='#FFD700', outline='#DAA520', width=1)  # Sword hilt
    draw.rectangle([27, 16, 29, 18], fill='#8B4513', outline='#654321', width=1)  # Sword handle
    
    # Legs
    draw.rectangle([14, 24, 18, 28], fill='#8B4513', outline='#654321', width=1)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#8B4513', outline='#654321', width=1)  # Right leg
    
    return img

def create_archer_sprite(team, size=32):
    """Create an archer sprite with bow and arrow"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (leather armor)
    draw.rectangle([12, 16, 20, 24], fill='#8B4513', outline='#654321', width=1)  # Brown leather
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Hood
    draw.ellipse([12, 6, 20, 12], fill=team_colors[team], outline='#333333', width=1)  # Team colored hood
    draw.ellipse([14, 8, 18, 12], fill='#FFE4C4', outline='#DEB887', width=1)  # Face opening
    
    # Arms
    draw.rectangle([8, 18, 12, 22], fill='#8B4513', outline='#654321', width=1)   # Left arm (bow arm)
    draw.rectangle([20, 18, 24, 22], fill='#8B4513', outline='#654321', width=1)  # Right arm (arrow arm)
    
    # Bow (left hand)
    draw.ellipse([2, 14, 18, 26], fill='#8B4513', outline='#654321', width=2)  # Bow
    draw.ellipse([4, 16, 16, 24], fill='#654321', outline='#333333', width=1)  # Bow string
    
    # Arrow (right hand)
    draw.rectangle([22, 20, 26, 22], fill='#8B4513', outline='#654321', width=1)  # Arrow shaft
    draw.polygon([(26, 20), (28, 21), (26, 22)], fill='#C0C0C0', outline='#808080')  # Arrow tip
    draw.rectangle([24, 19, 26, 21], fill=team_colors[team], outline='#333333', width=1)  # Arrow fletching
    
    # Quiver
    draw.ellipse([26, 16, 30, 24], fill='#8B4513', outline='#654321', width=1)  # Quiver
    draw.rectangle([27, 18, 29, 22], fill=team_colors[team], outline='#333333', width=1)  # Quiver strap
    
    # Legs
    draw.rectangle([14, 24, 18, 28], fill='#8B4513', outline='#654321', width=1)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#8B4513', outline='#654321', width=1)  # Right leg
    
    return img

def create_tank_sprite(team, size=32):
    """Create a tank sprite with heavy armor"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (heavy armor)
    draw.rectangle([10, 16, 22, 26], fill='#666666', outline='#333333', width=2)  # Heavy armor
    draw.rectangle([12, 18, 20, 24], fill='#444444', outline='#222222', width=1)  # Armor plates
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Heavy helmet
    draw.ellipse([11, 4, 21, 14], fill='#666666', outline='#333333', width=2)  # Heavy helmet
    draw.rectangle([13, 6, 19, 10], fill=team_colors[team], outline='#333333', width=1)  # Team colored visor
    draw.rectangle([14, 8, 18, 12], fill='#222222', outline='#000000', width=1)  # Eye slit
    
    # Shoulder armor
    draw.ellipse([8, 14, 16, 20], fill='#666666', outline='#333333', width=2)   # Left shoulder
    draw.ellipse([16, 14, 24, 20], fill='#666666', outline='#333333', width=2)  # Right shoulder
    
    # Arms (armored)
    draw.rectangle([8, 20, 14, 24], fill='#666666', outline='#333333', width=2)   # Left arm
    draw.rectangle([18, 20, 24, 24], fill='#666666', outline='#333333', width=2)  # Right arm
    
    # Gauntlets
    draw.ellipse([6, 22, 16, 28], fill='#666666', outline='#333333', width=2)   # Left gauntlet
    draw.ellipse([16, 22, 26, 28], fill='#666666', outline='#333333', width=2)  # Right gauntlet
    
    # Mace (right hand)
    draw.rectangle([26, 20, 30, 22], fill='#8B4513', outline='#654321', width=1)  # Mace handle
    draw.ellipse([28, 16, 32, 20], fill='#666666', outline='#333333', width=2)  # Mace head
    draw.rectangle([29, 17, 31, 19], fill='#C0C0C0', outline='#808080', width=1)  # Mace spikes
    
    # Legs (armored)
    draw.rectangle([12, 26, 18, 30], fill='#666666', outline='#333333', width=2)  # Left leg
    draw.rectangle([18, 26, 24, 30], fill='#666666', outline='#333333', width=2)  # Right leg
    
    # Greaves
    draw.ellipse([10, 28, 20, 32], fill='#666666', outline='#333333', width=2)   # Left greave
    draw.ellipse([20, 28, 30, 32], fill='#666666', outline='#333333', width=2)  # Right greave
    
    return img

def main():
    """Generate all fighter sprites with better designs"""
    
    # Create output directory
    output_dir = "."
    os.makedirs(output_dir, exist_ok=True)
    
    # Fighter types and teams
    fighter_types = ['warrior', 'archer', 'tank']
    teams = ['blue', 'red']
    
    print("Generating better fighter sprites...")
    
    for fighter_type in fighter_types:
        for team in teams:
            # Create sprite based on type
            if fighter_type == 'warrior':
                sprite = create_warrior_sprite(team)
            elif fighter_type == 'archer':
                sprite = create_archer_sprite(team)
            elif fighter_type == 'tank':
                sprite = create_tank_sprite(team)
            
            # Save sprite
            filename = f"{fighter_type}_{team}.png"
            filepath = os.path.join(output_dir, filename)
            sprite.save(filepath, 'PNG')
            
            print(f"Created: {filename}")
    
    print("\nAll better sprites generated successfully!")
    print("Files created:")
    for fighter_type in fighter_types:
        for team in teams:
            filename = f"{fighter_type}_{team}.png"
            print(f"  - {filename}")

if __name__ == "__main__":
    main()
