# 🌑 ARISE (일어나라) // Solo Leveling Hunter System

> A cutting-edge, gamified mobile web application built with **Next.js 15 (App Router)** and **TypeScript**, replicating the Solo Leveling Hunter System interface for fitness conditioning, daily quests, and shadow army extraction.

---

## ⚡ Core Protocols & Features

### 1. 🏋️‍♂️ Protocol: Fitness (Gate Raids)
- **Hunter Attributes**: Live tracking of **STR** (Strength), **VIT** (Vitality), **AGI** (Agility), and **SENSE** (Perception) stat attributes with real-time level progress bars starting from clean baseline attributes (10 in each stat).
- **Detected Gate (Programs)**: Daily scheduled boss raids, weekly gate clearance tracking, and active training protocol assignments across Beginner (Goblin), Intermediate (Dungeon), and Advanced (Gate) tiers.
- **Combat Workout Console**:
  - Live workout timer & exercise navigation.
  - Ghost PR indicators displaying previous personal bests.
  - Consecutive set logger with intensity appraisal and visual combo counter.
  - Interactive Rest Timer countdown with skip, +30s, and acoustic alarm alerts.
- **Hunter Codex**: Comprehensive exercise library filterable by muscle groups (Chest, Back, Legs, Shoulders, Arms, Core, Cardio, Mobility) with stat allocation matrices and form execution instructions.
- **Boss Kills (PR Tracker)**: Maximum human output tracking with automatic 1-Rep Max (1RM) calculation via the Epley formula ($w \times (1 + r/30)$).
- **Raid History**: Persistent log of conquered dungeons with dates, duration, XP earned, and shattered PRs.

### 2. 📜 Protocol: Daily Quests
- **Penalty Zone Warning System**: Daily mission interface modeled directly after the Solo Leveling System.
- **Objective Management**: Filter quests by Active, Cleared, and All.
- **Custom Quest Deployment**: Deploy custom Hunter objectives with difficulty ranking (E, D, C, B, A, S) and statutory EXP reward payouts.
- **Claim Rewards**: Real-time sound effect triggers, level advancement, and stat point consolidation.

### 3. 👑 Shadow Monarch (Throne Room)
- **Shadow Army Roster**: Monitor Total Extracted Shadows, Elite Commanders (S-Rank & A-Rank), and Cumulative Combat Power (CP). Earned dynamically through gate raids, PR boss kills, and monarch awakenings.
- **Interactive "ARISE" Extraction Ritual**: Channel mana into the void with synthesized Web Audio sub-bass resonance, dark aura animations, and confetti summons to extract new shadow warriors into your eternal army.
- **Monarch Passives**: Domain of the Monarch, Ruler's Authority, and Shadow Exchange perks.

---

## 📱 Mobile-First Architecture & Design

- **Mobile Viewport Shell**: Optimized for mobile touch devices with native-style fixed bottom navigation (`FITNESS`, `DAILY QUESTS`, `MONARCH`).
- **Cyber HUD Status Bar**: Monospace terminal status, Rank Crest (E through S), Hunter Name ('Hunter' by default), Level tag, and animated striped EXP progress gauge. Starts from a clean slate (Level 1, 0 XP, unearned stats at 0 progress).
- **Futuristic Audio Engine**: Integrated Web Audio API synthesizer for acoustic system clicks, boss kill fanfares, level-up chimes, and deep sub-bass Arise resonance (no external audio files required, toggleable via SFX button).
- **Persistent Local State & Schema Migration**: Zustand 5 with client-side `localStorage` synchronization under version 3 schema migration, automatically purging deprecated seeded demo records while recalculating earned progression from genuine session logs.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict typing with zero `any`)
- **Styling**: Vanilla CSS (Tailored dark void palette `#030508`, Electric Cyan `#00f2ff`, Vivid Violet `#8b5cf6`, Critical Crimson `#ff0033`, CRT scanlines, glassmorphism)
- **State Management**: Zustand 5 with persistent storage and v3 data migration
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Audio**: Web Audio API Procedural Synthesizer

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Pheonix-666/Arise.git
cd Arise

# Install dependencies
npm install

# Run the development server
npm run dev

# Open in browser (mobile view recommended)
http://localhost:3000
```
