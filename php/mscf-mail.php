<?php
/**
 * Multi-step contact form mail helpers — php/mscf-mail.php
 *
 * Included by process-multistep-form.php. No side effects on include.
 * The plain-text confirmation is built from the form data so it matches
 * the HTML template's copy without being a tag-stripped version of that HTML.
 */

/**
 * First name for the confirmation greeting.
 *
 * Same rule as the greeting in php/templates/mscf-user-confirmation.php:
 * the first whitespace-delimited token of the trimmed name, or the original
 * name when that token is empty.
 */
function mscfFirstName(string $name): string
{
    $parts = preg_split('/\s+/', trim($name), 2);
    $first = is_array($parts) && isset($parts[0]) ? $parts[0] : '';

    return $first !== '' ? $first : $name;
}

/**
 * Plain-text client confirmation for one inquiry.
 *
 * @param array $data Form fields: name, email, phone, venue, date_time,
 *                    attendance, service, vibes, message
 */
function mscfBuildConfirmationText(array $data): string
{
    $name = (string) ($data['name'] ?? '');
    $email = (string) ($data['email'] ?? '');
    $phone = (string) ($data['phone'] ?? '');
    $dateTime = (string) ($data['date_time'] ?? '');
    $attendance = (string) ($data['attendance'] ?? '');
    $service = (string) ($data['service'] ?? '');
    $message = (string) ($data['message'] ?? '');

    $vibes = $data['vibes'] ?? [];
    if (!is_array($vibes)) {
        $vibes = [];
    }
    $vibesDisplay = implode(', ', array_map(function ($vibe) {
        return (string) $vibe;
    }, $vibes));

    $lines = [];
    $lines[] = 'Hey ' . mscfFirstName($name) . ',';
    $lines[] = '';
    $lines[] = "Thanks for getting in touch — I've got your details, and I'd love to provide the music for your event!";
    $lines[] = '';
    $lines[] = 'Texting is the quickest way to reach me, so look for my text soon, and feel free to text me directly at (619) 786-2664.';
    $lines[] = '';
    $lines[] = "In the meantime, I'd love to hear your musical vision. What songs, artists and vibes get you excited, and is there anything else on your mind about the music?";
    $lines[] = '';
    $lines[] = "Also, in case it's helpful: I travel for events across the US and internationally, and I can bring a live saxophonist to any event.";
    $lines[] = '';
    $lines[] = 'xoxo,';
    $lines[] = 'DJ Misha and Team';
    $lines[] = '';
    $lines[] = '🌐 https://djmisha.com';
    $lines[] = '📸 @djmishasd https://www.instagram.com/djmishasd/';
    $lines[] = '⭐ Reviews https://maps.google.com/?cid=4588623592185050136';
    $lines[] = '';
    $lines[] = 'Below is a copy of your inquiry:';
    $lines[] = '';
    $lines[] = 'Name: ' . $name;
    $lines[] = 'Email Address: ' . $email;
    $lines[] = 'Phone Number: ' . $phone;
    if (!empty($data['venue'])) {
        $lines[] = 'Venue / Location: ' . (string) $data['venue'];
    }
    $lines[] = 'Event Date & Time: ' . $dateTime;
    $lines[] = 'Expected Attendance: ' . $attendance;
    $lines[] = 'Select a service: ' . $service;
    $lines[] = 'Vibes & mood: ' . $vibesDisplay;
    $lines[] = 'Message: ' . $message;

    return implode("\n", $lines) . "\n";
}

/**
 * multipart/alternative body for the client confirmation.
 *
 * Text/plain comes first, then text/html. Both parts are quoted-printable
 * UTF-8. The boundary is regenerated when it occurs in either part.
 *
 * @return array{headers: string, body: string}
 */
function mscfBuildMultipartAlternative(string $text, string $html): array
{
    $toCrlf = static function (string $value): string {
        $value = str_replace(["\r\n", "\r"], "\n", $value);
        return str_replace("\n", "\r\n", $value);
    };

    // quoted_printable_encode() soft-wraps with LF. Normalize to CRLF so the
    // message on the wire uses CRLF line endings throughout.
    $encode = static function (string $value) use ($toCrlf): string {
        return $toCrlf(quoted_printable_encode($toCrlf($value)));
    };

    $plain = $encode($text);
    $htmlPart = $encode($html);

    do {
        $boundary = '=_mscf_' . bin2hex(random_bytes(16));
    } while (
        str_contains($text, $boundary)
        || str_contains($html, $boundary)
        || str_contains($plain, $boundary)
        || str_contains($htmlPart, $boundary)
    );

    $headers = 'MIME-Version: 1.0' . "\r\n"
        . 'Content-Type: multipart/alternative; boundary="' . $boundary . '"' . "\r\n";

    $part = static function (string $mediaType, string $encoded) use ($boundary): string {
        return '--' . $boundary . "\r\n"
            . 'Content-Type: ' . $mediaType . '; charset=UTF-8' . "\r\n"
            . "Content-Transfer-Encoding: quoted-printable\r\n"
            . "\r\n"
            . $encoded
            // This CRLF belongs to the following boundary delimiter, so the
            // encoded part (including a trailing newline) is preserved.
            . "\r\n";
    };

    $body = $part('text/plain', $plain)
        . $part('text/html', $htmlPart)
        . '--' . $boundary . '--' . "\r\n";

    return [
        'headers' => $headers,
        'body' => $body,
    ];
}
