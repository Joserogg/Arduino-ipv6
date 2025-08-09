<?php
// Configuración de conexión
$host = "localhost";
$dbname = "monitoreo_ambiental";
$username = "root";
$password = "root"; // ← Cambia esto si tienes otra contraseña

// Leer los datos enviados por POST
$temperatura = $_POST['temperatura'] ?? null;
$humedad = $_POST['humedad'] ?? null;

// Validación básica
if ($temperatura === null || $humedad === null) {
    http_response_code(400);
    echo "❌ Faltan datos (temperatura o humedad).";
    exit;
}

// Conexión a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die("❌ Conexión fallida: " . $conn->connect_error);
}

// Preparar la consulta
$sql = "INSERT INTO datos (temperatura, humedad) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dd", $temperatura, $humedad);

// Ejecutar e informar
if ($stmt->execute()) {
    echo "✅ Datos insertados correctamente.";
} else {
    http_response_code(500);
    echo "❌ Error al insertar datos.";
}

$stmt->close();
$conn->close();

?>
