# AI-Powered Smart Study Planner & Syllabus Breakdown Tool

## Software Engineering Requirements – Point-Wise Format

### 1. Software Development Life Cycle (SDLC) Model Selection

1.1 Waterfall Model

1. Sequential software development approach.
2. Phases include requirement analysis, design, implementation, testing, deployment, and maintenance.
3. Simple and easy to understand.
4. Provides proper documentation.
5. Difficult to accommodate changing requirements.
6. Less suitable for frequent modifications.

1.2 Prototype Model

1. Develops an initial working version of the application.
2. Collects feedback from students and evaluators.
3. Improves the application based on feedback.
4. Helps identify UI and functionality issues.
5. Supports repeated modifications.
6. Suitable for early dashboard development.

1.3 Incremental Model

1. Develops the application in small modules.
2. Each increment adds new functionality.
3. Allows independent module testing.
4. Reduces development complexity.
5. Supports gradual integration.
6. Suitable for modular project development.

1.4 Spiral Model

1. Combines iterative development with risk analysis.
2. Includes planning, risk analysis, development, and evaluation.
3. Supports changing requirements.
4. Helps identify technical risks.
5. Requires additional time and resources.
6. More suitable for large and complex projects.

1.5 Agile Model

1. Follows an iterative and incremental development approach.
2. Divides development into short sprints.
3. Supports changing requirements.
4. Provides continuous testing.
5. Encourages teamwork and collaboration.
6. Supports frequent feedback.
7. Delivers working software in stages.
8. Reduces development risks.
9. Allows easy modification of features.
10. Suitable for Python and Streamlit applications.

1.6 Selected SDLC Model: Agile

1. Flexible development process.
2. Easy modification of scheduling algorithms.
3. Independent development of application modules.
4. Early development of the Streamlit dashboard.
5. Continuous testing and debugging.
6. Regular feedback from students and evaluators.
7. Faster identification of errors.
8. Suitable for small academic projects.

1.7 Proposed Agile Sprint Plan

| Sprint   | Activities                                 |
| -------- | ------------------------------------------ |
| Sprint 1 | Requirement analysis and project setup     |
| Sprint 2 | Subject selection and syllabus input       |
| Sprint 3 | Complexity score calculation               |
| Sprint 4 | Preparation-time estimation and scheduling |
| Sprint 5 | High-Yield Mode and dashboard              |
| Sprint 6 | Progress tracking and CSV export           |
| Sprint 7 | Testing, debugging, and documentation      |

### 2. Functional Requirements (FR)

1\. FR-01: Subject Selection

- Display predefined subjects.
- Allow students to select a subject.
- Display available chapters and topics.

2\. FR-02: Custom Syllabus Input

- Allow manual subject entry.
- Allow manual chapter entry.
- Allow adding, editing, and deleting topics.

3\. FR-03: CSV Upload

- Allow syllabus upload through CSV files.
- Validate uploaded file formats.
- Read chapter and topic information.
- Reject invalid or incomplete files.

4\. FR-04: Student Input Management

- Accept examination date.
- Accept daily available study hours.
- Accept topic familiarity levels.
- Accept mathematical density.
- Accept conceptual depth.
- Accept historical difficulty.
- Accept topic importance.

5\. FR-05: Input Validation

- Validate examination dates.
- Reject negative study hours.
- Validate topic names.
- Validate difficulty ratings.
- Handle missing values.

6\. FR-06: Complexity Score Calculation

- Calculate topic difficulty scores.
- Use mathematical density.
- Use conceptual depth.
- Use historical difficulty.
- Apply weighted mathematical formulas.
- Classify topics into low, medium, and high difficulty.

7\. FR-07: Familiarity-Based Time Estimation

- Accept student familiarity levels.
- Adjust preparation time according to familiarity.
- Allocate more time to completely new topics.
- Reduce time for previously revised topics.
- Calculate estimated preparation hours.

8\. FR-08: Topic Priority Calculation

- Calculate topic priority scores.
- Consider topic importance.
- Consider topic complexity.
- Consider estimated preparation effort.
- Identify high-, medium-, and low-priority topics.

9\. FR-09: Automated Study Scheduling

- Calculate available preparation days.
- Calculate total available study hours.
- Generate a day-by-day timetable.
- Allocate topics across available days.
- Maintain daily study-hour limits.
- Schedule high-priority topics appropriately.
- Support splitting large topics across multiple days.

10\. FR-10: High-Yield Mode

- Detect insufficient preparation time.
- Activate High-Yield Mode automatically.
- Prioritize important chapters.
- Allocate available hours according to priority.
- Identify shortened topics.
- Identify unscheduled topics.
- Display insufficient-time warnings.

11\. FR-11: Interactive Dashboard

- Display selected subject.
- Display examination date.
- Display remaining preparation days.
- Display estimated study hours.
- Display available study hours.
- Display topic difficulty scores.
- Display topic priority levels.
- Display daily study schedules.

12\. FR-12: Gantt Chart and Timeline

- Display topic start dates.
- Display topic completion dates.
- Display topic durations.
- Visualize the study timetable.
- Provide interactive timeline charts.

13\. FR-13: Progress Tracking

- Allow students to mark topics as completed.
- Display pending topics.
- Calculate overall study progress.
- Update progress statistics.
- Display progress bars and charts.

