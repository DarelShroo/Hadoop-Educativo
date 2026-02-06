# Nivel 1: Básico - Fundamentos de Pig Latin

## 📚 Teoría

### ¿Qué es Pig Latin?

Apache Pig Latin es un **lenguaje de flujo de datos** de alto nivel diseñado para analizar grandes conjuntos de datos en Hadoop. A diferencia de MapReduce que requiere escribir código Java complejo, Pig Latin permite expresar transformaciones de datos de manera declarativa y concisa.

### Modelo de Datos

Pig trabaja con los siguientes tipos de datos:

- **Atom**: Valor simple (int, long, float, double, chararray, bytearray)
- **Tuple**: Secuencia ordenada de campos, e.g., `(Alice, 25, USA)`
- **Bag**: Colección desordenada de tuples, e.g., `{(1,2), (3,4)}`
- **Map**: Conjunto de pares clave-valor, e.g., `[name#Alice, age#25]`

### Conceptos Clave

#### 1. LOAD - Cargar Datos

```pig
-- Cargar CSV con esquema
data = LOAD 'input.csv' USING PigStorage(',') 
       AS (name:chararray, age:int, country:chararray);

-- Sin esquema (todos los campos son bytearray)
data = LOAD 'input.csv' USING PigStorage(',');
```

**Funciones de carga comunes**:
- `PigStorage(delimiter)`: Archivos delimitados (CSV, TSV)
- `TextLoader()`: Líneas de texto sin procesar
- `JsonLoader()`: Datos JSON

#### 2. FILTER - Filtrar Datos

```pig
-- Filtrar por condición simple
adults = FILTER data BY age >= 18;

-- Múltiples condiciones
usa_adults = FILTER data BY age >= 18 AND country == 'USA';

-- Operadores: ==, !=, <, >, <=, >=, AND, OR, NOT
-- Coincidencia de patrones
emails = FILTER data BY email MATCHES '.*@gmail\\.com';
```

#### 3. FOREACH - Transformar Datos

```pig
-- Seleccionar columnas
names = FOREACH data GENERATE name, age;

-- Transformaciones
doubled = FOREACH data GENERATE name, age * 2 AS double_age;

-- Operaciones aritméticas: +, -, *, /, %
```

#### 4. LIMIT - Limitar Resultados

```pig
-- Primeras 10 filas
sample = LIMIT data 10;
```

#### 5. ORDER BY - Ordenar Datos

```pig
-- Orden ascendente
sorted = ORDER data BY age;

-- Orden descendente
sorted_desc = ORDER data BY age DESC;
```

#### 6. DISTINCT - Eliminar Duplicados

```pig
-- Valores únicos
unique_countries = DISTINCT (FOREACH data GENERATE country);
```

#### 7. DUMP y STORE - Salida de Datos

```pig
-- Mostrar resultados en consola (solo para pruebas)
DUMP data;

-- Guardar en archivo
STORE data INTO 'output' USING PigStorage(',');
```

#### 8. DESCRIBE e ILLUSTRATE - Depuración

```pig
-- Ver esquema de relación
DESCRIBE data;

-- Ver datos de ejemplo paso a paso
ILLUSTRATE data;
```

### Funciones Integradas Básicas

- **String**: `UPPER()`, `LOWER()`, `SUBSTRING()`, `TRIM()`
- **Math**: `ABS()`, `ROUND()`, `CEIL()`, `FLOOR()`
- **Null handling**: `IsEmpty()`, `SIZE()`

## 📖 Ejemplos Completos

### Ejemplo 1: Análisis Básico de Usuarios

```pig
-- Cargar datos de usuarios
users = LOAD 'users.csv' USING PigStorage(',') 
        AS (user_id:int, name:chararray, age:int, country:chararray);

-- Filtrar usuarios mayores de 30
adult_users = FILTER users BY age > 30;

-- Contar usuarios por país (veremos GROUP en Nivel 2)
DUMP adult_users;
```

### Ejemplo 2: Procesamiento de Productos

```pig
-- Cargar productos
products = LOAD 'products.csv' USING PigStorage(',')
           AS (name:chararray, category:chararray, price:float);

-- Filtrar productos caros
expensive = FILTER products BY price > 500;

-- Ordenar por precio
sorted = ORDER expensive BY price DESC;

-- Ver top 5
top5 = LIMIT sorted 5;
DUMP top5;
```

### Ejemplo 3: Limpieza de Datos

```pig
-- Cargar con esquema flexible
raw_data = LOAD 'data.csv' USING PigStorage(',');

-- Proyectar solo columnas necesarias (índices 0-indexed: $0, $1, ...)
clean = FOREACH raw_data GENERATE $0 AS id, $1 AS value;

-- Eliminar duplicados
unique = DISTINCT clean;

DUMP unique;
```

## 🎯 Lista de Ejercicios (30)

Los ejercicios progresan desde operaciones básicas hasta combinaciones más complejas:

**Ejercicios 1-10**: LOAD, LIMIT, DUMP, DESCRIBE
- Cargar datasets y explorar estructuras
- Practicar diferentes delimitadores y esquemas

**Ejercicios 11-20**: FILTER con condiciones variadas
- Filtrado simple (==, !=, <, >)
- Condiciones compuestas (AND, OR, NOT)
- Expresiones regulares con MATCHES

**Ejercicios 21-30**: FOREACH, ORDER, DISTINCT
- Selección y transformación de columnas
- Operaciones aritméticas
- Ordenamiento y eliminación de duplicados

## 🔗 Recursos Oficiales

- [Pig Latin Basics - Apache Pig Documentation](https://pig.apache.org/docs/latest/basic.html)
- [Pig Data Model](https://pig.apache.org/docs/latest/basic.html#data-model)
- [Pig Latin Statements](https://pig.apache.org/docs/latest/basic.html#pig-latin-statements)
- [Built-in Functions](https://pig.apache.org/docs/latest/func.html)

---

**¡Comienza con el Ejercicio 1 y practica paso a paso!**
