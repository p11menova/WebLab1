package org.example;

public class ServerLogic {
    public static boolean checkIfInSquare(String x1, String y1, String r1) {
        var x = Integer.parseInt(x1);
        var y = Float.parseFloat(y1);
        var r = Integer.parseInt(r1);

        if (x < 0 && y< 0) return false;

        return (0 <= x && x <= r && 0 <= y && y <= r)
                ||  (-r <= y && y <= 0 && y >= 2 * x - r)
                || ((x <= 0) && (0 <= y) && x * x + y * y <= ((float)r * r)/4);

        }


    public static boolean checkX(String x1) throws NumberFormatException{
        var x = Integer.parseInt(x1);
        return -4 <= x && x <= 4;
    }
    public static boolean checkY(String y1) throws NumberFormatException{
        var y = Float.parseFloat(y1);
        return -3 <= y && y <= 5;
    }
    public static boolean checkR(String r1) throws NumberFormatException{
        var r = Integer.parseInt(r1);
        return 1 <= r && r <= 5;
    }
}
