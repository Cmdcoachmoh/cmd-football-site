package com.cmdfootball;
import static spark.Spark.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.*;

public class Server {
    public static void main(String[] args) {
        System.out.println("🚀 CMD Football Server starting...");

        // 🔹 Serve static files from external /public folder
        staticFiles.externalLocation("public");

        // 🔹 Health check
        get("/test", (req, res) -> "✅ Spark is running.");

        // 🔹 Redirect root
        get("/", (req, res) -> {
            res.redirect("/index.html");
            return null;
        });

        // 🔹 Gson setup
        Gson gson = new Gson();

        // 🔹 Load teams from CSV
        List<Team> teams = SquadBuilder.buildTeamsFromCSV("data/players_raw.csv");
        

// 🔹 POST: Submit Juggling Result
post("/api/submitJuggle", (request, response) -> {
    response.type("application/json");
    

    Type jsonType = new TypeToken<Map<String, Object>>() {}.getType();
    Map<String, Object> requestData = gson.fromJson(request.body(), jsonType);

    String playerId = (String) requestData.get("id");
    

    int juggles = requestData.get("juggles") != null
        ? Integer.parseInt(requestData.get("juggles").toString())
        : 0;

    int bonus = requestData.get("bonus") != null
        ? Integer.parseInt(requestData.get("bonus").toString())
        : 0;

    int malus = requestData.get("malus") != null
        ? Integer.parseInt(requestData.get("malus").toString())
        : 0;

    int totalScore = juggles + bonus - malus;

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        response.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    int requiredJuggles = JugglingLevels.getRequiredJuggles(target.currentJugglingLevel);
    String jerseyColor = JugglingLevels.getJerseyColor(target.currentJugglingLevel);

    target.lastJuggleCount = totalScore;
    target.requiredJuggles = requiredJuggles;
    target.jerseyColor = jerseyColor;
    target.levelUnlocked = target.checkLevelUnlock(requiredJuggles);

    // ✅ Add this block here — after updating fields
    if (target.levelUnlocked) {
        boolean advanced = target.tryAdvanceLevel();
        if (advanced) {
            System.out.println("🚀 " + target.fullName + " promoted to Level " + target.currentJugglingLevel);
            Map<String, Object> juggleSummary = new HashMap<>();
juggleSummary.put("player", target.fullName);
juggleSummary.put("level", target.currentJugglingLevel);
juggleSummary.put("score", totalScore);
juggleSummary.put("required", requiredJuggles);
juggleSummary.put("unlocked", target.levelUnlocked);
juggleSummary.put("badge", target.getBadge());
juggleSummary.put("jerseyColor", target.jerseyColor);

return gson.toJson(juggleSummary);
        }
    }
    

    // ✅ Log attempt
    Map<String, Object> attemptLog = new HashMap<>();
    attemptLog.put("drill", "Juggling");
    attemptLog.put("result", target.levelUnlocked ? "Unlocked" : "Not unlocked");
    attemptLog.put("timestamp", System.currentTimeMillis());
    target.drillAttempts.add(attemptLog);

    // ✅ Build response
    Map<String, Object> responseBody = new HashMap<>();
    responseBody.put("message", "✅ Juggle submitted");
    responseBody.put("playerId", target.id);
    responseBody.put("level", target.currentJugglingLevel);
    responseBody.put("total", totalScore);
    responseBody.put("required", requiredJuggles);
    responseBody.put("jerseyColor", jerseyColor);
    responseBody.put("unlocked", target.levelUnlocked);

    return gson.toJson(responseBody);
});

        // 🔹 GET: Export full player data
        get("/api/export-full", (req, res) -> {
            res.type("text/csv");
            res.header("Content-Disposition", "attachment; filename=players_full_export.csv");

            StringBuilder csv = new StringBuilder("ID,Full Name,DOB,Team,Position,Level,Points,Rank,Stars,Age Group,Eligible,Active,Juggling Level,Last Juggles,Badge\n");

            for (Team team : teams) {
                for (Player p : team.players) {
                    csv.append(String.format("%s,%s,%s,%s,%s,%d,%d,%d,%d,%s,%b,%b,%d,%d,%s\n",
                        p.id, p.fullName, p.dob, p.team, p.position, p.level, p.points, p.rank, p.stars,
                        p.ageGroup, p.eligible, p.active, p.currentJugglingLevel, p.lastJuggleCount, p.getBadge()));
                }
            }
            

            System.out.println("📤 Full export complete.");
            return csv.toString();
        });

        // 🔹 GET: All teams and players
        get("/api/teams", (req, res) -> {
            res.type("application/json");
            return gson.toJson(teams);
        });
        get("/api/teamReport", (req, res) -> {
    res.type("application/json");

    List<Map<String, Object>> report = new ArrayList<>();

    for (Team team : teams) {
        for (Player target : team.players) {
            Map<String, Object> juggleSummary = new HashMap<>();
            juggleSummary.put("team", team.name);
            juggleSummary.put("player", target.fullName);
            juggleSummary.put("level", target.currentJugglingLevel);
            juggleSummary.put("score", target.lastJuggleCount);
            juggleSummary.put("required", target.requiredJuggles);
            juggleSummary.put("unlocked", target.levelUnlocked);
            juggleSummary.put("badge", target.getBadge());
            juggleSummary.put("jerseyColor", target.jerseyColor);

            report.add(juggleSummary);
        }
    }

    return gson.toJson(report);
});

        // 🔹 GET: Single player by ID
       get("/api/player/:id", (req, res) -> {
    res.type("application/json");
    String lookupId = req.params(":id");
    

    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(lookupId)) {
                return gson.toJson(p);
            }
        }
    }

