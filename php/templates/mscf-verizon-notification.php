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
$lines[] = 'NEW EVENT SUBMITTED:';
$lines[] = 'NAME: ' . $e($data['name'] ?? '');
$lines[] = 'EMAIL: ' . $e($data['email'] ?? '');
$lines[] = 'PHONE: ' . $e($data['phone'] ?? '');
$lines[] = 'DATE: ' . $e($data['date_time'] ?? '');
$lines[] = 'VENUE: ' . $e($data['venue'] ?? '');
$lines[] = 'EVENT TYPE: ' . $e($data['service'] ?? '');
$lines[] = 'ATTENDANCE: ' . $e($data['attendance'] ?? '');

if (!empty($data['vibes']) && is_array($data['vibes'])) {
    $lines[] = 'VIBES: ' . implode(', ', array_map($e, $data['vibes']));
}

if (!empty($data['message'])) {
    $lines[] = 'MESSAGE: ' . $e($data['message']);
}

$body = implode("\r\n", $lines);

echo $body;
