<?php
// Configuración de conexión
$host = "localhost";
$dbname = "monitoreo_ambiental";
$username = "root";
$password = "root"; // Cambia si corresponde

// Recibir parámetro de tipo
$tipo = $_GET['tipo'] ?? 'completo';

// Conectar a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die("❌ Error de conexión: " . $conn->connect_error);
}

// Armar consulta según tipo
switch ($tipo) {
    case 'temperatura':
        $filename = "temperatura.csv";
        $sql = "SELECT fecha, temperatura FROM datos ORDER BY fecha ASC";
        $headers = ['fecha', 'temperatura'];
        break;
    case 'humedad':
        $filename = "humedad.csv";
        $sql = "SELECT fecha, humedad FROM datos ORDER BY fecha ASC";
        $headers = ['fecha', 'humedad'];
        break;
    default:
        $filename = "datos_completos.csv";
        $sql = "SELECT id, temperatura, humedad, fecha FROM datos ORDER BY fecha ASC";
        $headers = ['id', 'temperatura', 'humedad', 'fecha'];
        break;
}

$result = $conn->query($sql);

// Encabezados para forzar la descarga
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Abrir salida
$output = fopen('php://output', 'w');

// Escribir encabezados
fputcsv($output, $headers);

// Escribir filas
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row);
    }
}

fclose($output);
$conn->close();

?>
