class Fighter {
    constructor(side, type, x, y) {
        this.side = side;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.speed = 0;
        this.health = 0;
        this.maxHealth = 0;
        this.attackDamage = 0;
        this.attackRange = 0;
        this.attackCooldown = 0;
        this.lastAttackTime = 0;
        this.target = null;
        this.state = 'walking'; // walking, attacking, dead
        this.animationSpeed = 0.1;
        this.sprite = null;
        this.spriteLoaded = false;
        this.projectiles = []; // For archer arrows and crossbow bolts
        this.attackAnimation = 0; // For attack animation timing
        this.collisionRadius = 20; // Physical collision radius

        // Spawn properties
        this.spawnCost = 0;
        this.spawnCooldown = 1000; // Default 1 second cooldown

        // A* Pathfinding
        this.path = [];
        this.pathIndex = 0;
        this.pathfindingCooldown = 0;
        this.lastPathfindingTime = 0;
        this.pathfindingInterval = 30; // Recalculate path every 30 frames
        this.lastPathTarget = null;

        // Stuck detection and prevention
        this.lastPosition = { x: x, y: y };
        this.stuckTime = 0;
        this.stuckThreshold = 3; // Number of 60-frame intervals without movement = stuck
        this.stuckCheckFrames = 0;
        this.lastMoveTime = 0;
        this.escapeDirection = null;
        this.escapeTimer = 0;

        // New ability system - initialize with default values
        this.evasion = 0; // Percentage chance to dodge attacks (0-100)
        this.criticalChance = 0; // Percentage chance to deal critical damage (0-100)
        this.criticalMultiplier = 2.0; // Multiplier for critical damage
        this.lifesteal = 0; // Percentage of damage dealt that heals the attacker (0-100)
        this.healAura = 0; // Health per second healed to nearby allies
        this.healAuraRange = 120; // Range of heal aura effect (increased from 60)
        this.lastHealAuraTime = 0; // Track when last heal aura was applied
        this.healAuraCooldown = 1000; // Heal aura ticks every 1 second

        // Visual effects for abilities
        this.healEffectTimer = 0; // Timer for healing visual effect
        this.criticalEffectTimer = 0; // Timer for critical hit visual effect
        this.evasionEffectTimer = 0; // Timer for evasion visual effect

        this.setupStats();
        this.loadSprite();
    }

    setupStats() {
        switch (this.type) {
            case 'warrior':
                // IDENTITY: Melee crit gambler — every swing is a gamble.
                // EXTREME: Highest crit chance in game (40%), solid multiplier.
                // WEAK: No defense (no evasion, no lifesteal), fragile HP.
                this.speed = 1.1;
                this.maxHealth = 130;
                this.attackDamage = 18;
                this.attackRange = 45;
                this.attackCooldown = 1000;
                this.spawnCost = 2;
                this.spawnCooldown = 1000;
                this.criticalChance = 40;
                this.criticalMultiplier = 2.5;
                break;

            case 'archer':
                // IDENTITY: Ghost — almost impossible to hit.
                // EXTREME: Highest evasion in game (45%). A ranged unit that almost never takes damage.
                // WEAK: Lowest damage of any unit, very low HP.
                this.speed = 1.4;
                this.maxHealth = 70;
                this.attackDamage = 16;
                this.attackRange = 170;
                this.attackCooldown = 1200;
                this.spawnCost = 2;
                this.spawnCooldown = 1000;
                this.evasion = 45;
                break;

            case 'tank':
                // IDENTITY: Living wall — pure HP absorber, no tricks.
                // EXTREME: Highest HP in game (600). The only fighter with zero abilities.
                // WEAK: Near-useless offense, slowest unit, no abilities whatsoever.
                this.speed = 0.6;
                this.maxHealth = 600;
                this.attackDamage = 12;
                this.attackRange = 45;
                this.attackCooldown = 1200;
                this.spawnCost = 3;
                this.spawnCooldown = 1500;
                // No abilities — the total absence of abilities IS the identity.
                break;

            case 'troll':
                // IDENTITY: Unkillable brute — heals faster than most units can damage it.
                // EXTREME: Highest lifesteal in game (55%) on a high-HP, hard-hitting body.
                // WEAK: Slowest attacker, no crit, no evasion, slow to spawn.
                this.speed = 1.0;
                this.maxHealth = 450;
                this.attackDamage = 45;
                this.attackRange = 50;
                this.attackCooldown = 1400;
                this.spawnCost = 5;
                this.spawnCooldown = 3000;
                this.lifesteal = 55;
                break;

            case 'crossbow':
                // IDENTITY: Sniper — extreme range and devastating crits on fragile targets.
                // EXTREME: Longest range in game (260), highest crit multiplier of range units (3.0x).
                // WEAK: Ultra-fragile (70 HP), slow to reload, no survivability.
                this.speed = 0.9;
                this.maxHealth = 70;
                this.attackDamage = 24;
                this.attackRange = 260;
                this.attackCooldown = 1400;
                this.spawnCost = 3;
                this.spawnCooldown = 1500;
                this.criticalChance = 30;
                this.criticalMultiplier = 3.0;
                break;

            case 'assassin':
                // IDENTITY: Burst killer — closes instantly and explodes targets with insane crit multiplier.
                // EXTREME: Fastest movement, highest crit multiplier (4.0x) — a crit nearly one-shots anyone.
                // WEAK: Very low HP, moderate base damage (only crits make it devastating).
                this.speed = 1.8;
                this.maxHealth = 80;
                this.attackDamage = 20;
                this.attackRange = 50;
                this.attackCooldown = 700;
                this.spawnCost = 4;
                this.spawnCooldown = 2000;
                this.criticalChance = 25;
                this.criticalMultiplier = 4.0;
                this.evasion = 20;
                break;

            case 'paladin':
                // IDENTITY: Holy guardian — sacrifices all offense to sustain the whole team.
                // EXTREME: Strongest heal aura in game (22 HP/s to all nearby allies).
                // WEAK: Almost no damage output, slow, purely exists to enable teammates.
                this.speed = 0.8;
                this.maxHealth = 300;
                this.attackDamage = 10;
                this.attackRange = 50;
                this.attackCooldown = 1400;
                this.spawnCost = 4;
                this.spawnCooldown = 2000;
                this.healAura = 22;
                break;

            case 'healer':
                // IDENTITY: Battle medic — fragile ranged support that survives via evasion.
                // EXTREME: High evasion (35%) keeps it alive; heal aura sustains the backline.
                // WEAK: Lowest damage in game, dies in 2 hits — worthless without protection.
                this.speed = 1.0;
                this.maxHealth = 65;
                this.attackDamage = 8;
                this.attackRange = 150;
                this.attackCooldown = 1600;
                this.spawnCost = 3;
                this.spawnCooldown = 1500;
                this.healAura = 14;
                this.evasion = 35;
                break;

            case 'berserker':
                // IDENTITY: Speed demon — insane attack speed, sustained by lifesteal alone.
                // EXTREME: Fastest attack cooldown in game (0.4s = 60 DPS). No other unit comes close.
                // WEAK: Tiny HP pool (100), no crit, no evasion — dies instantly if lifesteal is outpaced.
                this.speed = 1.8;
                this.maxHealth = 100;
                this.attackDamage = 24;
                this.attackRange = 45;
                this.attackCooldown = 400;
                this.spawnCost = 5;
                this.spawnCooldown = 2000;
                this.lifesteal = 40;
                break;
        }
        this.health = this.maxHealth;

        // Shield system
        this.shield = 0;
        this.maxShield = 200;
        this.shieldActive = false;
        this.baseRange = 80; // Range within base to get shield
    }

