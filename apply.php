<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user_id'])) header("Location: login.php");

$project_id = $_GET['id'] ?? null;
if (!$project_id) die("Invalid project.");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = $_POST['message'];
    $stmt = $pdo->prepare("INSERT INTO applications (project_id, applicant_id, message) VALUES (?, ?, ?)");
    try {
        $stmt->execute([$project_id, $_SESSION['user_id'], $message]);
        echo "Application sent! <a href='browse.php'>Back</a>";
        exit;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<h2>Apply to Project</h2>
<form method="POST">
    Message: <textarea name="message" required></textarea><br>
    <button type="submit">Send</button>
</form>
<a href="browse.php">Cancel</a>
