#!/usr/bin/env node

/**
 * Production Build Optimization Script
 * This script helps analyze and optimize the production build
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const FRONTEND_DIR = path.join(process.cwd(), 'frontend');
const BUILD_DIR = path.join(FRONTEND_DIR, 'dist');

async function analyzeBuildSize() {
  console.log('📊 Analyzing build size...');
  
  try {
    const stats = await fs.stat(BUILD_DIR);
    if (!stats.isDirectory()) {
      console.error('Build directory not found. Run npm run build first.');
      return;
    }

    // Get total size of build directory
    const { stdout } = await execAsync(`du -sh ${BUILD_DIR}`);
    console.log(`Total build size: ${stdout.trim()}`);

    // List largest files
    console.log('\n📦 Largest files in build:');
    const { stdout: files } = await execAsync(
      `find ${BUILD_DIR} -type f -exec ls -lh {} + | sort -k5 -hr | head -10`
    );
    console.log(files);

    // Check for source maps
    const { stdout: sourceMaps } = await execAsync(
      `find ${BUILD_DIR} -name "*.map" | wc -l`
    );
    console.log(`\n🗺️  Source maps found: ${sourceMaps.trim()}`);
    
    if (parseInt(sourceMaps.trim()) > 0) {
      console.log('⚠️  Warning: Source maps are included in production build');
      console.log('   Consider disabling source maps for smaller bundle size');
    }

  } catch (error) {
    console.error('Error analyzing build:', error.message);
  }
}

async function checkDependencies() {
  console.log('\n🔍 Checking for unnecessary dependencies...');
  
  try {
    // Check for dev dependencies in production
    const packageJson = JSON.parse(
      await fs.readFile(path.join(FRONTEND_DIR, 'package.json'), 'utf-8')
    );
    
    const devDeps = Object.keys(packageJson.devDependencies || {});
    const deps = Object.keys(packageJson.dependencies || {});
    
    console.log(`Production dependencies: ${deps.length}`);
    console.log(`Dev dependencies: ${devDeps.length}`);
    
    // Check for commonly problematic large dependencies
    const largeDeps = [
      'moment', // Use dayjs instead
      'lodash', // Use lodash-es or individual imports
      '@mui/icons-material', // Import icons individually
      'axios', // Consider fetch API
    ];
    
    const foundLargeDeps = deps.filter(dep => largeDeps.includes(dep));
    if (foundLargeDeps.length > 0) {
      console.log('\n⚠️  Large dependencies found that could be optimized:');
      foundLargeDeps.forEach(dep => {
        console.log(`   - ${dep}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking dependencies:', error.message);
  }
}

async function generateBuildReport() {
  console.log('\n📄 Generating build report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    node_version: process.version,
    npm_version: (await execAsync('npm --version')).stdout.trim(),
    environment: process.env.NODE_ENV || 'development',
  };
  
  try {
    // Get build time from package.json scripts
    const startTime = Date.now();
    await execAsync('cd frontend && npm run build:prod');
    const buildTime = Date.now() - startTime;
    
    report.build_time_ms = buildTime;
    report.build_time = `${(buildTime / 1000).toFixed(2)}s`;
    
  } catch (error) {
    console.log('Build already exists, skipping rebuild');
  }
  
  // Write report
  const reportPath = path.join(process.cwd(), 'build-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Build report saved to: ${reportPath}`);
}

async function main() {
  console.log('🚀 Production Build Optimization Tool\n');
  
  await analyzeBuildSize();
  await checkDependencies();
  await generateBuildReport();
  
  console.log('\n✅ Build analysis complete!');
  console.log('\nOptimization tips:');
  console.log('1. Run "npm run build:analyze" to visualize bundle composition');
  console.log('2. Enable gzip compression on your web server');
  console.log('3. Use CDN for static assets');
  console.log('4. Implement lazy loading for routes');
  console.log('5. Consider using a service worker for caching');
}

main().catch(console.error);