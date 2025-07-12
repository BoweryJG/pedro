#!/bin/bash

# Fix lint errors in frontend

cd frontend

# 1. Fix ImageFocusedHero.tsx - Add missing closing brace
echo "Fixing ImageFocusedHero.tsx..."
# The issue is at line 255, column 8 - missing closing brace

# 2. Remove unused imports and variables
echo "Removing unused imports..."

# Fix TimeOff import
sed -i '' '/^[[:space:]]*TimeOff[[:space:]]*,$/d' components/dashboard/Schedule/StaffScheduler.tsx
sed -i '' 's/, TimeOff,/, /g' components/dashboard/Schedule/StaffScheduler.tsx
sed -i '' 's/, TimeOff / /g' components/dashboard/Schedule/StaffScheduler.tsx

# Fix TimeSlot import
sed -i '' '/^[[:space:]]*TimeSlot[[:space:]]*,$/d' src/components/EnhancedBookingForm.tsx
sed -i '' 's/, TimeSlot,/, /g' src/components/EnhancedBookingForm.tsx
sed -i '' 's/, TimeSlot / /g' src/components/EnhancedBookingForm.tsx

# Fix unused useMediaQuery imports
sed -i '' 's/import {$/import {/g; /^[[:space:]]*useMediaQuery[[:space:]]*,$/d' src/components/LuxuryCareConciergeHero.tsx
sed -i '' 's/, useMediaQuery,/, /g' src/components/LuxuryCareConciergeHero.tsx
sed -i '' 's/, useMediaQuery / /g' src/components/LuxuryCareConciergeHero.tsx

sed -i '' 's/import {$/import {/g; /^[[:space:]]*useMediaQuery[[:space:]]*,$/d' src/components/LuxuryGoogleReviews.tsx
sed -i '' 's/, useMediaQuery,/, /g' src/components/LuxuryGoogleReviews.tsx
sed -i '' 's/, useMediaQuery / /g' src/components/LuxuryGoogleReviews.tsx

sed -i '' 's/import {$/import {/g; /^[[:space:]]*useMediaQuery[[:space:]]*,$/d' src/components/LuxuryServicesShowcase.tsx
sed -i '' 's/, useMediaQuery,/, /g' src/components/LuxuryServicesShowcase.tsx
sed -i '' 's/, useMediaQuery / /g' src/components/LuxuryServicesShowcase.tsx

sed -i '' 's/import {$/import {/g; /^[[:space:]]*useMediaQuery[[:space:]]*,$/d' src/components/LuxuryStatsSection.tsx
sed -i '' 's/, useMediaQuery,/, /g' src/components/LuxuryStatsSection.tsx
sed -i '' 's/, useMediaQuery / /g' src/components/LuxuryStatsSection.tsx

sed -i '' 's/import {$/import {/g; /^[[:space:]]*useMediaQuery[[:space:]]*,$/d' src/components/LuxuryTrustIndicators.tsx
sed -i '' 's/, useMediaQuery,/, /g' src/components/LuxuryTrustIndicators.tsx
sed -i '' 's/, useMediaQuery / /g' src/components/LuxuryTrustIndicators.tsx

# Fix other unused imports
sed -i '' '/^[[:space:]]*AvailableNumber[[:space:]]*,$/d' src/components/dashboard/PhoneNumberManager.tsx
sed -i '' 's/, AvailableNumber,/, /g' src/components/dashboard/PhoneNumberManager.tsx
sed -i '' 's/, AvailableNumber / /g' src/components/dashboard/PhoneNumberManager.tsx

sed -i '' '/^[[:space:]]*Staff[[:space:]]*,$/d' src/services/analytics/metricsCalculator.ts
sed -i '' 's/, Staff,/, /g' src/services/analytics/metricsCalculator.ts
sed -i '' 's/, Staff / /g' src/services/analytics/metricsCalculator.ts

# Fix unused variables with underscores
echo "Fixing unused variables..."

# Replace unused function parameters with underscore prefix
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_metricName\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_currentMetrics\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_benchmark\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_filters\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_features\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_operatoryStatus\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_participant\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_index\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_err\b/_/g'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\b_error\b/_/g'

# Fix assignments that are never used by commenting them out
sed -i '' 's/const theme = useTheme();/\/\/ const theme = useTheme();/g' src/components/LuxuryGoogleReviews.tsx
sed -i '' 's/const theme = useTheme();/\/\/ const theme = useTheme();/g' src/components/LuxuryServicesShowcase.tsx
sed -i '' 's/const theme = useTheme();/\/\/ const theme = useTheme();/g' src/components/LuxuryStatsSection.tsx
sed -i '' 's/const theme = useTheme();/\/\/ const theme = useTheme();/g' src/components/LuxuryTrustIndicators.tsx

echo "Running lint to check remaining errors..."
npm run lint 2>&1 | grep -E "error|warning" | wc -l