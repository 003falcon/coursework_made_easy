import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

// Allowed grade range
const GRADE_MIN = 7;
const GRADE_MAX = 10;

// Utility to round to 2 decimals
const round2 = (x) => Math.round(x * 100) / 100;

function CGPACalculator() {
  // Step 1: Desired CGPA
  const [desiredCG, setDesiredCG] = useState(9.00);

  // Step 2: Completed courses credit types
  const [creditInputs, setCreditInputs] = useState([4, 3, 2, 1]);
  const [newCredit, setNewCredit] = useState("");
  const [coursesPerCredit, setCoursesPerCredit] = useState({
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  // Step 3: Grades for completed courses
  const [grades, setGrades] = useState({}); // {credit: [grade,...]}

  // Step 4: Current semester info
  const [currentSemCourses, setCurrentSemCourses] = useState([]);
  const [curSemNumCourses, setCurSemNumCourses] = useState("");
  const [curSemCourseCredit, setCurSemCourseCredit] = useState("");

  // Result
  const [result, setResult] = useState(null);

  // Add a new custom credit value
  const handleAddCredit = () => {
    const c = parseFloat(newCredit);
    if (isNaN(c) || c <= 0) return;
    if (!creditInputs.includes(c)) {
      setCreditInputs([...creditInputs, c].sort((a, b) => b - a));
      setCoursesPerCredit({ ...coursesPerCredit, [c]: 0 });
    }
    setNewCredit("");
  };

  // Update number of courses for each credit
  const handleCoursesChange = (c, val) => {
    const n = Number(val);
    setCoursesPerCredit((prev) => ({
      ...prev,
      [c]: n,
    }));
    setGrades((prev) => ({
      ...prev,
      [c]: (prev[c] || [])
        .slice(0, n)
        .concat(Array(Math.max(0, n - (prev[c]?.length || 0))).fill(8)),
    }));
  };

  // Update grades for completed courses
  const handleGradeChange = (c, i, val) => {
    setGrades((prev) => ({
      ...prev,
      [c]: prev[c].map((g, j) => (j === i ? Number(val) : g)),
    }));
  };

  // Add a current semester course row
  const handleAddCurSemCourse = () => {
    const n = Number(curSemNumCourses);
    const credit = parseFloat(curSemCourseCredit);
    if (n > 0 && credit > 0) {
      setCurrentSemCourses([...currentSemCourses, { num: n, credit }]);
      setCurSemNumCourses("");
      setCurSemCourseCredit("");
    }
  };

  // Remove a current semester course row
  const handleRemoveCurSemRow = (idx) => {
    setCurrentSemCourses(currentSemCourses.filter((_, i) => i !== idx));
  };

  // Compute the possibilities
  const handleCompute = () => {
    // 1. Compute completed
    let totalCredits = 0,
      weightedSum = 0;
    creditInputs.forEach((c) => {
      const num = coursesPerCredit[c] | 0;
      if (num > 0) {
        totalCredits += c * num;
        (grades[c] || []).forEach((g) => (weightedSum += c * g));
      }
    });
    // 2. Compute current sem
    let curSemTotalCourses = 0;
    let curSemCreditsList = [];
    currentSemCourses.forEach(({ num, credit }) => {
      for (let i = 0; i < num; ++i) curSemCreditsList.push(credit);
      curSemTotalCourses += num;
    });

    if (curSemCreditsList.length === 0) {
      setResult(
        <span style={{ color: "red" }}>
          Add at least one current semester course!
        </span>
      );
      return;
    }

    const totalCreditsAll =
      totalCredits + curSemCreditsList.reduce((a, b) => a + b, 0);
    const targetSum = desiredCG * totalCreditsAll;
    const neededSum = targetSum - weightedSum;

    // If already achieved
    if (
      neededSum <=
      curSemCreditsList.length * GRADE_MAX * Math.max(...curSemCreditsList)
    ) {
      // Brute force all possible grade assignments for current sem (small N only)
      // For each course, grades can be 7..10. Try all combinations.
      // Stop if more than 1000 solutions.
      let count = 0,
        scenarios = [];
      const maxScenarios = 10;
      const maxCombinations = 1e5;

      const dfs = (idx, accSum, accGrades) => {
        if (count > maxCombinations) return;
        if (idx === curSemCreditsList.length) {
          if (accSum >= neededSum - 1e-6) {
            count++;
            if (scenarios.length < maxScenarios) scenarios.push([...accGrades]);
          }
          return;
        }
        for (let g = GRADE_MIN; g <= GRADE_MAX; ++g) {
          dfs(idx + 1, accSum + curSemCreditsList[idx] * g, [...accGrades, g]);
        }
      };
      dfs(0, 0, []);
      if (count === 0) {
        setResult(
          <span style={{ color: "red" }}>
            Sorry, target CG cannot be achieved with the current configuration.
          </span>
        );
        return;
      }
      setResult(
        <div>
          <div style={{ marginBottom: 8 }}>
            <b>Possible ways to achieve target CG: {count}</b>
            <br />
            {count > maxScenarios && (
              <span style={{ color: "#888" }}>
                (Showing {maxScenarios} possible grade scenarios)
              </span>
            )}
          </div>
          {scenarios.map((gradesArr, si) => (
            <div
              key={si}
              style={{
                margin: "6px 0",
                background: "#f1f7ff",
                padding: "5px 10px",
                borderRadius: 4,
              }}
            >
              {gradesArr.map((g, gi) => (
                <span key={gi}>
                  Course {gi + 1} ({curSemCreditsList[gi]} credit): <b>{g}</b>{" "}
                  {gi < gradesArr.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
      return;
    } else {
      setResult(
        <span style={{ color: "red" }}>
          Sorry, target CG cannot be achieved with the current configuration.
        </span>
      );
    }
  };

  return (
    <div className="cgpa-root">
      <h2 style={{ textAlign: "center", marginBottom: 14 }}>
        CGPA Target Calculator
      </h2>

      {/* Step 1: Desired CGPA */}
      <div className="cgpa-section">
        <label className="cgpa-label">
          Desired CGPA:
          <input
            className="cgpa-input"
            type="number"
            step="0.01"
            min="7"
            max="10"
            value={desiredCG}
            onChange={(e) => setDesiredCG(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Step 2: Completed Courses */}
      <div className="cgpa-section">
        <div style={{ marginBottom: 8 }}>
          <b>Completed Courses (before this semester):</b>
        </div>
        <div style={{ marginBottom: 8 }}>
          {creditInputs.map((c, i) => (
            <span key={c} style={{ marginRight: 14 }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                {c}-credit:
                <input
                  style={{ marginLeft: "30 px" }}
                  className="credit-input"
                  type="number"
                  min="0"
                  max="150"
                  value={coursesPerCredit[c] ?? 0}
                  onChange={(e) => handleCoursesChange(c, e.target.value)}
                />
              </label>
            </span>
          ))}
        </div>
        <div className="new-credit">
          <input
            className="new-credit-input"
            type="number"
            placeholder="e.g. 1.5"
            min="0.1"
            max="10"
            step="0.1"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value)}
          />
        
          <button
            className="new-credit-add-button"
            type="button"
            onClick={handleAddCredit}
          >
            Add Credit Type
          </button>
        </div>
      </div>

      {/* Step 3: Grades */}
      <div className="cgpa-section">
        <div style={{ marginBottom: 25 }}>
          <b><u>Enter Grades for Completed Courses</u></b>
        </div>
        <div>
          {creditInputs.map(
            (c) =>
              coursesPerCredit[c] > 0 && (
                <div key={c} style={{ marginBottom: 8 }}>
                  <b>{c}-credit:</b>
                  {Array.from({ length: coursesPerCredit[c] }, (_, i) => (
                    <input
                      key={i}
                      className="cgpa-input"
                      type="number"
                      min={GRADE_MIN}
                      max={GRADE_MAX}
                      value={grades[c]?.[i] ?? 8}
                      onChange={(e) => handleGradeChange(c, i, e.target.value)}
                      style={{ marginLeft: 8, marginRight: 8 }}
                    />
                  ))}
                </div>
              )
          )}
        </div>
      </div>

      {/* Step 4: Current Semester Info */}
      <div className="cgpa-section">
        <div style={{ marginBottom: 15 }}>
          Add Current Semester Courses
        </div>
        <div>
          <input
            className="num-courses-input"
            type="number"
            min="1"
            placeholder="No. of courses"
            value={curSemNumCourses}
            onChange={(e) => setCurSemNumCourses(e.target.value)}
          />
          <input
            className="credit-input"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="credits"
            value={curSemCourseCredit}
            onChange={(e) => setCurSemCourseCredit(e.target.value)}
          />
          <button
            className="course-add-button"
            type="button"
            onClick={handleAddCurSemCourse}
          >
            Add
          </button>
        </div>
        {currentSemCourses.length > 0 && (
          <table className="cgpa-table">
            <thead>
              <tr>
                <th>#</th>
                <th>No. of Courses</th>
                <th>Credit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {currentSemCourses.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.num}</td>
                  <td>{row.credit}</td>
                  <td>
                    <button
                      style={{
                        background: "#f33",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "2px 8px",
                        cursor:"pointer"

                      }}
                      onClick={() => handleRemoveCurSemRow(idx)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Step 5: Compute */}
      <button className="cgpa-calc-button" onClick={handleCompute}>
        Compute Scenarios
      </button>
      <div className="cgpa-result">{result}</div>
      <div className="cgpa-footer">
        <hr />
        Built with React. <br />
        <b>Note:</b> For large number of courses, only a sample of possible
        scenarios will be shown.
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CGPACalculator />);
