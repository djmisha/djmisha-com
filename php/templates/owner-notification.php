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
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="background-color:#1a1a2e;color:#ffffff;padding:24px 30px;font-size:20px;font-weight:bold;">
      New Contact Form Inquiry
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:30px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Name:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['name']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Email Address:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;">
            <a href="mailto:<?= $e($data['email']) ?>" style="color:#1a73e8;"><?= $e($data['email']) ?></a>
          </td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Phone Number:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['phone']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">I need an awesome DJ for my:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['event_type']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">I am expecting an attendance of:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['attendance']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">The event will be held at the following venue and location:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['venue']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">The DATE and START/END time of my event is:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['date_time']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Select a service</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $e($data['service']) ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">The vibes and mood at my event will be:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;"><?= $vibesDisplay ?></td>
        </tr>

        <tr>
          <td style="padding:8px 0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Message:</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:#222;white-space:pre-wrap;"><?= $e($data['message']) ?></td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:16px 30px;background-color:#f9f9f9;font-size:12px;color:#999;text-align:center;">
      Submitted via djmisha.com contact form
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
