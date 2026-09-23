from dataclasses import dataclass, field

@dataclass
class DutySegment:
    status: str       # off , on, driving, sleeping, parked
    start_hr: float    # hours from trip start
    end_hr: float
    note: str = ""
    weekly_at_end: float = 0.0   # snapshot for debugging/display

    @property
    def duration(self):
        return self.end_hr - self.start_hr


class HOSState:
    def __init__(self, cycle_hours_used=0.0):
        self.clock = 0.0              # total elapsed hours since trip start
        self.drive_since_break = 0.0  # resets on 30-min break
        self.drive_today = 0.0        # resets on 10-hr off duty
        self.on_duty_window_start = 0.0  # when the current 14-hr window began
        self.weekly_on_duty = cycle_hours_used
        self.segments = []

    def add_segment(self, status, duration, note=""):
        start = self.clock
        end = self.clock + duration
        self.segments.append(DutySegment(status, start, end, note))
        self.clock = end
        if status in ("driving", "on_duty"):
            self.weekly_on_duty += duration


def drive_for(state: HOSState, hours_needed: float):
    remaining = hours_needed

    while remaining > 0:
        window_left = 14 - (state.clock - state.on_duty_window_start)
        drive_left_today = 11 - state.drive_today
        drive_left_before_break = 8 - state.drive_since_break
        weekly_left = 70 - state.weekly_on_duty

        chunk = min(remaining, window_left, drive_left_today, drive_left_before_break, weekly_left)

        if chunk <= 0:
            if drive_left_before_break <= 0:
                state.add_segment("on_duty", 0.5, "30-min break")
                state.drive_since_break = 0
            elif weekly_left <= 0:
                state.add_segment("off_duty", 34, "34-hr restart")
                state.drive_today = 0
                state.drive_since_break = 0
                state.on_duty_window_start = state.clock + 34
                state.weekly_on_duty = 0
                continue
            elif drive_left_today <= 0 or window_left <= 0:
                state.add_segment("off_duty", 10, "10-hr rest")
                state.drive_today = 0
                state.drive_since_break = 0
                state.on_duty_window_start = state.clock  
                continue

        state.add_segment("driving", chunk, "driving")
        state.drive_since_break += chunk
        state.drive_today += chunk
        remaining -= chunk

def _drive_leg_with_fuel_stops(state: HOSState, leg_hours: float, leg_miles: float):
    if leg_miles <= 0 or leg_hours <= 0:
        return

    miles_per_hour = leg_miles / leg_hours
    miles_driven_this_leg = 0.0
    hours_remaining_this_leg = leg_hours

    while hours_remaining_this_leg > 0:
        miles_to_next_fuel_stop = 1000 - (miles_driven_this_leg % 1000)
        hours_to_next_fuel_stop = miles_to_next_fuel_stop / miles_per_hour

        chunk_hours = min(hours_remaining_this_leg, hours_to_next_fuel_stop)

        drive_for(state, chunk_hours)  # this handles breaks/rests/restarts internally

        miles_driven_this_leg += chunk_hours * miles_per_hour
        hours_remaining_this_leg -= chunk_hours

        if hours_remaining_this_leg > 0.001:  
            state.add_segment("on_duty", 0.5, "fueling")
                #state.drive_since_break = 0


def run_trip(leg1_hours, leg2_hours, cycle_hours_used, miles_leg1, miles_leg2):
    state = HOSState(cycle_hours_used=cycle_hours_used)

    # Leg 1: current location -> pickup
    _drive_leg_with_fuel_stops(state, leg1_hours, miles_leg1)
    state.add_segment("on_duty", 1.0, "pickup")

    # Leg 2: pickup -> dropoff
    _drive_leg_with_fuel_stops(state, leg2_hours, miles_leg2)
    state.add_segment("on_duty", 1.0, "dropoff")

    return state


if __name__ == "__main__":
    state = run_trip(
        leg1_hours=2.0,
        leg2_hours=22.0,
        cycle_hours_used=0,
        miles_leg1=120,
        miles_leg2=1300,
    )

    for seg in state.segments:
        print(f"{seg.start_hr:6.2f} - {seg.end_hr:6.2f}  {seg.status:10s} {seg.note}")

    print(f"\nTotal trip duration: {state.clock:.2f} hrs ({state.clock/24:.1f} days)")