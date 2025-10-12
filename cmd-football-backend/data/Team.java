import java.util.ArrayList;
import java.util.List;

public class Team {
    public String name;
    public String ageGroup;
    public List<Player> players;

    public Team(String name, String ageGroup) {
        this.name = name;
        this.ageGroup = ageGroup;
        this.players = new ArrayList<>();
    }

    public void addPlayer(Player p) {
        players.add(p);
    }

    public double getAveragePoints() {
        if (players.isEmpty()) return 0;
        int total = 0;
        for (Player p : players) {
            total += p.totalPoints;
        }
        return total / (double) players.size();
    }

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

    public List<Player> filterByPosition(String position) {
        List<Player> result = new ArrayList<>();
        for (Player p : players) {
            if (p.position.equalsIgnoreCase(position)) {
                result.add(p);
            }
        }
        return result;
    }

    public void printTeamSummary() {
        System.out.println("Team: " + name + " (" + ageGroup + ")");
        System.out.println("Total Players: " + players.size());
        System.out.printf("Average Points: %.2f\n", getAveragePoints());
        Player top = getTopRankedPlayer();
        if (top != null) {
            System.out.println("Top Ranked Player: " + top.fullName + " (Rank " + top.rank + ")");
        }
        System.out.println("-----------------------------");
    }
     // ✅ Add this method here
    public String toCSVSummary() {
        return name + "," + ageGroup + "," + players.size() + "," + String.format("%.2f", getAveragePoints());
    }
}



