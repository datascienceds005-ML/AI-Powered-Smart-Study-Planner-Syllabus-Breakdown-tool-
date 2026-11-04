# Software Engineering Analysis & Project Planning

## AI-Powered Smart Study Planner & Syllabus Breakdown Tool



5th Semester Academic Project

Software Engineering & Project Architecture



This analysis is based on your previously prepared `requirements.md` (Software Requirements Specification). It covers the SDLC model, functional and non-functional requirements, and project cost estimation using the Basic COCOMO model.

The recommended development approach is Agile SDLC with iterative prototyping, because your application contains multiple independent modules, such as syllabus management, complexity calculation, scheduling, visualization, and progress tracking.

# 1. Software Development Life Cycle (SDLC) Model Selection

## 1.1 Introduction

The Software Development Life Cycle (SDLC) is a systematic process used to develop software applications. It defines different phases, including requirement analysis, system design, implementation, testing, deployment, and maintenance.

Different SDLC models follow different approaches to software development. Selecting an appropriate model helps ensure that the project is completed within the available time, budget, and resources.

For the AI-Powered Smart Study Planner, five standard SDLC models are evaluated below.

## 1.2 Evaluation of Different SDLC Models

### A. Waterfall Model

[SDLC (Software Development Life Cycle) Phases, Process, Models - Complete guide - scmGalaxy](https://images.openai.com/static-rsc-4/0TvU0_DAm_Pk_fI4Q2ov-tuAPJrOCtEDk8tMWFVI_zGdsG_gopP2G5hHV04pH96K-qX4FkftM5iU-skHA1jIJLZuZCjOksnW90H0m5--OgAiNVmM4uIFIITzuUSmBxgoLCCBa4-UmL9-dtpfavqyhWollOveSBr4EfcFDNPbrZ0?purpose=inline)

[scmgalaxy.com](https://www.scmgalaxy.com/tutorials/sdlc-software-development-life-cycle-phases-process-models-complete-guide/?utm_source=chatgpt.com)

The Waterfall Model is a traditional software development model in which development progresses through a sequence of predefined phases.

Phases:

1. Requirement Analysis
2. System Design
3. Implementation
4. Testing
5. Deployment
6. Maintenance

Advantages:

- Simple and easy to understand.
- Clearly defined development phases.
- Proper documentation at every stage.
- Suitable when requirements are fixed.

Disadvantages:

- Changes in requirements are difficult to accommodate.
- Working software is available relatively late.
- Testing generally occurs after implementation.
- Less suitable for applications requiring frequent modifications.

Suitability for this project: Moderate. The project has a defined SRS, but the complexity formula, scheduling algorithm, and dashboard may require changes during development.

### B. Prototype Model

[Prototype Model in Software Engineering | Board Infinity](https://images.openai.com/static-rsc-4/1RbrLFHJi_gljOwwV9A3BoXOCssTVeKR_Y_-Op7p7gfjcZ5IrHn76cm8LzvLWYXTW4JmJAaN4UzVXJly67g67pM4Gjwh1xwTrtnDB3BvaNgm85_O9oGgxgVnflMTrXKrR9GhsTfvmgS-6IG3sOackPbZDsdAhvBUe2pJUufhpzg?purpose=inline)

[boardinfinity.com](https://www.boardinfinity.com/blog/a-quick-guide-to-prototype-model-in-software-engineering/?utm_source=chatgpt.com)

The Prototype Model involves creating an initial working version of the application to understand user requirements. Feedback is collected, and the prototype is improved until the expected functionality is achieved.

Phases:

1. Initial Requirement Collection
2. Quick Design
3. Prototype Development
4. User Evaluation
5. Refinement
6. Final Implementation

Advantages:

- Provides an early working version.
- Helps understand user expectations.
- Allows frequent feedback.
- Improves interface design and usability.

Disadvantages:

- Frequent changes may increase development time.
- Developers may focus more on appearance than system architecture.
- The prototype may become difficult to maintain if not redesigned properly.

Suitability for this project: High. A Streamlit prototype can quickly demonstrate syllabus input, topic difficulty scores, and a sample study schedule.

### C. Incremental Model

[Incremental Model of Software Development Life Cycle – Custom Web & Mobile Development Company – New Line Technologies](https://images.openai.com/static-rsc-4/T9ZyTavqU6EUy01fbrNYC9OTlEY9oLCSLDRBfek2jbcbHYS8Qdx2I8Pyevl71Abzkx_VrvNI9taBOskWiqsRoP_kibR-7E9teQM2ZPDn-owy2S1w-ncdpIkW2ctXGM7r1ZMUx9nnMT_VeCZ828c_b5HE0BrTlLjmXPupwYLopEc?purpose=inline)

[newline.tech](https://newline.tech/incremental-model-of-software-development-life-cycle/?utm_source=chatgpt.com)

The Incremental Model develops software in small functional modules called increments. Each increment adds new features to the existing application.

Possible increments for this project:

1. Increment 1: Subject selection and syllabus input.
2. Increment 2: Complexity score calculation.
3. Increment 3: Preparation-time estimation.
4. Increment 4: Automated study schedule generation.
5. Increment 5: Dashboard, progress tracking, and CSV export.

Advantages:

- Working software is delivered in stages.
- Easier testing and debugging.
- New features can be added gradually.
- Reduces the risk of developing the entire application at once.

Disadvantages:

- Requires proper module planning.
- Integration between modules can become challenging.
- Overall architecture must be designed carefully.

Suitability for this project: Very high. The application can be developed and tested module by module.

### D. Spiral Model

[Software Development Life Cycle (SDLC) | ITAIMS Insights](https://images.openai.com/static-rsc-4/PA3GgpXje-gAq2WiZtofyGv1be4e6D_NnCFMWmQxBuf1CUm7UAWylq4iOOP71wNRaQVSsVSVCM8Apmm9q6acc52GyVoYVQQSRthNRc_YlAGN0KLONL1qx99YCZCF-eLu7Qjq2b2dlK-P9x61buwFjSDqzTTNwdNP2QSfuKty8ew?purpose=inline)

[itaims.com](https://www.itaims.com/blog/software-development-life-cycle?utm_source=chatgpt.com)

The Spiral Model combines iterative development with systematic risk analysis. Development takes place through repeated cycles called spirals.

Each spiral includes:

1. Planning
2. Risk Analysis
3. Engineering and Development
4. Customer Evaluation

Advantages:

- Strong risk management.
- Supports changing requirements.
- Suitable for large and complex projects.
- Continuous evaluation is possible.

Disadvantages:

- Expensive and time-consuming.
- Requires risk-analysis expertise.
- More complicated than necessary for small projects.

Suitability for this project: Low to moderate. The project does not involve major financial, security, or technical risks that justify the overhead of the Spiral Model.

### E. Agile Model

[A Guide to Getting the Most Out of Agile | Onward Developer Toolkit](https://images.openai.com/static-rsc-4/38giqxNaR4Ph_DFB3bKg-OS_sMMB4JLEVFCnTpmkoL5wuKgbQIKKDVs7S6ljiwmv-GGg1akOqipi251Nh1XkhNfYpEwjRbFPL6I29Sp-KokSHjtgeejrhX71GfzhSAs-WcRjYQp0BcfoZN59d56ba9C92JUxJ1cHXiar1hr1ODg?purpose=inline)

[developers.onwardplatforms.com](https://developers.onwardplatforms.com/blog/2022/08/18/guide-to-getting-most-out-of-agile?utm_source=chatgpt.com)

The Agile Model is an iterative and flexible software development approach in which an application is developed through short cycles called sprints.

Each sprint includes planning, development, testing, review, and improvement.

Advantages:

- Supports changing requirements.
- Continuous testing and feedback.
- Working software is developed early.
- Easier identification of errors.
- Features can be developed in small iterations.
- Encourages teamwork and collaboration.

Disadvantages:

- Requires regular communication.
- Frequent changes can affect deadlines.
- Documentation may be neglected if not planned properly.
- Requires continuous monitoring of project progress.

Suitability for this project: Very high. The application can be developed through small sprints, with each sprint delivering a working feature.

## 1.3 Comparison of SDLC Models

| SDLC Model  | Flexibility | Testing approach           | Suitability |
| ----------- | ----------- | -------------------------- | ----------- |
| Waterfall   | Low         | Mainly after development   | Moderate    |
| Prototype   | High        | Repeated prototype testing | High        |
| Incremental | High        | At each increment          | Very high   |
| Spiral      | Very high   | At each cycle              | Moderate    |
| Agile       | Very high   | Continuous testing         | Very high   |

## 1.4 Recommended SDLC Model: Agile

Recommended

Agile is the most suitable SDLC model for developing the AI-Powered Smart Study Planner because the application consists of several independent features that can be implemented and tested incrementally.

The project involves Python, Streamlit, pandas, NumPy, and Plotly. Each component can be developed separately and integrated into the application through short development iterations.

Reasons for selecting Agile:

1. Flexible Development: Changes in complexity calculations and scheduling logic can be implemented easily.
2. Early Working Prototype: A basic Streamlit dashboard can be developed during the initial sprint.
3. Continuous Testing: Every module can be tested immediately after implementation.
4. Modular Development: Syllabus management, analytics, scheduling, and progress tracking can be developed independently.
5. User Feedback: Students and project evaluators can review the application and suggest improvements.
6. Reduced Development Risk: Problems can be identified and corrected during each sprint.

### 1.5 Proposed Agile Sprint Plan

| Sprint   | Duration | Development activities                             | Deliverable                |
| -------- | -------- | -------------------------------------------------- | -------------------------- |
| Sprint 1 | Week 1   | Requirement analysis, project setup, UI design     | Basic Streamlit interface  |
| Sprint 2 | Week 2   | Subject selection, custom syllabus, CSV upload     | Syllabus management module |
| Sprint 3 | Week 3   | Complexity score and familiarity calculations      | Analytics engine           |
| Sprint 4 | Week 4   | Time estimation and scheduling algorithm           | Automated study planner    |
| Sprint 5 | Week 5   | High-Yield Mode and Gantt chart                    | Interactive dashboard      |
| Sprint 6 | Week 6   | Progress tracking, CSV export, integration testing | Complete application       |
| Sprint 7 | Week 7   | System testing, bug fixing, documentation          | Final project release      |

The proposed timeline assumes a small student team with approximately seven weeks of focused development.

Conclusion: Agile is recommended as the primary SDLC model, supported by incremental feature delivery and early prototyping. It provides flexibility, continuous testing, and faster delivery of working software.

# 2. Functional and Non-Functional Requirements Summary

## 2.1 Introduction

Software requirements describe what a system should do and how it should perform.

Requirements are mainly divided into two categories:

1. Functional Requirements: Define the operations and services provided by the application.
2. Non-Functional Requirements: Define the quality, performance, reliability, and usability standards of the application.

The following requirements are derived from the project's SRS document.&#x20;

requirements.md



## 2.2 Functional Requirements (FR)

Functional requirements describe the core features and operations of the Smart Study Planner.

### FR-01: Syllabus Input and Management

The system shall allow students to provide syllabus information through three methods:

- Predefined Subjects: Select subjects such as Data Structures, Operating Systems, DBMS, and Computer Networks.
- Custom Syllabus: Manually enter subject names, chapters, and topics.
- CSV Upload: Upload a CSV file containing chapter details and difficulty-related attributes.

The system shall also allow students to add, edit, and delete topics.

### FR-02: Student Input Management

The system shall collect the following information:

- Examination date.
- Daily available study hours.
- Topic familiarity level.
- Topic mathematical density.
- Conceptual depth.
- Historical difficulty.
- Topic importance or syllabus weightage.

The system shall validate the entered information before generating the study plan.

### FR-03: Topic Complexity Score Calculation

The system shall calculate the difficulty level of each topic using a weighted mathematical formula.

\\[ CS_i=(W_1 \times M_i)+(W_2 \times C_i)+(W_3 \times H_i) \\]

Where:

- \\(M_i\\) = Mathematical Density.
- \\(C_i\\) = Conceptual Depth.
- \\(H_i\\) = Historical Difficulty.
- \\(W_1,W_2,W_3\\) = Assigned weights.

The normalized score shall be calculated as:

\\[ CS\_{normalized}=\frac{CS_i-1}{4}\times100 \\]

Suggested difficulty categories:

| Score  | Difficulty |
| ------ | ---------- |
| 0–33   | Low        |
| 34–66  | Medium     |
| 67–100 | High       |

### FR-04: Familiarity-Based Time Estimation

The system shall adjust preparation time according to the student's existing knowledge.

| Familiarity Level   | Time Multiplier |
| ------------------- | --------------- |
| Completely New      | 1.50            |
| Basic Understanding | 1.20            |
| Familiar            | 1.00            |
| Revised Before      | 0.75            |

The estimated preparation time shall be:

\\[ ET_i=BH_i\times CF_i\times FM_i \\]

Where:

- \\(ET_i\\) = Estimated Time.
- \\(BH_i\\) = Baseline Hours.
- \\(CF_i\\) = Complexity Factor.
- \\(FM_i\\) = Familiarity Multiplier.

This ensures that a completely new topic receives more preparation time than a previously revised topic.

### FR-05: Automated Day-by-Day Study Scheduling

The system shall automatically generate a study timetable based on:

- Examination date.
- Available preparation days.
- Daily study hours.
- Estimated preparation time.
- Topic complexity.
- Topic priority.

The system shall distribute topics across available days without exceeding the student's daily study-hour limit.

Example:

| Day   | Topic             | Study Hours |
| ----- | ----------------- | ----------- |
| Day 1 | Arrays            | 2           |
| Day 2 | Linked Lists      | 2.5         |
| Day 3 | Stacks and Queues | 2           |
| Day 4 | Trees             | 3           |
| Day 5 | Graphs            | 2.5         |

Illustrative schedule only.

### FR-06: High-Yield Mode

The system shall automatically activate High-Yield Mode when:

\\[ TotalEstimatedHours>AvailableHours \\]

In this mode:

- High-priority topics receive preference.
- Important chapters are scheduled first.
- Available study hours are distributed according to topic priority.
- Shortened or unscheduled topics are identified.
- The system displays a warning about insufficient preparation time.

This feature helps students prioritize important topics when the examination is approaching.

### FR-07: Interactive Dashboard and Visualization

The system shall provide a Streamlit dashboard displaying:

- Selected subject and examination date.
- Remaining preparation days.
- Total estimated study hours.
- Available study hours.
- Topic complexity scores.
- Topic priority levels.
- Day-wise study timetable.
- Interactive Gantt chart or timeline.

### FR-08: Progress Tracking

The system shall allow students to:

- Mark topics as completed.
- View pending topics.
- Monitor overall study progress.
- Update completion status.
- Regenerate the remaining schedule when necessary.

Progress can be represented using a progress bar or graphical chart.

### FR-09: CSV Export

The system shall allow students to download the generated study schedule in CSV format.

The exported file should contain:

- Study date.
- Topic name.
- Estimated study hours.
- Priority level.
- Completion status.

### FR-10: Data Persistence

The system should preserve study plans and progress using local JSON or CSV storage so that information can be recovered between application sessions.

## 2.3 Functional Requirements Summary

| ID    | Functional Requirement                     | Priority |
| ----- | ------------------------------------------ | -------- |
| FR-01 | Predefined, custom, and CSV syllabus input | High     |
| FR-02 | Student input management                   | High     |
| FR-03 | Complexity score calculation               | High     |
| FR-04 | Familiarity-based time estimation          | High     |
| FR-05 | Automated study scheduling                 | High     |
| FR-06 | High-Yield Mode                            | High     |
| FR-07 | Interactive dashboard                      | High     |
| FR-08 | Progress tracking                          | High     |
| FR-09 | CSV export                                 | Medium   |
| FR-10 | Local data persistence                     | High     |

## 2.4 Non-Functional Requirements (NFR)

Non-functional requirements describe the quality attributes and operational standards that the application must satisfy.

### NFR-01: Performance

The application should generate a study plan for a typical syllabus containing up to 200 topics within approximately 3 seconds on a standard student laptop.

Other performance expectations:

- Dashboard interactions should respond quickly.
- CSV files should be processed without unnecessary delays.
- Complexity calculations should be computationally lightweight.

### NFR-02: Usability

The application should provide a simple and user-friendly interface.

- Students should be able to create a study plan without programming knowledge.
- Input fields should have clear labels.
- Error messages should be understandable.
- Charts should display readable labels and legends.
- The dashboard should be easy to navigate.

### NFR-03: Reliability

The system should generate accurate and consistent results for valid inputs.

- Invalid inputs must be rejected.
- Missing syllabus information should be handled safely.
- The same inputs should produce the same schedule.
- The system should handle corrupted CSV or JSON files without crashing.
- Daily study-hour limits must not be exceeded.

### NFR-04: Maintainability

The application should have a modular architecture.

Different modules should be maintained independently, such as:

- `data_loader.py`
- `complexity_engine.py`
- `time_estimator.py`
- `scheduler.py`
- `progress_tracker.py`
- `exporter.py`

This makes debugging, testing, and future development easier.

### NFR-05: Portability

The application should run on:

- Windows 10/11.
- Linux.
- macOS.

It should use Python and lightweight libraries without requiring expensive hardware or GPU support.

### NFR-06: Data Persistence

The system should store student study plans and progress using local JSON or CSV files.

The stored information should be available when the application is reopened, provided the local storage remains available.

### NFR-07: Security

- Uploaded CSV files must be validated.
- The application must not execute uploaded file contents as code.
- Unnecessary personal information should not be collected.
- Stored data should have clearly documented locations and reset options.

### NFR-08: Accessibility

- Text should be readable.
- Charts should use clear labels.
- Important information should not depend on color alone.
- Controls should have understandable names and instructions.

requirements.md

## 2.5 Non-Functional Requirements Summary

| ID     | Requirement      | Expected Standard                                     |
| ------ | ---------------- | ----------------------------------------------------- |
| NFR-01 | Performance      | Plan generation within 3 seconds for up to 200 topics |
| NFR-02 | Usability        | Simple Streamlit interface                            |
| NFR-03 | Reliability      | Consistent results and safe error handling            |
| NFR-04 | Maintainability  | Modular Python architecture                           |
| NFR-05 | Portability      | Windows, Linux, and macOS                             |
| NFR-06 | Data Persistence | Local JSON/CSV storage                                |
| NFR-07 | Security         | Input validation and safe file handling               |
| NFR-08 | Accessibility    | Readable text, labels, and charts                     |

Conclusion: Functional requirements define the application's main operations, such as syllabus management, difficulty calculation, schedule generation, and progress tracking. Non-functional requirements ensure that the application remains fast, reliable, maintainable, secure, and user-friendly.

# 3. COCOMO Model Estimation (Team Size & Effort)

## 3.1 Introduction to COCOMO

COCOMO stands for Constructive Cost Model. It is a software cost estimation model developed by Barry W. Boehm.

It is used to estimate:

- Software development effort.
- Development time.
- Average team size.
- Overall project cost.

COCOMO estimates software development effort based on the size of the software, measured in KLOC (Thousands of Lines of Code).

For this project, we will use the Basic COCOMO Model – Organic Mode.

## 3.2 Why Organic Mode?

The Organic Mode is suitable for small and relatively simple software projects developed by a small team with reasonable experience.

Our Smart Study Planner project qualifies because:

1. It is a relatively small academic application.
2. It uses standard technologies such as Python and Streamlit.
3. It has a modular architecture.
4. It does not require complex hardware.
5. It uses lightweight data processing and rule-based algorithms.
6. Its development is manageable by a small student team.

Therefore, Organic Mode is appropriate for this estimation.

## 3.3 Basic COCOMO Formulas (Organic Mode)

The following formulas are used:

1\. Effort Estimation

\\[ E=2.4\times(KLOC)^{1.05} \\]

Where:

- E = Development effort in Person-Months.
- KLOC = Thousands of Source Lines of Code.

2\. Development Time

\\[ TDEV=2.5\times(E)^{0.38} \\]

Where:

- TDEV = Development time in months.
- E = Estimated effort in Person-Months.

3\. Average Team Size

\\[ TeamSize=\frac{E}{TDEV} \\]

Where:

- E = Total development effort.
- TDEV = Development duration.

## 3.4 Project Size Estimation

For this academic project, we assume the following source code sizes:

| Project Size | Source Lines of Code | KLOC |
| ------------ | -------------------- | ---- |
| Small        | 2,000                | 2    |
| Medium       | 3,500                | 3.5  |
| Large        | 5,000                | 5    |

These are estimated implementation sizes, not measured source-code counts. They exclude blank lines and comments.

## 3.5 COCOMO Calculation

We will calculate the effort, development time, and average team size for all three project sizes.

### Case 1: Small Project (2,000 SLOC)

Given:

\\[ KLOC=2 \\]

Effort:

\\[ E=2.4\times(2)^{1.05} \\]

\\[ E=2.4\times2.071 \\]

\\[ \boxed{E=4.97\ Person\text{-}Months} \\]

Development Time:

\\[ TDEV=2.5\times(4.97)^{0.38} \\]

\\[ \boxed{TDEV\approx4.61\ Months} \\]

Average Team Size:

\\[ TeamSize=\frac{4.97}{4.61} \\]

\\[ \boxed{TeamSize\approx1.08} \\]

Therefore, approximately 1–2 developers are required on average.

### Case 2: Medium Project (3,500 SLOC)

Given:

\\[ KLOC=3.5 \\]

Effort:

\\[ E=2.4\times(3.5)^{1.05} \\]

\\[ \boxed{E\approx8.94\ Person\text{-}Months} \\]

Development Time:

\\[ TDEV=2.5\times(8.94)^{0.38} \\]

\\[ \boxed{TDEV\approx5.75\ Months} \\]

Average Team Size:

\\[ TeamSize=\frac{8.94}{5.75} \\]

\\[ \boxed{TeamSize\approx1.56} \\]

Therefore, approximately 2 developers are required on average.

### Case 3: Large Project (5,000 SLOC)

Given:

\\[ KLOC=5 \\]

Effort:

\\[ E=2.4\times(5)^{1.05} \\]

\\[ \boxed{E\approx13.00\ Person\text{-}Months} \\]

Development Time:

\\[ TDEV=2.5\times(13.00)^{0.38} \\]

\\[ \boxed{TDEV\approx6.63\ Months} \\]

Average Team Size:

\\[ TeamSize=\frac{13.00}{6.63} \\]

\\[ \boxed{TeamSize\approx1.96} \\]

Therefore, approximately 2 developers are required on average.

## 3.6 COCOMO Estimation Summary

Results calculated using Basic COCOMO Organic Mode formulas.

| Project Size | KLOC | Effort (PM) | Time (Months) | Avg. Team |
| ------------ | ---- | ----------- | ------------- | --------- |
| Small        | 2    | 4.97        | 4.61          | 1.08      |
| Medium       | 3.5  | 8.94        | 5.75          | 1.56      |
| Large        | 5    | 13.00       | 6.63          | 1.96      |

Estimated Development Effort

Basic COCOMO Organic Mode estimates in person-months.

0 PM4 PM8 PM12 PM16 PM2 KLOC3.5 KLOC5 KLOC

## 3.7 Recommended Team Size

For the Smart Study Planner project, a team of 2–3 members is recommended.

A practical division of responsibilities is:

| Team Member | Responsibility           | Main Tasks                                                            |
| ----------- | ------------------------ | --------------------------------------------------------------------- |
| Member 1    | Backend Developer        | Complexity engine, time estimation, scheduling algorithm              |
| Member 2    | Frontend Developer       | Streamlit dashboard, forms, charts, user interface                    |
| Member 3    | Data & Testing Developer | Dataset management, CSV handling, testing, integration, documentation |

### Why 2–3 Members?

1. Development work can be divided into independent modules.
2. Backend and frontend development can happen simultaneously.
3. Testing can be performed alongside implementation.
4. Integration becomes easier with clearly assigned responsibilities.
5. The workload is manageable for a 5th-semester academic project.

My recommendation: Use three team members if available. If the project must be completed by two students, combine data management and testing responsibilities with the backend role.

## 3.8 Estimated Effort for the Recommended Project

For planning purposes, consider the medium-sized implementation of approximately 3,500 SLOC.

| Parameter                  | Estimated Value    |
| -------------------------- | ------------------ |
| Project size               | 3,500 SLOC         |
| Development model          | Agile              |
| COCOMO mode                | Organic            |
| Total effort               | 8.94 Person-Months |
| Development time           | 5.75 Months        |
| Average staffing           | 1.56 persons       |
| Recommended practical team | 2–3 members        |

Important: COCOMO's development duration is a model estimate, not a guaranteed academic submission deadline. It assumes a conventional full-time project environment. Actual calendar duration will depend on the students' available working hours, experience, and academic schedule. Adding more team members does not automatically reduce development time in direct proportion because integration and coordination also require effort.

# 4. Final Project Architecture Recommendations

Based on the SDLC evaluation, requirements analysis, and COCOMO estimation, the following development strategy is recommended.

## Recommended project configuration

SDLC MODEL

Agile

COCOMO MODE

Organic

ESTIMATED PROJECT SIZE

3.5 KLOC

TOTAL EFFORT

8.94 Person-Months

RECOMMENDED TEAM

2–3 Members

ESTIMATED DURATION

5.75 Months

Technology stack

- Programming: Python
- Frontend: Streamlit
- Data processing: pandas, NumPy
- Visualization: Plotly
- Storage: JSON / CSV
- Testing: pytest

## 4.1 Recommended Development Phases

| Phase                   | Main Activities                               |
| ----------------------- | --------------------------------------------- |
| 1. Requirement Analysis | Finalize SRS and functional requirements      |
| 2. System Design        | Design architecture, data structures, and UI  |
| 3. Implementation       | Develop syllabus and analytics modules        |
| 4. Integration          | Connect scheduling engine with Streamlit      |
| 5. Testing              | Perform unit, integration, and system testing |
| 6. Deployment           | Run and demonstrate the application           |
| 7. Maintenance          | Fix bugs and improve functionality            |

## 4.2 Important Architectural Recommendation

One important point for your project presentation is the meaning of "AI-Powered."

Your current SRS specifies a weighted rule-based complexity model, familiarity multipliers, and a scheduling algorithm. This is a perfectly reasonable approach for a 5th-semester project.

However, unless you actually train and evaluate a machine-learning model, describe the first version as:

"An intelligent, rule-based study planning system with personalized difficulty estimation."

You can introduce regression-based preparation-time prediction as a future enhancement. This makes your project explanation technically accurate and easier to defend during evaluation.

# 5. Final Conclusion

The AI-Powered Smart Study Planner & Syllabus Breakdown Tool is suitable for development using the Agile SDLC model because it supports iterative development, modular implementation, and continuous testing.

The system's functional requirements focus on syllabus management, topic complexity estimation, personalized study-time calculation, automated scheduling, High-Yield Mode, and progress tracking. Its non-functional requirements ensure performance, usability, reliability, portability, and maintainability.

Using the Basic COCOMO Organic Mode, a medium-sized implementation of approximately 3,500 SLOC requires an estimated 8.94 person-months of effort, with a nominal development duration of approximately 5.75 months.

A team of two to three students is recommended to complete the project efficiently.

The combination of Agile development, a modular Python architecture, and an explainable scheduling algorithm provides a practical foundation for successful academic project development and demonstration.

Suggested next step: Prepare the Software Design Document (SDD), including the Use Case Diagram, Data Flow Diagram (DFD Level 0 and Level 1), ER Diagram, and module-wise architecture based on this SRS.
