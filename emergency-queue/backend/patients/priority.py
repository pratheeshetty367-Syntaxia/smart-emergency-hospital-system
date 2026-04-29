def calculate_priority_score(vitals):
    """
    Takes a dictionary of patient vitals.
    Returns a score from 0 to 100.
    Higher score = more urgent = seen first.
    """
    score = 0

    hr = vitals.get('heart_rate', 80)
    sbp = vitals.get('systolic_bp', 120)
    spo2 = vitals.get('spo2', 98)
    temp = vitals.get('temperature', 37.0)
    rr = vitals.get('respiratory_rate', 16)
    gcs = vitals.get('gcs_score', 15)

    # --- SpO2 (Oxygen Saturation) ---
    # Normal is 95-100%. Below 90% is dangerous.
    if spo2 < 85:
        score += 40   # Critical — not breathing properly
    elif spo2 < 90:
        score += 30
    elif spo2 < 94:
        score += 15

    # --- Heart Rate ---
    # Normal is 60-100 bpm
    if hr < 40 or hr > 150:
        score += 35   # Dangerously fast or slow
    elif hr < 50 or hr > 130:
        score += 20
    elif hr < 60 or hr > 110:
        score += 8

    # --- Systolic Blood Pressure ---
    # Normal is 90-120 mmHg
    if sbp < 70 or sbp > 200:
        score += 35
    elif sbp < 80 or sbp > 180:
        score += 22
    elif sbp < 90 or sbp > 160:
        score += 10

    # --- Temperature ---
    # Normal is 36.5–37.5°C
    if temp > 40 or temp < 35:
        score += 20
    elif temp > 39 or temp < 35.5:
        score += 10
    elif temp > 38.5:
        score += 5

    # --- Respiratory Rate ---
    # Normal is 12-20 breaths per minute
    if rr < 8 or rr > 30:
        score += 25
    elif rr < 10 or rr > 25:
        score += 12
    elif rr < 12 or rr > 20:
        score += 5

    # --- Glasgow Coma Scale (consciousness level) ---
    # 15 = fully conscious, 3 = completely unresponsive
    if gcs <= 8:
        score += 30
    elif gcs <= 12:
        score += 15
    elif gcs < 15:
        score += 5

    # Cap at 100
    return min(score, 100)


def score_to_priority_level(score):
    """Converts numeric score to text label."""
    if score >= 60:
        return 'critical'
    elif score >= 35:
        return 'high'
    elif score >= 15:
        return 'medium'
    else:
        return 'low'