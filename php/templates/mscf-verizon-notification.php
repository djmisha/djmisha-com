<?php
/**
 * Optional Verizon Lead Notification Email Template — mscf-verizon-notification.php
 *
 * Sent only when ENABLE_VERIZON_LEAD_EMAIL is true in process-multistep-form.php.
 * The goal is a concise, one-or-two-sentence summary of the submitted event.
 */

if (!isset($data) || !is_array($data)) {
    return;
}

$e = function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
};

$vibesDisplay = '';
if (!empty($data['vibes']) && is_array($data['vibes'])) {
    $vibesDisplay = implode(', ', array_map($e, $data['vibes']));
}

$detailParts = array_filter([
    !empty($data['date_time']) ? 'date ' . $e($data['date_time']) : null,
    !empty($data['venue']) ? 'venue ' . $e($data['venue']) : null,
    !empty($data['service']) ? 'event type ' . $e($data['service']) : null,
    !empty($data['attendance']) ? 'attendance ' . $e($data['attendance']) : null,
    !empty($data['vibes']) ? 'vibes ' . $vibesDisplay : null,
]);

$summary = 'A new event has been submitted for ' . implode(', ', $detailParts) . '.';
if (empty($detailParts)) {
    $summary = 'A new event inquiry has been submitted.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Lead for DJ Misha</title>
</head>
<body style="margin:0;padding:20px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;line-height:1.6;">

<p><b>New lead for DJ Misha</b></p>

<p>
<?= $summary ?>
<?php if (!empty($data['message'])): ?>
<?= ' Contact details: ' . $e($data['name']) . ' (' . $e($data['email']) . ', ' . $e($data['phone']) . '). ' . $e($data['message']) ?>
<?php else: ?>
<?= ' Contact details: ' . $e($data['name']) . ' (' . $e($data['email']) . ', ' . $e($data['phone']) . ').' ?>
<?php endif; ?>
</p>

</body>
</html>
