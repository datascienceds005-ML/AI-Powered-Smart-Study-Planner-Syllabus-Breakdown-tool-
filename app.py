import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import re
import io

# Document & Image Parsers
from pypdf import PdfReader
from docx import Document
from pptx import Presentation
from PIL import Image
import pytesseract

# Page Configuration
st.set_page_config(
    page_title="AI Smart Study Planner",
    page_icon="📚",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {font-size: 2.2rem; font-weight: 700; color: #1E3A8A;}
    .sub-header {font-size: 1rem; color: #64748B; margin-bottom: 1.5rem;}
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">📚 AI-Powered Smart Study Planner & Syllabus Breakdown</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Upload PDF, Word, PPT, Text, or Screenshots — Automatic Parsing & Adaptive Scheduling</div>', unsafe_allow_html=True)

# Initialize Session State
if "topics" not in st.session_state:
    st.session_state.topics = [
        {"Topic": "Linear Algebra & Matrices", "Chapter": "Module 1", "Math": 8, "Concept": 7, "Difficulty": 8, "Importance": 9, "Familiarity": "New", "Completed": False},
        {"Topic": "Probability Distributions", "Chapter": "Module 2", "Math": 9, "Concept": 8, "Difficulty": 9, "Importance": 10, "Familiarity": "New", "Completed": False},
        {"Topic": "Gradient Descent Optimization", "Chapter": "Module 3", "Math": 7, "Concept": 8, "Difficulty": 7, "Importance": 9, "Familiarity": "Somewhat", "Completed": False},
        {"Topic": "SQL & Relational Algebra", "Chapter": "Module 4", "Math": 4, "Concept": 5, "Difficulty": 4, "Importance": 7, "Familiarity": "Revised", "Completed": False},
        {"Topic": "Data Preprocessing & EDA", "Chapter": "Module 5", "Math": 5, "Concept": 6, "Difficulty": 5, "Importance": 8, "Familiarity": "Confident", "Completed": True},
    ]

FAMILIARITY_MULTIPLIERS = {
    "New": 1.50,
    "Somewhat": 1.15,
    "Revised": 0.85,
    "Confident": 0.60
}

# --- FILE & IMAGE EXTRACTION FUNCTIONS ---
def extract_text_from_file(uploaded_file):
    file_name = uploaded_file.name.lower()
    text = ""
    try:
        if file_name.endswith(".txt"):
            text = uploaded_file.read().decode("utf-8", errors="ignore")
        
        elif file_name.endswith(".pdf"):
            reader = PdfReader(uploaded_file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        
        elif file_name.endswith(".docx"):
            doc = Document(uploaded_file)
            text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        
        elif file_name.endswith(".pptx"):
            prs = Presentation(uploaded_file)
            slides_text = []
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text") and shape.text.strip():
                        slides_text.append(shape.text)
            text = "\n".join(slides_text)
        
        elif file_name.endswith((".png", ".jpg", ".jpeg", ".webp")):
            image = Image.open(uploaded_file)
            text = pytesseract.image_to_string(image)
            
    except Exception as e:
        st.error(f"Error reading file: {e}")
    return text

def auto_estimate_scores(topic_text):
    """Heuristic AI scoring based on academic keywords"""
    t_lower = topic_text.lower()
    math_kw = ["math", "calculus", "matrix", "algebra", "probability", "statistics", "equation", "numerical", "complexity", "cocomo", "estimation", "metrics"]
    concept_kw = ["architecture", "design", "model", "sdlc", "agile", "paradigm", "framework", "theory", "analysis", "system", "engineering", "uml"]
    diff_kw = ["optimization", "testing", "verification", "validation", "security", "concurrency", "distributed", "compiler", "algorithm", "risk"]

    math_score = 8 if any(k in t_lower for k in math_kw) else 4
    concept_score = 8 if any(k in t_lower for k in concept_kw) else 6
    diff_score = 8 if any(k in t_lower for k in diff_kw) else 5
    imp_score = 8
    return math_score, concept_score, diff_score, imp_score

def parse_syllabus_text(raw_text):
    """Extracts Modules/Units and Topics from unstructured syllabus text"""
    lines = [line.strip() for line in raw_text.split("\n") if len(line.strip()) > 3]
    current_module = "Module 1"
    parsed_items = []

    module_pattern = re.compile(r"^(module|unit|chapter|part)\s*[-:]?\s*(\d+|[ivx]+)", re.IGNORECASE)

    for line in lines:
        # Check if line is a Module/Unit header
        match = module_pattern.match(line)
        if match:
            current_module = line[:40].strip(" :-")
            # If the module header also has topics after a colon, extract them
            if ":" in line:
                after_colon = line.split(":", 1)[1].strip()
                if len(after_colon) > 4:
                    sub_topics = [s.strip() for s in re.split(r"[,;•]", after_colon) if len(s.strip()) > 3]
                    for st_item in sub_topics:
                        m, c, d, imp = auto_estimate_scores(st_item)
                        parsed_items.append({
                            "Topic": st_item[:80], "Chapter": current_module,
                            "Math": m, "Concept": c, "Difficulty": d, "Importance": imp,
                            "Familiarity": "New", "Completed": False
                        })
            continue

        # Split comma or bullet-separated syllabus lines into individual topics
        sub_parts = [p.strip(" -•*▪➢") for p in re.split(r"[;•]|\s-\s", line) if len(p.strip(" -•*▪➢")) > 4]
        for part in sub_parts:
            # Skip generic syllabus noise like "Hours: 8" or "Credits: 4"
            if re.match(r"^(hours|lectures|credits|total|course|syllabus)\b", part, re.IGNORECASE):
                continue
            m, c, d, imp = auto_estimate_scores(part)
            parsed_items.append({
                "Topic": part[:85],
                "Chapter": current_module,
                "Math": m,
                "Concept": c,
                "Difficulty": d,
                "Importance": imp,
                "Familiarity": "New",
                "Completed": False
            })
    return parsed_items

# --- METRICS CALCULATION ---
def calculate_metrics(df):
    df["Complexity"] = (0.35 * df["Math"] + 0.40 * df["Concept"] + 0.25 * df["Difficulty"]).round(1)
    
    def get_base_hours(comp):
        if comp >= 7.0:
            return 6.0
        elif comp >= 4.0:
            return 4.0
        return 2.5

    df["Base_Hours"] = df["Complexity"].apply(get_base_hours)
    df["Multiplier"] = df["Familiarity"].map(FAMILIARITY_MULTIPLIERS)
    df["Est_Hours"] = (df["Base_Hours"] * df["Multiplier"]).round(1)
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

df_topics = pd.DataFrame(st.session_state.topics)
if not df_topics.empty:
    df_topics = calculate_metrics(df_topics)
    total_req_hours = df_topics["Est_Hours"].sum()
    remaining_req_hours = df_topics[~df_topics["Completed"]]["Est_Hours"].sum()
else:
    total_req_hours = 0
    remaining_req_hours = 0

if remaining_req_hours > total_available_hours:
    st.error(f"🚨 **High-Yield Mode Activated!** Remaining workload ({remaining_req_hours:.1f} hrs) exceeds your available capacity ({total_available_hours} hrs). Prioritizing high-importance topics automatically.")

# Main Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "📝 1. Syllabus & Upload", 
    "📅 2. Smart Timetable", 
    "📊 3. Analytics & Gantt", 
    "✅ 4. Progress & Export"
])

# TAB 1: Upload, Paste, Manual Input & Complexity Breakdown
with tab1:
    # --- NEW: Smart File/Image/Text Importer ---
    with st.expander("📂 Auto-Import Syllabus (Upload PDF, Word, PPT, TXT, Screenshot or Paste Text)", expanded=True):
        up_col1, up_col2 = st.columns(2)
        
        with up_col1:
            uploaded_file = st.file_uploader(
                "Upload Syllabus File or Screenshot",
                type=["txt", "pdf", "docx", "pptx", "png", "jpg", "jpeg"]
            )
        with up_col2:
            pasted_text = st.text_area(
                "Or Paste Your 5-Module Syllabus Directly Here:",
                height=115,
                placeholder="Module 1: Introduction to Software Engineering, SDLC Models, Agile\nModule 2: Requirements Engineering, SRS, DFD..."
            )
            
        imp_btn_col1, imp_btn_col2 = st.columns([1, 1])
        replace_existing = imp_btn_col1.checkbox("Replace existing sample topics", value=True)
        
        if imp_btn_col2.button("🚀 Extract & Generate Syllabus Plan", type="primary", use_container_width=True):
            extracted_raw = ""
            if uploaded_file is not None:
                with st.spinner("Extracting text from file/image..."):
                    extracted_raw = extract_text_from_file(uploaded_file)
            elif pasted_text.strip():
                extracted_raw = pasted_text.strip()
            
            if extracted_raw:
                new_topics = parse_syllabus_text(extracted_raw)
                if new_topics:
                    if replace_existing:
                        st.session_state.topics = new_topics
                    else:
                        st.session_state.topics.extend(new_topics)
                    st.success(f"✅ Successfully extracted {len(new_topics)} topics across modules!")
                    st.rerun()
                else:
                    st.warning("Could not detect clear topics. Try pasting cleaner lines or check image clarity.")
            else:
                st.warning("Please upload a file/screenshot or paste syllabus text first.")

    st.divider()

    col1, col2 = st.columns([1, 2])
    with col1:
        st.subheader("Add Single Topic Manually")
        with st.form("add_topic_form", clear_on_submit=True):
            t_name = st.text_input("Topic Name", placeholder="e.g., COCOMO Model")
            t_chap = st.text_input("Module / Chapter", placeholder="e.g., Module 3")
            t_math = st.slider("Math Density (1-10)", 1, 10, 6)
            t_conc = st.slider("Conceptual Depth (1-10)", 1, 10, 6)
            t_diff = st.slider("Historical Difficulty (1-10)", 1, 10, 6)
            t_imp = st.slider("Exam Importance (1-10)", 1, 10, 8)
            t_fam = st.selectbox("Current Familiarity", list(FAMILIARITY_MULTIPLIERS.keys()))
            
            submitted = st.form_submit_button("➕ Add Topic", use_container_width=True)
            if submitted and t_name:
                st.session_state.topics.append({
                    "Topic": t_name, "Chapter": t_chap if t_chap else "General",
                    "Math": t_math, "Concept": t_conc, "Difficulty": t_diff,
                    "Importance": t_imp, "Familiarity": t_fam, "Completed": False
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
            
            del_col1, del_col2 = st.columns([3, 1])
            topic_to_delete = del_col1.selectbox("Select topic to remove:", ["None"] + df_topics["Topic"].tolist())
            if del_col2.button("🗑️ Remove", use_container_width=True) and topic_to_delete != "None":
                st.session_state.topics = [t for t in st.session_state.topics if t["Topic"] != topic_to_delete]
                st.rerun()

# TAB 2: Smart Greedy Scheduler
with tab2:
    st.subheader("Day-by-Day Adaptive Study Schedule")
    pending_df = df_topics[~df_topics["Completed"]].sort_values(by="Priority_Score", ascending=False).copy() if not df_topics.empty else pd.DataFrame()
    
    if pending_df.empty:
        st.success("🎉 All topics are completed or syllabus is empty!")
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
                df_topics, x="Topic", y="Est_Hours", color="Complexity",
                title="Estimated Study Hours per Topic", color_continuous_scale="Blues"
            )
            st.plotly_chart(fig_bar, use_container_width=True)
        with col_b:
            fig_scatter = px.scatter(
                df_topics, x="Complexity", y="Importance", size="Est_Hours",
                color="Familiarity", hover_name="Topic",
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
