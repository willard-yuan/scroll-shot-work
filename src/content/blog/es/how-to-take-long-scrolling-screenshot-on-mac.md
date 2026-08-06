---
title: "Cómo hacer una captura de pantalla larga y de desplazamiento en Mac en 2026 (Guía completa)"
description: "macOS no tiene captura de pantalla de desplazamiento nativa. Esta guía 2026 explica por qué, compara GoFullPage, Shottr, CleanShot X, Xnapper, screensnap y ScrollShot, y muestra cómo capturar cualquier ventana gratis con ScrollShot para Mac."
date: "2026-08-05"
category: "Guía"
author: "Equipo de ScrollShot"
tags: ["Captura de pantalla larga Mac", "Captura de desplazamiento Mac", "Captura de scroll Mac", "ScrollShot para Mac", "Herramienta de captura macOS", "Desplazar y unir"]
readingTime: "10 min de lectura"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Una captura Mac normal (una pantalla) junto a una captura ScrollShot de 765 × 4091 px del mismo contenido"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "¿Puedo hacer una captura de pantalla de desplazamiento con la app de Captura integrada de Mac?"
    answer: "No. Cmd + Shift + 4 y la app de Captura solo capturan la pantalla visible. Necesitas una función de navegador, un export PDF, o una app de terceros como ScrollShot, Shottr o CleanShot X."
  - question: "¿Cuál es la forma gratuita más rápida de hacer una captura de desplazamiento en Mac?"
    answer: "Solo para páginas web: GoFullPage (menos de 30 segundos). Para todo lo que esté fuera del navegador (Slack, PDF, apps): ScrollShot para Mac o Shottr — ambos gratis, ambos funcionan en cualquier zona desplazable."
  - question: "¿Existe una herramienta de captura de desplazamiento gratuita que también traduzca y oculte?"
    answer: "Sí — ScrollShot para Mac. Es gratis y combina de forma única la captura de desplazamiento con OCR, traducción a 30+ idiomas, más de 19 herramientas de anotación y el ocultado automático de datos personales/rostros en una sola app."
  - question: "¿Funcionan las capturas de desplazamiento para PDF y documentos?"
    answer: "Sí, si usas una app de captura nativa (ScrollShot, Shottr, CleanShot X) sobre el PDF abierto en Vista previa o un lector. El « Guardar como PDF » integrado da un documento, no una imagen."
  - question: "¿Por qué mi captura de desplazamiento tiene cabeceras duplicadas?"
    answer: "La página tiene un elemento fijo (burbuja de chat, barra de navegación, banner de cookies) que permanece fijo mientras el contenido se desplaza. Ciérralo o ocúltalo antes de capturar."
  - question: "¿En qué formato guardar las capturas de desplazamiento?"
    answer: "PNG para calidad y transparencia; JPG si el tamaño importa y no necesitas transparencia; PDF solo si necesitas texto consultable."
---

# Cómo hacer una captura de pantalla larga y de desplazamiento en Mac en 2026 (Guía completa)

Déjame ahorrarte los 20 minutos que yo perdí la primera vez.

Tenía un hilo de Slack de 4.000 píxeles que enviar a un desarrollador. Pulsé `Cmd + Shift + 4`, arrastré un cuadro y obtuve… una pantalla. El resto de la conversación quedaba debajo, y macOS lo ignoró alegremente. **No existe forma nativa de hacer una captura de pantalla de desplazamiento en Mac** — ni en `Cmd + Shift + 4`, ni en la app de Captura, ni en Vista previa. Si viniste buscando un atajo oculto de Apple, te lo digo claro: no existe. Windows lo tiene en la Herramienta de recorte. iPhone lo tiene. Android lo tiene. macOS, en 2026, todavía no lo trae.

La buena noticia: se resuelve por completo, y tienes más opciones de las que admiten la mayoría de blogs de « Top 8 ». Esta guía va más allá de la superficie. Te explico *por qué* el Mac no puede hacerlo de forma nativa, qué ocurre realmente cuando una app « desplaza y une », y qué herramienta encaja en qué tarea — incluida la que uso a diario, **[ScrollShot para Mac](/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/)** (gratis y la única opción que hace todo el trabajo en una sola app).

