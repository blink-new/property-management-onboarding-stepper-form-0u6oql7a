import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import OnboardingStepper from '@/components/OnboardingStepper'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <OnboardingStepper />
      <Toaster />
    </div>
  )
}

export default App