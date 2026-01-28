# Universal Shipping Rate Calculator

>shipping rate calculation engine built with Next.js, TypeScript, and enterprise Design Patterns.

## 📋 Project Overview

This application serves the logistics industry by solving the problem of fragmented carrier APIs. It provides a unified interface to fetch, normalize, and compare shipping rates from FedEx in real-time.

The project demonstrates professional software engineering practices, specifically the implementation of **GoF Design Patterns** to create a scalable and maintainable architecture.

### 🎯 Features List
* **Multi-step Form**: Complex wizard with robust Zod validation and state persistence.
* **Parallel Rate Fetching**: Concurrent API execution using `Promise.allSettled` for fault tolerance.
* **Smart Recommendations**: Automatic "Best Value" and "Fastest" rate highlighting.
* **Responsive Design**: Mobile-first UI built with Tailwind CSS.
* **Persistence**: LocalStorage integration to restore user sessions.
* **Type-Safe Implementation**: Strict TypeScript with no `any` types in domain logic.
* **Test Coverage**: **[INSERT OVERALL %]** code coverage.

## 🏗 Architecture

This project strictly implements four core Design Patterns to ensure modularity:
1.  **Adapter Pattern**: Used to standardize disparate Carrier APIs (FedEx, UPS) into a unified `ShippingRate` interface.
2.  **Factory Function**: Centralizes the logic for instantiating the correct Carrier Adapter based on user selection.
3.  **Decorator Pattern**: Dynamically stacks additional fees (Insurance, Signature, Fragile Handling) onto base rates without modifying the core rate logic.
4.  **Singleton Pattern**: Manages application-wide configuration and secure credential loading.

👉 *See it in [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed pattern documentation and diagrams.*

### 🛠 Tech Stack
* **Frontend**: Next.js 14 (App Router), React
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS, Lucide Icons
* **Testing**: Vitest (Unit/Integration), Playwright (E2E)
* **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
* Node.js 18.17 or later
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/egipet2004/rate-calculator.git](https://github.com/egipet2004/rate-calculator.git)
    cd rate-calculator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    # Carrier Credentials
    FEDEX_API_KEY=your_fedex_key
    FEDEX_API_SECRET=your_fedex_secret
    FEDEX_API_NUMBER=your_account_number
    FEDEX_API_URL=[https://apis-sandbox.fedex.com](https://apis-sandbox.fedex.com)

    # Application Config
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    # Set to 'true' to use mock data instead of real APIs
    USE_MOCK_DATA=false
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

### Testing Commands

To verify system integrity and coverage:

```bash
# Run Unit and Integration Tests
npm run test

# Generate Coverage Report
npm run test:coverage

# Run End-to-End Tests
npm run test:e2e



### 🧠 Learning Outcomes

By developing this project, the following technical skills were demonstrated:
* Translating complex business requirements into a decoupled architecture.
* Implementing **Adapter**, **Decorator**, and **Factory** patterns in a real-world scenario.
* Managing complex state in multi-step forms using React Server Actions.
* Ensuring data integrity with server-side Zod validation schemas.
* Writing testable code and achieving high coverage with Vitest and Playwright.

### 📊 Test Coverage Stats

* **Overall**: `[INSERT 73%]`
* **Services**: `[INSERT 92%]`
* **Pattern Implementations**: `[INSERT 79%]`
* **OConfiguration**: `[INSERT 100%]`

### 📄 License and Author

**Author**: **[egipet2004]**
* [GitHub Profile](https://github.com/egipet2004)