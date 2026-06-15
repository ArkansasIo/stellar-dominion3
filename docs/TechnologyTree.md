# Comprehensive Technology Tree Documentation

## Overview

The Technology Tree system contains **2,453+ different technologies** organized across **11 major branches**. Each technology has:

- **Levels** (1-20+): Power progression
- **Tiers** (1-10): Upgrade capability  
- **Stats & Substats**: Detailed performance metrics
- **Requirements**: Prerequisites and gating
- **Classification System**: Category → Subcategory → Classification
- **Progression Paths**: Research chains and unlocks

---

## Technology Statistics

| Branch | Count | Avg Level | Classes | Manufacturers |
|--------|-------|-----------|---------|----------------|
| **Armor** | 600 | 8.5 | 4+ | Terran/Krell/Zenith |
| **Shields** | 250 | 5.2 | 4 | Terran/Krell/Zenith |
| **Weapons** | 420 | 6.8 | 3 | Terran/Zenith/Krell |
| **Propulsion** | 250 | 5.5 | 3 | All Manufacturers |
| **Sensors** | 168 | 4.8 | 3 | All Manufacturers |
| **Power Systems** | 150 | 5.1 | 3 | Zenith/Krell/Terran |
| **Computing/AI** | 100 | 4.5 | 3 | Zenith/Krell/Terran |
| **Engineering** | 120 | 4.8 | 3 | All Manufacturers |
| **Resources** | 120 | 4.6 | 3 | All Manufacturers |
| **Medical** | 150 | 4.7 | 3 | Zenith/Krell/Terran |
| **Hyperspace** | 125 | 5.9 | 3 | All Manufacturers |
| **TOTAL** | **2,453** | **5.4** | **Multiple** | **3 Main** |

---

## 1. ARMOR TECHNOLOGIES (600 techs)

### Structure

Armor is organized as:  
**Category (5) × Material (8) × Grade (5) × Level (3) = 600 technologies**

### Categories

| Category | Purpose | Level Range | Rarity |
|----------|---------|-------------|--------|
| **Light Armor** | Fast ships, scouts | 1-6 | Common |
| **Medium Armor** | Balanced vessels | 3-12 | Uncommon |
| **Heavy Armor** | Battleships | 8-18 | Rare |
| **Ultra-Heavy** | Capital ships | 12-24 | Epic |
| **Exotic Armor** | Advanced craft | 16-28 | Legendary |

### Materials

1. **Composite** - Balanced cost/performance
2. **Ceramic** - High deflection
3. **Steel** - Affordable durability
4. **Titanium** - Military standard
5. **Polyalloy** - Specialized alloy
6. **Graphite** - Lightweight
7. **Diamond-Reinforced** - Extreme strength
8. **Quantum-Layered** - Phased armor

### Grades

- **Reinforced** - Standard reinforcement
- **Advanced** - Improved durability
- **Military** - Combat-optimized
- **Experimental** - High risk/reward
- **Prototype** - Cutting-edge

### Stats Per Armor Tech

```typescript
Primary Stats:
- Armor Rating (10-250+)
- Weight (varies by type)

Secondary Stats:
- Cost Effectiveness (70-95%)

Resistances:
- Kinetic (10-250+)
- Thermal (0-25)
- Radiation (0-15)

Performance:
- Efficiency: 75-95%
- Reliability: 88-98%
```

### Example Tech Progression

```
Light Armor → Reinforced Composite → Armor L1 (Research Cost: 50)
    ↓
Light Armor → Reinforced Composite → Armor L2 (Research Cost: 100)
    ↓
Light Armor → Advanced Ceramic → Armor L1 (Research Cost: 200)
    ↓
Medium Armor → Standard Steel → Armor L1 (Research Cost: 80)
```

---

## 2. SHIELD TECHNOLOGIES (250 techs)

### Structure

Shields are organized as:  
**Type (5) × Configuration (5) × Generation (5) × Level (2) = 250 technologies**

### Types

1. **Kinetic Shields** - Deflects projectiles
2. **Thermal Shields** - Absorbs heat/energy
3. **Radiation Shields** - Blocks radiation
4. **Electromagnetic** - Disrupts tech
5. **Exotic Shields** - Multi-purpose

### Configurations

- **Single-Layer** - Basic protection
- **Multi-Phase** - Layered defense
- **Omni-Directional** - 360° coverage
- **Dynamic** - Adaptive protection
- **Distributed** - Spread coverage

### Generations

