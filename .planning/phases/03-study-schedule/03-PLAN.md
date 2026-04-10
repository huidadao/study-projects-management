# Phase 3: Study Schedule Implementation Plan

> **For GSD Execute:** Use executing-plans skill to implement task-by-task.

**Goal:** Watch scheduling, progress tracking, and schedule-aware dashboard

**Architecture:** Add schedule model to existing SQLite database, create API endpoints for CRUD on schedules, integrate with frontend dashboard with dedicated Upcoming section

**Tech Stack:** FastAPI (Python), SQLite, SQLModel, React, Zustand

---

### Task 1: Schedule Model (Backend)

**Files:**
- Create: `backend/models/schedule.py`
- Modify: `backend/models/__init__.py`

**Step 1: Write the failing test**

```python
# test that schedule model doesn't exist
from models.schedule import Schedule
```

**Step 2: Run test to verify it fails**

Run: `python -c "from models.schedule import Schedule"`
Expected: ImportError: No module named 'schedule'

**Step 3: Create schedule model**

```python
# backend/models/schedule.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Schedule(SQLModel, table=True):
    __tablename__ = "schedules"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="videos.id")
    scheduled_date: str  # ISO date string "YYYY-MM-DD"
    recurring: bool = Field(default=False)
    recurring_type: Optional[str] = None  # "daily", "weekly", null
    completed: bool = Field(default=False)
    created: str = Field(default_factory=lambda: datetime.now().isoformat())
```

**Step 4: Update models/__init__.py**

Add: `from models.schedule import Schedule`

**Step 5: Commit**

```bash
git add backend/models/schedule.py backend/models/__init__.py
git commit -m "feat(backend): add Schedule model"
```

---

### Task 2: Schedule Completion History Model

**Files:**
- Modify: `backend/models/schedule.py`

**Step 1: Add completion history table**

```python
class ScheduleCompletion(SQLModel, table=True):
    __tablename__ = "schedule_completions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_id: int = Field(foreign_key="schedules.id")
    completed_at: str = Field(default_factory=lambda: datetime.now().isoformat())
```

**Step 2: Commit**

```bash
git commit -m "feat(backend): add ScheduleCompletion history model"
```

---

### Task 3: Schedule Repository

**Files:**
- Create: `backend/repositories/schedule.py`
- Modify: `backend/repositories/__init__.py`

**Step 1: Create repository**

```python
# backend/repositories/schedule.py
from sqlmodel import Session, select
from models.schedule import Schedule, ScheduleCompletion
from typing import List, Optional


class ScheduleRepository:
    def __init__(self, session: Session):
        self.session = session
    
    def create(self, schedule: Schedule) -> Schedule:
        self.session.add(schedule)
        self.session.commit()
        self.session.refresh(schedule)
        return schedule
    
    def get_all(self) -> List[Schedule]:
        return list(self.session.exec(select(Schedule)).all())
    
    def get_by_video(self, video_id: int) -> List[Schedule]:
        return list(self.session.exec(
            select(Schedule).where(Schedule.video_id == video_id)
        ).all())
    
    def get_upcoming(self) -> List[Schedule]:
        from datetime import date
        today = date.today().isoformat()
        return list(self.session.exec(
            select(Schedule).where(
                Schedule.scheduled_date >= today,
                Schedule.completed == False
            ).order_by(Schedule.scheduled_date)
        ).all())
    
    def complete(self, schedule_id: int) -> ScheduleCompletion:
        schedule = self.session.get(Schedule, schedule_id)
        completion = ScheduleCompletion(schedule_id=schedule_id)
        self.session.add(completion)
        
        if schedule.recurring and schedule.recurring_type == "daily":
            from datetime import date, timedelta
            schedule.scheduled_date = (date.today() + timedelta(days=1)).isoformat()
        else:
            schedule.completed = True
        
        self.session.commit()
        self.session.refresh(schedule)
        return completion
    
    def reschedule(self, schedule_id: int, new_date: str) -> Schedule:
        schedule = self.session.get(Schedule, schedule_id)
        schedule.scheduled_date = new_date
        self.session.commit()
        self.session.refresh(schedule)
        return schedule
    
    def delete(self, schedule_id: int) -> None:
        schedule = self.session.get(Schedule, schedule_id)
        self.session.delete(schedule)
        self.session.commit()
```

**Step 2: Update __init__.py**

Add: `from repositories.schedule import ScheduleRepository`

**Step 3: Commit**

```bash
git add backend/repositories/schedule.py backend/repositories/__init__.py
git commit -m "feat(backend): add ScheduleRepository"
```

---

### Task 4: Schedule API Endpoints

**Files:**
- Modify: `backend/main.py`, `backend/routers/__init__.py`

**Step 1: Create schedule router**

