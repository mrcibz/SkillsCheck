# Plan de Implementación — Playground (Fase 3: CodeEditor)

> **Fases anteriores completadas:** estructura de rutas, layouts, grid, API de LeetCode, ProblemStatement, ProblemInformation.
> **Alcance de esta fase:** implementar el componente `CodeEditor` con Monaco Editor, conectar el selector de lenguaje al estado global y añadir templates de inicio por lenguaje.

---

## Estado actual

- `CodeEditor.tsx` es un placeholder de color violeta.
- `PlaygroundNavbar` tiene un `<select>` de lenguaje con `defaultValue="javascript"` pero **sin `onChange`** — no está conectado al padre.
- `Playground` (padre) tiene los estados `lenguaje`, `setLenguaje`, `codigo`, `setCodigo` declarados pero marcados como `void` (sin usar).

---

## Paso 1 — Instalar `@monaco-editor/react`

```bash
pnpm add @monaco-editor/react
```

Librería oficial que envuelve Monaco Editor (el motor de VS Code) en un componente React. Gestiona el lazy-loading del editor internamente, sin necesidad de configurar webpack ni nada adicional.

---

## Paso 2 — Definir los lenguajes soportados

**Archivo:** `app/types/index.ts`

Añadir un tipo y una constante para los lenguajes soportados, al igual que hicimos con `DIFFICULTY_RANGES`:

```ts
export type LanguageKey = 'javascript' | 'python' | 'cpp' | 'java'

export type Language = {
  key: LanguageKey
  label: string       // Lo que ve el usuario en el dropdown: "JavaScript"
  monacoId: string    // El ID que entiende Monaco: "javascript", "python", "cpp", "java"
  starter: string     // Código inicial que aparece al cargar/cambiar de lenguaje
}

export const LANGUAGES: Language[] = [
  {
    key: 'javascript',
    label: 'JavaScript',
    monacoId: 'javascript',
    starter: '/**\n * @param {*} input\n */\nfunction solution(input) {\n  // Write your solution here\n}\n',
  },
  {
    key: 'python',
    label: 'Python',
    monacoId: 'python',
    starter: 'def solution(input):\n    # Write your solution here\n    pass\n',
  },
  {
    key: 'cpp',
    label: 'C++',
    monacoId: 'cpp',
    starter: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  },
  {
    key: 'java',
    label: 'Java',
    monacoId: 'java',
    starter: 'class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}\n',
  },
]
```

---

## Paso 3 — Implementar `CodeEditor.tsx`

**Props:**
```ts
{
  codigo: string
  lenguaje: LanguageKey
  onChange: (value: string) => void
}
```

**Decisiones de implementación:**
- `'use client'` obligatorio — Monaco necesita el DOM del navegador.
- Usar el componente `<Editor />` de `@monaco-editor/react`.
- Tema: `vs-dark` (el tema oscuro de Monaco, encaja con nuestra UI).
- `height="100%"` y `width="100%"` para que ocupe todo el contenedor flex.
- Prop `language`: usar `LANGUAGES.find(l => l.key === lenguaje)?.monacoId`.
- Prop `value`: recibe `codigo` del padre (editor controlado).
- Prop `onChange`: llama a `onChange(value ?? '')`.
- Prop `loading`: mostrar un spinner mientras Monaco carga (el bundle es pesado).
- Opciones del editor a pasar via `options`:
  - `fontSize: 14`
  - `fontFamily: 'var(--font-geist-mono)'` (consistente con el resto de la UI)
  - `minimap: { enabled: false }` (el minimapa ocupa espacio innecesario en un editor pequeño)
  - `scrollBeyondLastLine: false`
  - `lineNumbers: 'on'`
  - `wordWrap: 'on'`
  - `tabSize: 2`

---

## Paso 4 — Conectar el selector de lenguaje en `PlaygroundNavbar`

**Cambios en `PlaygroundNavbar.tsx`:**

Añadir dos props nuevas y reemplazar el `<select>` hardcodeado por uno controlado:

```ts
// Props nuevas:
lenguaje: LanguageKey
onLenguajeChange: (key: LanguageKey) => void
```

- Cambiar `defaultValue` por `value={lenguaje}`.
- Añadir `onChange={(e) => onLenguajeChange(e.target.value as LanguageKey)}`.
- Iterar `LANGUAGES` para generar las opciones dinámicamente (igual que hacemos con `DIFFICULTY_RANGES`).

---

## Paso 5 — Actualizar `Playground` (padre)

**Cambios en `app/(workspace)/playground/page.tsx`:**

1. Importar `LANGUAGES` y `LanguageKey` de `@/app/types`.
2. Cambiar `useState("javascript")` a `useState<LanguageKey>("javascript")`.
3. Eliminar el `void lenguaje, setLenguaje, codigo, setCodigo` — ya se usarán.
4. Cuando cambia el lenguaje (`handleLenguajeChange`):
   - Actualizar `lenguaje`.
   - Resetear `codigo` al `starter` del nuevo lenguaje (`LANGUAGES.find(l => l.key === key)?.starter ?? ''`).
5. Cuando se genera un nuevo problema: resetear `codigo` al starter del lenguaje actual.
6. Pasar a `PlaygroundNavbar`: `lenguaje`, `onLenguajeChange={handleLenguajeChange}`.
7. Pasar a `CodeEditor`: `codigo`, `lenguaje`, `onChange={setCodigo}`.

---

## Resumen de archivos afectados

| Acción | Archivo |
|---|---|
| 📦 Instalar | `@monaco-editor/react` |
| ✏️ Modificar | `app/types/index.ts` |
| ✏️ Implementar | `app/components/playground/CodeEditor.tsx` |
| ✏️ Modificar | `app/components/playground/PlaygroundNavbar.tsx` |
| ✏️ Modificar | `app/(workspace)/playground/page.tsx` |

**No se tocan en esta fase:** `Console` (sigue siendo placeholder), `ProblemStatement`, `ProblemInformation`, la API.

---

## Verificación post-implementación

1. `/playground` → el área del editor muestra Monaco con sintaxis de JavaScript.
2. Cambiar lenguaje en el dropdown → el editor cambia el resaltado y el código se resetea al starter del nuevo lenguaje.
3. Escribir código en el editor → el estado `codigo` del padre se actualiza (verificable añadiendo un `console.log` temporal).
4. Generar nuevo problema → el editor se resetea al starter del lenguaje actual.
5. El editor ocupa exactamente el 70% de la columna derecha sin desbordarse.
