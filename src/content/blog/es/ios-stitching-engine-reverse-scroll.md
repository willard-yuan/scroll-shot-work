---
title: "Los usuarios insistieron en desplazar hacia arriba para capturar — y esquivé reescribir todo el motor con una sola línea"
description: "Cuando los usuarios quieren capturar un long screenshot iPhone desplazando hacia arriba, mi primer instinto fue construir un « motor ascendente » separado. Al final, bastó una sola línea de código. Este artículo desglosa el diseño de stitching con desplazamiento inverso de ScrollShot, la técnica tras una captura de pantalla que se desplaza sin costuras en apps como Messages y WhatsApp, y muestra cómo detectamos la dirección del desplazamiento, invertimos el orden de los frames y reutilizamos la tubería descendente existente. Verás por qué la detección de dirección es casi gratuita, por qué invertimos el orden de los frames en lugar de añadir una bandera isReversed, y cómo devolvemos la decisión al usuario cuando la confianza es baja, para capturar sin que el motor se equivoque."
date: "2026-07-12"
category: "Técnica"
author: "Equipo de ScrollShot"
tags: ["Captura larga iPhone", "Captura de desplazamiento iPhone", "Captura larga iOS", "Algoritmo de unión de capturas", "Desplazamiento inverso", "Detección de dirección de desplazamiento", "Motor ScrollShot", "Ensamblaje de grabación de pantalla"]
readingTime: "6 min de lectura"
cover: "/ios_stitching_engine_reverse_scroll_framework_es.webp"
coverAlt: "Diagrama de matching de plantilla inverso de ScrollShot para una captura de pantalla que se desplaza iPhone: toma la plantilla de la parte superior del nuevo frame, busca el desplazamiento en la parte inferior del frame anterior"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Los usuarios insistieron en desplazar hacia arriba para capturar — y esquivé reescribir todo el motor con una sola línea

La mayoría de los que quieren un long screenshot iPhone — o cualquier captura de desplazamiento iPhone dentro de una app — asumen que el usuario desplaza de arriba abajo. El motor de stitching de ScrollShot también se diseñó así al principio — escribí la historia completa en <a href="/es/blog/ios-stitching-engine-v2/">« ¿Qué tan difícil es unir dos capturas de pantalla? Un motor de stitching para iOS que me hizo empezar de cero — una y otra vez »</a>: grabar → muestrear frames a intervalos iguales → matching de plantilla por frame para calcular el desplazamiento → encontrar la mejor costura → recortar y unir. Esa tubería ya es sólida para el caso de arriba abajo.

Pero el mundo real ama contradecir. Los usuarios quieren capturar una captura de desplazamiento iPhone de un chat — Messages, WhatsApp o WeChat — o guardar la parte de una página web que desplazaron hacia arriba para ver, exactamente el caso de « captura de página completa en app iPhone » que todos preguntan — y al grabar, su dedo se desliza hacia arriba. El contenido fluye hacia atrás en la grabación: empieza en la parte inferior de la página y el « final » es en realidad el contenido anterior. Pásalo directo al motor de arriba abajo y obtienes una imagen invertida: la parte superior visual es el contenido antiguo del final de la grabación, y la inferior es el principio.

Este artículo trata sobre cómo ScrollShot admite el ensamblado de abajo arriba. El punto no es un algoritmo profundo, sino un compromiso de diseño extremo en la poca cantidad de código que se necesita.

Primero, una demo estándar de stitching de arriba abajo — el stitching inverso que discutiremos se construye directamente sobre ella:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Demo de stitching de desplazamiento de arriba abajo: graba una vez, desplaza una vez, y ScrollShot muestrea frames automáticamente, coincide el solapamiento y une un long screenshot iPhone completo.</p>
</div>

---

## Primer instinto: ¿construir un « motor ascendente » separado?

La primera vez que me enfrenté a este requisito, mi instinto fue: ya tenemos un motor de stitching descendente, ¿por qué no escribir uno ascendente también?

Me disuadí rápidamente. El núcleo del motor descendente es el matching de plantilla inverso: toma la plantilla de la parte superior del nuevo frame (img2) y busca en la parte inferior del frame anterior (img1) para calcular el desplazamiento. Pasarlo a ascendente implica invertir casi cada coordenada — de dónde viene la plantilla, hacia dónde barre la búsqueda, cómo se definen los desplazamientos positivo/negativo, cómo se calcula la región de costura solapada… Un motor de 3.000 líneas significaría criar un hermano paralelo, cada uno con sus propios bugs y su propio mantenimiento. Peor aún, cualquier corrección del motor descendente tendría que reflejarse en el ascendente, o los dos divergirían en silencio.