    res.status(404);
    Map<String, String> error = new HashMap<>();
    error.put("message", "✘ Player not found: " + lookupId);
    return gson.toJson(error);
    
});

        // 🔹 GET: Coach dashboard summaries
        get("/api/dashboard", (req, res) -> {
            res.type("application/json");

            List<Map<String, Object>> summaries = new ArrayList<>();
            for (Team team : teams) {
                for (Player p : team.players) {
                    Map<String, Object> summary = new HashMap<>();
                    summary.put("id", p.id);
                    summary.put("name", p.fullName);
                    summary.put("team", p.team);
                    summary.put("level", p.level);
                    summary.put("jugglingLevel", p.currentJugglingLevel);
                    summary.put("badge", p.getBadge());
                    summary.put("position", p.position);
                    summary.put("ageGroup", p.ageGroup);
                    summaries.add(summary);
                }
            }

            return gson.toJson(summaries);
        });
get("/api/playerDashboard/:id", (req, res) -> {
    res.type("application/json");
    String playerId = req.params(":id");

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        res.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    // ✅ Add this line here
    String jerseyAsset = "jerseys/level_" + target.currentJugglingLevel + ".png";

    Map<String, Object> dashboard = new HashMap<>();
    dashboard.put("fullName", target.fullName);
    dashboard.put("level", target.currentJugglingLevel);
    dashboard.put("badge", target.getBadge());
    dashboard.put("badgeEmoji", target.badgeEmoji());
    dashboard.put("jerseyColor", target.jerseyColor);
    dashboard.put("jerseyAsset", jerseyAsset); // ✅ Include in response
    dashboard.put("levelUnlocked", target.levelUnlocked);
    dashboard.put("lastJuggleCount", target.lastJuggleCount);
    dashboard.put("requiredJuggles", target.requiredJuggles);

    return gson.toJson(dashboard);
});
        // 🔹 GET: Certificate data for level unlock
        get("/api/certificate/:id", (req, res) -> {
            res.type("application/json");
            String playerId = req.params(":id");

            for (Team team : teams) {
                for (Player p : team.players) {
                    if (p.id.equalsIgnoreCase(playerId)) {
                        Map<String, String> cert = new HashMap<>();
                        cert.put("name", p.fullName);
                        cert.put("level", String.valueOf(p.currentJugglingLevel));
                        cert.put("badge", p.getBadge());
                        cert.put("message", "🏅 Congratulations " + p.fullName + "! You've unlocked Level " + p.currentJugglingLevel + " (" + p.getBadge() + ")");
                        return gson.toJson(cert);
                    }
                }
            }

            res.status(404);
            return gson.toJson("❌ Player not found: " + playerId);
        });
        // 🔹 Drill storage
List<Map<String, Object>> drills = new ArrayList<>();

// 🔹 POST: Save new drill
post("/api/drills", (req, res) -> {
    res.type("application/json");
    Type drillType = new TypeToken<Map<String, Object>>() {}.getType();
    Map<String, Object> drill = gson.fromJson(req.body(), drillType);
    drills.add(drill);
    System.out.println("🛠️ Drill saved: " + drill.get("name"));
    return "✅ Drill saved successfully.";
});


// 🔹 GET: List all drills
get("/api/drills", (req, res) -> {
    res.type("application/json");
    return gson.toJson(drills);
});

