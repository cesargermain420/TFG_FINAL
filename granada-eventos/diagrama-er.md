# Figura 4: Diagrama Entidad-Relación — Granada Eventos

```mermaid
erDiagram

    USUARIO {
        string sesion        "admin | null"
    }

    EVENTO {
        string id            PK
        string titulo
        string zona
        string fecha         "YYYY-MM-DD"
        string hora          "HH:MM"
        string precio        "Gratuito | X EUR"
        string ubicacion
        string descripcion
        string categoria
        string aforo
        string organizador
        string imagen        "opcional"
    }

    BAR {
        string id            PK
        string nombre
        string zona
        string descripcion   "opcional"
        string direccion     "opcional"
        string horarios      "opcional"
        string telefono      "opcional"
        string imagen        "opcional"
    }

    ZONA {
        string id            PK "Albaicin | Centro | Realejo …"
        string descripcion
    }

    CATEGORIA {
        string id            PK "Musica | Cultura | Mercado …"
        string colorFondo
        string colorTexto
        string colorAcento
    }

    FAVORITO_EVENTO {
        string usuarioId     FK
        string eventoId      FK
    }

    FAVORITO_BAR {
        string usuarioId     FK
        string barId         FK
    }

    %% ── RELACIONES ──────────────────────────────────────────────────

    USUARIO ||--o{ FAVORITO_EVENTO : "guarda"
    USUARIO ||--o{ FAVORITO_BAR    : "guarda"
    USUARIO ||--o{ EVENTO          : "crea / edita / elimina"

    FAVORITO_EVENTO }o--|| EVENTO : "referencia"
    FAVORITO_BAR    }o--|| BAR    : "referencia"

    EVENTO }o--|| ZONA      : "pertenece a"
    EVENTO }o--|| CATEGORIA : "pertenece a"

    BAR    }o--|| ZONA      : "pertenece a"
```

---

## Descripción de entidades

| Entidad | Descripción |
|---------|-------------|
| **USUARIO** | Sesión activa en la app. Solo existe el rol `admin`; el usuario anónimo tiene `sesion = null`. |
| **EVENTO** | Evento cultural de Granada. El `id` se genera con `Date.now()` al crear uno nuevo. |
| **BAR** | Bar o restaurante listado en la pestaña Comer. |
| **ZONA** | Barrio de Granada (Albaicín, Centro, Realejo…). Actúa como catálogo compartido entre eventos y bares. |
| **CATEGORIA** | Tipo de evento (Música, Cultura, Mercado…). Incluye la paleta de colores asociada. |
| **FAVORITO_EVENTO** | Relación N:M resuelta como lista de IDs en `AsyncStorage`. |
| **FAVORITO_BAR** | Igual que anterior pero para bares. |

## Cardinalidades clave

- Un **usuario** puede guardar **0 o muchos** eventos favoritos.
- Un **usuario** puede guardar **0 o muchos** bares favoritos.
- Un **usuario admin** puede crear, editar y eliminar **0 o muchos** eventos.
- Cada **evento** pertenece a exactamente **1 zona** y **1 categoría**.
- Cada **bar** pertenece a exactamente **1 zona**.
- Una **zona** o **categoría** puede agrupar **0 o muchos** eventos/bares.
