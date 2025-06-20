# Development Workflow

## Branch Strategy

### Main Branch
- **Purpose**: Stable, production-ready code
- **Protection**: No direct commits - only merge from development
- **Deployment**: Connected to production deployment

### Development Branch
- **Purpose**: Active development and experimentation
- **Features**: New features, bug fixes, improvements
- **Testing**: All experimental changes happen here first

## Development Setup

To create and work on a development branch:

```bash
# Create and switch to development branch
git checkout -b development

# Or switch to existing development branch
git checkout development

# Make your experimental changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Experiment: [description of changes]"

# Push development branch
git push -u origin development
```

## Merging Workflow

When ready to merge experimental features to main:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge development branch
git merge development

# Push updated main
git push origin main
```

## Current Development Ideas

- [ ] Enhanced visualization components
- [ ] Additional policy scenarios
- [ ] Improved user interface elements
- [ ] Performance optimizations
- [ ] New calculation methodologies
- [ ] Extended data sources integration

## File Organization for Experiments

Create experimental components in:
- `client/src/components/experimental/`
- `client/src/pages/experimental/`
- `server/experimental/`

This keeps experimental code organized and easy to clean up.