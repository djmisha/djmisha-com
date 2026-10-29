<?php
$escapeHtml = static fn(string $text): string => htmlspecialchars(
    $text,
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
);
$answerHtml = static fn(string $answer): string => '<strong>'
    . nl2br($escapeHtml($answer), false)
    . '</strong>';
$questionHtml = static fn(string $question, string $answer): string => $escapeHtml($question)
    . '<br>'
    . $answerHtml($answer);

$timelineAnswer = $timelineLines !== [] ? implode("\n\n", $timelineLines) : 'Not provided';
$soundAnswer = in_array('not_sure', $separateSound ?? [], true)
    ? $separateSoundLabels['not_sure']
    : displayLines($separateSound ?? [], $separateSoundLabels);
$spaceAnswer = $answerHtml(displayLines($spaceType ?? [], $choiceLabels))
    . ($spaceTypeOther !== ''
        ? '<br>Other space type:<br>' . $answerHtml($spaceTypeOther)
        : '');
$bodyBlocks = [
    nl2br($escapeHtml("LEAD SNAPSHOT\n" . $leadSnapshot), false),
    nl2br($escapeHtml("CONTACT DETAILS\nName: " . $name . "\nSubmitted: " . $timestamp), false),
    'YOUR DAY',
    $questionHtml(
        'Which parts of your day would you like us involved in?',
        displayLines($partsOfDay ?? [], $choiceLabels)
    ),
    $questionHtml('What does your event timeline look like?', $timelineAnswer),
    $escapeHtml('Tell us about the space(s) where the music will happen.')
        . '<br>' . $spaceAnswer,
    $questionHtml('Which of your spaces need their own sound system?', $soundAnswer),
    $questionHtml(
        'Which key moments would you like to highlight?',
        displayLines($keyMoments ?? [], $choiceLabels)
    ),
    $questionHtml(
        'Anything else we should know about?',
        $keyMomentsOther !== '' ? $keyMomentsOther : 'Not provided'
    ),
    $questionHtml('What kind of MC style fits your day?', $choiceLabels[$mcStyle]),
    $questionHtml(
        'Do you have a wedding planner or day-of coordinator?',
        $choiceLabels[$coordinator]
    ),
    'YOUR MUSIC',
    $questionHtml(
        'What do you want to hear on the dance floor?',
        displayLines($musicStyles ?? [], $choiceLabels)
    ),
    $questionHtml(
        'Any songs or artists that make you lose it on the dance floor?',
        $favoriteSongs !== '' ? $favoriteSongs : 'Not provided'
    ),
    $questionHtml('Who will be on the dance floor?', displayLines($dancers ?? [], $choiceLabels)),
    $questionHtml(
        'Is there any music you would NOT like to hear?',
        displayLines($songsToSkipCategories ?? [], $songsToSkipCategoryLabels)
    ),
    $questionHtml(
        'Specific song/artist exclusions:',
        $songsToSkip !== '' ? $songsToSkip : 'Not provided'
    ),
    $questionHtml(
        'How would you like to handle your music planning?',
        displayLines($musicInvolvement ?? [], $musicInvolvementLabels)
    ),
    $questionHtml(
        'How would you describe your event planning vibe?',
        $planningStyleLabels[$planningStyle]
    ),
    'THE EXTRAS',
    $questionHtml(
        'Which lighting services interest you?',
        displayLines($lighting ?? [], $lightingLabels)
    ),
    $questionHtml('Interested in any additional services?', displayLines($addons ?? [], $choiceLabels)),
    'PRIORITIES & BUDGET',
    $questionHtml(
        'Tell us what is most important to you on your wedding day.',
        $weddingPriorities !== '' ? $weddingPriorities : 'Not provided'
    ),
    $questionHtml(
        'What range feels comfortable for your music and entertainment, including DJ, live musicians, lighting, and extras?',
        $budgetRange . ($budgetTouched === 'true' ? ' (adjusted)' : ' (default range, not adjusted)')
    ),
    $questionHtml(
        'How would you describe your approach to spending?',
        $spendingSnapshotLabels[$spendingMindset]
    ),
    "WHERE YOU'RE AT",
    $questionHtml('Where are you in your decision?', $choiceLabels[$decisionStage]),
    $questionHtml(
        'Who else are you considering?',
        $competingVendors !== '' ? $competingVendors : 'Not provided'
    ),
    $questionHtml('When are you hoping to decide?', $bookingTimelineLabels[$bookingTimeline]),
    $questionHtml(
        "What's the best way to reach you?",
        displayLines($contactMethod ?? [], $choiceLabels)
    ),
    $questionHtml(
        'Best time to reach you:',
        displayLines($bestTime ?? [], $choiceLabels, 'No preference')
    ),
    $questionHtml(
        'What are your most burning questions for DJ Misha?',
        $anythingElse !== '' ? $anythingElse : 'Not provided'
    ),
    'MEET DJ MISHA',
    $questionHtml(
        'Meeting day',
        $meetingDay === 'skip_for_now'
            ? 'Skipped'
            : $choiceLabels[$meetingDay] . ' at 2:00 PM Pacific (requested, not confirmed)'
    ),
];

echo implode('<br><br>', $bodyBlocks);
