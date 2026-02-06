# Nivel 3: Avanzado - Optimización y Características Avanzadas

## 📚 Teoría

### Temas Avanzados de Pig Latin

En este nivel, trabajarás con características avanzadas como User Defined Functions (UDFs), macros, optimización de rendimiento y técnicas para procesamiento de datos a escala.

### Conceptos Clave

#### 1. MACROS - Reutilización de Código

Los macros permiten def inir fragmentos de código Pig reutilizables, similar a funciones.

```pig
-- Definir un macro
DEFINE top_n(relation, field_name, n) RETURNS top_records {
  sorted = ORDER $relation BY $field_name DESC;
  $top_records = LIMIT sorted $n;
};

-- Usar el macro
data = LOAD 'input.csv' USING PigStorage(',');
top_10 = top_n(data, price, 10);
DUMP top_10;
```

#### 2. User Defined Functions (UDFs)

Pig permite extender funcionalidad con UDFs en Python o Java.

**Python UDF** (más simple):
```python
# my_udf.py
@outputSchema("result:chararray")
def reverse_string(text):
    if text is None:
        return None
    return text[::-1]
```

**Usar en Pig**:
```pig
REGISTER 'my_udf.py' USING jython AS myudf;

data = LOAD 'input.csv' AS (text:chararray);
result = FOREACH data GENERATE myudf.reverse_string(text) AS reversed;
DUMP result;
```

#### 3. PARALLEL - Optimización de Paralelismo

```pig
-- Especificar número de reducers
grouped = GROUP large_data BY key PARALLEL 50;

-- ORDER también puede usar PARALLEL
sorted = ORDER data BY field PARALLEL 20;
```

#### 4. STREAMING - Integración con Comandos Externos

```pig
-- Procesar datos con scripts externos
DEFINE CMD `python process.py` SHIP('process.py');

data = LOAD 'input.csv';
processed = STREAM data THROUGH CMD AS (output:chararray);
DUMP processed;
```

#### 5. Nested FOREACH - Operaciones Anidadas

```pig
grouped = GROUP orders BY user_id;

result = FOREACH grouped {
  sorted_orders = ORDER orders BY order_date DESC;
  recent = LIMIT sorted_orders 3;
  GENERATE group AS user_id, recent;
};
```

#### 6. Manejo de Datos Complejos

**Trabajar con Bags y Tuples**:
```pig
-- Crear bags manualmente
data = FOREACH input GENERATE TOBAG(field1, field2) AS my_bag;

-- Acceder a elementos de tuple
tuple_data = FOREACH input GENERATE $0, $1.$0 AS nested_field;

-- Aplanar bags
flattened = FOREACH grouped GENERATE group, FLATTEN(items);
```

#### 7. Optimización de Joins

```pig
-- Replicated Join (para tablas pequeñas)
joined = JOIN large_table BY key, small_table BY key USING 'replicated';

-- Skewed Join (para datos sesgados)
joined = JOIN table1 BY key, table2 BY key USING 'skewed';

-- Merge Join (para datos ordenados)
joined = JOIN sorted1 BY key, sorted2 BY key USING 'merge';
```

#### 8. Partitioning y Sampling

```pig
-- Muestreo
sample = SAMPLE data 0.1; -- 10% de los datos

-- Particionar datos
STORE data INTO 'output' PARTITION BY country;
```

## 📖 Ejemplos Completos

### Ejemplo 1: Macro para Análisis de Top N

```pig
-- Macro reutilizable
DEFINE analyze_top(relation, group_field, value_field, n) RETURNS analysis {
  grouped = GROUP $relation BY $group_field;
  aggregated = FOREACH grouped GENERATE 
                group AS category,
                COUNT($relation) AS count,
                SUM($relation.$value_field) AS total,
                AVG($relation.$value_field) AS average;
  sorted = ORDER aggregated BY total DESC;
  $analysis = LIMIT sorted $n;
};

-- Usar el macro
sales = LOAD 'sales.csv' USING PigStorage(',')
        AS (id:int, region:chararray, category:chararray, amount:float);

top_regions = analyze_top(sales, region, amount, 5);
DUMP top_regions;
```

