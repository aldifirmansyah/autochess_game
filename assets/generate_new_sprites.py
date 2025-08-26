#!/usr/bin/env python3
"""
New Fighter Sprite Generator - High Quality
Creates detailed and cool sprites for assassin, paladin, healer, and berserker
"""

from PIL import Image, ImageDraw
import os

def create_assassin_sprite(team, size=32):
    """Create an assassin sprite with dark cloak and daggers"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (dark leather armor)
    draw.rectangle([12, 16, 20, 24], fill='#2F2F2F', outline='#1A1A1A', width=1)  # Dark armor
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Dark hood with prominent team color
    draw.ellipse([12, 6, 20, 12], fill='#1A1A1A', outline='#000000', width=1)  # Dark hood
    draw.ellipse([14, 8, 18, 12], fill='#2F2F2F', outline='#1A1A1A', width=1)  # Hood opening
    # Prominent team color band across hood
    draw.rectangle([12, 9, 20, 11], fill=team_colors[team], outline='#333333', width=1)
    
    # Arms (dark leather)
    draw.rectangle([8, 18, 12, 22], fill='#2F2F2F', outline='#1A1A1A', width=1)   # Left arm
    draw.rectangle([20, 18, 24, 22], fill='#2F2F2F', outline='#1A1A1A', width=1)  # Right arm
    
    # Daggers
    draw.rectangle([6, 20, 10, 22], fill='#C0C0C0', outline='#808080', width=1)   # Left dagger blade
    draw.rectangle([8, 18, 10, 20], fill='#8B4513', outline='#654321', width=1)   # Left dagger handle
    draw.polygon([(6, 20), (4, 21), (6, 22)], fill='#2F4F4F', outline='#1A1A1A')   # Left dagger tip
    
    draw.rectangle([22, 20, 26, 22], fill='#C0C0C0', outline='#808080', width=1)  # Right dagger blade
    draw.rectangle([22, 18, 24, 20], fill='#8B4513', outline='#654321', width=1)  # Right dagger handle
    draw.polygon([(26, 20), (28, 21), (26, 22)], fill='#2F4F4F', outline='#1A1A1A') # Right dagger tip
    
    # Belt with pouches and team color accent
    draw.rectangle([10, 22, 22, 24], fill='#1A1A1A', outline='#000000', width=1)  # Belt
    draw.ellipse([12, 20, 16, 24], fill='#2F2F2F', outline='#1A1A1A', width=1)    # Left pouch
    draw.ellipse([16, 20, 20, 24], fill='#2F2F2F', outline='#1A1A1A', width=1)    # Right pouch
    # Team color accent on belt
    draw.rectangle([14, 22, 18, 24], fill=team_colors[team], outline='#333333', width=1)
    
    # Legs (dark leather)
    draw.rectangle([14, 24, 18, 28], fill='#2F2F2F', outline='#1A1A1A', width=1)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#2F2F2F', outline='#1A1A1A', width=1)  # Right leg
    
    # Boots with team color accents
    draw.ellipse([12, 26, 20, 30], fill='#1A1A1A', outline='#000000', width=1)    # Left boot
    draw.ellipse([20, 26, 28, 30], fill='#1A1A1A', outline='#000000', width=1)    # Right boot
    # Team color boot accents
    draw.rectangle([14, 28, 18, 30], fill=team_colors[team], outline='#333333', width=1)  # Left boot accent
    draw.rectangle([22, 28, 26, 30], fill=team_colors[team], outline='#333333', width=1)  # Right boot accent
    
    return img

def create_paladin_sprite(team, size=32):
    """Create a paladin sprite with holy armor and mace"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (holy armor)
    draw.rectangle([12, 16, 20, 24], fill='#FFD700', outline='#DAA520', width=2)  # Golden armor
    draw.rectangle([14, 18, 18, 22], fill='#FFF8DC', outline='#DAA520', width=1)  # Armor plates
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Holy helmet with prominent team color
    draw.ellipse([12, 6, 20, 12], fill='#FFD700', outline='#DAA520', width=2)  # Golden helmet
    draw.rectangle([14, 8, 18, 12], fill='#FFF8DC', outline='#DAA520', width=1)  # Helmet visor
    # Large team colored cross on helmet
    draw.rectangle([15, 9, 17, 11], fill=team_colors[team], outline='#333333', width=1)  # Vertical part
    draw.rectangle([14, 10, 18, 10], fill=team_colors[team], outline='#333333', width=1)  # Horizontal part
    
    # Shoulder armor with team color
    draw.ellipse([8, 14, 16, 20], fill='#FFD700', outline='#DAA520', width=2)   # Left shoulder
    draw.ellipse([16, 14, 24, 20], fill='#FFD700', outline='#DAA520', width=2)  # Right shoulder
    # Team color shoulder accents
    draw.ellipse([10, 16, 14, 18], fill=team_colors[team], outline='#333333', width=1)   # Left shoulder accent
    draw.ellipse([18, 16, 22, 18], fill=team_colors[team], outline='#333333', width=1)  # Right shoulder accent
    
    # Arms (armored)
    draw.rectangle([8, 20, 14, 24], fill='#FFD700', outline='#DAA520', width=2)   # Left arm
    draw.rectangle([18, 20, 24, 24], fill='#FFD700', outline='#DAA520', width=2)  # Right arm
    
    # Gauntlets with team color
    draw.ellipse([6, 22, 16, 28], fill='#FFD700', outline='#DAA520', width=2)   # Left gauntlet
    draw.ellipse([16, 22, 26, 28], fill='#FFD700', outline='#DAA520', width=2)  # Right gauntlet
    # Team color gauntlet accents
    draw.ellipse([8, 24, 14, 26], fill=team_colors[team], outline='#333333', width=1)   # Left gauntlet accent
    draw.ellipse([18, 24, 24, 26], fill=team_colors[team], outline='#333333', width=1)  # Right gauntlet accent
    
    # Holy mace (right hand)
    draw.rectangle([26, 20, 30, 22], fill='#8B4513', outline='#654321', width=1)  # Mace handle
    draw.ellipse([28, 16, 32, 20], fill='#FFD700', outline='#DAA520', width=2)  # Mace head
    # Mace spikes
    draw.ellipse([29, 17, 31, 19], fill='#C0C0C0', outline='#808080', width=1)  # Center spike
    draw.ellipse([27, 17, 29, 19], fill='#C0C0C0', outline='#808080', width=1)  # Left spike
    draw.ellipse([29, 15, 31, 17], fill='#C0C0C0', outline='#808080', width=1)  # Top spike
    draw.ellipse([29, 19, 31, 21], fill='#C0C0C0', outline='#808080', width=1)  # Bottom spike
    
    # Legs (armored)
    draw.rectangle([14, 24, 18, 28], fill='#FFD700', outline='#DAA520', width=2)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#FFD700', outline='#DAA520', width=2)  # Right leg
    
    # Greaves with team color
    draw.ellipse([12, 26, 20, 30], fill='#FFD700', outline='#DAA520', width=2)   # Left greave
    draw.ellipse([20, 26, 28, 30], fill='#FFD700', outline='#DAA520', width=2)  # Right greave
    # Team color greave accents
    draw.ellipse([14, 28, 18, 30], fill=team_colors[team], outline='#333333', width=1)   # Left greave accent
    draw.ellipse([22, 28, 26, 30], fill=team_colors[team], outline='#333333', width=1)  # Right greave accent
    
    # Large holy symbol on chest
    draw.rectangle([16, 18, 18, 20], fill=team_colors[team], outline='#333333', width=1)  # Cross symbol
    draw.rectangle([15, 19, 19, 19], fill=team_colors[team], outline='#333333', width=1)  # Cross horizontal
    
    return img

