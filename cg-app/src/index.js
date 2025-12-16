import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

// Allowed grade range
const GRADE_MIN = 5;
const GRADE_MAX = 10;


// This works just like useState, but saves to the browser's local storage.
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Utility to calculate variance
const getVariance = (arr) => {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return (
    arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length
  );
};

function CGPACalculator() {
  // Step 1: Desired CGPA (Persisted)
  const [desiredCG, setDesiredCG] = useStickyState(9.0, "cgpa_desired");
  const [curCG, setCurCG] = useStickyState(5, "cgpa_current");
  const [completedCredits, setcompletedCredits] = useStickyState(0, "cgpa_completed_credits");

  // Step 4: Current semester info (Courses List is Persisted)
  const [currentSemCourses, setCurrentSemCourses] = useStickyState([], "cgpa_current_courses");
  
  // Temporary inputs (No need to persist these)
  const [curSemCourseName, setCurSemCourseName] = useState("");
  const [curSemCourseCredit, setCurSemCourseCredit] = useState("");

  // Result (No need to persist, can re-calculate)
  const [result, setResult] = useState(null);

  const handleAddCurSemCourse = () => {
    const credit = parseFloat(curSemCourseCredit);
    const name =
      curSemCourseName.trim() || `Course ${currentSemCourses.length + 1}`;
    
    if (credit > 0) {
      setCurrentSemCourses([...currentSemCourses, { credit, name: name }]);
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
    const timestamp = new Date().toLocaleTimeString(); 

    // 1. Compute completed
    let totalCredits = completedCredits,
      weightedSum = completedCredits * curCG;

    let curSemCreditsList = [];
    curSemCreditsList = currentSemCourses.map(({ credit }) => credit);

    if (curSemCreditsList.length === 0) {
      setResult(
        <div key={Date.now()} className="fade-in">
          <span style={{ color: "red" }}>
            Add at least one current semester course! <br/>
            <small style={{color: "#999"}}>(Checked at {timestamp})</small>
          </span>
        </div>
      );
      return;
    }

    const totalCreditsAll =
      totalCredits + curSemCreditsList.reduce((a, b) => a + b, 0);
    const targetSum = desiredCG * totalCreditsAll;
    const neededSum = targetSum - weightedSum;

    // Check if theoretically possible
    if (
      neededSum <=
      curSemCreditsList.length * GRADE_MAX * Math.max(...curSemCreditsList)
    ) {
      // Brute force all possible grade assignments for current sem
      let count = 0,
        scenarios = [];
      const maxScenariosToShow = 10;
      const bufferSize = 500; 
      const maxCombinations = 1e5;

      const dfs = (idx, accSum, accGrades) => {
        if (count > maxCombinations) return;
        
        // Optimization: Pruning
        const remainingCredits = curSemCreditsList.slice(idx).reduce((a,b)=>a+b, 0);
        if (accSum + remainingCredits * GRADE_MAX < neededSum - 1e-6) return;

        if (idx === curSemCreditsList.length) {
          if (accSum >= neededSum - 1e-6) {
            count++;
            if (scenarios.length < bufferSize) scenarios.push([...accGrades]);
          }
          return;
        }
        for (let g = GRADE_MIN; g <= GRADE_MAX; ++g) {
          dfs(idx + 1, accSum + curSemCreditsList[idx] * g, [...accGrades, g]);
        }
      };
      
      dfs(0, 0, []);

      if (scenarios.length === 0) {
        setResult(
          <div key={Date.now()} className="fade-in">
            <span style={{ color: "red" }}>
              Sorry, target CG cannot be achieved with the current configuration.
            </span>
            <br/>
            <small style={{color: "#888"}}>Checked at {timestamp}</small>
          </div>
        );
        return;
      }

      // --- SORTING LOGIC BY VARIANCE---
      scenarios.sort((a, b) => {
        const varA = getVariance(a);
        const varB = getVariance(b);
        return varA - varB;
      });

      const displayScenarios = scenarios.slice(0, maxScenariosToShow);

      setResult(
        <div key={Date.now()} className="fade-in"> 
          <div style={{ marginBottom: 8 }}>
            <b>Possible ways to achieve target CG: {count}</b>
            <br />
            <span style={{ color: "#555", fontSize: "0.9em" }}>
              (Sorted by most balanced grades first)
            </span>
          </div>
          {displayScenarios.map((gradesArr, si) => (
            <div
              key={si}
              style={{
                margin: "6px 0",
                background: "#f1f7ff",
                padding: "8px 10px",
                borderRadius: 4,
                borderLeft: "4px solid #007bff",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              {gradesArr.map((g, gi) => (
                <span key={gi}>
                  {curSemCourseNames[gi]}: <b>{g}</b>
                </span>
              ))}
            </div>
          ))}
          <div style={{marginTop: "10px", fontSize: "0.8em", color: "#aaa"}}>
             Calculation performed at {timestamp}
          </div>
        </div>
      );
      return;
    } else {
      setResult(
        <div key={Date.now()} className="fade-in">
          <span style={{ color: "red", fontWeight: "bold" }}>
            Sorry, target CG cannot be achieved.
          </span>
          <br/>
          <span style={{color: "red"}}>Max possible sum exceeded.</span>
          <br/>
          <small style={{color: "#888"}}>Checked at {timestamp}</small>
        </div>
      );
    }
  };

  return (
    <div className="cgpa-root">
      <h2 style={{ textAlign: "center", marginBottom: 14 }}>
        CGPA Target Calculator
      </h2>

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

      {/* Current Semester Info */}
      <div className="cgpa-section">
        <div style={{ marginBottom: 15 }}>Add Current Semester Courses</div>
        <div className="cur-sem-inputs">
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
            placeholder="Credits "
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

      {/*  Compute */}
      <button className="cgpa-calc-button" onClick={handleCompute}>
        Compute Scenarios
      </button>
      
      {/* Result Container */}
      <div className="cgpa-result">
        {result}
      </div>

      <div className="cgpa-footer">
        <hr />
        Built with React. <br />
        <b>Note:</b> For large number of possibilities, only 10 of possible
        scenarios are shown.
        <p>Have an idea?    <a href="https://github.com/003falcon/coursework_made_easy/tree/main/cg-app" style={{color: "inherit",
  cursor:"pointer"}} target="_blank" rel="noopener noreferrer">Contribute</a>
    </p>
        
      </div>
      </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CGPACalculator />);