14\. FR-14: Schedule Regeneration

- Update the timetable when study hours change.
- Update the timetable when the examination date changes.
- Recalculate remaining topics.
- Adjust schedules according to completion status.

15\. FR-15: CSV Export

- Export generated study schedules.
- Include study dates.
- Include topic names.
- Include estimated preparation hours.
- Include priority levels.
- Include completion status.

16\. FR-16: Local Data Persistence

- Store study plans locally.
- Store student progress.
- Use JSON or CSV storage.
- Restore saved information when the application is reopened.

17\. FR-17: Reset Study Plan

- Allow students to reset the current plan.
- Confirm reset operations.
- Clear existing progress when requested.

### 3. Non-Functional Requirements (NFR)

1\. NFR-01: Performance

- Generate a study plan within approximately 3 seconds for up to 200 topics.
- Provide quick dashboard responses.
- Process CSV files efficiently.
- Perform lightweight calculations.

2\. NFR-02: Usability

- Provide a simple user interface.
- Use clear labels and instructions.
- Provide understandable error messages.
- Display readable charts.
- Support easy navigation.
- Require no programming knowledge from students.

3\. NFR-03: Reliability

- Generate consistent results.
- Validate all inputs.
- Handle missing data safely.
- Handle corrupted files.
- Prevent daily study-hour limit violations.
- Avoid scheduling topics after the examination date.

4\. NFR-04: Maintainability

- Use modular Python architecture.
- Separate frontend and backend logic.
- Maintain separate scheduling and analytics modules.
- Use reusable functions.
- Maintain proper code documentation.
- Support future modifications.

5\. NFR-05: Portability

- Support Windows 10/11.
- Support Linux.
- Support macOS.
- Run using standard Python environments.
- Avoid GPU requirements.

6\. NFR-06: Data Persistence

- Store study plans locally.
- Preserve completion status.
- Support JSON and CSV formats.
- Recover saved data between application sessions.

7\. NFR-07: Security

- Validate uploaded CSV files.
- Prevent execution of uploaded file contents.
- Avoid unnecessary personal information collection.
- Provide options to reset stored data.
- Protect student information if online storage is introduced.

8\. NFR-08: Accessibility

- Use readable fonts.
- Maintain appropriate text contrast.
- Provide clear chart labels.
- Avoid communicating important information through color alone.
- Use understandable interface controls.

### 4. COCOMO Model Estimation

4.1 COCOMO Model

1. Full Form: Constructive Cost Model.
2. Developed by Barry W. Boehm.
3. Used for software cost estimation.
4. Estimates development effort.
5. Estimates development time.
6. Estimates average team size.
7. Uses KLOC (Thousands of Lines of Code).

4.2 Selected COCOMO Mode: Organic

1. Suitable for small software projects.
2. Suitable for experienced or familiar development teams.
3. Suitable for relatively simple applications.
4. Requires limited hardware resources.
5. Suitable for the Smart Study Planner project.

4.3 Basic COCOMO Formulas

\- Effort:

\\[ E=2.4\times(KLOC)^{1.05} \\]

\- Development Time:

\\[ TDEV=2.5\times(E)^{0.38} \\]

\- Average Team Size:

\\[ TeamSize=\frac{E}{TDEV} \\]

4.4 Project Size Estimation

| Project Type | SLOC  | KLOC |
| ------------ | ----- | ---- |
| Small        | 2,000 | 2    |
| Medium       | 3,500 | 3.5  |
| Large        | 5,000 | 5    |

4.5 COCOMO Calculation Results

| Project Size | KLOC | Effort (Person-Months) | Development Time | Average Team |
| ------------ | ---- | ---------------------- | ---------------- | ------------ |
| Small        | 2    | 4.97                   | 4.61 months      | 1.08         |
| Medium       | 3.5  | 8.94                   | 5.75 months      | 1.56         |
| Large        | 5    | 13.00                  | 6.63 months      | 1.96         |

4.6 Recommended Team Size

1. Recommended team: 2–3 members.
2. Member 1: Backend development.
3. Member 2: Frontend development.
4. Member 3: Data management, testing, and documentation.
5. Perform integration testing collectively.
6. Divide development tasks according to modules.

### 5. Technology Stack Requirements

1. Programming Language: Python.
2. Frontend Framework: Streamlit.
3. Data Processing: pandas.
4. Numerical Computation: NumPy.
5. Data Visualization: Plotly or Altair.
6. Data Storage: JSON and CSV.
7. Testing Framework: pytest.
8. Development Environment: VS Code.
9. Execution Command: `streamlit run app.py`.

### 6. Project Acceptance Criteria

1. Application starts successfully.
2. Predefined subjects are available.
3. Custom syllabus input works.
4. CSV upload works correctly.
5. Input validation functions properly.
6. Complexity scores are calculated.
7. Familiarity-based time estimation works.
8. Topic priority scores are generated.
9. Day-by-day study schedules are created.
10. Daily study-hour limits are maintained.
11. High-Yield Mode activates when required.
12. Gantt chart displays the study schedule.
13. Progress tracking works correctly.
14. Study plans can be exported as CSV.
15. Local data persistence works.
16. Invalid inputs are handled safely.
17. Application passes unit and integration testing.
18. Project documentation is complete.
