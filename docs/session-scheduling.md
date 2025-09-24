# Session Scheduling System

This document describes the mentoring session scheduling system that allows students to schedule sessions with their mentors and handles email notifications for confirmation.

## Features

- Students can schedule mentoring sessions with mentors
- Email notifications sent to both mentors and students
- Mentors can confirm or decline sessions via email links or API
- Session status tracking (pending, confirmed, cancelled, completed)
- Support for meeting links and detailed agendas

## Database Schema Updates

### Session Entity Enhancements

The `Session` entity has been enhanced with the following new fields:

```typescript
export enum SessionType {
  REGULAR = "regular",
  MENTORING = "mentoring",
}

export enum SessionStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed", 
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

// New fields added to Session entity:
- type: SessionType (regular/mentoring)
- status: SessionStatus (pending/confirmed/cancelled/completed)
- mentor: User (the mentor assigned to the session)
- meetingLink: string (optional meeting URL)
- agenda: string (optional session agenda)
- confirmedAt: Date (when mentor confirmed)
- cancellationReason: string (reason if cancelled)
```

## API Endpoints

### 1. Schedule Mentoring Session

**POST** `/api/v1/sessions/mentoring/schedule`

**Authorization:** Student role required

**Request Body:**
```json
{
  "title": "React Hooks Deep Dive",
  "category": "Frontend Development", 
  "startTime": "2025-09-25T10:00:00Z",
  "endTime": "2025-09-25T11:00:00Z",
  "description": "Need help understanding useEffect and custom hooks",
  "agenda": "1. Review current code 2. Explain useEffect lifecycle 3. Build custom hook example",
  "mentorId": "uuid-of-mentor",
  "meetingLink": "https://meet.google.com/abc-defg-hij" // optional
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Mentoring session scheduled successfully. Email notifications sent.",
  "data": {
    "id": "session-uuid",
    "title": "React Hooks Deep Dive",
    "type": "mentoring",
    "status": "pending",
    "startTime": "2025-09-25T10:00:00Z",
    // ... other session fields
  }
}
```

### 2. Confirm/Decline Session

**PUT** `/api/v1/sessions/mentoring/:sessionId/confirm`

**Authorization:** Authentication required (mentor validation in service)

**Request Body:**
```json
{
  "confirmed": true,
  "meetingLink": "https://meet.google.com/xyz-abc-def" // optional, if confirmed
}
```

**Or for declining:**
```json
{
  "confirmed": false,
  "cancellationReason": "Schedule conflict, let's reschedule for next week"
}
```

### 3. Get Mentoring Sessions

**GET** `/api/v1/sessions/mentoring?role=student`
**GET** `/api/v1/sessions/mentoring?role=mentor`

**Authorization:** Authentication required

**Query Parameters:**
- `role`: "student" or "mentor" (required)

**Response:**
```json
{
  "success": true,
  "message": "Mentoring sessions fetched successfully",
  "data": [
    {
      "id": "session-uuid",
      "title": "React Hooks Deep Dive",
      "status": "confirmed",
      "startTime": "2025-09-25T10:00:00Z",
      "user": { "firstName": "John", "lastName": "Doe", "email": "john@example.com" },
      "mentor": { "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com" }
    }
  ]
}
```

### 4. Get Pending Sessions (For Mentors)

**GET** `/api/v1/sessions/mentoring/pending`

**Authorization:** Authentication required

Returns all pending session requests for the authenticated mentor.

### 5. Email Confirmation Handler

**GET** `/api/v1/sessions/:sessionId/confirm?action=accept`
**GET** `/api/v1/sessions/:sessionId/confirm?action=decline`

**Authorization:** None (public endpoint for email links)

This endpoint handles the confirmation links from emails and redirects to the frontend.

## Email Templates

Four email templates have been created:

1. **session-request-mentor.ejs** - Sent to mentors when students request sessions
2. **session-request-student.ejs** - Confirmation sent to students after requesting
3. **session-confirmed.ejs** - Sent to both parties when session is confirmed
4. **session-cancelled.ejs** - Sent to both parties when session is cancelled

## Email Service Methods

New methods added to `EmailService`:

```typescript
- sendSessionRequestToMentor(mentorEmail, sessionData)
- sendSessionRequestToStudent(studentEmail, sessionData) 
- sendSessionConfirmed(participantEmail, sessionData)
- sendSessionCancelled(participantEmail, sessionData)
```

## Usage Flow

1. **Student schedules session:**
   - Student calls `POST /api/v1/sessions/mentoring/schedule`
   - System creates session with "pending" status
   - Email sent to mentor with accept/decline links
   - Confirmation email sent to student

2. **Mentor responds:**
   - Mentor clicks email link or uses API to confirm/decline
   - System updates session status
   - Email notifications sent to both parties

3. **Session management:**
   - Both parties can view their sessions via API
   - Mentors can see pending requests
   - System tracks all status changes

## Environment Configuration

Ensure these environment variables are set:

```env
# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000
```

## Validation

All requests are validated using Joi schemas:

- Session scheduling validates required fields, date formats, and business rules
- Confirmation validates boolean confirmation and conditional required fields
- Time validation ensures sessions can't be scheduled in the past

## Error Handling

The system includes comprehensive error handling:

- Email sending failures are logged but don't fail the session creation
- Database validation errors are returned with appropriate status codes
- Authentication and authorization checks prevent unauthorized access
- Friendly error messages for common scenarios

## Testing the Feature

1. Create a student and mentor user
2. Have student schedule a session with mentor
3. Check both email inboxes for notifications
4. Use mentor account to confirm/decline session
5. Verify status updates and email notifications

This system provides a complete mentoring session scheduling workflow with proper email notifications and status tracking.