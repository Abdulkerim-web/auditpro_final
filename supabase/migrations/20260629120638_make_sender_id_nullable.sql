/*
# Make messages.sender_id nullable

Some messages come from client contacts who are not registered users (no auth account).
The sender_name + sender_role columns capture who sent it; sender_id is only set when
the sender is an authenticated user.

1. Schema change
- `messages.sender_id` is now nullable.
2. Security
- No policy changes; existing policies already use sender_name/sender_role for display.
*/

alter table public.messages alter column sender_id drop not null;
