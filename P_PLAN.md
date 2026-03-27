# 📝 CONTEXTO PARA EL AGENTE DE CÓDIGO: Pantalla "Playground" (SkillsCheck)

## 1. Visión General del Producto
Estamos construyendo la pantalla principal de práctica (Playground) para una plataforma orientada a programadores Junior. El enfoque no es un "Juez Automático" estricto con casos ocultos, sino un **"Interactive Sandbox"**: el usuario lee el problema, escribe el código, lo ejecuta y comprueba visualmente en la consola si su output coincide con el ejemplo del enunciado.

## 2. Arquitectura de Rutas y Layouts (Route Groups de Next.js)
Para evitar que el Footer y la Navbar pública de la web molesten en el entorno de programación (que debe ser a pantalla completa `100vh`), usaremos **Route Groups**:

* `app/layout.tsx` -> **Root Layout**: Lienzo en blanco (solo `<html>` y `<body>`). No lleva Navbar ni Footer.
* `app/(marketing)/layout.tsx` -> **Marketing Layout**: Aquí inyectamos la Navbar pública y el Footer. Afecta a la Home (`/`) y páginas informativas.
* `app/(workspace)/playground/page.tsx` -> **Playground Page**: Se renderiza directamente sobre el Root Layout. Así conseguimos una vista inmersiva 100% libre de distracciones. Este archivo actuará como el componente Padre de toda la vista del editor.

## 3. Arquitectura de React (State Management)
Aplicaremos el patrón **"Lifting State Up"**. El componente Padre (`app/(workspace)/playground/page.tsx`) manejará todo el estado global y pasará datos/funciones como props a los componentes hijos.

**Estado Central (en el Padre):**
- `problema`: Objeto con los datos del problema actual (enunciado HTML, tags, rating).
- `dificultad`: String numérico (ej: "800-1000") para filtrar la API.
- `lenguaje`: String (ej: "javascript", "python") para el editor y la ejecución.
- `codigo`: String con el contenido actual del editor.
- `consolaOutput`: String con la respuesta del motor de ejecución.

## 4. Layout y UI (Distribución de la Pantalla Playground)
El diseño usa CSS Grid/Flexbox ocupando el 100% de la pantalla (`h-screen`). Se divide en:

* **Navbar (Top - Ocupa todo el ancho):**
    * *Izquierda:* Brand Logo (Funciona como enlace para volver a la Home `/`).
    * *Centro:* Selector de `dificultad` y botón "New Problem" (llama a la API).
    * *Derecha:* Selector de `lenguaje` (Dropdown) y botón "Run Code".
* **Columna Izquierda (Lectura):**
    * `ProblemInformation`: Muestra los `tags`, el `rating` (dificultad) y los `points`.
    * `ProblemStatement`: Renderiza el HTML del enunciado usando `dangerouslySetInnerHTML`.
* **Columna Derecha (Acción - Dividida verticalmente):**
    * `CodeEditor` (Top 70%): Integra **Monaco Editor**. Controlado por el estado `codigo` y adaptado al `lenguaje` seleccionado.
    * `Console` (Bottom 30%): Un div oscuro simulando una terminal. Muestra el estado `consolaOutput`. Idealmente, incluye un botón para limpiar la consola.

## 5. Backend y Obtención de Datos (Next.js App Router 2026)
El endpoint interno `/api/get-problem` obtiene problemas de **Codeforces**.
* **Caché Avanzada:** Se utiliza la directiva `'use cache'` y `cacheLife('hours')` **SOLO** en una función auxiliar que obtiene la lista gigante de problemas (`/api/problemset.problems`).
* **Tiempo Real:** La selección aleatoria del problema (filtrado por la dificultad elegida y asegurando que `rating !== undefined`) y el scraping del HTML usando `cheerio` (`.problem-statement`) se hacen en *Request Time* (fuera de la caché) para garantizar aleatoriedad en cada petición.

## 6. Ejecución de Código
Al pulsar "Run Code", se enviará el estado `codigo` y `lenguaje` a un endpoint interno (ej. `/api/execute`) que conectará con **Judge0** (o Piston). Solo necesitamos recuperar el `stdout` o `stderr` de la ejecución e imprimirlo en el componente `Console`. No hay validación de *test cases* ocultos.

---

### 🚀 Instrucciones para el Agente:
1. Reestructura las carpetas usando Route Groups (`(marketing)` y `(workspace)`) y ajusta los layouts según el punto 2.
2. Genera el esqueleto visual (Layout de la pantalla Playground) usando **Tailwind CSS** para que ocupe `100vh`.
3. Crea el componente Padre en `playground/page.tsx` y define los estados y las funciones mockeadas.
4. Divide el código en los subcomponentes mencionados (`Navbar`, `ProblemInformation`, `ProblemStatement`, `CodeEditor`, `Console`).