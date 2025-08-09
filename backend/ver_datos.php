<?php
// Configuración de conexión
$host = "localhost";
$dbname = "monitoreo_ambiental";
$username = "root";
$password = "root"; // Cambia esto si tu root tiene contraseña

// Conexión a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    die("❌ Error de conexión: " . $conn->connect_error);
}

// Consulta SQL (orden cronológico)
$sql = "SELECT id, temperatura, humedad, fecha FROM datos ORDER BY fecha ASC";
$result = $conn->query($sql);

// Preparar arreglo de resultados
$datos = [];
if ($result && $result->num_rows > 0) {
    while ($fila = $result->fetch_assoc()) {
        $datos[] = $fila;
    }
}

// Enviar JSON
header('Content-Type: application/json');
echo json_encode($datos, JSON_PRETTY_PRINT);

$conn->close();
?>
