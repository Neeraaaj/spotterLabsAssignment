from datetime import datetime, timedelta

def split_into_days(segments):
    """
    Takes segments with 'start_dt'/'end_dt' ISO strings and splits any
    segment that crosses midnight into two pieces, then groups everything
    by calendar date.

    Returns: { "2026-09-23": [ {status, note, start_dt, end_dt}, ... ], ... }
    """
    days = {}

    for seg in segments:
        print(f"Processing segment: {seg}")
        start = datetime.fromisoformat(seg["start_dt"])
        end = datetime.fromisoformat(seg["end_dt"])

        cursor = start
        while cursor < end:
            # Midnight that starts the *next* day after cursor
            next_midnight = (cursor + timedelta(days=1)).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            piece_end = min(end, next_midnight)

            day_key = cursor.date().isoformat()
            days.setdefault(day_key, []).append({
                "status": seg["status"],
                "note": seg["note"],
                "start_dt": cursor.isoformat(),
                "end_dt": piece_end.isoformat(),
            })

            cursor = piece_end

    return days