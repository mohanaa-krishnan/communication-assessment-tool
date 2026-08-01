import os
import json
from google import genai
from app.schemas.ai_report import AIReportRequest, AIReportResponse

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def build_prompt(data: AIReportRequest) -> str:
    """
    Builds the prompt sent to Gemini. Explicitly instructs the model to:
    - draft only, never diagnose
    - never state certainty beyond what the structured scores support
    - return strict JSON with three fields so the app can parse it reliably
    """
    behaviour_lines = "\n".join(
        f"- {b.behaviour_name}: {b.status} (therapist notes: {b.therapist_notes or 'none provided'})"
        for b in data.behaviours
    )

    prompt = f"""
You are assisting a licensed Speech-Language Pathologist (SLP) by drafting
a communication assessment summary. This is a DRAFT ONLY. The SLP will
review, edit, and approve it before it is used with any patient or family.

STRICT RULES (follow exactly):
- Do NOT provide a diagnosis or diagnostic label of any kind (e.g. do not
  mention autism, ASD, speech delay, or any clinical condition by name).
- Do NOT state certainty beyond what the "Present"/"Absent" behaviour data
  supports. Use hedged, observational language (e.g. "observations suggest",
  "may benefit from", "consider further evaluation of").
- Do NOT recommend specific therapies, medications, or treatment plans —
  only general next-step suggestions for the SLP to consider.
- Every sentence must be grounded in the behaviour data given below; do not
  invent behaviours or notes that were not provided.

Patient Name: {data.patient_name}
Age: {data.age}
Assessment Date: {data.assessment_date}

Behaviour Observations (10 standardized behaviours, each marked Present or Absent):
{behaviour_lines}

Respond with STRICT JSON ONLY — no markdown, no code fences, no preamble —
in exactly this shape:

{{
  "clinical_impression": "2-4 sentence neutral, observational summary of the pattern of Present/Absent behaviours seen in this session. No diagnosis.",
  "recommendations": "2-4 sentence list of general next steps for the SLP to consider (e.g. areas to monitor, follow-up activities, further observation) — not a treatment plan.",
  "parent_summary": "2-3 sentence plain-language summary suitable for sharing with a parent/caregiver, avoiding clinical jargon and any diagnostic language."
}}
"""
    return prompt.strip()


def generate_mock_report(data: AIReportRequest) -> dict:
    """
    Returns placeholder draft fields so the frontend can integrate
    before a real GEMINI_API_KEY is available.
    """
    present = [b.behaviour_name for b in data.behaviours if b.status == "Present"]
    absent = [b.behaviour_name for b in data.behaviours if b.status == "Absent"]

    return {
        "clinical_impression": (
            f"[MOCK] During this session, {len(present)} of 10 standardized behaviours were "
            f"observed as Present and {len(absent)} as Absent. This is a placeholder impression "
            f"pending real Gemini integration."
        ),
        "recommendations": (
            "[MOCK] Consider continued observation of the behaviours marked Absent in future "
            "sessions. This is a placeholder recommendation pending real Gemini integration."
        ),
        "parent_summary": (
            "[MOCK] Your child's SLP observed several communication behaviours during this "
            "session. This is a placeholder summary pending real Gemini integration."
        ),
    }


def call_gemini(prompt: str) -> dict:
    """
    Calls the real Gemini API and parses the strict-JSON response into
    the three expected fields. Falls back to a safe error-shaped dict
    if parsing fails, so the API never crashes on a malformed response.
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )
    raw_text = response.text.strip()

    # Defensive cleanup in case Gemini wraps the JSON in code fences anyway
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.lower().startswith("json"):
            raw_text = raw_text[4:].strip()

    try:
        parsed = json.loads(raw_text)
        return {
            "clinical_impression": parsed.get("clinical_impression", ""),
            "recommendations": parsed.get("recommendations", ""),
            "parent_summary": parsed.get("parent_summary", ""),
        }
    except json.JSONDecodeError:
        # If Gemini didn't return valid JSON, surface something safe
        # rather than crashing the endpoint.
        return {
            "clinical_impression": "AI response could not be parsed. Please review manually.",
            "recommendations": "AI response could not be parsed. Please review manually.",
            "parent_summary": "AI response could not be parsed. Please review manually.",
        }


def generate_ai_report(data: AIReportRequest) -> AIReportResponse:
    if not GEMINI_API_KEY:
        fields = generate_mock_report(data)
    else:
        prompt = build_prompt(data)
        fields = call_gemini(prompt)

    return AIReportResponse(
        patient_name=data.patient_name,
        clinical_impression=fields["clinical_impression"],
        recommendations=fields["recommendations"],
        parent_summary=fields["parent_summary"],
    )