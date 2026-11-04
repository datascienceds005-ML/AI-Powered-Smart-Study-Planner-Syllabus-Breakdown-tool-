# AI-Powered Smart Study Planner & Syllabus Breakdown Tool

## Software Requirements Specification (SRS)

**Document version:** 1.0\
**Project type:** Academic / 5th-semester project\
**Proposed implementation:** Python, Streamlit, pandas, NumPy, Plotly or
Altair\
**Deployment target:** Local laptop or lightweight hosted Python
environment

------------------------------------------------------------------------

## 1. Introduction

### 1.1 Purpose

The AI-Powered Smart Study Planner & Syllabus Breakdown Tool is a
student-focused application that converts a syllabus into a practical,
personalized study schedule. Students provide their subjects or
chapters, examination date, available daily study hours, and familiarity
with each topic. The application estimates topic complexity, allocates
preparation time, and generates a day-by-day study plan.

This document defines the functional requirements, non-functional
requirements, data model, algorithms, interfaces, constraints,
assumptions, and acceptance criteria for the proposed system. It is
intended for student developers, project guides, evaluators, testers,
and future maintainers.

### 1.2 Problem Statement

Students preparing for semester examinations and competitive
examinations often have difficulty deciding: - Which chapters should be
studied first. - How much time each topic requires. - How to divide a
large syllabus into daily targets. - How to adjust a plan when the
examination date is near. - How to monitor completed work and identify
topics that need revision.

A fixed timetable does not account for differences in topic difficulty
or a student's existing knowledge. The proposed application addresses
this problem by estimating topic preparation effort and distributing
available study time according to topic complexity, familiarity,
priority, and the time remaining before the examination.

### 1.3 Project Objectives

The system shall:

1.  Allow students to select a predefined subject or enter a custom
    syllabus.
2.  Accept chapter-level topic information and difficulty-related
    attributes.
3.  Calculate a transparent Topic Complexity Score.
4.  Estimate preparation time for each topic.
5.  Personalize estimates using the student's familiarity level.
6.  Generate a realistic schedule between the current date and the
    examination date.
7.  Prioritize important topics when preparation time is limited.
8.  Display the schedule through a calendar, timeline, or Gantt chart.
9.  Allow students to record progress and mark topics as completed.
10. Recalculate remaining targets when progress or available time
    changes.

### 1.4 Scope

**Included in scope** - Subject and chapter selection. - Custom syllabus
entry and optional CSV upload. - Topic difficulty and preparation-time
estimation using a rule-based model. - Familiarity-based
personalization. - Exam-date and daily-study-hours configuration. -
Day-wise study schedule generation. - High-yield prioritization under
time constraints. - Progress tracking and schedule summaries. -
Interactive charts and downloadable schedule data. - Local file-based
subject and topic dataset.

**Outside the initial scope** - Automatic extraction of a complete
syllabus from arbitrary PDFs or images. - Guaranteed prediction of
examination questions. - Automatic access to university or
examination-board portals. - Live collaboration between multiple
students. - Paid tutoring, video lessons, or learning-management
functionality. - A trained machine-learning model requiring a large
labeled dataset. - Mobile-native applications and offline
synchronization across devices.

These features may be considered for future versions.

### 1.5 Intended Users

  -----------------------------------------------------------------------
  User                                Description
  ----------------------------------- -----------------------------------
  Student                             Creates a study plan, updates
                                      familiarity, and tracks progress.

  Project evaluator                   Reviews the workflow, algorithm,
                                      dashboard, and outputs.

  Developer / maintainer              Updates datasets, formulas,
                                      validation rules, and application
                                      features.
  -----------------------------------------------------------------------

### 1.6 Definitions and Abbreviations

  -----------------------------------------------------------------------
  Term                                Meaning
  ----------------------------------- -----------------------------------
  Syllabus                            A collection of subjects, chapters,
                                      and topics to prepare.

  Topic                               The smallest schedulable unit of
                                      study.

  Complexity Score                    A weighted score representing the
                                      estimated difficulty of a topic.

  Familiarity                         The student's self-reported prior
                                      knowledge of a topic.

  Preparation Time                    Estimated hours needed to study a
                                      topic.

  High-Yield Mode                     A constrained-planning mode that
                                      gives preference to higher-priority
                                      topics.

  Gantt Chart                         A timeline chart showing when
                                      scheduled tasks begin and end.

  CSV                                 Comma-Separated Values file format.

  UI                                  User Interface.

  SRS                                 Software Requirements
                                      Specification.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Overall Description

