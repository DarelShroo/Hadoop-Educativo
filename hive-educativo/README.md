# Hive Educativo

Plataforma educativa interactiva para aprender **HiveQL** (Hadoop Hive) con ejecución real de consultas en contenedor Docker.

## 🎯 Características

- ✅ Ejecución real de consultas HiveQL en Docker
- ✅ 3 niveles de dificultad (Básico, Intermedio, Avanzado)
- ✅ Validación automática de resultados
- ✅ Pistas y soluciones disponibles
- ✅ Datasets realistas incluidos
- ✅ Progreso guardado en el navegador

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 16+
- Docker & Docker Compose

### Instalación

```bash
cd hive-educativo
npm install
npm start
```

El servidor estará disponible en `http://localhost:3001`

### Iniciar Docker

```bash
cd docker
docker compose up -d
```

## 📚 Estructura

```
hive-educativo/
├── server/          # Backend Node.js/Express
├── public/          # Frontend (HTML/CSS/JS)
├── exercises/       # Definiciones de ejercicios HiveQL
├── datasets/        # Datos CSV para los ejercicios
└── docker/          # Configuración Docker Hive
```

## 🎓 Uso

1. Accede a `http://localhost:3001`
2. Selecciona un nivel (Básico, Intermedio, Avanzado)
3. Completa ejercicios HiveQL
4. Valida tu código contra Hive real
5. Consulta pistas si necesitas ayuda

## 🐳 Docker

El proyecto incluye un contenedor Docker con:
- Hadoop 3.3.6
- Hive 3.1.3
- Configurado para ejecución local

## 📝 License

MIT
