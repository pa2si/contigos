'use client';

// useMemo hinzugefügt
import { useState, useEffect, useMemo } from 'react';
import { Settings, Expense } from '@/types'; // Annahme, dass diese Typen existieren

// Bessere Typdefinition für Settings
type AppSettings = {
  id: number;
  p1_einkommen: number;
  p2_einkommen: number;
  restgeld_vormonat: number;
  comida_betrag: number;
  ahorros_betrag: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function HomePage() {
  const [settings, setSettings] = useState<AppSettings>({
    // Standardwerte als Zahlen
    id: 1,
    p1_einkommen: 3000,
    p2_einkommen: 2500,
    restgeld_vormonat: 0,
    comida_betrag: 0,
    ahorros_betrag: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Expense form state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    beschreibung: '',
    betrag: '',
    bezahlt_von: 'Partner1' as 'Partner1' | 'Partner2' | 'Gemeinschaftskonto',
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsRes, expensesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/expenses'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        // Sicherstellen, dass alle Werte Zahlen sind
        setSettings({
          ...data,
          p1_einkommen: Number(data.p1_einkommen) || 0,
          p2_einkommen: Number(data.p2_einkommen) || 0,
          restgeld_vormonat: Number(data.restgeld_vormonat) || 0,
          comida_betrag: Number(data.comida_betrag) || 0,
          ahorros_betrag: Number(data.ahorros_betrag) || 0,
        });
      }

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      // Sicherstellen, dass nur Zahlen gespeichert werden
      const dataToSave = {
        p1_einkommen: Number(settings.p1_einkommen) || 0,
        p2_einkommen: Number(settings.p2_einkommen) || 0,
        restgeld_vormonat: Number(settings.restgeld_vormonat) || 0,
        comida_betrag: Number(settings.comida_betrag) || 0,
        ahorros_betrag: Number(settings.ahorros_betrag) || 0,
      };

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // --- Alle Expense-Handler (Hinzufügen, Bearbeiten, Speichern, Löschen) ---
  // --- Diese Logik war in Ordnung und bleibt unverändert. ---

  const resetExpenseForm = () => {
    setExpenseForm({ beschreibung: '', betrag: '', bezahlt_von: 'Partner1' });
    setEditingExpense(null);
    setShowAddExpense(false); // Form nach Reset ausblenden
  };

  const handleAddExpense = () => {
    resetExpenseForm();
    setShowAddExpense(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseForm({
      beschreibung: expense.beschreibung,
      betrag: expense.betrag.toString(),
      bezahlt_von: expense.bezahlt_von,
    });
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleSaveExpense = async () => {
    if (!expenseForm.beschreibung.trim() || !expenseForm.betrag) return;

    try {
      const expenseData = {
        beschreibung: expenseForm.beschreibung.trim(),
        betrag: parseFloat(expenseForm.betrag),
        bezahlt_von: expenseForm.bezahlt_von,
      };

      if (editingExpense) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });

        if (response.ok) {
          const updatedExpense = await response.json();
          setExpenses(
            expenses.map((exp) =>
              exp.id === editingExpense.id ? updatedExpense : exp
            )
          );
        }
      } else {
        // Create new expense
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });

        if (response.ok) {
          const newExpense = await response.json();
          setExpenses([...expenses, newExpense]);
        }
      }
      resetExpenseForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    // Die 'confirm'-Box ist nicht ideal (blockiert den Thread),
    // aber wir behalten sie bei, da sie nicht der Kern des Problems ist.
    if (!confirm('Möchten Sie diese Ausgabe wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(expenses.filter((exp) => exp.id !== expenseId));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Helper function to display payer names
  const getPayerDisplayName = (
    payer: 'Partner1' | 'Partner2' | 'Gemeinschaftskonto'
  ) => {
    switch (payer) {
      case 'Partner1':
        return 'Pascal';
      case 'Partner2':
        return 'Caro';
      case 'Gemeinschaftskonto':
        return 'Gemeinschaftskonto';
      default:
        return payer;
    }
  };

  // =======================================================================
  // === KORRIGIERTE BERECHNUNGSLOGIK START ===
  // =======================================================================
  // Wir verwenden useMemo, damit die Berechnung nur neu ausgeführt wird,
  // wenn sich 'settings' oder 'expenses' ändern.
  const results = useMemo(() => {
    // Schritt 0: Basiswerte sicher als Zahlen abrufen
    const p1_einkommen = Number(settings.p1_einkommen) || 0;
    const p2_einkommen = Number(settings.p2_einkommen) || 0;
    const restgeld_vormonat = Number(settings.restgeld_vormonat) || 0;

    // Fixe Kosten aus Settings (als Gemeinschaftskonto-Ausgaben behandelt)
    const comida_betrag = Number(settings.comida_betrag) || 0;
    const ahorros_betrag = Number(settings.ahorros_betrag) || 0;

    // Schritt 1: Gesamteinkommen
    const gesamteinkommen = p1_einkommen + p2_einkommen;
    if (gesamteinkommen === 0) {
      // Notfall-Rückgabe, um Division durch Null zu verhindern
      return {
        p1_anteil_prozent: 0,
        p2_anteil_prozent: 0,
        gesamteinkommen: 0,
        p1_direktzahlungen: 0,
        p2_direktzahlungen: 0,
        gesamtkosten: 0,
        p1_gesamtanteil_kosten: 0,
        p2_gesamtanteil_kosten: 0,
        finale_überweisung_p1: 0,
        finale_überweisung_p2: 0,
        bedarf_gk: 0,
        kontrolle_einzahlungNötig: 0,
        kontrolle_summeÜberweisungen: 0,
        verbleibt_p1: p1_einkommen,
        verbleibt_p2: p2_einkommen,
      };
    }

    // Schritt 2 & 3: Anteile berechnen (als Ratio 0.0 - 1.0)
    const p1_anteil_ratio = p1_einkommen / gesamteinkommen;
    const p2_anteil_ratio = p2_einkommen / gesamteinkommen;

    // Schritt 4: Gesamtkosten
    // Summe aller dynamischen Ausgaben
    const sum_dyn_expenses = expenses.reduce(
      (sum, exp) => sum + (Number(exp.betrag) || 0),
      0
    );
    // Gesamtkosten = fixe Kosten + dynamische Kosten
    const gesamtkosten = comida_betrag + ahorros_betrag + sum_dyn_expenses;

    // Schritt 5 & 6: Gesamtanteil an Kosten
    const p1_gesamtanteil_kosten = gesamtkosten * p1_anteil_ratio;
    const p2_gesamtanteil_kosten = gesamtkosten * p2_anteil_ratio;

    // Schritt 7 & 8: Direktzahlungen (nur aus der dynamischen Liste)
    const p1_direktzahlungen = expenses
      .filter((exp) => exp.bezahlt_von === 'Partner1')
      .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);
    const p2_direktzahlungen = expenses
      .filter((exp) => exp.bezahlt_von === 'Partner2')
      .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);

    // Schritt 9: Bedarf Gemeinschaftskonto (GK)
    const gk_dyn_expenses = expenses
      .filter((exp) => exp.bezahlt_von === 'Gemeinschaftskonto')
      .reduce((sum, exp) => sum + (Number(exp.betrag) || 0), 0);
    // Bedarf GK = fixe GK-Kosten (Comida, Ahorros) + dynamische GK-Kosten
    const bedarf_gk = comida_betrag + ahorros_betrag + gk_dyn_expenses;

    // Schritt 10 & 11: Anteil am Restgeld
    const p1_anteil_restgeld = restgeld_vormonat * p1_anteil_ratio;
    const p2_anteil_restgeld = restgeld_vormonat * p2_anteil_ratio;

    // Schritt 12 & 13: Finale Überweisungen
    // (Anteil an Gesamtkosten) - (bereits bezahlt) - (Anteil am Restguthaben)
    const finale_überweisung_p1 =
      p1_gesamtanteil_kosten - p1_direktzahlungen - p1_anteil_restgeld;
    const finale_überweisung_p2 =
      p2_gesamtanteil_kosten - p2_direktzahlungen - p2_anteil_restgeld;

    // Schritt 14 & 15: Verbleibt zur freien Verfügung
    // KORRIGIERT: Berechnet, was nach ECHTEN Zahlungen (Direkt + Überweisung) übrig bleibt
    const verbleibt_p1 =
      p1_einkommen - p1_direktzahlungen - finale_überweisung_p1;
    const verbleibt_p2 =
      p2_einkommen - p2_direktzahlungen - finale_überweisung_p2;

    // Schritt 16 & 17: Kontrolle
    const kontrolle_einzahlungNötig = bedarf_gk - restgeld_vormonat;
    const kontrolle_summeÜberweisungen =
      finale_überweisung_p1 + finale_überweisung_p2;

    return {
      p1_anteil_prozent: p1_anteil_ratio * 100, // Für Anzeige als %
      p2_anteil_prozent: p2_anteil_ratio * 100, // Für Anzeige als %
      gesamteinkommen,
      p1_direktzahlungen,
      p2_direktzahlungen,
      gesamtkosten,
      p1_gesamtanteil_kosten,
      p2_gesamtanteil_kosten,
      finale_überweisung_p1,
      finale_überweisung_p2,
      bedarf_gk,
      kontrolle_einzahlungNötig,
      kontrolle_summeÜberweisungen,
      verbleibt_p1,
      verbleibt_p2,
    };
  }, [settings, expenses]); // <-- Abhängigkeiten für useMemo
  // =======================================================================
  // === KORRIGIERTE BERECHNUNGSLOGIK ENDE ===
  // =======================================================================

  // Die alte Zuweisung wird nicht mehr benötigt:
  // const results = calculateResults();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-xl'>Loading Contigos...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Contigos</h1>
          <p className='text-gray-600'>
            Calculacion de gastos compartidos mensuales
          </p>
        </div>

        {/* Settings Section */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='mb-4'>
            <h2 className='text-2xl font-semibold'>Einstellungen</h2>
            <div className='mt-2 text-lg font-medium text-blue-700'>
              Gemeinsames Einkommen:{' '}
              <span className='font-bold'>
                {/* Korrekte Summierung beider Einkommen */}
                {(
                  Number(settings.p1_einkommen || 0) +
                  Number(settings.p2_einkommen || 0)
                ).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Pascal Einkommen (€)
              </label>
              <input
                type='number'
                value={settings.p1_einkommen}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    p1_einkommen: Number(e.target.value),
                  });
                }}
                onBlur={saveSettings}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Caro Einkommen (€)
              </label>
              <input
                type='number'
                value={settings.p2_einkommen}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    p2_einkommen: Number(e.target.value),
                  });
                }}
                onBlur={saveSettings}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Rest vom Vormonat (€)
              </label>
              <input
                type='number'
                value={settings.restgeld_vormonat}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    restgeld_vormonat: Number(e.target.value),
                  });
                }}
                onBlur={saveSettings}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            {/* HINWEIS: Es ist sauberer, Comida und Ahorros als normale 'Expenses' 
                mit 'Gemeinschaftskonto' als Zahler zu behandeln. 
                Die Logik unterstützt jetzt aber diese Trennung. */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Comida (Lebensmittel, €)
              </label>
              <input
                type='number'
                value={settings.comida_betrag}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    comida_betrag: Number(e.target.value),
                  });
                }}
                onBlur={saveSettings}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ahorros (Sparen, €)
              </label>
              <input
                type='number'
                value={settings.ahorros_betrag}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    ahorros_betrag: Number(e.target.value),
                  });
                }}
                onBlur={saveSettings}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* KARTE 1: AKTION (Hervorgehoben) */}
        <div className='bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            🏦 AKTION - Überweisungen auf Gemeinschaftskonto
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
              <h3 className='font-semibold text-lg mb-2'>
                Pascal überweist auf GK:
              </h3>
              <div className='text-4xl font-bold mb-1'>
                {/* Korrekte Variable aus results verwenden */}
                {results.finale_überweisung_p1.toFixed(2)} €
              </div>
              <div className='text-sm opacity-90'>
                {/* Korrekte Variable aus results verwenden */}(
                {results.p1_anteil_prozent.toFixed(2)}% Anteil)
              </div>
            </div>
            <div className='text-center p-4 bg-white/20 rounded-lg backdrop-blur'>
              <h3 className='font-semibold text-lg mb-2'>
                Caro überweist auf GK:
              </h3>
              <div className='text-4xl font-bold mb-1'>
                {/* Korrekte Variable aus results verwenden */}
                {results.finale_überweisung_p2.toFixed(2)} €
              </div>
              <div className='text-sm opacity-90'>
                {/* Korrekte Variable aus results verwenden */}(
                {results.p2_anteil_prozent.toFixed(2)}% Anteil)
              </div>
            </div>
          </div>
        </div>

        {/* KARTE 2: KONTROLLE GK */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            📊 KONTROLLE GEMEINSCHAFTSKONTO
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='font-medium'>Bedarf Gemeinschaftskonto:</span>
              <span className='font-bold text-lg'>
                {/* Korrekte Variable aus results verwenden */}
                {results.bedarf_gk.toFixed(2)} €
              </span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-gray-200'>
              <span className='font-medium'>- Restgeld Vormonat:</span>
              <span className='font-bold text-lg'>
                {(Number(settings.restgeld_vormonat) || 0).toFixed(2)} €
              </span>
            </div>
            <div className='flex justify-between items-center py-2 bg-yellow-50 px-4 rounded border-l-4 border-yellow-400'>
              <span className='font-semibold'>
                = Benötigte neue Einzahlung:
              </span>
              <span className='font-bold text-xl text-yellow-700'>
                {/* Korrekte Variable aus results verwenden */}
                {results.kontrolle_einzahlungNötig.toFixed(2)} €
              </span>
            </div>
            <div
              // Farbliche Warnung, wenn die Summe nicht stimmt
              className={`flex justify-between items-center py-2 px-4 rounded border-l-4 
                ${
                  Math.abs(
                    results.kontrolle_einzahlungNötig -
                      results.kontrolle_summeÜberweisungen
                  ) < 0.01
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
            >
              <span className='font-semibold'>Summe der Überweisungen:</span>
              <span
                className={`font-bold text-xl 
                  ${
                    Math.abs(
                      results.kontrolle_einzahlungNötig -
                        results.kontrolle_summeÜberweisungen
                    ) < 0.01
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
              >
                {/* Korrekte Variable aus results verwenden */}
                {results.kontrolle_summeÜberweisungen.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* KARTE 3: ZUSAMMENFASSUNG */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            💰 ZUSAMMENFASSUNG - Freie Verfügung
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200'>
              <h3 className='font-semibold text-lg mb-2 text-blue-800'>
                Verbleibt Pascal:
              </h3>
              <div className='text-4xl font-bold text-blue-600 mb-2'>
                {/* Korrekte Variable aus results verwenden */}
                {results.verbleibt_p1.toFixed(2)} €
              </div>
              <div className='text-sm text-blue-600'>zur freien Verfügung</div>
            </div>
            <div className='text-center p-6 bg-green-50 rounded-lg border-2 border-green-200'>
              <h3 className='font-semibold text-lg mb-2 text-green-800'>
                Verbleibt Caro:
              </h3>
              <div className='text-4xl font-bold text-green-600 mb-2'>
                {/* Korrekte Variable aus results verwenden */}
                {results.verbleibt_p2.toFixed(2)} €
              </div>
              <div className='text-sm text-green-600'>zur freien Verfügung</div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold'>Ausgaben</h2>
            <button
              onClick={handleAddExpense}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
            >
              Ausgabe hinzufügen
            </button>
          </div>

          {/* Fixed Comida and Ahorros display */}
          <div className='mb-4'>
            {/* Comida fixed expense row */}
            <div className='flex items-center justify-between py-2 pl-4 border-b border-gray-200 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
              <div className='flex-1'>
                <span className='font-medium'>Comida (Lebensmittel)</span>
                <span className='ml-2 text-gray-500'>
                  (fix aus Einstellungen)
                </span>
              </div>
              <span className='font-bold text-lg mr-4'>
                {(Number(settings.comida_betrag) || 0).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              {/* Leere Buttons für gleiches Layout */}
              <div className='flex gap-2 invisible'>
                <button className='px-2 py-1 text-xs'>Bearbeiten</button>
                <button className='px-2 py-1 text-xs'>Löschen</button>
              </div>
            </div>
            {/* Ahorros fixed expense row */}
            <div className='flex items-center justify-between py-2 pl-4 border-b border-gray-200 rounded-lg shadow-sm bg-white mb-2 border border-gray-300'>
              <div className='flex-1'>
                <span className='font-medium'>Ahorros (Sparen)</span>
                <span className='ml-2 text-gray-500'>
                  (fix aus Einstellungen)
                </span>
              </div>
              <span className='font-bold text-lg mr-4'>
                {(Number(settings.ahorros_betrag) || 0).toLocaleString(
                  'de-DE',
                  {
                    style: 'currency',
                    currency: 'EUR',
                  }
                )}
              </span>
              <div className='flex gap-2 invisible'>
                <button className='px-2 py-1 text-xs'>Bearbeiten</button>
                <button className='px-2 py-1 text-xs'>Löschen</button>
              </div>
            </div>
          </div>

          {/* Add/Edit Expense Form */}
          {showAddExpense && (
            <div className='mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50'>
              <h3 className='text-lg font-semibold mb-4'>
                {editingExpense
                  ? 'Ausgabe bearbeiten'
                  : 'Neue Ausgabe hinzufügen'}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Beschreibung
                  </label>
                  <input
                    type='text'
                    value={expenseForm.beschreibung}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        beschreibung: e.target.value,
                      })
                    }
                    placeholder='z.B. Einkauf, Miete, etc.'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Betrag (€)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={expenseForm.betrag}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        betrag: e.target.value,
                      })
                    }
                    placeholder='0.00'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Bezahlt von
                  </label>
                  <select
                    value={expenseForm.bezahlt_von}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        bezahlt_von: e.target.value as
                          | 'Partner1'
                          | 'Partner2'
                          | 'Gemeinschaftskonto',
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='Partner1'>Pascal</option>
                    <option value='Partner2'>Caro</option>
                    <option value='Gemeinschaftskonto'>
                      Gemeinschaftskonto
                    </option>
                  </select>
                </div>
              </div>
              <div className='flex gap-2 mt-4'>
                <button
                  onClick={handleSaveExpense}
                  disabled={
                    !expenseForm.beschreibung.trim() || !expenseForm.betrag
                  }
                  className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                >
                  {editingExpense ? 'Speichern' : 'Hinzufügen'}
                </button>
                <button
                  onClick={resetExpenseForm} // Korrigiert: resetExpenseForm statt nur setShowAddExpense(false)
                  className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Dynamische Ausgabenliste */}
          {expenses.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <p>Noch keine dynamischen Ausgaben erfasst.</p>
              <p className='text-sm'>Füge deine erste Ausgabe hinzu!</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className='flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50'
                >
                  <div className='flex-1'>
                    <span className='font-medium'>{expense.beschreibung}</span>
                    <span className='text-sm text-gray-500 ml-2'>
                      (bezahlt von {getPayerDisplayName(expense.bezahlt_von)})
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='font-semibold text-lg'>
                      {/* Sicherstellen, dass der Betrag eine Zahl ist */}
                      {(Number(expense.betrag) || 0).toFixed(2)} €
                    </span>
                    <div className='flex gap-1'>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
