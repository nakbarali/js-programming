// ============================================================
//  JAVASCRIPT STRINGS — PAYROLL PROJECT VERSION
//  Run:  node StringsPayroll.js
//
//  Every example is from a
//  PAYROLL system: employees, IDs, pay, paystubs.
//
//  Each line prints:   what we tried  →  the result  ✅ or ❌
//
//  RULE #1: String methods NEVER change the original string.
//           They give you back a NEW value.
//           (Java is the same: Strings are "immutable".)
// ============================================================


// ---------- 3 helper functions ----------

// Prints a title for each part of the lesson.
// Java: System.out.println("\n--- " + title + " ---");
function section(title) {
    console.log(`\n<<< ${title} >>>`);
}

// Mini test: is my result the same as the expected result?
// JSON.stringify = turn any value into text, so lists and
// objects can be compared fairly.
// Java (JUnit): assertEquals(expected, actual);
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${label.padEnd(34)} → ${JSON.stringify(actual)} ${ok ? "✅" : "❌ expected " + JSON.stringify(expected)}`);
}

// Prints a helpful note with a 💡.
// Java: System.out.println("   💡 " + text);
function tip(text) {
    console.log(`   💡 ${text}`);
}


// ------------------------------------------------------------
section("1. Length — check the Employee ID");
// ------------------------------------------------------------
// In our company, every Employee ID has 6 characters.
// const = a value that will not change.
// Java: final String empId = "EMP001";
const empId = "EMP001";

check("empId.length", empId.length, 6);
check("empty ID (user typed nothing)", "".length, 0);
check("spaces count too", "EMP 01".length, 6);

// Real use: is the ID the right size?
check("is ID valid? (length === 6)", empId.length === 6, true);
tip("JS: empId.length (NO parentheses). Java: empId.length() (WITH parentheses).");


// ------------------------------------------------------------
section("2. Getting one character — department code");
// ------------------------------------------------------------
// The FIRST letter of a department code tells the department.
//   "HR-204" → H = Human Resources
//
//   H  R  -  2  0  4
//   0  1  2  3  4  5    ← positions start at 0 (same as Java)
//  -6 -5 -4 -3 -2 -1    ← at() can count from the END
const deptCode = "HR-204";

check("deptCode[0]", deptCode[0], "H");
check("deptCode.at(0)", deptCode.at(0), "H");
check("deptCode.at(-1)  (last)", deptCode.at(-1), "4");
check("deptCode.charAt(1)", deptCode.charAt(1), "R");
check("deptCode[99]  (no such spot)", deptCode[99], undefined);
// undefined = "nothing is there".
// Java would CRASH here: StringIndexOutOfBoundsException.
tip("Java: deptCode.charAt(0). Java has no at(-1); use charAt(s.length() - 1).");


// ------------------------------------------------------------
section("3. Upper and lower case — clean names");
// ------------------------------------------------------------
// HR typed names in different ways. We make them the same.
check("toUpperCase()", "smith".toUpperCase(), "SMITH");
check("toLowerCase()", "SMITH".toLowerCase(), "smith");

// Real use: make a name look nice on a paystub.
// Take the first letter → make it BIG → add the rest.
// Java: name.substring(0,1).toUpperCase() + name.substring(1)
const empName = "nargiza";
check("capitalize a name", empName[0].toUpperCase() + empName.slice(1), "Nargiza");

// Real use: compare emails without caring about BIG/small letters.
// Java: a.equalsIgnoreCase(b)
check("same email? (ignore case)",
    "Ana@Payroll.com".toLowerCase() === "ana@payroll.com", true);


// ------------------------------------------------------------
section("4. Searching — read the pay type");
// ------------------------------------------------------------
const payNote = "Overtime pay for week 42";

// Yes / no answers (true or false)
// Java has the SAME names: contains(), startsWith(), endsWith()
check("includes('pay')", payNote.includes("pay"), true);
check("includes('Pay')  (big P)", payNote.includes("Pay"), false);
check("startsWith('Overtime')", payNote.startsWith("Overtime"), true);
check("endsWith('42')", payNote.endsWith("42"), true);
// Java: payNote.contains("pay")   ← Java uses contains, not includes

// Where is it? (a position number)
// Java: payNote.indexOf("pay")  ← same name!
check("indexOf('pay')", payNote.indexOf("pay"), 9);
check("indexOf('bonus')", payNote.indexOf("bonus"), -1);
tip("Searches care about BIG/small letters. -1 means 'not found' (same in Java).");


// ------------------------------------------------------------
section("5. Cutting out a piece: slice() — pay date");
// ------------------------------------------------------------
// Pay dates are saved like this: "2026-10-31"
//   2  0  2  6  -  1  0  -  3  1
//   0  1  2  3  4  5  6  7  8  9
const payDate = "2026-10-31";

check("year:  slice(0, 4)", payDate.slice(0, 4), "2026");
check("month: slice(5, 7)", payDate.slice(5, 7), "10");
check("day:   slice(8)", payDate.slice(8), "31");
check("day:   slice(-2)  (last 2)", payDate.slice(-2), "31");

// Real use: show only the last 4 digits of a bank account.
const account = "1234567890";
check("last 4 of account", "****" + account.slice(-4), "****7890");
tip("slice(start, end) keeps start but STOPS BEFORE end.");
tip("Java: payDate.substring(0, 4). Java substring has NO negative numbers.");


// ------------------------------------------------------------
section("6. Replacing text — fix the salary");
// ------------------------------------------------------------
// Money often comes with symbols: "$1,250.50"
// To do math, we must remove "$" and ",".
const salaryText = "$1,250,000";

check("replace(',', '')  (first only)", salaryText.replace(",", ""), "$1250,000");
check("replaceAll(',', '')", salaryText.replaceAll(",", ""), "$1250000");
check("remove $ and all commas",
    salaryText.replace("$", "").replaceAll(",", ""), "1250000");

// Then turn the text into a real number for math.
// Java: Double.parseDouble("1250000")
check("text → number", Number("1250000"), 1250000);
tip("replace() changes only the FIRST match. replaceAll() changes ALL.");
tip("Careful: Java replace() changes ALL. JS replace() changes only the FIRST.");


// ------------------------------------------------------------
section("7. Removing extra spaces: trim() — form input");
// ------------------------------------------------------------
// Users often type extra spaces by mistake in the form.
const typedName = "   John Doe   ";

check("trim()", typedName.trim(), "John Doe");
check("trimStart()", typedName.trimStart(), "John Doe   ");
check("trimEnd()", typedName.trimEnd(), "   John Doe");
// Java: trim(), stripLeading(), stripTrailing()

// Real use: did HR really fill in the "Employee Name" box?
const nameBox = "    ";   // only spaces!
check("nameBox === ''", nameBox === "", false);         // looks NOT empty
check("nameBox.trim() === ''", nameBox.trim() === "", true); // really empty
// Java: nameBox.isBlank()  → true
tip("Always trim() what a user types before you check or save it.");


// ------------------------------------------------------------
section("8. Joining text together — paystub line");
// ------------------------------------------------------------
const firstName = "John";
const lastName = "Doe";
const hours = 40;
const rate = 25;    // dollars per hour

check("firstName + ' ' + lastName", firstName + " " + lastName, "John Doe");

// Template literal = text in backticks ` ` with ${ } inside.
// Java: String.format("%s %s", firstName, lastName)
check("template literal", `${firstName} ${lastName}`, "John Doe");

// You can do math inside ${ }
check("math inside ${ }", `Gross pay: $${hours * rate}`, "Gross pay: $1000");

// DANGER: text + number = text glued together (same in Java!)
// Example: hours came from a form as TEXT "40".
check("'40' + 5  (careful!)", "40" + 5, "405");
check("Number('40') + 5  (fixed)", Number("40") + 5, 45);
tip("Form boxes give TEXT. Use Number() before math. Java: Integer.parseInt().");


// ------------------------------------------------------------
section("9. Splitting into a list (and back) — CSV file");
// ------------------------------------------------------------
// Payroll systems often import CSV files.
// CSV = values separated by commas, one employee per line.
const csvRow = "EMP001,John Doe,Engineering,25";

// split(",") cuts the text at every comma → a list (array)
// Java: String[] parts = csvRow.split(",");
check("split(',')", csvRow.split(","), ["EMP001", "John Doe", "Engineering", "25"]);

// Get one value from the list by its position
const parts = csvRow.split(",");
check("department = parts[2]", parts[2], "Engineering");

check("split(' ')  (full name)", "John Doe".split(" "), ["John", "Doe"]);
check("split('')  (each letter)", "EMP".split(""), ["E", "M", "P"]);

// join() is the opposite: list → text
// Java: String.join(" | ", list)
check("join(' | ')", ["EMP001", "John Doe", "$1000"].join(" | "), "EMP001 | John Doe | $1000");
tip("split() turns text into a list. join() turns a list into text.");


// ------------------------------------------------------------
section("10. Repeating and padding — IDs and paystub");
// ------------------------------------------------------------
// New employee number 7 → ID must look like "EMP007"
// padStart(3, "0") = add "0" at the START until length is 3
// Java: String.format("%03d", 7)  → "007"
check("'7'.padStart(3, '0')", "7".padStart(3, "0"), "007");
check("make full ID", "EMP" + "7".padStart(3, "0"), "EMP007");

// Line it up on a paystub (same trick our check() uses!)
check("'Hours'.padEnd(8, '.')", "Hours".padEnd(8, "."), "Hours...");

// A line to separate paystub parts
// Java: "=".repeat(10)  ← same name!
check("'='.repeat(10)", "=".repeat(10), "==========");
tip("The number is the TOTAL length you want, not how many to add.");


// ------------------------------------------------------------
section("11. Looping through letters — count digits in ID");
// ------------------------------------------------------------
// Rule: a valid Employee ID has exactly 3 digits.
// for...of = go through each letter, one by one.
// Java: for (char letter : id.toCharArray()) { ... }
const testId = "EMP123";
let digits = 0;     // let = a value that CAN change (Java: int digits = 0;)

for (const letter of testId) {
    if ("0123456789".includes(letter)) {
        digits = digits + 1;
    }
}
check("digits in 'EMP123'", digits, 3);

// Short way with a regular expression:
// \D = "any NOT-digit", g = "all of them". Remove them all.
// Java: testId.replaceAll("\\D", "")
check("keep only digits", testId.replace(/\D/g, ""), "123");


// ------------------------------------------------------------
section("12. Strings never change by themselves");
// ------------------------------------------------------------
let status = "pending";

status.toUpperCase();              // new value is thrown away!
check("forgot to save", status, "pending");

status = status.toUpperCase();     // save the new value
check("saved it", status, "PENDING");
tip("Write status = status.toUpperCase() to keep the change. Same rule in Java!");


// ------------------------------------------------------------
section("BONUS: Put it all together — print a paystub");
// ------------------------------------------------------------
// Raw data, messy, like it came from a form.
const rawName = "  jOHN dOE  ";
const rawHours = "40";
const rawRate = "$25.00";

// Clean it, step by step:
const cleanName = rawName.trim().toLowerCase();       // "john doe"
const nameWords = cleanName.split(" ");                // ["john", "doe"]
const niceName = nameWords
    .map(w => w[0].toUpperCase() + w.slice(1))       // map = do this to EACH word
    .join(" ");                                        // "John Doe"
const hoursNum = Number(rawHours);                     // 40
const rateNum = Number(rawRate.replace("$", ""));      // 25
const gross = hoursNum * rateNum;                      // 1000

check("clean name", niceName, "John Doe");
check("gross pay", gross, 1000);

// toFixed(2) = always show 2 numbers after the dot (money!)
// Java: String.format("%.2f", gross)
console.log(`
  ${"=".repeat(30)}
  ${"Employee:".padEnd(12)}${niceName}
  ${"Hours:".padEnd(12)}${hoursNum}
  ${"Rate:".padEnd(12)}$${rateNum.toFixed(2)}
  ${"Gross pay:".padEnd(12)}$${gross.toFixed(2)}
  ${"=".repeat(30)}`);


// ------------------------------------------------------------
section("Cheat sheet  (JavaScript  →  Java)");
// ------------------------------------------------------------
console.log(`
  How long?            s.length              → s.length()
  One character        s.at(0)  s.at(-1)     → s.charAt(0)
  Contains?            s.includes("x")       → s.contains("x")
  Starts / ends        startsWith endsWith   → same in Java
  Where is it?         s.indexOf("x")        → same in Java  (-1 = not found)
  Cut a piece          s.slice(0, 4)         → s.substring(0, 4)
  Change case          toUpperCase()         → same in Java
  Swap FIRST match     s.replace(a, b)       → s.replaceFirst(a, b)
  Swap ALL matches     s.replaceAll(a, b)    → s.replace(a, b)
  Remove outer spaces  s.trim()              → s.trim()  /  s.strip()
  Empty box?           s.trim() === ""       → s.isBlank()
  Build text           \`\${a} \${b}\`           → String.format("%s %s", a, b)
  Text → list          s.split(",")          → s.split(",")
  List → text          list.join(" ")        → String.join(" ", list)
  Fill with zeros      "7".padStart(3, "0")  → String.format("%03d", 7)
  Repeat               "=".repeat(10)        → same in Java
  Text → number        Number("40")          → Integer.parseInt("40")
  Money format         n.toFixed(2)          → String.format("%.2f", n)
`);