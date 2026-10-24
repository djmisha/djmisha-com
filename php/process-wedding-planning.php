<?php
header('Content-Type: application/json; charset=utf-8');

function jsonResponse(bool $ok, array $payload = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, ...$payload]);
    exit;
}

function cleanText($value): string
{
    if (!is_scalar($value) && $value !== null) {
        return '';
    }

    $value = (string) $value;
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
    $value = preg_replace('/[\r\n\t]+/', ' ', $value);
    return trim((string) $value);
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function integerValue($value): ?int
{
    if (!is_scalar($value)) {
        return null;
    }

    $parsed = filter_var((string) $value, FILTER_VALIDATE_INT);
    return $parsed === false ? null : $parsed;
}

function cleanArrayValues($value, array $allowed): ?array
{
    if (!is_array($value)) {
        return [];
    }

    $clean = [];
    foreach ($value as $item) {
        if (!is_scalar($item)) {
            return null;
        }

        $entry = cleanText($item);
        if ($entry === '') {
            continue;
        }

        if (!in_array($entry, $allowed, true)) {
            return null;
        }

        $clean[] = $entry;
    }

    return array_values(array_unique($clean));
}

function displayValues(array $values, array $labels): string
{
    return implode(', ', array_map(
        static fn(string $value): string => $labels[$value] ?? $value,
        $values
    ));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, ['errors' => ['request' => 'Method not allowed.']], 405);
}

$honeypot = cleanText($_POST['website'] ?? '');
if ($honeypot !== '') {
    jsonResponse(true, ['message' => 'Thank you. Your response has been received.']);
}

$name = trim(strip_tags(cleanText($_POST['name'] ?? '')));
$timeline = cleanText($_POST['timeline'] ?? '');
$spaceTypeOther = cleanText($_POST['space_type_other'] ?? '');
$weddingPriorities = cleanText($_POST['wedding_priorities'] ?? '');
$anythingElse = cleanText($_POST['anything_else'] ?? '');
$meetingDay = cleanText($_POST['meeting_day'] ?? '');
$contactMethod = cleanText($_POST['contact_method'] ?? '');
$bestTime = cleanText($_POST['best_time'] ?? '');
$songsToSkip = cleanText($_POST['songs_to_skip'] ?? '');
$budgetMin = integerValue($_POST['budget_min'] ?? null);
$budgetMax = integerValue($_POST['budget_max'] ?? null);
$musicInvolvement = integerValue($_POST['music_involvement'] ?? null);
$planningStyle = integerValue($_POST['planning_style'] ?? null);
$budgetTouched = cleanText($_POST['budget_touched'] ?? '');