### 2.1 Product Perspective

The application is a standalone, data-driven Python web application.
Streamlit provides the user interface, while a separate planning engine
validates inputs, calculates complexity and estimated effort, and
generates the schedule. pandas and NumPy support tabular processing and
calculations. Plotly or Altair presents the schedule and progress
visually.

The system can run locally on a standard laptop. It does not require a
GPU, a dedicated server, or a cloud database for the initial version.

### 2.2 High-Level Architecture

``` text
+-------------------------------+
|          Student              |
| Subject, Syllabus, Exam Date,  |
| Daily Hours, Familiarity       |
+---------------+---------------+
                |
                v
+-------------------------------+
|       Streamlit Interface     |
| Input Forms, Validation,      |
| Dashboard, Progress Controls  |
+---------------+---------------+
                |
                v
+-------------------------------+
|       Planning Engine         |
| Complexity Calculation        |
| Time Estimation               |
| Priority Calculation          |
| Schedule Generation           |
+---------------+---------------+
                |
        +-------+-------+
        |               |
        v               v
+---------------+  +----------------+
| Subject Data  |  | Progress Data  |
| JSON / CSV    |  | Local Storage  |
+---------------+  +----------------+
        |               |
        +-------+-------+
                |
                v
+-------------------------------+
|       Results Dashboard       |
| Daily Plan, Gantt Chart,      |
| Priority List, Progress       |
| Summary, Export               |
+-------------------------------+
```

### 2.3 Product Functions

The major functions of the application are:

1.  Subject selection and syllabus management.
2.  Topic attribute collection.
3.  Input validation.
4.  Complexity score calculation.
5.  Personalized preparation-time estimation.
6.  Topic priority calculation.
7.  Schedule generation and workload balancing.
8.  High-yield planning when time is insufficient.
9.  Progress tracking and schedule recalculation.
10. Visualization and export of the generated plan.

### 2.4 Operating Environment

  -----------------------------------------------------------------------
  Component                           Requirement
  ----------------------------------- -----------------------------------
  Operating system                    Windows 10/11, Linux, or macOS

  Programming language                Python 3.10 or later

  User interface                      Streamlit

  Data processing                     pandas and NumPy

  Visualization                       Plotly or Altair

  Data format                         JSON and/or CSV

  Browser                             Recent version of Chrome, Edge,
                                      Firefox, or Safari

  Hardware                            Basic laptop; 4 GB RAM minimum
                                      recommended

  Execution                           Local Streamlit server or
                                      compatible Python hosting
                                      environment
  -----------------------------------------------------------------------

### 2.5 User Characteristics

The target user is a student with basic computer knowledge. The
application should not require programming knowledge. Labels, help text,
validation messages, and charts should be understandable to a general
student.

### 2.6 Assumptions and Dependencies

-   The student provides a reasonably complete and accurate syllabus.
-   Familiarity ratings are subjective and may not perfectly represent
    actual knowledge.
-   Baseline topic attributes and preparation times are maintained in
    the local dataset.
-   The current date and examination date use the same local calendar
    context.
-   The student enters the number of hours they can realistically study
    each day.
-   The first version uses a rule-based estimation engine rather than
    claiming to use a trained AI model.
-   The application depends on compatible versions of Python packages
    listed in the project dependency file.

------------------------------------------------------------------------

## 3. Functional Requirements

Requirements are identified using IDs so that they can be referenced
during development and testing.

### 3.1 Subject and Syllabus Management

**FR-01 --- Subject Selection**\
The system shall display a list of predefined subjects from the internal
dataset.

**FR-02 --- Subject Details**\
After subject selection, the system shall display the available modules,
chapters, or topics belonging to that subject.

**FR-03 --- Custom Syllabus**\
The system shall allow a student to enter a custom subject name and add
chapters or topics manually.

**FR-04 --- CSV Import**\
The system should allow the student to upload a CSV file containing
topic details. The system shall validate the file's columns and values
before accepting it.

**FR-05 --- Topic Editing**\
The system shall allow the student to add, edit, and remove topics
before generating the schedule.