- **Gen 1**: Foundation tech (Level 1-2)
- **Gen 2**: Improved (Level 2-4)
- **Gen 3**: Advanced (Level 4-7)
- **Gen 4**: Military (Level 6-10)
- **Gen 5**: Cutting-edge (Level 8-12)

### Stats Per Shield Tech

```typescript
Primary Stats:
- Shield Strength (40-300+)
- Recharge Rate (3-50+ per turn)

Secondary Stats:
- Coverage Radius (varies)
- Stability (65-98%)

Resistances:
- Type-specific (80-150)
- Cross-type (10-40)

Performance:
- Efficiency: 65-90%
- Reliability: 80-95%
```

---

## 3. WEAPON TECHNOLOGIES (420 techs)

### Structure

Weapons are organized as:  
**Type (7) × Configuration (6) × Grade (5) × Level (2) = 420 technologies**

### Types

1. **Ballistic** - Kinetic projectiles
2. **Laser** - Energy beams
3. **Missile** - Guided ordnance
4. **Plasma** - Hot cloud weapons
5. **Pulse** - Rapid energy burst
6. **Particle** - Subatomic weapons
7. **Exotic** - Unknown weapons

### Configurations

- **Standard** - Single weapon
- **Rapid-Fire** - Multiple shots per turn  
- **Heavy** - Single large shot
- **Point-Defense** - Anti-missile
- **Array** - Multiple small weapons
- **Swarm** - Distributed system

### Grades (Mark I-V)

- **Mark I**: Initial design
- **Mark II**: First upgrade  
- **Mark III**: Mature design
- **Mark IV**: Advanced
- **Mark V**: Cutting-edge

### Stats Per Weapon Tech

```typescript
Primary Stats:
- Damage Per Shot (20-300+)
- Fire Rate (1-10 per turn)

Secondary Stats:
- Accuracy (85-98%)
- Range (5000+ km)

Performance:
- Efficiency: 70-90%
- Reliability: 85-95%
```

---

## 4. PROPULSION TECHNOLOGIES (250 techs)

### Structure

Propulsion is organized as:  
**Type (5) × Configuration (5) × Version (5) × Level (2) = 250 technologies**

### Engine Types

1. **Ion Drive** - Standard sub-light
2. **Plasma Drive** - High-performance
3. **Nuclear Drive** - Military standard
4. **Anti-Matter** - Exotic fuel
5. **Exotic Drive** - Unknown tech

### Configurations

- **Standard** - Normal operation
- **Turbo** - Maximum performance
- **Cruise** - Fuel-efficient
- **Hybrid** - Switchable modes
- **Experimental** - Untested

### Versions

- **v1.0 - v5.0**: Five generations

### Stats Per Propulsion Tech

```typescript
Primary Stats:
- Thrust Output (100-2000+)
- Fuel Efficiency (10-99%)

Secondary Stats:
- Power Consumption (varies)

Performance:
- Efficiency: 75-90%
- Reliability: 85-95%
```

---

## 5. SENSOR TECHNOLOGIES (168 techs)

### Structure

Sensors are organized as:  
**Type (7) × Range (6) × Generation (4) = 168 technologies**

### Types

1. **Radar** - Standard detection
2. **LIDAR** - Light-based scanning
3. **Thermal** - Heat signatures
4. **Gravitational** - Mass detection
5. **Quantum** - Advanced physics
6. **Multispectral** - All-spectrum
7. **Exotic** - Unknown

### Range Categories

- **Short-Range** (5,000 km)
- **Medium-Range** (20,000 km)
- **Long-Range** (50,000 km)
- **Ultra-Long** (500,000 km)
- **Planetary** (1M+ km)
- **System-Wide** (10M+ km)

### Generations

- **Gen 1-4**: Progressive improvements

### Stats Per Sensor Tech

```typescript
Primary Stats:
- Detection Range (5000+ km)
- Scan Speed (0.5-10+ turns)

Secondary Stats:
- Power Efficiency (70-85%)

Performance:
- Accuracy: 75-95%
- Reliability: 85-95%
```

---

## 6. POWER TECHNOLOGIES (150 techs)

### Structure

Power is organized as:  
**Type (6) × Scale (5) × Generation (5) = 150 technologies**

### Reactor Types

1. **Fusion** - Standard star power
2. **Antimatter** - Exotic fuel
3. **Zero-Point** - Quantum energy
4. **Quantum** - Advanced physics
5. **Exotic** - Unknown
6. **Stellar** - Sun-powered

### Scales