![Antes/Después: una captura Mac normal (una pantalla) junto a una captura ScrollShot de 765 × 4091 px del mismo contenido](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Una captura normal solo captura el viewport visible. ScrollShot captura la zona desplazable completa de 765 × 4091 px en una imagen — y luego te deja anotar, hacer OCR, traducir y ocultar sin salir de la app.*

---

## Por qué macOS no puede hacer una captura de desplazamiento de forma nativa

No es pereza de Apple — así funciona la pantalla.

Cuando pulsas `Cmd + Shift + 4`, macOS captura el *framebuffer* actual: una instantánea píxel a píxel de lo que hay físicamente en pantalla ahora. Una ventana desplazable (Slack, una página web, un PDF) solo renderiza la parte visible. El contenido fuera de pantalla no está « ahí » para capturarlo — se dibuja bajo demanda al desplazar. No hay un « búfer de desplazamiento » como en una terminal. Así que una app de captura tiene dos opciones:

1. **Pedir a la app su contenido completo** (solo funciona si la app lo expone — los navegadores sí, la mayoría de las apps no).
2. **Desplazar un poco, capturar un poco, repetir y luego unir las piezas en una imagen alta.**

Cada herramienta de « captura de pantalla de desplazamiento » en Mac hace en realidad la #2 por debajo (o la #1, pero solo para páginas web). Esta distinción importa, porque explica por qué algunas herramientas solo funcionan en Chrome y otras funcionan *en cualquier sitio*.

![Viewport visible vs contenido desplazable completo — macOS solo captura lo que está en pantalla, no lo que queda debajo](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## Las tres familias de soluciones

Antes de las recomendaciones, conoce las categorías. No son intercambiables.

| Familia | Funcionamiento | Ideal para | No puede |
| --- | --- | --- | --- |
| **Solo navegador** (GoFullPage, función integrada de Firefox, DevTools, Inspector Web Safari) | Pide a la página su DOM/contenido completo | Páginas web *abiertas en ese navegador* | Slack, PDF en Vista previa, ventanas de app, tableros Figma |
| **Apps de captura nativa** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Desplaza + une la pantalla real | *Cualquier* zona desplazable, incl. apps fuera del navegador | — (limitado solo por la calidad de la app) |
| **Exportar PDF** (`Cmd + P` → Guardar como PDF) | Renderiza el diseño en un documento | Archivos consultables, impresión | No es imagen; no se pega en línea |

\* *screensnap (ScreenSnap Pro) es una excepción notable — ver la nota abajo. Es una herramienta de anotación, no de captura de desplazamiento.*

---

## Recomendación rápida (léelo si tienes prisa)

- **Solo capturas páginas web** → una extensión de navegador como GoFullPage está bien y es gratis.
- **Necesitas capturar Slack, PDF, ventanas de app o documentos** → necesitas una app nativa.
- **Quieres una herramienta gratuita que capture *y* permita OCR, traducción, anotación, difuminado de información sensible e incluso grabación de vídeo — sin pagar ni suscribirte** → **ScrollShot para Mac**. Es la única opción de esta guía que hace toda la cadena de forma nativa y gratuita.

![Tres herramientas comparadas: GoFullPage (solo web), CleanShot X (29 $/año) y ScrollShot (gratis, todo en uno)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## La comparativa completa (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

Probé los candidatos habituales en macOS 15/26. Así se comportan de verdad, no como su marketing. Para que sea legible, lo dividí en dos tablas centradas — lo que cada herramienta puede **capturar** y lo que puede hacer con el **resultado**.

### Captura y alcance

| Herramienta | Precio | Captura de desplazamiento | ¿Más allá del navegador? |
| --- | --- | --- | --- |
| **ScrollShot para Mac** | **Gratis** | ✅ Unión automática con Apple Vision | ✅ Cualquier zona desplazable |
| **Shottr** | Gratis (12 $ pago único para quitar avisos) | ✅ Desplazamiento + unión manual | ✅ |
| **CleanShot X** | 29 $/año (o 59 $ pago único) | ✅ Auto o manual | ✅ |
| **Xnapper** | 24 $ pago único | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | 39 $ pago único | ❌ **Sin captura de desplazamiento** | ❌ |
| **GoFullPage** | Gratis (nivel de pago) | ✅ (solo navegador) | ❌ Solo web |

### Tras la captura: edición

| Herramienta | Anotación | OCR + Traducción | Grabar/editar vídeo | Ocultado auto (PII) |
| --- | --- | --- | --- | --- |
| **ScrollShot para Mac** | ✅ 19+ herramientas | ✅ 30+ idiomas | ✅ MP4/GIF + recortar | ✅ Correos, teléfonos, claves API, rostros |
| **Shottr** | ✅ Básica | ⚠️ Solo OCR, sin traducción | ❌ | ❌ |
| **CleanShot X** | ✅ Potente | ❌ | ✅ (separado) | ⚠️ Solo difuminado manual |
| **Xnapper** | ✅ + embellecer | ❌ | ❌ | ⚠️ Ocultado automático privacidad |
| **screensnap (ScreenSnap Pro)** | ✅ 15 herramientas + fondos | ❌ | ✅ GIF | ⚠️ Solo difuminado manual |
| **GoFullPage** | ⚠️ Recorte básico | ❌ | ❌ | ❌ |

**La realidad de screensnap.** El blog de screensnap (« 8 métodos ordenados por velocidad ») es una lista ordenada genuinamente útil — pero fíjate en lo que recomienda para la captura en sí: GoFullPage y Shottr. ScreenSnap Pro *no puede* hacer una captura de pantalla de desplazamiento. Está hecho para el *siguiente* paso (embellecer + anotar + compartir una captura que hiciste en otro sitio). Así que si tu problema es « necesito la captura larga en primer lugar », screensnap no es una solución de captura; es una solución post-captura. ScrollShot, en cambio, hace tanto la captura *como* el paso anotar/difuminar/compartir en la misma app gratuita.

---

## Cómo funciona realmente « desplazar y unir » (y por qué falla)

Cuando ScrollShot (o Shottr, o CleanShot) hace una captura larga, el proceso de desplazar y unir es:

1. Captura la zona visible.
2. Simula un desplazamiento (o espera a que desplaces).
3. Captura la siguiente zona.
4. **Empareja los píxeles que se solapan** entre los dos fotogramas para encontrar la costura.
5. Los une y repite hasta que paras.

El paso de emparejamiento es donde las herramientas viven o mueren en cualquier flujo de desplazar y unir. El [motor de unión](/es/blog/ios-stitching-engine-v2/) de ScrollShot usa el framework Vision de Apple para emparejar fotogramas, por eso maneja mejor velocidades de desplazamiento variables y pequeños cambios de diseño que los enfoques ingenuos de diferencia de píxeles. Tres cosas siguen rompiendo cualquier unidor:

- **Cabeceras/pies fijos** que no se mueven mientras el contenido sí → barras duplicadas. (Cierra primero los widgets de chat y los banners de cookies.)
- **Contenido cargado perezosamente** que solo aparece tras desplazar → huecos en blanco. (Desplázate una vez, luego captura.)
- **Supuesto de ancho fijo** → si redimensionas la ventana, cambia el ancho de salida. Decide el ancho antes de capturar.

![Cómo funciona Scroll & Stitch: la herramienta empareja la franja solapada para encontrar dónde encaja el fotograma 2 en el 1](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Paso a paso: hacer una captura larga con ScrollShot para Mac

Este es el flujo que uso ahora para todo.

**1. Instalar (30 segundos).**  
Descarga desde [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg), abre el DMG y arrastra la app a Aplicaciones. Sin cuenta, sin clave de licencia.

![Instalar ScrollShot: abre el DMG y arrastra la app a Aplicaciones](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Disparar la captura de desplazamiento.**  
Pulsa el atajo de captura de desplazamiento (o selecciónalo en la barra de menú). Arrastra un cuadro alrededor de la zona desplazable — una página web, un panel de Slack, una columna PDF, lo que sea.

**3. Desplazar.**  
Desplázate con el trackpad o la rueda del ratón. ScrollShot une en vivo automáticamente; ves crecer la imagen alta en la vista previa. Para cuando hayas capturado todo.

![Vista previa en vivo: ScrollShot une automáticamente mientras desplazas, y ves crecer la imagen alta](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Una imagen, ya editable.**  
Cuando terminas, no acabas en un editor separado. La misma ventana te permite: añadir flechas/números, **hacer OCR del texto y traducirlo en línea a 30+ idiomas**, difuminar u ocultar automáticamente correos/teléfonos/claves API/rostros, luego exportar como PNG o guardar en un fondo de degradado embellecido.

![Anotar la captura larga terminada: flecha, número, difuminado y traducción — sin salir de la app](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Compartir.**  
Copia al portapapeles, sube a tu S3/Cloud o exporta. Listo — sin salir de la app.

Ese último punto es la verdadera razón por la que cambié. Con Shottr capturaba y luego abría otra app para anotar. Con CleanShot X habría pagado 29 $/año por el privilegio. Tras la captura por desplazar y unir, ScrollShot hace captura → edición → traducción → ocultado → export en una sola pasada, gratis.

---

## Cuándo *no* deberías usar una app de captura de desplazamiento

Sé honesto sobre la tarea:

- **Necesitas texto consultable y copiable** (archivo legal, PDF de investigación) → `Cmd + P` → Guardar como PDF. Un PNG de 12.000 píxeles de alto no es consultable.
- **Solo capturas en un navegador** y nunca sales de él → GoFullPage o « Hacer una captura → Guardar página completa » integrado en Firefox es más ligero.
- **Necesitas diseño de impresión con precisión de píxel** → PDF otra vez.

Para todo lo demás — hilos de chat, documentos, paneles de ajustes, páginas web largas que anotarás — gana una app de captura nativa.

---

## Errores frecuentes (y la solución)

- **Cabecera duplicada en el resultado** → elemento fijo. Ciérralo o usa una herramienta con buen manejo de fijos antes de capturar.
- **Falta la sección del medio** → desplazamiento infinito / carga perezosa. Desplázate hasta abajo una vez, luego captura desde arriba.
- **Texto borroso** → capturado a baja DPI. Agranda la ventana (o haz zoom) antes de capturar.
- **Tamaño de archivo enorme** → un PNG de 10.000 px de alto puede ser varios MB. Comprime antes de compartir, o divide en secciones para legibilidad.

---

## FAQ

**¿Puedo hacer una captura de pantalla de desplazamiento con la app de Captura integrada de Mac?**  
No. `Cmd + Shift + 4` y la app de Captura solo capturan la pantalla visible. Necesitas una función de navegador, un export PDF, o una app de terceros como ScrollShot, Shottr o CleanShot X.

**¿Cuál es la forma gratuita más rápida de hacer una captura de desplazamiento en Mac?**  
Solo para páginas web: GoFullPage (menos de 30 segundos). Para todo lo que esté fuera del navegador (Slack, PDF, apps): ScrollShot para Mac o Shottr — ambos gratis, ambos funcionan en cualquier zona desplazable.

**¿Existe una herramienta de captura de desplazamiento gratuita que también traduzca y oculte?**  
Sí — [ScrollShot para Mac](/es/blog/por-que-elegir-scrollshot-capturas-largas-ios/). Es gratis y combina de forma única la captura de desplazamiento con OCR, traducción a 30+ idiomas, más de 19 herramientas de anotación y el ocultado automático de datos personales/rostros en una sola app.

**¿Funcionan las capturas de desplazamiento para PDF y documentos?**  
Sí, si usas una app de captura nativa (ScrollShot, Shottr, CleanShot X) sobre el PDF abierto en Vista previa o un lector. El « Guardar como PDF » integrado da un documento, no una imagen.

**¿Por qué mi captura de desplazamiento tiene cabeceras duplicadas?**  
La página tiene un elemento fijo (burbuja de chat, barra de navegación, banner de cookies) que permanece fijo mientras el contenido se desplaza. Ciérralo o ocúltalo antes de capturar.

**¿En qué formato guardar las capturas de desplazamiento?**  
PNG para calidad y transparencia; JPG si el tamaño importa y no necesitas transparencia; PDF solo si necesitas texto consultable.
