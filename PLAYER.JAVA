package com.cmdfootball;

import java.util.*;
import java.io.*;

public class SquadBuilder {
    private static HashSet<String> usedIDs = new HashSet<>();

    public static boolean isUniqueID(String id) {
        return !usedIDs.contains(id);
    }

    public static void registerID(String id) {
        usedIDs.add(id);
    }

    public static List<Team> buildTeamsFromCSV(String filename) {
        Map<String, Team> teams = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line = br.readLine(); // skip header
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                String fullName = parts[0];
                String dob = parts[1];
                int level = Integer.parseInt(parts[2]);
                String position = parts[3];
                int points = Integer.parseInt(parts[4]);
                int rank = Integer.parseInt(parts[5]);
                int stars = Integer.parseInt(parts[6]);

                String ageGroup = Player.getAgeGroup(Player.calculateAge(dob));
                String id = Player.generateID(fullName, dob, "25FALL");
                if (!isUniqueID(id)) {
                    id += "-" + (int)(Math.random() * 1000);
                }
                registerID(id);

                Player p = new Player(id, fullName, dob, level, position, points, rank, stars, ageGroup, true, true);
                teams.putIfAbsent(ageGroup, new Team(ageGroup + " Squad", ageGroup));
                teams.get(ageGroup).addPlayer(p);
            }
        } catch (Exception e) {
            System.out.println("❌ Error reading CSV: " + e.getMessage());
        }
        return new ArrayList<>(teams.values());
    }

    // Optional: hardcoded squad builder
    public static Player[] buildSquad() {
        return new Player[] {
            new Player("U13-001", "Zayd Karim", "2012-04-15", 3, "Midfielder", 87, 4, 3, "U13", true, true),
            new Player("U13-002", "Liam Chen", "2012-06-22", 2, "Defender", 75, 6, 2, "U13", true, true),
            // Add more players as needed...
        };
    }
}