# CGPA Target Calculator 🎯

A React-based utility tool designed to help students calculate the necessary grades they need in their current semester courses to achieve a specific target CGPA.

The application uses a smart algorithm to generate possible grade scenarios, prioritizing "realistic" (balanced) outcomes over extreme variance.

##  Features

- **Target Analysis**: Input your Current CGPA, Completed Credits, and Desired CGPA to see if your goal is mathematically possible.
- **Scenario Generator**: Calculates multiple combinations of grades (from 5 to 10) for your current courses that will result in your target CGPA.
- **Smart Sorting**: Uses variance calculation to sort scenarios. It displays "balanced" grade distributions (e.g., all 8s) before extreme ones (e.g., mix of 5s and 10s).
- **Data Persistence**: Uses `localStorage` to save your inputs (Current CGPA, Credits, Course List). Your data won't vanish when you refresh the page.
- **Responsive Design**: Fully optimized for mobile and desktop use.

## Tech Stack

- **Frontend**: React.js
- **Styling**: CSS3 (Flexbox, Mobile-first responsive design)
- **State Management**: React Hooks (`useState`, `useEffect`) + Custom Hooks for persistence.

## Installation & Setup

To run this project locally, follow these steps:
 [https://github.com/003falcon/coursework_made_easy.git](https://github.com/003falcon/coursework_made_easy.git)
1. **Clone the repository**
   ```bash
   git clone https://github.com/003falcon/coursework_made_easy.git
   ```
2. **Navigate to directory**
    ```bash
   cd coursework_made_easy/cg-app
   ```

3. **Install Dependencies** (Make sure you have Node.js installed)

    ```bash
    npm install
    ```
4. **Start the Development Server**

    ```Bash
    npm start
    ```

5. Open http://localhost:3000 to view it in the browser.

## How It Works
### Input Data:

Desired CGPA: The cumulative grade point average you want to end up with.

Current CGPA: Your CGPA up to the previous semester.

Completed Credits: Total credits cleared so far.

Add Courses:

Add the courses you are taking this semester along with their credit values.

### Compute:

The algorithm calculates the required "Weighted Sum" needed from the current semester.

It runs a Depth-First Search (DFS) to find combinations of grades (ranging from 5 to 10) that satisfy the requirement.

Results are sorted by Variance, showing the most consistent grade paths first.

## Contributing
Contributions are welcome! If you find a bug or want to add a feature (like support for different grading scales), feel free to open an issue or submit a pull request.

- Fork the Project

- Create your Feature Branch (git checkout -b feature/AmazingFeature)

- Commit your Changes (git commit -m 'Add some AmazingFeature')

- Push to the Branch (git push origin feature/AmazingFeature)

- Open a Pull Request

###  License
Distributed under the MIT License.