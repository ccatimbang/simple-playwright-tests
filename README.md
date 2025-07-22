# Test Automation Project

A comprehensive test automation solution featuring a React TypeScript frontend and Node.js backend with full test coverage and modern CI/CD practices.

## 🚀 Quick Setup (1-2 minutes)

### Prerequisites
- **Node.js 18+** and **npm** (or yarn)

### ⚡ One-Command Setup (Recommended)
```bash
# Clone and setup everything in one go
git clone <repository-url>
cd remtest
npm run setup
```

### 🔧 Manual Setup (Alternative)
```bash
# 1. Install dependencies
npm run install:all

# 2. Setup Playwright browsers
cd client && npx playwright install --with-deps

# 3. Start both servers
npm run dev
```

### 🎯 What You Get
- **Frontend**: React app running on http://localhost:3000
- **Backend**: API server running on http://localhost:3001
- **Tests**: Ready to run with full coverage
- **Login**: Use `admin` / `password`

## 🧪 Testing

### Test Coverage
- **API Tests**: 85.36% coverage, 23/23 tests passing ✅
- **UI Tests**: 18/18 E2E tests passing ✅
- **Total**: 41 tests with comprehensive coverage

### Quick Test Commands
```bash
# Run all tests
npm run test:all

# Individual test suites
npm run test:api      # API tests only
npm run test:client   # UI tests only

# Code quality
npm run lint
```

## 📁 Project Structure
```
├── api/                 # Node.js Express backend
│   ├── src/            # Source code
│   ├── tests/          # API tests (Jest + Supertest)
│   └── coverage/       # Test coverage reports
├── client/             # React TypeScript frontend
│   ├── src/            # Source code
│   └── tests/          # UI tests (Playwright)
└── .github/            # CI/CD workflows
```

## 🔄 CI/CD Pipeline

### Main CI Workflow (`ci.yml`)
- **Triggers**: Pull requests and pushes to main/master
- **Purpose**: Full CI pipeline with linting, testing, and building
- **Steps**:
  1. Lint code with ESLint
  2. Run API tests with Jest
  3. Build React client
  4. Run E2E tests with Playwright

### Comprehensive Test Workflow (`test.yml`)
- **Triggers**: Push to main/develop, pull requests
- **Features**:
  - Parallel API and UI testing
  - Coverage reporting with Codecov
  - Test artifact uploads with proper path configuration
  - Screenshot capture on failures
  - Health check endpoints for reliable server startup
  - Integration tests with separate artifact collection

### Code Quality Workflows
- **Lint Workflow**: ESLint checks on both API and client
- **Auto-Fix Workflow**: Automated code formatting and commits

## 🛠️ Application Features

### Authentication System
- JWT-based authentication with bcrypt password hashing
- Session persistence using localStorage
- Default credentials: `admin` / `password`
- Comprehensive error handling and validation

### Todo Management
- **CRUD Operations**: Create, Read, Update, Delete todos
- **Fields**: Title (required), description (optional), completion status
- **Features**: Edit in-place, bulk operations, creation timestamps
- **User Isolation**: Todos are user-specific and secure

### Technical Stack
- **Frontend**: React 18, TypeScript, CSS
- **Backend**: Node.js, Express, JWT, bcrypt, UUID
- **Testing**: Playwright, Jest, Supertest
- **Quality**: ESLint, TypeScript compiler
- **CI/CD**: GitHub Actions, npm scripts

## 📊 Test Coverage Details

### API Coverage (85.36%)
- **Authentication**: Login, logout, token validation
- **Todo CRUD**: All endpoints with error scenarios
- **Security**: JWT middleware, user isolation
- **Error Handling**: Invalid requests, unauthorized access

### UI Coverage (18/18 tests)
- **Authentication**: Login/logout workflows
- **Todo Management**: Full CRUD operations
- **User Experience**: Form validation, state management
- **Edge Cases**: Empty states, error handling

## 🚨 Known Issues & Limitations

### Current Issues
- **Flaky Tests**: Todo editing cancel test occasionally times out
- **Data Persistence**: In-memory storage (resets on server restart)
- **Single User**: Designed for single-user scenarios

### Limitations
- No real database integration
- No concurrent user support
- No offline functionality
- No file upload capabilities

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start both servers
npm run start:api        # Start backend only
npm run start:client     # Start frontend only

# Testing
npm run test:api         # API tests only
npm run test:client      # UI tests only
npm run test:all         # All tests
npm run test:ci          # CI-optimized tests

# Code Quality
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run build            # Build production client

# Setup
npm run setup            # Full project setup
npm run install:all      # Install all dependencies
```

## 📈 Performance Metrics

- **Test Execution**: ~30 seconds for full suite
- **API Response Time**: <100ms average
- **UI Load Time**: <2 seconds
- **Coverage**: >85% API, comprehensive UI testing

## 🎯 Future Enhancements

- [ ] Fix flaky tests when running in parallel
- [ ] Add real database integration
- [ ] Implement concurrent user support
- [ ] Add performance testing

- [ ] Add accessibility testing
- [ ] Implement real-time features

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Ensure linting passes: `npm run lint`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