**FR-06 --- Topic Attributes**\
Each topic shall support the following attributes: - Topic or chapter
name. - Estimated page count or content-length value. - Mathematical
density from 1 to 5. - Conceptual depth from 1 to 5. - Historical
difficulty or failure rating from 1 to 5. - Syllabus weightage or
importance, where known. - Baseline preparation time in hours, where
available.

### 3.2 Student Input

**FR-07 --- Examination Date**\
The system shall allow the student to select an examination date.

**FR-08 --- Daily Study Availability**\
The system shall accept the number of study hours available per day.

**FR-09 --- Familiarity Rating**\
The system shall allow the student to select a familiarity level for
every topic.

The initial familiarity levels shall be: - Completely New. - Basic
Understanding. - Familiar. - Revised Before.

**FR-10 --- Optional Study Preferences**\
The system may allow the student to specify: - Preferred study days. -
Weekly rest days. - Daily maximum study hours. - A revision buffer
before the examination. - A preferred daily study-session duration.

**FR-11 --- Input Validation**\
The system shall reject invalid dates, negative study hours, empty topic
names, invalid rating values, and malformed uploaded files. It shall
show a clear message explaining how to correct the input.

### 3.3 Complexity Analytics Engine

**FR-12 --- Complexity Score**\
The system shall calculate a complexity score for each topic using a
weighted formula based on mathematical density, conceptual depth, and
historical difficulty.

**FR-13 --- Familiarity Adjustment**\
The system shall adjust the estimated preparation time according to the
student's familiarity rating.

**FR-14 --- Preparation-Time Estimation**\
The system shall estimate the hours required for every topic using its
baseline preparation time and complexity/familiarity adjustments.

**FR-15 --- Topic Priority**\
The system shall calculate a priority value using available information
such as topic importance, complexity, and preparation effort.

**FR-16 --- Transparent Results**\
The system shall show the complexity score, familiarity adjustment, and
estimated preparation time so that students can understand why a topic
received its allocation.

### 3.4 Study Schedule Generation

**FR-17 --- Available-Time Calculation**\
The system shall calculate the number of available study days between
the current date and the examination date.

**FR-18 --- Daily Capacity**\
The system shall calculate daily study capacity using the student's
available hours and any configured rest days or daily limits.

**FR-19 --- Day-by-Day Plan**\
The system shall distribute topics across available days and generate a
dated daily study schedule.

**FR-20 --- Workload Balancing**\
The system should distribute study hours as evenly as practical while
respecting topic effort estimates and daily capacity.

**FR-21 --- Topic Ordering**\
The system shall consider topic priority and prerequisite order, if
prerequisite information is supplied.

**FR-22 --- High-Yield Mode**\
When total estimated preparation time exceeds available study time, the
system shall activate a constrained planning mode. It shall prioritize
high-importance topics and clearly identify topics that are shortened,
deferred, or not scheduled.

**FR-23 --- Revision Buffer**\
If the student enables a revision buffer, the system should reserve the
configured time before the examination for revision and practice.

**FR-24 --- Insufficient-Time Warning**\
The system shall warn the student when the available time is
insufficient to complete all topics at their estimated preparation
times.

**FR-25 --- Schedule Regeneration**\
The system shall regenerate the remaining schedule when the student
changes the exam date, daily study hours, topic list, or other relevant
planning inputs.

### 3.5 Dashboard and Visualization

**FR-26 --- Dashboard Summary**\
The system shall display: - Subject name. - Examination date. - Days
remaining. - Total estimated study hours. - Available study hours. -
Number of topics. - Number of scheduled and completed topics.

**FR-27 --- Daily Timeline**\
The system shall display the date, assigned topics, and estimated hours
for each study day.

**FR-28 --- Gantt Chart**\
The system shall display an interactive timeline or Gantt-style chart
showing topic start dates, end dates, and duration.

**FR-29 --- Priority Visualization**\
The system should visually distinguish high-, medium-, and low-priority
topics.

**FR-30 --- Progress Visualization**\
The system shall display progress using a progress bar, chart, or
completion summary.

**FR-31 --- Responsive Layout**\
The dashboard should remain usable on common laptop and desktop screen
sizes.

### 3.6 Progress Tracking and Export

**FR-32 --- Mark Completion**\
The system shall allow the student to mark a topic or scheduled task as
completed.

