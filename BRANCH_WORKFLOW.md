# Git Branch Workflow

## Current Setup

✅ **Development Branch Created**: You're now on the `development` branch
✅ **Experimental Directories**: Set up for safe testing
✅ **Main Branch Protected**: Stable version preserved

## Branch Commands

**Switch to development branch:**
```bash
git checkout development
```

**Switch back to main:**
```bash
git checkout main
```

**Commit experimental changes:**
```bash
git add .
git commit -m "Experiment: [description]"
```

**Push development branch to GitHub:**
```bash
git push -u origin development
```

## Experimental Workspace

- `client/src/components/experimental/` - New UI components
- `client/src/pages/experimental/` - Test page layouts  
- `server/experimental/` - Backend experiments

## Example: Testing the Experimental Dashboard

Add to your main App.tsx routes:
```tsx
import { ExperimentalDashboard } from '@/components/experimental/ExperimentalDashboard';

// Add route: <Route path="/experimental" component={ExperimentalDashboard} />
```

Access at: `http://localhost:5000/experimental`

## Merging Successful Experiments

When ready to promote features to main:
```bash
git checkout main
git merge development
git push origin main
```

Your development environment is ready for safe experimentation!