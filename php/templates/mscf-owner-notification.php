<?php
/**
 * Owner Notification Email Template — mscf-owner-notification.php
 *
 * Receives $data array with multi-step form fields:
 *   name, email, phone, venue, date_time, attendance, vibes[], service, message
 * All user-supplied values are escaped with htmlspecialchars().
 *
 * Headers set by process-multistep-form.php:
 *   Reply-To: submitter's email
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

<p><b>New Multi-Step Contact Form Inquiry</b></p>

<p>
<b>Name:</b> <?= $e($data['name']) ?><br>
<b>Email Address:</b> <a href="mailto:<?= $e($data['email']) ?>" style="color:#1a73e8;"><?= $e($data['email']) ?></a><br>
<b>Phone Number:</b> <?= $e($data['phone']) ?><br>
<?php if (!empty($data['venue'])): ?>
<b>Venue / Location:</b> <?= $e($data['venue']) ?><br>
<?php endif; ?>
<b>Event Date &amp; Time:</b> <?= $e($data['date_time']) ?><br>
<b>Expected Attendance:</b> <?= $e($data['attendance']) ?><br>
<b>Select a service:</b> <?= $e($data['service']) ?><br>
<b>Vibes &amp; mood:</b> <?= $vibesDisplay ?><br>
<b>Message:</b><br>
<?= $e($data['message']) ?>
</p>

</body>
</html>
