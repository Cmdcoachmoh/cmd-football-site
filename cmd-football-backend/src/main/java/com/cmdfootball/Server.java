package com.cmdfootball;

import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.*;
import java.io.*;

public class Server {
    public static void main(String[] args) {
        // Serve static files from /public folder
        staticFiles.location("/public");

        // Redirect root to index.html
        get("/", (req, res) -> {
            res.redirect("/index.html");
            return null;
        });

        // Initialize Gson for JSON serialization
        Gson gson = new Gson();

        // Load teams from CSV using SquadBuilder
        List<Team> teams = SquadBuilder.buildTeamsFromCSV("data/players_raw.csv");

        // GET: Return all players
        get("/api/players", (req, res) -> {
            List<Player> allPlayers = new ArrayList<>();
            for (Team team : teams) {
                allPlayers.addAll(team.players);
            }
            res.type("application/json");
            return allPlayers;
        }, gson::toJson);

        // GET: Return all teams
        get("/api/teams", (req, res) -> {
            res.type("application/json");
            return teams;
        }, gson::toJson);

        // POST: Register a new player
        post("/api/register", (req, res) -> {
            res.type("application/json");

            Player newPlayer = gson.fromJson(req.body(), Player.class);

            if (newPlayer == null || newPlayer.fullName == null || newPlayer.dob == null || newPlayer.team == null) {
                res.status(400);
                return gson.toJson("❌ Missing required fields");
            }

            for (Team team : teams) {
                if (team.name.equalsIgnoreCase(newPlayer.team)) {
                    team.addPlayer(newPlayer);

                    // Save to CSV
                    File file = new File("data/players_registered.csv");
boolean fileExists = file.exists();

try (FileWriter writer = new FileWriter(file, true)) {
    if (!fileExists) {
        writer.write("Full Name,DOB,Team,Position,Level\n"); // Write header only once
    }
    writer.write(String.format("%s,%s,%s,%s,%d\n",
        newPlayer.fullName, newPlayer.dob, newPlayer.team, newPlayer.position, newPlayer.level));
} catch (IOException e) {
    System.err.println("❌ Failed to write to file: " + e.getMessage());
}

            res.status(404);
            return gson.toJson("❌ Team not found: " + newPlayer.team);
        });

        // GET: Export all players as CSV
        get("/api/export", (req, res) -> {
            StringBuilder csv = new StringBuilder("Full Name,DOB,Team,Position,Level\n");
            for (Team team : teams) {
                for (Player p : team.players) {
                    csv.append(String.format("%s,%s,%s,%s,%d\n",
                        p.fullName, p.dob, p.team, p.position, p.level));
                }
            }
            res.type("text/csv");
            return csv.toString();
        });
    }
}