```python
# backend/routers/schedules.py
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List, Optional
from pydantic import BaseModel

from models.schedule import Schedule, ScheduleCompletion
from repositories.schedule import ScheduleRepository


router = APIRouter()


def get_session():
    from main import engine
    with Session(engine) as session:
        yield session


class ScheduleCreate(BaseModel):
    video_id: int
    scheduled_date: str
    recurring: bool = False
    recurring_type: Optional[str] = None


class ScheduleResponse(BaseModel):
    id: int
    video_id: int
    scheduled_date: str
    recurring: bool
    recurring_type: Optional[str]
    completed: bool
    
    class Config:
        from_attributes = True


@router.get("", response_model=List[ScheduleResponse])
async def get_schedules(session: Session = Depends(get_session)):
    """Get all schedules"""
    repo = ScheduleRepository(session)
    return repo.get_all()


@router.get("/upcoming", response_model=List[ScheduleResponse])
async def get_upcoming(session: Session = Depends(get_session)):
    """Get upcoming schedules"""
    repo = ScheduleRepository(session)
    return repo.get_upcoming()


@router.post("", response_model=ScheduleResponse, status_code=201)
async def create_schedule(schedule: ScheduleCreate, session: Session = Depends(get_session)):
    """Create a new schedule"""
    repo = ScheduleRepository(session)
    db_schedule = Schedule(**schedule.model_dump())
    return repo.create(db_schedule)


@router.post("/{schedule_id}/complete", response_model=ScheduleResponse)
async def complete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    """Mark schedule as complete"""
    repo = ScheduleRepository(session)
    try:
        repo.complete(schedule_id)
        return session.get(Schedule, schedule_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Schedule not found")


@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def reschedule_video(
    schedule_id: int, 
    scheduled_date: str, 
    session: Session = Depends(get_session)
):
    """Reschedule a video"""
    repo = ScheduleRepository(session)
    try:
        return repo.reschedule(schedule_id, scheduled_date)
    except Exception:
        raise HTTPException(status_code=404, detail="Schedule not found")


@router.delete("/{schedule_id}", status_code=204)
async def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    """Remove from schedule"""
    repo = ScheduleRepository(session)
    try:
        repo.delete(schedule_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Schedule not found")
```

**Step 2: Register router in main.py**

Add: `app.include_router(schedules.router, prefix="/api/schedules", tags=["schedules"])`

**Step 3: Commit**

```bash
git commit -m "feat(backend): add schedules API endpoints"
```

---

### Task 5: Schedule API Client (Frontend)

**Files:**
- Modify: `frontend/src/api/client.ts`

**Step 1: Add schedule API functions**

```typescript
// frontend/src/api/client.ts

export interface Schedule {
  id: number;
  video_id: number;
  scheduled_date: string;
  recurring: boolean;
  recurring_type: string | null;
  completed: boolean;
}

export const scheduleApi = {
  getAll: () => client.get<Schedule[]>('/schedules'),
  
  getUpcoming: () => client.get<Schedule[]>('/schedules/upcoming'),
  
  create: (data: Omit<Schedule, 'id' | 'completed'>) =>
    client.post<Schedule>('/schedules', data),
  
  complete: (id: number) =>
    client.post<Schedule>(`/schedules/${id}/complete`),
  
  reschedule: (id: number, scheduled_date: string) =>
    client.put<Schedule>(`/schedules/${id}`, { scheduled_date }),
  
  delete: (id: number) =>
    client.delete(`/schedules/${id}`),
};
```

**Step 2: Commit**

```bash
git commit -m "feat(frontend): add schedule API client"
```

---

### Task 6: Schedule Store (Zustand)

**Files:**
- Modify: `frontend/src/store/useVideoStore.ts`

**Step 1: Add schedule state**

```typescript
// Add to interface
interface VideoStore {
  // ... existing fields
  schedules: Schedule[];
  upcoming: Schedule[];
  
  // Actions
  fetchSchedules: () => Promise<void>;
  fetchUpcoming: () => Promise<void>;
  createSchedule: (data: Omit<Schedule, 'id' | 'completed'>) => Promise<void>;
  completeSchedule: (id: number) => Promise<void>;
  reschedule: (id: number, date: string) => Promise<void>;
  removeSchedule: (id: number) => Promise<void>;
}

// Add to actions
fetchSchedules: async () => {
  const response = await scheduleApi.getAll();
  set({ schedules: response.data });
},

fetchUpcoming: async () => {
  const response = await scheduleApi.getUpcoming();
  set({ upcoming: response.data });
},

createSchedule: async (data) => {
  await scheduleApi.create(data);
  await get().fetchUpcoming();
},

completeSchedule: async (id) => {
  await scheduleApi.complete(id);
  await get().fetchUpcoming();
},

reschedule: async (id, date) => {
  await scheduleApi.reschedule(id, date);
  await get().fetchUpcoming();
},

removeSchedule: async (id) => {
  await scheduleApi.delete(id);
  await get().fetchUpcoming();
},
```

