<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user_id'])) header("Location: login.php");

$stmt = $pdo->query("SELECT p.*, u.full_name FROM projects p JOIN users u ON p.owner_id = u.id ORDER BY created_at DESC");
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2>Browse Projects</h2>
<?php foreach ($projects as $p): ?>
<div style="margin-bottom:15px;border:1px solid #ccc;padding:10px;">
  <strong><?= htmlspecialchars($p['title']) ?></strong><br>
  By <?= htmlspecialchars($p['full_name']) ?><br>
  <?= htmlspecialchars($p['description']) ?><br>
  <a href="apply.php?id=<?= $p['id'] ?>">Apply</a>
</div>
<?php endforeach; ?>
<a href="post_project.php">Post Project</a> |
<a href="profile.php">Profile</a> |
<a href="logout.php">Logout</a>
