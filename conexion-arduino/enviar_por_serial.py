import serial
import requests
import time

#PUERTO Y URL
PUERTO = 'COM4' 
VELOCIDAD = 9600
URL = 'http://[2803:d100:9910:4fb:9fb5:baa1:e614:46d2]/Monitoreo-Ambiental-backend/backend/recibir_datos.php'

# Abrir conexión serial
ser = serial.Serial(PUERTO, VELOCIDAD, timeout=2)
time.sleep(5)  # Esperar que el puerto se estabilice

print("✅ Esperando datos desde Arduino...")

while True:
    try:
        linea = ser.readline().decode('utf-8').strip()
        if linea.startswith("T:") and ",H:" in linea:
            # Parsear datos
            partes = linea.replace("T:", "").split(",H:")
            temperatura = float(partes[0])
            humedad = float(partes[1])

            # Enviar por POST
            datos = {'temperatura': temperatura, 'humedad': humedad}
            respuesta = requests.post(URL, data=datos)

            print(f"✓ Enviado {datos} | Respuesta: {respuesta.status_code} - {respuesta.text}")
        else:
            print("↪", linea)

    except Exception as e:
        print("❌ Error:", e)

    time.sleep(1)