**FR-33 --- Progress Update**\
The system shall update completion statistics when a task is marked
complete or incomplete.

**FR-34 --- Progress Persistence**\
The system should preserve progress between application sessions using a
local data file or another configured persistence mechanism.

**FR-35 --- Download Schedule**\
The system shall allow the student to download the generated schedule in
CSV format.

**FR-36 --- Reset Plan**\
The system shall provide a clearly labeled option to reset the current
plan and its progress after confirmation.

------------------------------------------------------------------------

## 4. Data Requirements

### 4.1 Data Sources

The initial version shall use a small, curated internal dataset rather
than depending on a large external dataset. Data may be stored in JSON
or CSV files.

Possible subject categories include: - Computer Science. - Data
Structures. - Database Management Systems. - Operating Systems. -
Software Engineering. - Computer Networks. - Mathematics.

The actual subjects and topic values must be reviewed and populated by
the project team. Example values are illustrative and must not be
presented as verified examination statistics.

### 4.2 Topic Data Fields

  -----------------------------------------------------------------------------
  Field                   Data type         Description       Validation
  ----------------------- ----------------- ----------------- -----------------
  topic_id                String            Unique topic      Required, unique
                                            identifier        

  subject_id              String            Parent subject    Required
                                            identifier        

  chapter_name            String            Chapter or topic  Required
                                            name              

  page_count              Integer           Approximate       Zero or positive
                                            content length    

  math_density            Integer           Mathematical      1--5
                                            intensity         

  concept_depth           Integer           Conceptual        1--5
                                            difficulty        

  historical_difficulty   Integer           General           1--5
                                            difficulty        
                                            estimate          

  importance              Integer           Syllabus or exam  1--5
                                            importance        

  base_hours              Float             Baseline          Positive
                                            preparation time  

  prerequisite_ids        Array/String      Optional          Must reference
                                            prerequisite      valid topics
                                            topics            
  -----------------------------------------------------------------------------

### 4.3 Example JSON Structure

``` json
{
  "subjects": [
    {
      "subject_id": "CS101",
      "subject_name": "Data Structures",
      "topics": [
        {
          "topic_id": "DS001",
          "chapter_name": "Arrays",
          "page_count": 12,
          "math_density": 2,
          "concept_depth": 2,
          "historical_difficulty": 2,
          "importance": 4,
          "base_hours": 2.0,
          "prerequisite_ids": []
        },
        {
          "topic_id": "DS002",
          "chapter_name": "Trees",
          "page_count": 25,
          "math_density": 3,
          "concept_depth": 4,
          "historical_difficulty": 4,
          "importance": 5,
          "base_hours": 4.0,
          "prerequisite_ids": ["DS001"]
        }
      ]
    }
  ]
}
```

### 4.4 Example CSV Structure

``` csv
topic_id,subject_id,chapter_name,page_count,math_density,concept_depth,historical_difficulty,importance,base_hours
DS001,CS101,Arrays,12,2,2,2,4,2.0
DS002,CS101,Trees,25,3,4,4,5,4.0
```

### 4.5 Student Plan Data

The system should maintain the following user-plan information:

  Field               Description
  ------------------- ------------------------------------
  plan_id             Unique plan identifier
  subject_id          Selected subject
  exam_date           Target examination date
  daily_hours         Available study hours per day
  topic_familiarity   Familiarity value for each topic
  scheduled_tasks     Topic/date/hour assignments
  completion_status   Pending, in progress, or completed
  created_at          Plan creation date/time
  updated_at          Last modification date/time

The initial version may store this data in JSON or CSV. A database is
not mandatory for the first release.

------------------------------------------------------------------------

## 5. Complexity and Planning Algorithms

### 5.1 Complexity Score

The complexity engine shall use a weighted, explainable rule-based
formula.

Let:

-   (M_i) = Mathematical Density of topic (i), from 1 to 5.
-   (C_i) = Conceptual Depth of topic (i), from 1 to 5.
-   (H_i) = Historical Difficulty of topic (i), from 1 to 5.
-   (w_1, w_2, w_3) = configurable weights.

The raw complexity score is:

\[ RawScore_i = (w_1 `\times `{=tex}M_i) + (w_2 `\times `{=tex}C_i) +
(w_3 `\times `{=tex}H_i) \]

The weights shall sum to 1.0. A suggested initial configuration is:

\[ w_1 = 0.30,`\quad `{=tex}w_2 = 0.40,`\quad `{=tex}w_3 = 0.30 \]

The normalized complexity score on a 0--100 scale is:

\[ Complexity_i = `\frac{RawScore_i - 1}{4}`{=tex} `\times 100`{=tex} \]

This normalization assumes all three input ratings use a 1--5 scale and
the weights sum to 1.0.

Suggested interpretation:

  Score     Difficulty category
  --------- ---------------------
  0--33     Low
  34--66    Medium
  67--100   High

The exact category boundaries should be configurable.

### 5.2 Familiarity Adjustment

The student's familiarity level modifies the baseline preparation time.

Suggested initial multipliers:

  Familiarity             Multiplier
  --------------------- ------------
  Completely New                1.50
  Basic Understanding           1.20
  Familiar                      1.00
  Revised Before                0.75

These values are initial project assumptions and should be tested with
sample student feedback.

### 5.3 Preparation-Time Estimation

If a baseline preparation time exists, the system shall calculate:

\[ EstimatedHours_i = BaseHours_i `\times `{=tex}ComplexityFactor_i
`\times `{=tex}FamiliarityMultiplier_i \]

A suggested complexity factor is:

\[ ComplexityFactor_i = 0.75 + `\frac{Complexity_i}{200}`{=tex} \]

This produces a factor from 0.75 to 1.25 when the normalized score
ranges from 0 to 100.

If baseline hours are unavailable, the application may estimate them
from page count and a configurable base reading/study rate. The chosen
fallback rule must be visible to the student and documented in the
application.

The system shall round displayed estimates to a practical precision,
such as the nearest 0.25 hour, while retaining sufficient precision
internally for scheduling.

### 5.4 Topic Priority

A suggested priority score is:

\[ Priority_i = (0.50 `\times `{=tex}Importance_i) + (0.30
`\times `{=tex}NormalizedComplexity_i) + (0.20
`\times `{=tex}NormalizedEffort_i) \]

All three inputs must first be normalized to a common 0--100 scale. The
weights are configurable. The application should explain that priority
is a planning aid, not a prediction of examination questions.

If syllabus importance is unavailable, the system shall use a documented
fallback and shall not silently treat missing importance as verified
exam weightage.

### 5.5 Available-Time Calculation

Let:

-   \(D\) = number of usable study days before the examination.
-   (H_d) = available study hours per day.
-   \(B\) = hours reserved for revision or practice, if enabled.

Then:

\[ AvailableHours = (D `\times `{=tex}H_d) - B \]

The examination day shall not be counted as a full study day by default.
The system shall prevent schedules from assigning work after the
examination date.

### 5.6 Schedule Generation

The schedule generator shall:

1.  Validate the exam date and daily study availability.
2.  Determine usable study days and rest days.
3.  Calculate estimated hours and priority for every topic.
4.  Respect prerequisite order when prerequisite information is
    provided.
5.  Sort or select topics using priority and prerequisite constraints.
6.  Allocate topic hours across available days without exceeding daily
    capacity.
7.  Split long topics across multiple days when necessary.
8.  Reserve revision time if configured.
9.  identify any unallocated or unscheduled work.
10. Return a schedule with dates, topics, hours, and status.

The implementation may use a greedy allocation algorithm for the first
version. The algorithm should be deterministic for the same inputs so
that results are repeatable and testable.

### 5.7 High-Yield Mode

High-Yield Mode shall activate when:

\[ TotalEstimatedHours \> AvailableHours \]

In this mode, the application shall: - Prefer topics with higher
priority. - Respect known prerequisites where possible. - Allocate
available time according to priority and estimated effort. - Mark topics
receiving reduced time. - Identify topics that could not be scheduled. -
Show a clear warning that the plan is compressed and may not cover every
topic adequately.

The system shall never imply that a compressed plan guarantees
examination readiness.

### 5.8 Schedule Quality Rules

The generated plan should satisfy these rules:

-   No task shall have a negative duration.
-   No daily allocation shall exceed the configured daily limit.
-   No task shall be scheduled after the exam date.
-   Every input topic shall be accounted for as scheduled, completed,
    deferred, or unscheduled.
-   Total assigned hours shall not exceed available hours.
-   Prerequisites should be scheduled before dependent topics when
    feasible.
