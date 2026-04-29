<?php
/**
 * Owner Notification Email Template
 *
 * Receives $data array with all 10 form fields.
 * All user-supplied values are escaped with htmlspecialchars().
 *
 * Headers set by process-form.php:
 *   Reply-To: submitter's email
 *   Subject:  "New Inquiry from {name} — {event_type}"
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry</title>
</head>
<body style="margin:0;padding:20px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;line-height:1.6;">

<p><b>New Contact Form Inquiry</b></p>

<p>
<b>Name:</b> <?= $e($data['name']) ?><br>
<b>Email Address:</b> <a href="mailto:<?= $e($data['email']) ?>" style="color:#1a73e8;"><?= $e($data['email']) ?></a><br>
<b>Phone Number:</b> <?= $e($data['phone']) ?><br>
<b>I need an awesome DJ for my:</b> <?= $e($data['event_type']) ?><br>
<b>I am expecting an attendance of:</b> <?= $e($data['attendance']) ?><br>
<b>The event will be held at the following venue and location:</b> <?= $e($data['venue']) ?><br>
<b>The DATE and START/END time of my event is:</b> <?= $e($data['date_time']) ?><br>
<b>Select a service:</b> <?= $e($data['service']) ?><br>
<b>The vibes and mood at my event will be:</b> <?= $vibesDisplay ?><br>
<b>Message:</b><br>
<?= $e($data['message']) ?>
</p>

</body>
</html>
