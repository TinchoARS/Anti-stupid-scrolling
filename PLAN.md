# Plan: Anti-IG

**Producto:** un userscript (`anti-reels.user.js`) que oculta los links a Reels en Instagram web y redirige `/reels/`, `/reel/<id>` y `/<usuario>/reels/` fuera de Reels.

- **PC:** Brave + Violentmonkey.
- **iPhone:** Safari + app "Userscripts" (gratis). Brave iOS no admite extensiones. Hay que borrar la app de Instagram.

**Descartado:** filtros de Brave Shields (el selector encuentra los links, pero Brave no los oculta ni en modo Agresivo, probado en PC el 2026-10-19), DNS o proxy, extensión nativa con cuenta gratuita de Apple (vence cada 7 días). Detalles en el historial del chat.

## Fases

Puntaje = peso + dificultad, según `CLAUDE.md`.

| # | Tarea | P+D | Agente | Listo cuando |
|---|---|---|---|---|
| 1 | `anti-reels.user.js` + `check.js` (asserts de la redirección) + `README.md` con la instalación | 1+2 | **Mistral** | `node check.js` pasa y Claude revisa el diff |
| 2 | Prueba real: PC (Brave + Violentmonkey) y iPhone (Safari + Userscripts) | 2+2 | **Usuario** | la pestaña Reels no aparece y `/reels/` redirige, en las dos plataformas |
| 3 | Ajustar los selectores según lo que siga apareciendo (por ejemplo, reels dentro del feed) | 1+2 | **Mistral** | lo reportado en la Fase 2 deja de aparecer |
| 4 | Archivar `test-app/` en una rama y borrarlo de `main` | 1+1 | Claude, con OK del usuario | `main` contiene solo lo que se usa |

## Pendiente para más adelante

- Ocultar los reels que se reproducen dentro del feed, si en la Fase 2 resulta que molestan.
- Tiempo en pantalla → "Nunca permitir `instagram.com/reels`" como refuerzo en el iPhone.