    update(enemies, allFighters) {
        if (this.state === 'dead') return;

        this.attackAnimation = Math.max(0, this.attackAnimation - 0.1); // Decay attack animation

        // Decay visual effect timers
        this.healEffectTimer = Math.max(0, this.healEffectTimer - 1);
        this.criticalEffectTimer = Math.max(0, this.criticalEffectTimer - 1);
        this.evasionEffectTimer = Math.max(0, this.evasionEffectTimer - 1);

        // Filter out dead fighters from allFighters
        const aliveFighters = allFighters.filter(f => f.state !== 'dead' && f.health > 0);

        // Update shield system
        this.updateShield();

        // Update heal aura
        this.updateHealAura(aliveFighters);

        // Update projectiles
        this.updateProjectiles(enemies);

        // Check if stuck
        this.checkIfStuck();

        // Find nearest enemy
        this.findTarget(enemies, aliveFighters);

        // Clear target if it's dead
        if (this.target && this.target.state === 'dead') {
            this.target = null;
        }

        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.attackRange && this.hasLineOfSight(this.x, this.y, this.target.x, this.target.y)) {
            this.state = 'attacking';
            this.attack();
        } else {
            this.state = 'walking';
            this.moveTowardsTarget(aliveFighters);
        }
    }

    updateProjectiles(enemies) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            // Move projectile
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;

            let projectileHitEnemy = false; // Track if projectile was used
            // Check for hits on fighters
            for (let enemy of enemies) {
                if (enemy.side !== this.side && enemy.state !== 'dead' && enemy.health > 0) {
                    const dx = projectile.x - enemy.x;
                    const dy = projectile.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 20) {
                        enemy.takeDamage(projectile.damage);

                        // Apply lifesteal if the attacker has it
                        if (projectile.attacker && projectile.attacker.lifesteal > 0 && projectile.damage > 0) {
                            const healAmount = Math.floor(projectile.damage * (projectile.attacker.lifesteal / 100));
                            projectile.attacker.health = Math.min(projectile.attacker.maxHealth, projectile.attacker.health + healAmount);
                            projectile.attacker.healEffectTimer = 60; // Show healing effect for 60 frames
                        }

                        this.projectiles.splice(i, 1);
                        projectileHitEnemy = true;
                        break;
                    }
                }
            }
            if (projectileHitEnemy) {
                break;
            }

            // Check for hits on enemy base
            const enemyBase = this.side === 'blue' ? window.game.bases.red : window.game.bases.blue;
            if (enemyBase.health > 0) {
                const dx = projectile.x - enemyBase.x;
                const dy = projectile.y - enemyBase.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 40) { // Larger hit area for base
                    enemyBase.health -= projectile.damage;
                    this.projectiles.splice(i, 1);

                    // Check if base is destroyed
                    if (enemyBase.health <= 0) {
                        this.handleBaseDestruction(enemyBase.side);
                    }
                    break;
                }
            }

            // Remove projectile if it exceeds attack range or goes off screen
            const dx = projectile.x - projectile.startX;
            const dy = projectile.y - projectile.startY;
            const travelDistance = Math.sqrt(dx * dx + dy * dy);
            if (travelDistance > this.attackRange || projectile.x < 0 || projectile.x > 1200 || projectile.y < 0 || projectile.y > 600) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    findTarget(enemies, aliveFighters) {
        let bestTarget = null;
        let bestScore = -Infinity;

        // First, try to find enemy fighters (prioritize over base)
        for (let enemy of enemies) {
            if (enemy.side !== this.side && enemy.state !== 'dead' && enemy.health > 0) {
                const dx = this.x - enemy.x;
                const dy = this.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Calculate target score based on multiple factors
                let score = 0;

                // Distance factor (closer is better, but not too close)
                if (distance <= this.attackRange) {
                    score += 1000; // Heavy bonus for enemies in range
                } else {
                    score += 1000 / (distance + 1); // Distance penalty
                }

                // Health factor (prefer weaker enemies)
                const healthPercent = enemy.health / enemy.maxHealth;
                score += (1 - healthPercent) * 200; // Bonus for low health enemies

                // Check if this enemy is already being targeted by too many allies
                // We need to check allFighters (not enemies) to find our allies
                const targetingAllies = aliveFighters.filter(f =>
                    f.side === this.side && f.target === enemy && f.state !== 'dead'
                ).length;

                if (targetingAllies < 2) { // Prefer enemies with fewer attackers
                    score += 100;
                } else {
                    score -= targetingAllies * 50; // Penalty for over-targeting
                }

                // Archer-specific line of sight bonus
                if (this.attackRange > 100) {
                    const hasLOS = this.hasLineOfSight(this.x, this.y, enemy.x, enemy.y);
                    if (hasLOS) {
                        score += 800; // Heavy bonus for clear line of sight
                    } else {
                        score -= 500; // Heavy penalty for blocked line of sight
                    }
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = enemy;
                }
            }
        }

        // If no enemy fighters found, target the enemy base
        if (!bestTarget) {
            const enemyBase = this.side === 'blue' ? window.game.bases.red : window.game.bases.blue;
            if (enemyBase.health > 0) {
                bestTarget = enemyBase;
            }
        }

        this.target = bestTarget;
    }

    moveTowardsTarget(aliveFighters) {
        if (!this.target || this.target.state === 'dead' || this.target.health <= 0) return;
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Normal movement for non-archers or archers with clear line of sight
            this.moveTowardsTargetWithAStar(aliveFighters);

            // Keep fighter within canvas bounds
            this.x = Math.max(this.width / 2, Math.min(1200 - this.width / 2, this.x));
            this.y = Math.max(this.height / 2, Math.min(600 - this.height / 2, this.y));
        }
    }

    moveTowardsTargetWithAStar(aliveFighters) {
        if (!this.target) return;

        // Try to find a path using A*
        if (this.findPathToTarget(this.target, aliveFighters)) {
            // Move along the calculated path
            if (!this.moveAlongPath(aliveFighters)) {
                // Path is blocked, try direct movement as fallback
                this.moveDirectlyToTarget(this.target, aliveFighters);
            }
        } else {
            // No path found, use direct movement
            this.moveDirectlyToTarget(this.target, aliveFighters);
        }
    }

    moveDirectlyToTarget(target, aliveFighters) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Normalize direction and apply speed
            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;

            // Try to move
            const newX = this.x + vx;
            const newY = this.y + vy;

            // Check collision
            if (!this.wouldCollide(newX, newY, aliveFighters)) {
                this.x = newX;
                this.y = newY;
            } else if (this.trySlidingMovement(vx, vy, aliveFighters)) {
                // Slid around the blocker — no further action needed
            } else {
                // Sliding also failed — use escape or random movement as last resort
                if (this.isStuck()) {
                    const escapeDir = this.getEscapeDirection(aliveFighters);
                    if (escapeDir) {
                        const escapeX = this.x + escapeDir.dx * this.speed;
                        const escapeY = this.y + escapeDir.dy * this.speed;
                        if (!this.wouldCollide(escapeX, escapeY, aliveFighters)) {
                            this.x = escapeX;
                            this.y = escapeY;
                        }
                    } else {
                        this.tryRandomMovement(aliveFighters);
                    }
                } else {
                    this.tryRandomMovement(aliveFighters);
                }
            }
        }
    }

    moveTowardsCenter(aliveFighters) {
        // Move towards the center of the canvas
        const centerTarget = { x: 600, y: 300 };

        // Use A* to find path to center
        if (this.findPathToTarget(centerTarget, aliveFighters)) {
            // Move along the calculated path
            if (!this.moveAlongPath(aliveFighters)) {
                // Path is blocked, try direct movement as fallback
                this.moveDirectlyToTarget(centerTarget, aliveFighters);
            }
        } else {
            // No path found, use direct movement
            this.moveDirectlyToTarget(centerTarget, aliveFighters);
        }

        // Keep fighter within canvas bounds
        this.x = Math.max(this.width / 2, Math.min(1200 - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(600 - this.height / 2, this.y));
    }

    attack() {
        const currentTime = Date.now();

        // Check attack cooldown - prevent rapid-fire attacks
        if (currentTime - this.lastAttackTime < this.attackCooldown) {
            return; // Still on cooldown, can't attack yet
        }



        // Validate target exists and is alive
        if (!this.target || this.target.state === 'dead' || this.target.health <= 0) {
            this.target = null; // Clear invalid target
            return;
        }

        // DETERMINE TARGET TYPE: Base vs Fighter
        // Bases have: side, health, maxHealth properties
        // Fighters have: side, health, maxHealth, state properties
        const isTargetingBase = !this.target.state; // Bases don't have 'state' property

        if (isTargetingBase) {
            // ATTACKING A BASE
            if (this.target.health > 0) { // Base still has health
                if (this.type === 'archer' || this.type === 'crossbow' || this.type === 'healer') {
                    // ARCHER/CROSSBOW/HEALER ATTACKING BASE
                    this.createProjectile(); // Shoot projectile at base
                    this.lastAttackTime = currentTime;
                    this.attackAnimation = 1.0;
                } else {
                    // MELEE FIGHTER ATTACKING BASE
                    // Calculate damage with critical hit chance
                    let damage = this.attackDamage;
                    let isCritical = false;

                    if (Math.random() * 100 < this.criticalChance) {
                        damage = Math.floor(damage * this.criticalMultiplier);
                        isCritical = true;
                        this.criticalEffectTimer = 60; // Show critical effect for 60 frames
                    }

                    this.target.health -= damage; // Direct damage to base
                    this.lastAttackTime = currentTime;
                    this.attackAnimation = 1.0;

                    // Check if base is destroyed
                    if (this.target.health <= 0) {
                        this.handleBaseDestruction(this.target.side);
                    }
                }
            }
        } else {
            // ATTACKING ANOTHER FIGHTER
            if (this.target.health > 0) { // Fighter still alive
                if (this.type === 'archer' || this.type === 'crossbow' || this.type === 'healer') {
                    // ARCHER/CROSSBOW/HEALER ATTACKING FIGHTER
                    this.createProjectile(); // Shoot projectile at fighter
                    this.lastAttackTime = currentTime;
                    this.attackAnimation = 1.0;
                } else {
                    // MELEE FIGHTER ATTACKING FIGHTER
                    // Calculate damage with critical hit chance
                    let damage = this.attackDamage;
                    let isCritical = false;

                    if (Math.random() * 100 < this.criticalChance) {
                        damage = Math.floor(damage * this.criticalMultiplier);
                        isCritical = true;
                        this.criticalEffectTimer = 60; // Show critical effect for 60 frames
                    }

                    // Apply damage to target
                    const targetHealthBefore = this.target.health;
                    this.target.takeDamage(damage);

                    // Apply lifesteal if this fighter has it
                    if (this.lifesteal > 0 && damage > 0) {
                        const healAmount = Math.floor(damage * (this.lifesteal / 100));
                        const oldHealth = this.health;
                        this.health = Math.min(this.maxHealth, this.health + healAmount);
                        this.healEffectTimer = 60; // Show healing effect for 60 frames
                    }

                    this.lastAttackTime = currentTime;
                    this.attackAnimation = 1.0;
                }
            } else {
                // Fighter target is dead, clear it
                this.target = null;
            }
        }
    }

    createProjectile() {
        if (!this.target || this.target.state === 'dead' || this.target.health <= 0) return;

        const startX = this.x + (this.width / 2 + 5) * (this.side === 'blue' ? 1 : -1);
        const startY = this.y;

        // Calculate direction to target
        const dx = this.target.x - startX;
        const dy = this.target.y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction and apply speed
        let speed = 3; // Default speed
        if (this.type === 'crossbow') {
            speed = 4; // Crossbow bolts are faster
        } else if (this.type === 'healer') {
            speed = 2.5; // Magic balls are slower but more magical
        }
        const vx = (dx / distance) * speed;
        const vy = (dy / distance) * speed;

        // Calculate damage with critical hit chance
        let damage = this.attackDamage;
        let isCritical = false;

        if (Math.random() * 100 < this.criticalChance) {
            damage = Math.floor(damage * this.criticalMultiplier);
            isCritical = true;
            this.criticalEffectTimer = 60; // Show critical effect for 60 frames
        }

        const projectile = {
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            damage: damage,
            startX: startX,
            startY: startY,
            type: this.type, // Add type to distinguish between arrows and bolts
            isCritical: isCritical,
            attacker: this // Reference to the attacker for lifesteal
        };
        this.projectiles.push(projectile);
    }

    updateShield() {
        // Check if fighter is within base range (X-axis only, full Y-axis coverage)
        const base = this.side === 'blue' ? window.game.bases.blue : window.game.bases.red;
        const dx = Math.abs(this.x - base.x);

        if (dx <= this.baseRange && base.health > 0) {
            // Within base range - activate shield (regardless of Y position)
            if (!this.shieldActive) {
                this.shieldActive = true;
                this.shield = this.maxShield;
            }
        } else {
            // Outside base range - deactivate shield
            if (this.shieldActive) {
                this.shieldActive = false;
                this.shield = 0;
            }
        }
    }

    updateHealAura(allFighters) {
        // Only apply heal aura if this fighter has the ability
        if (this.healAura <= 0) return;

        const currentTime = Date.now();
        if (currentTime - this.lastHealAuraTime < this.healAuraCooldown) return;

        // Calculate team heal auras (non-stacking by type)
        const teamHealAuras = this.calculateTeamHealAuras(allFighters);

        // Find nearby allies to heal (including self)
        for (let ally of allFighters) {
            if (ally.side === this.side && ally.state !== 'dead' && ally.health > 0) {
                const dx = this.x - ally.x;
                const dy = this.y - ally.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= this.healAuraRange) {
                    // Apply team heal auras (non-stacking by type)
                    let totalHealAmount = 0;
                    for (let auraType in teamHealAuras) {
                        totalHealAmount += teamHealAuras[auraType];
                    }

                    // Convert to per-tick healing
                    const healPerTick = totalHealAmount * (this.healAuraCooldown / 1000);
                    ally.health = Math.min(ally.maxHealth, ally.health + healPerTick);
                }
            }
        }

        this.lastHealAuraTime = currentTime;
    }

    calculateTeamHealAuras(allFighters) {
        const teamHealAuras = {};

        // Find all heal aura fighters on the same team
        for (let fighter of allFighters) {
            if (fighter.side === this.side && fighter.state !== 'dead' && fighter.health > 0 && fighter.healAura > 0) {
                // Only take the highest heal aura value for each fighter type
                if (!teamHealAuras[fighter.type] || fighter.healAura > teamHealAuras[fighter.type]) {
                    teamHealAuras[fighter.type] = fighter.healAura;
                }
            }
        }

        return teamHealAuras;
    }

    takeDamage(damage) {
        // Check for evasion first
        if (Math.random() * 100 < this.evasion) {
            // Attack was evaded - no damage taken
            this.evasionEffectTimer = 60; // Show evasion effect for 60 frames
            return;
        }

        // Shield absorbs damage first
        if (this.shield > 0) {
            if (this.shield >= damage) {
                this.shield -= damage;
                damage = 0;
            } else {
                damage -= this.shield;
                this.shield = 0;
            }
        }

        // Remaining damage goes to health
        if (damage > 0) {
            this.health -= damage;
        }

        if (this.health <= 0) {
            this.health = 0;
            this.state = 'dead';
            this.target = null; // Clear target when dead

            // Award gold to the opposing team for the kill
            const killerTeam = this.side === 'blue' ? 'red' : 'blue';
            if (killerTeam === 'blue') {
                window.game.blueGold += 1;
                window.game.blueKillStreak += 1;
                window.game.redKillStreak = 0; // Reset opponent's streak
            } else {
                window.game.redGold += 1;
                window.game.redKillStreak += 1;
                window.game.blueKillStreak = 0; // Reset opponent's streak
            }
        }
    }

    handleBaseDestruction(destroyedSide) {
        // Determine the winning side
        const winningSide = destroyedSide === 'blue' ? 'red' : 'blue';

        // Create victory popup with euphoric effects
        this.showVictoryPopup(winningSide);

        // Stop the game loop
        window.game.gameRunning = false;
    }

    showVictoryPopup(winningSide) {
        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'victory-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, 
                ${winningSide === 'blue' ? '#1e3a8a' : '#dc2626'}20, 
                ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'}40);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: victoryFadeIn 0.8s ease-out;
        `;

        // Create victory text
        const victoryText = document.createElement('div');
        victoryText.style.cssText = `
            font-size: 4rem;
            font-weight: bold;
            color: ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'};
            text-shadow: 0 0 20px ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'}80;
            margin-bottom: 2rem;
            text-align: center;
            animation: victoryTextGlow 2s ease-in-out infinite alternate;
        `;
        victoryText.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 1rem;">🏆</div>
            <div>${winningSide.toUpperCase()} TEAM</div>
            <div style="font-size: 2rem; margin-top: 1rem;">VICTORY!</div>
        `;

        // Create celebration particles
        const particlesContainer = document.createElement('div');
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;

        // Create confetti particles
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const colors = winningSide === 'blue'
                    ? ['#3b82f6', '#1e40af', '#60a5fa', '#93c5fd']
                    : ['#ef4444', '#dc2626', '#f87171', '#fca5a5'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                particle.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${randomColor};
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: confettiFall 3s linear forwards;
                    box-shadow: 0 0 10px ${randomColor};
                `;
                particlesContainer.appendChild(particle);
            }, i * 50);
        }

        // Create restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = '🎮 Play Again';
        restartButton.style.cssText = `
            padding: 1rem 2rem;
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
            animation: buttonPulse 2s ease-in-out infinite;
        `;
        restartButton.onmouseover = () => {
            restartButton.style.transform = 'scale(1.1)';
            restartButton.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
        };
        restartButton.onmouseout = () => {
            restartButton.style.transform = 'scale(1)';
            restartButton.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
        };
        restartButton.onclick = () => {
            location.reload();
        };

        // Add elements to popup
        popup.appendChild(particlesContainer);
        popup.appendChild(victoryText);
        popup.appendChild(restartButton);

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes victoryTextGlow {
                from { 
                    text-shadow: 0 0 20px ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'}80;
                    transform: scale(1);
                }
                to { 
                    text-shadow: 0 0 40px ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'}, 0 0 60px ${winningSide === 'blue' ? '#3b82f6' : '#ef4444'};
                    transform: scale(1.05);
                }
            }
            
            @keyframes confettiFall {
                0% { 
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% { 
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes buttonPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);

        // Add popup to page
        document.body.appendChild(popup);

        // Add sound effect (if available)
        this.playVictorySound();
    }

    playVictorySound() {
        // Create a simple victory sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Create a victory fanfare
            const frequencies = [523, 659, 784, 1047, 1319, 1568]; // C major scale
            let currentNote = 0;

            const playNote = () => {
                if (currentNote < frequencies.length) {
                    oscillator.frequency.setValueAtTime(frequencies[currentNote], audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    currentNote++;
                    setTimeout(playNote, 300);
                }
            };

            oscillator.start();
            playNote();

            setTimeout(() => {
                oscillator.stop();
            }, 2000);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    loadSprite() {
        const spritePath = `assets/${this.type}_${this.side}.png`;
        this.sprite = new Image();
        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };
        this.sprite.onerror = () => {
            this.spriteLoaded = false;
            console.log(`Sprite not found: ${spritePath}`);
        };
        this.sprite.src = spritePath;
    }

    draw(ctx) {
        if (this.state === 'dead') return;

        // Draw sprite if available, otherwise fall back to rectangle
        if (this.spriteLoaded && this.sprite) {
            ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Draw fighter body (fallback)
            ctx.fillStyle = this.side === 'blue' ? '#4ecdc4' : '#ff6b6b';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

            // Draw fighter type indicator
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.type.charAt(0).toUpperCase(), this.x, this.y - this.height / 2 - 5);
        }

        // Draw health bar
        this.drawHealthBar(ctx);

        // Draw shield bar
        this.drawShieldBar(ctx);

        // Draw attack animation
        if (this.state === 'attacking') {
            this.drawAttackEffect(ctx);
        }

        // Draw projectiles
        this.drawProjectiles(ctx);

        // Draw ability effects
        this.drawAbilityEffects(ctx);

        // Draw A* path for debugging (optional - uncomment to see paths)
        // this.drawPath(ctx);
    }

    drawPath(ctx) {
        if (this.path.length > 0) {
            ctx.strokeStyle = this.side === 'blue' ? 'rgba(78, 205, 196, 0.6)' : 'rgba(255, 107, 107, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);

            for (let i = this.pathIndex; i < this.path.length; i++) {
                const point = this.path[i];
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();

            // Draw path points
            ctx.fillStyle = this.side === 'blue' ? '#4ecdc4' : '#ff6b6b';
            for (let i = this.pathIndex; i < this.path.length; i++) {
                const point = this.path[i];
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 15;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Health number
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(this.health)}/${this.maxHealth}`, this.x, barY - 2);
    }

    drawShieldBar(ctx) {
        if (this.shield <= 0) return;

        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 25; // Above health bar

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Shield
        const shieldPercent = this.shield / this.maxShield;
        ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
        ctx.fillRect(barX, barY, barWidth * shieldPercent, barHeight);

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Shield number
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(this.shield)}`, this.x, barY - 2);
    }

    drawAttackEffect(ctx) {
        if (this.type === 'archer') {
            // Draw bow pull animation
            const direction = this.side === 'blue' ? 1 : -1;
            const bowX = this.x + (this.width / 2 + 15) * direction;
            const bowY = this.y;

            // Bow string pull effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bowX - 10 * direction, bowY - 5);
            ctx.lineTo(bowX + 10 * direction, bowY + 5);
            ctx.stroke();

            // Bow glow effect
            ctx.fillStyle = `rgba(255, 255, 0, ${0.3 * this.attackAnimation})`;
            ctx.beginPath();
            ctx.arc(bowX, bowY, 15, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'crossbow') {
            // Draw crossbow reload animation
            const direction = this.side === 'blue' ? 1 : -1;
            const crossbowX = this.x + (this.width / 2 + 15) * direction;
            const crossbowY = this.y;

            // Crossbow bolt loading effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(crossbowX - 8 * direction, crossbowY - 3);
            ctx.lineTo(crossbowX + 8 * direction, crossbowY + 3);
            ctx.stroke();

            // Loading indicator
            ctx.fillStyle = `rgba(255, 255, 0, ${0.5 * this.attackAnimation})`;
            ctx.beginPath();
            ctx.arc(crossbowX, crossbowY, 12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Melee weapon swing animation
            this.drawWeaponSwing(ctx);
        }
    }

    drawWeaponSwing(ctx) {
        const direction = this.side === 'blue' ? 1 : -1;
        const swingProgress = this.attackAnimation; // 1.0 to 0.0

        // Calculate swing arc
        const swingStartAngle = direction === 1 ? -Math.PI / 2 : Math.PI / 2;
        const swingEndAngle = direction === 1 ? Math.PI / 2 : -Math.PI / 2;
        const currentAngle = swingStartAngle + (swingEndAngle - swingStartAngle) * (1 - swingProgress);

        // Weapon position
        const weaponLength = 25;
        const weaponX = this.x + Math.cos(currentAngle) * weaponLength;
        const weaponY = this.y + Math.sin(currentAngle) * weaponLength;

        // Draw weapon based on fighter type
        switch (this.type) {
            case 'warrior':
                this.drawSword(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'tank':
                this.drawHammer(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'troll':
                this.drawClub(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'assassin':
                this.drawDagger(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'paladin':
                this.drawMace(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'healer':
                this.drawStaff(ctx, weaponX, weaponY, currentAngle);
                break;
            case 'berserker':
                this.drawAxe(ctx, weaponX, weaponY, currentAngle);
                break;
            default:
                this.drawGenericWeapon(ctx, weaponX, weaponY, currentAngle);
        }

        // Draw swing trail effect
        this.drawSwingTrail(ctx, weaponX, weaponY, currentAngle, swingProgress);
    }

    drawSword(ctx, x, y, angle) {
        const direction = this.side === 'blue' ? 1 : -1;

        // Sword blade
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 20, y + Math.sin(angle + Math.PI) * 20);
        ctx.stroke();

        // Sword handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 8, y + Math.sin(angle + Math.PI) * 8);
        ctx.stroke();

        // Sword guard
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawHammer(ctx, x, y, angle) {
        const direction = this.side === 'blue' ? 1 : -1;

        // Hammer head
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hammer handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 25, y + Math.sin(angle + Math.PI) * 25);
        ctx.stroke();

        // Hammer head detail
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawClub(ctx, x, y, angle) {
        const direction = this.side === 'blue' ? 1 : -1;

        // Club head (spiked)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Club handle
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 20, y + Math.sin(angle + Math.PI) * 20);
        ctx.stroke();

        // Spikes on club
        ctx.fillStyle = '#2F4F4F';
        for (let i = 0; i < 3; i++) {
            const spikeAngle = (i * Math.PI * 2 / 3) + angle;
            const spikeX = x + Math.cos(spikeAngle) * 12;
            const spikeY = y + Math.sin(spikeAngle) * 12;
            ctx.beginPath();
            ctx.moveTo(spikeX, spikeY);
            ctx.lineTo(spikeX + Math.cos(spikeAngle) * 4, spikeY + Math.sin(spikeAngle) * 4);
            ctx.lineTo(spikeX + Math.cos(spikeAngle + Math.PI / 6) * 3, spikeY + Math.sin(spikeAngle + Math.PI / 6) * 3);
            ctx.closePath();
            ctx.fill();
        }
    }

    drawGenericWeapon(ctx, x, y, angle) {
        // Generic weapon (fallback)
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 20, y + Math.sin(angle + Math.PI) * 20);
        ctx.stroke();
    }

    drawDagger(ctx, x, y, angle) {
        // Assassin's dagger
        // Blade
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 15, y + Math.sin(angle + Math.PI) * 15);
        ctx.stroke();

        // Handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 6, y + Math.sin(angle + Math.PI) * 6);
        ctx.stroke();

        // Blade tip
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle + Math.PI) * 15, y + Math.sin(angle + Math.PI) * 15);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 18, y + Math.sin(angle + Math.PI) * 18);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 15, y + Math.sin(angle + Math.PI) * 15);
        ctx.closePath();
        ctx.fill();
    }

    drawMace(ctx, x, y, angle) {
        // Paladin's mace
        // Mace head
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Mace handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 20, y + Math.sin(angle + Math.PI) * 20);
        ctx.stroke();

        // Mace spikes
        ctx.fillStyle = '#C0C0C0';
        for (let i = 0; i < 4; i++) {
            const spikeAngle = (i * Math.PI / 2) + angle;
            const spikeX = x + Math.cos(spikeAngle) * 8;
            const spikeY = y + Math.sin(spikeAngle) * 8;
            ctx.beginPath();
            ctx.arc(spikeX, spikeY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawStaff(ctx, x, y, angle) {
        // Healer's staff
        // Staff shaft
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 25, y + Math.sin(angle + Math.PI) * 25);
        ctx.stroke();

        // Staff orb
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Orb glow
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawAxe(ctx, x, y, angle) {
        // Berserker's axe
        // Axe blade
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 18, y + Math.sin(angle + Math.PI) * 18);
        ctx.lineTo(x + Math.cos(angle + Math.PI + 0.3) * 15, y + Math.sin(angle + Math.PI + 0.3) * 15);
        ctx.lineTo(x + Math.cos(angle + Math.PI - 0.3) * 15, y + Math.sin(angle + Math.PI - 0.3) * 15);
        ctx.closePath();
        ctx.fill();

        // Axe handle
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * 22, y + Math.sin(angle + Math.PI) * 22);
        ctx.stroke();

        // Axe blade edge
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle + Math.PI) * 18, y + Math.sin(angle + Math.PI) * 18);
        ctx.lineTo(x + Math.cos(angle + Math.PI + 0.3) * 15, y + Math.sin(angle + Math.PI + 0.3) * 15);
        ctx.stroke();
    }

    drawSwingTrail(ctx, x, y, angle, progress) {
        // Swing trail effect that fades as the swing progresses
        const trailLength = 15;
        const trailOpacity = 0.6 * progress;

        ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle + Math.PI) * trailLength, y + Math.sin(angle + Math.PI) * trailLength);
        ctx.stroke();

        // Add some sparkle effects for critical hits
        if (this.criticalEffectTimer > 0) {
            ctx.fillStyle = `rgba(255, 215, 0, ${trailOpacity})`;
            for (let i = 0; i < 3; i++) {
                const sparkleX = x + (Math.random() - 0.5) * 20;
                const sparkleY = y + (Math.random() - 0.5) * 20;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawProjectiles(ctx) {
        for (let projectile of this.projectiles) {
            // Calculate projectile direction for visual orientation
            const angle = Math.atan2(projectile.vy, projectile.vx);

            // Critical hit glow effect
            if (projectile.isCritical) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
            }

            if (projectile.type === 'crossbow') {
                // Draw crossbow bolt (thicker, shorter, more mechanical)
                // Bolt shaft
                ctx.strokeStyle = '#2F4F4F'; // Darker, more metallic color
                ctx.lineWidth = 4; // Thicker than arrows
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - 6 * Math.cos(angle), projectile.y - 6 * Math.sin(angle));
                ctx.stroke();

                // Bolt tip (more angular and metallic)
                ctx.fillStyle = '#708090'; // Steel gray
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - 4 * Math.cos(angle) - 3 * Math.sin(angle), projectile.y - 4 * Math.sin(angle) + 3 * Math.cos(angle));
                ctx.lineTo(projectile.x - 4 * Math.cos(angle) + 3 * Math.sin(angle), projectile.y - 4 * Math.sin(angle) - 3 * Math.cos(angle));
                ctx.closePath();
                ctx.fill();

                // Bolt fletching (smaller, more compact)
                ctx.fillStyle = this.side === 'blue' ? '#4ecdc4' : '#ff6b6b';
                const fletchX = projectile.x - 6 * Math.cos(angle);
                const fletchY = projectile.y - 6 * Math.sin(angle);
                ctx.save();
                ctx.translate(fletchX, fletchY);
                ctx.rotate(angle);
                ctx.fillRect(-0.5, -0.5, 1, 1);
                ctx.restore();

                // Bolt trail effect (more intense, shorter)
                const dx = projectile.x - projectile.startX;
                const dy = projectile.y - projectile.startY;
                const travelDistance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = this.attackRange;
                const trailOpacity = Math.max(0, 0.5 * (1 - travelDistance / maxDistance));
                const trailLength = Math.floor(6 * (1 - travelDistance / maxDistance));

                ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - trailLength * Math.cos(angle), projectile.y - trailLength * Math.sin(angle));
                ctx.stroke();
            } else if (projectile.type === 'healer') {
                // Draw magic ball (glowing, magical effect)
                // Magic ball core
                ctx.fillStyle = this.side === 'blue' ? '#00BFFF' : '#FF69B4'; // Blue or pink magic
                ctx.beginPath();
                ctx.arc(projectile.x, projectile.y, 6, 0, 2 * Math.PI);
                ctx.fill();

                // Magic ball glow effect
                ctx.shadowColor = this.side === 'blue' ? '#00BFFF' : '#FF69B4';
                ctx.shadowBlur = 8;
                ctx.fillStyle = this.side === 'blue' ? '#87CEEB' : '#FFB6C1'; // Lighter glow
                ctx.beginPath();
                ctx.arc(projectile.x, projectile.y, 4, 0, 2 * Math.PI);
                ctx.fill();

                // Magic ball center
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(projectile.x, projectile.y, 2, 0, 2 * Math.PI);
                ctx.fill();

                // Magic trail effect (sparkling, magical)
                const dx = projectile.x - projectile.startX;
                const dy = projectile.y - projectile.startY;
                const travelDistance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = this.attackRange;
                const trailOpacity = Math.max(0, 0.6 * (1 - travelDistance / maxDistance));
                const trailLength = Math.floor(8 * (1 - travelDistance / maxDistance));

                // Sparkle trail
                ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - trailLength * Math.cos(angle), projectile.y - trailLength * Math.sin(angle));
                ctx.stroke();

                // Additional sparkles
                for (let i = 0; i < 3; i++) {
                    const sparkleX = projectile.x - (i * 2) * Math.cos(angle) + (Math.random() - 0.5) * 4;
                    const sparkleY = projectile.y - (i * 2) * Math.sin(angle) + (Math.random() - 0.5) * 4;
                    ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity * 0.7})`;
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, 1, 0, 2 * Math.PI);
                    ctx.fill();
                }
            } else {
                // Draw regular arrow (archer)
                // Arrow shaft
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - 8 * Math.cos(angle), projectile.y - 8 * Math.sin(angle));
                ctx.stroke();

                // Arrow tip
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - 3 * Math.cos(angle) - 2 * Math.sin(angle), projectile.y - 3 * Math.sin(angle) + 2 * Math.cos(angle));
                ctx.lineTo(projectile.x - 3 * Math.cos(angle) + 2 * Math.sin(angle), projectile.y - 3 * Math.sin(angle) - 2 * Math.cos(angle));
                ctx.closePath();
                ctx.fill();

                // Arrow fletching
                ctx.fillStyle = this.side === 'blue' ? '#4ecdc4' : '#ff6b6b';
                const fletchX = projectile.x - 8 * Math.cos(angle);
                const fletchY = projectile.y - 8 * Math.sin(angle);
                ctx.save();
                ctx.translate(fletchX, fletchY);
                ctx.rotate(angle);
                ctx.fillRect(-1, -1, 2, 2);
                ctx.restore();

                // Arrow trail effect (fades as arrow travels further)
                const dx = projectile.x - projectile.startX;
                const dy = projectile.y - projectile.startY;
                const travelDistance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = this.attackRange;
                const trailOpacity = Math.max(0, 0.3 * (1 - travelDistance / maxDistance));
                const trailLength = Math.floor(10 * (1 - travelDistance / maxDistance));

                ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - trailLength * Math.cos(angle), projectile.y - trailLength * Math.sin(angle));
                ctx.stroke();
            }

            // Reset shadow effects
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }

    drawAbilityEffects(ctx) {
        // Draw healing effect
        if (this.healEffectTimer > 0) {
            const opacity = this.healEffectTimer / 30;
            // Healing text
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('+HEAL', this.x, this.y - 40);
        }

        // Draw critical hit effect
        if (this.criticalEffectTimer > 0) {
            const opacity = this.criticalEffectTimer / 30;
            // Critical text
            ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CRIT!', this.x, this.y - 40);
        }

        // Draw evasion effect
        if (this.evasionEffectTimer > 0) {
            const opacity = this.evasionEffectTimer / 30;
            // Evasion text
            ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('DODGE!', this.x, this.y - 40);
        }
    }

    wouldCollide(newX, newY, aliveFighters) {
        // Check collision with other fighters
        for (let fighter of aliveFighters) {
            if (fighter !== this) {
                const dx = newX - fighter.x;
                const dy = newY - fighter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.collisionRadius + fighter.collisionRadius;

                if (distance < minDistance) {
                    return true; // Collision detected
                }
            }
        }

        // Check collision with obstacles
        for (let obstacle of window.game.obstacles) {
            const closestX = Math.max(obstacle.x, Math.min(newX, obstacle.x + obstacle.width));
            const closestY = Math.max(obstacle.y, Math.min(newY, obstacle.y + obstacle.height));

            const dx = newX - closestX;
            const dy = newY - closestY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.collisionRadius) {
                return true; // Collision with obstacle
            }
        }

        return false; // No collision
    }

    hasLineOfSight(fromX, fromY, toX, toY) {
        // Check if there's a clear line of sight between two points
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return true;

        // Check multiple points along the line
        const steps = Math.max(10, Math.floor(distance / 5));

        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const checkX = fromX + dx * t;
            const checkY = fromY + dy * t;

            // Check if this point intersects with any obstacle
            for (let obstacle of window.game.obstacles) {
                if (checkX >= obstacle.x && checkX <= obstacle.x + obstacle.width &&
                    checkY >= obstacle.y && checkY <= obstacle.y + obstacle.height) {
                    return false; // Line of sight blocked
                }
            }
        }

        return true; // Clear line of sight
    }

    findBetterShootingPosition(aliveFighters) {
        // For archers, find a position that provides clear line of sight to target
        if (!this.target) return null;

        const searchRadius = 100; // Search radius around current position
        const stepSize = 20; // Step size for position search

        let bestPosition = null;
        let bestScore = -Infinity;

        // Search in a grid pattern around current position
        for (let offsetX = -searchRadius; offsetX <= searchRadius; offsetX += stepSize) {
            for (let offsetY = -searchRadius; offsetY <= searchRadius; offsetY += stepSize) {
                const testX = this.x + offsetX;
                const testY = this.y + offsetY;

                // Check if position is within bounds
                if (testX < this.width / 2 || testX > 1200 - this.width / 2 ||
                    testY < this.height / 2 || testY > 600 - this.height / 2) {
                    continue;
                }

                // Check if position is collision-free
                if (this.wouldCollide(testX, testY, aliveFighters)) {
                    continue;
                }

                // Check line of sight from this position to target
                if (this.hasLineOfSight(testX, testY, this.target.x, this.target.y)) {
                    // Calculate score for this position
                    let score = 0;

                    // Distance to target (closer is better, but not too close)
                    const dx = this.target.x - testX;
                    const dy = this.target.y - testY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= this.attackRange) {
                        score += 1000; // Perfect position - in range with line of sight
                    } else if (distance <= this.attackRange * 1.5) {
                        score += 500; // Good position - close to range
                    } else {
                        score += 200 / (distance + 1); // Distance penalty
                    }

                    // Bonus for positions that don't require much movement
                    const currentDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                    score -= currentDistance * 0.5; // Small penalty for distance from current position

                    // Bonus for positions that provide cover (near obstacles but not blocked)
                    let coverBonus = 0;
                    for (let obstacle of window.game.obstacles) {
                        const obsDx = testX - (obstacle.x + obstacle.width / 2);
                        const obsDy = testY - (obstacle.y + obstacle.height / 2);
                        const obsDistance = Math.sqrt(obsDx * obsDx + obsDy * obsDy);

                        if (obsDistance < 50 && obsDistance > 20) {
                            coverBonus += 100; // Bonus for tactical positioning near cover
                        }
                    }
                    score += coverBonus;

                    if (score > bestScore) {
                        bestScore = score;
                        bestPosition = { x: testX, y: testY };
                    }
                }
            }
        }

        return bestPosition;
    }

    findAlternativePath(aliveFighters, target) {
        const alternativeMoves = [];
        const moveDistance = this.speed;

        // Find all nearby obstacles (both fighters and static obstacles)
        const nearbyObstacles = [];

        // Check for nearby fighters
        for (let fighter of aliveFighters) {
            if (fighter !== this) {
                const dx = this.x - fighter.x;
                const dy = this.y - fighter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.collisionRadius + fighter.collisionRadius;

                if (distance < minDistance + 50) { // Increased detection range
                    nearbyObstacles.push({
                        type: 'fighter',
                        x: fighter.x,
                        y: fighter.y,
                        distance: distance,
                        dx: dx,
                        dy: dy
                    });
                }
            }
        }

        // Check for nearby static obstacles
        for (let obstacle of window.game.obstacles) {
            const closestX = Math.max(obstacle.x, Math.min(this.x, obstacle.x + obstacle.width));
            const closestY = Math.max(obstacle.y, Math.min(this.y, obstacle.y + obstacle.height));

            const dx = this.x - closestX;
            const dy = this.y - closestY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.collisionRadius + 50) { // Increased detection range
                nearbyObstacles.push({
                    type: 'obstacle',
                    x: closestX,
                    y: closestY,
                    distance: distance,
                    dx: dx,
                    dy: dy
                });
            }
        }

        if (nearbyObstacles.length === 0) {
            return alternativeMoves;
        }

        // Sort obstacles by distance
        nearbyObstacles.sort((a, b) => a.distance - b.distance);

        // Calculate direction to target
        const targetDx = target.x - this.x;
        const targetDy = target.y - this.y;
        const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

        if (targetDistance === 0) return alternativeMoves;

        const targetVx = targetDx / targetDistance;
        const targetVy = targetDy / targetDistance;

        // Try more angles and longer distances for better pathfinding
        // Prioritize angles that move away from obstacles in front
        const targetAngle = Math.atan2(targetDy, targetDx) * 180 / Math.PI;
        const angles = [];

        // Add angles that move away from the direct path first
        const perpendicularAngles = [90, -90]; // Perpendicular to target direction
        const sideAngles = [45, 135, -45, -135]; // Side angles
        const backAngles = [180, -180]; // Backward angles as last resort

        // Prioritize angles based on target direction
        for (let angle of perpendicularAngles) {
            angles.push(angle);
        }
        for (let angle of sideAngles) {
            angles.push(angle);
        }
        for (let angle of backAngles) {
            angles.push(angle);
        }

        const distances = [moveDistance, moveDistance * 1.5, moveDistance * 2]; // Multiple distances

        for (let obstacle of nearbyObstacles) {
            const obstacleDx = obstacle.dx;
            const obstacleDy = obstacle.dy;
            const obstacleDistance = obstacle.distance;

            if (obstacleDistance === 0) continue;

            const obstacleVx = obstacleDx / obstacleDistance;
            const obstacleVy = obstacleDy / obstacleDistance;

            for (let angle of angles) {
                const radians = angle * Math.PI / 180;

                // Rotate the obstacle direction vector
                const rotatedX = obstacleVx * Math.cos(radians) - obstacleVy * Math.sin(radians);
                const rotatedY = obstacleVx * Math.sin(radians) + obstacleVy * Math.cos(radians);

                for (let distance of distances) {
                    // Calculate new position with different distances
                    const newX = this.x + rotatedX * distance;
                    const newY = this.y + rotatedY * distance;

                    // Check if this move is valid (considering ALL obstacles)
                    if (!this.wouldCollide(newX, newY, allFighters)) {
                        // Calculate how much this move gets us closer to target
                        const newTargetDx = target.x - newX;
                        const newTargetDy = target.y - newY;
                        const newTargetDistance = Math.sqrt(newTargetDx * newTargetDx + newTargetDy * newTargetDy);

                        const progress = targetDistance - newTargetDistance;

                        // Additional penalty for moving away from target
                        let penalty = 0;
                        if (progress < 0) {
                            penalty = Math.abs(progress) * 1.5; // Reduced penalty for moving away
                        }

                        // Bonus for moving toward target
                        let bonus = 0;
                        if (progress > 0) {
                            bonus = progress * 2; // Increased bonus for moving toward target
                        }

                        // Bonus for longer moves that get us further from obstacles
                        let obstacleClearanceBonus = 0;
                        for (let obs of nearbyObstacles) {
                            const newObsDx = newX - obs.x;
                            const newObsDy = newY - obs.y;
                            const newObsDistance = Math.sqrt(newObsDx * newObsDx + newObsDy * newObsDy);
                            if (newObsDistance > obs.distance) {
                                obstacleClearanceBonus += 50; // Bonus for moving away from obstacles
                            }
                        }

                        const finalScore = progress - penalty + bonus + obstacleClearanceBonus;

                        alternativeMoves.push({
                            x: newX,
                            y: newY,
                            progress: progress,
                            finalScore: finalScore,
                            angle: angle,
                            distance: distance,
                            obstacleDistance: obstacleDistance
                        });
                    }
                }
            }
        }

        // Sort by final score (best moves first)
        alternativeMoves.sort((a, b) => b.finalScore - a.finalScore);

        // Remove duplicate positions (keep the best one)
        const uniqueMoves = [];
        const usedPositions = new Set();

        for (let move of alternativeMoves) {
            const posKey = `${Math.round(move.x / 10) * 10},${Math.round(move.y / 10) * 10}`; // Larger grid for uniqueness
            if (!usedPositions.has(posKey)) {
                usedPositions.add(posKey);
                uniqueMoves.push(move);
            }
        }

        return uniqueMoves.slice(0, 5); // Return top 5 moves for more options
    }

    tryRandomMovement(aliveFighters) {
        // Try random directions to get unstuck when all other movement fails
        const directions = [
            { dx: this.speed, dy: 0 },      // Right
            { dx: -this.speed, dy: 0 },     // Left
            { dx: 0, dy: this.speed },      // Down
            { dx: 0, dy: -this.speed },     // Up
            { dx: this.speed, dy: this.speed },      // Diagonal down-right
            { dx: -this.speed, dy: this.speed },     // Diagonal down-left
            { dx: this.speed, dy: -this.speed },     // Diagonal up-right
            { dx: -this.speed, dy: -this.speed }     // Diagonal up-left
        ];

        // Shuffle directions to try them in random order
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        // Try each direction
        for (let direction of directions) {
            const newX = this.x + direction.dx;
            const newY = this.y + direction.dy;

            if (!this.wouldCollide(newX, newY, aliveFighters)) {
                this.x = newX;
                this.y = newY;
                return true; // Successfully moved
            }
        }

        return false; // Still stuck
    }

    checkIfStuck() {
        // Sample position every 60 frames — per-frame displacement is too small
        // to distinguish moving fighters from truly stuck ones
        this.stuckCheckFrames++;
        if (this.stuckCheckFrames < 60) return;
        this.stuckCheckFrames = 0;

        const dx = this.x - this.lastPosition.x;
        const dy = this.y - this.lastPosition.y;
        const distanceMoved = Math.sqrt(dx * dx + dy * dy);

        if (distanceMoved < 20) {
            this.stuckTime++;
        } else {
            this.stuckTime = 0;
            this.escapeDirection = null;
            this.escapeTimer = 0;
        }

        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
    }

    isStuck() {
        return this.stuckTime > this.stuckThreshold;
    }

    getEscapeDirection(aliveFighters) {
        // If already escaping, continue in that direction
        if (this.escapeDirection && this.escapeTimer > 0) {
            this.escapeTimer--;
            return this.escapeDirection;
        }

        // Find the direction with the most free space
        const directions = [
            { dx: 1, dy: 0, name: 'right' },
            { dx: -1, dy: 0, name: 'left' },
            { dx: 0, dy: 1, name: 'down' },
            { dx: 0, dy: -1, name: 'up' },
            { dx: 1, dy: 1, name: 'down-right' },
            { dx: -1, dy: 1, name: 'down-left' },
            { dx: 1, dy: -1, name: 'up-right' },
            { dx: -1, dy: -1, name: 'up-left' }
        ];

        let bestDirection = null;
        let bestScore = -Infinity;

        for (let dir of directions) {
            let score = 0;
            const testDistance = this.speed * 3; // Test further ahead

            // Test multiple points along this direction
            for (let i = 1; i <= 3; i++) {
                const testX = this.x + dir.dx * testDistance * i;
                const testY = this.y + dir.dy * testDistance * i;

                if (!this.wouldCollide(testX, testY, aliveFighters)) {
                    score += 100 * i; // Bonus for further clear distance
                } else {
                    score -= 50 * i; // Penalty for obstacles
                    break;
                }
            }

            // Bonus for moving toward target if we have one
            if (this.target) {
                const targetDx = this.target.x - this.x;
                const targetDy = this.target.y - this.y;
                const dotProduct = targetDx * dir.dx + targetDy * dir.dy;
                if (dotProduct > 0) {
                    score += 50; // Bonus for moving toward target
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestDirection = dir;
            }
        }

        if (bestDirection) {
            this.escapeDirection = bestDirection;
            this.escapeTimer = 30; // Escape for 30 frames
            return bestDirection;
        }

        return null;
    }

    // A* Pathfinding Methods
    findPathToTarget(target, aliveFighters) {
        const currentTime = Date.now();

        // Force recalculation if the target changed
        if (this.lastPathTarget !== target) {
            this.lastPathTarget = target;
            this.lastPathfindingTime = 0;
        }

        // Only recalculate path periodically to avoid performance issues
        if (currentTime - this.lastPathfindingTime < this.pathfindingInterval * 16) { // 16ms per frame
            return this.path.length > 0;
        }

        this.lastPathfindingTime = currentTime;

        const startX = Math.floor(this.x / 10) * 10; // Grid alignment
        const startY = Math.floor(this.y / 10) * 10;
        const endX = Math.floor(target.x / 10) * 10;
        const endY = Math.floor(target.y / 10) * 10;

        const path = this.aStarPathfinding(startX, startY, endX, endY);
        if (path && path.length > 0) {
            // Path hysteresis: if we're already partway through a path, don't switch to a new
            // one that goes in a significantly different direction. This stops the fighter from
            // oscillating when A* alternates between two near-equal routes (e.g. above/below a tree).
            if (this.path.length > 0 && this.pathIndex > 0 && this.pathIndex < this.path.length) {
                const curWp  = this.path[this.pathIndex];
                const newWp  = path.length > 1 ? path[1] : path[0];
                const curDx  = curWp.x - this.x;
                const curDy  = curWp.y - this.y;
                const newDx  = newWp.x - this.x;
                const newDy  = newWp.y - this.y;
                const curLen = Math.sqrt(curDx * curDx + curDy * curDy) || 1;
                const newLen = Math.sqrt(newDx * newDx + newDy * newDy) || 1;
                const dot    = (curDx * newDx + curDy * newDy) / (curLen * newLen);

                if (dot < -0.3) {
                    // New path heads in the opposite direction — keep the current path.
                    // The 30-frame cooldown ensures we re-evaluate again soon.
                    return true;
                }
            }

            this.path = path;
            this.pathIndex = 0;
            return true;
        } else {
            this.path = [];
            this.pathIndex = 0;
            return false;
        }
    }

    aStarPathfinding(startX, startY, endX, endY) {
        const gridSize = 10;
        const key = (x, y) => `${x},${y}`;
        const heuristic = (x, y) => Math.sqrt((x - endX) ** 2 + (y - endY) ** 2);

        const openSet = [{ x: startX, y: startY, f: heuristic(startX, startY), g: 0 }];
        const cameFrom = new Map();
        const gScore = new Map([[key(startX, startY), 0]]);
        const closedSet = new Set();

        // Limit nodes explored to keep pathfinding fast.
        // 3000 nodes covers ~55x55 grid cells = ~550x550px, enough for long detours.
        const maxNodes = 3000;
        let nodesExplored = 0;

        const directions = [
            { dx: 0,         dy: -gridSize, cost: 1        },
            { dx: gridSize,  dy: 0,         cost: 1        },
            { dx: 0,         dy: gridSize,  cost: 1        },
            { dx: -gridSize, dy: 0,         cost: 1        },
            { dx: gridSize,  dy: -gridSize, cost: Math.SQRT2 },
            { dx: gridSize,  dy: gridSize,  cost: Math.SQRT2 },
            { dx: -gridSize, dy: gridSize,  cost: Math.SQRT2 },
            { dx: -gridSize, dy: -gridSize, cost: Math.SQRT2 },
        ];

        while (openSet.length > 0 && nodesExplored < maxNodes) {
            // Pick the open node with the lowest f score
            let bestIdx = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < openSet[bestIdx].f) bestIdx = i;
            }
            const current = openSet.splice(bestIdx, 1)[0];
            nodesExplored++;

            // Stop when within attack range of the target
            const cdx = current.x - endX;
            const cdy = current.y - endY;
            if (Math.sqrt(cdx * cdx + cdy * cdy) <= Math.max(this.attackRange, gridSize * 2)) {
                return this.reconstructPathAStar(cameFrom, current.x, current.y, startX, startY);
            }

            const currentKey = key(current.x, current.y);
            closedSet.add(currentKey);

            for (let dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;

                if (nx < 0 || nx > 1200 || ny < 0 || ny > 600) continue;

                const neighborKey = key(nx, ny);
                if (closedSet.has(neighborKey)) continue;
                if (!this.isPositionReachable(nx, ny)) continue;

                const tentativeG = current.g + dir.cost;
                const existingG = gScore.get(neighborKey) ?? Infinity;

                if (tentativeG < existingG) {
                    cameFrom.set(neighborKey, { x: current.x, y: current.y });
                    gScore.set(neighborKey, tentativeG);
                    const f = tentativeG + heuristic(nx, ny);

                    const existingIdx = openSet.findIndex(n => n.x === nx && n.y === ny);
                    if (existingIdx >= 0) {
                        openSet[existingIdx].f = f;
                        openSet[existingIdx].g = tentativeG;
                    } else {
                        openSet.push({ x: nx, y: ny, f, g: tentativeG });
                    }
                }
            }
        }

        return null;
    }

    reconstructPathAStar(cameFrom, currentX, currentY, startX, startY) {
        const path = [];
        let cx = currentX;
        let cy = currentY;

        while (!(cx === startX && cy === startY)) {
            path.unshift({ x: cx, y: cy });
            const prev = cameFrom.get(`${cx},${cy}`);
            if (!prev) break;
            cx = prev.x;
            cy = prev.y;
        }
        path.unshift({ x: startX, y: startY });
        return path;
    }

    getNeighbors(x, y, gridSize, minX, maxX, minY, maxY) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -gridSize }, // Up
            { dx: gridSize, dy: 0 },  // Right
            { dx: 0, dy: gridSize },  // Down
            { dx: -gridSize, dy: 0 }, // Left
            { dx: gridSize, dy: -gridSize }, // Up-Right
            { dx: gridSize, dy: gridSize },  // Down-Right
            { dx: -gridSize, dy: gridSize }, // Down-Left
            { dx: -gridSize, dy: -gridSize } // Up-Left
        ];

        // Round input coordinates to ensure we work with integers
        const roundedX = Math.round(x / gridSize) * gridSize;
        const roundedY = Math.round(y / gridSize) * gridSize;

        for (let dir of directions) {
            const newX = roundedX + dir.dx;
            const newY = roundedY + dir.dy;

            // Check bounds
            if (newX >= minX && newX <= maxX && newY >= minY && newY <= maxY) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    }

    isPositionReachable(x, y) {
        // Check static obstacles using the same AABB closest-point formula as wouldCollide,
        // so the pathfinding grid matches actual movement collision exactly.
        // (obstacle.x,y is top-left corner, same as wouldCollide and draw)
        for (let obstacle of window.game.obstacles) {
            const closestX = Math.max(obstacle.x, Math.min(x, obstacle.x + obstacle.width));
            const closestY = Math.max(obstacle.y, Math.min(y, obstacle.y + obstacle.height));
            const dx = x - closestX;
            const dy = y - closestY;
            if (Math.sqrt(dx * dx + dy * dy) < this.collisionRadius) return false;
        }

        // Check teammate positions so A* routes around them instead of through them.
        // Enemy positions are intentionally excluded — we walk toward enemies (they're targets).
        for (let fighter of window.game.fighters) {
            if (fighter !== this && fighter.side === this.side && fighter.state !== 'dead' && fighter.health > 0) {
                const dx = x - fighter.x;
                const dy = y - fighter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.collisionRadius + fighter.collisionRadius) return false;
            }
        }

        return true;
    }

    isBlockedByStaticObstacle(x, y) {
        // Returns true only if a static obstacle (rock/tree) blocks position x,y.
        // Used to decide whether to discard the current path or just slide around a dynamic blocker.
        for (let obstacle of window.game.obstacles) {
            const closestX = Math.max(obstacle.x, Math.min(x, obstacle.x + obstacle.width));
            const closestY = Math.max(obstacle.y, Math.min(y, obstacle.y + obstacle.height));
            const dx = x - closestX;
            const dy = y - closestY;
            if (Math.sqrt(dx * dx + dy * dy) < this.collisionRadius) return true;
        }
        return false;
    }

    trySlidingMovement(vx, vy, aliveFighters) {
        // When the direct move is blocked, try sliding perpendicular to the intended direction.
        // This lets fighters smoothly go around teammates and other dynamic obstacles.
        const perpX = -vy;
        const perpY = vx;

        const candidates = [
            { x: this.x + perpX,            y: this.y + perpY            }, // slide right
            { x: this.x - perpX,            y: this.y - perpY            }, // slide left
            { x: this.x + vx + perpX * 0.7, y: this.y + vy + perpY * 0.7 }, // forward + right
            { x: this.x + vx - perpX * 0.7, y: this.y + vy - perpY * 0.7 }, // forward + left
        ];

        for (let pos of candidates) {
            if (!this.wouldCollide(pos.x, pos.y, aliveFighters)) {
                this.x = pos.x;
                this.y = pos.y;
                return true;
            }
        }
        return false;
    }

    // heuristic function removed - not needed for Dijkstra's algorithm

    distance(x1, y1, x2, y2) {
        // Euclidean distance
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    reconstructPath(cameFrom, currentX, currentY) {
        const path = [];
        let current = { x: currentX, y: currentY };
        while (current) {
            if (path.length > 0 && current.x === path[0].x && current.y === path[0].y) {
                break;
            }
            path.unshift({ x: current.x, y: current.y });
            current = cameFrom[current.x][current.y];
        }
        return path;
    }

    moveAlongPath(aliveFighters) {
        if (this.path.length === 0 || this.pathIndex >= this.path.length) {
            return false;
        }

        let targetPoint = this.path[this.pathIndex];
        let dx = targetPoint.x - this.x;
        let dy = targetPoint.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If we're close enough to the current path point, advance to next
        if (distance < 15) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                return false; // Reached end of path
            }
            targetPoint = this.path[this.pathIndex];
            // Recalculate direction to the new waypoint
            dx = targetPoint.x - this.x;
            dy = targetPoint.y - this.y;
            distance = Math.sqrt(dx * dx + dy * dy);
        }

        // Move towards the current path point
        if (distance > 0) {
            const vx = (dx / distance) * this.speed;
            const vy = (dy / distance) * this.speed;

            const newX = this.x + vx;
            const newY = this.y + vy;

            if (!this.wouldCollide(newX, newY, aliveFighters)) {
                this.x = newX;
                this.y = newY;
                return true;
            }

            // Blocked — try sliding around the obstacle before giving up on the path.
            if (this.trySlidingMovement(vx, vy, aliveFighters)) {
                return true;
            }

            // Sliding failed. Only discard the path if a static obstacle is the cause.
            // If it's just a teammate in the way, keep the path and let the next
            // pathfinding recalculation (every 30 frames) find a route around them.
            if (this.isBlockedByStaticObstacle(newX, newY)) {
                this.path = [];
                this.pathIndex = 0;
            }
            return false;
        }

        return false;
    }
}

