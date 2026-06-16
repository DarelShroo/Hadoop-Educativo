# Nivel 3: Avanzado - Subconsultas y Window Functions en HiveQL

Este nivel introduce conceptos avanzados de análisis de datos. Aprenderás a escribir consultas dentro de consultas (subconsultas) y a utilizar funciones de ventana (*Window Functions*) para realizar cálculos analíticos complejos que respetan el detalle a nivel de fila.

## 1. Subconsultas (Subqueries)
Una subconsulta es una consulta anidada dentro de otra consulta principal.
- **En la cláusula `WHERE` con `IN`**: Útil para filtrar resultados basándote en un conjunto de datos dinámico.
  ```sql
  SELECT name FROM users 
  WHERE user_id IN (SELECT user_id FROM orders);
  ```
  *(Esto selecciona los nombres de usuarios que tienen al menos un ID registrado en la tabla de órdenes).*

- **Con `EXISTS`**: Funciona de forma similar a `IN`, pero evalúa si la subconsulta devuelve *alguna* fila (devuelve un booleano `true`/`false`). A menudo es más eficiente que `IN` para conjuntos de datos grandes.
  ```sql
  SELECT name FROM users u 
  WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.user_id);
  ```

## 2. Expresiones de Tabla Comunes (WITH CTE)
Las CTE (Common Table Expressions) te permiten nombrar una subconsulta temporal y reutilizarla en la consulta principal. Esto hace que el código sea mucho más limpio y legible.
```sql
WITH young_users AS (
  SELECT * FROM users WHERE age < 25
)
SELECT country, COUNT(*) FROM young_users GROUP BY country;
```

## 3. Lógica Condicional (CASE WHEN)
Actúa como un bloque `if/else` dentro de tu consulta SQL para crear nuevas columnas basadas en condiciones.
```sql
SELECT name, age,
  CASE
    WHEN age < 25 THEN 'Joven'
    WHEN age BETWEEN 25 AND 40 THEN 'Adulto'
    ELSE 'Senior'
  END AS age_group
FROM users;
```

## 4. Funciones de Ventana (Window Functions)
Las Window Functions realizan cálculos sobre un conjunto de filas relacionadas con la fila actual, pero **sin agruparlas** en una sola fila (a diferencia de `GROUP BY`).
La sintaxis básica incluye la cláusula `OVER()`, que puede dividirse en `PARTITION BY` (como un group by interno) y `ORDER BY`.

- **`ROW_NUMBER()`**: Asigna un número de secuencia único a cada fila, empezando por 1.
  ```sql
  ROW_NUMBER() OVER (PARTITION BY country ORDER BY name) as row_num
  ```
  *(Numera a los usuarios del 1 en adelante, reseteando la cuenta para cada país distinto).*

- **`RANK()`**: Asigna un rango numérico a cada fila según un orden. Si hay empates, les asigna el mismo número, pero **salta** los siguientes números en la secuencia (ej. 1, 2, 2, 4).
  ```sql
  RANK() OVER (ORDER BY age DESC) as age_rank
  ```

- **`DENSE_RANK()`**: Similar a `RANK()`, pero **no salta** números en la secuencia si hay un empate (ej. 1, 2, 2, 3).

- **`LAG(columna, offset)` / `LEAD(columna, offset)`**: Accede a datos de filas anteriores (`LAG`) o posteriores (`LEAD`) sin necesidad de hacer JOIN con la misma tabla.
  ```sql
  LAG(name, 1) OVER (PARTITION BY country ORDER BY user_id) as prev_user
  ```
  *(Devuelve el nombre del usuario anterior (1 paso atrás) en el mismo país).*

---
📝 **Regla de oro de este nivel**: Domina la sintaxis `OVER (PARTITION BY ... ORDER BY ...)`. Estos conceptos representan el SQL analítico moderno y te permitirán resolver el 100% de los ejercicios de esta sección.
