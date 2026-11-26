<?php
/**
 * User Confirmation Email Template — mscf-user-confirmation.php
 *
 * Receives $data array with multi-step form fields:
 *   name, email, phone, venue, date_time, attendance, vibes[], service, message
 * All user-supplied values are escaped with htmlspecialchars().
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
<title>Thank You</title>
</head>
<body style="margin:0;padding:20px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#444;line-height:1.6;">

<p style="margin:0 0 16px;">Hey <?= $e((($first = preg_split('/\s+/', trim((string) $data['name']), 2)[0]) !== '' ? $first : $data['name'])) ?>,</p>

<p style="margin:0 0 16px;">Thanks for getting in touch — I've got your details, and I'd love to provide the music for your event!</p>

<p style="margin:0 0 16px;">Texting is the quickest way to reach me, so look for my text soon, and feel free to text me directly at <a href="tel:+16197862664" style="color:#e44c65;">(619) 786-2664</a>.</p>

<p style="margin:0 0 16px;">In the meantime, I'd love to hear your musical vision. What songs, artists and vibes get you excited, and is there anything else on your mind about the music?</p>

<p style="margin:0 0 16px;">Also, in case it's helpful: I travel for events across the US and internationally, and I can bring a live saxophonist to any event.</p>

<p style="margin:24px 0 0;">xoxo,<br>DJ Misha and Team</p>

<a href="https://djmisha.com" target="_blank" rel="noopener" style="display:block;margin:20px 0;border:0;text-decoration:none;"><img src="https://djmisha.com/images/expert.png" width="96" height="91" alt="DJ Misha" style="display:block;border:0;outline:none;" /></a>

<p style="margin:0;">
🌐 <a href="https://djmisha.com" target="_blank" rel="noopener" style="color:#e44c65;">djmisha.com</a><br>
📸 <a href="https://www.instagram.com/djmishasd/" target="_blank" rel="noopener" style="color:#e44c65;">@djmishasd</a><br>
⭐ <a href="https://maps.google.com/?cid=4588623592185050136" target="_blank" rel="noopener" style="color:#e44c65;">Reviews</a>
</p>

<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />

<p>
<b>Below is a copy of your inquiry:</b><br><br>
<b>Name:</b> <?= $e($data['name']) ?><br>
<b>Email Address:</b> <?= $e($data['email']) ?><br>
<b>Phone Number:</b> <?= $e($data['phone']) ?><br>
<?php if (!empty($data['venue'])): ?>
<b>Venue / Location:</b> <?= $e($data['venue']) ?><br>
<?php endif; ?>
<b>Event Date &amp; Time:</b> <?= $e($data['date_time']) ?><br>
<b>Expected Attendance:</b> <?= $e($data['attendance']) ?><br>
<b>Select a service:</b> <?= $e($data['service']) ?><br>
<b>Vibes &amp; mood:</b> <?= $vibesDisplay ?><br>
<b>Message:</b> <?= $e($data['message']) ?>
</p>

</body>
</html>
