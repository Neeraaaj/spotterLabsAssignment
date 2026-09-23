from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta
from .log_days import split_into_days
from . import services
from .hos_engine import run_trip

@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})


@api_view(['POST'])
def plan_trip(request):
    data = request.data
    field_map = {
        'currentLocation': 'current',
        'pickupLocation': 'pickup',
        'dropoffLocation': 'dropoff',
    }
    geocoded = {}
    try:
        for field, key in field_map.items():
            lng, lat, label = services.geocode(data[field])
            geocoded[key] = {"lng": lng, "lat": lat, "label": label}
    except ValueError as e:
        return Response({"error": str(e), "field": field}, status=400)

    try:
        leg1 = services.get_route([
            [geocoded['current']['lng'], geocoded['current']['lat']],
            [geocoded['pickup']['lng'], geocoded['pickup']['lat']],
        ])
        leg2 = services.get_route([
            [geocoded['pickup']['lng'], geocoded['pickup']['lat']],
            [geocoded['dropoff']['lng'], geocoded['dropoff']['lat']],
        ])
    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    cycle_hours_used = float(data.get('cycleHoursUsed', 0))

    # Convert seconds/meters -> hours/miles for the HOS engine
    leg1_hours = leg1['duration_s'] / 3600
    leg2_hours = leg2['duration_s'] / 3600
    leg1_miles = leg1['distance_m'] / 1609.34
    leg2_miles = leg2['distance_m'] / 1609.34

    hos_state = run_trip(
        leg1_hours=leg1_hours,
        leg2_hours=leg2_hours,
        cycle_hours_used=cycle_hours_used,
        miles_leg1=leg1_miles,
        miles_leg2=leg2_miles,
    )

    trip_start_str = data.get('tripStartTime')
    if trip_start_str:
        trip_start = datetime.fromisoformat(trip_start_str)
    else:
        trip_start = datetime.now()

    segments = [
        {
            "status": seg.status,
            "start_hr": round(seg.start_hr, 2),
            "end_hr": round(seg.end_hr, 2),
            "note": seg.note,
            "start_dt": (trip_start + timedelta(hours=seg.start_hr)).isoformat(),
            "end_dt": (trip_start + timedelta(hours=seg.end_hr)).isoformat(),
        }
        for seg in hos_state.segments
    ]

    days = split_into_days(segments)

    return Response({
        **geocoded,
        "leg1": leg1,
        "leg2": leg2,
        "cycle_hours_used": cycle_hours_used,
        "segments": segments,
        "days": days,
        "total_trip_hours": round(hos_state.clock, 2),
    })