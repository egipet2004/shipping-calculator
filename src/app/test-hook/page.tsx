
/*
"use client";

import React from 'react';
import { usePackageForm } from '@/hooks/usePackageForm';
import { useAddressValidation } from '@/hooks/useAddressValidation';
import { useDimensionalWeight } from '@/hooks/useDimensionalWeight';

export default function TestAllHooksPage() {
  // 1. Главный менеджер формы
  const { formData, updateSection } = usePackageForm();
  
  // 2. Валидатор адресов
  const { validateField, getFieldError } = useAddressValidation();
  
  // 3. Калькулятор веса (следит за размерами из formData)
  const dimWeight = useDimensionalWeight(formData.package.dimensions);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', fontFamily: 'sans-serif' }}>
      <h1>🧪 Лаборатория Хуков (All-in-One)</h1>

      
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>📍 Адрес (Step 1 & 2 Logic)</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>City: </label>
          <input 
            value={formData.origin.city}
            onChange={(e) => {
              // Обновляем данные (Хук 1)
              updateSection('origin', { ...formData.origin, city: e.target.value });
              // Проверяем ошибки (Хук 2)
              validateField('city', e.target.value);
            }}
            style={{ border: getFieldError('city') ? '2px solid red' : '1px solid black' }}
          />
          <div style={{ color: 'red', fontSize: '12px' }}>{getFieldError('city')}</div>
        </div>
      </section>

     
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #0070f3' }}>
        <h3>📦 Груз (Step 3 Logic)</h3>
        <p>Введите размеры, чтобы увидеть работу <b>useDimensionalWeight</b>:</p>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['length', 'width', 'height'].map((dim) => (
            <div key={dim}>
              <label>{dim}: </label>
              <input 
                type="number"
                value={formData.package.dimensions[dim as 'length' | 'width' | 'height'] || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  // Обновляем размеры в Хуке 1
                  updateSection('package', { 
                    ...formData.package, 
                    dimensions: { ...formData.package.dimensions, [dim]: val } 
                  });
                }}
                style={{ width: '60px' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', padding: '10px', background: '#eef' }}>
          <strong>Calculated Dim Weight: </strong> 
          <span style={{ fontSize: '20px', color: '#0070f3' }}>{dimWeight} lbs</span>
        </div>
      </section>

      {
      <section style={{ padding: '20px', background: '#333', color: '#fff' }}>
        <h3>💾 Итоговые данные в памяти (Hook 1):</h3>
        <pre style={{ fontSize: '10px' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </section>
    </div>
  );
}

import { usePackageForm } from "@/hooks/usePackageForm";

*/
import { RateCalculatorForm } from '@/components/forms/RateCalculatorForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <RateCalculatorForm />
      </div>
    </main>
  );
}