-   Revision time shall not overlap with the examination date.
-   Rounding shall not cause the daily capacity to be exceeded.

------------------------------------------------------------------------

## 6. External Interface Requirements

### 6.1 User Interface

The application shall use Streamlit and provide the following screens or
sections.

#### A. Home / Dashboard

-   Project name and short description.
-   Create-plan action.
-   Existing plan summary, if persistence is enabled.
-   Quick explanation of the planning process.

#### B. Syllabus Setup

-   Subject dropdown.
-   Custom subject entry.
-   Chapter/topic table.
-   Add, edit, and remove topic controls.
-   CSV upload option.
-   Validation feedback.

#### C. Planning Inputs

-   Examination date picker.
-   Daily available study hours.
-   Familiarity selector for each topic.
-   Optional rest days and revision buffer.
-   Generate schedule action.

#### D. Study Plan Dashboard

-   Days remaining.
-   Estimated and available hours.
-   Complexity and priority table.
-   Day-wise schedule.
-   Gantt chart or timeline.
-   High-yield warning, where applicable.

#### E. Progress Tracker

-   Mark task complete or pending.
-   View completed and remaining topics.
-   View overall progress.
-   Regenerate the remaining schedule.

### 6.2 Input Interface

The system shall provide clear labels and sensible defaults. Input
controls shall include: - Dropdowns for subjects and familiarity. - Date
picker for examination date. - Numeric input for daily study hours and
topic attributes. - Editable table or form for topic details. - File
uploader for CSV input.

### 6.3 Output Interface

The system shall provide: - A readable daily schedule. - Topic-level
estimated hours and priority. - Visual timeline. - Progress summary. -
Downloadable CSV schedule.

### 6.4 Software Interfaces

  Software           Purpose
  ------------------ ----------------------------------------
  Python             Core application and planning logic
  Streamlit          Web-based user interface
  pandas             CSV/JSON tabular processing
  NumPy              Numerical calculations
  Plotly or Altair   Interactive charts
  Python datetime    Date and calendar calculations
  JSON / CSV         Dataset and optional local persistence

------------------------------------------------------------------------

## 7. Non-Functional Requirements

### 7.1 Performance

**NFR-01:** For a typical syllabus containing up to 200 topics, schedule
generation should normally complete within 3 seconds on a standard
student laptop, excluding unusually slow file operations.

**NFR-02:** Dashboard interactions should respond without unnecessary
full-page delays.

**NFR-03:** The application should avoid unnecessary large datasets and
heavy model dependencies.

### 7.2 Usability

**NFR-04:** A first-time user should be able to create a basic study
plan without technical assistance.

**NFR-05:** Error messages shall explain the problem and suggest
corrective action.

**NFR-06:** Complexity and priority scores shall be accompanied by brief
explanations.

**NFR-07:** Charts shall include readable labels, legends, and tooltips
where supported.

### 7.3 Reliability

**NFR-08:** The system shall validate input data before running
calculations.

**NFR-09:** Invalid or incomplete records shall not silently produce
misleading schedules.

**NFR-10:** The same valid inputs and configuration shall produce the
same schedule.

**NFR-11:** The application shall handle empty datasets, duplicate topic
IDs, and missing optional fields safely.

### 7.4 Maintainability

**NFR-12:** UI code, data handling, complexity calculations, and
scheduling logic should be separated into modules.

**NFR-13:** Weights, multipliers, and thresholds shall be stored as
configuration values rather than scattered throughout the codebase.

**NFR-14:** The subject dataset shall be editable without changing the
core scheduling algorithm.

**NFR-15:** Functions responsible for calculations shall be
independently testable.

### 7.5 Portability

**NFR-16:** The application shall run on supported Windows, Linux, and
macOS environments with the required Python packages installed.

**NFR-17:** The initial application shall not require GPU hardware.

### 7.6 Security and Privacy

**NFR-18:** The initial version shall not request unnecessary personal
information.

**NFR-19:** Uploaded CSV files shall be validated before processing.

**NFR-20:** The application shall not execute uploaded file contents as
code.

**NFR-21:** If plans are stored locally, the application shall explain
where the data is stored and how it can be reset.

**NFR-22:** If deployed online in a future version, authentication,
access control, secure storage, and transport security shall be reviewed
before storing personal student data.

