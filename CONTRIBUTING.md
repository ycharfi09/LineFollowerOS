# Contributing to LineFollowerOS

Thank you for your interest in contributing to LineFollowerOS! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, platform)

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue describing:
   - The problem it solves
   - Proposed solution
   - Alternative approaches considered
   - Examples of usage

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 14+
- Python 3.8+
- Git

### Setup Steps
```bash
git clone https://github.com/ycharfi09/LineFollowerOS.git
cd LineFollowerOS
npm run install:all
```

## Project Structure

```
LineFollowerOS/
├── frontend/     # React + TypeScript UI
├── backend/      # Python FastAPI server
├── firmware/     # C++ templates
└── examples/     # Example configurations
```

## Coding Standards

### Frontend (TypeScript/React)
- Use TypeScript strict mode
- Follow React hooks best practices
- Use functional components
- Write meaningful component names
- Add PropTypes or TypeScript interfaces

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions/classes
- Keep functions focused and small
- Use Pydantic models for validation

### Firmware (C++)
- Follow Arduino style guide
- Comment complex algorithms
- Keep memory usage low
- Test on actual hardware when possible

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add track validation algorithm`
- `fix: Resolve PID calculation overflow`
- `docs: Update installation instructions`
- `refactor: Simplify firmware generation logic`
- `test: Add tests for robot validation`

## Review Process

1. Maintainers review PRs within 1-2 weeks
2. Address feedback and comments
3. Once approved, maintainers will merge
4. Your contribution will be in the next release!

## Areas for Contribution

### High Priority
- Additional track element types
- Mobile-responsive UI
- More PID tuning algorithms
- Support for additional platforms (ESP32, etc.)
- Test coverage improvements

### Features
- Track import/export
- Robot configuration presets
- Simulation mode
- Real-time debugging interface
- Multi-language support

### Documentation
- Video tutorials
- API examples
- Hardware setup guides
- Troubleshooting guides

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- README.md Contributors section
- Release notes
- Project documentation

Thank you for making LineFollowerOS better! 🚀