- **Compact** - Small ships
- **Standard** - Medium vessels
- **Large** - Battleships
- **Massive** - Capital ships
- **Unlimited** - Megastructures

### Stats Per Power Tech

```typescript
Primary Stats:
- Energy Output (500-10,000+ MW)
- Efficiency (80-95%)

Secondary Stats:
- Heat Production (varies)

Performance:
- Efficiency: 75-95%
- Reliability: 85-95%
```

---

## 7. COMPUTING/AI TECHNOLOGIES (100 techs)

### Structure

Computing is organized as:  
**Type (5) × Proficiency (5) × Version (4) = 100 technologies**

### AI Types

1. **Ship AI** - General control
2. **Combat AI** - Weapon systems
3. **Navigation AI** - Steering
4. **Science AI** - Research
5. **Exotic AI** - Unknown

### Proficiency Levels

- **Basic** - Simple decisions
- **Specialized** - Expert in one area
- **Expert** - Advanced capabilities
- **Master** - Exceptional performance
- **Legendary** - Godlike

### Stats Per AI Tech

```typescript
Primary Stats:
- Processing Power (100-5000+)
- Decision Making Speed (1-100)

Secondary Stats:
- Response Time (0.5-1.5 seconds)

Performance:
- Accuracy: 65-98%
```

---

## 8. ENGINEERING TECHNOLOGIES (120 techs)

### Structure

Engineering is organized as:  
**System (6) × Complexity (5) × Generation (4) = 120 technologies**

### Systems

1. **Automation** - Automatic processes
2. **Fabrication** - Manufacturing
3. **Repair** - Self-repair systems
4. **Optimization** - Efficiency boost
5. **Modular Systems** - Interchangeable
6. **Adaptive Tech** - Self-adjusting

### Complexity

- **Simple** - Basic implementation
- **Moderate** - Standard systems
- **Complex** - Advanced engineering
- **Advanced** - Cutting-edge
- **Expert** - Legendary design

### Stats Per Engineering Tech

```typescript
Primary Stats:
- Production Speed (100-10000%)
- Quality (75-98%)

Secondary Stats:
- Waste Reduction (10-40%)
```

---

## 9. RESOURCE TECHNOLOGIES (120 techs)

### Structure

Resources are organized as:  
**Type (6) × Efficiency (5) × Scale (4) = 120 technologies**

### Types

1. **Mining** - Ore extraction
2. **Drilling** - Deep resources
3. **Purification** - Cleaning
4. **Refining** - Processing
5. **Synthesis** - Creation
6. **Crystallization** - Concentration

### Efficiency

- **Basic** - 50% yield
- **Improved** - 65% yield
- **Advanced** - 80% yield
- **Optimized** - 90% yield
- **Expert** - 98%+ yield

### Scales

- **Small** - Single unit
- **Medium** - Factory
- **Large** - Industrial complex
- **Industrial** - Planetary scale

---

## 10. MEDICAL TECHNOLOGIES (150 techs)

### Structure

Medical is organized as:  
**Treatment (6) × Effectiveness (5) × Method (5) = 150 technologies**

### Treatments

1. **Healing** - Damage repair
2. **Regeneration** - Regrowing
3. **Resurrection** - Bringing back
4. **Enhancement** - Improvement
5. **Prevention** - Prophylaxis
6. **Cryogenics** - Stasis

### Effectiveness

- **Basic** - 50% effective
- **Effective** - 65% effective
- **Superior** - 80% effective
- **Advanced** - 92% effective
- **Extreme** - 99% effective

### Methods

- **Surgical** - Invasive procedure
- **Chemical** - Drug-based
- **Biological** - Bio-system
- **Nanite-Based** - Robotic assistance
- **Genetic** - DNA modification

---

## 11. HYPERSPACE TECHNOLOGIES (125 techs)

### Structure

Hyperspace is organized as:  
**Type (5) × Capability (5) × Stability (5) = 125 technologies**

### Types

1. **Warp Drive** - Continuous FTL
2. **Jump Gate** - Discrete jumps
3. **Quantum Tunnel** - Quantum leap
4. **Exotic Travel** - Unknown method
5. **Teleportation** - Instant transport

### Capabilities

- **Basic** - Simple FTL
- **Advanced** - Extended range
- **Military** - Combat capable
- **Experimental** - Risky
- **Legendary** - Perfect

### Stability

- **Gen 1** - Unstable (70%)
- **Gen 2** - Improving (80%)
- **Gen 3** - Reliable (85%)
- **Gen 4** - Advanced (90%)
- **Gen 5** - Perfect (95%+)

