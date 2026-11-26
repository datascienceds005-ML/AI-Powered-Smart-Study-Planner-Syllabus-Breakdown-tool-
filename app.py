import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta

# Page Configuration
st.set_page_config(
    page_title="AI Smart Study Planner",
    page_icon="📚",
    layout="wide"
)

# Custom CSS for clean UI
st.markdown("""
    <style>
    .main-header {font-size: 2.2rem; font-weight: 700; color: #1E3A8A;}
    .sub-header {font-size: 1rem; color: #64748B; margin-bottom: 1.5rem;}
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">📚 AI-Powered Smart Study Planner & Syllabus Breakdown</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Automated Complexity Scoring, Adaptive Scheduling & High-Yield Exam Prep</div>', unsafe_allow_html=True)

# Initialize Session State with Default Sample Data
if "topics" not in st.session_state:
    st.session_state.topics = [
        {"Topic": "Linear Algebra & Matrices", "Chapter": "Module 1", "Math": 8, "Concept": 7, "Difficulty": 8, "Importance": 9, "Familiarity": "New", "Completed": False},
        {"Topic": "Probability Distributions", "Chapter": "Module 2", "Math": 9, "Concept": 8, "Difficulty": 9, "Importance": 10, "Familiarity": "New", "Completed": False},
        {"Topic": "Gradient Descent Optimization", "Chapter": "Module 3", "Math": 7, "Concept": 8, "Difficulty": 7, "Importance": 9, "Familiarity": "Somewhat", "Completed": False},
        {"Topic": "SQL & Relational Algebra", "Chapter": "Module 4", "Math": 4, "Concept": 5, "Difficulty": 4, "Importance": 7, "Familiarity": "Revised", "Completed": False},
        {"Topic": "Data Preprocessing & EDA", "Chapter": "Module 5", "Math": 5, "Concept": 6, "Difficulty": 5, "Importance": 8, "Familiarity": "Confident", "Completed": True},
    ]

# Helper Functions
FAMILIARITY_MULTIPLIERS = {
    "New": 1.50,
    "Somewhat": 1.15,
    "Revised": 0.85,
    "Confident": 0.60
}

def calculate_metrics(df):
    # Complexity Score = 35% Math + 40% Concept + 25% Difficulty
    df["Complexity"] = (0.35 * df["Math"] + 0.40 * df["Concept"] + 0.25 * df["Difficulty"]).round(1)
    
    # Base Hours based on Complexity
    def get_base_hours(comp):
        if comp >= 7.0:
            return 6.0
        elif comp >= 4.0:
            return 4.0
        return 2.5

    df["Base_Hours"] = df["Complexity"].apply(get_base_hours)
    df["Multiplier"] = df["Familiarity"].map(FAMILIARITY_MULTIPLIERS)
    df["Est_Hours"] = (df["Base_Hours"] * df["Multiplier"]).round(1)
    
    # Priority Score = Importance (60%) + Complexity (40%)
    df["Priority_Score"] = (0.6 * df["Importance"] + 0.4 * df["Complexity"]).round(1)
    return df

# Sidebar: Study Constraints
with st.sidebar:
    st.header("⚙️ Study Constraints")
    exam_date = st.date_input("Target Exam Date", datetime.today() + timedelta(days=14))
    daily_hours = st.slider("Daily Study Hours", min_value=1, max_value=14, value=4)
    
    days_remaining = max((exam_date - datetime.today().date()).days, 1)
    total_available_hours = days_remaining * daily_hours
    
    st.divider()
    st.metric("Days Remaining", f"{days_remaining} Days")
    st.metric("Total Available Capacity", f"{total_available_hours} hrs")

# Convert current topics to DataFrame and compute metrics
df_topics = pd.DataFrame(st.session_state.topics)
if not df_topics.empty:
    df_topics = calculate_metrics(df_topics)
    total_req_hours = df_topics["Est_Hours"].sum()
    remaining_req_hours = df_topics[~df_topics["Completed"]]["Est_Hours"].sum()
else:
    total_req_hours = 0
    remaining_req_hours = 0

# High-Yield Mode Banner
if remaining_req_hours > total_available_hours:
    st.error(f"🚨 **High-Yield Mode Activated!** Remaining workload ({remaining_req_hours:.1f} hrs) exceeds your available capacity ({total_available_hours} hrs). Prioritizing high-importance topics automatically.")

# Main Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "📝 1. Syllabus & Complexity", 
    "📅 2. Smart Timetable", 
    "📊 3. Analytics & Gantt", 
    "✅ 4. Progress & Export"
])

# TAB 1: Syllabus Input & Complexity Matrix
with tab1:
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("Add New Topic")
        with st.form("add_topic_form", clear_on_submit=True):
            t_name = st.text_input("Topic Name", placeholder="e.g., Neural Networks")
            t_chap = st.text_input("Module / Chapter", placeholder="e.g., Module 6")
            t_math = st.slider("Math Density (1-10)", 1, 10, 6)
            t_conc = st.slider("Conceptual Depth (1-10)", 1, 10, 6)
            t_diff = st.slider("Historical Difficulty (1-10)", 1, 10, 6)
            t_imp = st.slider("Exam Importance (1-10)", 1, 10, 8)
            t_fam = st.selectbox("Current Familiarity", list(FAMILIARITY_MULTIPLIERS.keys()))
            
            submitted = st.form_submit_button("➕ Add to Syllabus", use_container_width=True)
            if submitted and t_name:
                st.session_state.topics.append({
                    "Topic": t_name,
                    "Chapter": t_chap if t_chap else "General",
                    "Math": t_math,
                    "Concept": t_conc,
                    "Difficulty": t_diff,
                    "Importance": t_imp,
                    "Familiarity": t_fam,
                    "Completed": False
                })
                st.rerun()

    with col2:
        st.subheader("Syllabus Complexity Breakdown")
        if not df_topics.empty:
            display_cols = ["Topic", "Chapter", "Complexity", "Importance", "Familiarity", "Est_Hours", "Priority_Score"]
            st.dataframe(
                df_topics[display_cols].sort_values(by="Priority_Score", ascending=False),
                use_container_width=True,
                hide_index=True
            )
            
            # Option to delete a topic
            topic_to_delete = st.selectbox("Select topic to remove:", ["None"] + df_topics["Topic"].tolist())
            if topic_to_delete != "None" and st.button("🗑️ Remove Selected Topic"):
                st.session_state.topics = [t for t in st.session_state.topics if t["Topic"] != topic_to_delete]
                st.rerun()

# TAB 2: Smart Greedy Scheduler
with tab2:
    st.subheader("Day-by-Day Adaptive Study Schedule")
    
    pending_df = df_topics[~df_topics["Completed"]].sort_values(by="Priority_Score", ascending=False).copy()
    
    if pending_df.empty:
        st.success("🎉 All topics are completed! Great job!")
    else:
        schedule_rows = []
        current_day = 1
        current_date = datetime.today().date()
        hours_left_today = float(daily_hours)
        
        for _, row in pending_df.iterrows():
            topic_hours_needed = float(row["Est_Hours"])
            
            while topic_hours_needed > 0 and current_day <= days_remaining:
                allocated = min(topic_hours_needed, hours_left_today)
                schedule_rows.append({
                    "Day": f"Day {current_day}",
                    "Date": current_date.strftime("%Y-%m-%d"),
                    "Topic": row["Topic"],
                    "Chapter": row["Chapter"],
                    "Allocated_Hours": round(allocated, 1),
                    "Priority": "High" if row["Priority_Score"] >= 8 else ("Medium" if row["Priority_Score"] >= 6 else "Normal")
                })
                
                topic_hours_needed = round(topic_hours_needed - allocated, 1)
                hours_left_today = round(hours_left_today - allocated, 1)
                
                if hours_left_today <= 0:
                    current_day += 1
                    current_date += timedelta(days=1)
                    hours_left_today = float(daily_hours)
        
        schedule_df = pd.DataFrame(schedule_rows)
        st.dataframe(schedule_df, use_container_width=True, hide_index=True)

# TAB 3: Analytics & Timeline
with tab3:
    st.subheader("Workload & Priority Visualization")
    if not df_topics.empty:
        col_a, col_b = st.columns(2)
        
        with col_a:
            fig_bar = px.bar(
                df_topics, 
                x="Topic", 
                y="Est_Hours", 
                color="Complexity",
                title="Estimated Study Hours per Topic",
                color_continuous_scale="Blues"
            )
            st.plotly_chart(fig_bar, use_container_width=True)
            
        with col_b:
            fig_scatter = px.scatter(
                df_topics,
                x="Complexity",
                y="Importance",
                size="Est_Hours",
                color="Familiarity",
                hover_name="Topic",
                title="Priority Matrix (Complexity vs. Exam Importance)"
            )
            st.plotly_chart(fig_scatter, use_container_width=True)

# TAB 4: Progress Tracker & CSV Export
with tab4:
    st.subheader("Track Completion & Export Plan")
    
    completed_hours = df_topics[df_topics["Completed"]]["Est_Hours"].sum() if not df_topics.empty else 0
    progress_pct = int((completed_hours / total_req_hours) * 100) if total_req_hours > 0 else 0
    
    st.progress(progress_pct / 100, text=f"Overall Syllabus Completion: {progress_pct}% ({completed_hours:.1f} / {total_req_hours:.1f} hrs)")
    
    st.write("### Mark Topics as Completed:")
    for idx, t in enumerate(st.session_state.topics):
        checked = st.checkbox(f"{t['Topic']} ({t['Chapter']})", value=t["Completed"], key=f"chk_{idx}")
        if checked != t["Completed"]:
            st.session_state.topics[idx]["Completed"] = checked
            st.rerun()
            
    st.divider()
    if 'schedule_df' in locals() and not schedule_df.empty:
        csv = schedule_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📥 Download Timetable as CSV",
            data=csv,
            file_name="smart_study_timetable.csv",
            mime="text/csv",
            use_container_width=True
        )