post("/api/submitExam", (req, res) -> {
    res.type("application/json");
    Type mapType = new TypeToken<Map<String, Object>>() {}.getType();
    Map<String, Object> data = gson.fromJson(req.body(), mapType);
String playerId = (String) data.get("id");

int rawJuggles = data.get("juggles") != null
    ? Integer.parseInt(data.get("juggles").toString())
    : 0;

int bonus = data.get("bonus") != null
    ? Integer.parseInt(data.get("bonus").toString())
    : 0;

int malus = data.get("malus") != null
    ? Integer.parseInt(data.get("malus").toString())
    : 0;

int total = rawJuggles + bonus - malus;
    

   Player target = null;
for (Team team : teams) {
    for (Player p : team.players) {
        if (p.id.equalsIgnoreCase(playerId)) {
            target = p;
            break;
        }
    }
    if (target != null) break;
}

if (target == null) {
    res.status(400);
    Map<String, String> error = new HashMap<>();
    error.put("message", "Player not found");
    return gson.toJson(error);
}

// Now safe to use
// ✅ Calculate required juggles and jersey color
int requiredJuggles = JugglingLevels.getRequiredJuggles(target.currentJugglingLevel);
target.jerseyColor = JugglingLevels.getJerseyColor(target.currentJugglingLevel);

// ✅ Update player fields
target.lastJuggleCount = total;
target.requiredJuggles = requiredJuggles;

// ✅ Check unlock status
boolean unlocked = target.checkLevelUnlock(requiredJuggles);
target.levelUnlocked = unlocked;

// ✅ Build feedback message
String msg = unlocked
    ? "🎉 Level Unlocked! Now at Level " + target.currentJugglingLevel + " (" + target.getBadge() + ")"
    : "Keep training! You need " + requiredJuggles + " points to unlock Level " + (target.currentJugglingLevel + 1);

System.out.println("🧪 Exam submitted for " + target.fullName + ": " + total + " → " + msg);
return gson.toJson(Map.of("message", msg));
});
// 🔹 POST: Mark Drill Complete
post("/api/markDrillComplete", (req, res) -> {
    res.type("application/json");
    Type mapType = new TypeToken<Map<String, String>>() {}.getType();
    Map<String, String> data = gson.fromJson(req.body(), mapType);

    String playerId = data.get("id");
    String drillName = data.get("drill");

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        res.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    if (!target.completedDrills.contains(drillName)) {
        target.completedDrills.add(drillName);
    }

    System.out.println("✅ Drill marked complete for " + target.fullName + ": " + drillName);
    return gson.toJson(Map.of("message", "✅ Drill marked complete"));
});
post("/api/logDrillAttempt", (req, res) -> {
    res.type("application/json");
    Type mapType = new TypeToken<Map<String, Object>>() {}.getType();
    Map<String, Object> data = gson.fromJson(req.body(), mapType);

    String playerId = (String) data.get("id");
    String drillName = (String) data.get("drill");
    String result = (String) data.get("result");

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        res.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    Map<String, Object> attempt = new HashMap<>();
    attempt.put("drill", drillName);
    attempt.put("result", result);
    attempt.put("timestamp", System.currentTimeMillis());

    target.drillAttempts.add(attempt);
    return gson.toJson(Map.of("message", "✅ Drill attempt logged"));
});
post("/api/addCoachNote", (req, res) -> {
    res.type("application/json");
    Type mapType = new TypeToken<Map<String, String>>() {}.getType();
    Map<String, String> data = gson.fromJson(req.body(), mapType);

    String playerId = data.get("id");
    String note = data.get("note");

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        res.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    Map<String, String> entry = new HashMap<>();
    entry.put("note", note);
    entry.put("timestamp", new Date().toString());

    target.coachNotes.add(entry);
    return gson.toJson(Map.of("message", "✅ Note added"));
});
post("/api/logDrillAttempt", (req, res) -> {
    res.type("application/json");
    Type mapType = new TypeToken<Map<String, Object>>() {}.getType();
    Map<String, Object> data = gson.fromJson(req.body(), mapType);

    String playerId = (String) data.get("id");
    String drillName = (String) data.get("drill");
    String result = (String) data.get("result");

    Player target = null;
    for (Team team : teams) {
        for (Player p : team.players) {
            if (p.id.equalsIgnoreCase(playerId)) {
                target = p;
                break;
            }
        }
        if (target != null) break;
    }

    if (target == null) {
        res.status(404);
        return gson.toJson(Map.of("message", "❌ Player not found"));
    }

    Map<String, Object> attempt = new HashMap<>();
    attempt.put("drill", drillName);
    attempt.put("result", result);
    attempt.put("timestamp", System.currentTimeMillis());

    target.drillAttempts.add(attempt);
    System.out.println("📌 Drill attempt logged for " + target.fullName + ": " + drillName + " → " + result);
    return gson.toJson(Map.of("message", "✅ Drill attempt logged"));
});

        System.out.println("✅ Server is live at http://localhost:4567/");
    }
}