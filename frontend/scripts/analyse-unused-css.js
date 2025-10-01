#!/usr/bin/env node

/**
 * CSS Usage Analyser
 * 
 * Analyses CSS files to find:
 * - Unused CSS selectors
 * - Duplicate selectors
 * - CSS file sizes
 * - Potential optimisation opportunities
 */

import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI colour codes for terminal output
const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, colour = 'reset') {
  console.log(`${colours[colour]}${message}${colours.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function analyseCSSUsage() {
  logSection('🔍 CSS Usage Analyser');

  try {
    // Find CSS files manually using glob (more reliable cross-platform)
    const cssFiles = await glob('src/**/*.css', { 
      cwd: rootDir,
      absolute: true,
      windowsPathsNoEscape: true 
    });
    
    const contentFiles = await glob('src/**/*.{tsx,ts,jsx,js}', { 
      cwd: rootDir,
      absolute: true,
      windowsPathsNoEscape: true 
    });

    log(`Found ${cssFiles.length} CSS files`, 'cyan');
    log(`Found ${contentFiles.length} content files`, 'cyan');

    if (cssFiles.length === 0) {
      log('❌ No CSS files found! Check your src directory.', 'red');
      process.exit(1);
    }

    // Configure PurgeCSS with explicit file lists
    const purgeCSSResults = await new PurgeCSS().purge({
      content: [
        ...contentFiles,
        path.join(rootDir, 'index.html'),
      ],
      css: cssFiles,
      safelist: {
        // Keep these classes even if not found (dynamic classes)
        standard: [
          /^theme-/,
          /^toast-/,
          /^modal-/,
          'active',
          'disabled',
          'error',
          'loading',
        ],
        deep: [/data-/, /aria-/],
      },
      rejected: true,
      rejectedCss: true,
    });

    // Analyse results
    let totalOriginalSize = 0;
    let totalPurgedSize = 0;
    let totalRejectedSelectors = 0;
    const fileAnalysis = [];

    for (const result of purgeCSSResults) {
      const originalSize = result.css.length;
      const rejectedSize = result.rejected ? result.rejected.join('\n').length : 0;
      const purgedSize = originalSize - rejectedSize;

      totalOriginalSize += originalSize;
      totalPurgedSize += purgedSize;
      totalRejectedSelectors += result.rejected ? result.rejected.length : 0;

      const fileName = path.relative(rootDir, result.file || 'unknown');
      const savingsPercent = originalSize > 0 ? ((rejectedSize / originalSize) * 100).toFixed(1) : '0.0';

      fileAnalysis.push({
        file: fileName,
        originalSize,
        purgedSize,
        rejectedSize,
        savingsPercent: parseFloat(savingsPercent),
        rejectedSelectors: result.rejected || [],
      });
    }

    // Sort by potential savings
    fileAnalysis.sort((a, b) => b.savingsPercent - a.savingsPercent);

    // Display results
    logSection('📊 Analysis Results');

    // Overall statistics
    log('Overall Statistics:', 'cyan');
    console.log(`Total CSS analysed: ${formatBytes(totalOriginalSize)}`);
    console.log(`Potential savings: ${formatBytes(totalOriginalSize - totalPurgedSize)} (${((totalOriginalSize - totalPurgedSize) / totalOriginalSize * 100).toFixed(1)}%)`);
    console.log(`Unused selectors found: ${totalRejectedSelectors}`);

    // File-by-file breakdown
    logSection('📁 File Analysis (sorted by potential savings)');

    fileAnalysis.forEach((analysis, index) => {
      const severityColour = getSeverityColour(analysis.savingsPercent);
      
      console.log(`\n${index + 1}. ${analysis.file}`);
      log(`   Potential savings: ${analysis.savingsPercent}%`, severityColour);
      console.log(`   Original: ${formatBytes(analysis.originalSize)} → Optimised: ${formatBytes(analysis.purgedSize)}`);
      console.log(`   Unused selectors: ${analysis.rejectedSelectors.length}`);

      if (analysis.rejectedSelectors.length > 0 && analysis.savingsPercent > 10) {
        log(`   ⚠️  Consider reviewing this file`, 'yellow');
        
        // Show first few unused selectors
        const preview = analysis.rejectedSelectors.slice(0, 5);
        console.log(`   First unused selectors:`);
        preview.forEach(selector => {
          console.log(`     - ${selector.trim().split('\n')[0].substring(0, 60)}...`);
        });
        if (analysis.rejectedSelectors.length > 5) {
          console.log(`     ... and ${analysis.rejectedSelectors.length - 5} more`);
        }
      }
    });

    // Recommendations
    logSection('💡 Recommendations');

    const highWasteFiles = fileAnalysis.filter(f => f.savingsPercent > 30);
    if (highWasteFiles.length > 0) {
      log('⚠️  High waste detected in these files:', 'red');
      highWasteFiles.forEach(f => {
        console.log(`   - ${f.file} (${f.savingsPercent}% unused)`);
      });
      console.log('\n   Consider:');
      console.log('   • Removing unused styles');
      console.log('   • Splitting large CSS files by component');
      console.log('   • Using CSS Modules for better tree-shaking');
    } else {
      log('✅ Good CSS hygiene! Most files have minimal waste.', 'green');
    }

    // Generate detailed report
    const reportPath = path.join(rootDir, 'css-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalOriginalSize,
        totalPurgedSize,
        totalSavings: totalOriginalSize - totalPurgedSize,
        savingsPercent: ((totalOriginalSize - totalPurgedSize) / totalOriginalSize * 100).toFixed(2),
        totalFiles: fileAnalysis.length,
        totalRejectedSelectors,
      },
      files: fileAnalysis,
    }, null, 2));

    log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');

    // Exit with error code if too much waste
    const overallWaste = ((totalOriginalSize - totalPurgedSize) / totalOriginalSize * 100);
    if (overallWaste > 40) {
      log('\n❌ CSS waste exceeds 40% - consider cleanup', 'red');
      process.exit(1);
    }

  } catch (error) {
    log(`\n❌ Error analysing CSS: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getSeverityColour(percent) {
  if (percent < 10) return 'green';
  if (percent < 30) return 'yellow';
  return 'red';
}

// Run analysis
analyseCSSUsage();
