# Contributing to Supernova

We love your input! We want to make contributing to Supernova as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Request Process

1. **Fork the repo** and create your branch from `main`.
2. **Follow the coding standards** outlined below.
3. **Add tests** if you've added code that should be tested.
4. **Update documentation** if you've changed APIs.
5. **Ensure the test suite passes**.
6. **Make sure your code lints**.
7. **Issue that pull request**!

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/yourusername/supernova-ai
cd supernova-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start development server
npm run dev
```

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Ensure proper type definitions
- No `any` types without justification

### Code Style
```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ Avoid
const fetchProfile = (id: any) => {
  // Implementation
};
```

### Component Structure
```typescript
// ✅ Good component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div className="component-class">
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### API Routes
- Use proper HTTP status codes
- Implement error handling
- Validate input data
- Add rate limiting where appropriate

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for utilities and helpers
- Write integration tests for API routes
- Write component tests for UI components

```typescript
// Example test structure
describe('ContentGenerator', () => {
  it('should generate personalized content', async () => {
    const result = await generateContent({
      idea: 'test idea',
      profile: mockProfile
    });
    
    expect(result).toHaveProperty('aRollScript');
    expect(result).toHaveProperty('bRollScript');
  });
});
```

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/kevinvalencia/supernova-ai/issues).

### Great Bug Reports Include:

- **Summary**: Quick summary and/or background
- **Steps to reproduce**: Be specific!
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, Node.js version, etc.
- **Additional context**: Screenshots, logs, etc.

**Bug Report Template:**
```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 119]
- Node.js: [e.g. 18.17.0]
- Version: [e.g. 1.0.0]
```

## 💡 Feature Requests

We use GitHub issues to track feature requests. Suggest a feature by [opening a new issue](https://github.com/kevinvalencia/supernova-ai/issues).

### Great Feature Requests Include:

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should we solve this?
- **Alternatives considered**: What other approaches did you consider?
- **Use cases**: Who would use this feature and how?

## 📦 Release Process

### Versioning
We use [Semantic Versioning](http://semver.org/). Version numbers follow the pattern:
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Notes
- Document all user-facing changes
- Include migration guides for breaking changes
- Credit contributors

## 🏆 Recognition

Contributors who make significant improvements will be:
- Added to the Contributors section in README
- Mentioned in release notes
- Invited to join the core team (for exceptional contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
Examples of behavior that contributes to creating a positive environment include:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement
Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## 📞 Questions?

Don't hesitate to reach out if you have questions:
- Open an [issue](https://github.com/kevinvalencia/supernova-ai/issues)
- Email: kevin@supernova-ai.com
- LinkedIn: [linkedin.com/in/kevinvalencia](https://linkedin.com/in/kevinvalencia)

---

Thank you for contributing to Supernova! 🚀 