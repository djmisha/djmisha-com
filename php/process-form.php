<?php
/**
 * Contact Form Processor — php/process-form.php
 *
 * Handles contact form submissions from djmisha.com.
 * Request flow:
 *   1. Reject non-POST → 405
 *   2. CSRF check (Origin/Referer) → 403
 *   3. Honeypot check → silent reject
 *   4. Timing check → silent reject
 *   5. reCAPTCHA verification → 403/503
 *   6. Sanitize inputs
 *   7. Validate required fields → 422
 *   8. Validate email & phone → 422
 *   9. Send emails
 *  10. Return success JSON
 */

// ── Suppress error display ──────────────────────────────────────────────────
ini_set('display_errors', '0');
error_reporting(E_ALL);

// ── Configuration ───────────────────────────────────────────────────────────
$config = require __DIR__ . '/config.php';

$RECAPTCHA_SECRET   = $config['recaptcha_api_key'];
$RECAPTCHA_SITE_KEY = $config['recaptcha_site_key'];
$RECAPTCHA_PROJECT  = $config['recaptcha_project_id'];
$OWNER_EMAILS      = ['info@djmisha.com', 'misha.osinovskiy@gmail.com'];
$FROM_EMAIL        = 'no-reply@djmisha.com';
$FROM_NAME         = 'djmisha.com';
$EMAIL_SUBJECT     = 'Contact from djmisha.com';
$ALLOWED_ORIGINS   = ['https://djmisha.com', 'https://test.djmisha.com'];
$MIN_SUBMIT_SECONDS = 3;

// ──  Local dev mode ──────────────────────────────────────────────────────────
// Auto-detected: skips reCAPTCHA verification and relaxes origin check on localhost
$LOCAL_DEV = (
    isset($_SERVER['HTTP_HOST']) &&
    (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false)
);
if ($LOCAL_DEV) {
    $ALLOWED_ORIGINS = ['http://' . $_SERVER['HTTP_HOST']];
}
$MIN_SUBMIT_SECONDS = 3; // Minimum seconds between form load and submit

// ── JSON response helper ────────────────────────────────────────────────────
/**
 * Send a JSON response and terminate.
 *
 * @param bool   $success
 * @param string $message
 * @param int    $statusCode HTTP status code (default 200)
 */
function jsonResponse(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// ── 1. Reject non-POST requests ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', 405);
}

// ── 2. CSRF check (Origin / Referer) ───────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

$originValid  = false;
$refererValid = false;
foreach ($ALLOWED_ORIGINS as $_allowedOrigin) {
    if ($origin !== '' && strpos($origin, $_allowedOrigin) === 0) {
        $originValid = true;
    }
    if ($referer !== '' && strpos($referer, $_allowedOrigin) === 0) {
        $refererValid = true;
    }
}

if (!$originValid && !$refererValid) {
    jsonResponse(false, 'Request origin not allowed', 403);
}

// ── 3. Honeypot check ───────────────────────────────────────────────────────
$honeypot = $_POST['website'] ?? '';
if ($honeypot !== '') {
    // Bots fill hidden fields — reject silently with a fake success
    jsonResponse(true, 'Thank you! Your message has been sent successfully.');
}

// ── 4. Timing check ────────────────────────────────────────────────────────
$formLoadedAt = (int) ($_POST['form_loaded_at'] ?? 0);
$now = time();

