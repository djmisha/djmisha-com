<?php
/**
 * Optional Verizon Lead Notification Email Template — mscf-verizon-notification.php
 *
 * Sent only when ENABLE_VERIZON_LEAD_EMAIL is true in process-multistep-form.php.
 * The content is plain text and intentionally compact for SMS/email clients.
 */

if (!isset($data) || !is_array($data)) {
    return;
}

$e = function ($value) {
    return trim((string) $value);
};

$lines = [];
$lines[] = 'New lead from djmisha.com:';
$lines[] = 'Name: ' . $e($data['name'] ?? '');
$lines[] = 'Email: ' . $e($data['email'] ?? '');
$lines[] = 'Phone: ' . $e($data['phone'] ?? '');
$lines[] = 'Date: ' . $e($data['date_time'] ?? '');
$lines[] = 'Venue: ' . $e($data['venue'] ?? '');
$lines[] = 'Type: ' . $e($data['service'] ?? '');
$lines[] = 'Attendance: ' . $e($data['attendance'] ?? '');

if (!empty($data['vibes']) && is_array($data['vibes'])) {
    $lines[] = 'Vibes: ' . implode(', ', array_map($e, $data['vibes']));
}

if (!empty($data['message'])) {
    $lines[] = 'Message: ' . $e($data['message']);
}

$body = implode("\r\n", $lines);

echo $body;
