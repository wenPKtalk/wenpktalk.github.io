public class Probe {
    public static void main(String[] args) throws Exception {
        ClassLoader l = Probe.class.getClassLoader();
        while (l != null) { System.out.println("loader: " + l.getName() + " " + l.getClass().getName()); l = l.getParent(); }
        System.out.println("String loader: " + String.class.getClassLoader());
        System.out.println("java.sql.Date loader: " + java.sql.Date.class.getClassLoader().getName());
        String a = new String("jvm");
        System.out.println("intern same: " + (a.intern() == "jvm") + ", new same: " + (a == "jvm"));
        if (args.length > 0) Thread.sleep(4000);
    }
}