if ($formLoadedAt <= 0 || ($now - $formLoadedAt) < $MIN_SUBMIT_SECONDS) {
    // Submitted too fast (or missing timestamp) — likely a bot
    jsonResponse(true, 'Thank you! Your message has been sent successfully.');
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// ── 5. reCAPTCHA Enterprise verification (skipped in local dev mode) ────────
if (!$LOCAL_DEV) {
    $recaptchaToken = $_POST['g-recaptcha-response'] ?? '';

    if ($recaptchaToken === '') {
        jsonResponse(false, 'reCAPTCHA verification failed', 403);
    }

    $assessmentUrl = 'https://recaptchaenterprise.googleapis.com/v1/projects/'
        . $RECAPTCHA_PROJECT . '/assessments?key=' . $RECAPTCHA_SECRET;

    $assessmentBody = json_encode([
        'event' => [
            'token'          => $recaptchaToken,
            'siteKey'        => $RECAPTCHA_SITE_KEY,
            'expectedAction' => 'CONTACT_FORM',
        ],
    ]);

    $ch = curl_init($assessmentUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $assessmentBody,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);

    $recaptchaRaw = curl_exec($ch);
    $curlError    = curl_errno($ch);
    curl_close($ch);

    if ($recaptchaRaw === false || $curlError !== 0) {
        jsonResponse(false, 'Verification service unavailable. Please try again later.', 503);
    }

    $recaptchaResult = json_decode($recaptchaRaw, true);

    // Check token validity
    if (
        !is_array($recaptchaResult)
        || empty($recaptchaResult['tokenProperties']['valid'])
    ) {
        jsonResponse(false, 'reCAPTCHA verification failed', 403);
    }

    // Check score (0.0 = bot, 1.0 = human) — reject below 0.5
    $score = $recaptchaResult['riskAnalysis']['score'] ?? 0.0;
    if ($score < 0.5) {
        jsonResponse(false, 'reCAPTCHA verification failed', 403);
    }
}

// ── 6. Input sanitization ───────────────────────────────────────────────────
$name       = trim(strip_tags($_POST['name'] ?? ''));
$email      = trim(strip_tags($_POST['email'] ?? ''));
$phone      = trim(strip_tags($_POST['phone'] ?? ''));
$event_type = trim(strip_tags($_POST['event_type'] ?? ''));
$attendance = trim(strip_tags($_POST['attendance'] ?? ''));
$venue      = trim(strip_tags($_POST['venue'] ?? ''));
$date_time  = trim(strip_tags($_POST['date_time'] ?? ''));
$service    = trim(strip_tags($_POST['service'] ?? ''));
$message    = trim(strip_tags($_POST['message'] ?? ''));

// Sanitize vibes[] — array of strings, each strip_tags + trim
$rawVibes = $_POST['vibes'] ?? [];
if (!is_array($rawVibes)) {
    $rawVibes = [];
}
$vibes = array_values(array_filter(array_map(function ($v) {
    return trim(strip_tags((string) $v));
}, $rawVibes), function ($v) {
    return $v !== '';
}));

// Reject newline characters in single-line fields (header injection protection)
$singleLineFields = [$name, $email, $phone, $event_type, $attendance, $venue, $date_time, $service];
foreach ($vibes as $v) {
    $singleLineFields[] = $v;
}
foreach ($singleLineFields as $value) {
    if (preg_match("/[\r\n]/", $value)) {
        jsonResponse(false, 'Invalid characters in input', 422);
    }
}

// ── 7. Validate required fields ─────────────────────────────────────────────
if (
    $name === '' ||
    $email === '' ||
    $phone === '' ||
    $event_type === '' ||
    $attendance === '' ||
    $venue === '' ||
    $date_time === '' ||
    $service === '' ||
    $message === '' ||
    empty($vibes)
) {
    jsonResponse(false, 'Please fill in all required fields', 422);
}

// ── 8. Validate email & phone ───────────────────────────────────────────────
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Please provide a valid email address', 422);
}

if (!preg_match('/^\+?1?[\s.\-]?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/', $phone)) {
    jsonResponse(false, 'Please provide a valid US phone number', 422);
}

// Build sanitized $data array for email dispatch
$data = [
    'name'       => $name,
    'email'      => $email,
    'phone'      => $phone,
    'event_type' => $event_type,
    'attendance' => $attendance,
    'venue'      => $venue,
    'date_time'  => $date_time,
    'service'    => $service,
    'vibes'      => $vibes,
    'message'    => $message,
];

// ── 9. Send emails ──────────────────────────────────────────────────────────

/**
 * Render a PHP template file with the given data array.
 * Uses output buffering to capture the template's HTML output.
 *
 * @param string $templatePath Absolute path to the template file
 * @param array  $data         Associative array of form data
 * @return string Rendered HTML
 */
function renderTemplate(string $templatePath, array $data): string
{
    if (!file_exists($templatePath)) {
        return '';
    }
    ob_start();
    include $templatePath;
    return ob_get_clean();
}

// Render email templates
$ownerHtml       = renderTemplate(__DIR__ . '/templates/owner-notification.php', $data);
$confirmationHtml = renderTemplate(__DIR__ . '/templates/user-confirmation.php', $data);

// ── Send owner notification email ───────────────────────────────────────────
$ownerSubject = $EMAIL_SUBJECT;
$ownerHeaders  = "From: " . $FROM_NAME . " <" . $FROM_EMAIL . ">\r\n";
$ownerHeaders .= "Reply-To: " . $data['email'] . "\r\n";
$ownerHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

$ownerSent = true;
foreach ($OWNER_EMAILS as $ownerAddr) {
    if (!mail($ownerAddr, $ownerSubject, $ownerHtml, $ownerHeaders)) {
        $ownerSent = false;
    }
}

// ── Send user confirmation email ────────────────────────────────────────────
$confirmSubject = $EMAIL_SUBJECT;
$confirmHeaders  = "From: " . $FROM_NAME . " <" . $FROM_EMAIL . ">\r\n";
$confirmHeaders .= "Reply-To: info@djmisha.com\r\n";
$confirmHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

$confirmSent = mail($data['email'], $confirmSubject, $confirmationHtml, $confirmHeaders);

// ── Check for mail failures ─────────────────────────────────────────────────
if (!$ownerSent || !$confirmSent) {
    jsonResponse(false, 'Failed to send email. Please try again later.', 500);
}

// ── 10. Success response ────────────────────────────────────────────────────
jsonResponse(true, 'Thank you! Your message has been sent successfully.');
