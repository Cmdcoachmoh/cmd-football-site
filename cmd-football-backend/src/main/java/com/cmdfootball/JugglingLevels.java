package com.cmdfootball;

public class JugglingLevels {

    public static int getRequiredJuggles(int level) {
        switch (level) {
            case 1: return 620;
            case 2: return 270;
            case 3: return 190;
            case 4: return 630;
            case 5: return 480;
            case 6: return 450;
            case 7: return 300;
            case 8: return 120;
            case 9: return 100;
            case 10: return 100;
            case 11: return 100;
            case 12: return 100;
            case 13: return 0; // Freestyle
            default: return 9999;
        }
    }

    public static String getJerseyColor(int level) {
        switch (level) {
            case 1: return "Green";
            case 2: return "Blue";
            case 3: return "Navy Blue";
            case 4: return "Sky Blue";
            case 5: return "Dark Blue";
            case 6: return "Orange";
            case 7: return "Yellow";
            case 8: return "White";
            case 9: return "Pink";
            case 10:
            case 11:
            case 12: return "Lime Green";
            case 13: return "Country Flag";
            default: return "None";
        }
    }
}