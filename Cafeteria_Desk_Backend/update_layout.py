from app.database import SessionLocal
from app.models.desk import Desk
from app.models.desk_booking import DeskBooking

db = SessionLocal()

# clear existing desks and bookings to avoid conflicts
print("Clearing existing bookings and desks...")
db.query(DeskBooking).delete()
db.query(Desk).delete()
db.commit()

# Define the layout
# Block A: 3 Rows x 4 Cols
# Block B: 2 Rows x 3 Cols
layout = [
    {"block": "A", "name": "Quiet Zone", "rows": 3, "cols": 4},
    {"block": "B", "name": "Team Area", "rows": 2, "cols": 3},
    {"block": "C", "name": "Window View", "rows": 1, "cols": 5},
]

print("Seeding new desk layout...")
desks = []
for zone in layout:
    block_code = zone["block"]
    for r in range(1, zone["rows"] + 1):
        for c in range(1, zone["cols"] + 1):
            # Create a code like A-1-1
            desk_code = f"{block_code}-{r}-{c}"
            location = zone["name"]
            
            # Simple status logic for variety
            status = "available"
            if block_code == "B" and r == 2:
                status = "maintenance" # Whole row under maintenance demo
            
            desk = Desk(
                desk_code=desk_code,
                location=location,
                block=block_code,
                row=r,
                col=c,
                status=status
            )
            desks.append(desk)

db.add_all(desks)
db.commit()
print(f"Created {len(desks)} desks across {len(layout)} zones.")
db.close()
