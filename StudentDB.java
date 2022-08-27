public class StudentDB {
    /**
     * create a database of students with studentID and studentNumber
     */

    String studentID;
    String studentNumber;
    String studentName;

    public StudentDB(String studentID, String studentNumber, String studentName) {
        this.studentID = studentID;
        this.studentNumber = studentNumber;
        this.studentName = studentName;
    }

    public String getStudentID() {
        return studentID;
    }

    public void setStudentID(String studentID) {
        this.studentID = studentID;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    // get the name of students
    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public static void main(String[] args) {
        StudentDB student1 = new StudentDB("123", "12345", "John");
        StudentDB student2 = new StudentDB("456", "54321", "Mary");
        
        // get the names of all students and corrosponding studentID and studentNumber
        // loop through all students
        for (StudentDB student : new StudentDB[]{student1, student2}) {
            System.out.println(student.getStudentName() + " " + student.getStudentID() + " " + student.getStudentNumber());
        }
    }
}
