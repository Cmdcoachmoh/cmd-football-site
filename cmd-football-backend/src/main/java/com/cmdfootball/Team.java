package com.cmdfootball;

import java.util.*;
import com.google.gson.Gson;

public class Team {
    public String name;
    public String ageGroup;
    public List<Player> players;

    public Team(String name, String ageGroup) {
        this.name = name;
        this.ageGroup = ageGroup;
        this.players = new ArrayList<>();
    }

    // 🔹 Add a player to the team
    public void addPlayer(Player p) {
        players.add(p);
    }

    // 🔹 Get total number of players
    public int getPlayerCount() {
        return players.size();
    }

    // 🔹 Get average points across all players
    public double getAveragePoints() {
        if (players.isEmpty()) return 0;
        int total = 0;
        for (Player p : players) {
            total += p.points;
        }
        return total / (double) players.size();
    }

    // 🔹 Get average level across all players
    public double getAverageLevel() {
        if (players.isEmpty()) return 0;
        int total = 0;
        for (Player p : players) {
            total += p.level;
        }
        return total / (double) players.size();
    }

    // 🔹 Get top-ranked player (lowest rank value)
    public Player getTopRankedPlayer() {
        if (players.isEmpty()) return null;
        Player top = players.get(0);
        for (Player p : players) {
            if (p.rank < top.rank) {
                top = p;
            }
        }
        return top;
    }

    // 🔹 Get top scorer (highest points)
    public Player getTopScorer() {
        if (players.isEmpty()) return null;
        Player top = players.get(0);
        for (Player p : players) {
            if (p.points > top.points) {
                top = p;
            }
        }
        return top;
    }

    // 🔹 Filter players by position
    public List<Player> filterByPosition(String position) {
        List<Player> result = new ArrayList<>();
        for (Player p : players) {
            if (p.position != null && p.position.equalsIgnoreCase(position)) {
                result.add(p);
            }
        }
        return result;
    }

    // 🔹 Filter players by eligibility
    public List<Player> getEligiblePlayers() {
        List<Player> eligible = new ArrayList<>();
        for (Player p : players) {
            if (p.eligible) {
                eligible.add(p);
            }
        }
        return eligible;
    }

    // 🔹 Print team summary to console
    public void printTeamSummary() {
        System.out.println("📋 Team: " + name + " (" + ageGroup + ")");
        System.out.println("Total Players: " + getPlayerCount());
        System.out.printf("Average Points: %.2f | Average Level: %.2f\n", getAveragePoints(), getAverageLevel());

        Player topRanked = getTopRankedPlayer();
        Player topScorer = getTopScorer();
        if (topRanked != null) {
            System.out.println("🏅 Top Ranked: " + topRanked.fullName + " (Rank " + topRanked.rank + ")");
        }
        if (topScorer != null) {
            System.out.println("⚽ Top Scorer: " + topScorer.fullName + " (" + topScorer.points + " pts)");
        }
        System.out.println("-----------------------------");
    }

    // 🔹 Export team summary as CSV line
    public String toCSVSummary() {
        return String.format("%s,%s,%d,%.2f,%.2f",
            name, ageGroup, getPlayerCount(), getAveragePoints(), getAverageLevel());
    }

    // 🔹 Export team as JSON string
    public String toJSON(Gson gson) {
        return gson.toJson(this);
    }
}