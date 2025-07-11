#!/bin/bash
# Health check script for Docker containers

set -e

SERVICE=${1:-all}
TIMEOUT=${2:-30}

check_service() {
    local service=$1
    local url=$2
    local name=$3
    
    echo -n "Checking $name... "
    
    if curl -f -s -o /dev/null --max-time 5 "$url"; then
        echo "✓ OK"
        return 0
    else
        echo "✗ FAILED"
        return 1
    fi
}

check_all_services() {
    local all_ok=true
    
    # Check frontend
    if ! check_service "frontend" "http://localhost:5173" "Frontend"; then
        all_ok=false
    fi
    
    # Check backend
    if ! check_service "backend" "http://localhost:3001/health" "Backend API"; then
        all_ok=false
    fi
    
    # Check Redis
    echo -n "Checking Redis... "
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        echo "✓ OK"
    else
        echo "✗ FAILED"
        all_ok=false
    fi
    
    if [ "$all_ok" = true ]; then
        echo -e "\n✅ All services are healthy!"
        return 0
    else
        echo -e "\n❌ Some services are not healthy"
        return 1
    fi
}

wait_for_services() {
    echo "Waiting for services to be ready (timeout: ${TIMEOUT}s)..."
    
    local count=0
    while [ $count -lt $TIMEOUT ]; do
        if check_all_services > /dev/null 2>&1; then
            echo -e "\n✅ All services are ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        count=$((count + 1))
    done
    
    echo -e "\n❌ Timeout waiting for services"
    return 1
}

case "$SERVICE" in
    all)
        check_all_services
        ;;
    wait)
        wait_for_services
        ;;
    frontend)
        check_service "frontend" "http://localhost:5173" "Frontend"
        ;;
    backend)
        check_service "backend" "http://localhost:3001/health" "Backend API"
        ;;
    redis)
        echo -n "Checking Redis... "
        if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
            echo "✓ OK"
        else
            echo "✗ FAILED"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 [all|wait|frontend|backend|redis] [timeout]"
        echo "  all      - Check all services"
        echo "  wait     - Wait for all services to be ready"
        echo "  frontend - Check frontend only"
        echo "  backend  - Check backend only"
        echo "  redis    - Check Redis only"
        exit 1
        ;;
esac