# Nivel 1: Básico - Fundamentos de HiveQL

Bienvenido al primer nivel de tu aprendizaje en HiveQL. Antes de pasar a los ejercicios, es fundamental que estudies y comprendas los conceptos teóricos que se presentan a continuación. Todos los ejercicios de este nivel están estrictamente basados en esta teoría.

## 1. Creación de Tablas (CREATE EXTERNAL TABLE)
En Hive, para poder consultar datos que están en un archivo (como un CSV), primero debemos definir su estructura (esquema). Esto se hace creando una tabla externa.

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS users (
  user_id INT,
  name STRING,
  age INT,
  country STRING,
  signup_date STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/datasets/'
TBLPROPERTIES ('skip.header.line.count'='1');
```
- `EXTERNAL`: Indica que Hive no administra los archivos subyacentes, solo la estructura.
- `ROW FORMAT DELIMITED FIELDS TERMINATED BY ','`: Le dice a Hive que los datos están separados por comas.
- `LOCATION`: La carpeta donde están los archivos de datos.
- `TBLPROPERTIES`: Permite configuraciones extras, como saltar la primera línea (el encabezado).

## 2. Consultas Básicas (SELECT, FROM, LIMIT)
La operación más fundamental es seleccionar datos de una tabla.
- **`SELECT * FROM tabla;`**: Selecciona todas las columnas.
- **`SELECT columna1, columna2 FROM tabla;`**: Selecciona columnas específicas.
- **`LIMIT n`**: Limita el resultado a `n` filas.
- **`OFFSET m`**: Salta las primeras `m` filas (se usa junto a LIMIT). Ejemplo: `LIMIT 5 OFFSET 10`.

## 3. Filtrado de Datos (WHERE y Operadores Lógicos)
Para filtrar filas que cumplen cierta condición, usamos la cláusula `WHERE`.
- **Operadores de comparación**: `=`, `>`, `<`, `>=`, `<=`, `!=` (o `<>`).
- **`AND` / `OR`**: Combina múltiples condiciones.
  - *Ejemplo:* `WHERE age > 25 AND country = 'UK'`
- **`NOT`**: Niega una condición. Ejemplo: `WHERE country != 'UK'`.
- **`IN (valor1, valor2)`**: Comprueba si el valor coincide con alguno de la lista.
  - *Ejemplo:* `WHERE country IN ('USA', 'Canada')`
- **`BETWEEN x AND y`**: Comprueba si el valor está en un rango (inclusivo).
  - *Ejemplo:* `WHERE age BETWEEN 25 AND 35`
- **`LIKE`**: Busca un patrón de texto usando el comodín `%` (representa cero o más caracteres).
  - *Ejemplo:* `WHERE name LIKE 'A%'` (Nombres que empiezan con A).
- **`IS NULL` / `IS NOT NULL`**: Comprueba si un valor es nulo (inexistente). Nunca uses `= NULL`.

## 4. Agregaciones Matemáticas
HiveQL proporciona funciones para calcular estadísticas sobre los datos.
- **`COUNT(*)`**: Cuenta el número total de filas.
- **`SUM(columna)`**: Suma todos los valores numéricos de una columna.
- **`AVG(columna)`**: Calcula el promedio aritmético.
- **`MAX(columna)` / `MIN(columna)`**: Encuentra el valor máximo o mínimo.
- **`ROUND(numero, decimales)`**: Redondea un número a la cantidad de decimales especificada. Útil en combinación con AVG.

> 💡 **Alias (AS)**: Puedes renombrar temporalmente el resultado de una función usando `AS`. Ejemplo: `SELECT SUM(age) AS total_edades...`

## 5. Agrupación (GROUP BY)
Cuando usas funciones de agregación (como `COUNT` o `AVG`) junto con una columna normal, debes agrupar los resultados usando `GROUP BY`.
```sql
SELECT country, COUNT(*) as total_usuarios
FROM users
GROUP BY country;
```
Esto calculará el número de usuarios *por cada* país diferente.

## 6. Valores Únicos (DISTINCT)
Si solo quieres saber qué valores existen en una columna sin duplicados, usa `DISTINCT`.
```sql
SELECT DISTINCT country FROM users;
```
También se puede combinar con `COUNT` para contar cuántos valores únicos hay: `COUNT(DISTINCT country)`.

## 7. Ordenamiento (ORDER BY)
Por defecto, los datos se devuelven en un orden arbitrario. Para ordenarlos, usa `ORDER BY`.
- **`ASC`**: Orden ascendente (de menor a mayor). Es el valor por defecto.
- **`DESC`**: Orden descendente (de mayor a menor).
- *Ejemplo:* `ORDER BY age DESC`

---
📝 **Regla de oro de este nivel**: Asegúrate de haber entendido perfectamente estas cláusulas. Todos los ejercicios que estás a punto de resolver se basan **exclusivamente** en los conceptos explicados aquí.
