# Nivel 3: Avanzado - Macros, Anidación y Estructuras Complejas en Pig Latin

En este último nivel dominarás las características más avanzadas de Pig Latin, aquellas que permiten abstraer lógica, optimizar el rendimiento en clústeres reales y manipular estructuras de datos anidadas.

## 1. Macros (DEFINE ... RETURNS)
Si te encuentras repitiendo la misma lógica (como filtrar y contar), puedes crear una Macro. Las macros se expanden antes de ejecutarse, haciendo tu código modular.
```pig
DEFINE filter_and_count(data, field, value) RETURNS result {
  filtered = FILTER $data BY $field == $value;
  $result = FOREACH (GROUP filtered ALL) GENERATE COUNT(filtered) AS total;
};

usa_count = filter_and_count(users, country, 'USA');
```
*Observa el uso del símbolo `$` para referenciar los parámetros de la macro.*

## 2. Ejecución Paralela (PARALLEL)
En un clúster de Hadoop real, operaciones como `GROUP` y `ORDER` (que implican la fase de "Reduce") pueden convertirse en cuellos de botella. Puedes indicar a Hadoop cuántos "Reducers" (nodos/hilos) usar simultáneamente mediante la palabra clave `PARALLEL`.
```pig
by_product = GROUP orders BY product PARALLEL 10;
sorted = ORDER sales BY amount DESC PARALLEL 5;
```

## 3. FOREACH Anidado (Nested FOREACH)
Cuando agrupas datos con `GROUP`, el resultado incluye un *bag* (una bolsa) con todas las filas originales. Pig permite abrir un bloque `{ ... }` en un `FOREACH` para procesar esos *bags* internamente fila por fila.
Es muy común usarlo para calcular "el top N por cada categoría".
```pig
by_user = GROUP orders BY user_id;

result = FOREACH by_user {
  -- Ordena internamente el bag 'orders' de este usuario específico
  sorted_orders = ORDER orders BY order_date DESC;
  -- Toma los 3 más recientes
  recent = LIMIT sorted_orders 3;
  -- Emite el resultado final
  GENERATE group AS user_id, recent;
};
```

## 4. Manipulación de Estructuras (FLATTEN, TOTUPLE, TOBAG, BagToTuple)
A veces las tuplas y los bags no tienen el formato que necesitas:
- **`FLATTEN`**: Toma un bag y lo "aplana", desempaquetando sus elementos y creando una fila separada para cada elemento del bag combinado con el resto de la tupla. Es la operación inversa al `GROUP`.
  ```pig
  aplanado = FOREACH agrupado GENERATE group, FLATTEN(orders);
  ```
- **`TOTUPLE(campo1, campo2)`**: Crea una nueva tupla combinando varios campos separados.
- **`TOBAG(campo1, campo2)`**: Crea un nuevo bag a partir de campos separados.
- **`BagToTuple(bag)`**: Convierte un bag en una tupla plana (muy útil si sabes que el bag tiene un tamaño fijo o pequeño).

## 5. Expresiones Regulares (REGEX_EXTRACT)
Puedes extraer partes de un texto usando expresiones regulares potentes de Java.
```pig
-- Extrae la primera palabra que empiece por mayúscula
resultado = FOREACH users GENERATE REGEX_EXTRACT(name, '([A-Z][a-z]+)', 1);
```

## 6. Funciones Personalizadas (UDF) y Streaming (STREAM)
- **Built-in UDFs**: Pig trae funciones predefinidas como `UPPER()` o `LOWER()`.
- **`STREAM`**: Si Pig Latin no es suficiente, puedes pasar tus datos a través de un script externo (como Python o Bash).
  ```pig
  streamed = STREAM users THROUGH `cat`;
  ```

---
📝 **Regla de oro de este nivel**: Entender cómo manipular los *bags* internos generados por `GROUP` a través de un **Nested FOREACH** y el comando **FLATTEN** es el salto definitivo de un programador intermedio a uno avanzado en procesamiento de Big Data.