$allowedParts = ['ceremony', 'cocktail_hour', 'reception'];
$allowedSpaces = ['ballroom', 'tent_or_marquee', 'outdoors', 'barn', 'inside_a_house', 'other', 'backyard'];
$allowedMoments = ['grand_entrance', 'first_dance', 'parent_dances', 'cake_cutting', 'bouquet_garter', 'last_dance', 'not_sure_yet'];
$allowedMusicStyles = ['dance', 'pop', 'disco', 'funk', 'edm', 'house', 'tech_house', 'hip_hop', 'rnb', 'sing_alongs', 'rock', 'country', 'latin', 'reggaeton', 'reggae', 'dancehall', 'soul', 'indie', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
$allowedLighting = ['uplighting', 'basic_dance_floor_lighting', 'advanced_dance_floor_buildout', 'whole_room_lighting', 'not_interested'];
$allowedAddons = ['live_saxophone', 'live_guitar', 'live_violin', 'portrait_lounge', 'lighting_design', 'none'];
$allowedDecisionStages = ['browsing', 'comparing_vendors', 'few_questions', 'only_dj'];
$allowedContactMethods = ['text', 'email', 'phone_call'];
$allowedBestTimes = ['mornings', 'afternoons', 'evenings', 'no_preference'];
$allowedCoordinatorValues = ['yes', 'no', 'not_sure'];
$allowedMeetingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
$allowedMcStyles = ['light_professional', 'front_and_center'];

$errors = [];

if ($name === '' || textLength($name) > 100) {
    $errors['name'] = 'Please provide a name under 100 characters.';
}

$partsOfDay = cleanArrayValues($_POST['parts_of_day'] ?? [], $allowedParts);
if (is_array($partsOfDay) && count($partsOfDay) < 1) {
    $errors['parts_of_day'] = 'Please select at least one part of your day.';
} elseif ($partsOfDay === null) {
    $errors['parts_of_day'] = 'Please select a valid option for your day.';
}

if (textLength($timeline) < 10 || textLength($timeline) > 2000) {
    $errors['timeline'] = 'Please tell us a rough timeline.';
}

$spaceType = cleanArrayValues($_POST['space_type'] ?? [], $allowedSpaces);
if (is_array($spaceType) && count($spaceType) < 1) {
    $errors['space_type'] = 'Please tell us where the music will happen.';
} elseif ($spaceType === null) {
    $errors['space_type'] = 'Please select a valid space type.';
}

if (textLength($spaceTypeOther) > 150) {
    $errors['space_type'] = 'Please keep the other space description under 150 characters.';
} elseif (is_array($spaceType) && in_array('other', $spaceType, true) && $spaceTypeOther === '') {
    $errors['space_type_other'] = 'Please tell us more about the other space type.';
}

$keyMoments = cleanArrayValues($_POST['key_moments'] ?? [], $allowedMoments);
if (is_array($keyMoments) && count($keyMoments) < 1) {
    $errors['key_moments'] = 'Please choose at least one key moment.';
} elseif ($keyMoments === null) {
    $errors['key_moments'] = 'Please choose a valid key moment.';
}

$mcStyle = cleanText($_POST['mc_style'] ?? '');
if ($mcStyle === '' || !in_array($mcStyle, $allowedMcStyles, true)) {
    $errors['mc_style'] = 'Please pick the MC style that fits your day.';
}

$coordinator = cleanText($_POST['coordinator'] ?? '');
if ($coordinator === '' || !in_array($coordinator, $allowedCoordinatorValues, true)) {
    $errors['coordinator'] = 'Please tell us whether you have a planner or coordinator.';
}

$musicStyles = cleanArrayValues($_POST['music_styles'] ?? [], $allowedMusicStyles);
if (is_array($musicStyles) && count($musicStyles) < 1) {
    $errors['music_styles'] = 'Please pick at least one music style.';
} elseif ($musicStyles === null) {
    $errors['music_styles'] = 'Please select valid music styles.';
}

if ($musicInvolvement === null || $musicInvolvement < 1 || $musicInvolvement > 5) {
    $errors['music_involvement'] = 'Please choose a music planning level.';
}

if ($planningStyle === null || $planningStyle < 1 || $planningStyle > 5) {
    $errors['planning_style'] = 'Please choose your planning style.';
}

$lighting = cleanArrayValues($_POST['lighting'] ?? [], $allowedLighting);
if (is_array($lighting) && count($lighting) < 1) {
    $errors['lighting'] = 'Please select at least one lighting option.';
} elseif ($lighting === null) {
    $errors['lighting'] = 'Please choose valid lighting options.';
} elseif (in_array('not_interested', $lighting, true) && count($lighting) > 1) {
    $errors['lighting'] = 'Please choose either lighting services or no lighting services.';
}

$addons = cleanArrayValues($_POST['addons'] ?? [], $allowedAddons);
if (is_array($addons) && count($addons) < 1) {
    $errors['addons'] = 'Please choose at least one add-on or select none.';
} elseif ($addons === null) {
    $errors['addons'] = 'Please choose valid add-ons.';
} elseif (in_array('none', $addons, true) && count($addons) > 1) {
    $errors['addons'] = 'Please choose either add-ons or none.';
}

if (
    $budgetMin === null ||
    $budgetMax === null ||
    $budgetMin < 2500 ||
    $budgetMin > 10000 ||
    $budgetMax < 2500 ||
    $budgetMax > 10000 ||
    $budgetMin + 250 > $budgetMax ||
    $budgetMin % 250 !== 0 ||
    $budgetMax % 250 !== 0
) {
    $errors['budget'] = 'Please choose a valid budget range.';
}

$budgetTouched = in_array($budgetTouched, ['true', 'false'], true) ? $budgetTouched : '';
if ($budgetTouched === '') {
    $errors['budget'] = 'Please choose a valid budget range.';
}

$decisionStage = cleanText($_POST['decision_stage'] ?? '');
if ($decisionStage === '' || !in_array($decisionStage, $allowedDecisionStages, true)) {
    $errors['decision_stage'] = 'Please pick where you are in your decision.';
}

if (textLength($weddingPriorities) > 1000) {
    $errors['wedding_priorities'] = 'Please keep your wedding priorities under 1,000 characters.';
}

if (textLength($songsToSkip) > 1500) {
    $errors['songs_to_skip'] = 'Please keep your song notes under 1,500 characters.';
}

if ($contactMethod === '' || !in_array($contactMethod, $allowedContactMethods, true)) {
    $errors['contact_method'] = 'Please pick the best way to reach you.';
}

if ($bestTime !== '' && !in_array($bestTime, $allowedBestTimes, true)) {
    $errors['best_time'] = 'Please choose a valid time preference.';
}

if (textLength($anythingElse) > 2000) {
    $errors['anything_else'] = 'Please keep your note under 2,000 characters.';
}

if ($meetingDay !== '' && !in_array($meetingDay, $allowedMeetingDays, true)) {
    $errors['meeting_day'] = 'Please choose a valid weekday.';
}

if (!empty($errors)) {
    jsonResponse(false, ['errors' => $errors], 400);
}

$choiceLabels = [
    'ceremony' => 'Ceremony',
    'cocktail_hour' => 'Cocktail hour',
    'reception' => 'Reception',
    'ballroom' => 'Ballroom',
    'tent_or_marquee' => 'Tent or marquee',
    'outdoors' => 'Outdoors',
    'barn' => 'Barn',
    'inside_a_house' => 'Inside a house',
    'other' => 'Other',
    'backyard' => 'Backyard',
    'grand_entrance' => 'Grand entrance',
    'first_dance' => 'First dance',
    'parent_dances' => 'Parent dances',
    'cake_cutting' => 'Cake cutting',
    'bouquet_garter' => 'Bouquet/garter',
    'last_dance' => 'Last dance or send-off',
    'not_sure_yet' => "I'm not sure yet",
    'pop' => 'Pop',
    'dance' => 'Dance',
    'disco' => 'Disco',
    'funk' => 'Funk',
    'edm' => 'EDM',
    'house' => 'House',
    'tech_house' => 'Tech house',
    'hip_hop' => 'Hip hop',
    'rnb' => 'R&B',
    'sing_alongs' => 'Sing-alongs',
    'rock' => 'Rock',
    'country' => 'Country',
    'latin' => 'Latin',
    'reggaeton' => 'Reggaeton',
    'reggae' => 'Reggae',
    'dancehall' => 'Dancehall',
    'soul' => 'Soul',
    'indie' => 'Indie',
    '1970s' => "70's",
    '1980s' => "80's",
    '1990s' => "90's",
    '2000s' => "2000's",
    '2010s' => "2010's",
    '2020s' => "2020's",
    'light_professional' => 'Light and professional',
    'front_and_center' => 'Front and center',
    'yes' => 'Yes',
    'no' => 'No',
    'not_sure' => "I'm not sure yet",
    'uplighting' => 'Uplighting',
    'basic_dance_floor_lighting' => 'Basic dance floor lighting',
    'advanced_dance_floor_buildout' => 'Advanced dance floor lighting build-out',
    'whole_room_lighting' => 'Whole-room lighting and décor',
    'not_interested' => "I'm not interested in lighting services",
    'live_saxophone' => 'Live saxophone',
    'live_guitar' => 'Live guitar',
    'live_violin' => 'Live violin',
    'portrait_lounge' => 'Portrait lounge',
    'lighting_design' => 'Lighting design',
    'none' => 'None of these',
    'browsing' => "I'm just getting started and browsing",
    'comparing_vendors' => "I'm comparing different vendors",
    'few_questions' => "I'm very interested and just have a few questions for you",
    'only_dj' => "You're the only DJ for us",
    'text' => 'Text',
    'email' => 'Email',
    'phone_call' => 'Phone call',
    'mornings' => 'Mornings',
    'afternoons' => 'Afternoons',
    'evenings' => 'Evenings',
    'no_preference' => 'No preference',
    'monday' => 'Monday',
    'tuesday' => 'Tuesday',
    'wednesday' => 'Wednesday',
    'thursday' => 'Thursday',
    'friday' => 'Friday',
];
$musicInvolvementLabels = [
    1 => 'I trust you completely. Surprise me.',
    2 => "Here's the vibe and some songs I love. You take it from there.",
    3 => "I'll give you must-plays and do-not-plays, and you handle the rest.",
    4 => "I'll make playlists to give you a good idea for each portion of the day.",
    5 => "I'll give you playlists and want them played in exact order.",
];
$planningStyleLabels = [
    1 => 'Super chill',
    2 => 'Certain things I care about',
    3 => 'Somewhat particular',
    4 => 'Very particular',
    5 => 'Total Bridezilla',
];
$to = 'info@djmisha.com, misha.osinovskiy@gmail.com';
$subject = 'Contact from djmisha.com - ' . $name;
$timestamp = (new DateTimeImmutable('now', new DateTimeZone('America/Los_Angeles')))
    ->format('M j, Y g:i A T');

$bodyLines = [
    'PLANNING FORM SUBMITTED',
    'Name: ' . $name,
    'Preferred contact method: ' . $choiceLabels[$contactMethod],
    'Best time to reach you: ' . ($bestTime !== '' ? $choiceLabels[$bestTime] : 'No preference'),
    'Submitted: ' . $timestamp,
    '',
    'YOUR DAY',
    'Parts of your day: ' . displayValues($partsOfDay ?? [], $choiceLabels),
    'Timeline: ' . $timeline,
    'Spaces: ' . displayValues($spaceType ?? [], $choiceLabels) . ($spaceTypeOther !== '' ? ' / ' . $spaceTypeOther : ''),
    'Key moments to highlight: ' . displayValues($keyMoments ?? [], $choiceLabels),
    'MC style: ' . $choiceLabels[$mcStyle],
    'Planner or day-of coordinator: ' . $choiceLabels[$coordinator],
    '',
    'YOUR MUSIC',
    'Music genres and decades: ' . displayValues($musicStyles ?? [], $choiceLabels),
    'Songs to skip: ' . $songsToSkip,
    'Music involvement: ' . $musicInvolvement . '/5 - ' . $musicInvolvementLabels[$musicInvolvement],
    'Planning style: ' . $planningStyle . '/5 - ' . $planningStyleLabels[$planningStyle],
    '',
    'THE EXTRAS',
    'Lighting: ' . displayValues($lighting ?? [], $choiceLabels),
    'Add-ons: ' . displayValues($addons ?? [], $choiceLabels),
    'Budget: $' . number_format($budgetMin) . ' - $' . number_format($budgetMax),
    'Budget range: ' . ($budgetTouched === 'true' ? 'Adjusted by couple' : 'Not adjusted from default'),
    '',
    'WHERE YOU ARE',
    'Decision stage: ' . $choiceLabels[$decisionStage],
    'Most important on your wedding day: ' . $weddingPriorities,
    'Anything else: ' . $anythingElse,
    '',
    'MEETING REQUEST',
    'Requested weekday: ' . ($meetingDay !== '' ? $choiceLabels[$meetingDay] . ' at 2:00 PM Pacific (requested, not confirmed)' : 'Skipped')
];

$body = implode("\n", $bodyLines);
$headers = [
    'From: no-reply@djmisha.com',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    error_log('Failed to send wedding planning form email.');
    jsonResponse(false, ['errors' => ['form' => 'We could not send your answers. Please try again.']], 500);
}

jsonResponse(true, ['message' => 'Thank you. Your response has been received.']);
