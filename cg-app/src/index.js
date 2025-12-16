import  { useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

// Allowed grade range
const GRADE_MIN = 5;
const GRADE_MAX = 10;

// Utility to round to 2 decimals
const round2 = (x) => Math.round(x * 100) / 100;

function CGPACalculator() {
  // Step 1: Desired CGPA
  const [desiredCG, setDesiredCG] = useState(9.0);
  const [curCG,setCurCG] = useState(5);
  const [completedCredits,setcompletedCredits] = useState(0);

  // Step 2: Completed courses credit types
  // const [creditInputs, setCreditInputs] = useState([4, 3, 2, 1]);
  // const [newCredit, setNewCredit] = useState("");
  // const [coursesPerCredit, setCoursesPerCredit] = useState({
  //   4: 0,
  //   3: 0,
  //   2: 0,
  //   1: 0,
  // });
  // // Step 3: Grades for completed courses
  // const [grades, setGrades] = useState({}); // {credit: [grade,...]}

  // Step 4: Current semester info
  const [currentSemCourses, setCurrentSemCourses] = useState([]);
  const [curSemCourseName, setCurSemCourseName] = useState("");
  const [curSemCourseCredit, setCurSemCourseCredit] = useState("");

  // Result
  const [result, setResult] = useState(null);

  // Add a new custom credit value
  // const handleAddCredit = () => {
  //   const c = parseFloat(newCredit);
  //   if (isNaN(c) || c <= 0) return;
  //   if (!creditInputs.includes(c)) {
  //     setCreditInputs([...creditInputs, c].sort((a, b) => b - a));
  //     setCoursesPerCredit({ ...coursesPerCredit, [c]: 0 });
  //   }
  //   setNewCredit("");
  // };

  // Update number of courses for each credit
  // const handleCoursesChange = (c, val) => {
  //   const n = Number(val);
  //   setCoursesPerCredit((prev) => ({
  //     ...prev,
  //     [c]: n,
  //   }));
  //   setGrades((prev) => ({
  //     ...prev,
  //     [c]: (prev[c] || [])
  //       .slice(0, n)
  //       .concat(Array(Math.max(0, n - (prev[c]?.length || 0))).fill(8)),
  //   }));
  // };

  // Update grades for completed courses
  // const handleGradeChange = (c, i, val) => {
  //   setGrades((prev) => ({
  //     ...prev,
  //     [c]: prev[c].map((g, j) => (j === i ? Number(val) : g)),
  //   }));
  // };

  // const curSemCourses = ["OE", "HVDC", "DE"];
  // Add a current semester course row

  const handleAddCurSemCourse = () => {
    const credit = parseFloat(curSemCourseCredit);
    const name =
      curSemCourseName.trim() || `Course ${currentSemCourses.length + 1}`;
    // n > 0 && num: n,
    if (credit > 0) {
      setCurrentSemCourses([...currentSemCourses, { credit, name: name }]);
      // setCurSemNumCourses("");
      setCurSemCourseCredit("");
      setCurSemCourseName("");
    }
  };
  let curSemCourseNames = [];
  curSemCourseNames = currentSemCourses.map(({ name }) => name);
 
  // Remove a current semester course row
  const handleRemoveCurSemRow = (idx) => {
    setCurrentSemCourses(currentSemCourses.filter((_, i) => i !== idx));
  };

  // Compute the possibilities
  const handleCompute = () => {
    // 1. Compute completed
    let totalCredits = completedCredits,
      weightedSum = completedCredits * curCG;
    
    let curSemCreditsList = [];
    curSemCreditsList = currentSemCourses.map(({ credit }) => credit);
   

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
                  {curSemCourseNames[gi]} :{" "}
                  <b>{g}</b> {gi < gradesArr.length - 1 ? " | " : ""}
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
        <div>
        <label className="cgpa-label">
          Current CGPA:
          <input
            className="cgpa-input"
            type="number"
            step="0.01"
            min="5"
            max="10"
            value={curCG}
            onChange={(e) => setCurCG(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="cgpa-section">
        <label className="cgpa-label">
          Completed Credits:
          <input
            className="cgpa-input"
            type="number"
            step="1"
            min="0"
            max="140"
            value={completedCredits}
            onChange={(e) => setcompletedCredits(Number(e.target.value))}
          />
        </label>
      </div>
      
     
      {/* Step 4: Current Semester Info */}
      <div className="cgpa-section">
        <div style={{ marginBottom: 15 }}>Add Current Semester Courses</div>
        <div>
          {/* <div> */}
          <input
            className="course-name-input"
            type="text"
            placeholder="Course name"
            value={curSemCourseName}
            onChange={(e) => setCurSemCourseName(e.target.value)}
          />
          
          <input
            className="credit-input"
            type="number"
            min="1.5"
            step="0.5"
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
                <th>Course Name</th>
                <th>Credit</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {currentSemCourses.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.credit}</td>
                  <td>
                    <button
                      style={{
                        background: "#f33",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "2px 8px",
                        cursor: "pointer",
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
