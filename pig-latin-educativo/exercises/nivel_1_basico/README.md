# Nivel 1: Básico - Fundamentos de Pig Latin

Bienvenido al primer nivel de Pig Latin. A diferencia de SQL, Pig Latin es un lenguaje procedimental de flujo de datos (Data Flow). En lugar de escribir una única consulta declarativa, en Pig escribes paso a paso las transformaciones que sufrirán tus datos.

Por favor, lee y comprende la teoría antes de comenzar los ejercicios de este nivel.

## 1. Carga de Datos (LOAD)
El primer paso en cualquier script de Pig es cargar los datos. Usamos la función `PigStorage` para especificar cómo están separados los datos y la palabra clave `AS` para definir el esquema (nombres de las columnas y sus tipos de datos).
```pig
users = LOAD '/datasets/users.csv' 
        USING PigStorage(',') 
        AS (user_id:int, name:chararray, age:int, country:chararray);
```
- `chararray`: Equivalente a string/texto.
- `int` / `float`: Tipos numéricos.

## 2. Inspección y Depuración (DESCRIBE, LIMIT, DUMP)
- **`DESCRIBE relacion;`**: Muestra la estructura (el esquema) de la relación. No procesa datos, solo lee los metadatos.
- **`LIMIT relacion n;`**: Toma solo las primeras `n` filas. Ideal para probar sin procesar miles de registros.
- **`DUMP relacion;`**: Ejecuta el pipeline e imprime los resultados en pantalla. Todo script debe terminar con un `DUMP` o `STORE` para que Hadoop ejecute las acciones.
```pig
top5 = LIMIT users 5;
DUMP top5;
```

## 3. Proyección de Columnas (FOREACH ... GENERATE)
Equivale al `SELECT` en SQL. Se usa para seleccionar columnas específicas, crear nuevas o aplicar transformaciones matemáticas fila por fila.
```pig
-- Seleccionar columnas
nombres = FOREACH users GENERATE name, country;

-- Crear nuevas columnas y renombrarlas con AS
edades_meses = FOREACH users GENERATE name, age * 12 AS age_in_months;
```

## 4. Filtrado de Datos (FILTER ... BY)
Equivalente al `WHERE` de SQL. Filtra las filas según condiciones matemáticas o lógicas.
```pig
adultos = FILTER users BY age >= 18;
usa_users = FILTER users BY country == 'USA';
```
- Operadores: `==` (igualdad), `>`, `<`, `>=`, `<=`, `!=`
- Lógica: `AND`, `OR`, `NOT`

## 5. Ordenamiento (ORDER ... BY)
Ordena los datos basándose en una o más columnas.
```pig
ordenados = ORDER users BY age DESC;
```
- `ASC`: Ascendente (predeterminado).
- `DESC`: Descendente (de mayor a menor).

## 6. Eliminación de Duplicados (DISTINCT)
Elimina las tuplas (filas) repetidas en una relación. Si necesitas valores únicos de una columna, primero proyecta esa columna con `FOREACH` y luego aplica `DISTINCT`.
```pig
paises = FOREACH users GENERATE country;
paises_unicos = DISTINCT paises;
```

## 7. Muestreo Aleatorio (SAMPLE)
Devuelve un porcentaje aleatorio del conjunto de datos. Útil para hacer pruebas estadísticas.
```pig
-- Toma un 30% aleatorio (0.3)
muestra = SAMPLE users 0.3;
```

## 8. Agrupación y División de Datos (UNION, SPLIT)
- **`UNION rel1, rel2;`**: Une dos o más relaciones que tienen el mismo esquema agregando sus filas.
- **`SPLIT`**: Divide una relación en múltiples relaciones de forma condicional.
```pig
SPLIT users INTO 
    jovenes IF age < 25, 
    adultos IF age >= 25 AND age <= 40, 
    mayores IF age > 40;
```

## 9. Agrupación y Agregación (GROUP, MAX, MIN)
En Pig, `GROUP` crea un registro complejo donde la clave se llama `group` y los valores son una "bolsa" (bag) con todas las filas originales.
```pig
agrupados = GROUP users BY country;
-- Esto crea: (USA, {(1,John,30,USA), (2,Mary,25,USA)})

-- Luego podemos calcular agregados:
resultados = FOREACH agrupados GENERATE group AS pais, MAX(users.age);
```

---
📝 **Regla de oro de este nivel**: Recuerda que Pig es secuencial. Debes asignar el resultado de cada transformación a una nueva variable (relación) y usar esa nueva variable en el siguiente paso. ¡Todo culmina con un `DUMP`!
