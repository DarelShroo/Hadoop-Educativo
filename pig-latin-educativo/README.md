# 🐷 Pig Latin Educational Platform

A comprehensive educational web service for learning Apache Pig Latin through 100 progressive exercises validated in real-time with Hadoop execution in Docker containers.

## 🌟 Features

- **100 Progressive Exercises**: Structured across 3 difficulty levels
  - Level 1 (Básico): 30 exercises - fundamental concepts
  - Level 2 (Intermedio): 40 exercises - joins, grouping, functions
  - Level 3 (Avanzado): 30 exercises - macros, UDFs, optimization

- **Real Hadoop Validation**: Scripts execute in Docker container with actual Hadoop + Pig
- **Interactive Learning**: Theory guides, examples, and hands-on practice
- **Automatic Validation**: Compare outputs with expected results
- **Smart Error Analysis**: Helpful suggestions based on common mistakes
- **Progress Tracking**: LocalStorage-based progress persistence
- **Modern UI**: Responsive, dark-themed interface with smooth animations

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 16+)
- **npm** (version 8+)
- **4GB+ RAM** recommended for Hadoop container
- **~3GB disk space** for Docker images and datasets

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
cd /home/psych/projects/hadoop/pig-latin-educativo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Download Datasets

```bash
npm run download-datasets
```

This will:
- Download 4 real datasets from public sources (Titanic, Iris, Wine Quality)
- Generate 10 synthetic datasets for exercises
- Create a dataset index file

### 4. Configure Environment

```bash
cp .env.example .env
```

(Optional) Edit `.env` to customize settings like port number.

### 5. Start Docker Container

```bash
npm run docker:up
```

This will:
- Pull the `fluddeni/hadoop-pig:latest` image (~1.5GB)
- Start Hadoop + Pig container
- Mount datasets and exercise directories
- May take 2-3 minutes on first run

**Wait for container health check**:
```bash
docker ps | grep hadoop-pig-executor
# Should show STATUS as "healthy" after ~60 seconds
```

### 6. Start Server

```bash
npm start
```

Server will start on `http://localhost:3000`

### 7. Open in Browser

Navigate to `http://localhost:3000` and start learning!

## 📁 Project Structure

```
pig-latin-educativo/
├── datasets/                          # Real and synthetic datasets
│   ├── download_datasets.js          # Dataset download script
│   ├── *.csv                          # Downloaded/generated datasets
│   └── datasets-index.json            # Dataset metadata
├── exercises/                         # Exercise content by level
│   ├── nivel_1_basico/
│   │   ├── README.md                 # Theory and examples
│   │   ├── exercises.json            # 30 exercises
│   │   └── expected_outputs/         # Validation data
│   ├── nivel_2_intermedio/           # 40 exercises
│   └── nivel_3_avanzado/             # 30 exercises
├── docker/
│   ├── docker-compose.yml            # Container configuration
│   └── scripts/                       # Temporary script execution
├── server/
│   ├── server.js                     # Express server entry
│   ├── routes/
│   │   └── exercises.js              # API endpoints
│   ├── services/
│   │   ├── dockerExecutor.js         # Pig script execution
│   │   └── validator.js              # Output comparison
│   └── utils/
│       ├── sanitizer.js              # Input validation
│       └── logger.js                 # Logging
├── public/                           # Frontend files
│   ├── index.html                    # Main UI
│   ├── css/
│   │   └── styles.css                # Responsive styles
│   └── js/
│       ├── app.js                    # Application logic
│       ├── editor.js                 # Code editor
│       └── api.js                    # API client
├── package.json
├── .env.example
└── README.md
```

## 🔧 NPM Scripts

```bash
# Download datasets
npm run download-datasets

# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev

# Docker management
npm run docker:up       # Start container
npm run docker:down     # Stop container
npm run docker:logs     # View logs

# Full setup (datasets + Docker + server)
npm run setup
```

## 🎓 Learning Path

### Level 1: Básico (30 exercises)
**Concepts**: LOAD, FILTER, FOREACH, ORDER BY, DISTINCT, LIMIT, DUMP

Start here if you're new to Pig Latin. Learn how to:
- Load CSV data with schemas
- Filter data with conditions
- Project and transform columns
- Sort and sample data

### Level 2: Intermedio (40 exercises)
**Concepts**: JOIN, GROUP BY, aggregations, built-in functions, SPLIT, UNION

