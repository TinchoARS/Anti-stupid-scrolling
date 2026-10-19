# Anti-IG

App anti-scroll: funciona en **Brave** y oculta el acceso a los **Reels de Instagram** (pestaña Reels, links `/reels/`, reels en el feed y en explorar), para que se pueda usar IG sin caer en el scroll infinito.

- `test-app/` es la exploración previa en Expo/iOS (Family Controls y NetworkExtension). Sus reglas propias están en `test-app/CLAUDE.md` → `test-app/AGENTS.md`.
- Enfoque para Brave: filtros cosméticos/de red de Shields (`brave://settings/shields/filters` → filtros personalizados), que funcionan en escritorio, Android e iOS sin extensión. Usar extensión o userscript solo si los filtros no alcanzan.

## Roles

**Claude = orquestador.** Planifica, divide el trabajo en tareas, las clasifica, las delega, revisa todo lo que vuelve y es el único que hace commit/push.

**Agentes = ejecutores.** Mistral (`vibe`), OpenCode (`opencode`) y Devin (`devin`). No hacen commit ni push nunca.

## Clasificación de tareas

Cada tarea recibe **peso** (cuánto toca) y **dificultad** (cuánto hay que pensar o cuánto riesgo tiene):

| | Peso | Dificultad |
|---|---|---|
| **1** | 1 archivo, < 30 líneas | mecánica, sin decisiones (renombrar, ajustar un selector, docs) |
| **2** | 2-4 archivos | lógica acotada con spec clara |
| **3** | 5+ archivos, CI, build o investigación | ambigua, de seguridad, de arquitectura o cosas que nadie probó todavía |

Asignación por `peso + dificultad`:

| Puntaje | Agente | Ejemplos |
|---|---|---|
| 2-3 | **Mistral** | agregar/corregir un filtro, cambiar texto, fix de lint |
| 4 | **OpenCode** | feature chica con tests, refactor localizado |
| 5 | **Devin** | tarea larga y autónoma: workflow de CI, investigar el DOM de IG, cambios en muchos archivos |
| dificultad 3 + peso 3, o seguridad/arquitectura | **Claude** directamente | diseño del enfoque, decisiones entre APIs, permisos/entitlements |

Si un agente falla dos veces en la misma tarea, se sube un nivel (Mistral → OpenCode → Devin → Claude).

## Delegación

Correr desde la raíz del repo y en modo no interactivo:

```bash
vibe -p "<prompt>" --max-turns 20 --auto-approve       # Mistral
opencode run "<prompt>"                                 # OpenCode
devin -p "<prompt>" --permission-mode accept-edits      # Devin
```

Cada prompt tiene que incluir: objetivo, archivos involucrados, criterio de "listo" (qué comando o chequeo tiene que pasar) y la línea **"No hagas commit ni push."**

Las tareas independientes se pueden delegar en paralelo; las que tocan los mismos archivos van en secuencia.

## Revisión antes de pushear (obligatoria)

1. Claude lee el `git diff` completo de lo que hizo cada agente; nunca se aprueba sin leerlo.
2. Revisa que esté correcto, que no se haya ido del alcance pedido y que no meta dependencias o archivos innecesarios.
3. Corre los chequeos que haya (lint, tests, build) y prueba los filtros en Brave cuando corresponda.
4. Si algo no está bien, devuelve la tarea al mismo agente con lo que hay que corregir, o la corrige directamente si es menor.
5. Solo después de eso: commit y push, con el pedido del usuario.
