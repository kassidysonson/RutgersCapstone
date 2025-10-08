<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user_id'])) header("Location: login.php");

$id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $university = $_POST['university'];
    $bio = $_POST['bio'];
    $stmt = $pdo->prepare("UPDATE users SET university = ?, bio = ? WHERE id = ?");
    $stmt->execute([$university, $bio, $id]);
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
?>

<h2>Profile</h2>
<form method="POST">
    Name: <?= htmlspecialchars($user['full_name']) ?><br>
    Email: <?= htmlspecialchars($user['email']) ?><br>
    University: <input name="university" value="<?= htmlspecialchars($user['university'] ?? '') ?>"><br>
    Bio: <textarea name="bio"><?= htmlspecialchars($user['bio'] ?? '') ?></textarea><br>
    <button>Save</button>
</form>

<br><a href="post_project.php">Post Project</a>
<br><a href="browse.php">Browse</a>
<br><a href="my_applications.php">My Applications</a>
<br><a href="logout.php">Logout</a>
