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
    return trim(preg_replace('/[\r\n\t]+/', ' ', cleanMultilineText($value)) ?? '');
}

function cleanMultilineText($value): string
{
    if (!is_scalar($value) && $value !== null) {
        return '';
    }

    $value = str_replace(["\r\n", "\r"], "\n", (string) $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
    return trim((string) $value);
}

function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    $length = preg_match_all('/./us', $value);
    return $length === false ? strlen($value) : $length;
}

function integerValue($value): ?int
{
    if (!is_scalar($value)) {
        return null;
    }

    $parsed = filter_var((string) $value, FILTER_VALIDATE_INT);
    return $parsed === false ? null : $parsed;
}

function cleanArrayValues($value, array $allowed, array $ignored = []): ?array
{
    if (!is_array($value)) {
        return null;
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

        if (in_array($entry, $ignored, true)) {
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

function displayLines(array $values, array $labels, string $empty = 'None selected'): string
{
    if ($values === []) {
        return $empty;
    }

    return implode("\n\n", array_map(
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
$timelineValues = [
    'ceremony' => [
        'label' => 'Ceremony',
        'start' => cleanText($_POST['timeline_ceremony_start'] ?? ''),
        'end' => cleanText($_POST['timeline_ceremony_end'] ?? ''),
        'touched' => cleanText($_POST['timeline_ceremony_touched'] ?? 'false'),
    ],
    'cocktail_hour' => [
        'label' => 'Cocktail hour',
        'start' => cleanText($_POST['timeline_cocktail_hour_start'] ?? ''),
        'end' => cleanText($_POST['timeline_cocktail_hour_end'] ?? ''),
        'touched' => cleanText($_POST['timeline_cocktail_hour_touched'] ?? 'false'),
    ],
    'reception_dinner' => [
        'label' => 'Reception & Dinner',
        'start' => cleanText($_POST['timeline_reception_dinner_start'] ?? ''),
        'end' => cleanText($_POST['timeline_reception_dinner_end'] ?? ''),
        'touched' => cleanText($_POST['timeline_reception_dinner_touched'] ?? 'false'),
    ],
    'dance_party' => [
        'label' => 'Dance party',
        'start' => cleanText($_POST['timeline_dance_party_start'] ?? ''),
        'end' => cleanText($_POST['timeline_dance_party_end'] ?? ''),
        'touched' => cleanText($_POST['timeline_dance_party_touched'] ?? 'false'),
    ],
    'afterparty' => [
        'label' => 'Afterparty',
        'start' => cleanText($_POST['timeline_afterparty_start'] ?? ''),
        'end' => cleanText($_POST['timeline_afterparty_end'] ?? ''),
        'touched' => cleanText($_POST['timeline_afterparty_touched'] ?? 'false'),
    ],
];
$spaceTypeOther = cleanText($_POST['space_type_other'] ?? '');
$weddingPriorities = cleanMultilineText($_POST['wedding_priorities'] ?? '');
$anythingElse = cleanMultilineText($_POST['anything_else'] ?? '');
$keyMomentsOther = cleanMultilineText($_POST['key_moments_other'] ?? '');
$favoriteSongs = cleanMultilineText($_POST['favorite_songs'] ?? '');
$competingVendors = cleanText($_POST['competing_vendors'] ?? '');
$meetingDay = cleanText($_POST['meeting_day'] ?? '');
$allowedContactMethods = ['text', 'email', 'phone_call'];
$allowedBestTimes = ['mornings', 'afternoons', 'evenings', 'no_preference'];
$contactMethod = cleanArrayValues($_POST['contact_method'] ?? [], $allowedContactMethods);
$bestTime = cleanArrayValues($_POST['best_time'] ?? [], $allowedBestTimes);
$songsToSkip = cleanMultilineText($_POST['songs_to_skip'] ?? '');
$allowedSongsToSkipCategories = [
    'overplayed_wedding_classics',
    'traditional_line_dances',
    'cheesy_gimmick_songs',
    'throwback_slow_downs',
    'explicit_unedited_tracks',
];
$songsToSkipCategories = cleanArrayValues(
    $_POST['songs_to_skip_categories'] ?? [],
    $allowedSongsToSkipCategories,
    ['grandmas_golden_oldies']
);
$spendingMindset = cleanText($_POST['spending_mindset'] ?? '');
$budgetMin = integerValue($_POST['budget_min'] ?? null);
$budgetMax = integerValue($_POST['budget_max'] ?? null);
$allowedMusicInvolvement = [
    'trust_expert',
    'vibe_demographic_guide',
    'curated_playlists',
    'structured_timeline_flow',
];
$musicInvolvement = cleanArrayValues(
    $_POST['music_involvement'] ?? [],
    $allowedMusicInvolvement
);
$planningStyle = cleanText($_POST['planning_style'] ?? '');
$budgetTouched = cleanText($_POST['budget_touched'] ?? '');

$allowedParts = ['ceremony', 'cocktail_hour', 'reception', 'afterparty'];
$allowedSpaces = ['indoor_event_space', 'ballroom', 'outdoors', 'tent_or_marquee', 'inside_a_house', 'backyard', 'other'];
$allowedSeparateSound = ['ceremony', 'cocktail_hour', 'reception', 'afterparty', 'not_sure'];
$allowedMoments = ['grand_entrance', 'first_dance', 'parent_dances', 'cake_cutting', 'bouquet_garter', 'last_dance', 'not_sure_yet'];
$allowedMusicStyles = ['dance', 'pop', 'disco', 'funk', 'edm', 'house', 'tech_house', 'hip_hop', 'rnb', 'sing_alongs', 'rock', 'country', 'latin', 'reggaeton', 'reggae', 'dancehall', 'soul', 'indie', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
$allowedLighting = ['uplighting', 'basic_dance_floor_lighting', 'advanced_dance_floor_buildout', 'whole_room_lighting', 'not_sure', 'not_interested'];
$allowedAddons = ['live_saxophone', 'live_guitar', 'live_violin', 'portrait_lounge', 'none'];
$allowedDancers = ['friends_my_age', 'mixed_generations', 'older_relatives', 'kids'];
$allowedDecisionStages = ['browsing', 'comparing_vendors', 'few_questions', 'only_dj'];
$allowedSpendingMindsets = ['firm_target', 'balanced_approach', 'vision_driven', 'unrestricted'];
$allowedCoordinatorValues = ['wedding_planner', 'day_of_coordinator', 'both', 'diy', 'not_sure'];
$allowedBookingTimelines = ['this_week', 'within_month', 'within_3_months', 'not_sure'];
$allowedMeetingOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'skip_for_now'];
$allowedMcStyles = ['light_professional', 'front_and_center', 'not_sure'];
$allowedPlanningStyles = [
    'super_chill',
    'guided_organized',
    'detail_oriented_vision_driven',
    'full_on_event_director',
];
$songsToSkipCategoryLabels = [
    'overplayed_wedding_classics' => 'Overplayed Wedding Classics - The usual suspects you’ve heard at every single reception',
    'traditional_line_dances' => 'Traditional Line Dances - Cha Cha Slide, Cupid Shuffle...',
    'cheesy_gimmick_songs' => 'Cheesy / Gimmick Songs - Anything that feels a bit too “carnival”',
    'throwback_slow_downs' => 'Throwback slow-downs - Classics that take the energy down.',
    'explicit_unedited_tracks' => 'Explicit / Unedited Tracks - Keep the lyrics clean for mixed-generation crowds',
];

$errors = [];

if ($name === '' || textLength($name) > 100) {
    $errors['name'] = 'Please provide a name of 100 characters or fewer.';
}

$partsOfDay = cleanArrayValues($_POST['parts_of_day'] ?? [], $allowedParts);
if (is_array($partsOfDay) && count($partsOfDay) < 1) {
    $errors['parts_of_day'] = 'Please select at least one part of your day.';
} elseif ($partsOfDay === null) {
    $errors['parts_of_day'] = 'Please select a valid option for your day.';
}

$timelineSectionKeys = [];
if (is_array($partsOfDay)) {
    if (in_array('ceremony', $partsOfDay, true)) {
        $timelineSectionKeys[] = 'ceremony';
    }
    if (in_array('cocktail_hour', $partsOfDay, true)) {
        $timelineSectionKeys[] = 'cocktail_hour';
    }
    if (in_array('reception', $partsOfDay, true)) {
        $timelineSectionKeys[] = 'reception_dinner';
        $timelineSectionKeys[] = 'dance_party';
    }
    if (in_array('afterparty', $partsOfDay, true)) {
        $timelineSectionKeys[] = 'afterparty';
    }
}

$timelineLines = [];
foreach ($timelineSectionKeys as $sectionKey) {
    $section = $timelineValues[$sectionKey];
    $start = $section['start'];
    $end = $section['end'];
    $touched = in_array($section['touched'], ['true', 'false'], true)
        ? $section['touched'] === 'true'
        : false;
    if ($start === '' && $end === '') {
        continue;
    }

    if (
        !preg_match('/^(?:[01]\d|2[0-3]):(?:00|30)$/', $start) ||
        !preg_match('/^(?:[01]\d|2[0-3]):(?:00|30)$/', $end)
    ) {
        $errors['timeline'] = 'Please choose valid timeline times in 30-minute increments.';
        continue;
    }

    $timelineLines[] = $section['label'] . ': '
        . DateTimeImmutable::createFromFormat('!H:i', $start)->format('g:i A')
        . ' - '
        . DateTimeImmutable::createFromFormat('!H:i', $end)->format('g:i A')
        . ($touched ? ' (adjusted)' : ' (default, not adjusted)');
}

$spaceType = cleanArrayValues($_POST['space_type'] ?? [], $allowedSpaces, ['barn']);
if (is_array($spaceType) && count($spaceType) < 1) {
    $errors['space_type'] = 'Please tell us where the music will happen.';
} elseif ($spaceType === null) {
    $errors['space_type'] = 'Please select a valid space type.';
}

if (is_array($spaceType) && in_array('other', $spaceType, true)) {
    if (textLength($spaceTypeOther) > 150) {
        $errors['space_type'] = 'Please keep the other space description to 150 characters or fewer.';
    } elseif ($spaceTypeOther === '') {
        $errors['space_type'] = 'Please tell us more about the other space type.';
    }
} else {
    $spaceTypeOther = '';
}

$keyMoments = cleanArrayValues($_POST['key_moments'] ?? [], $allowedMoments);
if (is_array($keyMoments) && count($keyMoments) < 1) {
    $errors['key_moments'] = 'Please choose at least one key moment.';
} elseif ($keyMoments === null) {
    $errors['key_moments'] = 'Please choose a valid key moment.';
} elseif (in_array('not_sure_yet', $keyMoments, true) && count($keyMoments) > 1) {
    $errors['key_moments'] = 'Please choose either specific key moments or not sure yet.';
}

$separateSound = cleanArrayValues($_POST['separate_sound'] ?? [], $allowedSeparateSound);
if ($separateSound === null) {
    $errors['separate_sound'] = 'Please choose valid sound system options.';
} else {
    $partsForSound = $partsOfDay ?? [];
    $separateSound = array_values(array_filter(
        $separateSound,
        static fn(string $value): bool => $value === 'not_sure'
            || in_array($value, $partsForSound, true)
    ));
    if (in_array('not_sure', $separateSound, true) && count($separateSound) > 1) {
        $errors['separate_sound'] = 'Please choose either specific spaces or not sure yet.';
    }
}

$dancers = cleanArrayValues($_POST['dancers'] ?? [], $allowedDancers);
if (is_array($dancers) && count($dancers) < 1) {
    $errors['dancers'] = 'Please select at least one group of guests.';
} elseif ($dancers === null) {
    $errors['dancers'] = 'Please select valid guest groups.';
}

$mcStyle = cleanText($_POST['mc_style'] ?? '');
if ($mcStyle === '' || !in_array($mcStyle, $allowedMcStyles, true)) {
    $errors['mc_style'] = 'Please pick the MC style that fits your day.';
}

$coordinator = cleanText($_POST['coordinator'] ?? '');
if (in_array($coordinator, ['yes', 'no'], true)) {
    $coordinator = 'not_sure';
}
if ($coordinator === '' || !in_array($coordinator, $allowedCoordinatorValues, true)) {
    $errors['coordinator'] = 'Please tell us whether you have a planner or coordinator.';
}

$musicStyles = cleanArrayValues($_POST['music_styles'] ?? [], $allowedMusicStyles);
if (is_array($musicStyles) && count($musicStyles) < 1) {
    $errors['music_styles'] = 'Please pick at least one music style.';
} elseif ($musicStyles === null) {
    $errors['music_styles'] = 'Please select valid music styles.';
}

if (is_array($musicInvolvement) && count($musicInvolvement) < 1) {
    $errors['music_involvement'] = 'Please choose at least one music planning option.';
} elseif ($musicInvolvement === null) {
    $errors['music_involvement'] = 'Please choose valid music planning options.';
}

if (!in_array($planningStyle, $allowedPlanningStyles, true)) {
    $errors['planning_style'] = 'Please choose your planning style.';
}

$lighting = cleanArrayValues($_POST['lighting'] ?? [], $allowedLighting);
if (is_array($lighting) && count($lighting) < 1) {
    $errors['lighting'] = 'Please select at least one lighting option.';
} elseif ($lighting === null) {
    $errors['lighting'] = 'Please choose valid lighting options.';
} elseif (
    count(array_intersect($lighting, ['not_sure', 'not_interested'])) > 0
    && count($lighting) > 1
) {
    $errors['lighting'] = 'Please choose either a lighting service or one of the exclusive options.';
}

$addons = cleanArrayValues($_POST['addons'] ?? [], $allowedAddons, ['lighting_design']);
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
if ($decisionStage === 'comparing_vendors') {
    if (textLength($competingVendors) > 200) {
        $errors['competing_vendors'] = 'Please keep the vendor names to 200 characters or fewer.';
    }
} else {
    $competingVendors = '';
}
$bookingTimeline = cleanText($_POST['booking_timeline'] ?? '');
if ($bookingTimeline === '' || !in_array($bookingTimeline, $allowedBookingTimelines, true)) {
    $errors['booking_timeline'] = 'Please choose when you hope to decide.';
}

$spendingMindsetLabels = [
    'firm_target' => 'Firm Target - Staying strictly within our selected price range is a primary priority for us.',
    'balanced_approach' => 'Balanced Approach - We’d prefer to stay near our target, but can adjust slightly for priority items that make a big difference.',
    'vision_driven' => 'Vision-Driven - Our budget is flexible, and we are willing to invest more for high-impact details and seamless quality.',
    'unrestricted' => 'Unrestricted - Money is not a constraining factor; our focus is on curating a fully custom, top-tier experience.',
];
if ($spendingMindset === '' || !in_array($spendingMindset, $allowedSpendingMindsets, true)) {
    $errors['spending_mindset'] = 'Please choose a valid spending approach.';
}

if (textLength($weddingPriorities) > 1000) {
    $errors['wedding_priorities'] = 'Please keep your wedding priorities to 1,000 characters or fewer.';
}

if (textLength($keyMomentsOther) > 1000) {
    $errors['key_moments_other'] = 'Please keep your additional key moment notes to 1,000 characters or fewer.';
}

if (textLength($favoriteSongs) > 1500) {
    $errors['favorite_songs'] = 'Please keep your favorite songs to 1,500 characters or fewer.';
}

if ($songsToSkipCategories === null) {
    $errors['songs_to_skip'] = 'Please choose valid music categories to avoid.';
}

if (cleanText($_POST['songs_to_skip_write_in_enabled'] ?? '') !== 'yes') {
    $songsToSkip = '';
} elseif (textLength($songsToSkip) > 1500) {
    $errors['songs_to_skip'] = 'Please keep your song notes to 1,500 characters or fewer.';
}

if (is_array($contactMethod) && count($contactMethod) < 1) {
    $errors['contact_method'] = 'Please pick the best way to reach you.';
} elseif ($contactMethod === null) {
    $errors['contact_method'] = 'Please choose valid contact methods.';
}

if ($bestTime === null) {
    $errors['best_time'] = 'Please choose valid time preferences.';
} elseif (in_array('no_preference', $bestTime, true) && count($bestTime) > 1) {
    $errors['best_time'] = 'Please choose either specific times or no preference.';
}

if (textLength($anythingElse) > 2000) {
    $errors['anything_else'] = 'Please keep your note to 2,000 characters or fewer.';
}

if (!in_array($meetingDay, $allowedMeetingOptions, true)) {
    $errors['meeting_day'] = 'Please select a weekday or skip for now.';
}

if (!empty($errors)) {
    jsonResponse(false, ['errors' => $errors], 400);
}

$choiceLabels = [
    'ceremony' => 'Ceremony',
    'cocktail_hour' => 'Cocktail hour',
    'reception' => 'Reception',
    'afterparty' => 'Afterparty',
    'indoor_event_space' => 'Indoor Event Space',
    'ballroom' => 'Ballroom',
    'tent_or_marquee' => 'Tent or marquee',
    'outdoors' => 'Outdoors',
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
    'wedding_planner' => 'Wedding Planner',
    'day_of_coordinator' => 'Day-of Coordinator',
    'both' => 'Both',
    'diy' => "I'm DIY coordinating",
    'not_sure' => "I'm not sure yet",
    'uplighting' => 'Uplighting',
    'basic_dance_floor_lighting' => 'Basic dance floor lighting',
    'advanced_dance_floor_buildout' => 'Advanced club style lighting build-out',
    'whole_room_lighting' => 'Whole-room lighting and décor',
    'not_interested' => "I'm not interested in lighting services",
    'friends_my_age' => 'Friends in my age group',
    'mixed_generations' => 'Mixed generations',
    'older_relatives' => 'Lots of older relatives',
    'kids' => 'Lots of kids',
    'this_week' => 'This week',
    'within_month' => 'Within a month',
    'within_3_months' => 'Within 3 months',
    'live_saxophone' => 'Live saxophone',
    'live_guitar' => 'Live guitar',
    'live_violin' => 'Live violin',
    'portrait_lounge' => 'Portrait lounge (a.k.a. photo booth)',
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
    'skip_for_now' => 'Skip for now',
];
$separateSoundLabels = [
    'ceremony' => 'Ceremony',
    'cocktail_hour' => 'Cocktail hour',
    'reception' => 'Reception',
    'afterparty' => 'Afterparty',
    'not_sure' => "I'm not sure yet. Please advise.",
];
$lightingLabels = $choiceLabels;
$lightingLabels['not_sure'] = "Not sure yet. Show me what's possible.";
$spendingSnapshotLabels = [
    'firm_target' => 'Firm Target',
    'balanced_approach' => 'Balanced Approach',
    'vision_driven' => 'Vision-Driven',
    'unrestricted' => 'Unrestricted',
];
$bookingTimelineLabels = [
    'this_week' => 'This week',
    'within_month' => 'Within a month',
    'within_3_months' => 'Within 3 months',
    'not_sure' => 'Not sure',
];
$musicInvolvementLabels = [
    'trust_expert' => 'Trust the Expert: Hands-Off - We trust your expertise! We’d love for you to read the crowd, take the wheel, and surprise us with great music throughout the event.',
    'vibe_demographic_guide' => 'Vibe Guide: High-Level Direction - We’d like to share our favorite genres, overall vibe, and guest demographics, then let you craft the flow around those guidelines.',
    'curated_playlists' => 'Curated Playlists: Specific Songs & Favorites - We have specific playlists or must-play/do-not-play lists we’d like to provide to ensure our personal favorites are included.',
    'structured_timeline_flow' => 'Structured Timeline & Flow: Detailed Vision - We have a specific vision for how we want the energy and music to unfold across different parts of the event (e.g., cocktail hour vs. peak dance floor).',
];
$planningStyleLabels = [
    'super_chill' => 'Super Chill & Go-With-the-Flow - I’m relaxed, trust the process completely, and just want everyone to have a good time. Tell me where to stand and what to do!',
    'guided_organized' => 'Guided & Organized - I have a good sense of what I want and like staying on top of details, but I’m totally open to expert advice and ideas.',
    'detail_oriented_vision_driven' => 'Detail-Oriented & Vision-Driven - I have a very specific vision for the day. I love clear timelines, prompt communication, and getting every little detail just right.',
    'full_on_event_director' => 'Full-On Event Director - I know exactly what I want, down to the minute. I’m hands-on, highly detailed, and executing a flawless event is my top priority!',
];
$to = 'info@djmisha.com, misha.osinovskiy@gmail.com';
$fromEmail = 'no-reply@djmisha.com';
$fromName = 'djmisha.com';
$subject = 'Contact from djmisha.com - ' . $name;
$timestamp = (new DateTimeImmutable('now', new DateTimeZone('America/Los_Angeles')))
    ->format('M j, Y g:i A T');

$budgetMaxDisplay = $budgetMax === 10000 ? '$10,000+' : '$' . number_format($budgetMax);
$budgetRange = '$' . number_format($budgetMin) . ' - ' . $budgetMaxDisplay;
$budgetStatus = $budgetTouched === 'true'
    ? 'adjusted'
    : 'default range, not adjusted';
$meetingSnapshot = $meetingDay === 'skip_for_now'
    ? 'Skipped'
    : $choiceLabels[$meetingDay];
$leadSnapshot = implode(' · ', [
    $budgetRange . ' (' . $budgetStatus . ')',
    $spendingSnapshotLabels[$spendingMindset],
    $choiceLabels[$decisionStage],
    'Deciding: ' . $bookingTimelineLabels[$bookingTimeline],
    'Call: ' . $meetingSnapshot,
]);

$timelineAnswer = $timelineLines !== [] ? implode("\n\n", $timelineLines) : 'Not provided';
$soundAnswer = in_array('not_sure', $separateSound ?? [], true)
    ? $separateSoundLabels['not_sure']
    : displayLines($separateSound ?? [], $separateSoundLabels);
$bodyBlocks = [
    "LEAD SNAPSHOT\n" . $leadSnapshot,
    "CONTACT DETAILS\n"
        . 'Name: ' . $name . "\n"
        . 'Submitted: ' . $timestamp,
    'YOUR DAY',
    "Which parts of your day would you like us involved in?\n" . displayLines($partsOfDay ?? [], $choiceLabels),
    "What does your event timeline look like?\n" . $timelineAnswer,
    "Tell us about the space(s) where the music will happen.\n"
        . displayLines($spaceType ?? [], $choiceLabels)
        . ($spaceTypeOther !== '' ? "\n\nOther space type:\n" . $spaceTypeOther : ''),
    "Which of your spaces need their own sound system?\n" . $soundAnswer,
    "Which key moments would you like to highlight?\n"
        . displayLines($keyMoments ?? [], $choiceLabels)
        . "\n\n\nAnything else we should know about?\n"
        . ($keyMomentsOther !== '' ? $keyMomentsOther : 'Not provided'),
    "What kind of MC style fits your day?\n" . $choiceLabels[$mcStyle],
    "Do you have a wedding planner or day-of coordinator?\n" . $choiceLabels[$coordinator],
    'YOUR MUSIC',
    "What do you want to hear on the dance floor?\n" . displayLines($musicStyles ?? [], $choiceLabels),
    "Any songs or artists that make you lose it on the dance floor?\n"
        . ($favoriteSongs !== '' ? $favoriteSongs : 'Not provided'),
    "Who will be on the dance floor?\n" . displayLines($dancers ?? [], $choiceLabels),
    "Is there any music you would NOT like to hear?\n"
        . displayLines($songsToSkipCategories ?? [], $songsToSkipCategoryLabels)
        . "\n\n\nSpecific song/artist exclusions:\n"
        . ($songsToSkip !== '' ? $songsToSkip : 'Not provided'),
    "How would you like to handle your music planning?\n"
        . displayLines($musicInvolvement ?? [], $musicInvolvementLabels),
    "How would you describe your event planning vibe?\n" . $planningStyleLabels[$planningStyle],
    'THE EXTRAS',
    "Which lighting services interest you?\n"
        . displayLines($lighting ?? [], $lightingLabels),
    "Interested in any additional services?\n" . displayLines($addons ?? [], $choiceLabels),
    'PRIORITIES & BUDGET',
    "Tell us what is most important to you on your wedding day.\n"
        . ($weddingPriorities !== '' ? $weddingPriorities : 'Not provided'),
    "What range feels comfortable for your music and entertainment, including DJ, live musicians, lighting, and extras?\n"
        . $budgetRange . ($budgetTouched === 'true' ? ' (adjusted)' : ' (default range, not adjusted)'),
    "How would you describe your approach to spending?\n" . $spendingSnapshotLabels[$spendingMindset],
    "WHERE YOU'RE AT",
    "Where are you in your decision?\n" . $choiceLabels[$decisionStage]
        . ($competingVendors !== '' ? "\n\n\nWho else are you considering?\n" . $competingVendors : ''),
    "When are you hoping to decide?\n" . $bookingTimelineLabels[$bookingTimeline],
    "What's the best way to reach you?\n"
        . displayLines($contactMethod ?? [], $choiceLabels)
        . "\n\n\nBest time to reach you:\n"
        . displayLines($bestTime ?? [], $choiceLabels, 'No preference'),
    "What are your most burning questions for DJ Misha?\n"
        . ($anythingElse !== '' ? $anythingElse : 'Not provided'),
    'MEET DJ MISHA',
    "Meeting day\n" . ($meetingDay === 'skip_for_now'
        ? 'Skipped'
        : $choiceLabels[$meetingDay] . ' at 2:00 PM Pacific (requested, not confirmed)'),
];

$body = implode("\n\n\n", $bodyBlocks);
$headers = [
    'From: ' . $fromName . ' <' . $fromEmail . '>',
    'Reply-To: info@djmisha.com',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers), '-f ' . $fromEmail);
if (!$sent) {
    error_log('Failed to send wedding planning form email.');
    jsonResponse(false, ['errors' => ['form' => 'We could not send your answers. Please try again.']], 500);
}

jsonResponse(true, ['message' => 'Thank you. Your response has been received.']);
