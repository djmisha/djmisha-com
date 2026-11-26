import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const processorPath = path.join(root, 'php/process-multistep-form.php');
const mailPath = path.join(root, 'php/mscf-mail.php');
const templatePath = path.join(
  root,
  'php/templates/mscf-user-confirmation.php',
);

const janeDoe = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '(619) 555-0100',
  venue: 'The Pearl',
  date_time: 'June 15, 2026 at 5:00 PM',
  attendance: '150',
  service: 'Wedding',
  vibes: ['Chill', 'Epic'],
  message: 'We love disco & jazz.',
};

function hasPhp() {
  try {
    execFileSync('php', ['-r', 'exit(0);'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  expect(from).toBeGreaterThanOrEqual(0);
  expect(to).toBeGreaterThan(from);
  return source.slice(from, to);
}

function decodeQuotedPrintable(encoded) {
  const stripped = encoded.replace(/=\r\n/g, '');
  const bytes = [];
  for (let i = 0; i < stripped.length; i += 1) {
    if (
      stripped[i] === '=' &&
      i + 2 < stripped.length &&
      /^[0-9A-F]{2}$/i.test(stripped.slice(i + 1, i + 3))
    ) {
      bytes.push(parseInt(stripped.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      const code = stripped.charCodeAt(i);
      if (code > 255) {
        throw new Error(`Non-ASCII byte in quoted-printable: ${stripped[i]}`);
      }
      bytes.push(code);
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

function buildMail(data) {
  const runnerPath = path.join(os.tmpdir(), `mscf-mail-${process.pid}.php`);
  fs.writeFileSync(
    runnerPath,
    `<?php
$data = json_decode(getenv('MSCF_DATA'), true);
if (!is_array($data)) {
    fwrite(STDERR, "MSCF_DATA is not an array\\n");
    exit(1);
}
require getenv('MSCF_MAIL');
$text = mscfBuildConfirmationText($data);
ob_start();
include getenv('MSCF_TEMPLATE');
$html = ob_get_clean();
$mail = mscfBuildMultipartAlternative($text, $html);
echo json_encode(
    [
        'text' => $text,
        'html' => $html,
        'headers' => $mail['headers'],
        'body' => $mail['body'],
    ],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
);
`,
  );
  try {
    const stdout = execFileSync('php', [runnerPath], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        MSCF_DATA: JSON.stringify(data),
        MSCF_MAIL: mailPath,
        MSCF_TEMPLATE: templatePath,
      },
    });
    return JSON.parse(stdout);
  } finally {
    fs.unlinkSync(runnerPath);
  }
}

function parseAlternative(headers, body) {
  expect(headers).not.toMatch(/\r(?!\n)/);
  expect(headers).not.toMatch(/[^\r]\n/);
  expect(body).not.toMatch(/\r(?!\n)/);
  expect(body).not.toMatch(/[^\r]\n/);
  expect(headers).not.toMatch(/Content-Type:\s*text\/html/i);
  expect(headers).not.toContain('base64');
  expect(body).not.toContain('base64');

  const headerMatch = headers.match(
    /^MIME-Version: 1\.0\r\nContent-Type: multipart\/alternative; boundary="(=_mscf_[0-9a-f]{32})"\r\n$/,
  );
  expect(headerMatch).not.toBeNull();
  const boundary = headerMatch[1];

  expect(body.startsWith(`--${boundary}\r\n`)).toBe(true);
  expect(body.endsWith(`--${boundary}--\r\n`)).toBe(true);
  expect(body.split(`--${boundary}\r\n`).length - 1).toBe(2);

  const rawPart = (which) => {
    const delimiter = `--${boundary}\r\n`;
    let from = 0;
    for (let i = 0; i <= which; i += 1) {
      const at = body.indexOf(delimiter, from);
      expect(at).toBeGreaterThanOrEqual(0);
      from = at + delimiter.length;
    }
    const next = body.indexOf(`\r\n--${boundary}`, from);
    expect(next).toBeGreaterThan(from);
    return body.slice(from, next);
  };

  const splitPart = (raw) => {
    const splitAt = raw.indexOf('\r\n\r\n');
    expect(splitAt).toBeGreaterThan(0);
    return {
      headers: raw.slice(0, splitAt),
      encoded: raw.slice(splitAt + 4),
    };
  };

  const plain = splitPart(rawPart(0));
  const html = splitPart(rawPart(1));
  expect(plain.headers).toBe(
    'Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable',
  );
  expect(html.headers).toBe(
    'Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable',
  );
  expect(body.indexOf('Content-Type: text/plain; charset=UTF-8')).toBeLessThan(
    body.indexOf('Content-Type: text/html; charset=UTF-8'),
  );

  return {
    boundary,
    text: decodeQuotedPrintable(plain.encoded).replace(/\r\n/g, '\n'),
    html: decodeQuotedPrintable(html.encoded).replace(/\r\n/g, '\n'),
  };
}

describe('mscf confirmation mail', () => {
  const processor = fs.readFileSync(processorPath, 'utf8');
  const mailer = fs.readFileSync(mailPath, 'utf8');

  it('sends the client confirmation from info@ and owner mail from no-reply@', () => {
    expect(processor).toMatch(/\$FROM_EMAIL\s*=\s*'no-reply@djmisha\.com'/);
    expect(processor).toMatch(/\$FROM_NAME\s*=\s*'djmisha\.com'/);
    expect(processor).toMatch(/\$CONFIRM_FROM_EMAIL\s*=\s*'info@djmisha\.com'/);
    expect(processor).toMatch(/\$CONFIRM_FROM_NAME\s*=\s*'DJ Misha'/);
    expect(processor).toContain("require_once __DIR__ . '/mscf-mail.php'");

    const owner = between(
      processor,
      'Send owner notification email',
      'Send optional Verizon lead notification email',
    );
    const verizon = between(
      processor,
      'Send optional Verizon lead notification email',
      'Send user confirmation email',
    );
    const confirm = between(
      processor,
      'Send user confirmation email',
      'Check for mail failures',
    );

    expect(owner.match(/MIME-Version: 1\.0/g)).toHaveLength(1);
    expect(owner).toContain('$FROM_NAME . " <" . $FROM_EMAIL');
    expect(owner).toContain("Reply-To: \" . $data['email']");
    expect(owner).toContain(
      "mail($ownerAddr, $ownerSubject, $ownerHtml, $ownerHeaders, '-f ' . $FROM_EMAIL)",
    );
    expect(owner).not.toContain('info@djmisha.com');
    expect(owner).not.toContain('$CONFIRM_FROM');

    expect(verizon.match(/MIME-Version: 1\.0/g)).toHaveLength(1);
    expect(verizon).toContain('Content-Type: text/plain; charset=UTF-8');
    expect(verizon).toContain(
      "mail($VERIZON_TO_EMAIL, '', $verizonHtml, $verizonHeaders, '-f ' . $VERIZON_FROM_EMAIL)",
    );

    expect(confirm).toContain(
      '$CONFIRM_FROM_NAME . " <" . $CONFIRM_FROM_EMAIL',
    );
    expect(confirm).toContain('Reply-To: " . $CONFIRM_FROM_EMAIL');
    expect(confirm).toContain('mscfBuildConfirmationText($data)');
    expect(confirm).toContain(
      'mscfBuildMultipartAlternative($confirmText, $confirmationHtml)',
    );
    expect(confirm).toContain("$confirmationMail['headers']");
    expect(confirm).toContain("$confirmationMail['body']");
    expect(confirm).toContain("$EMAIL_SUBJECT . ' - ' . $data['name']");
    expect(confirm).toContain(
      "mail($data['email'], $confirmSubject, $confirmationMail['body'], $confirmHeaders, '-f ' . $CONFIRM_FROM_EMAIL)",
    );
    expect(confirm).not.toContain('MIME-Version:');
    expect(confirm).not.toContain('text/html');
    expect(confirm).not.toContain('no-reply@');
    expect(confirm).not.toMatch(/\$FROM_EMAIL/);
    expect(confirm).not.toMatch(/\$FROM_NAME/);

    expect(mailer).toContain("'=_mscf_' . bin2hex(random_bytes(16))");
    expect(mailer).toContain('str_contains($text, $boundary)');
    expect(mailer).toContain('str_contains($html, $boundary)');
    expect(mailer).toContain('quoted_printable_encode(');
    expect(mailer).not.toContain('base64');
    expect(mailer.indexOf("part('text/plain'")).toBeLessThan(
      mailer.indexOf("part('text/html'"),
    );
  });

  it.skipIf(!hasPhp())(
    'builds a quoted-printable multipart/alternative confirmation',
    () => {
      const mail = buildMail(janeDoe);
      const parsed = parseAlternative(mail.headers, mail.body);

      expect(parsed.text).toBe(mail.text);
      expect(parsed.html).toBe(mail.html);
      expect(parsed.text).toContain('Hey Jane,');
      expect(parsed.text).not.toContain('Hey Jane Doe');
      expect(parsed.text).toContain(
        "Thanks for getting in touch \u2014 I've got your details, and I'd love to provide the music for your event!",
      );
      expect(parsed.text).toContain(
        'Texting is the quickest way to reach me, so look for my text soon, and feel free to text me directly at (619) 786-2664.',
      );
      expect(parsed.text).toContain(
        "In the meantime, I'd love to hear your musical vision. What songs, artists and vibes get you excited, and is there anything else on your mind about the music?",
      );
      expect(parsed.text).toContain(
        "Also, in case it's helpful: I travel for events across the US and internationally, and I can bring a live saxophonist to any event.",
      );
      expect(parsed.text).toContain('xoxo,\nDJ Misha and Team');
      expect(parsed.text).toContain('\u{1F310} https://djmisha.com');
      expect(parsed.text).toContain(
        '\u{1F4F8} @djmishasd https://www.instagram.com/djmishasd/',
      );
      expect(parsed.text).toContain(
        '\u2B50 Reviews https://maps.google.com/?cid=4588623592185050136',
      );
      expect(parsed.text).toContain('Below is a copy of your inquiry:');
      expect(parsed.text).toContain('Name: Jane Doe');
      expect(parsed.text).toContain('Email Address: jane@example.com');
      expect(parsed.text).toContain('Phone Number: (619) 555-0100');
      expect(parsed.text).toContain('Venue / Location: The Pearl');
      expect(parsed.text).toContain(
        'Event Date & Time: June 15, 2026 at 5:00 PM',
      );
      expect(parsed.text).toContain('Expected Attendance: 150');
      expect(parsed.text).toContain('Select a service: Wedding');
      expect(parsed.text).toContain('Vibes & mood: Chill, Epic');
      expect(parsed.text).toContain('Message: We love disco & jazz.');
      expect(parsed.text).not.toContain('&amp;');
      expect(parsed.text).not.toContain('expert.png');
      expect(parsed.text).not.toContain('<img');

      expect(parsed.html).toContain('width="125"');
      expect(parsed.html).toContain('height="118"');
      expect(parsed.html).toContain(
        'src="https://djmisha.com/images/expert.png"',
      );
      expect(parsed.html).toContain('We love disco &amp; jazz.');
      expect(parsed.html).toContain('Hey Jane,');
    },
  );

  it.skipIf(!hasPhp())(
    'omits an empty venue and keeps raw characters in the text part',
    () => {
      const noVenueMail = buildMail({ ...janeDoe, venue: '' });
      const noVenue = parseAlternative(noVenueMail.headers, noVenueMail.body);
      expect(noVenue.text).not.toContain('Venue / Location:');
      expect(noVenue.text).toContain('Phone Number: (619) 555-0100');
      expect(noVenue.text).toContain(
        'Event Date & Time: June 15, 2026 at 5:00 PM',
      );

      const unsafe = buildMail({
        ...janeDoe,
        name: 'Jo<hn Doe',
        message: 'A & B',
      });
      const parsed = parseAlternative(unsafe.headers, unsafe.body);
      expect(parsed.text).toContain('Hey Jo<hn,');
      expect(parsed.text).toContain('Name: Jo<hn Doe');
      expect(parsed.text).toContain('Message: A & B');
      expect(parsed.text).not.toContain('Jo&lt;hn');
      expect(parsed.text).not.toContain('&amp;');
      expect(parsed.html).toContain('Hey Jo&lt;hn,');
      expect(parsed.html).toContain('A &amp; B');

      const spaced = buildMail({ ...janeDoe, name: '   ' });
      const spacedText = parseAlternative(spaced.headers, spaced.body).text;
      expect(spacedText.startsWith('Hey    ,\n')).toBe(true);

      const middle = buildMail({ ...janeDoe, name: 'Jane Q Doe' });
      expect(parseAlternative(middle.headers, middle.body).text).toContain(
        'Hey Jane,',
      );
    },
  );

  it.skipIf(!hasPhp())('php -l accepts the touched PHP files', () => {
    for (const file of [
      'php/mscf-mail.php',
      'php/process-multistep-form.php',
      'php/templates/mscf-user-confirmation.php',
    ]) {
      const output = execFileSync('php', ['-l', path.join(root, file)], {
        encoding: 'utf8',
      });
      expect(output).toContain('No syntax errors detected');
    }
  });
});
