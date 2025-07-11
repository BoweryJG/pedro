#!/bin/bash
# Production deployment script for Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pedro"
BACKUP_DIR="./backups/deploy-$(date +%Y%m%d-%H%M%S)"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check environment files
    if [ ! -f "./backend/.env.production" ]; then
        error "backend/.env.production not found"
        exit 1
    fi
    
    log "Prerequisites check passed ✓"
}

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup volumes
    if docker volume ls | grep -q "${PROJECT_NAME}_redis-data"; then
        log "Backing up Redis data..."
        docker run --rm \
            -v "${PROJECT_NAME}_redis-data:/data" \
            -v "$(pwd)/$BACKUP_DIR:/backup" \
            alpine tar czf /backup/redis-data.tar.gz -C / data
    fi
    
    # Backup environment files
    cp -r ./backend/.env.production "$BACKUP_DIR/" 2>/dev/null || true
    
    log "Backup completed in $BACKUP_DIR"
}

# Build images
build_images() {
    log "Building Docker images..."
    
    # Set build arguments
    export BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
    export VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    
    # Build with production compose file
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    log "Images built successfully ✓"
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 10
    
    # Check health
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose -f docker-compose.prod.yml ps | grep -q "unhealthy"; then
            warning "Some services are still starting... ($((attempt+1))/$max_attempts)"
            sleep 5
            attempt=$((attempt+1))
        else
            break
        fi
    done
    
    # Show service status
    log "Service status:"
    docker-compose -f docker-compose.prod.yml ps
    
    log "Deployment completed ✓"
}

# Post-deployment checks
post_deployment_checks() {
    log "Running post-deployment checks..."
    
    # Check backend health
    if curl -f -s -o /dev/null http://localhost:3001/health; then
        log "Backend health check: ✓ OK"
    else
        error "Backend health check: ✗ FAILED"
        return 1
    fi
    
    # Check frontend
    if curl -f -s -o /dev/null http://localhost:80; then
        log "Frontend health check: ✓ OK"
    else
        error "Frontend health check: ✗ FAILED"
        return 1
    fi
    
    # Check Redis
    if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        log "Redis health check: ✓ OK"
    else
        error "Redis health check: ✗ FAILED"
        return 1
    fi
    
    log "All health checks passed ✓"
}

# Rollback function
rollback() {
    error "Deployment failed, rolling back..."
    
    # Stop failed deployment
    docker-compose -f docker-compose.prod.yml down
    
    # Restore from backup if needed
    if [ -d "$BACKUP_DIR" ]; then
        warning "Backup available at $BACKUP_DIR"
        warning "Manual restoration may be required"
    fi
    
    exit 1
}

# Main deployment flow
main() {
    log "Starting production deployment for $PROJECT_NAME"
    
    # Trap errors for rollback
    trap rollback ERR
    
    # Run deployment steps
    check_prerequisites
    backup_current
    build_images
    deploy_services
    post_deployment_checks
    
    # Remove trap
    trap - ERR
    
    log "🚀 Deployment successful!"
    log "Access the application at: http://localhost"
    log "Monitor logs with: docker-compose -f docker-compose.prod.yml logs -f"
}

# Parse arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    rollback)
        rollback
        ;;
    status)
        docker-compose -f docker-compose.prod.yml ps
        ;;
    logs)
        docker-compose -f docker-compose.prod.yml logs -f ${2:-}
        ;;
    *)
        echo "Usage: $0 [deploy|rollback|status|logs [service]]"
        exit 1
        ;;
esac