## El avance: invertir, luego reutilizar

Lo que realmente me detuvo fue una observación simple: el motor de stitching no le importa cómo « fluye » el contenido — solo le importa cuál de dos frames adyacentes está arriba y cuál abajo. Mientras la secuencia de frames se ordene por la línea de tiempo real del contenido, el mismo algoritmo funciona a la perfección. Las imágenes de abajo arriba simplemente están « fuera de orden ».

Así que el enfoque de ScrollShot es: detectar primero la dirección del desplazamiento; si es ascendente, invertir toda la secuencia de frames y luego pasarla a la tubería descendente existente.

```
Muestreo de frames (desplazamiento ascendente, contenido fluye hacia atrás):
  [F1 fondo de página] → [F2] → [F3] → … → [Fn tope de página]
                                 │
             ScrollDirectionDetector decide: ascendente
                                 │
              reversedForStitching() invierte el orden de frames
                                 ▼
  [Fn tope de página] → … → [F3] → [F2] → [F1 fondo de página]
                                 │
              en el mismo motor de stitching descendente (cero cambios)
                                 ▼
                   imagen larga correcta (arriba → abajo)
```

El diagrama de abajo dibuja toda la cadena « invertir + reutilizar » — muestreo de frames, detección de dirección, inversión del orden de frames, reutilización del motor descendente, hasta la imagen larga correcta:

![Diagrama del algoritmo de stitching de desplazamiento de abajo arriba](/ios_stitching_engine_reverse_scroll_framework_es.webp)

El código central es solo una línea:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` invierte las referencias de frames extraídas y las renumerota; todo lo demás queda intacto. Tras la inversión, el contenido « que fluye hacia atrás » vuelve a « fluir hacia adelante », y el matching de plantilla, el NCC y la lógica de costura aguas abajo no necesitan ni una línea cambiada. Cero código nuevo de stitching.

> ⚠️ Trampa: ¿por qué « invertir el orden de frames » y no « añadir una bandera `isReversed` dentro del motor »? Porque lo segundo convierte cada sistema de coordenadas en dos copias de lógica — « adelante / atrás » — duplicando la superficie de bugs. Al mover la transformación antes de alimentar los datos, el motor siempre enfrenta un solo mundo.

## Detección de dirección: el único código nuevo — y es casi gratis

Como invertimos, la condición previa es reconocer que el usuario desplazó hacia arriba. Si este paso es pesado, todos los ahorros anteriores se desperdician. El enfoque de ScrollShot es ligero, e ingenioso hasta resultar casi « gratis » — reutilizar el motor de matching de plantilla existente, solo intercambiando los parámetros y ejecutándolo dos veces.

`ScrollDirectionDetector` muestrea uniformemente unas 7 parejas de frames adyacentes desde el medio de la grabación (evitando la cuenta regresiva inicial y el botón de detener al final), y para cada pareja ejecuta el mismo matcher dos veces:

```swift
let down = directionalScore(previous: prev, current: cur)  // ¿prev→cur significa «desplazamiento hacia abajo»?
let up   = directionalScore(previous: cur, current: prev)  // ¿cur→prev significa «desplazamiento hacia abajo»?
```

La clave está en la línea `guard outcome.offset > 0` dentro de `directionalScore`. El matching inverso de este motor solo devuelve un desplazamiento positivo cuando « la plantilla de la parte superior del nuevo frame cae más abajo en el frame anterior ». Entonces:

- Si el desplazamiento real es descendente, la llamada directa `down` acierta (offset > 0, válido), mientras que la llamada inversa `up` no encuentra contenido anterior más abajo en la parte superior del nuevo frame, así que offset ≤ 0, se marca inválido, puntuación 0;
- Si el desplazamiento real es ascendente, es al revés: `down` es inválido, `up` es válido.

El criterio de dirección es en realidad « **qué llamada es válida** », no que las dos puntuaciones sean simétricas. En mi primer borrador escribí distraídamente « perfectamente simétrico », hasta que un colega señaló y preguntó « ¿cómo pueden ser simétricos válido e inválido? » — ese es el malentendido que más quiero corregir en este artículo.

Tras obtener la puntuación `down` / `up` de cada pareja, la puntuación por pareja funciona así:

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // cuanto más borroso el solapamiento, más se descuenta la puntuación
puntuación válida debe ser ≥ 0.26
```

Luego la votación: dentro de una pareja, si `up ≥ down × 1.25` (o lo supera en 0,08 en valor absoluto), emite un voto ascendente; si no, emite un voto descendente. Decisión final:

- `upwardVotes ≥ downwardVotes + 2`, y
- `upwardScore ≥ downwardScore × 1.25`

solo entonces se trata como desplazamiento ascendente. Todo se ejecuta sobre miniaturas de baja resolución limitadas a 320 px en un hilo en segundo plano, con un impacto casi imperceptible en el tiempo total.

## Ante la duda, entrégaselo al usuario

La detección no es 100 % fiable. Una grabación casi estática que solo se movió dos o tres píxeles tiene una señal de dirección muy débil; invertir a la ligera es peor que no invertir. Por eso hay una barrera: `shouldAskForReverseConfirmation` solo se dispara cuando la confianza ≥ 0,72 y las muestras válidas ≥ 3 parejas, mostrando una confirmación ligera: « Detectamos que grabaste desplazando hacia arriba — ¿invertir el stitching? » Si el usuario toca invertir, `reverseFrames: true`; si no está seguro, une en el orden original. El motor nunca produce en silencio una imagen errónea por haber adivinado mal la dirección.

## Los dos modos uno al lado del otro

| | Arriba abajo | Abajo arriba |
|---|---|---|
| Gesto de grabación | dedo se desliza hacia abajo | dedo se desliza hacia arriba |
| Orden de muestreo de frames | línea de tiempo natural | línea de tiempo natural (el contenido fluye hacia atrás) |
| Detección de dirección | no necesaria | muestrea 7 parejas a la mitad, matcher ejecuta dos veces |
| Motor de stitching | original | original (reutilizado tras inversión del orden de frames) |
| Código nuevo | — | solo detección de dirección + inversión en una línea |
| Respaldo | — | pide confirmación cuando la confianza es baja |

## Para cerrar

Mirando atrás, el stitching de abajo arriba casi no tiene « código propio » en ScrollShot — es totalmente parásito del motor descendente. La idea de « normalizar el orden primero, luego reutilizar el mismo motor » se convirtió luego en nuestro patrón de inicio por defecto al añadir nuevos modos de stitching: la próxima vez que hagamos stitching horizontal o en zigzag, lo más probable es que primero busquemos cómo retorcer el problema de vuelta a « descendente unidimensional » en lugar de empezar desde cero.

---

## Preguntas frecuentes: capturar una captura de desplazamiento en apps iPhone

**¿Puede ScrollShot hacer una captura de desplazamiento en apps iPhone como Messages y WhatsApp?**
Sí. Ya sea que quieras un long screenshot iPhone de una página web o una captura de desplazamiento iPhone de los hilos de Messages y WhatsApp, ScrollShot graba tu pantalla y une los frames automáticamente. Como captura mediante grabación de pantalla en lugar de depender de un botón de « página completa » del sistema, funciona dentro de cualquier app — el caso de captura de página completa en app iPhone que todos preguntan.

**¿Qué pasa si desplazo hacia arriba mientras grabo un chat?**
Ese es todo el punto de este artículo. Una captura de desplazamiento iPhone Messages que los usuarios aman, o una captura iPhone WhatsApp que los fans capturan desplazando hacia atrás, ambas significan que el contenido fluye hacia atrás. ScrollShot detecta la dirección de desplazamiento ascendente, invierte el orden de frames y reutiliza el mismo motor de stitching descendente — así sigues obteniendo una captura de desplazamiento iPhone correcta sin que tengamos que reescribir nada.

**¿En qué es diferente de la captura integrada de iOS?**
La captura integrada no siempre puede capturar una página completa dentro de las apps. ScrollShot está hecho para el caso del long screenshot y la captura de desplazamiento iPhone: graba una vez, desplaza como quieras (arriba o abajo), y obtén una sola imagen larga sin costuras.

---

## Lecturas adicionales

- <a href="/es/blog/ios-stitching-engine-v2/">¿Qué tan difícil es unir dos capturas de pantalla? Un motor de stitching para iOS que me hizo empezar de cero — una y otra vez</a> — elegir 30 keyframes de 1.800 frames, matching de plantilla inverso, búsqueda NCC piramidal hasta una estrategia de respaldo de tres niveles — un despiece completo del motor de stitching de ScrollShot.
- <a href="/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/">¿Por qué elegir ScrollShot? La solución definitiva para capturas largas en iOS</a> — una perspectiva de producto sobre cómo ScrollShot resuelve los puntos dolorosos de los long screenshots iOS, incluyendo el ensamblaje automático por grabación de pantalla, el stitching manual, la protección de privacidad y la exportación HD.
