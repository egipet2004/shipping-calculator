src/
├── adapters/
│   ├── carrier-adapters/  # Concrete Adapter implementations (FedEx, UPS)
│   └── carrier-factory.ts # Factory function for adapter creation
├── app/                   # Next.js App Router (Pages & Server Actions)
├── components/
│   ├── forms/             # Multi-step form logic & reusable fields
│   └── results/           # Rate display, sorting, and filtering components
├── config/                # Singleton CarrierConfigManager
├── hooks/                 # Custom hooks (usePackageForm, useAddressValidation)
├── services/
│   ├── fee-decorators/    # Decorator pattern implementations
│   ├── rate-service.ts    # Main orchestration service
│   └── validators/        # Chain of Responsibility validators
└── types/                 # Domain interfaces (ShippingRate, Address, Package)


## Design Patterns

### 1. Adapter Pattern - API Integration

**Problem**: Each carrier API (FedEx, UPS, USPS) returns data in completely different formats (SOAP, XML, JSON) with different field names.

**Solution**: Create adapter classes that normalize external API responses into a consistent internal format.

**Implementation**:
- **Interface**: `CarrierAdapter` (located in `src/adapters/carrier-adapters/`)
- **Concrete Adapters**: `FedExAdapter`, `UPSAdapter`, `USPSAdapter`
- **Mechanism**: Each adapter implements the `fetchRates(request)` method and transforms the provider-specific response into a uniform `ShippingRate[]` array.

**Benefits**:
- Uniform interface regardless of carrier.
- Easy to add new carriers without breaking the service layer.
- Isolates external API changes (e.g., if FedEx changes their API, we only update `FedExAdapter`).

### 2. Simple Factory Function - Adapter Creation

**Problem**: The application needs a clean way to obtain the correct adapter instance based on the carrier name string selected by the user.

**Solution**: A simple factory function that maps carrier names to adapter instances.

**Implementation**:
- **Function**: `getCarrierAdapter(carrier: CarrierName): CarrierAdapter` (in `src/factories/carrier-factory.ts`)
- **Logic**: Switches on the carrier name and returns the appropriate adapter class. Handles logic for returning Mock adapters in test environments.

**Benefits**:
- Simple, no over-engineering.
- Single point of adapter access.
- Easy to test and mock dependencies.

### 3. Decorator Pattern - Fee Application

**Problem**: Need to dynamically add fees (insurance, signature, fragile handling) to a shipping rate without modifying the base rate class or creating an explosion of subclasses (e.g., `FedExWithInsuranceAndSignature`).

**Solution**: Wrap the base rate object in decorator classes that add fees dynamically.

**Implementation**:
- **Interface**: `RateComponent`
- **Base**: `BaseRate` (wraps the initial `ShippingRate`)
- **Decorators**: `InsuranceDecorator`, `SignatureDecorator`, `FragileHandlingDecorator`, `SaturdayDeliveryDecorator` (in `src/services/fee-decorators/`)
- **Logic**: Each decorator calls `super.getCost()` and adds its specific calculation.

**Benefits**:
- Fees stack in any combination at runtime.
- Base rate logic remains unchanged (Open/Closed Principle).
- Each fee logic is independently testable.

### 4. Singleton Pattern - Configuration

**Problem**: Configuration (API Keys, Endpoints, Timeouts) should be loaded once from environment variables and shared globally across the application to avoid IO overhead and inconsistency.

**Solution**: A Singleton class that loads and provides carrier credentials.

**Implementation**:
- **Class**: `CarrierConfigManager` (in `src/config/carrier-config.ts`)
- **Mechanism**: Private constructor ensures the class cannot be instantiated with `new`. Access is provided via the static `getInstance()` method.

**Benefits**:
- Single source of truth for configuration.
- Credentials loaded only once.
- Consistent access to config across all adapters.

## Data Flow

1.  **User submits form**: Data is captured in the UI and sent via Next.js Server Action.
2.  **Validation chain processes data**: Zod schemas and business rules (e.g., "PO Boxes not allowed for FedEx") validate the input.
3.  **RateService orchestrates parallel carrier calls**: The service uses `Promise.allSettled` to fetch rates from all selected carriers concurrently.
4.  **Adapters normalize API responses**: Raw JSON/XML from carriers is converted into the strict `ShippingRate` type.
5.  **Decorators apply additional fees**: If the user selected options (e.g., Insurance), decorators wrap the rates and recalculate totals.
6.  **Results sorted and displayed**: The final list is sorted by price/speed and returned to the UI.

## Type Safety

All types are strictly defined using TypeScript interfaces (`AddressInformation`, `Package`, `ShippingRate`). The project enforces `strict: true` in `tsconfig.json` and avoids `any` usage, ensuring compile-time safety across the entire data flow.

## Performance Optimizations

- **Parallel API Calls**: `Promise.allSettled` allows fetching rates from FedEx and UPS simultaneously, significantly reducing wait time.
- **Token Caching**: The `FedExAdapter` caches OAuth tokens to avoid re-authenticating on every request.
- **Server Actions**: Heavy logic resides on the server, reducing the client-side JavaScript bundle.
- **Streaming (Suspense)**: The UI can display a loading skeleton while the server processes the rates.