class AIController {
    constructor(game) {
        this.game = game;
        this.strategy = 'balanced';
        this.selectedFighters = [];
        this.lastThinkTime = 0;
        this.thinkInterval = 800;
    }

    // Hardcoded costs — avoids allocating temp Fighter objects in the hot path
    static spawnCost(type) {
        const costs = { warrior: 2, archer: 2, tank: 3, troll: 5, crossbow: 3, assassin: 4, paladin: 4, healer: 3, berserker: 5 };
        return costs[type] ?? 2;
    }

    selectFighters(bluePicks) {
        const tanks  = bluePicks.filter(f => f === 'tank' || f === 'paladin').length;
        const ranged = bluePicks.filter(f => f === 'archer' || f === 'crossbow' || f === 'healer').length;
        const melee  = bluePicks.filter(f => f === 'warrior' || f === 'berserker' || f === 'troll' || f === 'assassin').length;

        if (tanks >= 2)       this.strategy = 'burst';
        else if (ranged >= 2) this.strategy = 'rush';
        else if (melee >= 3)  this.strategy = 'fortress';
        else {
            const opts = ['balanced', 'brute', 'burst', 'rush'];
            this.strategy = opts[Math.floor(Math.random() * opts.length)];
        }

        // Each roster is built around strong synergies — no weak filler units
        const rosters = {
            rush:     ['berserker', 'assassin', 'troll', 'tank', 'crossbow'],
            fortress: ['tank', 'crossbow', 'healer', 'paladin', 'troll'],
            burst:    ['crossbow', 'assassin', 'berserker', 'troll', 'paladin'],
            brute:    ['troll', 'berserker', 'tank', 'paladin', 'crossbow'],
            balanced: ['crossbow', 'troll', 'paladin', 'tank', 'berserker']
        };

        this.selectedFighters = rosters[this.strategy];
        return this.selectedFighters;
    }

