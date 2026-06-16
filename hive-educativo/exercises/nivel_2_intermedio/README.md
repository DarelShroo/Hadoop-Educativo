# Nivel 2: Intermedio - Operaciones Avanzadas en HiveQL

En este segundo nivel, aprenderás a relacionar datos entre múltiples tablas y a utilizar funciones integradas para transformar textos. Lee detenidamente estos conceptos antes de intentar resolver los ejercicios.

## 1. Uniones de Tablas (JOINs)
En la vida real, los datos suelen estar repartidos en múltiples tablas. Los `JOIN` permiten combinar filas de dos o más tablas basándose en una columna relacionada entre ellas (normalmente un ID).

- **`INNER JOIN`**: Devuelve solo las filas donde hay una coincidencia en ambas tablas.
  ```sql
  SELECT u.name, o.product 
  FROM users u
  INNER JOIN orders o ON u.user_id = o.user_id;
  ```
  *(Nota: Se suelen usar "alias" como `u` y `o` para no escribir el nombre completo de la tabla repetidas veces).*

- **`LEFT JOIN`**: Devuelve **todas** las filas de la tabla izquierda (`users` en este caso), y las filas coincidentes de la tabla derecha (`orders`). Si un usuario no tiene órdenes, las columnas de la orden se mostrarán como `NULL`.

- **`RIGHT JOIN`**: Devuelve **todas** las filas de la tabla derecha, y las coincidencias de la izquierda. Si una orden no tiene un usuario asignado, las columnas del usuario serán `NULL`.

## 2. Filtrado de Agrupaciones (HAVING)
La cláusula `WHERE` filtra datos *antes* de agruparlos. Si necesitas filtrar datos *después* de haberlos agrupado (por ejemplo, "países que tengan más de 5 usuarios"), debes usar `HAVING`.
```sql
SELECT country, COUNT(*) as total
FROM users
GROUP BY country
HAVING COUNT(*) > 5;
```

## 3. Agrupaciones Múltiples (Múltiples GROUP BY)
Puedes agrupar por más de una columna. Esto crea sub-grupos.
```sql
SELECT country, age, COUNT(*) 
FROM users 
GROUP BY country, age;
```
Esto cuenta cuántas personas hay de *una edad específica* dentro de *un país específico*.

## 4. Combinar Resultados (UNION)
Si tienes dos consultas diferentes que devuelven el mismo tipo de columnas y quieres juntar sus resultados en una sola lista, usas `UNION`.
```sql
SELECT name FROM users WHERE age < 25
UNION
SELECT name FROM users WHERE age > 40;
```
*Nota: `UNION` elimina los resultados duplicados. Si quieres conservarlos, usa `UNION ALL`.*

## 5. Funciones de Texto (String Functions)
Hive proporciona funciones para manipular texto directamente en la consulta:
- **`CONCAT(texto1, texto2, ...)`**: Une múltiples textos en uno solo.
  - *Ejemplo:* `CONCAT(name, ' is from ', country)` -> "John is from UK"
- **`SUBSTRING(texto, inicio, longitud)`**: Extrae una parte de un texto. El índice empieza en 1.
  - *Ejemplo:* `SUBSTRING('HiveQL', 1, 4)` -> "Hive"
- **`LENGTH(texto)`**: Devuelve la cantidad de caracteres que tiene un texto.
  - *Ejemplo:* `LENGTH('Hadoop')` -> 6
- **`UPPER(texto)` / `LOWER(texto)`**: Convierte el texto entero a mayúsculas o minúsculas respectivamente.

---
📝 **Regla de oro de este nivel**: Todos los ejercicios de la sección intermedia requerirán estrictamente la aplicación de estas técnicas. Practica combinar JOINs con funciones de texto y agrupaciones.
