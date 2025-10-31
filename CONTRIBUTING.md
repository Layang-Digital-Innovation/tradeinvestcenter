# Contributing to Trade Invest Center

Terima kasih atas minat Anda untuk berkontribusi pada Trade Invest Center! Dokumen ini menjelaskan proses dan panduan untuk berkontribusi pada proyek ini.

## 🌿 Branching Strategy

Kami menggunakan **Git Flow** dengan tiga branch utama:

### Branch Structure

```
main (stable)
├── production (ready for deployment)
└── development (active development)
    ├── feature/feature-name
    ├── bugfix/bug-description
    └── hotfix/critical-fix
```

### Branch Descriptions

- **`main`**: Branch utama yang berisi kode stabil dan teruji
- **`development`**: Branch untuk pengembangan aktif, semua fitur baru di-merge ke sini
- **`production`**: Branch yang siap untuk deployment ke production environment

### Branch Naming Convention

- **Feature branches**: `feature/feature-name` (contoh: `feature/user-authentication`)
- **Bug fixes**: `bugfix/bug-description` (contoh: `bugfix/login-validation`)
- **Hotfixes**: `hotfix/critical-fix` (contoh: `hotfix/security-patch`)

## 🔄 Workflow Pengembangan

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd TradeInvestCenter

# Checkout ke development branch
git checkout development

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Membuat Feature Baru

```bash
# Pastikan Anda di development branch dan up-to-date
git checkout development
git pull origin development

# Buat feature branch baru
git checkout -b feature/nama-fitur-anda

# Lakukan development...
# Commit perubahan Anda
git add .
git commit -m "feat: add new feature description"

# Push feature branch
git push origin feature/nama-fitur-anda
```

### 3. Pull Request Process

1. **Buat Pull Request** dari feature branch ke `development`
2. **Pastikan semua tests pass** dan tidak ada conflict
3. **Request review** dari minimal 1 reviewer
4. **Address feedback** jika ada
5. **Merge** setelah approval

### 4. Release Process

```bash
# Merge development ke production untuk release
git checkout production
git merge development

# Tag release version
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin production --tags
```

## 📝 Commit Message Convention

Gunakan format **Conventional Commits**:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Perubahan formatting (tidak mengubah logic)
- `refactor`: Refactoring kode
- `test`: Menambah atau mengubah tests
- `chore`: Maintenance tasks

### Contoh:
```bash
feat(auth): add JWT token refresh mechanism
fix(subscription): resolve payment validation issue
docs(readme): update installation instructions
```

## 🧪 Testing Requirements

### Sebelum Submit PR:

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e
npm run lint

# Frontend tests
cd frontend
npm run build
npm run lint
```

### Test Coverage:
- **Unit tests**: Minimal 80% coverage
- **Integration tests**: Untuk API endpoints
- **E2E tests**: Untuk critical user flows

## 📋 Code Review Checklist

### Reviewer harus memastikan:
- [ ] Code mengikuti style guide proyek
- [ ] Tests telah ditambahkan untuk fitur baru
- [ ] Dokumentasi telah diupdate jika diperlukan
- [ ] Tidak ada hardcoded values atau secrets
- [ ] Performance impact telah dipertimbangkan
- [ ] Security implications telah dievaluasi

## 🚀 Deployment Process

### Development Environment
- **Trigger**: Push ke `development` branch
- **Auto-deploy**: Staging server
- **URL**: https://dev.tradeinvestcenter.com

### Production Environment
- **Trigger**: Push ke `production` branch
- **Manual approval**: Required
- **URL**: https://tradeinvestcenter.com

## 📁 Project Structure Guidelines

### Backend (NestJS)
```
src/
├── auth/           # Authentication module
├── users/          # User management
├── subscription/   # Subscription logic
├── common/         # Shared utilities
└── config/         # Configuration files
```

### Frontend (Next.js)
```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── services/      # API service functions
└── utils/         # Utility functions
```

## 🔧 Development Tools

### Required Tools:
- **Node.js**: v18+ 
- **PostgreSQL**: v14+
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Recommended Extensions:
- ESLint
- Prettier
- TypeScript Hero
- GitLens
- Thunder Client (API testing)

## 🐛 Bug Reports

Gunakan template berikut untuk bug reports:

```markdown
**Bug Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What you expected to happen

**Screenshots:**
If applicable, add screenshots

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. v1.0.0]
```

## 💡 Feature Requests

Gunakan template berikut untuk feature requests:

```markdown
**Feature Description:**
Clear description of the feature

**Problem Statement:**
What problem does this solve?

**Proposed Solution:**
How should this feature work?

**Alternatives Considered:**
Other solutions you've considered

**Additional Context:**
Any other context or screenshots
```

## 📞 Getting Help

- **Documentation**: Check README.md dan Wiki
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions untuk pertanyaan
- **Email**: development@tradeinvestcenter.com

## 📄 License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License yang sama dengan proyek ini.

---

**Terima kasih atas kontribusi Anda! 🙏**