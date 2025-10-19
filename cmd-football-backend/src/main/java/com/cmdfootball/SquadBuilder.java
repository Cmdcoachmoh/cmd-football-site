package com.cmdfootball;

import java.util.*;
import java.io.*;

public class SquadBuilder {
    private static HashSet<String> usedIDs = new HashSet<>();

    // 🔹 Check if ID is unique
    public static boolean isUniqueID(String id) {
        return !usedIDs.contains(id);
    }

    // 🔹 Register ID to prevent duplicates
    public static void registerID(String id) {
        usedIDs.add(id);
    }

    // 🔹 Build teams from CSV file
    public static List<Team> buildTeamsFromCSV(String filename) {
        Map<String, Team> teams = new HashMap<>();

        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line = br.readLine(); // Skip header
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 7) continue;

                String fullName = parts[0].trim();
                String dob = parts[1].trim();
                int level = parseIntSafe(parts[2]);
                String position = parts[3].trim();
                int points = parseIntSafe(parts[4]);
                int rank = parseIntSafe(parts[5]);
                int stars = parseIntSafe(parts[6]);

                int age = Player.calculateAge(dob);
                String ageGroup = Player.getAgeGroup(age);
                String id = Player.generateID(fullName, dob, "25FALL");

                if (!isUniqueID(id)) {
                    id += "-" + (int)(Math.random() * 1000);
                }
                registerID(id);

                Player p = new Player(id, fullName, dob, level, position, points, rank, stars, ageGroup, true, true);
                p.team = ageGroup + " Squad";
                p.photoUrl = "images/players/" + id + ".jpg"; // 🔹 Assign photo path

                teams.putIfAbsent(p.team, new Team(p.team, ageGroup));
                teams.get(p.team).addPlayer(p);

                System.out.println("✅ Loaded: " + p.fullName + " → " + p.team);
            }
        } catch (Exception e) {
            System.out.println("❌ Error reading CSV: " + e.getMessage());
        }

        return new ArrayList<>(teams.values());
    }

    // 🔹 Safe integer parsing
    private static int parseIntSafe(String s) {
        try {
            return Integer.parseInt(s.trim());
        } catch (Exception e) {
            return 0;
        }
    }

    // 🔹 Optional: hardcoded squad builder for testing
    public static Player[] buildSquad() {
        Player[] squad = new Player[] {
            new Player("U13-001", "Zayd Karim", "2012-04-15", 3, "Midfielder", 87, 4, 3, "U13", true, true),
            new Player("U13-002", "Liam Chen", "2012-06-22", 2, "Defender", 75, 6, 2, "U13", true, true),
            new Player("U13-003", "Noah Singh", "2012-01-10", 4, "Forward", 92, 2, 4, "U13", true, true),
            new Player("U13-004", "Yara Haddad", "2012-09-30", 3, "Goalkeeper", 80, 5, 3, "U13", true, true)
        };

        for (Player p : squad) {
            p.team = p.ageGroup + " Squad";
            p.photoUrl = "images/players/" + p.id + ".jpg"; // 🔹 Assign photo path
        }

        return squad;
    }
}