### Ejemplo 2: Optimización de Join Grande

```pig
-- Join optimizado para datasets grandes
users = LOAD 'users.csv' USING PigStorage(',')
        AS (user_id:int, name:chararray);

orders = LOAD 'orders.csv' USING PigStorage(',')
         AS (order_id:int, user_id:int, amount:float);

-- Usar PARALLEL para distribuir trabajo
grouped_orders = GROUP orders BY user_id PARALLEL 30;

-- Agregar primero para reducir tamaño
order_stats = FOREACH grouped_orders GENERATE 
              group AS user_id,
              COUNT(orders) AS num_orders,
              SUM(orders.amount) AS total_spent;

-- Join con datos reducidos
result = JOIN users BY user_id, order_stats BY user_id PARALLEL 20;

DUMP result;
```

### Ejemplo 3: Procesamiento de Logs con Expresiones Regulares

```pig
logs = LOAD 'server-logs.csv' USING PigStorage(',')
       AS (timestamp:chararray, ip:chararray, path:chararray, status:int, response_time:int);

-- Filtrar errores (4xx y 5xx)
errors = FILTER logs BY status >= 400;

-- Extraer información con regex (si es necesario)
-- Note: REGEX_EXTRACT requiere regex patterns

-- Agrupar por código de estado
by_status = GROUP errors BY status;

error_summary = FOREACH by_status GENERATE 
                group AS status_code,
                COUNT(errors) AS occurrences,
                AVG(errors.response_time) AS avg_response_time;

-- Ordenar por frecuencia
sorted = ORDER error_summary BY occurrences DESC;

DUMP sorted;
```

### Ejemplo 4: Análisis de Serie Temporal

```pig
sales = LOAD 'sales.csv' USING PigStorage(',')
        AS (id:int, region:chararray, category:chararray, amount:float, date:chararray);

-- Extraer mes de la fecha (asumiendo formato YYYY-MM-DD)
with_month = FOREACH sales GENERATE 
             SUBSTRING(date, 0, 7) AS month,
             region,
             category,
             amount;

-- Agrupar por mes y categoría
by_month_category = GROUP with_month BY (month, category);

-- Agregar ventas mensuales
monthly_sales = FOREACH by_month_category GENERATE 
                FLATTEN(group) AS (month, category),
                SUM(with_month.amount) AS monthly_total,
                COUNT(with_month) AS num_transactions;

-- Ordenar cronológicamente
sorted = ORDER monthly_sales BY month, category;

DUMP sorted;
```

## 🎯 Lista de Ejercicios (30)

**Ejercicios 1-8**: MACROS
- Definir y usar macros básicos
- Macros con múltiples parámetros
- Macros anidados
- Macros para análisis complejos

**Ejercicios 9-16**: UDFs y STREAMING
- UDFs Python básicos
- Procesamiento de strings con UDFs
- STREAMING con scripts externos
- Integración de herramientas de procesamiento

**Ejercicios 17-24**: Optimización
- Uso de PARALLEL en GROUP y ORDER
- Joins optimizados (replicated, skewed, merge)
- Nested FOREACH para queries complejos
- Manejo eficiente de datos grandes

**Ejercicios 25-30**: Casos de Uso Reales
- Análisis de logs y detección de anomalías
- Procesamiento de datos de series temporales
- Pipeline completo de ETL
- Optimización de queries complejos

## 🔗 Recursos Oficiales

- [Pig Macros](https://pig.apache.org/docs/latest/basic.html#define-udfs-macros)
- [Pig UDFs](https://pig.apache.org/docs/latest/udf.html)
- [Performance and Optimization](https://pig.apache.org/docs/latest/perf.html)
- [Advanced Topics](https://pig.apache.org/docs/latest/basic.html#specialized-joins)
- [Pig Best Practices](https://pig.apache.org/docs/latest/perf.html#best-practices)

---

**¡Domina estos conceptos para convertirte en un experto en Pig Latin!**
