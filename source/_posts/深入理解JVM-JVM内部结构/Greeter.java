package demo;

public class Greeter {
    public void greet() {
        System.out.println("Hi");
    }

    static long add(int a, long b) {
        long sum = a + b;
        return sum;
    }

    Object make() {
        return new Object();
    }

    int parse(String s) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return -1;
        } finally {
            System.out.println("done");
        }
    }
}
