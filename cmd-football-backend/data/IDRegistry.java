import java.util.HashSet;

public class IDRegistry {
    private static HashSet<String> usedIDs = new HashSet<>();

    public static boolean isUnique(String id) {
        return !usedIDs.contains(id);
    }

    public static void register(String id) {
        usedIDs.add(id);
    }
}