Progress to intermediate operations:
- Perform INNER/OUTER joins
- Group data and compute aggregations (COUNT, SUM, AVG, MIN, MAX)
- Use string and math functions
- Combine multiple datasets

### Level 3: Avanzado (30 exercises)
**Concepts**: MACROS, UDFs, PARALLEL, nested FOREACH, optimization

Master advanced techniques:
- Define reusable macros
- Write Python UDFs
- Optimize query performance with PARALLEL
- Handle complex nested data structures
- Analyze real-world log and time-series data

## 🛠️ API Endpoints

### GET /api/status
Check server and Docker container status

### GET /api/nivel/:nivel
Get level theory (README content)
- **Params**: `nivel` (1, 2, or 3)

### GET /api/nivel/:nivel/ejercicios
List exercises for a level
- **Returns**: Array of exercise summaries

### GET /api/nivel/:nivel/ejercicio/:id
Get exercise details
- **Returns**: Full exercise data (description, initial script, hints)

### POST /api/nivel/:nivel/ejercicio/:id/validar
Validate user script
- **Body**: `{ "script": "Pig Latin code..." }`
- **Returns**: `{ correcto: boolean, output: string, errores: string, sugerencias: string[] }`

## 🐳 Docker Details

### Container Configuration
- **Image**: `fluddeni/hadoop-pig:latest`
- **Pig Version**: 0.16.0
- **Hadoop Version**: 2.7.3
- **Execution Mode**: Local mode (faster for small datasets)
- **Resource Limits**: 2GB RAM, 1 CPU core

### Volume Mounts
- `datasets/` → `/datasets` (read-only)
- `exercises/` → `/exercises` (read-only)
- `docker/scripts/` → `/scripts` (read-write)

### Accessing Web UIs
- **NameNode**: http://localhost:9870
- **ResourceManager**: http://localhost:8088

## 🔒 Security

- **Input Sanitization**: All user scripts are validated to prevent command injection
- **Isolated Execution**: Scripts run in isolated Docker container with resource limits
- **No External Network**: Container has no internet access during script execution
- **Automatic Cleanup**: Temporary script files are deleted after execution
- **Timeout Protection**: 30-second maximum execution time per script

## 🐛 Troubleshooting

### Docker container not starting

**Check Docker is running**:
```bash
docker ps
```

**View container logs**:
```bash
npm run docker:logs
```

**Restart container**:
```bash
npm run docker:down
npm run docker:up
```

### Script validation fails with "Container not running"

**Check container health**:
```bash
docker exec hadoop-pig-executor pig -version
```

Should output Pig version. If not, restart container.

### Permission denied on volume mounts

**Fix permissions** (Linux):
```bash
chmod -R 755 docker/scripts
chmod -R 755 datasets
```

### Datasets not downloading

**Manual download**:
```bash
node datasets/download_datasets.js
```

Check internet connection and firewall settings.

### Scripts timeout

Some complex queries may exceed the 30-second limit. Check:
- Dataset size (should be < 1MB for exercises)
- Query complexity (avoid Cartesian products)
- Container resources (increase if needed in docker-compose.yml)

## 📚 Resources

### Official Documentation
- [Apache Pig Documentation](https://pig.apache.org/docs/latest/)
- [Pig Latin Basics](https://pig.apache.org/docs/latest/basic.html)
- [Built-in Functions](https://pig.apache.org/docs/latest/func.html)
- [Pig Performance](https://pig.apache.org/docs/latest/perf.html)

### Dataset Sources
- [Titanic Dataset](https://github.com/datasciencedojo/datasets)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/)

## 🤝 Contributing

This is an educational project. Suggestions for improvements:

1. **Add More Exercises**: Submit exercise ideas via issues
2. **Improve Validation**: Better output comparison algorithms
3. **Add Datasets**: Suggest real-world datasets
4. **UI Enhancements**: Improve user experience
5. **Documentation**: Fix typos, add examples

## 📄 License

MIT License - feel free to use for educational purposes.

##⚡ Performance Tips

- **First Run**: Container startup may take 2-3 minutes
- **Subsequent Runs**: Scripts execute in 1-5 seconds
- **Large Queries**: Use PARALLEL for better performance
- **Development**: Use `npm run dev` for auto-reload

## 🎯 Next Steps

1. Complete Level 1 to master basics
2. Practice joins and grouping in Level 2
3. Challenge yourself with Level 3 advanced topics
4. Experiment with your own datasets
5. Share your progress!

---

**Happy Learning! 🐷📊**

For issues or questions, check the troubleshooting section or review the official Pig documentation.