    getStrategyLabel() {
        const labels = { rush: '⚡ Rush', fortress: '🏰 Fortress', burst: '💥 Burst', brute: '🐂 Brute', balanced: '⚖️ Balanced' };
        return labels[this.strategy] || this.strategy;
    }

    canSpawn(type) {
        const game = this.game;
        if (!this.selectedFighters.includes(type)) return false;
        if (game.redCount >= game.maxFightersPerSide) return false;
        if ((game.spawnCooldowns.red[type] || 0) > Date.now()) return false;
        if (game.redGold < AIController.spawnCost(type)) return false;
        return true;
    }

    pickFrom(types) {
        for (const type of types) {
            if (this.canSpawn(type)) return type;
        }
        return null;
    }

    // Read the actual battlefield: who is alive, where the fight is, what enemy types exist
    analyzeState() {
        const alive = this.game.fighters.filter(f => f.state !== 'dead');
        const redAlive  = alive.filter(f => f.side === 'red');
        const blueAlive = alive.filter(f => f.side === 'blue');

        // Battle line = average X of all alive fighters.
        // Canvas is 1200px wide. Red spawns right (~x=1100), blue spawns left (~x=100).
        // Low lineX → battle near blue base (AI pushing). High lineX → near red base (AI defending).
        let lineX = 600;
        if (alive.length > 0) lineX = alive.reduce((s, f) => s + f.x, 0) / alive.length;

        // Count durable frontline types red has alive right now
        const redFrontline = redAlive.filter(f => ['tank', 'paladin', 'troll'].includes(f.type)).length;

        // Count each blue fighter type currently alive
        const blueTypeCounts = {};
        for (const f of blueAlive) blueTypeCounts[f.type] = (blueTypeCounts[f.type] || 0) + 1;

        return {
            lineX,
            hasFrontline: redFrontline >= 2,
            blueTypeCounts,
            redCount:  redAlive.length,
            blueCount: blueAlive.length
        };
    }

