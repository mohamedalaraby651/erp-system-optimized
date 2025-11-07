#!/usr/bin/env node
/**
 * Asset Minification Script
 * Minifies JS and CSS files for production
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const staticDir = path.join(__dirname, '../public/static');
const outputDir = path.join(__dirname, '../public/static/min');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Minify JavaScript files
async function minifyJS() {
  const jsFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.js'));
  
  console.log('🔄 Minifying JavaScript files...');
  
  for (const file of jsFiles) {
    const filePath = path.join(staticDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    try {
      const result = await minify(code, {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: {
          toplevel: true
        },
        format: {
          comments: false
        }
      });
      
      const outputPath = path.join(outputDir, file);
      fs.writeFileSync(outputPath, result.code);
      
      const originalSize = Buffer.byteLength(code, 'utf8');
      const minifiedSize = Buffer.byteLength(result.code, 'utf8');
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      console.log(`  ✓ ${file}: ${(originalSize/1024).toFixed(1)}KB → ${(minifiedSize/1024).toFixed(1)}KB (-${savings}%)`);
    } catch (error) {
      console.error(`  ✗ Error minifying ${file}:`, error.message);
    }
  }
}

// Minify CSS files
async function minifyCSS() {
  const cssnano = require('cssnano');
  const postcss = require('postcss');
  const cssFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.css'));
  
  console.log('\n🔄 Minifying CSS files...');
  
  for (const file of cssFiles) {
    const filePath = path.join(staticDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    try {
      const result = await postcss([
        cssnano({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            minifyFontValues: true,
            minifyGradients: true,
            colormin: true
          }]
        })
      ]).process(code, { from: filePath });
      
      const outputPath = path.join(outputDir, file);
      fs.writeFileSync(outputPath, result.css);
      
      const originalSize = Buffer.byteLength(code, 'utf8');
      const minifiedSize = Buffer.byteLength(result.css, 'utf8');
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      console.log(`  ✓ ${file}: ${(originalSize/1024).toFixed(1)}KB → ${(minifiedSize/1024).toFixed(1)}KB (-${savings}%)`);
    } catch (error) {
      console.error(`  ✗ Error minifying ${file}:`, error.message);
    }
  }
}

// Run minification
(async () => {
  console.log('🚀 Starting asset minification...\n');
  await minifyJS();
  await minifyCSS();
  console.log('\n✅ Minification complete!');
  console.log(`📁 Minified files saved to: ${outputDir}\n`);
})();