**Step 2: Commit**

```bash
git commit -m "feat(frontend): add schedule store actions"
```

---

### Task 7: Schedule Badge Component

**Files:**
- Create: `frontend/src/components/ScheduleBadge.tsx`

**Step 1: Create component**

```typescript
import React from 'react';
import { Schedule } from '../api/client';

interface ScheduleBadgeProps {
  schedule: Schedule;
  onComplete?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export const ScheduleBadge: React.FC<ScheduleBadgeProps> = ({
  schedule,
  onComplete,
  onRemove,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="schedule-badge">
      <span className="schedule-date">{formatDate(schedule.scheduled_date)}</span>
      {schedule.recurring && (
        <span className="recurring-badge">{schedule.recurring_type}</span>
      )}
      {onComplete && !schedule.completed && (
        <button onClick={() => onComplete(schedule.id)}>Complete</button>
      )}
      {onRemove && (
        <button onClick={() => onRemove(schedule.id)}>Remove</button>
      )}
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add frontend/src/components/ScheduleBadge.tsx
git commit -m "feat(frontend): add ScheduleBadge component"
```

---

### Task 8: Upcoming Section Component

**Files:**
- Create: `frontend/src/components/UpcomingSection.tsx`

**Step 1: Create component**

```typescript
import React, { useEffect } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { ScheduleBadge } from './ScheduleBadge';

export const UpcomingSection: React.FC = () => {
  const { upcoming, fetchSchedules, completeSchedule, removeSchedule } = useVideoStore();

  useEffect(() => {
    fetchSchedules();
  }, []);

  if (upcoming.length === 0) return null;

  return (
    <div className="upcoming-section">
      <h2>Upcoming</h2>
      <div className="upcoming-list">
        {upcoming.map((schedule) => (
          <ScheduleBadge
            key={schedule.id}
            schedule={schedule}
            onComplete={completeSchedule}
            onRemove={removeSchedule}
          />
        ))}
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add frontend/src/components/UpcomingSection.tsx
git commit -m "feat(frontend): add UpcomingSection component"
```

---

### Task 9: Integrate UpcomingSection into Dashboard

**Files:**
- Modify: `frontend/src/components/Dashboard.tsx`

**Step 1: Add UpcomingSection import and render**

```typescript
import { UpcomingSection } from './UpcomingSection';

// In Dashboard render, add before VideoGrid
<UpcomingSection />
<VideoGrid videos={filteredVideos} />
```

**Step 2: Commit**

```bash
git commit -m "feat(frontend): integrate UpcomingSection into Dashboard"
```

---

### Task 10: Schedule Form Component

**Files:**
- Create: `frontend/src/components/ScheduleForm.tsx`

**Step 1: Create schedule form**

```typescript
import React, { useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';

interface ScheduleFormProps {
  videoId: number;
  onClose: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ videoId, onClose }) => {
  const [date, setDate] = useState('');
  const [recurring, setRecurring] = useState(false);
  const { createSchedule } = useVideoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSchedule({
      video_id: videoId,
      scheduled_date: date,
      recurring,
      recurring_type: recurring ? 'daily' : null,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        Daily recurring
      </label>
      <button type="submit">Schedule</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};
```

**Step 2: Commit**

```bash
git add frontend/src/components/ScheduleForm.tsx
git commit -m "feat(frontend): add ScheduleForm component"
```

---

### Task 11: Integrate ScheduleForm into VideoCard

**Files:**
- Modify: `frontend/src/components/VideoCard.tsx`

**Step 1: Add schedule button**

```typescript
// Add state and import
const [showSchedule, setShowSchedule] = useState(false);

// Add button after notes button
<button onClick={() => setShowSchedule(true)}>Schedule</button>

// Render ScheduleForm in modal
{showSchedule && (
  <ScheduleForm videoId={video.id} onClose={() => setShowSchedule(false)} />
)}
```

**Step 2: Commit**

```bash
git commit -m "feat(frontend): add schedule button to VideoCard"
```

---

### Summary

**Backend:**
- Schedule model (daily recurring support)
- ScheduleCompletion history model
- ScheduleRepository with full CRUD
- Schedule API endpoints

**Frontend:**
- Schedule API client
- Zustand store actions
- ScheduleBadge component
- UpcomingSection (dashboard integration)
- ScheduleForm (add to video)
- VideoCard integration

---

## Next

Execute each task using GSD workflow. Run tests after each commit. Verify dashboard shows upcoming section after task 9.