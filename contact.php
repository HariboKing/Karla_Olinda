<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'info@jovka.org';
const CONTACT_FROM = 'info@jovka.org';

function wants_json_response(): bool
{
    return strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);

    if (wants_json_response()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($payload);
        exit;
    }

    header('Content-Type: text/html; charset=UTF-8');
    $message = htmlspecialchars((string) ($payload['message'] ?? 'Thank you.'), ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Contact</title></head><body><p>{$message}</p></body></html>";
    exit;
}

function post_value(string $key): string
{
    return trim((string) ($_POST[$key] ?? ''));
}

function clean_header_value(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

if (post_value('website') !== '') {
    respond(200, ['ok' => true, 'message' => 'Thank you. You will be contacted within 48 hours.']);
}

$name = post_value('name');
$email = post_value('email');
$phone = post_value('phone');
$lessonInquiry = post_value('lessonInquiry');
$message = post_value('message');

if (!in_array($lessonInquiry, ['No', 'Yes', 'Not sure'], true)) {
    $lessonInquiry = 'No';
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || ($lessonInquiry === 'Yes' && $phone === '')) {
    respond(422, [
        'ok' => false,
        'message' => 'Please fill in your name and email address. Phone number is required for lesson inquiries.',
    ]);
}

$safeName = clean_header_value($name);
$safeEmail = clean_header_value($email);
$subject = 'Karla Olinda contact form - ' . $safeName;
$body = implode("\n", [
    'New contact form submission from jovka.org',
    '',
    'Name: ' . $name,
    'Email address: ' . $email,
    'Phone number: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Lesson inquiry: ' . $lessonInquiry,
    '',
    'Message:',
    $message !== '' ? $message : 'No message provided.',
]);

$headers = [
    'From: Karla Olinda Website <' . CONTACT_FROM . '>',
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(CONTACT_RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'message' => 'The message could not be sent.']);
}

respond(200, ['ok' => true, 'message' => 'Thank you. You will be contacted within 48 hours.']);
