/*
# Add invoice_overdue notification type

The frontend uses 'invoice_overdue' as a notification type but the enum was missing it.

1. Schema change
- Add 'invoice_overdue' value to `notification_type` enum.
2. Security
- No policy changes.
*/

alter type notification_type add value if not exists 'invoice_overdue';
