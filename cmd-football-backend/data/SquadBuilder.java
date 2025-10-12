import java.util.HashSet;
import java.io.*;
import java.util.*;

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
}

public class SquadBuilder {
    // 🔹 ID registry
    private static HashSet<String> usedIDs = new HashSet<>();

    public static boolean isUniqueID(String id) {
        return !usedIDs.contains(id);
    }

    public static void registerID(String id) {
        usedIDs.add(id);
    }

    // 🔹 Your buildSquad() method goes here
}
public class SquadBuilder {
    public static Player[] buildSquad() {
        return new Player[] {
            new Player("U13-001", "Zayd Karim", "2012-04-15", 3, "Midfielder", 87, 4, 3, "U13"),
            new Player("U13-002", "Liam Chen", "2012-06-22", 2, "Defender", 75, 6, 2, "U13"),
            new Player("U13-003", "Noah Singh", "2012-01-30", 4, "Forward", 92, 2, 4, "U13"),
            new Player("U13-004", "Mason Ali", "2012-03-10", 3, "Goalkeeper", 68, 8, 1, "U13"),
            new Player("U13-005", "Ethan Roy", "2012-07-19", 2, "Midfielder", 80, 5, 2, "U13"),
            new Player("U13-006", "Aiden Patel", "2012-05-05", 3, "Defender", 74, 7, 2, "U13"),
            new Player("U13-007", "Lucas Ahmed", "2012-02-28", 4, "Forward", 95, 1, 5, "U13"),
            new Player("U13-008", "Benjamin Tran", "2012-08-12", 2, "Midfielder", 70, 9, 1, "U13"),
            new Player("U13-009", "Henry Zhao", "2012-09-03", 3, "Defender", 78, 6, 2, "U13"),
            new Player("U13-010", "William Kim", "2012-11-21", 3, "Forward", 85, 3, 3, "U13"),
            // Add 60 more players below with unique IDs and varied stats...
            new Player("U13-011", "Player 11", "2012-01-01", 2, "Midfielder", 65, 10, 1, "U13"),
            new Player("U13-012", "Player 12", "2012-01-02", 3, "Defender", 72, 9, 2, "U13"),
            new Player("U13-013", "Player 13", "2012-01-03", 4, "Forward", 88, 5, 3, "U13"),
            new Player("U13-014", "Player 14", "2012-01-04", 1, "Goalkeeper", 60, 12, 1, "U13"),
            new Player("U13-015", "Player 15", "2012-01-05", 3, "Midfielder", 77, 7, 2, "U13"),
            // ...
            new Player("U13-070", "Player 70", "2012-12-31", 3, "Forward", 90, 2, 4, "U13")
        };
        String id = Player.generateID(fullName, dob, "25FALL");
if (!isUniqueID(id)) {
    id += "-" + (int)(Math.random() * 1000);
}
registerID(id);
Player p = new Player(id, fullName, dob, level, position, points, rank, stars, team, true, true);
    }
    public static void main(String[] args) {
    String fullName = "Zayd Karim";
    String dob = "2012-04-15";
    String id = Player.generateID(fullName, dob, "25FALL");
    if (!IDRegistry.isUnique(id)) {
        id += "-" + (int)(Math.random() * 1000);
    }
    IDRegistry.register(id);

    Player p = new Player(id, fullName, dob, 3, "Midfielder", 87, 4, 3, "U13", true, true);
    Team u13 = new Team("U13 Stars", "U13");
    u13.addPlayer(p);
}

}
