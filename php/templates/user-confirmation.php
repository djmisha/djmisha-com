<?php
/**
 * User Confirmation Email Template
 *
 * Receives $data array with all 10 form fields.
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

<p>Hey, <?= $e($data['name']) ?>!</p>

<p>Thank you for contacting DJ Misha! I would be honored to provide the music experience at your event.</p>

<p>When you have a moment, please reply and let me know your musical vision for your event - I would love to know!</p>

<p>For booking requests, please feel free to elaborate on any additional details for your event: occasion, date, time, location, venue and approximate people in attendance.</p>

<p>DJ Misha responds to booking inquiries by text (sms), usually within a few minutes or when he next checks his phone.</p>

<p>DJ Misha and saxophone players are available for private bookings, weddings and corporate events including national and international travel.</p>

<p>Thank you - I look forward to hearing back from you!</p>

<p>xoxo,<br>DJ Misha</p>

<img src="https://djmisha.com/images/expert.png" width="150" alt="DJ Misha" style="display:block;margin:16px 0;" />

<p>
<b>Find Me Online:</b><br>
<b>Website</b> <a href="http://djmisha.com/" target="_blank" rel="noopener" style="color:#e44c65;">djmisha.com</a><br>
<b>Instagram</b> <a href="https://www.instagram.com/djmishasd/" target="_blank" rel="noopener" style="color:#e44c65;">@djmishasd</a><br>
<a href="https://www.google.com/search?q=dj+misha#lrd=0x80dbffcb31404e13:0x3fae10d8742ab418,1,,," target="_blank" rel="noopener" style="color:#e44c65;">Reviews &amp; Testimonials</a><br>
<a href="https://www.zola.com/wedding-vendors/wedding-bands-djs/dj-misha" target="_blank" rel="noopener" style="color:#e44c65;">Pictures from Events on Zola</a>
</p>

<p>
<b>Check out my longtime collaborators:</b><br>
<b>Jason Whitmore Saxophone</b> <a href="http://jasonwhitmore.com/" target="_blank" rel="noopener" style="color:#e44c65;">jasonwhitmore.com</a><br>
<b>Brian Pierini Saxophone</b> <a href="http://brianpierini.com/" target="_blank" rel="noopener" style="color:#e44c65;">brianpierini.com</a>
</p>

<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />

<p>
<b>Below is a copy of your inquiry:</b><br><br>
<b>Name:</b> <?= $e($data['name']) ?><br>
<b>Email Address:</b> <?= $e($data['email']) ?><br>
<b>Phone Number:</b> <?= $e($data['phone']) ?><br>
<b>I need an awesome DJ for my:</b> <?= $e($data['event_type']) ?><br>
<b>I am expecting an attendance of:</b> <?= $e($data['attendance']) ?><br>
<b>The event will be held at the following venue and location:</b> <?= $e($data['venue']) ?><br>
<b>The DATE and START/END time of my event is:</b> <?= $e($data['date_time']) ?><br>
<b>Select a service:</b> <?= $e($data['service']) ?><br>
<b>The vibes and mood at my event will be:</b> <?= $vibesDisplay ?><br>
<b>Message:</b> <?= $e($data['message']) ?>
</p>

</body>
</html>
