package com.cmdfootball;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Player {
    // 🔹 Core Identity & Status
    public String id;
    public String fullName;
    public String dob;
    public String team;
    public String position;
    public int level;
    public int points;
    public int rank;
    public int stars;
    public String ageGroup;
    public boolean eligible;
    public boolean active;

    // 🔹 Juggling Exam Progression
    public int currentJugglingLevel = 1;
    public int lastJuggleCount = 0;
    public int requiredJuggles = 0;
    public String jerseyColor = "None";
    public boolean levelUnlocked = false;

    // 🔹 Visual Identity
    public String photoUrl = ""; // e.g., "images/players/U13-001.jpg"

    // 🔹 Drill & Feedback Tracking
    public List<String> completedDrills = new ArrayList<>();
    public List<Map<String, Object>> drillAttempts = new ArrayList<>();
    public List<Map<String, String>> coachNotes = new ArrayList<>();

    // 🔹 Constructors
    public Player() {}

    public Player(String id, String fullName, String dob, int level, String position,
                  int points, int rank, int stars, String ageGroup,
                  boolean eligible, boolean active) {
        this.id = id;
        this.fullName = fullName;
        this.dob = dob;
        this.level = level;
        this.position = position;
        this.points = points;
        this.rank = rank;
        this.stars = stars;
        this.ageGroup = ageGroup;
        this.eligible = eligible;
        this.active = active;
    }

    // 🔹 Juggling: Unlock Check
    public boolean checkLevelUnlock(int requiredJuggles) {
        this.requiredJuggles = requiredJuggles;
        levelUnlocked = lastJuggleCount >= requiredJuggles;
        return levelUnlocked;
    }

    // 🔹 Juggling: Level Advancement
    public boolean tryAdvanceLevel() {
        if (checkLevelUnlock(requiredJuggles) && currentJugglingLevel < 13) {
            currentJugglingLevel++;
            lastJuggleCount = 0;
            levelUnlocked = false;
            jerseyColor = "None";
            return true;
        }
        return false;
    }

    // 🔹 Juggling: Badge by Level
    public String getBadge() {
        switch (currentJugglingLevel) {
            case 1: return "🪀 Beginner";
            case 2: return "🎮 Control";
            case 3: return "🔄 Alternation";
            case 4: return "🔷 Sequence2";
            case 5: return "🃏 Combo Master";
            case 6: return "🔷 Sequence3";
            case 7: return "🃏 Combo3";
            case 8: return "🔷 Sequence4";
            case 9: return "🪜 Ladder";
            case 10: return "🔷 Advanced";
            case 11: return "💎 Elite";
            case 12: return "🔱 Master";
            case 13: return "🎨 Freestyle Creator";
            default: return "🎯 Level " + currentJugglingLevel;
        }
    }

    // 🔹 Visual: Extract Emoji from Badge
    public String badgeEmoji() {
        String badge = getBadge();
        return badge.length() >= 2 ? badge.substring(0, 2).trim() : "🎯";
    }

    // 🔹 Static: Age Calculation
    public static int calculateAge(String dob) {
        try {
            java.time.LocalDate birthDate = java.time.LocalDate.parse(dob, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            return java.time.Period.between(birthDate, java.time.LocalDate.now()).getYears();
        } catch (Exception e) {
            System.err.println("❌ Invalid DOB format: " + dob);
            return 0;
        }
    }

    // 🔹 Static: Age Group Assignment
    public static String getAgeGroup(int age) {
        if (age <= 8) return "U9";
        if (age <= 10) return "U11";
        if (age <= 12) return "U13";
        if (age <= 14) return "U15";
        if (age <= 16) return "U17";
        return "U19";
    }

    // 🔹 Static: Unique ID Generator
    public static String generateID(String fullName, String dob, String seasonCode) {
        String initials = fullName.replaceAll("[^A-Za-z]", "").toUpperCase();
        String dobCode = dob.replaceAll("-", "");
        return seasonCode + "-" + initials + "-" + dobCode;
    }
}