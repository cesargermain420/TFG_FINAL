# Arquitectura — Granada Eventos

```mermaid
flowchart TD
    %% ── PUNTO DE ENTRADA ──────────────────────────────────────────
    IDX["index.ts\n(punto de entrada)"]
    APP["App.tsx\n(raíz)"]
    IDX --> APP

    %% ── CAPA DE ESTADO GLOBAL ─────────────────────────────────────
    subgraph CONTEXTO["Estado global · AppContext.tsx"]
        CTX["AppContext\n───────────────\nesAdmin / sesion\neventos [ ]\nfavoritos [ ]\nfavoritosBares [ ]"]
        STOR["AsyncStorage\n(persistencia local)"]
        CTX <-->|"lee / guarda"| STOR
    end

    APP -->|"envuelve con AppProvider"| CONTEXTO

    %% ── CAPA DE NAVEGACIÓN ────────────────────────────────────────
    subgraph NAV["Navegación · AppNavigator.tsx"]
        direction LR
        SWIPE["withSwipeNavigation HOC\n(deslizar entre pestañas)"]
        TABS["Bottom Tab Navigator"]
        SWIPE --> TABS
    end

    CONTEXTO --> NAV

    %% ── PESTAÑAS VISIBLES ─────────────────────────────────────────
    subgraph PESTANAS["Pestañas visibles"]
        HOME["HomeScreen\n───────────\nFiltros zona / categoría\nBúsqueda texto\nLista eventos próximos"]
        BLOG["BlogScreen\n───────────\nArtículos\nEventos recientes"]
        FAV["FavoritosScreen\n───────────\nEventos guardados\nBares guardados"]
        COMER["ComerScreen\n───────────\nLista de bares\ny restaurantes"]
        INFO["InfoScreen\n───────────\nAyuda / créditos"]
    end

    TABS --> HOME
    TABS --> BLOG
    TABS --> FAV
    TABS --> COMER
    TABS --> INFO

    %% ── PANTALLAS SIN PESTAÑA ─────────────────────────────────────
    subgraph OCULTAS["Pantallas ocultas (sin botón en la barra)"]
        LOGIN["LoginScreen\n(autenticación admin)"]
        DETALLE["DetalleEventoScreen\n(info completa de un evento)"]
        CREAR["CrearEventoScreen\n(crear / editar evento)"]
    end

    TABS -.->|"navigate()"| OCULTAS

    %% ── COMPONENTES COMPARTIDOS ───────────────────────────────────
    subgraph COMPS["Componentes reutilizables"]
        CARD["EventoCard\n(tarjeta de evento)"]
        BADGE["Badge\n(etiqueta de categoría)"]
        PRECIO["PrecioTag\n(gratuito / precio)"]
    end

    HOME --> CARD
    BLOG --> CARD
    FAV  --> CARD
    CARD --> BADGE
    CARD --> PRECIO

    %% ── CAPA DE DATOS ─────────────────────────────────────────────
    subgraph DATOS["Datos estáticos"]
        DEVTS["eventos.ts\n───────────\nEVENTOS_INICIALES\nZONAS / CATEGORIAS\nCATEGORIA_COLORES"]
        DBARES["bares.ts\n───────────\nLista de bares"]
    end

    CTX -->|"carga al iniciar"| DEVTS
    COMER --> DBARES

    %% ── TIPOS ────────────────────────────────────────────────────
    subgraph TYPES["Tipos TypeScript"]
        TEVENTO["evento.ts\nEvento · EventoInput · Sesion"]
        TBAR["bar.ts\nBar"]
        TNAV["navigation.ts\nRootStackParamList"]
    end

    %% ── ESTILOS ──────────────────────────────────────────────────
    THEME["theme.ts\ncolors · radius · shadow"]

    %% ── FLUJO DE DATOS PRINCIPAL ──────────────────────────────────
    HOME -->|"useApp()"| CTX
    BLOG -->|"useApp()"| CTX
    FAV  -->|"useApp()"| CTX
    CREAR -->|"crearEvento / editarEvento"| CTX
    LOGIN -->|"login / logout"| CTX

    %% ── ESTILOS VISUALES DEL DIAGRAMA ─────────────────────────────
    classDef screen  fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a
    classDef context fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef data    fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef comp    fill:#f3e8ff,stroke:#7c3aed,color:#581c87
    classDef nav     fill:#fff7ed,stroke:#ea580c,color:#7c2d12

    class HOME,BLOG,FAV,COMER,INFO,LOGIN,DETALLE,CREAR screen
    class CTX,STOR context
    class DEVTS,DBARES,TEVENTO,TBAR,TNAV,THEME data
    class CARD,BADGE,PRECIO comp
    class SWIPE,TABS nav
```

---

## Resumen de capas

| Capa | Archivos | Responsabilidad |
|------|----------|-----------------|
| **Entrada** | `index.ts` → `App.tsx` | Arranca la app y monta el provider |
| **Estado global** | `AppContext.tsx` | Gestiona eventos, favoritos, sesión y persiste en AsyncStorage |
| **Navegación** | `AppNavigator.tsx` | Bottom tabs + HOC de deslizamiento entre pestañas |
| **Pantallas (tabs)** | `HomeScreen`, `BlogScreen`, `FavoritosScreen`, `ComerScreen`, `InfoScreen` | Vistas principales accesibles desde la barra |
| **Pantallas ocultas** | `LoginScreen`, `DetalleEventoScreen`, `CrearEventoScreen` | Se accede con `navigate()`, sin botón en la barra |
| **Componentes** | `EventoCard`, `Badge`, `PrecioTag` | UI reutilizable entre pantallas |
| **Datos** | `eventos.ts`, `bares.ts` | Datos iniciales estáticos |
| **Tipos** | `evento.ts`, `bar.ts`, `navigation.ts` | Contratos TypeScript |
| **Estilos** | `theme.ts` | Colores, radios y sombras compartidos |
