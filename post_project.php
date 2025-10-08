<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user_id'])) header("Location: login.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $expect = $_POST['expectations'];
    $location = $_POST['location'];
    $comp = $_POST['compensation'];
    $uid = $_SESSION['user_id'];

    $stmt = $pdo->prepare("INSERT INTO projects (owner_id, title, description, expectations, location, compensation)
                           VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$uid, $title, $desc, $expect, $location, $comp]);
    echo "Project posted! <a href='browse.php'>Go back</a>";
    exit;
}
?>

<h2>Post a Project</h2>
<form method="POST">
    Title: <input name="title" required><br>
    Description: <textarea name="description" required></textarea><br>
    Expectations: <textarea name="expectations"></textarea><br>
    Location: <input name="location"><br>
    Compensation: <input name="compensation"><br>
    <button type="submit">Post</button>
</form>
<a href="browse.php">Back</a>
