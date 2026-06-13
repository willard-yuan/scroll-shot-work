---
title: "¿Qué tan difícil es unir dos capturas de pantalla? Un motor de stitching para iOS que me hizo empezar de cero — una y otra vez"
description: "Desmontamos el motor de stitching de ScrollShot: seleccionar 30 fotogramas clave de entre 1.800, template matching inverso, búsqueda piramidal NCC, estrategia de fallback de tres niveles y los trucos de ingeniería que ningún libro enseña."
date: "2026-06-10"
category: "Técnica"
author: "Equipo de ScrollShot"
tags: ["captura larga iOS", "algoritmo de stitching", "template matching", "NCC", "motor ScrollShot", "stitching de grabación de pantalla"]
readingTime: "15 min de lectura"
featured: true
cover: "/scrollshot_video_to_long_screenshot_workflow_es.webp"
coverAlt: "Pipeline del motor de stitching de ScrollShot en seis pasos: de la grabación de pantalla a la imagen larga"
translationKey: "ios-stitching-engine-v2"
---

# ¿Qué tan difícil es unir dos capturas de pantalla? Un motor de stitching para iOS que me hizo empezar de cero — una y otra vez

Pasé varios meses haciendo una sola cosa: lograr que el stitching de capturas largas en el móvil quedara «perfectamente alineado».

Suena fácil, ¿no? Dos capturas adyacentes, encontrar el solapamiento, cortar y pegar. Pero cuando te pones a programar, descubres que «perfectamente alineado» es un pozo de ingeniería sin fondo.

Este artículo desmonta el motor de stitching de ScrollShot. Sin pitch de producto ni promesas vacías — solo algoritmos y los detalles de ingeniería que me obligaron a rediseñar una y otra vez. Si te interesa la visión general de ScrollShot, empieza por la <a href="/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/">descripción del producto: por qué elegir ScrollShot para capturas largas en iOS</a>.

---

## ¿Por qué no usar el stitching panorámico de OpenCV?

Intuitivamente, el ensamblaje de imágenes es un problema antiguo. La clase `Stitcher` de OpenCV genera panoramas en unas pocas líneas de código.

Pero las capturas largas y las fotos panorámicas son bestias completamente distintas. Una panorámica se captura con rotación horizontal y transformación en perspectiva, con un solapamiento generalmente pequeño. Una captura larga es **desplazamiento vertical unidireccional** — fotogramas consecutivos comparten entre un 5 % y un 80 % de contenido idéntico, y — esto es clave — **un desajuste de 2 píxeles se nota de inmediato** porque podrías estar uniendo texto.

Quien haya probado OpenCV comparte la misma experiencia: el feature matching se pierde en pantallas de chat. Algunos usuarios ponen imagen de fondo en su app de mensajería, así que la mayor parte del fotograma se ve igual. En lugar de que el final de un fotograma se solape con el inicio del siguiente, los puntos SIFT generan nubes de pares «similares pero diferentes».

Así que tomé otro camino: escribí la primera línea de un motor de template matching desde cero, optimizado para el escenario de «capturas de pantalla con desplazamiento vertical».

El pipeline general se ve así:

![Pipeline del motor de stitching de ScrollShot](/scrollshot_video_to_long_screenshot_workflow_es.webp)

El motor también soporta Apple Vision Framework para matching (rápido pero impreciso), pero este artículo se centra en el template matching propio — ahí es donde ocurre el trabajo pesado. Para ver cómo este algoritmo se traduce en una experiencia de <a href="/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/">graba una vez y obtén una captura larga</a>, consulta la presentación del producto.

---

## Reto 1: elegir 30 fotogramas útiles de entre 1.800

Una grabación de 30 segundos a 60 fps = 1.800 fotogramas. ¿Procesarlos todos? La memoria explota primero, el tiempo justo después.

