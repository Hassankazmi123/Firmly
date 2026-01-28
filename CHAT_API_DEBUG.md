# Chat API Debugging/Integration Notes

## Resolved Issues

### 1. **Undefined Thread ID** (404 Error) 
**Fix**: Added comprehensive validation and ID normalization.

### 2. **Authentication Failure** (401 Error) 
**Fix**: Implemented **Automatic Token Refresh** with retry logic.

### 3. **Generic "I received your message" Reply** 
**Fix**: Updated to fetch full history after sending messages to ensure data consistency.

### 4. **Fixed "New Chat" Titles** 
**Fix**: Implemented Draft Mode; threads are titled based on the first message sent.

### 5. **Recent Chats Sorting** 
**Symptom**: New/Recent chats were not appearing at the top of the list.
**Fix**: Added client-side sorting in `fetchThreads`.
- Threads are now strictly ordered by `updated_at` (or `created_at`) descending.
- The most recently active/created chat will always appear first.

## Troubleshooting Guide

### If order is still wrong:
1. Check `List threads response` in console.
2. Verify that `updated_at` field updates when you send a message.
3. If not, the backend might only be tracking creation time.
