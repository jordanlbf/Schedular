# CI/CD Documentation

This project uses GitHub Actions for continuous integration and code quality checks.

## 🚀 Workflows

### 1. **CI - Lint, Type Check, Build** (`ci.yml`)
**Triggers**: Pull requests and pushes to `main`/`develop`

**Jobs**:
- **Lint & Type Check**: Runs ESLint and TypeScript compiler
- **Build**: Creates production build and uploads artifacts

**What it checks**:
- ✅ Code passes ESLint rules
- ✅ No TypeScript errors
- ✅ Project builds successfully

---

### 2. **CSS Analysis** (`css-analysis.yml`) 🎨
**Triggers**: Pull requests and pushes that modify CSS or TypeScript files

**What it does**:
- Analyzes all CSS files for unused selectors
- Detects duplicate styles
- Calculates potential file size savings
- Posts results as PR comment
- **Fails if CSS waste > 40%**

**Example output**:
```
📊 CSS Analysis Report

Summary:
- Total CSS Size: 45.2 KB
- Potential Savings: 8.3 KB (18.4%)
- Unused Selectors: 127

⚠️ Files with High CSS Waste (>30%)
- src/features/old/legacy.css: 42% unused (34 selectors)
```

**Local usage**:
```bash
# Run CSS analysis locally
npm run css:unused

# View detailed report
cat css-analysis-report.json
```

---

### 3. **Bundle Size Check** (`bundle-size.yml`) 📦
**Triggers**: Pull requests only

**What it does**:
- Compares build size between PR and base branch
- Posts comparison table as PR comment
- **Fails if bundle grows by >10%**

**Example output**:
```
📊 Bundle Size Report

| Metric    | Size       |
|-----------|------------|
| Base      | 234.5 KB   |
| Current   | 236.1 KB   |
| Diff      | +1.6 KB (+0.68%) |
```

---

## 🔧 Local Development

### Running CI Checks Locally

Before pushing, run these commands to catch issues:

```bash
# Lint check
npm run lint

# Lint and auto-fix
npm run lint:fix

# Type check
npx tsc -b --noEmit

# Build
npm run build

# CSS analysis
npm run css:unused
```

### Understanding CSS Analysis Results

The CSS analyzer looks for:
1. **Unused selectors**: Classes/IDs never referenced in your code
2. **Savings potential**: How much smaller CSS could be
3. **File-specific issues**: Which files need attention

**Thresholds**:
- 🟢 < 10% waste: Excellent
- 🟡 10-30% waste: Good, minor cleanup possible
- 🔴 > 30% waste: Needs review
- ❌ > 40% waste: CI fails

**False positives**: Some classes might be flagged as unused if they're:
- Generated dynamically (e.g., `theme-${name}`)
- Used in conditional logic
- Applied via JavaScript

Update the `safelist` in `scripts/analyze-unused-css.js` to whitelist these.

---

## 📊 Viewing CI Results

### GitHub UI
1. Go to your pull request
2. Scroll to "Checks" section at bottom
3. Click on any workflow to see details
4. Download artifacts (build files, reports) from workflow summary

### PR Comments
Automated bots will comment on your PR with:
- CSS analysis summary
- Bundle size comparison
- Links to detailed reports

---

## 🛠 Configuration

### Adjusting CSS Analysis Thresholds

Edit `scripts/analyze-unused-css.js`:

```javascript
// Change failure threshold (currently 40%)
if (overallWaste > 40) {
  // Change to 50 for more lenient, 30 for stricter
  process.exit(1);
}

// Add safelist patterns
safelist: {
  standard: [
    /^theme-/,        // Keep all theme-* classes
    /^toast-/,        // Keep all toast-* classes
    'your-pattern',   // Add your patterns here
  ],
}
```

### Adjusting Bundle Size Threshold

Edit `.github/workflows/bundle-size.yml`:

```yaml
# Change failure threshold (currently 10%)
if (diffPercent > 10) {
  # Change to 15 for more lenient, 5 for stricter
  core.setFailed(`Bundle size increased by ${diffPercent}%`);
}
```

---

## 🐛 Troubleshooting

### CSS Analysis Failing

**Problem**: Many false positives for unused CSS

**Solution**: Add patterns to safelist
```bash
# Edit scripts/analyze-unused-css.js
safelist: {
  standard: [/^your-dynamic-class/],
}
```

### Bundle Size Check Failing

**Problem**: Bundle size increased but intentionally

**Solution**: Document why in PR description, team can approve override

### Type Check Failing Locally But Passing in CI

**Problem**: Different TypeScript versions

**Solution**: 
```bash
# Match CI version
npm ci  # Use exact versions from package-lock.json
npx tsc -b --noEmit
```

---

## 📈 Metrics & Reports

All workflows generate artifacts:
- **Build artifacts**: Compiled code (retained 7 days)
- **CSS reports**: JSON analysis (retained 30 days)

Download from workflow run page:
1. Go to Actions tab
2. Click on workflow run
3. Scroll to "Artifacts" section
4. Download

---

## 🔐 Security Note

Workflows run with limited permissions:
- Can read code
- Can post comments
- Cannot push code or modify repo settings

PR workflows from forks have even more restrictions for security.

---

## 🎯 Best Practices

1. **Fix CI failures before merging**
   - Don't merge red PRs
   - Address root cause, don't just increase thresholds

2. **Review CSS analysis warnings**
   - High waste often indicates dead code
   - Remove unused files rather than selectors

3. **Keep bundle size in check**
   - Add dependencies intentionally
   - Use dynamic imports for large features
   - Check bundle before merging

4. **Local checks first**
   - Run `npm run lint` before pushing
   - Catches issues faster than waiting for CI

---

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [PurgeCSS Documentation](https://purgecss.com/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
