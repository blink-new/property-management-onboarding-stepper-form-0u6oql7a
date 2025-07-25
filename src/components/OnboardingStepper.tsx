import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import InquiryStage from './stages/InquiryStage'
import ShowingStage from './stages/ShowingStage'
import ApplicationStage from './stages/ApplicationStage'
import VerificationStage from './stages/VerificationStage'
import AgreementStage from './stages/AgreementStage'
import CompleteStage from './stages/CompleteStage'

export interface OnboardingData {
  // Stage 1: Inquiry
  selectedProperty: string
  fullName: string
  email: string
  phoneNumber: string
  contactPreference: string
  moveInDate: string
  hasPets: boolean
  petType?: string
  petBreed?: string
  petSize?: string
  petWeight?: string
  petDetails: string
  additionalQuery: string
  
  // Stage 2: Showing
  skipShowing: boolean
  preferredDate: string
  preferredTime: string
  tourRemarks: string
  
  // Stage 3: Application
  applicationFeeType?: string
  applicationFee: number
  applicationSubmitted: boolean
  applicationData: any
  
  // Stage 4: Verification
  uploadDocumentName?: string
  documentsVerified: boolean | null
  documentVerification?: {[key: string]: {status: string, reason?: string}}
  verificationReason: string
  creditScore: number
  criminalHistory: string
  evictionHistory: string
  incomeVerification: string
  
  // Stage 5: Agreement
  leaseStartDate: string
  leaseEndDate: string
  lateFeeType: 'percentage' | 'flat'
  lateFeeAmount: number
  gracePeriod: number
  paymentFrequency: string
  rentDueOn: number
  rentAmount: number
  securityDeposit: number
  firstMonthRent: number
  petDeposit: number
  otherCharges: number
  leaseAgreementGenerated?: boolean
  uploadedLeaseAgreement?: string
}

const stages = [
  { id: 1, name: 'Inquiry', description: 'Prospect Information' },
  { id: 2, name: 'Showing', description: 'Property Tour' },
  { id: 3, name: 'Application', description: 'Application Process' },
  { id: 4, name: 'Verification', description: 'Document & Background Check' },
  { id: 5, name: 'Agreement', description: 'Lease Terms' },
  { id: 6, name: 'Complete', description: 'Summary' }
]

export default function OnboardingStepper() {
  const [currentStage, setCurrentStage] = useState(1)
  const [maxReachedStage, setMaxReachedStage] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    selectedProperty: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    contactPreference: 'email',
    moveInDate: '',
    hasPets: false,
    petType: '',
    petBreed: '',
    petSize: '',
    petWeight: '',
    petDetails: '',
    additionalQuery: '',
    skipShowing: false,
    preferredDate: '',
    preferredTime: '',
    tourRemarks: '',
    applicationFeeType: 'fixed',
    applicationFee: 50,
    applicationSubmitted: false,
    applicationData: null,
    uploadDocumentName: '',
    documentsVerified: null,
    documentVerification: {},
    verificationReason: '',
    creditScore: 0,
    criminalHistory: '',
    evictionHistory: '',
    incomeVerification: '',
    leaseStartDate: '',
    leaseEndDate: '',
    lateFeeType: 'percentage',
    lateFeeAmount: 5,
    gracePeriod: 5,
    paymentFrequency: 'monthly',
    rentDueOn: 1,
    rentAmount: 0,
    securityDeposit: 0,
    firstMonthRent: 0,
    petDeposit: 0,
    otherCharges: 0,
    leaseAgreementGenerated: false,
    uploadedLeaseAgreement: ''
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStage = () => {
    if (currentStage < 6) {
      const nextStageNum = currentStage + 1
      setCurrentStage(nextStageNum)
      setMaxReachedStage(prev => Math.max(prev, nextStageNum))
    }
  }

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1)
    }
  }

  const goToStage = (stageId: number) => {
    if (stageId <= maxReachedStage) {
      setCurrentStage(stageId)
    }
  }

  const renderStage = () => {
    const isReadOnly = currentStage < maxReachedStage
    
    switch (currentStage) {
      case 1:
        return <InquiryStage data={data} updateData={updateData} isReadOnly={isReadOnly} />
      case 2:
        return <ShowingStage data={data} updateData={updateData} isReadOnly={isReadOnly} />
      case 3:
        return <ApplicationStage data={data} updateData={updateData} isReadOnly={isReadOnly} />
      case 4:
        return <VerificationStage data={data} updateData={updateData} isReadOnly={isReadOnly} />
      case 5:
        return <AgreementStage data={data} updateData={updateData} isReadOnly={isReadOnly} />
      case 6:
        return <CompleteStage data={data} />
      default:
        return null
    }
  }

  const progress = (currentStage / 6) * 100

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Property Management Onboarding
        </h1>
        <p className="text-slate-600">
          Streamline your prospect onboarding process with our comprehensive workflow
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-700">
            Step {currentStage} of 6
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Stage Indicators */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center">
              <div className="flex items-center">
                {stage.id < currentStage ? (
                  <button
                    onClick={() => goToStage(stage.id)}
                    className="hover:scale-110 transition-transform"
                    title={`Go to ${stage.name} (Read-only)`}
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </button>
                ) : stage.id === currentStage ? (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{stage.id}</span>
                  </div>
                ) : stage.id <= maxReachedStage ? (
                  <button
                    onClick={() => goToStage(stage.id)}
                    className="hover:scale-110 transition-transform"
                    title={`Go to ${stage.name}`}
                  >
                    <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{stage.id}</span>
                    </div>
                  </button>
                ) : (
                  <Circle className="w-8 h-8 text-slate-300" />
                )}
                {index < stages.length - 1 && (
                  <div className={`w-16 h-0.5 ml-2 ${
                    stage.id < currentStage ? 'bg-emerald-500' : stage.id <= maxReachedStage ? 'bg-blue-300' : 'bg-slate-200'
                  }`} />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  stage.id <= maxReachedStage ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {stage.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stage.description}
                </div>
                {stage.id < currentStage && stage.id <= maxReachedStage && (
                  <div className="text-xs text-emerald-600 mt-1 font-medium">
                    (Click to view)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">{stages[currentStage - 1].name}</Badge>
            {stages[currentStage - 1].description}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStage()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStage}
          disabled={currentStage === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={nextStage}
          disabled={currentStage === 6}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}