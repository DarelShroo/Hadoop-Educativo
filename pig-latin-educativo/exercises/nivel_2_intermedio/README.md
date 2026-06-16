# Nivel 2: Intermedio - Operaciones Relacionales en Pig Latin

En este nivel aprenderás cómo combinar múltiples flujos de datos y realizar cálculos complejos o agrupaciones. Asegúrate de leer estos conceptos antes de avanzar a los ejercicios.

## 1. Uniones de Relaciones (JOIN)
Pig Latin permite hacer joins de manera muy similar a SQL, pero recuerda que es un paso en el pipeline de datos.

- **`INNER JOIN`**: Retiene las filas donde la clave de cruce coincide en ambas relaciones.
  ```pig
  joined = JOIN users BY user_id, orders BY user_id;
  ```
  *Nota sobre la proyección:* Después de un JOIN, los campos mantienen el prefijo de la relación de la que provienen para evitar colisiones. Para accederlos, usa `relacion::campo`. Por ejemplo: `users::name`.

- **`LEFT OUTER JOIN`**: Retiene todos los registros de la relación izquierda y añade los de la derecha si existen; si no existen, los rellena con nulos.
  ```pig
  joined = JOIN users BY user_id LEFT OUTER, orders BY user_id;
  ```

- **Replicated JOIN**: Si sabes que la relación derecha es tan pequeña que cabe completamente en la memoria RAM, puedes forzar a Pig a cargarla en memoria para acelerar el cruce brutalmente usando el hint `USING 'replicated'`.
  ```pig
  joined = JOIN users BY user_id, orders BY user_id USING 'replicated';
  ```

## 2. Producto Cartesiano (CROSS)
Genera todas las combinaciones posibles de las filas de dos relaciones.
⚠️ *Precaución: El tamaño del resultado será el tamaño de `tabla1` multiplicado por el tamaño de `tabla2`. Úsalo solo en conjuntos muy pequeños.*
```pig
cruzado = CROSS tabla_pequena_1, tabla_pequena_2;
```

## 3. Agrupación (GROUP y COGROUP)
Ya vimos `GROUP` brevemente, pero es el corazón de las agregaciones en Pig. 
- **`GROUP`**: Agrupa una sola relación por una o varias claves.
  ```pig
  agrupado = GROUP users BY country;
  ```
  Esto devuelve tuplas con la estructura `(clave, {bag_con_filas})`. La clave siempre se denomina `group`.

- **`COGROUP`**: Agrupa dos o más relaciones simultáneamente por una clave común.
  ```pig
  cogrp = COGROUP users BY user_id, orders BY user_id;
  ```
  El resultado tendrá una estructura `(clave, {bag_users}, {bag_orders})`. Es una herramienta muy potente para agrupar antes de aplicar lógica manual en lugar de usar un JOIN plano.

## 4. Agregaciones Matemáticas
Después de agrupar, a menudo queremos reducir esos "bags" a números.
- `COUNT(bag)`: Cuenta los elementos en un bag.
- `SUM(bag.campo)`: Suma los valores numéricos.
- `AVG(bag.campo)`: Calcula el promedio.
- `MIN(bag.campo)` / `MAX(bag.campo)`: Extrae los extremos.

```pig
resultado = FOREACH agrupado GENERATE group AS pais, COUNT(users) AS total;
```

## 5. Ranking Manual (RANK)
Aunque puedes ordenar con `ORDER`, la función `RANK` enumera directamente las filas según su posición.
```pig
ordenados = ORDER users BY age DESC;
rankeados = RANK ordenados;
```
El campo agregado se llamará automáticamente `rank_ordenados`.

## 6. Funciones Integradas Adicionales (UPPER, SUBSTRING, CONCAT, ROUND)
Dentro de la cláusula `FOREACH ... GENERATE` puedes aplicar transformaciones a nivel de fila:
- **`UPPER(campo)`**: Pasa el texto a mayúsculas.
- **`SUBSTRING(campo, inicio, fin)`**: Extrae una porción de texto. *(Ojo, el índice de inicio en Pig es 0).*
- **`CONCAT(campo1, campo2)`**: Une dos cadenas de texto. Solo acepta dos argumentos. Para unir más, debes anidar: `CONCAT(CONCAT(a, b), c)`.
- **`ROUND(campo)`**: Redondea un número al entero más cercano.

---
📝 **Regla de oro de este nivel**: Domina la desambiguación (`tabla::columna`) después de realizar cruces y el acceso al campo especial `group` después de agrupar. Estos ejercicios afianzarán tu capacidad de manipular datos relacionales distribuidos.