El enfoque más intuitivo es el **muestreo por intervalo de tiempo**: 3 fotogramas por segundo. Pero tiene un defecto fatal — la velocidad de desplazamiento del usuario no es uniforme. En un swipe rápido, dos fotogramas consecutivos difieren en media pantalla, y el stitching pierde contenido inevitablemente. En navegación lenta, los fotogramas adyacentes son casi idénticos — puro desperdicio.

ScrollShot usa **muestreo por distancia**: en vez de mirar el tiempo, mira «cuánto se ha desplazado la pantalla». Solo se captura un fotograma cuando el desplazamiento acumulado supera un umbral.

### ¿Cuál es el umbral de desplazamiento adecuado?

Este número me tuvo en vela semanas. Muy pequeño, un desplazamiento lento provoca extracción frenética llena de duplicados. Muy grande, un desplazamiento rápido pierde contenido.

La fórmula final:

```
displacementThreshold = dsHeight × 0,60 × presetScale
```

Donde `dsHeight` es la altura del fotograma tras reducir la resolución (1080p reducido 3× ≈ 360p, es decir `dsHeight ≈ 640`), `0,60` es el ratio base y `presetScale` es un ajuste seleccionable (agresivo/equilibrado/conservador).

En modo equilibrado, se captura un fotograma cada **384 píxeles** (640 × 0,60) de desplazamiento — aproximadamente la mitad de la altura de pantalla.

También hay un filtro de ruido fácil de pasar por alto: **un desplazamiento individual debe ser ≥ 3 píxeles para contar en el acumulado**. Sin esto, el ruido subpíxel del template matching se acumula lentamente, provocando «extracción fantasma» incluso en una pantalla estática. Me llevó toda una tarde encontrar este bug.

### Dos pasadas en la práctica

**Pasada 1 — análisis de movimiento en baja resolución.** Los fotogramas se reducen 3× (1080p → 360p, un orden de magnitud de velocidad), y template matching ligero sigue el desplazamiento vertical fotograma a fotograma. Aquí se esconden varios detalles de ingeniería:

- **Paso adaptativo**: cuando el desplazamiento es grande, saltos grandes (`nativeFPS / 6`, cada ~10 fotogramas). Cuando es pequeño, escaneo fotograma a fotograma (`nativeFPS / 30`). Cuando la distancia restante baja del 25 % del umbral, paso mínimo forzado — de lo contrario te saltas literalmente un fotograma
- **Detección de cambio de escena**: ¿el SAD por píxel entre fotogramas adyacentes supera 40,0? Probablemente el usuario cambió de app. Capturar inmediatamente
- **Truncamiento por rebote**: usar el flujo óptico de Vision para detectar la dirección del movimiento. Si el desplazamiento acumulado cae por debajo de -50 px (el usuario vuelve hacia arriba), llegó al tope — descartar todos los fotogramas posteriores. Pero este umbral no puede ser muy ajustado: inicialmente puse -10, y un leve temblor del dedo disparaba el truncamiento, cortando la grabación a la mitad

**Pasada 1,5 — refinamiento de nitidez.** Para cada fotograma candidato, buscar el más nítido en una ventana de ±2 fotogramas alrededor.

¿Cómo cuantificar la nitidez? Uso la **energía laplaciana** — convolución de la imagen en escala de grises con un kernel 3×3, y luego la media de las respuestas al cuadrado:

```
kernel = [-1, -1, -1,
          -1,  8, -1,
          -1, -1, -1]

sharpness = mean((convolve(gray, kernel) - 128)²)
```

Se resta 128 porque la salida de convolución tiene un sesgo de 128 (requisito de vImage). El cuadrado y la media dan la energía de alta frecuencia. Valor más alto = fotograma más nítido.

¿Por qué energía laplaciana en vez de varianza? Para capturas de pantalla, ambos métodos seleccionan fotogramas casi idénticos, pero el primero es computacionalmente más simple — `vDSP_vsq` + `vDSP_meanv` de vImage, dos líneas.