### 7.7 Accessibility

**NFR-23:** Important information shall not be communicated by color
alone.

**NFR-24:** Labels and chart text shall use readable contrast and sizes.

**NFR-25:** Controls shall have clear labels and understandable
instructions.

------------------------------------------------------------------------

## 8. Error Handling and Validation

The application shall handle at least the following cases:

  -----------------------------------------------------------------------
  Condition                           Expected system response
  ----------------------------------- -----------------------------------
  Exam date is today or in the past   Show a validation error or request
                                      a valid future date

  Daily hours are zero or negative    Reject the value

  Daily hours exceed configured       Ask the student to confirm or
  maximum                             correct the value

  No topics entered                   Do not generate a schedule; request
                                      syllabus input

  Duplicate topic IDs                 Reject or safely regenerate unique
                                      IDs

  Missing required CSV column         Display the missing column names

  Invalid rating outside 1--5         Reject the affected record and
                                      explain the allowed range

  Negative page count or base hours   Reject the invalid value

  Missing optional importance         Apply a documented fallback and
                                      identify it

  Estimated hours exceed capacity     Activate High-Yield Mode and show a
                                      warning

  No usable study days remain         Explain that a valid schedule
                                      cannot be generated

  Corrupt JSON/CSV file               Show a readable import error
                                      without crashing

  Progress file unavailable           Continue safely where possible and
                                      explain that progress could not be
                                      loaded or saved
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 9. Suggested Project Structure

The project should use a modular structure similar to the following:

``` text
smart-study-planner/
|
|-- app.py
|-- requirements.txt
|-- README.md
|-- requirements.md
|
|-- data/
|   |-- subjects.json
|   |-- sample_syllabus.csv
|
|-- src/
|   |-- data_loader.py
|   |-- validators.py
|   |-- complexity_engine.py
|   |-- time_estimator.py
|   |-- priority_engine.py
|   |-- scheduler.py
|   |-- progress_tracker.py
|   |-- exporter.py
|
|-- components/
|   |-- sidebar.py
|   |-- syllabus_form.py
|   |-- dashboard.py
|   |-- charts.py
|
|-- storage/
|   |-- plans/
|
|-- tests/
    |-- test_validators.py
    |-- test_complexity_engine.py
    |-- test_time_estimator.py
    |-- test_scheduler.py
    |-- test_progress_tracker.py
```

This is a proposed organization. The final implementation may simplify
or adjust the structure while preserving separation of responsibilities.

------------------------------------------------------------------------

## 10. Testing Requirements

### 10.1 Unit Testing

The development team shall test: - Complexity score calculation. -
Familiarity multipliers. - Preparation-time estimation. - Priority score
calculation. - Available-day calculation. - Daily workload allocation. -
High-Yield Mode activation. - Prerequisite handling. - Progress
percentage calculation. - CSV validation and export.

### 10.2 Integration Testing

The team shall verify: 1. Subject selection loads the correct topics. 2.
CSV upload creates valid topic records. 3. Student inputs reach the
planning engine correctly. 4. The planning engine returns a valid
schedule. 5. The dashboard displays the generated schedule. 6. Progress
updates are reflected in the dashboard. 7. Exported CSV contains the
expected schedule fields.

### 10.3 System Testing

The complete application shall be tested using: - A small syllabus with
a few topics. - A large syllabus with many topics. - A short preparation
period. - A long preparation period. - Topics with different familiarity
levels. - Missing and invalid data. - A case where all topics fit within
available time. - A case where High-Yield Mode is required.

### 10.4 User Acceptance Testing

A student tester should be able to: 1. Open the application. 2. Select a
subject. 3. review or edit its topics. 4. Enter an examination date. 5.
Enter daily available study hours. 6. Set familiarity levels. 7.
Generate a schedule. 8. Understand topic priorities and estimated hours.
9. Mark a topic as completed. 10. Download the study plan.

The application is acceptable when these tasks can be completed without
developer intervention and the resulting schedule follows the validation
and capacity rules.

------------------------------------------------------------------------

## 11. Acceptance Criteria

The project shall be considered ready for demonstration when:

-   [ ] The application starts successfully using the documented run
    command.
