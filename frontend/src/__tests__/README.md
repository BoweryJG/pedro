# Booking System Test Suite

This directory contains the comprehensive test suite for the Pedro Martinez DMD booking system.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
__tests__/
├── services/              # Unit tests for service layer
│   └── AppointmentService.test.ts
├── components/            # Component tests
│   ├── BookAppointmentButton.test.tsx
│   └── EnhancedBookingForm.test.tsx
├── integration/           # Integration tests
│   └── BookingFlow.integration.test.tsx
├── performance/           # Performance tests
│   └── BookingPerformance.test.ts
├── utils/                 # Test utilities
│   └── testDataSetup.ts
├── setup/                 # Test configuration
│   └── testSetup.ts
└── __mocks__/            # Mock files
    └── fileMock.js
```

## Writing Tests

### Unit Tests
```typescript
describe('ServiceName', () => {
  it('should do something specific', async () => {
    // Arrange
    const input = createMockData();
    
    // Act
    const result = await serviceMethod(input);
    
    // Assert
    expect(result).toMatchExpectedOutput();
  });
});
```

### Component Tests
```typescript
it('should render and handle user interaction', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  
  expect(screen.getByText('Expected Result')).toBeInTheDocument();
});
```

### Integration Tests
```typescript
it('should complete full user flow', async () => {
  // Render app component
  // Simulate user journey
  // Verify final state
});
```

## Common Commands

- `npm test -- --watch AppointmentService` - Watch specific test file
- `npm test -- --coverage --collectCoverageFrom=src/services/**` - Coverage for specific directory
- `npm test -- --updateSnapshot` - Update snapshots
- `npm run test:ci` - Run tests in CI mode

## Debugging Tests

1. Use `screen.debug()` to see current DOM
2. Add `await waitFor(() => {})` for async operations
3. Check test logs for detailed error messages
4. Use `--runInBand` flag for serial execution

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
2. **Isolation**: Each test should be independent
3. **Mocking**: Mock external dependencies consistently
4. **Assertions**: Use specific assertions over generic ones
5. **Coverage**: Aim for >80% coverage on critical paths

## Troubleshooting

### Common Issues

1. **Async Errors**: Wrap async operations in `waitFor`
2. **Element Not Found**: Check if element is rendered conditionally
3. **Mock Not Working**: Ensure mocks are cleared between tests
4. **Timeout Errors**: Increase timeout for slow operations

### Getting Help

- Check the main testing guide: `/BOOKING_SYSTEM_TESTING.md`
- Review test examples in this directory
- Consult React Testing Library documentation

## Contributing

When adding new tests:
1. Follow existing patterns
2. Update test data factories if needed
3. Document any special setup required
4. Ensure tests pass locally before pushing