El límite de resolución es 720×1280, suficiente. La razón es práctica: el fotograma más nítido es el instante en que el usuario levanta el dedo; los fotogramas durante el swipe suelen tener desenfoque de movimiento. La energía laplaciana es muy sensible a esto — la diferencia suele ser de 2–3×.

---

## El algoritmo central: motor de template matching

Es la parte con más código de todo el motor (más de 3.000 líneas en un solo archivo), y la que más me torturó con bugs.

### Matching inverso: ¿por qué buscar lo antiguo desde lo nuevo?

Mi primera versión usaba «matching directo» — template de la parte inferior del fotograma antiguo, búsqueda en el nuevo. Falló estrepitosamente en pantallas de WhatsApp: la parte inferior del antiguo mostraba un «OK», el nuevo tenía tres «OK». El matching se enganchó al de arriba, y el offset se desvió 200 píxeles.

Luego invertí el enfoque: **Reverse Matching**. Tomar el template de la **parte superior** del fotograma nuevo (img2) y buscar en la **parte inferior** del antiguo (img1).

¿Por qué el inverso es mejor? La parte superior del nuevo es «contenido recién scrolleado» — este contenido existe seguro en el fotograma antiguo, y **existe exactamente una vez** (en la parte media-inferior). A la inversa, el «contenido antiguo a punto de desaparecer» de la parte inferior del antiguo puede asomar apenas en el nuevo, o ya haber sido empujado fuera de pantalla.

![Diagrama de matching inverso](/scrollshot_video_to_long_screenshot_algo_es.webp)

La búsqueda salta automáticamente la barra de estado (~250 px superiores) y la tab bar inferior (~350 px). Pero aquí hay otra trampa — algunas apps tienen barras de navegación de alturas variables, algunas páginas tienen teclado, otras tienen botones flotantes.

Así que añadí **detección dinámica de footer**. Funciona así: escanear de abajo hacia arriba línea por línea, tomar el 80 % central de cada línea (recortar 10 % de cada lado para evitar botones flotantes), muestrear cada 16 píxeles y calcular la MAD (diferencia absoluta media) de la misma línea en ambos fotogramas. MAD ≤ 3,2 indica que la línea es casi idéntica — probablemente un elemento UI estático. Parar tras 4+ líneas consecutivas no estáticas (`maxGapTolerance = 4`). Menos de 24 líneas estáticas en total → no hay barra fija, devolver 0.

El umbral 3,2 es empírico. Una zona estática con fondo blanco tiene MAD de 0–1,5. El ruido de compresión JPEG fluctúa entre 2–4. Las líneas con cambio real de contenido están al menos en 8. 3,2 se sitúa justo en la brecha — tolera ruido de compresión pero rechaza cambios de contenido.

### 6 templates votan contra «todos se parecen»

Un solo bloque de template es fácil de mal-emparejar. Imagina una página de lista de productos de e-commerce — cada tarjeta de producto tiene un layout casi idéntico, un template puede emparejar con el producto anterior o siguiente.

El motor extrae **6 bloques de template** simultáneamente (cada uno de 100 px de alto, espaciados desde la parte superior del nuevo), busca independientemente la mejor posición en el antiguo, y obtiene 6 valores de offset. Luego **clusteriza** esos 6 offsets (tolerancia: 5 px) y toma la mediana del cluster más grande.

Si 5 de 6 templates apuntan a offset ≈ 320 y 1 a 800, ese 800 es casi seguro un falso match — descartar.

También hay una optimización de salida temprana: si los primeros 3 templates ya coinciden (tolerancia: 4 px) y el offset no es cercano a 0 (descartando «el usuario no scrolleó»), los 3 restantes no hacen falta.

