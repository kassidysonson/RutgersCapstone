<?php
session_start();
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $full_name = $_POST['full_name'];

    $stmt = $pdo->prepare("INSERT INTO users (email, password, full_name) VALUES (?, ?, ?) RETURNING id");
    try {
        $stmt->execute([$email, $password, $full_name]);
        $user = $stmt->fetch();
        $_SESSION['user_id'] = $user['id'];
        header("Location: profile.php");
        exit;
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<h2>Signup</h2>
<form method="POST">
    Name: <input name="full_name" required><br>
    Email: <input type="email" name="email" required><br>
    Password: <input type="password" name="password" required><br>
    <button type="submit">Sign Up</button>
</form>
<a href="login.php">Already have an account? Login</a>
