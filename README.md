# Plataforma Hadoop Educativo

Bienvenido a la Plataforma Educativa de Hadoop. Este proyecto es una solución integral diseñada para aprender y practicar ecosistemas de Big Data, específicamente **Apache Hive** y **Apache Pig Latin**.

El proyecto está diseñado con un ciclo de aprendizaje progresivo por niveles. Cada nivel contiene:
1. **Teoría específica**: Un archivo README.md que explica los conceptos de ese nivel.
2. **Ejercicios prácticos**: Tareas que debes resolver usando *exclusivamente* los conocimientos adquiridos en la teoría correspondiente.

---

## 🏗 Arquitectura del Proyecto

El proyecto está orquestado completamente a través de Docker y dividido en dos submódulos independientes. Hemos unificado la infraestructura utilizando **Docker Compose Profiles**, lo que significa que tienes un único archivo de configuración (`docker-compose.yml`) en la raíz del proyecto desde el cual puedes elegir qué entorno levantar.

Cada submódulo cuenta con:
- Un contenedor ejecutor (Hadoop/Hive o Hadoop/Pig).
- Un contenedor Node.js (Servidor Web) conectado mediante el patrón *Docker-out-of-Docker (DooD)* para procesar y evaluar los ejercicios en tiempo real.

---

## 🚀 Cómo iniciar la plataforma

Abre una terminal en la raíz del proyecto (`Hadoop-Educativo`). Puedes elegir levantar la plataforma de Hive, la de Pig, o ambas simultáneamente.

### 🐝 1. Iniciar el Entorno de HiveQL
Si deseas estudiar y practicar consultas estructuradas sobre Hadoop:
```bash
docker compose --profile hive up -d
```
* **Plataforma Web de Hive:** Disponible en [http://localhost:3001](http://localhost:3001)

### 🐷 2. Iniciar el Entorno de Pig Latin
Si deseas practicar la creación de pipelines de procesamiento de flujo de datos (Data Flow):
```bash
docker compose --profile pig up -d
```
* **Plataforma Web de Pig:** Disponible en [http://localhost:3000](http://localhost:3000)

### 🚀 3. Iniciar Ambos Entornos
Si quieres tener ambas plataformas disponibles al mismo tiempo:
```bash
docker compose --profile hive --profile pig up -d
```

### 🛑 4. Detener la infraestructura
Para apagar todos los contenedores levantados y limpiar la red:
```bash
docker compose --profile hive --profile pig down
```

---

## 📖 Estructura de Estudio

Tanto en la carpeta `hive-educativo/exercises` como en `pig-latin-educativo/exercises` encontrarás tres niveles de dificultad:

1. **`nivel_1_basico`**: Fundamentos del lenguaje (Cargas, filtros básicos, proyecciones).
2. **`nivel_2_intermedio`**: Operaciones relacionales complejas (JOINs, agrupaciones, uniones).
3. **`nivel_3_avanzado`**: Funciones analíticas avanzadas (Window Functions, Macros, Ejecución paralela).

> **IMPORTANTE**: Antes de comenzar a programar las soluciones, abre la carpeta del nivel correspondiente y **lee detenidamente el archivo `README.md`**. Encontrarás exactamente la teoría necesaria para superar los retos. ¡Sin sorpresas!

¡Disfruta aprendiendo Big Data!
