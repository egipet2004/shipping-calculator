import { RateCalculatorForm } from '@/components/forms/RateCalculatorForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <RateCalculatorForm />
      </div>
    </main>
  );
}