    // Score each unit in our roster against what the enemy currently has alive.
    // Returns our roster sorted best-first.
    scoreUnits(blueTypeCounts, hasFrontline) {
        // How well each of our unit types counters a given enemy type.
        // Scores are multiplied by enemy count (capped at 4).
        const counterMatrix = {
            // crossbow: great vs durable enemies it can kite, bad vs units that close the gap
            crossbow:  { tank: 3, paladin: 3, troll: 2, warrior: 2, healer: 1 },
            // assassin: hunts down fragile ranged units and supportys
            assassin:  { crossbow: 3, healer: 3, archer: 3, paladin: 1, warrior: 1 },
            // berserker: fast attack volume overwhelms evasion-based and support units
            berserker: { archer: 3, healer: 3, warrior: 2, paladin: 2 },
            // troll: lifesteal makes it beat anything with low burst, excellent vs sustained fighters
            troll:     { paladin: 2, tank: 2, warrior: 2, archer: 2, healer: 1 },
            // tank: absorbs burst and melee rushers
            tank:      { berserker: 3, assassin: 2, warrior: 2, troll: 1 },
            // paladin: heal aura directly counters fast-attacking melee
            paladin:   { assassin: 3, berserker: 3, troll: 1, warrior: 1 },
            // healer: keeps allies alive against sustained damage dealers
            healer:    { troll: 2, berserker: 2, warrior: 1, crossbow: 1 },
            // archer: evasion partially neuters crit-based and melee fighters
            archer:    { warrior: 2, berserker: 1, tank: 1 },
            // warrior: crit gambler — situationally useful, not a dedicated counter
            warrior:   { healer: 1, archer: 1 }
        };

        const scores = {};
        for (const myType of this.selectedFighters) {
            let score = 0;
            const counters = counterMatrix[myType] || {};
            for (const [enemyType, value] of Object.entries(counters)) {
                score += value * Math.min(blueTypeCounts[enemyType] || 0, 4);
            }
            // Formation bonus: ranged units are far more effective when red has a durable frontline
            if (hasFrontline && ['crossbow', 'healer', 'archer'].includes(myType)) score += 5;
            // Small base so units with no counters in the current enemy composition still register
            score += 0.5;
            scores[myType] = score;
        }

        return this.selectedFighters.slice().sort((a, b) => scores[b] - scores[a]);
    }

    think(currentTime) {
        if (currentTime - this.lastThinkTime < this.thinkInterval) return;
        this.lastThinkTime = currentTime;
        this.thinkInterval = 600 + Math.random() * 400;
        this.decideSpawn();
    }