-   [ ] At least one predefined subject and its topics are available.
-   [ ] A student can add a custom topic or import a valid CSV.
-   [ ] Invalid input is rejected with a useful message.
-   [ ] Every valid topic receives a complexity score.
-   [ ] Familiarity changes the estimated preparation time.
-   [ ] The system calculates days and hours available before the exam.
-   [ ] A day-wise schedule is generated.
-   [ ] Daily allocations do not exceed configured capacity.
-   [ ] High-Yield Mode activates when the total estimated effort
    exceeds available time.
-   [ ] Unscheduled or shortened topics are clearly identified.
-   [ ] The timeline or Gantt chart displays the schedule.
-   [ ] The student can mark tasks as completed.
-   [ ] Progress is reflected in the dashboard.
-   [ ] The schedule can be downloaded as a CSV file.
-   [ ] The application handles invalid files and empty inputs without
    crashing.
-   [ ] The project documentation explains the algorithm and its
    assumptions.

------------------------------------------------------------------------

## 12. Constraints and Limitations

1.  Topic complexity is estimated from manually assigned attributes and
    is not an objective measurement of a student's ability.
2.  Familiarity is self-reported and may be inaccurate.
3.  Historical difficulty ratings may be approximate unless supported by
    reliable student-performance data.
4.  Preparation-time estimates are guidance values and may differ from
    actual study time.
5.  The initial version uses a rule-based model. It should not be
    described as a trained machine-learning model unless training data,
    model evaluation, and a genuine training process are implemented.
6.  High-Yield Mode helps prioritize limited time but cannot guarantee
    complete syllabus coverage or examination success.
7.  Automatic syllabus extraction and external syllabus synchronization
    are not part of the initial release.
8.  The quality of the schedule depends on the quality of the supplied
    topic data and student inputs.

------------------------------------------------------------------------

## 13. Future Enhancements

Possible future versions may include:

-   PDF syllabus parsing and topic extraction.
-   Natural-language processing to identify chapters and subtopics.
-   A trained regression model using collected, consented study-time
    data.
-   Personalized estimates learned from a student's completed study
    sessions.
-   Spaced-repetition revision scheduling.
-   Practice-question and mock-test planning.
-   Calendar export and reminders.
-   Multiple examination plans.
-   Cloud synchronization and secure user accounts.
-   Mobile-friendly progressive web application.
-   Weekly performance reports.
-   Automatic rescheduling after missed study sessions.
-   Optional integration with educational platforms.

Any machine-learning enhancement should be evaluated using appropriate
training/test separation and error metrics, and should be compared with
the simpler rule-based baseline.

------------------------------------------------------------------------

## 14. Deployment and Execution Requirements

### 14.1 Installation

The developer shall provide a `requirements.txt` file listing compatible
versions of the required packages. A typical environment will include:

-   streamlit
-   pandas
-   numpy
-   plotly (or altair)
-   pytest (for testing)

### 14.2 Run Command

From the project root directory, the user should be able to start the
application with:

``` bash
streamlit run app.py
```

### 14.3 Deployment Notes

The initial release may run locally. If hosted, the deployment
environment must support the selected Python version and dependencies.
Persistent storage must be configured if user plans are expected to
survive application restarts on the hosting platform.

------------------------------------------------------------------------

## 15. Project Deliverables

The project submission should contain:

1.  `requirements.md` --- this Software Requirements Specification.
2.  `README.md` --- project overview, setup, and execution instructions.
3.  `requirements.txt` --- Python dependencies.
4.  Python source files for the Streamlit application and planning
    engine.
5.  JSON or CSV subject and syllabus dataset.
6.  Test files and sample test data.
7.  Screenshots of the dashboard, generated schedule, and progress
    tracker.
8.  A short project report describing the problem, architecture,
    algorithm, testing, limitations, and future scope.
9.  A demonstration dataset suitable for the project evaluation.

------------------------------------------------------------------------

## 16. Conclusion

The AI-Powered Smart Study Planner & Syllabus Breakdown Tool is a
practical academic project that applies data processing, rule-based
analytics, scheduling algorithms, and interactive visualization to a
common student problem. It transforms syllabus information and personal
study availability into an understandable study plan.

The first version should focus on correctness, transparency, usability,
and reliable schedule generation. A clear rule-based engine provides a
manageable and explainable foundation for a 5th-semester project. More
advanced machine-learning and syllabus-extraction features can be
introduced after the core application has been tested successfully.
