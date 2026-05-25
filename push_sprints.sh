#!/bin/bash
# =============================================================
#  Cartera Personal — Script de commits por Sprint
#  Ejecutar desde la raíz del proyecto:
#    chmod +x push_sprints.sh
#    ./push_sprints.sh
# =============================================================

set -e  # Detener si cualquier comando falla

# ── Colores para output ──────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

log()  { echo -e "${BLUE}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Cartera Personal — Push automático por Sprint ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ── 0. Verificar que estamos en la raíz del proyecto ─────────
if [ ! -f "package.json" ]; then
  err "Ejecuta este script desde la raíz del proyecto (donde está package.json)"
fi

if [ ! -d ".git" ]; then
  err "Esta carpeta no es un repositorio git. Clona el repo primero."
fi

# ── 1. Pedir credenciales de GitHub ─────────────────────────
echo -e "${YELLOW}Ingresa tus credenciales de GitHub:${NC}"
read -p "  Usuario de GitHub: " GH_USER
read -s -p "  Token de acceso personal (PAT): " GH_TOKEN
echo ""
echo ""

# Configurar remote con token
REMOTE_URL="https://${GH_USER}:${GH_TOKEN}@github.com/JoelCrts/cartera-personal.git"
git remote set-url origin "$REMOTE_URL"
log "Remote configurado correctamente."

# ── 2. Configurar identidad git si no existe ─────────────────
if [ -z "$(git config user.email)" ]; then
  read -p "  Tu correo para git commits: " GIT_EMAIL
  git config user.email "$GIT_EMAIL"
  git config user.name "$GH_USER"
fi

# ── Función: commit + push ────────────────────────────────────
commit_push() {
  local mensaje="$1"
  shift
  local archivos=("$@")

  echo ""
  log "Preparando commit: ${mensaje}"

  # Solo agregar archivos que existen
  local alguno=false
  for f in "${archivos[@]}"; do
    if [ -e "$f" ]; then
      git add "$f"
      alguno=true
    else
      warn "Archivo no encontrado (se omite): $f"
    fi
  done

  # Verificar si hay algo para commitear
  if git diff --cached --quiet; then
    warn "Sin cambios nuevos para: ${mensaje} — se omite."
    return
  fi

  git commit -m "$mensaje"
  git push origin main
  ok "Subido: ${mensaje}"
  sleep 1
}

# ══════════════════════════════════════════════════════════════
#  COMMITS POR SPRINT
# ══════════════════════════════════════════════════════════════

# ── SPRINT 0: Base del proyecto ──────────────────────────────
commit_push \
  "feat: setup base — imágenes WebP optimizadas, tokens CSS, router y dependencias" \
  "public/images/" \
  "src/index.css" \
  "src/App.css" \
  "src/App.jsx" \
  "src/main.jsx" \
  "package.json" \
  "package-lock.json"

# ── SPRINT 0b: Infraestructura shared ───────────────────────
commit_push \
  "feat: AuthContext (sesión localStorage) y Navbar adaptativo público/privado" \
  "src/context/AuthContext.jsx" \
  "src/components/Navbar.jsx" \
  "src/components/Navbar.css"

# ── SPRINT 0c: Páginas públicas ──────────────────────────────
commit_push \
  "feat: landing page completa con hero, features, security, ahorro, testimonial y footer" \
  "src/pages/Landing.jsx" \
  "src/pages/Landing.css"

commit_push \
  "feat: página Nosotros con hero, misión, visión y equipo" \
  "src/pages/Nosotros.jsx" \
  "src/pages/Nosotros.css"

# ── SPRINT 1: HU-01 Registro ─────────────────────────────────
commit_push \
  "feat(HU-01): registro de cuenta con validación, cifrado local y redirección al dashboard" \
  "src/pages/Registro.jsx" \
  "src/pages/AuthPages.css"

# ── SPRINT 1: HU-02 Login ────────────────────────────────────
commit_push \
  "feat(HU-02): inicio de sesión con credenciales, manejo de errores y guards de ruta" \
  "src/pages/Login.jsx"

# ── SPRINT 2: HU-03 Movimientos ──────────────────────────────
commit_push \
  "feat(HU-03): formulario de movimientos con toggle ingreso/gasto, categorías y persistencia" \
  "src/pages/Movimientos.jsx" \
  "src/pages/Movimientos.css"

# ── SPRINT 3: HU-04 Historial ────────────────────────────────
commit_push \
  "feat(HU-04): historial de transacciones con filtros por tipo, categoría y búsqueda" \
  "src/pages/Historial.jsx" \
  "src/pages/Historial.css"

# ── SPRINT 4+5: HU-05 y HU-06 Metas ─────────────────────────
commit_push \
  "feat(HU-05/HU-06): metas de ahorro individuales/compartidas con barra de progreso y aportaciones" \
  "src/pages/Metas.jsx" \
  "src/pages/Metas.css"

# ── SPRINT 6: HU-07 Dashboard ────────────────────────────────
commit_push \
  "feat(HU-07): dashboard con gráficas estadísticas (BarChart, PieChart, LineChart) via Recharts" \
  "src/pages/Dashboard.jsx" \
  "src/pages/Dashboard.css"

# ── SPRINT 7: HU-08 Reportes PDF ────────────────────────────
commit_push \
  "feat(HU-08): generación y descarga de reporte PDF con jsPDF — resumen ejecutivo y detalle" \
  "src/pages/Reportes.jsx" \
  "src/pages/Reportes.css"

# ── CIERRE: Página 404 ───────────────────────────────────────
commit_push \
  "feat: página 404 personalizada con imagen optimizada y retorno al inicio" \
  "src/pages/NotFound.jsx" \
  "src/pages/NotFound.css"

# ══════════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  ✅ Todos los commits subidos exitosamente     ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "  Revisa tu repo en:"
echo -e "  ${BLUE}https://github.com/JoelCrts/cartera-personal${NC}"
echo ""

# Limpiar token del remote por seguridad
git remote set-url origin "https://github.com/JoelCrts/cartera-personal.git"
ok "Token removido del remote por seguridad."
echo ""