Un detalle que me tuvo dando vueltas: ¿qué tolerancia usar? Inicialmente puse 2 px, pero por el error de cuantificación del NCC (ver más adelante), los offsets de diferentes templates en el mismo par solían diferir 2–3 px, y la salida temprana casi nunca se activaba. Al ampliar a 4 px, aproximadamente el 60 % de los pares la activaron en pruebas reales, sin pérdida de precisión observable.

### NCC piramidal: búsqueda de grueso a fino

Cada matching usa **NCC (Normalized Cross-Correlation)** para medir similitud. La fórmula NCC:

$$\text{NCC}(T, I) = \frac{\sum(T_i - \bar{T})(I_i - \bar{I})}{\sqrt{\sum(T_i - \bar{T})^2 \cdot \sum(I_i - \bar{I})^2}}$$

La ventaja de NCC es su insensibilidad a cambios de brillo (una grabación de día y la misma página en modo oscuro también emparejan). Rango [-1, 1], donde 1 = coincidencia perfecta. Intuitivamente: NCC no compara valores absolutos de píxeles sino si el «patrón de variación claro-oscuro» es el mismo.

Pero deslizar píxel a píxel por todo el fotograma antiguo es demasiado lento. El motor usa **búsqueda piramidal de tres niveles**:

| Nivel | Paso | Ventana | Candidatos | Propósito |
|-------|------|---------|-----------|-----------|
| Level 1 (Pre) | 12 px | Rango completo | ~125 | Posicionamiento grueso |
| Level 2 (Coarse) | 4 px | ±32 px | ~16 | Precisión a nivel de fila |
| Level 3 (Fine) | 1 px | ±4 px | 9 | Refinamiento píxel a píxel |

Un dato que vale la pena compartir: el paso de 12 del Level 1 busca solo 1/12 de las posiciones candidatas, logrando aproximadamente **12× de aceleración** por template. El cálculo total en tres niveles es ~1/8 de una búsqueda exhaustiva.

Cuando los candidatos superan 64 (típico en Level 1), se activa automáticamente el cálculo paralelo GCD (`DispatchQueue.concurrentPerform`), distribuyendo la búsqueda en múltiples núcleos CPU. Aquí tropecé: inicialmente usé `NSLock` para proteger una variable `bestScore` compartida, pero la contención en 6 núcleos ralentizaba todo. Cambiar a mejores locales por hilo con fusión final redujo la contención de O(n) a O(1).

### Ventana de búsqueda: deja que la historia te guíe

Buscar en toda el área utilizable del fotograma antiguo cada vez es lento y propenso a falsos emparejamientos (la parte superior e inferior de una página pueden tener layouts similares).

El motor usa dos tipos de «priors» para estrechar la ventana:

- **Prior temporal**: si el offset del par anterior fue 300 px, este par probablemente sea similar. Ventana reducida a 300 ± 120 px
- **Prior Vision**: para el primer par sin historial, la API de registro de Apple Vision da una estimación aproximada. Ventana a estimación ± 180 px

Si la ventana estrecha no encuentra al menos 3 coincidencias consistentes (el prior estaba equivocado), retroceso automático a búsqueda de rango completo.

La condición «al menos 3 consistentes» también costó aprender. Inicialmente usé «al menos 1», pero cuando el prior de Vision se desviaba mucho (a veces 500 px de error), un falso match en la ventana estrecha pasaba como válido por casualidad. Con 3, un falso match tendría que engañar a 3 templates independientes simultáneamente — estadísticamente casi imposible.

### Cuando el matching normal falla: fallback de tres niveles

Los escenarios reales son mucho más duros que el laboratorio. Botones flotantes, overlays semitransparentes, vídeos en reproducción, cursores parpadeantes — todo esto baja los puntajes NCC.

El motor implementa una estrategia de fallback de tres niveles. Con datos reales de frecuencia:

> **Nivel 1: Match fuerte (~80 % de pares).** La mayoría de templates tienen NCC ≥ 0,6 y apuntan al mismo offset. El caso más común.
>
> **Nivel 2: Match suave (~12 % de pares).** El mejor template tiene NCC de solo 0,45–0,6 — quizás un elemento UI flotante tapó parcialmente la zona. Se usa el SAD de toda la zona de solapamiento como verificación secundaria. SAD por píxel ≤ 26,0 → aceptado; si no, rechazado.
>
> **Nivel 3: NCC de perfil 1D (~5 % de pares).** «Aplanar» la imagen 2D en una curva de medias por fila — un array 1D. Intercorrelacionar las dos curvas 1D. ~100× más rápido, pero con mayor riesgo de falsos positivos.
>
> **Todo falló (~3 % de pares)?** Este fotograma probablemente es un cambio de escena o sin solapamiento. Añadir al final sin stitching.

La verificación SAD del nivel 2 es matizada. El umbral base es **25,0 por píxel**, pero cuando la proporción de solapamiento supera el 80 %, se ajusta adaptativamente:

```
if overlapRatio > 0,8:
    scale = max(minScale, 1,0 - (overlapRatio - 0,8) × 4,0)
    threshold = 25,0 × scale
```

¿Por qué ajustar? Cuanto mayor es la zona de solapamiento, más muestras estadísticas tiene el SAD, el ruido aleatorio se promedia — un falso match puede también tener SAD bajo. Sin ajuste, los falsos positivos aumentan en escenarios de alto solapamiento.

Sin importar el camino, siempre hay un **refinamiento de offset** final: calcular SAD píxel a píxel en ±6 px del offset candidato y tomar el mínimo.

¿Por qué el offset de NCC aún necesita refinamiento? Me costó tres días entenderlo. La NCC es muy «plana» cerca de su óptimo — 2 px de diferencia pueden cambiar NCC solo 0,003. Pero el SAD es extremadamente sensible a desplazamientos de ±1 px — 1 px de diferencia puede cambiar el SAD 3–5 unidades. Ambos se complementan: NCC para posicionamiento grueso, SAD para calibración a nivel de píxel. Cuando unes texto, 2 px de error es la diferencia entre «una línea de texto cortada por la mitad» y «perfectamente alineada».

### Línea de costura: no cortes el texto por la mitad

Encontraste el offset. Los dos fotogramas tienen una zona de solapamiento. ¿Dónde «cortar»?

Lo intuitivo es cortar por el medio. Pero si el medio contiene justo una línea de texto grande, la mitad superior y la inferior no se alinean — el ojo lo detecta al instante.

El enfoque del motor: calcular la diferencia de píxeles de **cada fila** en la zona de solapamiento, y usar una ventana deslizante para encontrar la posición con diferencia total mínima. La altura de ventana es adaptativa — `min(overlapH, max(100, adaptiveCutHeight))`. Esta posición es donde el contenido de ambos fotogramas es más similar — la costura aquí es visualmente más natural.

---

## Benchmarks de rendimiento

Probé con una grabación típica de 30 segundos de chat de WhatsApp (iPhone 15 Pro, 1080×2400, 60 fps). Métricas clave:

| Métrica | Valor |
|---------|-------|
| Total de fotogramas | 1.800 |
| Tiempo de análisis Pasada 1 | 3,2 s |
| Fotogramas clave extraídos | 26 |
| Refinamiento Pasada 1,5 | 0,8 s |
| Template matching total | 4,1 s (25 pares) |
| Matching medio por par | 164 ms |
| Tasa de salida temprana | 58 % (15/25) |
| Tasa de match fuerte | 84 % (21/25) |
| Match suave activado | 3 pares |
| Fallback perfil 1D | 1 par |
| Todo falló (añadido) | 0 pares |
| Tamaño final | 1.170 × 18.600 |
| Tiempo end-to-end | ~8,5 s |

La aceleración piramidal es notable: el paso de 12 del Level 1 salta el 92 % de candidatos, el Level 2 calcula solo ~16 puntos en una ventana de ±32 px, y el Level 3 refina solo ±4 px. El cálculo efectivo en tres niveles es aproximadamente **1/8** de una búsqueda exhaustiva.