    decideSpawn() {
        const game = this.game;
        const state = this.analyzeState();
        const { lineX, hasFrontline, blueTypeCounts, redCount, blueCount } = state;

        // === EMERGENCY: Battle pushed deep into red territory ===
        if (lineX > 880 || game.bases.red.health < 400) {
            const order = ['tank', 'paladin', 'troll', 'healer', 'berserker', 'crossbow', 'assassin', 'archer', 'warrior']
                .filter(t => this.selectedFighters.includes(t));
            this.spawnMany(order);
            return;
        }

        // === PUSH: Line is well into blue territory — press the advantage ===
        if (lineX < 350 && redCount >= blueCount) {
            const order = ['berserker', 'troll', 'assassin', 'crossbow', 'tank', 'paladin', 'healer', 'archer', 'warrior']
                .filter(t => this.selectedFighters.includes(t));
            this.spawnMany(order);
            return;
        }

        // === RECOVER: Badly outnumbered — spawn anything ready right now ===
        if (redCount < blueCount - 3) {
            this.spawnMany([...this.selectedFighters]);
            return;
        }

        // === NORMAL PLAY: Score units against live enemy composition and commit ===
        const priorityOrder = this.scoreUnits(blueTypeCounts, hasFrontline);
        const desired = priorityOrder[0];
        if (!desired) return;

        if (this.canSpawn(desired)) {
            game.spawnFighter('red', desired);
            // Spend remaining gold on the next-best unit if affordable
            const next = this.pickFrom(priorityOrder.slice(1));
            if (next) game.spawnFighter('red', next);
            return;
        }

        // Desired unit is not yet ready — calculate how long until it is
        const cost        = AIController.spawnCost(desired);
        const now         = Date.now();
        const cdRemaining = Math.max(0, (game.spawnCooldowns.red[desired] || 0) - now);
        const goldNeeded  = Math.max(0, cost - game.redGold);
        const timeToReady = Math.max(cdRemaining, goldNeeded * 1000); // 1 gold/sec

        if (timeToReady <= 3000) {
            return; // Hold gold — the desired unit is coming within 3 seconds
        }

        // Too long to wait — spend gold on next-best available unit
        this.spawnMany(priorityOrder.slice(1));
    }

