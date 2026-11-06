// ============================================================
//  JAVASCRIPT STRINGS — ADVANCED LESSON — PAYROLL PROJECT
//  Run:  node StringsAdvancedPayroll.js
//  Finish StringsPayroll.js (beginner) first.
//
//  Every example is from a PAYROLL app:
//  paychecks, employees, tax, pay dates, logs, URLs.
//
//  "QA:"   = how a QA tester uses this in test automation
//            (Playwright, Cypress, Selenium, Jest...)
//  "Java:" = how you would write the same thing in Java
// ============================================================


// ---------- 3 helper functions (same as beginner lesson) ----------

// Prints a title.  Java: System.out.println("\n--- " + title + " ---");
function section(title) {
    console.log(`\n--- ${title} ---`);
}

// Mini test: my result vs expected result → ✅ or ❌
// Java (JUnit): assertEquals(expected, actual);
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${label.padEnd(34)} → ${JSON.stringify(actual)} ${ok ? "✅" : "❌ expected " + JSON.stringify(expected)}`);
}

// Prints a note with 💡.  Java: System.out.println("   💡 " + text);
function tip(text) {
    console.log(`   💡 ${text}`);
}


// ------------------------------------------------------------
section("1. Patterns (regular expressions) — the basics");
// ------------------------------------------------------------
// A pattern (regex) = a "search rule". It lives between / /.
//
//   \d = one digit (0-9)          \w = letter, digit or _
//   \s = a space                  +  = one or more
//   g  = find ALL (global)        i  = ignore BIG/small letters
//   ( ) = a group = "the part I want to take out"
//
// Java: same rules, but written as text with DOUBLE \\
//   JS:   /\d+/
//   Java: Pattern.compile("\\d+")

// This is the message the payroll app shows after you click "Run Payroll".
const message = "Paycheck #48213 created. Net pay: $1,850.75";

// test() → true or false: "does the text match my rule?"
// QA: check that the success message has a paycheck number
// Java: message.matches(".*#\\d+.*")
check("has a paycheck number?", /#\d+/.test(message), true);

// match() → gives back the matching text
// [1] = the part inside the FIRST ( )
// QA: take the paycheck ID from the page to use in the next test step
// Java: Matcher m = Pattern.compile("#(\\d+)").matcher(message);
//       m.find();  m.group(1);  → "48213"
check("paycheck ID", message.match(/#(\d+)/)[1], "48213");

// With g → gives back ALL matches as an array (list)
check("all numbers", message.match(/\d+/g), ["48213", "1", "850", "75"]);

// No match → null (= "nothing found")
check("no match gives null", "abc".match(/\d+/), null);
tip("Always check for null before using [1], or the test crashes.");
tip("Java: always check m.find() is true before m.group(1).");


// ------------------------------------------------------------
section("2. matchAll() — details for every match");
// ------------------------------------------------------------
// QA: read every error from the payroll server log and check each one.
const log = "ERROR 400 /employees, ERROR 500 /payroll/run, ERROR 400 /tax";

// Rule: "ERROR", a space, (digits), a space, (everything until a comma)
//   (\d+)   = group 1 = the error code     → "400"
//   ([^,]+) = group 2 = NOT a comma, 1+    → "/employees"
const errors = [];                       // empty list.  Java: new ArrayList<>();
for (const m of log.matchAll(/ERROR (\d+) ([^,]+)/g)) {
    // m[1] = group 1,  m[2] = group 2.   Java: m.group(1), m.group(2)
    errors.push(`${m[1]} on ${m[2]}`);   // push = add to the end. Java: list.add()
}
check("errors found", errors, ["400 on /employees", "500 on /payroll/run", "400 on /tax"]);

// How many times does "400" appear?
// match(...g) gives a list → .length counts it
check("how many 400s", log.match(/400/g).length, 2);
// Java: while (m.find()) { count++; }


// ------------------------------------------------------------
section("3. Smart replacing");
// ------------------------------------------------------------
// a) Ignore BIG/small letters with the i flag
//    g = all,  i = ignore case  →  gi = both
// Java: s.replaceAll("(?i)pending", "PAID")
check("replace ignoring case",
    "Pending pending PENDING".replace(/pending/gi, "PAID"), "PAID PAID PAID");

// b) Move parts around with groups
//    $1 = what group 1 found, $2 = group 2, $3 = group 3
// QA: the UI shows pay date 10/31/2026,
//     but the API returns 2026-10-31. Convert to compare them.
//   (\d+) / (\d+) / (\d+)
//    10      31     2026
//    $1      $2     $3     →  "$3-$1-$2"  →  "2026-10-31"
// Java: s.replaceAll("(\\d+)/(\\d+)/(\\d+)", "$3-$1-$2")   ← same $1 idea!
check("MM/DD/YYYY → YYYY-MM-DD",
    "10/31/2026".replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"), "2026-10-31");
// Note: \/ = a real "/" (we write \ before it, because / ends the pattern)

// c) Replace parts that change every time with a fixed sign
// QA: employee ID and time are different on every test run.
//     Hide them, so two logs can be compared.
const run1 = "Employee 8812 paid at 09:14:02";
check("hide changing values", run1.replace(/\d+/g, "#"), "Employee # paid at #:#:#");


// ------------------------------------------------------------
section("4. Comparing text safely");
// ------------------------------------------------------------
// QA: the #1 reason a text test fails = differences you CANNOT SEE.

// a) BIG / small letters
// Java: "Approve".equalsIgnoreCase("APPROVE")
check("exact compare", "Approve" === "APPROVE", false);
check("ignore case", "Approve".toLowerCase() === "APPROVE".toLowerCase(), true);

// b) Extra spaces and new lines (\n) from the web page
//    \s+ = one or more spaces/new lines → replace with ONE space
// Java: fromPage.trim().replaceAll("\\s+", " ")
const fromPage = "  Pay period:\n   Oct 1 - Oct 15  ";
const clean = fromPage.trim().replace(/\s+/g, " ");
check("squash whitespace", clean, "Pay period: Oct 1 - Oct 15");
tip("QA: trim + squash spaces before comparing UI text.");

// c) Non-breaking space ( )
//    Looks EXACTLY like a space, but the computer sees a different character.
//    Web pages use it a lot in money: "$1,850.75 USD"
// Java: s.replace(' ', ' ')
const netPayUI = "$1,850.75 USD";            //   = non-breaking space
check("looks the same, isn't", netPayUI === "$1,850.75 USD", false);
check("after fixing", netPayUI.replace(/ /g, " ") === "$1,850.75 USD", true);

// d) Letters with accents can be saved 2 ways:
//    "é" as ONE character,  or  "e" + "´" as TWO characters.
//    On screen they look the same. The computer says "not equal".
// QA: employee "José" from the database vs "José" on the page
// Java: Normalizer.normalize(s, Normalizer.Form.NFC)
const nameDB = "José";        // é = 1 character
const nameUI = "José";       // e + ´ = 2 characters
check("é vs e+´", nameDB === nameUI, false);
check("after normalize()", nameDB.normalize() === nameUI.normalize(), true);


// ------------------------------------------------------------
section("5. Sorting and checking order");
// ------------------------------------------------------------
// localeCompare = compare 2 words like a dictionary:
//   negative = a comes BEFORE b
//   0        = the same
//   positive = a comes AFTER b
// Java: "adams".compareTo("brown")  (also negative / 0 / positive)
check("adams vs brown", "adams".localeCompare("brown"), -1);

// Plain sort() puts ALL big letters before ALL small letters!
// (Java's Collections.sort() does the same thing.)
const names = ["brown", "Adams", "chen"];
// [...names] = make a COPY first, so the original list does not change
// Java: new ArrayList<>(names)
check("plain sort()", [...names].sort(), ["Adams", "brown", "chen"]);
check("['b','A','a'].sort()", ["b", "A", "a"].sort(), ["A", "a", "b"]);

// Dictionary sort: (x, y) => x.localeCompare(y)
// = "to compare 2 names, use dictionary order"
// Java: list.sort(Collator.getInstance());
check("dictionary sort",
    ["b", "B", "a"].sort((x, y) => x.localeCompare(y)), ["a", "b", "B"]);

// QA: the "Employee Name" column on the page must be sorted A→Z.
//     1. read the column  2. sort a copy  3. compare
const columnFromUI = ["Adams", "brown", "Chen", "davis"];
const expectedOrder = [...columnFromUI].sort((x, y) => x.localeCompare(y));
// join() turns each list into text, so we can compare with ===
check("column is sorted A→Z?", columnFromUI.join() === expectedOrder.join(), true);


// ------------------------------------------------------------
section("6. Text ↔ numbers (money!)");
// ------------------------------------------------------------
// QA: the paystub shows "$1,850.75". Turn it into a number to check the math.
//   [$,] = "a $ OR a comma"   g = all of them   → remove them
// Java: Double.parseDouble(gross.replaceAll("[$,]", ""))
const grossText = "$2,150.75";
check("money text → number", Number(grossText.replace(/[$,]/g, "")), 2150.75);

// Different ways to turn text into a number:
check("Number('40')", Number("40"), 40);              // Java: Integer.parseInt("40")
check("parseInt('40hrs')", parseInt("40hrs"), 40);    // reads digits, stops at letters
check("Number('40hrs') is NaN", Number.isNaN(Number("40hrs")), true);
// NaN = "Not a Number". Java would throw NumberFormatException instead.

// toFixed(2) = always 2 numbers after the dot (cents)
// Java: String.format("%.2f", 15.33333)
check("(15.33333).toFixed(2)", (15.33333).toFixed(2), "15.33");

// QA: check the math. Gross - tax must equal net pay on the paystub.
const gross = 2150.75;
const tax = 300.00;
check("net pay math", (gross - tax).toFixed(2), "1850.75");

// QA: build the money text the UI SHOULD show, then compare.
// Java: NumberFormat.getCurrencyInstance(Locale.US).format(1850.75)
check("number → $ text",
    (1850.75).toLocaleString("en-US", { style: "currency", currency: "USD" }), "$1,850.75");
tip("Remove $ and commas first. Number() fails if any letter is left.");


// ------------------------------------------------------------
section("7. Length traps (emoji)");
// ------------------------------------------------------------
// QA: the "Notes" box on a paystub says "max 10 characters".
//     Test it with emoji too!
// One emoji looks like 1 character, but .length counts it as 2.
// (Java has the same problem: "😀".length() is 2.)
check("'Paid😀'.length", "Paid😀".length, 6);
check("[...'Paid😀'].length", [..."Paid😀"].length, 5);
// [...text] = cut text into the characters you SEE
// Java: "Paid😀".codePointCount(0, s.length())  → 5
tip("Emoji count as 2 in .length. [...text].length counts what you see.");


// ------------------------------------------------------------
section("8. Making test data");
// ------------------------------------------------------------
// QA: boundary test for the "Employee Name" box (max 50 characters).
//     Test exactly 50 (should pass), then 51 (should fail).
// Java: "a".repeat(50)   ← same!
const maxName = "a".repeat(50);
const tooLongName = "a".repeat(51);
check("50-char name (OK)", maxName.length, 50);
check("51-char name (too long)", tooLongName.length, 51);

// QA: every test run needs a NEW employee email,
//     or the app says "email already exists".
const runId = "0042";
check("unique email", `qa.employee+${runId}@test.com`, "qa.employee+0042@test.com");

// QA: payroll IDs always have the same size: PAY-00007
// String(7) = turn number 7 into text "7" (padStart works only on text)
// Java: String.format("PAY-%05d", 7)
check("padded ID", `PAY-${String(7).padStart(5, "0")}`, "PAY-00007");

// Hide the bank account in test reports (never show full numbers!)
//   1. slice(-4)            → "6789"  (last 4)
//   2. padStart(12, "*")    → fill with * on the LEFT until length 12
// Java: "*".repeat(acct.length() - 4) + acct.substring(acct.length() - 4)
const bankAcct = "000123456789";
check("masked bank account",
    bankAcct.slice(-4).padStart(bankAcct.length, "*"), "********6789");


// ------------------------------------------------------------
section("9. Pulling data out of URLs and text");
// ------------------------------------------------------------
// QA: after you click "Save Employee", the URL changes.
//     Take the new employee ID from the URL.
const url = "https://payroll.test.com/employees/48213/edit?tab=tax&year=2026";

// Step by step:
//   split("/employees/")  → ["https://payroll.test.com", "48213/edit?tab=..."]
//   [1]                   → "48213/edit?tab=tax&year=2026"
//   .split("/")           → ["48213", "edit?tab=tax&year=2026"]
//   [0]                   → "48213"
// Java: url.split("/employees/")[1].split("/")[0]   ← same!
check("employee ID from URL", url.split("/employees/")[1].split("/")[0], "48213");

// Values after "?" are called query parameters: tab=tax, year=2026
// The built-in URL tool reads them for you (better than split).
// Java: new URI(url).getQuery()  then split by "&" and "="
const params = new URL(url).searchParams;
check("tab value", params.get("tab"), "tax");
check("year value", params.get("year"), "2026");      // still TEXT, not a number!

// QA: split "key: value" lines from an API response
// const [key, value] = ... → put item 0 in key, item 1 in value (in one line)
// Java: String[] p = header.split(": ");  String key = p[0];  String value = p[1];
const header = "Content-Type: application/json";
const [key, value] = header.split(": ");
check("header key/value", [key, value], ["Content-Type", "application/json"]);


// ------------------------------------------------------------
section("10. Chaining methods (read top to bottom)");
// ------------------------------------------------------------
// Chaining = the result of one method goes into the next one.
// Read it like a recipe, step by step.

// QA: build the report file name the app should create.
//   [^a-z0-9 ] = anything that is NOT a small letter, digit, or space
// Java: s.trim().toLowerCase().replaceAll("[^a-z0-9 ]", "").replace(" ", "-")
const fileName = "  Q4 Payroll Report #2!  "
    .trim()                        // "Q4 Payroll Report #2!"
    .toLowerCase()                 // "q4 payroll report #2!"
    .replace(/[^a-z0-9 ]/g, "")    // "q4 payroll report 2"
    .replaceAll(" ", "-");         // "q4-payroll-report-2"
check("report file name", fileName, "q4-payroll-report-2");

// Title Case: "senior payroll analyst" → "Senior Payroll Analyst"
//   split → list of words,  map → big first letter for EACH word,  join → text
// Java: Arrays.stream(s.split(" "))
//         .map(w -> w.substring(0,1).toUpperCase() + w.substring(1))
//         .collect(Collectors.joining(" "))
const jobTitle = "senior payroll analyst"
    .split(" ")                                     // ["senior", "payroll", "analyst"]
    .map(w => w[0].toUpperCase() + w.slice(1))      // ["Senior", "Payroll", "Analyst"]
    .join(" ");                                     // "Senior Payroll Analyst"
check("Title Case", jobTitle, "Senior Payroll Analyst");

// QA: the employee list cuts long names and adds "..."
// cut = a short function (arrow function).
//   if s is short enough → keep it
//   else                 → take (max - 3) letters + "..."
//   ? : = short if/else.  Java has the same: (a ? b : c)
// Java: static String cut(String s, int max) {
//           return s.length() <= max ? s : s.substring(0, max - 3) + "...";
//       }
const cut = (s, max) => (s.length <= max ? s : s.slice(0, max - 3) + "...");
check("truncate to 12", cut("Alexandra Montgomery", 12), "Alexandra...");
check("short name stays", cut("Ana Lee", 12), "Ana Lee");


// ------------------------------------------------------------
section("Cheat sheet (QA)   JavaScript  →  Java");
// ------------------------------------------------------------
console.log(`
  Match a pattern?     /#\\d+/.test(s)               → s.matches(".*#\\\\d+.*")
  Pull out a value     s.match(/#(\\d+)/)[1]         → m.find(); m.group(1)
  Find every match     s.matchAll(/.../g)           → while (m.find()) {...}
  Ignore case          toLowerCase() or /.../i      → equalsIgnoreCase()
  Clean UI text        trim().replace(/\\s+/g, " ")  → trim().replaceAll("\\\\s+", " ")
  Invisible spaces     replace(/\\u00A0/g, " ")      → replace('\\u00A0', ' ')
  Accents              normalize()                  → Normalizer.normalize()
  Check sort order     localeCompare()              → compareTo() / Collator
  Money text → number  Number(s.replace(/[$,]/g,"")) → Double.parseDouble(...)
  Number → money text  toLocaleString("en-US",...)  → NumberFormat.getCurrencyInstance()
  Boundary test data   "a".repeat(51)               → "a".repeat(51)
  Values from a URL    new URL(url).searchParams    → new URI(url).getQuery()
`);