### Stats Per Hyperspace Tech

```typescript
Primary Stats:
- FTL Speed (10-150+ LY/turn)
- Jump Range (50-1000+ LY)

Secondary Stats:
- Charge Time (0.5-10 turns)

Performance:
- Reliability: 85-98%
```

---

## PROGRESSION SYSTEM

### Level Scaling

```
Level Multiplier = 1.15 ^ (level - 1)

Example:
- Level 1: 1.0x
- Level 5: 1.74x
- Level 10: 4.05x
- Level 20: 16.37x
```

### Tier Scaling

```
Tier Multiplier = 1.25 ^ (tier - 1)

Example:
- Tier 1: 1.0x
- Tier 3: 1.56x
- Tier 5: 2.44x
- Tier 10: 9.31x
```

### Combined Scaling

```
Combined = Level Multiplier × Tier Multiplier

Max (L20, T10): 16.37 × 9.31 = 152.3x bonus
```

### Research Costs

```
Base Cost = 100 × Level × Tier × (1.2 ^ Level) × (1.3 ^ Tier)

Example:
- Level 1, Tier 1: 100 × 1 × 1 × 1.2 × 1.3 = 156 Science Points
- Level 5, Tier 3: 100 × 5 × 3 × 1.76 × 2.197 = 5,835 Science Points
- Level 10, Tier 5: 100 × 10 × 5 × 6.19 × 3.71 = 115,005 Science Points
```

---

## TECHNOLOGY CLASSES

| Class | Purpose | Rarity | Availability |
|-------|---------|--------|--------------|
| **Basic** | Starting tech | Common | Universal |
| **Standard** | Common tier | Common | Universal |
| **Advanced** | Improved systems | Uncommon/Rare | Wide |
| **Military** | Combat-focused | Epic | Military factions |
| **Experimental** | High risk | Epic | Research labs |
| **Ancient** | Relic tech | Legendary | Exploration reward |
| **Exotic** | Unknown | Legendary | Rare discovery |

---

## USING THE TECH TREE SYSTEM

### Query Technologies

```typescript
import { getTechsByBranch, getTechById, getTreeStats } from '@/shared/config';

// Get all armor techs
const armorTechs = getTechsByBranch('armor');

// Get specific tech
const tech = getTechById('armor-light-basic-composite-1');

// Get tree statistics
const stats = getTreeStats();
console.log(stats.total);  // 2,453+
```

### Calculate Research Paths

```typescript
import { calculateResearchPath } from '@/shared/config';

const path = calculateResearchPath(
  'armor-light-basic-composite-1',
  'armor-heavy-military-alloy-1'
);
// Returns array of technologies in research sequence
```

### Manage Tech Progression

```typescript
import { techTreeManager } from '@/shared/config';

// Get available upgrades
const upgrades = techTreeManager.getAvailableUpgrades('armor-light-basic-composite-1');

// Calculate stat bonuses
const bonuses = techTreeManager.calculateStatBonus('armor-light-basic-composite-1', 5, 3);

// Get prerequisites
const prereqs = techTreeManager.getPrerequisites('armor-military-alloy-1');
```

---

## INTEGRATION WITH GAME SYSTEMS

### With Combat System
- Armor techs reduce damage taken
- Weapons techs increase damage output
- Shield techs provide active defense

### With Resource System
- Research requires Science Points
- Technologies require materials
- Industrial cost affects build time

### With Progression System
- Higher tech levels require higher player levels
- Tier upgrades require tier-unlocked techs
- Discovery bonuses reward exploration

### With Faction System
- Some techs faction-locked
- Faction-specific bonuses apply
- Different manufacturers available by faction

---

## FUTURE ADDITIONS

Planned expansions:
- [ ] Ancient artifact techs (rare drops)
- [ ] Hybrid technologies (cross-branch)
- [ ] Counter technologies (hard counters)
- [ ] Seasonal techs (limited availability)
- [ ] Player-designed technologies
- [ ] Tech degradation & obsolescence

---

## STATISTICS SUMMARY

```
Total Technologies:        2,453+
Average Tech Level:        5.4
Average Tech Tier:         3.1
Total Stats/Substats:      20,000+
Research Chains:           500+
Upgrade Paths:             1,000+
Manufacturers:             3
Tech Trees:                11
Max Progression Path:       150+ techs
Time to Max Research:       ~500 turns
```

---

**Last Updated**: March 9, 2026  
**Version**: 2.0.0  
**Status**: Production Ready - 2,453 Technologies Implemented
