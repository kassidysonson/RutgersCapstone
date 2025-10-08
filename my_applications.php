<?php
session_start();
require 'db.php';
if (!isset($_SESSION['user_id'])) header("Location: login.php");

$stmt = $pdo->prepare("
  SELECT a.*, p.title 
  FROM applications a 
  JOIN projects p ON a.project_id = p.id 
  WHERE a.applicant_id = ? 
  ORDER BY a.created_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$apps = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2>My Applications</h2>
<?php foreach ($apps as $a): ?>
<div style="margin-bottom:10px;">
  <strong><?= htmlspecialchars($a['title']) ?></strong><br>
  Message: <?= htmlspecialchars($a['message']) ?><br>
  Date: <?= htmlspecialchars($a['created_at']) ?><br>
</div>
<?php endforeach; ?>

<a href="browse.php">Back</a>
