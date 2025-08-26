#!/usr/bin/env python3
"""
Fighter Sprite Generator
Generates simple fighter sprites for the 2D fighting game
"""

from PIL import Image, ImageDraw
import os

def create_sprite(fighter_type, team, size=32):
    """Create a sprite for a specific fighter type and team"""
    
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Fighter type designs
    if fighter_type == 'warrior':
        # Warrior: Sword and shield
        # Body
        draw.rectangle([8, 8, 24, 24], fill='#ffffff', outline='#333333', width=1)
        # Shield
        draw.rectangle([12, 12, 20, 20], fill='#8B4513', outline='#654321', width=1)
        # Sword
        draw.rectangle([22, 16, 26, 20], fill='#C0C0C0', outline='#808080', width=1)
        draw.rectangle([24, 14, 26, 22], fill='#FFD700', outline='#DAA520', width=1)
        
    elif fighter_type == 'archer':
        # Archer: Bow and arrow
        # Body
        draw.rectangle([8, 8, 24, 24], fill='#ffffff', outline='#333333', width=1)
        # Bow
        draw.ellipse([6, 12, 26, 20], fill='#8B4513', outline='#654321', width=1)
        # Arrow
        draw.rectangle([14, 12, 18, 20], fill='#8B4513', outline='#654321', width=1)
        # Arrow tip
        draw.polygon([(18, 14), (22, 16), (18, 18)], fill='#C0C0C0', outline='#808080')
        
    elif fighter_type == 'tank':
        # Tank: Heavy armor
        # Body
        draw.rectangle([8, 8, 24, 24], fill='#ffffff', outline='#333333', width=1)
        # Armor plates
        draw.rectangle([6, 6, 26, 26], fill='#666666', outline='#333333', width=2)
        draw.rectangle([10, 10, 22, 22], fill='#444444', outline='#222222', width=1)
        # Helmet
        draw.ellipse([10, 4, 22, 12], fill='#666666', outline='#333333', width=1)
        
    # Team color accent
    accent_color = team_colors[team]
    draw.rectangle([0, 0, size-1, size-1], outline=accent_color, width=2)
    
    return img

def main():
    """Generate all fighter sprites"""
    
    # Create output directory
    output_dir = "."
    os.makedirs(output_dir, exist_ok=True)
    
    # Fighter types and teams
    fighter_types = ['warrior', 'archer', 'tank']
    teams = ['blue', 'red']
    
    print("Generating fighter sprites...")
    
    for fighter_type in fighter_types:
        for team in teams:
            # Create sprite
            sprite = create_sprite(fighter_type, team)
            
            # Save sprite
            filename = f"{fighter_type}_{team}.png"
            filepath = os.path.join(output_dir, filename)
            sprite.save(filepath, 'PNG')
            
            print(f"Created: {filename}")
    
    print("\nAll sprites generated successfully!")
    print("Files created:")
    for fighter_type in fighter_types:
        for team in teams:
            filename = f"{fighter_type}_{team}.png"
            print(f"  - {filename}")

if __name__ == "__main__":
    main()
