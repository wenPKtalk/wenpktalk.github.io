public class Threads {
    public static void main(String[] args) throws Exception {
        long pid = ProcessHandle.current().pid();
        new ProcessBuilder("jcmd", String.valueOf(pid), "Thread.print").inheritIO().start().waitFor();
    }
}
