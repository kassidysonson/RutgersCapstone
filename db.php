<?php
$host = "https://vmcroxxlakwnrrahsjiq.supabase.co";     // e.g. db.xxxxx.supabase.co
$port = "5432";
$dbname = "postgres";
$user = "postgres";
$password = "YOUR_SUPABASE_DB_PASSWORD";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
