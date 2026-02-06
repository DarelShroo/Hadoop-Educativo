# Nivel 2: Intermedio - Operaciones Avanzadas

## 📚 Teoría

### Operaciones de Agregación y Agrupamiento

A este nivel, trabajarás con operaciones más complejas que involucran joins, agrupaciones y funciones integradas.

### Conceptos Clave

#### 1. GROUP BY - Agrupar Datos

```pig
-- Agrupar por una columna
grouped = GROUP users BY country;

-- El resultado es: (country, {bag of all tuples with that country})
-- grouped: {group: chararray, users: {(user_id, name, age, country)}}

-- Contar por grupo
counts = FOREACH grouped GENERATE group AS country, COUNT(users) AS num_users;
```

**Funciones de agregación**:
- `COUNT()`: Contar tuplas
- `SUM()`: Sumar valores
- `AVG()`: Promedio
- `MIN()`: Mínimo
- `MAX()`: Máximo

#### 2. JOIN - Combinar Relaciones

```pig
-- INNER JOIN (solo coincidencias)
joined = JOIN users BY user_id, orders BY user_id;

-- LEFT OUTER JOIN (todas las filas de la izquierda)
left_join = JOIN users BY user_id LEFT OUTER, orders BY user_id;

-- RIGHT OUTER JOIN
right_join = JOIN users BY user_id RIGHT OUTER, orders BY user_id;

-- FULL OUTER JOIN (todas las filas de ambas)
full_join = JOIN users BY user_id FULL OUTER, orders BY user_id;

-- Join múltiple
multi = JOIN users BY user_id, orders BY user_id, products BY product_id;
```

#### 3. COGROUP - Agrupar Múltiples Relaciones

```pig
-- Similar a GROUP pero para múltiples relaciones
cogrouped = COGROUP users BY user_id, orders BY user_id;

-- Resultado: (user_id, {bag of users}, {bag of orders})
```

#### 4. Funciones Integradas

**String Functions**:
```pig
-- UPPER/LOWER
upper_names = FOREACH users GENERATE UPPER(name) AS name_upper;

-- SUBSTRING(string, startIndex, endIndex)
initials = FOREACH users GENERATE SUBSTRING(name, 0, 1) AS initial;

-- CONCAT
full_info = FOREACH users GENERATE CONCAT(name, ' - ', country) AS info;

-- TRIM, LTRIM, RTRIM
cleaned = FOREACH data GENERATE TRIM(field) AS clean_field;
```

**Math Functions**:
```pig
-- ROUND, CEIL, FLOOR
rounded = FOREACH sales GENERATE ROUND(amount) AS rounded_amount;

-- ABS
absolute = FOREACH data GENERATE ABS(value) AS abs_value;
```

**Collection Functions**:
```pig
-- SIZE: Tamaño de bag/map/tuple
sizes = FOREACH grouped GENERATE group, SIZE(users) AS count;

-- IsEmpty: Verificar si está vacío
non_empty = FILTER data BY NOT IsEmpty(field);
```

#### 5. SPLIT - Dividir en Múltiples Relaciones

```pig
-- Divide una relación en varias basadas en condiciones
SPLIT users INTO
  young IF age < 30,
  middle IF age >= 30 AND age < 50,
  senior IF age >= 50;
```

#### 6. UNION - Combinar Relaciones

```pig
-- Combina dos relaciones (deben tener mismo esquema)
all_data = UNION table1, table2;
```

#### 7. FLATTEN - Aplanar Bags

```pig
-- Convierte bag en tuplas individuales
grouped = GROUP orders BY user_id;
flattened = FOREACH grouped GENERATE FLATTEN(orders);
```

## 📖 Ejemplos Completos

### Ejemplo 1: Contar Usuarios por País

```pig
users = LOAD 'users.csv' USING PigStorage(',') 
        AS (user_id:int, name:chararray, age:int, country:chararray);

-- Agrupar por país
by_country = GROUP users BY country;

-- Contar
counts = FOREACH by_country GENERATE group AS country, COUNT(users) AS total;

-- Ordenar
sorted = ORDER counts BY total DESC;

DUMP sorted;
```

### Ejemplo 2: Join de Usuarios y Órdenes

```pig
users = LOAD 'users.csv' USING PigStorage(',') 
        AS (user_id:int, name:chararray, age:int, country:chararray);
        
orders = LOAD 'orders.csv' USING PigStorage(',')
         AS (order_id:int, user_id:int, product:chararray, quantity:int, price:float);

-- Join
user_orders = JOIN users BY user_id, orders BY user_id;

-- Proyectar campos relevantes
result = FOREACH user_orders GENERATE 
         users::name AS customer_name,
         orders::product AS product,
         orders::quantity AS qty;

DUMP result;
```

### Ejemplo 3: Ventas Totales por Región

```pig
sales = LOAD 'sales.csv' USING PigStorage(',')
        AS (sale_id:int, region:chararray, category:chararray, amount:float);

-- Agrupar por región
by_region = GROUP sales BY region;

-- Calcular totales
totals = FOREACH by_region GENERATE 
         group AS region,
         SUM(sales.amount) AS total_sales,
         AVG(sales.amount) AS avg_sale,
         COUNT(sales) AS num_sales;

DUMP totals;
```

### Ejemplo 4: Encontrar Top Productos por Ventas

```pig
orders = LOAD 'orders.csv' USING PigStorage(',')
         AS (order_id:int, user_id:int, product:chararray, quantity:int, price:float);

-- Calcular total por producto
by_product = GROUP orders BY product;
product_totals = FOREACH by_product GENERATE 
                 group AS product,
                 SUM(orders.quantity) AS total_quantity,
                 SUM(orders.quantity * orders.price) AS revenue;

-- Ordenar por revenue
sorted = ORDER product_totals BY revenue DESC;
top5 = LIMIT sorted 5;

DUMP top5;
```

## 🎯 Lista de Ejercicios (40)

**Ejercicios 1-12**: JOIN operations
- INNER JOIN entre diferentes tablas
- LEFT/RIGHT/FULL OUTER JOIN
- Joins múltiples
- Proyección después de JOIN

**Ejercicios 13-24**: GROUP BY y agregaciones
- GROUP BY simple
- COUNT, SUM, AVG, MIN, MAX
- Múltiples agregaciones
- Filtrar grupos (HAVING-like)

**Ejercicios 25-32**: Funciones integradas
- String manipulation (UPPER, LOWER, CONCAT, SUBSTRING)
- Math functions (ROUND, ABS, CEIL, FLOOR)
- Collection functions (SIZE, IsEmpty)

**Ejercicios 33-40**: Operaciones complejas
- SPLIT y UNION
- COGROUP
- FLATTEN
- Queries anidados complejos

## 🔗 Recursos Oficiales

- [Pig Join Operations](https://pig.apache.org/docs/latest/basic.html#join)
- [Pig Group Operations](https://pig.apache.org/docs/latest/basic.html#group)
- [Built-in Functions](https://pig.apache.org/docs/latest/func.html)
- [Eval Functions](https://pig.apache.org/docs/latest/func.html#eval-functions)

---

**¡Estos conceptos son el núcleo del procesamiento de datos en Pig!**