---

## Detalles de ingeniería que no puedes ignorar

### No puedes cargar una imagen de 20.000 píxeles de una vez

Una imagen larga de 30 fotogramas puede medir 1.170 × 24.000 píxeles. RGBA a resolución completa en memoria ocupa **112 MB** (1.170 × 24.000 × 4 bytes) — demasiado para un iPhone.

`StreamingStitchingPlanner` está diseñado como pipeline en flujo: durante el matching, solo «fotograma actual + anterior» residen en memoria. Los resultados se registran como objetos `Piece` (índice de imagen fuente + región de recorte + posición destino). El renderizado final decodifica y dibuja por mosaicos.

### Algoritmo de eliminación de barra de desplazamiento

La imagen larga ensamblada casi siempre tiene una barra de desplazamiento residual a la derecha. El motor usa **proyección de gradiente** para eliminarla:

Extraer una franja del 3 % del ancho en el borde derecho → calcular gradiente horizontal acumulado → los bordes izquierdo y derecho de la barra forman dos **picos de gradiente** (separados 3–20 px) → confirmar posición real fila por fila → sobrescribir con los píxeles adyacentes de la izquierda. Mismo procedimiento para barras horizontales en la parte inferior.

### UI de respaldo cuando el algoritmo falla

Hasta el mejor algoritmo tropieza a veces. ScrollShot ofrece **ajuste interactivo fino** en cada línea de costura — el usuario puede arrastrar arriba o abajo para ajustar la posición de stitching con vista previa en tiempo real. El `FineTuneGeometryEngine` garantiza que las restricciones geométricas siempre sean válidas. La vista previa renderiza en baja resolución para velocidad; la exportación vuelve automáticamente a resolución completa. Esta controlabilidad es también una de las interacciones clave del <a href="/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/">modo Manual Stitch</a>.

---

## Una última reflexión

La mayor lección de este motor: **el algoritmo de stitching en sí no es difícil. Lo difícil es hacer que funcione en todas las páginas «sin sentido» del mundo real.**

Los fondos de chat de WhatsApp se parecen todos, las listas de productos de Amazon se repiten infinitamente, la app de Ajustes de iOS tiene vastas zonas blancas, las miniaturas de YouTube se mueven… cada uno es un caso límite que ningún libro enseña ni ningún paper describe.

Un bug que recuerdo vividamente: al grabar los Ajustes de iOS, el offset NCC se desviaba consistentemente unos 40 px. Tras largo debugging, descubrí que la parte superior tenía una gran zona blanca. Cuando el template caía en blanco puro, NCC daba cerca de 1,0 en cualquier posición blanca — imposible distinguirlas. Solución: detectar cuando la varianza del template es demasiado baja y saltarlo automáticamente — un template blanco puro no tiene información, mejor no usarlo.

Otra vez, aún más absurdo: grabando la página principal de YouTube, una miniatura de vídeo mostraba un gato que se movía. La zona de la miniatura era completamente diferente entre dos fotogramas, hundiendo el NCC a 0,3. Ningún algoritmo por sí solo podía salvar esto. Fue el mecanismo de votación de 6 templates el que lo rescató — los otros 5 templates muestrearon zonas estáticas, y la votación siguió siendo correcta.

Resolver estos problemas no viene de matemáticas más elegantes. Viene de un truco de ingeniería de «lo parcheamos así por ahora» tras otro. Si estás trabajando en algo similar, espero que este artículo te ayude a evitar algunos de estos baches.

---

## Lecturas recomendadas

- <a href="/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/">¿Por qué elegir ScrollShot? La solución definitiva para capturas largas en iOS</a> — Una mirada a nivel de producto sobre cómo ScrollShot resuelve los dolores de las capturas largas en iOS: stitching automático, manual, privacidad y exportación en alta calidad.