    spawnMany(orderedList) {
        let spawned = 0;
        while (spawned < 3) {
            const toSpawn = this.pickFrom(orderedList);
            if (!toSpawn) break;
            this.game.spawnFighter('red', toSpawn);
            spawned++;
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fighters = [];
        this.obstacles = [];
        this.blueCount = 0;
        this.redCount = 0;
        this.maxFightersPerSide = 30;
        this.gameRunning = false; // Start with game not running until selection is complete

        // Fighter selection system
        this.selectedFighters = {
            blue: [],
            red: []
        };
        this.maxFightersPerTeam = 5;
        this.fighterSelectionComplete = false;

        // Gold system
        this.blueGold = 0;
        this.redGold = 0;
        this.lastGoldTick = Date.now();

        // Comeback mechanics
        this.blueKillStreak = 0;
        this.redKillStreak = 0;
        this.blueBaseDamage = 0;
        this.redBaseDamage = 0;
        this.lastComebackCheck = Date.now();



        // Spawn cooldowns (store end timestamps)
        this.spawnCooldowns = {
            blue: { warrior: 0, archer: 0, tank: 0, troll: 0, crossbow: 0, assassin: 0, paladin: 0, healer: 0, berserker: 0 },
            red: { warrior: 0, archer: 0, tank: 0, troll: 0, crossbow: 0, assassin: 0, paladin: 0, healer: 0, berserker: 0 }
        };

        // Initialize bases with attack capabilities
        this.bases = {
            blue: {
                x: 50, y: 300, health: 1000, maxHealth: 1000, side: 'blue',
                attackDamage: 40, attackRange: 250, attackCooldown: 500, lastAttackTime: 0
            },
            red: {
                x: 1150, y: 300, health: 1000, maxHealth: 1000, side: 'red',
                attackDamage: 40, attackRange: 250, attackCooldown: 500, lastAttackTime: 0
            }
        };

        // Initialize base projectiles array
        this.baseProjectiles = [];

        // AI mode
        this.aiMode = false;
        this.aiController = null;
        this.currentMode = 'pvp';

        this.setupObstacles();
        this.applyModeLayout();
        this.updateControlLabels();
        this.setupModeSelection();
        this.setupEventListeners();
        this.gameLoop();
    }

    applyModeLayout() {
        document.body.classList.remove('mode-pve', 'mode-pvp');
        document.body.classList.add(this.currentMode === 'ai' ? 'mode-pve' : 'mode-pvp');
    }

    updateControlLabels() {
        const controlTitles = document.querySelectorAll('.controls-panel .control-group h3');
        if (controlTitles.length < 2) return;

        if (this.currentMode === 'ai') {
            controlTitles[0].textContent = 'Blue Team';
            controlTitles[1].textContent = 'AI Team';
            return;
        }

        controlTitles[0].textContent = 'Player 1 (Blue)';
        controlTitles[1].textContent = 'Player 2 (Red)';
    }

    setupObstacles() {
        // Add various obstacles to the battlefield
        this.obstacles = [
            // Central obstacles
            { x: 500, y: 200, width: 40, height: 40, type: 'rock' },
            { x: 600, y: 350, width: 50, height: 50, type: 'tree' },
            { x: 700, y: 150, width: 45, height: 45, type: 'rock' },

            // Left side obstacles
            { x: 300, y: 100, width: 35, height: 35, type: 'rock' },
            { x: 250, y: 300, width: 40, height: 40, type: 'tree' },
            { x: 350, y: 450, width: 30, height: 30, type: 'rock' },

            // Right side obstacles
            { x: 900, y: 120, width: 40, height: 40, type: 'tree' },
            { x: 950, y: 280, width: 35, height: 35, type: 'rock' },
            { x: 850, y: 420, width: 45, height: 45, type: 'tree' },

            // Additional scattered obstacles
            { x: 450, y: 400, width: 30, height: 30, type: 'rock' },
            { x: 750, y: 250, width: 40, height: 40, type: 'tree' },
            { x: 550, y: 500, width: 35, height: 35, type: 'rock' }
        ];
    }

    getFighterProperties(type) {
        // Create a temporary fighter instance to get its properties
        const tempFighter = new Fighter('temp', type, 0, 0);
        return {
            type: type,
            icon: this.getFighterIcon(type),
            name: this.getFighterName(type),
            desc: this.getFighterDescription(type),
            cost: tempFighter.spawnCost,
            cooldown: tempFighter.spawnCooldown / 1000 // Convert from milliseconds to seconds
        };
    }

    getFighterIcon(type) {
        const icons = {
            'warrior': '⚔️',
            'archer': '🏹',
            'tank': '🛡️',
            'troll': '👹',
            'crossbow': '🏹',
            'assassin': '🗡️',
            'paladin': '⚜️',
            'healer': '💊',
            'berserker': '⚔️'
        };
        return icons[type] || '❓';
    }

    getFighterName(type) {
        const names = {
            'warrior': 'Warrior',
            'archer': 'Archer',
            'tank': 'Tank',
            'troll': 'Troll',
            'crossbow': 'Crossbow',
            'assassin': 'Assassin',
            'paladin': 'Paladin',
            'healer': 'Healer',
            'berserker': 'Berserker'
        };
        return names[type] || 'Unknown';
    }

    getFighterDescription(type) {
        const descriptions = {
            'warrior': 'Balanced fighter with critical strikes',
            'archer': 'Fast ranged fighter with high evasion',
            'tank': 'Slow but very durable fighter',
            'troll': 'Strong fighter with lifesteal',
            'crossbow': 'Long range with high critical chance',
            'assassin': 'High critical chance and evasion',
            'paladin': 'Balanced with heal aura',
            'healer': 'Ranged support with heal aura',
            'berserker': 'Fast attack speed with lifesteal'
        };
        return descriptions[type] || 'Unknown fighter type';
    }

    setupModeSelection() {
        // Mode modal is shown by default (display:block in HTML)
        // selectGameMode() is called by the onclick buttons
    }

    selectGameMode(mode) {
        this.currentMode = mode;
        this.aiMode = (mode === 'ai');
        this.applyModeLayout();
        this.updateControlLabels();
        document.getElementById('mode-selection-modal').style.display = 'none';
        this.setupFighterSelection();
    }

    setupFighterSelection() {
        // Show the fighter selection modal
        const modal = document.getElementById('fighter-selection-modal');
        modal.style.display = 'block';

        // Define all available fighter types
        const fighterTypes = ['warrior', 'archer', 'tank', 'troll', 'crossbow', 'assassin', 'paladin', 'healer', 'berserker'];

        // Get fighter properties from Fighter class
        const allFighters = fighterTypes.map(type => this.getFighterProperties(type));

        // Initialize turn-based selection
        this.currentSelectionTurn = 'blue';
        this.selectionComplete = { blue: false, red: false };

        // Populate fighter grids
        this.populateFighterGrid('blue', allFighters);
        if (!this.aiMode) {
            this.populateFighterGrid('red', allFighters);
        }

        // In AI mode, change modal title and blue next button label
        if (this.aiMode) {
            const h2 = document.querySelector('#fighter-selection-modal h2');
            if (h2) h2.textContent = 'Select Your 5 Fighters';
            const instruction = document.getElementById('selection-instruction');
            if (instruction) instruction.textContent = 'You are Blue — choose your fighters';
            const redIndicator = document.getElementById('red-turn-indicator');
            if (redIndicator) redIndicator.style.display = 'none';
            const blueNextBtn = document.getElementById('blue-next-btn');
            if (blueNextBtn) blueNextBtn.textContent = 'Start Battle';
        }

        // Setup navigation buttons
        this.setupSelectionNavigation();

        // Update initial state
        this.updateSelectionUI();
    }

    populateFighterGrid(team, fighters) {
        const grid = document.getElementById(`${team}-fighter-grid`);
        grid.innerHTML = '';

        fighters.forEach(fighter => {
            const option = document.createElement('div');
            option.className = 'fighter-option';
            option.dataset.type = fighter.type;
            option.dataset.team = team;

            option.innerHTML = `
                <div class="fighter-icon">${fighter.icon}</div>
                <div class="fighter-name">${fighter.name}</div>
                <div class="fighter-desc">${fighter.desc}</div>
                <div class="fighter-stats">
                    <span class="cost">💰 ${fighter.cost}</span>
                    <span class="cooldown">⏱️ ${fighter.cooldown}s</span>
                </div>
                <div class="selection-number"></div>
            `;

            option.addEventListener('click', () => this.toggleFighterSelection(team, fighter.type, option));
            grid.appendChild(option);
        });
    }

    toggleFighterSelection(team, fighterType, element) {
        const selectedFighters = this.selectedFighters[team];
        const isSelected = selectedFighters.includes(fighterType);

        if (isSelected) {
            // Remove from selection
            const index = selectedFighters.indexOf(fighterType);
            selectedFighters.splice(index, 1);
            element.classList.remove('selected');
        } else {
            // Add to selection if under limit
            if (selectedFighters.length < this.maxFightersPerTeam) {
                selectedFighters.push(fighterType);
                element.classList.add('selected');
            } else {
                // Show error or disable other options
                return;
            }
        }

        // Update selection status
        this.updateSelectionStatus(team);
        this.updateSelectionUI();
    }

    setupSelectionNavigation() {
        // Setup next button for blue team
        const blueNextBtn = document.getElementById('blue-next-btn');
        blueNextBtn.addEventListener('click', () => this.nextTurn());

        // Setup back button for red team
        const redBackBtn = document.getElementById('red-back-btn');
        redBackBtn.addEventListener('click', () => this.previousTurn());

        // Setup start battle button
        const startButton = document.getElementById('start-battle-btn');
        startButton.addEventListener('click', () => this.startBattle());
    }

    nextTurn() {
        if (this.currentSelectionTurn === 'blue' && this.selectedFighters.blue.length > 0) {
            if (this.aiMode) {
                this.startBattle();
            } else {
                this.currentSelectionTurn = 'red';
                this.selectionComplete.blue = true;
                this.updateSelectionUI();
            }
        }
    }

    previousTurn() {
        if (this.currentSelectionTurn === 'red') {
            this.currentSelectionTurn = 'blue';
            this.updateSelectionUI();
        }
    }

    updateSelectionUI() {
        // Update turn indicators
        const blueIndicator = document.getElementById('blue-turn-indicator');
        const redIndicator = document.getElementById('red-turn-indicator');
        const instruction = document.getElementById('selection-instruction');

        // Reset all indicators
        blueIndicator.classList.remove('active');
        redIndicator.classList.remove('active');

        // Show current turn
        if (this.currentSelectionTurn === 'blue') {
            blueIndicator.classList.add('active');
            instruction.textContent = 'Blue Team\'s turn - Choose 1-5 fighters';
        } else {
            redIndicator.classList.add('active');
            instruction.textContent = 'Red Team\'s turn - Choose 1-5 fighters';
        }

        // Show/hide team selections
        const blueSelection = document.getElementById('blue-team-selection');
        const redSelection = document.getElementById('red-team-selection');

        blueSelection.classList.remove('active');
        redSelection.classList.remove('active');

        if (this.currentSelectionTurn === 'blue') {
            blueSelection.classList.add('active');
        } else {
            redSelection.classList.add('active');
        }

        // Update selection status
        this.updateSelectionStatus('blue');
        if (!this.aiMode) this.updateSelectionStatus('red');

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const blueNextBtn = document.getElementById('blue-next-btn');
        const redBackBtn = document.getElementById('red-back-btn');
        const startButton = document.getElementById('start-battle-btn');

        // Blue team next button
        if (this.currentSelectionTurn === 'blue') {
            blueNextBtn.disabled = this.selectedFighters.blue.length === 0;
        }

        // Red team back button
        redBackBtn.disabled = false;

        // Start battle button
        const bothTeamsComplete = this.selectedFighters.blue.length > 0 &&
            this.selectedFighters.red.length > 0;
        startButton.disabled = !bothTeamsComplete;
    }

    updateSelectionStatus(team) {
        const status = document.getElementById(`${team}-selection-status`);
        const count = this.selectedFighters[team].length;
        status.textContent = `Selected: ${count} fighter${count !== 1 ? 's' : ''} (max ${this.maxFightersPerTeam})`;

        // Update visual feedback
        const grid = document.getElementById(`${team}-fighter-grid`);
        const options = grid.querySelectorAll('.fighter-option');

        options.forEach(option => {
            const type = option.dataset.type;
            const isSelected = this.selectedFighters[team].includes(type);
            const isFull = this.selectedFighters[team].length >= this.maxFightersPerTeam;
            const selectionNumber = this.selectedFighters[team].indexOf(type) + 1;
            const numberElement = option.querySelector('.selection-number');

            if (isSelected) {
                option.classList.add('selected');
                option.classList.remove('disabled');
                // Show selection number
                numberElement.textContent = selectionNumber;
                numberElement.style.display = 'block';
            } else if (isFull) {
                option.classList.add('disabled');
                option.classList.remove('selected');
                numberElement.style.display = 'none';
            } else {
                option.classList.remove('selected', 'disabled');
                numberElement.style.display = 'none';
            }
        });
    }



    startBattle() {
        // Hide the modal
        const modal = document.getElementById('fighter-selection-modal');
        modal.style.display = 'none';

        // In AI mode, let the AI pick its fighters based on blue's selection
        if (this.aiMode) {
            this.aiController = new AIController(this);
            this.selectedFighters.red = this.aiController.selectFighters(this.selectedFighters.blue);
        }

        // Clean up any existing projectiles
        this.cleanupBaseProjectiles();

        // Setup the selected fighters for spawning
        this.setupSelectedFighters();

        // Start the game
        this.gameRunning = true;
        this.fighterSelectionComplete = true;

        // Initialize game state
        this.lastGoldTick = Date.now();
        this.lastComebackCheck = Date.now();

        // Force initial UI update
        this.updateTeamCounts();
        this.updateComebackUI();

        console.log('Game started! Mode:', this.aiMode ? 'vs AI' : 'PvP', '| Selected fighters:', this.selectedFighters);
    }

    getFighterInfo(fighterType) {
        const fighterData = {
            warrior: { icon: '⚔️', name: 'Warrior', desc: 'Balanced fighter with critical strikes' },
            archer: { icon: '🏹', name: 'Archer', desc: 'Fast ranged fighter with high evasion' },
            tank: { icon: '🛡️', name: 'Tank', desc: 'Slow but very durable fighter' },
            troll: { icon: '👹', name: 'Troll', desc: 'Strong fighter with lifesteal' },
            crossbow: { icon: '🏹', name: 'Crossbow', desc: 'Long range with high critical chance' },
            assassin: { icon: '🗡️', name: 'Assassin', desc: 'High critical chance and evasion' },
            paladin: { icon: '⚜️', name: 'Paladin', desc: 'Balanced with heal aura' },
            healer: { icon: '💊', name: 'Healer', desc: 'Ranged support with heal aura' },
            berserker: { icon: '⚔️', name: 'Berserker', desc: 'Fast attack speed with lifesteal' }
        };
        return fighterData[fighterType] || { icon: '❓', name: 'Unknown', desc: 'Unknown fighter' };
    }

    setupSelectedFighters() {
        // Create hotkey mappings for selected fighters
        this.blueHotkeys = ['q', 'w', 'e', 'a', 's'];
        this.redHotkeys = ['i', 'o', 'p', 'k', 'l'];

        // Map selected fighters to hotkeys
        this.blueFighterMap = {};
        this.redFighterMap = {};

        this.selectedFighters.blue.forEach((fighterType, index) => {
            this.blueFighterMap[this.blueHotkeys[index]] = fighterType;
        });

        this.selectedFighters.red.forEach((fighterType, index) => {
            this.redFighterMap[this.redHotkeys[index]] = fighterType;
        });

        // Update the UI to show only selected fighters
        this.updateFighterUI();
    }

    updateFighterUI() {
        // Get the button containers - use more specific selectors
        const blueContainer = document.querySelector('.control-group:first-of-type .fighter-buttons');
        const redContainer = document.querySelector('.control-group:last-of-type .fighter-buttons');

        console.log('Blue container found:', blueContainer);
        console.log('Red container found:', redContainer);
        console.log('Selected fighters:', this.selectedFighters);

        // Clear and reorder blue team buttons
        if (blueContainer) {
            blueContainer.innerHTML = '';

            this.selectedFighters.blue.forEach((fighterType, index) => {
                // Create a new button instead of cloning
                const newButton = document.createElement('button');
                newButton.className = 'fighter-btn blue-team';
                newButton.setAttribute('data-side', 'blue');
                newButton.setAttribute('data-type', fighterType);
                newButton.style.display = 'flex';
                newButton.style.opacity = '1';
                newButton.disabled = false;

                // Get fighter info
                const fighterInfo = this.getFighterInfo(fighterType);

                // Create temporary fighter to get spawn properties
                const tempFighter = new Fighter('blue', fighterType, 0, 0);

                newButton.innerHTML = `
                    <span class="fighter-icon">${fighterInfo.icon}</span>
                    <span class="fighter-name">${fighterInfo.name}</span>
                    <span class="fighter-desc">(${this.blueHotkeys[index].toUpperCase()})</span>
                    <span class="fighter-stats">
                        <span class="cost">💰 ${tempFighter.spawnCost}</span>
                        <span class="cooldown">⏱️ ${tempFighter.spawnCooldown / 1000}s</span>
                    </span>
                `;

                // Add event listener
                newButton.addEventListener('click', () => {
                    this.spawnFighter('blue', fighterType);
                });

                blueContainer.appendChild(newButton);
            });
        }

        // Clear and reorder red team buttons
        if (redContainer) {
            redContainer.innerHTML = '';

            if (this.aiMode) {
                // Show AI panel instead of buttons
                const aiPanel = document.createElement('div');
                aiPanel.className = 'ai-panel';
                const strategyLabel = this.aiController ? this.aiController.getStrategyLabel() : '🤖 AI';
                aiPanel.innerHTML = `
                    <span class="ai-icon">🤖</span>
                    <span>AI</span>
                    <span class="ai-strategy">${strategyLabel}</span>
                `;
                redContainer.appendChild(aiPanel);
            } else {
                this.selectedFighters.red.forEach((fighterType, index) => {
                    // Create a new button instead of cloning
                    const newButton = document.createElement('button');
                    newButton.className = 'fighter-btn red-team';
                    newButton.setAttribute('data-side', 'red');
                    newButton.setAttribute('data-type', fighterType);
                    newButton.style.display = 'flex';
                    newButton.style.opacity = '1';
                    newButton.disabled = false;

                    // Get fighter info
                    const fighterInfo = this.getFighterInfo(fighterType);

                    // Create temporary fighter to get spawn properties
                    const tempFighter = new Fighter('red', fighterType, 0, 0);

                    newButton.innerHTML = `
                        <span class="fighter-icon">${fighterInfo.icon}</span>
                        <span class="fighter-name">${fighterInfo.name}</span>
                        <span class="fighter-desc">(${this.redHotkeys[index].toUpperCase()})</span>
                        <span class="fighter-stats">
                            <span class="cost">💰 ${tempFighter.spawnCost}</span>
                            <span class="cooldown">⏱️ ${tempFighter.spawnCooldown / 1000}s</span>
                        </span>
                    `;

                    // Add event listener
                    newButton.addEventListener('click', () => {
                        this.spawnFighter('red', fighterType);
                    });

                    redContainer.appendChild(newButton);
                });
            }
        }

        // Force a button state update after UI changes
        setTimeout(() => {
            this.updateButtonStates();
        }, 100);
    }

    setupEventListeners() {
        const fighterButtons = document.querySelectorAll('.fighter-btn');

        fighterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const side = button.getAttribute('data-side');
                const type = button.getAttribute('data-type');
                this.spawnFighter(side, type);
            });
        });

        // Keyboard shortcuts for spawning fighters (dynamic based on selection)
        document.addEventListener('keydown', (event) => {
            if (!this.fighterSelectionComplete) return; // Don't handle keys before selection

            const key = event.key.toLowerCase();

            // Blue team shortcuts (q,w,e,a,s)
            if (this.blueFighterMap && this.blueFighterMap[key]) {
                this.spawnFighter('blue', this.blueFighterMap[key]);
            }

            // Red team shortcuts (i,o,p,k,l) — disabled in AI mode
            if (!this.aiMode && this.redFighterMap && this.redFighterMap[key]) {
                this.spawnFighter('red', this.redFighterMap[key]);
            }
        });
    }

    updateSpawnCooldowns() {
        const currentTime = Date.now();

        // Update blue team cooldowns
        for (let type in this.spawnCooldowns.blue) {
            if (this.spawnCooldowns.blue[type] > 0 && currentTime >= this.spawnCooldowns.blue[type]) {
                this.spawnCooldowns.blue[type] = 0; // Cooldown finished
            }
        }

        // Update red team cooldowns
        for (let type in this.spawnCooldowns.red) {
            if (this.spawnCooldowns.red[type] > 0 && currentTime >= this.spawnCooldowns.red[type]) {
                this.spawnCooldowns.red[type] = 0; // Cooldown finished
            }
        }
    }

    spawnFighter(side, type) {
        // Check if fighter selection is complete
        if (!this.fighterSelectionComplete) {
            return;
        }

        // Check if this fighter type is selected for this team
        if (!this.selectedFighters[side].includes(type)) {
            return;
        }

        // Check team capacity
        if (side === 'blue' && this.blueCount >= this.maxFightersPerSide) {
            return;
        }

        if (side === 'red' && this.redCount >= this.maxFightersPerSide) {
            return;
        }

        // Check spawn cooldown
        if (this.spawnCooldowns[side][type] > 0) {
            return;
        }

        // Create a temporary fighter to get spawn properties
        const tempFighter = new Fighter(side, type, 0, 0);

        // Check gold cost using fighter's spawn cost
        const cost = tempFighter.spawnCost;
        if (side === 'blue' && this.blueGold < cost) {
            return;
        }
        if (side === 'red' && this.redGold < cost) {
            return;
        }

        // Use the existing tempFighter to get collision radius
        const spawnRadius = tempFighter.collisionRadius + 10; // Extra buffer for spawn spacing

        // Try to find a collision-free spawn position
        let attempts = 0;
        const maxAttempts = 100; // More attempts for better coverage
        let x, y;

        while (attempts < maxAttempts) {
            // Generate spawn position with better distribution
            if (side === 'blue') {
                x = 50 + Math.random() * 150; // Blue spawn area: 50-200
            } else {
                x = 1000 + Math.random() * 150; // Red spawn area: 1000-1150
            }

            // Better Y distribution with more spacing
            y = 50 + Math.random() * 500; // Y range: 50-550

            // Check collision with existing fighters using proper collision detection
            let collision = false;
            for (let existingFighter of this.fighters) {
                const dx = x - existingFighter.x;
                const dy = y - existingFighter.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = spawnRadius + existingFighter.collisionRadius + 5;

                if (distance < minDistance) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                break; // Found a good position
            }

            attempts++;
        }

        // If still no position found, find the least crowded position
        if (attempts >= maxAttempts) {
            console.log(`Warning: Could not find collision-free spawn for ${side} ${type}, finding least crowded position`);

            let bestX = side === 'blue' ? 50 : 750;
            let bestY = 200;
            let minCollisions = Infinity;

            // Search in a grid pattern for the best position
            for (let testX = (side === 'blue' ? 50 : 1000); testX < (side === 'blue' ? 200 : 1150); testX += 5) {
                for (let testY = 50; testY < 550; testY += 5) {
                    let collisionCount = 0;

                    for (let existingFighter of this.fighters) {
                        const dx = testX - existingFighter.x;
                        const dy = testY - existingFighter.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const minDistance = spawnRadius + existingFighter.collisionRadius;

                        if (distance < minDistance) {
                            collisionCount++;
                        }
                    }

                    if (collisionCount < minCollisions) {
                        minCollisions = collisionCount;
                        bestX = testX;
                        bestY = testY;
                    }
                }
            }

            x = bestX;
            y = bestY;
        }

        // Create the actual fighter at the found position
        const fighter = new Fighter(side, type, x, y);

        // Final collision check and adjustment
        this.finalizeSpawnPosition(fighter);

        this.fighters.push(fighter);

        // Deduct gold cost
        if (side === 'blue') {
            this.blueGold -= cost;
            this.blueCount++;
        } else {
            this.redGold -= cost;
            this.redCount++;
        }

        // Set spawn cooldown using fighter's spawn cooldown property
        const cooldownTime = tempFighter.spawnCooldown;
        this.spawnCooldowns[side][type] = Date.now() + cooldownTime;

        this.updateTeamCounts();
    }

    updateButtonStates() {
        const buttons = document.querySelectorAll('.fighter-btn');

        buttons.forEach(button => {
            const side = button.getAttribute('data-side');
            const type = button.getAttribute('data-type');

            // Only update buttons for selected fighters
            if (!this.selectedFighters[side].includes(type)) {
                return;
            }

            // Create temporary fighter to get spawn properties
            const tempFighter = new Fighter(side, type, 0, 0);
            const cost = tempFighter.spawnCost;
            const cooldownEndTime = this.spawnCooldowns[side][type];
            const gold = side === 'blue' ? this.blueGold : this.redGold;
            const count = side === 'blue' ? this.blueCount : this.redCount;

            // Check if button should be disabled
            const insufficientGold = gold < cost;
            const onCooldown = cooldownEndTime > 0 && Date.now() < cooldownEndTime;
            const teamFull = count >= this.maxFightersPerSide;

            if (insufficientGold || onCooldown || teamFull) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';

                // Add tooltip with reason
                let reason = '';
                if (teamFull) {
                    reason = 'Team is full';
                } else if (onCooldown) {
                    const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
                    reason = `Cooldown: ${remainingTime}s remaining`;
                } else if (insufficientGold) {
                    reason = `Need ${cost} gold (have ${gold})`;
                }
                button.title = reason;
            } else {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.title = `Spawn ${type} (${cost} gold, ${tempFighter.spawnCooldown / 1000}s cooldown)`;
            }
        });
    }



    updateTeamCounts() {
        document.getElementById('blue-count').textContent = this.blueCount;
        document.getElementById('red-count').textContent = this.redCount;
        document.getElementById('blue-gold').textContent = this.blueGold;
        document.getElementById('red-gold').textContent = this.redGold;
    }

    applyComebackBonuses() {
        // Calculate team strength differences
        const blueStrength = this.blueCount + (this.bases.blue.health / 100);
        const redStrength = this.redCount + (this.bases.red.health / 100);
        const strengthDiff = Math.abs(blueStrength - redStrength);

        // Base comeback bonus (more gold for weaker team)
        let blueBonus = 0;
        let redBonus = 0;

        if (blueStrength < redStrength) {
            // Blue team is behind
            blueBonus = Math.min(3, Math.floor(strengthDiff / 2));
            if (this.blueKillStreak >= 3) {
                blueBonus += 2; // Kill streak bonus
            }
        } else if (redStrength < blueStrength) {
            // Red team is behind
            redBonus = Math.min(3, Math.floor(strengthDiff / 2));
            if (this.redKillStreak >= 3) {
                redBonus += 2; // Kill streak bonus
            }
        }

        // Apply bonuses
        if (blueBonus > 0) {
            this.blueGold += blueBonus;
            this.showComebackMessage('blue', blueBonus);
        }
        if (redBonus > 0) {
            this.redGold += redBonus;
            this.showComebackMessage('red', redBonus);
        }
    }

    showComebackMessage(team, bonus) {
        // Create floating comeback message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: ${team === 'blue' ? '20%' : '60%'};
            left: ${team === 'blue' ? '10%' : '70%'};
            color: ${team === 'blue' ? '#4ecdc4' : '#ff6b6b'};
            font-size: 1.5rem;
            font-weight: bold;
            text-shadow: 0 0 10px ${team === 'blue' ? '#4ecdc4' : '#ff6b6b'};
            z-index: 100;
            animation: comebackFloat 2s ease-out forwards;
            pointer-events: none;
        `;
        message.textContent = `+${bonus} GOLD! 💰`;

        document.body.appendChild(message);

        // Remove message after animation
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 2000);
    }

    updateComebackUI() {
        // Update kill streak displays
        const blueStreakEl = document.getElementById('blue-streak');
        const redStreakEl = document.getElementById('red-streak');

        if (blueStreakEl) {
            blueStreakEl.textContent = this.blueKillStreak > 0 ? `🔥 ${this.blueKillStreak}` : '';
        }
        if (redStreakEl) {
            redStreakEl.textContent = this.redKillStreak > 0 ? `🔥 ${this.redKillStreak}` : '';
        }
    }

    updateBaseAttacks() {
        const currentTime = Date.now();

        // Blue base attacks red fighters
        if (this.bases.blue.health > 0) {
            if (currentTime - this.bases.blue.lastAttackTime >= this.bases.blue.attackCooldown) {
                const target = this.findBaseTarget('blue');
                if (target) {
                    this.bases.blue.lastAttackTime = currentTime;
                    this.createBaseProjectile('blue', target);
                }
            }
        }

        // Red base attacks blue fighters
        if (this.bases.red.health > 0) {
            if (currentTime - this.bases.red.lastAttackTime >= this.bases.red.attackCooldown) {
                const target = this.findBaseTarget('red');
                if (target) {
                    this.bases.red.lastAttackTime = currentTime;
                    this.createBaseProjectile('red', target);
                }
            }
        }

        // Update existing projectiles
        this.updateBaseProjectiles();
    }

    findBaseTarget(baseSide) {
        const enemyFighters = this.fighters.filter(f =>
            f.side !== baseSide && f.state !== 'dead' && f.health > 0
        );

        if (enemyFighters.length === 0) return null;

        const base = this.bases[baseSide];
        let closestTarget = null;
        let closestDistance = Infinity;

        for (let fighter of enemyFighters) {
            const dx = fighter.x - base.x;
            const dy = fighter.y - base.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= base.attackRange && distance < closestDistance) {
                closestTarget = fighter;
                closestDistance = distance;
            }
        }

        return closestTarget;
    }

    canvasToViewportPosition(canvasX, canvasY) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / this.canvas.width;
        const scaleY = canvasRect.height / this.canvas.height;

        return {
            x: canvasRect.left + (canvasX * scaleX),
            y: canvasRect.top + (canvasY * scaleY)
        };
    }

    createBaseProjectile(baseSide, target) {
        const base = this.bases[baseSide];
        const baseViewport = this.canvasToViewportPosition(base.x, base.y);

        const projectile = {
            x: base.x,
            y: base.y,
            targetX: target.x,
            targetY: target.y,
            baseSide: baseSide,
            damage: base.attackDamage,
            speed: 3, // pixels per frame
            element: null,
            target: target
        };

        // Create projectile visual element positioned relative to the canvas
        const projectileElement = document.createElement('div');
        projectileElement.style.cssText = `
            position: fixed;
            left: ${baseViewport.x}px;
            top: ${baseViewport.y}px;
            width: 12px;
            height: 12px;
            background: ${baseSide === 'blue' ? '#4ecdc4' : '#ff6b6b'};
            border-radius: 50%;
            z-index: 50;
            pointer-events: none;
            box-shadow: 0 0 8px ${baseSide === 'blue' ? '#4ecdc4' : '#ff6b6b'};
            animation: baseProjectile 0.8s ease-in-out infinite;
        `;

        document.body.appendChild(projectileElement);
        projectile.element = projectileElement;

        this.baseProjectiles.push(projectile);
    }

    updateBaseProjectiles() {
        for (let i = this.baseProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.baseProjectiles[i];

            // Calculate direction to target
            const dx = projectile.targetX - projectile.x;
            const dy = projectile.targetY - projectile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= projectile.speed) {
                // Projectile reached target
                this.hitTargetWithProjectile(projectile);
                this.baseProjectiles.splice(i, 1);
            } else {
                // Move projectile towards target
                const angle = Math.atan2(dy, dx);
                projectile.x += Math.cos(angle) * projectile.speed;
                projectile.y += Math.sin(angle) * projectile.speed;

                // Update visual position
                if (projectile.element) {
                    const viewportPos = this.canvasToViewportPosition(projectile.x, projectile.y);
                    projectile.element.style.left = `${viewportPos.x}px`;
                    projectile.element.style.top = `${viewportPos.y}px`;
                }
            }
        }
    }

    hitTargetWithProjectile(projectile) {
        // Check if target is still valid
        if (projectile.target && projectile.target.state !== 'dead' && projectile.target.health > 0) {
            // Deal damage
            projectile.target.takeDamage(projectile.damage);
        }

        // Remove projectile element
        if (projectile.element && projectile.element.parentNode) {
            projectile.element.parentNode.removeChild(projectile.element);
        }
    }

    cleanupBaseProjectiles() {
        // Remove all projectile elements from DOM
        this.baseProjectiles.forEach(projectile => {
            if (projectile.element && projectile.element.parentNode) {
                projectile.element.parentNode.removeChild(projectile.element);
            }
        });

        // Clear the projectiles array
        this.baseProjectiles = [];
    }

    showBaseAttackEffect(baseSide, targetX, targetY) {
        // Create base attack visual effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${targetX}px;
            top: ${targetY}px;
            width: 20px;
            height: 20px;
            background: ${baseSide === 'blue' ? '#4ecdc4' : '#ff6b6b'};
            border-radius: 50%;
            z-index: 50;
            animation: baseAttack 0.5s ease-out forwards;
            pointer-events: none;
        `;

        document.body.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }

    finalizeSpawnPosition(fighter) {
        // Final check to ensure the fighter is within bounds and not colliding
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            let needsAdjustment = false;

            // Check bounds
            if (fighter.x < fighter.width / 2) {
                fighter.x = fighter.width / 2;
                needsAdjustment = true;
            } else if (fighter.x > 1200 - fighter.width / 2) {
                fighter.x = 1200 - fighter.width / 2;
                needsAdjustment = true;
            }

            if (fighter.y < fighter.height / 2) {
                fighter.y = fighter.height / 2;
                needsAdjustment = true;
            } else if (fighter.y > 600 - fighter.height / 2) {
                fighter.y = 600 - fighter.height / 2;
                needsAdjustment = true;
            }

            // Check collision with existing fighters
            for (let existingFighter of this.fighters) {
                if (existingFighter !== fighter) {
                    const dx = fighter.x - existingFighter.x;
                    const dy = fighter.y - existingFighter.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = fighter.collisionRadius + existingFighter.collisionRadius + 2;

                    if (distance < minDistance) {
                        // Move fighter away from collision
                        const pushDistance = minDistance - distance + 2;
                        const pushAngle = Math.atan2(dy, dx);

                        fighter.x += Math.cos(pushAngle) * pushDistance;
                        fighter.y += Math.sin(pushAngle) * pushDistance;
                        needsAdjustment = true;
                    }
                }
            }

            if (!needsAdjustment) {
                break; // No adjustments needed
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.log(`Warning: Could not finalize spawn position for ${fighter.side} ${fighter.type}`);
        }
    }



    update() {
        // Update gold system with comeback mechanics
        const currentTime = Date.now();
        if (currentTime - this.lastGoldTick >= 1000) {
            // Base gold income
            this.blueGold += 1;
            this.redGold += 1;

            // Comeback bonus gold (every 5 seconds)
            if (currentTime - this.lastComebackCheck >= 5000) {
                this.applyComebackBonuses();
                this.lastComebackCheck = currentTime;
            }

            this.lastGoldTick = currentTime;

            // Debug: Log gold updates
        }

        // AI controller think
        if (this.aiMode && this.aiController) {
            this.aiController.think(currentTime);
        }

        // Update spawn cooldowns
        this.updateSpawnCooldowns();

        // Remove dead fighters first
        this.fighters = this.fighters.filter(fighter => fighter.state !== 'dead');

        // Update all remaining fighters
        for (let fighter of this.fighters) {
            const enemies = this.fighters.filter(f => f.side !== fighter.side && f.state !== 'dead');
            fighter.update(enemies, this.fighters);
        }

        // Update base attacks
        this.updateBaseAttacks();

        // Recalculate team counts
        this.blueCount = this.fighters.filter(f => f.side === 'blue').length;
        this.redCount = this.fighters.filter(f => f.side === 'red').length;
        this.updateTeamCounts();
        this.updateButtonStates();
        this.updateComebackUI();

        // Check win conditions
        this.checkWinCondition();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background grid
        this.drawGrid();

        // Draw center line
        this.drawCenterLine();

        // Draw obstacles
        this.drawObstacles();

        // Draw bases
        this.drawBases();

        // Draw all fighters
        for (let fighter of this.fighters) {
            fighter.draw(this.ctx);
        }

        // Debug: Draw path dots for all fighters
        // this.drawAllFighterPaths();

        // Draw spawn areas
        this.drawSpawnAreas();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawCenterLine() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawSpawnAreas() {
        // Blue spawn area (avoid base area)
        this.ctx.fillStyle = 'rgba(78, 205, 196, 0.2)';
        this.ctx.fillRect(0, 0, 150, this.canvas.height);

        // Red spawn area (avoid base area)
        this.ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
        this.ctx.fillRect(this.canvas.width - 150, 0, 150, this.canvas.height);

        // Labels
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BLUE SPAWN', 75, 30);
        this.ctx.fillText('RED SPAWN', this.canvas.width - 75, 30);
    }

    drawObstacles() {
        for (let obstacle of this.obstacles) {
            if (obstacle.type === 'rock') {
                // Draw rock (gray square with texture)
                this.ctx.fillStyle = '#696969';
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

                // Add some texture
                this.ctx.fillStyle = '#808080';
                this.ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);

                // Border
                this.ctx.strokeStyle = '#4a4a4a';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'tree') {
                // Draw tree (brown trunk, green foliage)
                // Trunk
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(obstacle.x + obstacle.width * 0.4, obstacle.y + obstacle.height * 0.6,
                    obstacle.width * 0.2, obstacle.height * 0.4);

                // Foliage
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height * 0.4,
                    obstacle.width * 0.4, 0, Math.PI * 2);
                this.ctx.fill();

                // Border
                this.ctx.strokeStyle = '#006400';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        }
    }

    drawBases() {
        // Draw blue base
        const blueBase = this.bases.blue;
        if (blueBase.health > 0) {
            // Base structure
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.fillRect(blueBase.x - 30, blueBase.y - 40, 60, 80);

            // Base border
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(blueBase.x - 30, blueBase.y - 40, 60, 80);

            // Base flag
            this.ctx.fillStyle = '#3498db';
            this.ctx.fillRect(blueBase.x + 25, blueBase.y - 35, 8, 15);

            // Health bar
            this.drawBaseHealthBar(blueBase);
        }

        // Draw red base
        const redBase = this.bases.red;
        if (redBase.health > 0) {
            // Base structure
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(redBase.x - 30, redBase.y - 40, 60, 80);

            // Base border
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(redBase.x - 30, redBase.y - 40, 60, 80);

            // Base flag
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(redBase.x - 33, redBase.y - 35, 8, 15);

            // Health bar
            this.drawBaseHealthBar(redBase);
        }
    }

    drawBaseHealthBar(base) {
        const barWidth = 80;
        const barHeight = 8;
        const barX = base.x - barWidth / 2;
        const barY = base.y - 60;

        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = base.health / base.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Health text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(base.health)}`, base.x, barY - 5);
    }

    checkWinCondition() {
        // Check if either base has been destroyed
        if (this.bases.blue.health <= 0) {
            this.displayWinMessage('Red Team Wins!');
        } else if (this.bases.red.health <= 0) {
            this.displayWinMessage('Blue Team Wins!');
        }
    }

    displayWinMessage(message) {
        // Display win message on canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = '24px Arial';
        this.ctx.fillText('Refresh page to play again', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    drawAllFighterPaths() {
        // Debug visualization: Draw dots for every fighter's path property
        for (let fighter of this.fighters) {
            if (fighter.path && fighter.path.length > 0) {
                // Draw path dots with different colors for each side
                const dotColor = fighter.side === 'blue' ? '#4ecdc4' : '#ff6b6b';
                const dotSize = 4;

                this.ctx.fillStyle = dotColor;

                // Draw dots for each path point
                for (let i = 0; i < fighter.path.length; i++) {
                    const point = fighter.path[i];

                    // Draw a larger, more visible dot
                    this.ctx.beginPath();
                    this.ctx.arc(point.x, point.y, dotSize, 0, Math.PI * 2);
                    this.ctx.fill();

                    // Add a white border for better visibility
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Add path index number for debugging
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = '10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(i.toString(), point.x, point.y - 8);

                    // Reset fill color for next dot
                    this.ctx.fillStyle = dotColor;
                }

                // Draw a special indicator for the current path index
                if (fighter.pathIndex < fighter.path.length) {
                    const currentPoint = fighter.path[fighter.pathIndex];
                    this.ctx.fillStyle = '#ffff00'; // Yellow for current position
                    this.ctx.beginPath();
                    this.ctx.arc(currentPoint.x, currentPoint.y, 6, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        }
    }

    gameLoop() {
        // Always draw the current state (even before game starts)
        this.draw();

        // Only update game logic if game is running
        if (this.gameRunning) {
            this.update();
        }

        // Always continue the loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
