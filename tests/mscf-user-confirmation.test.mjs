import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = path.join(
  root,
  'php/templates/mscf-user-confirmation.php',
);
const source = fs.readFileSync(templatePath, 'utf8');
const inquiryMarker =
  '<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />';
const preambleMarker =
  '<body style="margin:0;padding:20px;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#444;line-height:1.6;">\n\n';

const sample = {
  name: 'Jane Q Doe',
  email: 'jane@example.com',
  phone: '(619) 555-0100',
  venue: 'The Pearl',
  date_time: 'June 15, 2026 at 5:00 PM',
  attendance: '150',
  vibes: ['Chill', 'Epic'],
  service: 'Wedding',
  message: 'We love disco & jazz.',
};

function readMainTemplate() {
  for (const ref of ['origin/main', 'main']) {
    try {
      return execFileSync(
        'git',
        ['show', `${ref}:php/templates/mscf-user-confirmation.php`],
        { cwd: root, encoding: 'utf8' },
      );
    } catch {
      // Try the next ref. A shallow checkout may only have one of them.
    }
  }
  return null;
}

function hasPhp() {
  try {
    execFileSync('php', ['-r', 'exit(0);'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function renderTemplate(filePath, data) {
  const runnerPath = path.join(
    os.tmpdir(),
    `mscf-user-confirmation-render-${process.pid}.php`,
  );
  fs.writeFileSync(
    runnerPath,
    `<?php
$data = json_decode(getenv('MSCF_DATA'), true);
include getenv('MSCF_TEMPLATE');
`,
  );
  try {
    return execFileSync('php', [runnerPath], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        MSCF_DATA: JSON.stringify(data),
        MSCF_TEMPLATE: filePath,
      },
    });
  } finally {
    fs.unlinkSync(runnerPath);
  }
}

function sectionFrom(html, marker) {
  const start = html.indexOf(marker);
  expect(start).toBeGreaterThanOrEqual(0);
  return html.slice(start);
}

describe('mscf user confirmation auto-reply', () => {
  const $ = load(source);

  it('replaces the greeting copy and keeps the inquiry block identical to main', () => {
    expect(source).toContain(
      "Hey <?= $e((($first = preg_split('/\\s+/', trim((string) $data['name']), 2)[0]) !== '' ? $first : $data['name'])) ?>,",
    );
    expect(source).toContain(
      "Thanks for getting in touch — I've got your details, and I'd love to provide the music for your event!",
    );
    expect(source).toContain(
      'Texting is the quickest way to reach me, so look for my text soon, and feel free to text me directly at',
    );
    expect(source).toContain(
      "I'd love to hear your musical vision. What songs, artists and vibes get you excited, and is there anything else on your mind about the music?",
    );
    expect(source).toContain(
      'I travel for events across the US and internationally, and I can bring a live saxophonist to any event.',
    );
    expect(source).toContain('xoxo,<br>DJ Misha and Team');
    expect(source).not.toContain('&mdash;');
    expect(source).toContain('🌐');
    expect(source).toContain('📸');
    expect(source).toContain('⭐');

    expect($('a[href="tel:+16197862664"]').text()).toBe('(619) 786-2664');

    const signature = $('p[style="margin:0;"]');
    expect(signature.find('a[href="https://djmisha.com"]').text()).toBe(
      'djmisha.com',
    );
    expect(
      signature.find('a[href="https://www.instagram.com/djmishasd/"]').text(),
    ).toBe('@djmishasd');
    expect(
      signature
        .find('a[href="https://maps.google.com/?cid=4588623592185050136"]')
        .text(),
    ).toBe('Reviews');

    const portrait = $('img[src="https://djmisha.com/images/expert.png"]');
    expect(portrait.attr('width')).toBe('96');
    expect(portrait.attr('height')).toBe('91');
    expect(portrait.attr('alt')).toBe('DJ Misha');
    expect(portrait.parent('a').attr('href')).toBe('https://djmisha.com');

    for (const removed of [
      'Find Me Online',
      'Check out my longtime collaborators',
      'jasonwhitmore.com',
      'brianpierini.com',
      'zola.com',
      'Pictures from Events on Zola',
      'Reviews &amp; Testimonials',
      'http://djmisha.com/',
      "Hey, <?= $e($data['name']) ?>!",
    ]) {
      expect(source).not.toContain(removed);
    }

    expect(source).toContain('<b>Below is a copy of your inquiry:</b>');
    expect(source).toContain("<b>Name:</b> <?= $e($data['name']) ?>");
    expect(source).toContain("<b>Email Address:</b> <?= $e($data['email']) ?>");
    expect(source).toContain("<b>Phone Number:</b> <?= $e($data['phone']) ?>");
    expect(source).toContain(
      "<b>Venue / Location:</b> <?= $e($data['venue']) ?>",
    );
    expect(source).toContain(
      "<b>Event Date &amp; Time:</b> <?= $e($data['date_time']) ?>",
    );
    expect(source).toContain(
      "<b>Expected Attendance:</b> <?= $e($data['attendance']) ?>",
    );
    expect(source).toContain(
      "<b>Select a service:</b> <?= $e($data['service']) ?>",
    );
    expect(source).toContain('<b>Vibes &amp; mood:</b> <?= $vibesDisplay ?>');
    expect(source).toContain("<b>Message:</b> <?= $e($data['message']) ?>");

    const main = readMainTemplate();
    expect(main).toBeTruthy();
    const preambleLength =
      source.indexOf(preambleMarker) + preambleMarker.length;
    expect(source.slice(0, preambleLength)).toBe(main.slice(0, preambleLength));
    expect(sectionFrom(source, inquiryMarker)).toBe(
      sectionFrom(main, inquiryMarker),
    );
  });

  it.skipIf(!hasPhp())(
    'renders the first name and the same inquiry section as main',
    () => {
      const rendered = renderTemplate(templatePath, sample);
      expect(rendered).toContain('<p style="margin:0 0 16px;">Hey Jane,</p>');
      expect(rendered).not.toContain('Hey, Jane Q Doe!');
      expect(rendered).not.toContain('Hey Jane Q Doe');

      const blank = renderTemplate(templatePath, { ...sample, name: '   ' });
      expect(blank).toContain('<p style="margin:0 0 16px;">Hey    ,</p>');

      const unsafe = renderTemplate(templatePath, {
        ...sample,
        name: 'Jo<hn Doe',
      });
      expect(unsafe).toContain('<p style="margin:0 0 16px;">Hey Jo&lt;hn,</p>');

      const mainSource = readMainTemplate();
      expect(mainSource).toBeTruthy();
      const mainPath = path.join(
        os.tmpdir(),
        `mscf-user-confirmation-main-${process.pid}.php`,
      );
      fs.writeFileSync(mainPath, mainSource);
      try {
        const mainRendered = renderTemplate(mainPath, sample);
        expect(mainRendered).toContain('Hey, Jane Q Doe!');
        expect(sectionFrom(rendered, inquiryMarker)).toBe(
          sectionFrom(mainRendered, inquiryMarker),
        );
      } finally {
        fs.unlinkSync(mainPath);
      }
    },
  );
});