def create_healer_sprite(team, size=32):
    """Create a healer sprite with robes and staff"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (healing robes)
    draw.rectangle([12, 16, 20, 24], fill='#87CEEB', outline='#4682B4', width=1)  # Light blue robes
    draw.rectangle([14, 18, 18, 22], fill='#E0F6FF', outline='#87CEEB', width=1)  # Robe details
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Hood with prominent team color
    draw.ellipse([12, 6, 20, 12], fill='#87CEEB', outline='#4682B4', width=1)  # Light blue hood
    draw.ellipse([14, 8, 18, 12], fill='#E0F6FF', outline='#87CEEB', width=1)  # Hood opening
    # Large team color band across hood
    draw.rectangle([12, 9, 20, 11], fill=team_colors[team], outline='#333333', width=1)
    
    # Arms (robed)
    draw.rectangle([8, 18, 12, 22], fill='#87CEEB', outline='#4682B4', width=1)   # Left arm
    draw.rectangle([20, 18, 24, 22], fill='#87CEEB', outline='#4682B4', width=1)  # Right arm
    
    # Staff (left hand)
    draw.rectangle([4, 8, 8, 24], fill='#8B4513', outline='#654321', width=1)  # Staff shaft
    draw.ellipse([2, 6, 10, 14], fill='#00BFFF', outline='#0080FF', width=2)  # Staff orb
    draw.ellipse([1, 5, 11, 15], outline='#00BFFF', width=1)  # Orb glow
    draw.ellipse([3, 7, 9, 13], fill='#E0F6FF', outline='#00BFFF', width=1)  # Orb center
    
    # Healing potion (right hand)
    draw.ellipse([22, 20, 26, 24], fill='#00FF00', outline='#008000', width=1)  # Potion bottle
    draw.rectangle([23, 18, 25, 20], fill='#8B4513', outline='#654321', width=1)  # Bottle neck
    draw.ellipse([22, 16, 26, 20], fill='#00FF00', outline='#008000', width=1)  # Bottle top
    
    # Belt with pouches and team color
    draw.rectangle([10, 22, 22, 24], fill='#4682B4', outline='#2F4F4F', width=1)  # Belt
    draw.ellipse([12, 20, 16, 24], fill='#87CEEB', outline='#4682B4', width=1)    # Left pouch
    draw.ellipse([16, 20, 20, 24], fill='#87CEEB', outline='#4682B4', width=1)    # Right pouch
    # Team color accent on belt
    draw.rectangle([14, 22, 18, 24], fill=team_colors[team], outline='#333333', width=1)
    
    # Legs (robed)
    draw.rectangle([14, 24, 18, 28], fill='#87CEEB', outline='#4682B4', width=1)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#87CEEB', outline='#4682B4', width=1)  # Right leg
    
    # Boots with team color
    draw.ellipse([12, 26, 20, 30], fill='#4682B4', outline='#2F4F4F', width=1)    # Left boot
    draw.ellipse([20, 26, 28, 30], fill='#4682B4', outline='#2F4F4F', width=1)    # Right boot
    # Team color boot accents
    draw.rectangle([14, 28, 18, 30], fill=team_colors[team], outline='#333333', width=1)  # Left boot accent
    draw.rectangle([22, 28, 26, 30], fill=team_colors[team], outline='#333333', width=1)  # Right boot accent
    
    # Large healing aura effect
    draw.ellipse([15, 4, 17, 6], fill=team_colors[team], outline='#333333', width=1)  # Aura symbol
    draw.ellipse([14, 5, 18, 5], fill=team_colors[team], outline='#333333', width=1)  # Aura horizontal
    
    return img

def create_berserker_sprite(team, size=32):
    """Create a berserker sprite with fierce armor and axe"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Team colors
    team_colors = {
        'blue': '#4ecdc4',
        'red': '#ff6b6b'
    }
    
    # Body (fierce armor)
    draw.rectangle([12, 16, 20, 24], fill='#CD5C5C', outline='#8B0000', width=2)  # Red armor
    draw.rectangle([14, 18, 18, 22], fill='#DC143C', outline='#8B0000', width=1)  # Armor plates
    
    # Head
    draw.ellipse([13, 8, 19, 14], fill='#FFE4C4', outline='#DEB887', width=1)  # Skin tone
    
    # Horned helmet with prominent team color
    draw.ellipse([12, 6, 20, 12], fill='#8B0000', outline='#660000', width=2)  # Red helmet
    draw.rectangle([14, 8, 18, 12], fill='#CD5C5C', outline='#8B0000', width=1)  # Helmet visor
    # Large team color band across helmet
    draw.rectangle([12, 9, 20, 11], fill=team_colors[team], outline='#333333', width=1)
    # Horns
    draw.polygon([(12, 6), (10, 2), (14, 6)], fill='#8B4513', outline='#654321')  # Left horn
    draw.polygon([(20, 6), (22, 2), (18, 6)], fill='#8B4513', outline='#654321')  # Right horn
    
    # Shoulder armor (spiked) with team color
    draw.ellipse([8, 14, 16, 20], fill='#CD5C5C', outline='#8B0000', width=2)   # Left shoulder
    draw.ellipse([16, 14, 24, 20], fill='#CD5C5C', outline='#8B0000', width=2)  # Right shoulder
    # Team color shoulder accents
    draw.ellipse([10, 16, 14, 18], fill=team_colors[team], outline='#333333', width=1)   # Left shoulder accent
    draw.ellipse([18, 16, 22, 18], fill=team_colors[team], outline='#333333', width=1)  # Right shoulder accent
    # Shoulder spikes
    draw.polygon([(12, 14), (12, 12), (14, 14)], fill='#C0C0C0', outline='#808080')  # Left spike
    draw.polygon([(20, 14), (20, 12), (18, 14)], fill='#C0C0C0', outline='#808080')  # Right spike
    
    # Arms (armored)
    draw.rectangle([8, 20, 14, 24], fill='#CD5C5C', outline='#8B0000', width=2)   # Left arm
    draw.rectangle([18, 20, 24, 24], fill='#CD5C5C', outline='#8B0000', width=2)  # Right arm
    
    # Gauntlets (spiked) with team color
    draw.ellipse([6, 22, 16, 28], fill='#CD5C5C', outline='#8B0000', width=2)   # Left gauntlet
    draw.ellipse([16, 22, 26, 28], fill='#CD5C5C', outline='#8B0000', width=2)  # Right gauntlet
    # Team color gauntlet accents
    draw.ellipse([8, 24, 14, 26], fill=team_colors[team], outline='#333333', width=1)   # Left gauntlet accent
    draw.ellipse([18, 24, 24, 26], fill=team_colors[team], outline='#333333', width=1)  # Right gauntlet accent
    # Gauntlet spikes
    draw.polygon([(11, 22), (11, 20), (13, 22)], fill='#C0C0C0', outline='#808080')  # Left gauntlet spike
    draw.polygon([(21, 22), (21, 20), (19, 22)], fill='#C0C0C0', outline='#808080')  # Right gauntlet spike
    
    # Battle axe (right hand)
    draw.rectangle([26, 20, 30, 22], fill='#8B4513', outline='#654321', width=1)  # Axe handle
    # Axe blade
    draw.polygon([(26, 18), (30, 16), (30, 24), (26, 22)], fill='#C0C0C0', outline='#808080')
    draw.rectangle([28, 20, 30, 22], fill='#8B4513', outline='#654321', width=1)  # Axe handle extension
    # Axe edge
    draw.line([(26, 18), (30, 16)], fill='#2F4F4F', width=1)
    draw.line([(26, 22), (30, 24)], fill='#2F4F4F', width=1)
    
    # Legs (armored)
    draw.rectangle([14, 24, 18, 28], fill='#CD5C5C', outline='#8B0000', width=2)  # Left leg
    draw.rectangle([18, 24, 22, 28], fill='#CD5C5C', outline='#8B0000', width=2)  # Right leg
    
    # Greaves (spiked) with team color
    draw.ellipse([12, 26, 20, 30], fill='#CD5C5C', outline='#8B0000', width=2)   # Left greave
    draw.ellipse([20, 26, 28, 30], fill='#CD5C5C', outline='#8B0000', width=2)  # Right greave
    # Team color greave accents
    draw.ellipse([14, 28, 18, 30], fill=team_colors[team], outline='#333333', width=1)   # Left greave accent
    draw.ellipse([22, 28, 26, 30], fill=team_colors[team], outline='#333333', width=1)  # Right greave accent
    # Greave spikes
    draw.polygon([(16, 26), (16, 24), (18, 26)], fill='#C0C0C0', outline='#808080')  # Left greave spike
    draw.polygon([(24, 26), (24, 24), (22, 26)], fill='#C0C0C0', outline='#808080')  # Right greave spike
    
    # Large fierce symbol on chest
    draw.rectangle([16, 18, 18, 20], fill=team_colors[team], outline='#333333', width=1)  # Team symbol
    draw.rectangle([15, 19, 19, 19], fill=team_colors[team], outline='#333333', width=1)  # Symbol horizontal
    
    return img

def main():
    """Generate all new fighter sprites with high quality"""
    
    # Create output directory
    output_dir = "."
    os.makedirs(output_dir, exist_ok=True)
    
    # New fighter types and teams
    fighter_types = ['assassin', 'paladin', 'healer', 'berserker']
    teams = ['blue', 'red']
    
    print("Generating high-quality new fighter sprites...")
    
    for fighter_type in fighter_types:
        for team in teams:
            # Create sprite based on type
            if fighter_type == 'assassin':
                sprite = create_assassin_sprite(team)
            elif fighter_type == 'paladin':
                sprite = create_paladin_sprite(team)
            elif fighter_type == 'healer':
                sprite = create_healer_sprite(team)
            elif fighter_type == 'berserker':
                sprite = create_berserker_sprite(team)
            
            # Save sprite
            filename = f"{fighter_type}_{team}.png"
            filepath = os.path.join(output_dir, filename)
            sprite.save(filepath, 'PNG')
            
            print(f"Created: {filename}")
    
    print("\nAll high-quality new sprites generated successfully!")
    print("Files created:")
    for fighter_type in fighter_types:
        for team in teams:
            filename = f"{fighter_type}_{team}.png"
            print(f"  - {filename}")

if __name__ == "__main__":
    main()
