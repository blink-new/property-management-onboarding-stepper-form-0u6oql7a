import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DollarSign, Send, FileText, CheckCircle, Clock, Eye } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { OnboardingData } from '../OnboardingStepper'
import { useToast } from '@/hooks/use-toast'

interface ApplicationStageProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  isReadOnly?: boolean
}

export default function ApplicationStage({ data, updateData, isReadOnly = false }: ApplicationStageProps) {
  const { toast } = useToast()
  const [applicationSent, setApplicationSent] = useState(false)

  const handleSendApplication = () => {
    if (data.applicationFee <= 0) {
      toast({
        title: "Invalid Application Fee",
        description: "Please enter a valid application fee amount.",
        variant: "destructive"
      })
      return
    }

    setApplicationSent(true)
    toast({
      title: "Application Sent!",
      description: `Application form with $${data.applicationFee} fee has been sent to the prospect.`,
    })
  }

  const handleApplicationReceived = () => {
    const mockApplicationData = {
      submittedAt: new Date().toISOString(),
      incomeInfo: {
        monthlyIncome: 7500,
        primaryIncomeSource: "Full-time Employment"
      },
      employmentDetails1: {
        companyName: "Tech Solutions Inc.",
        position: "Senior Software Developer",
        duration: "2 years 3 months",
        supervisorContact: "John Smith - (555) 123-4567"
      },
      employmentDetails2: {
        companyName: "Freelance Web Development",
        position: "Freelance Developer",
        duration: "3 years (part-time)",
        clientContact: "Sarah Johnson - (555) 987-6543"
      },
      rentalHistory1: {
        landlordName: "Robert Wilson",
        landlordPhone: "(555) 234-5678",
        period: "January 2020 - December 2022",
        rentAmount: 1800,
        reasonForLeaving: "Moved for job relocation"
      },
      rentalHistory2: {
        landlordName: "Maria Garcia",
        landlordPhone: "(555) 345-6789",
        period: "March 2017 - December 2019",
        rentAmount: 1500,
        reasonForLeaving: "Lease expired, wanted larger space"
      },
      references: [
        { name: "Michael Brown", relationship: "Previous Landlord", phone: "(555) 111-2222" },
        { name: "Lisa Davis", relationship: "Character Reference", phone: "(555) 333-4444" }
      ],
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Sister",
        phone: "(555) 456-7890"
      }
    }

    updateData({ 
      applicationSubmitted: true,
      applicationData: mockApplicationData
    })

    toast({
      title: "Application Received!",
      description: "The prospect has submitted their application form.",
    })
  }

  return (
    <div className="space-y-6">
      {isReadOnly && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Eye className="w-4 h-4" />
            <span className="font-medium">Read-Only View</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            You are viewing previously submitted information. This data cannot be edited.
          </p>
        </div>
      )}

      {/* Application Fee Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Application Fee Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Application Fee</Label>
              <RadioGroup
                value={data.applicationFeeType || 'fixed'}
                onValueChange={(value) => {
                  updateData({ 
                    applicationFeeType: value,
                    applicationFee: value === 'fixed' ? 50 : data.applicationFee
                  })
                }}
                className="space-y-2 mt-2"
                disabled={isReadOnly}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed-fee" disabled={isReadOnly} />
                  <Label htmlFor="fixed-fee">Fixed Fee - $50</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-fee" disabled={isReadOnly} />
                  <Label htmlFor="custom-fee">Custom Amount</Label>
                </div>
              </RadioGroup>
              
              {data.applicationFeeType === 'custom' && (
                <div className="mt-3">
                  <Label htmlFor="applicationFee">Custom Fee Amount ($)</Label>
                  <Input
                    id="applicationFee"
                    type="number"
                    placeholder="Enter custom application fee amount"
                    value={data.applicationFee}
                    onChange={(e) => updateData({ applicationFee: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    disabled={isReadOnly}
                  />
                </div>
              )}
              
              {data.applicationFeeType === 'fixed' && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  Application fee is set to $50
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSendApplication}
              className="flex items-center gap-2"
              disabled={isReadOnly || applicationSent || data.applicationFee <= 0}
            >
              <Send className="w-4 h-4" />
              {applicationSent ? 'Application Sent' : 'Send Application Form'}
            </Button>
          </div>

          {applicationSent && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Application Form Sent</span>
              </div>
              <p className="text-green-700 mt-1">
                The prospect has been notified and can now complete their application with the ${data.applicationFee} fee.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Application Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Application Status:</span>
              <Badge variant={data.applicationSubmitted ? "default" : "secondary"}>
                {data.applicationSubmitted ? "Submitted" : "Pending"}
              </Badge>
            </div>

            {!data.applicationSubmitted && applicationSent && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Waiting for Prospect Response</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  The application form has been sent. Waiting for the prospect to complete and submit.
                </p>
                <Button 
                  onClick={handleApplicationReceived}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={isReadOnly}
                >
                  Simulate Application Received
                </Button>
              </div>
            )}

            {data.applicationSubmitted && data.applicationData && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Application Details</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600">Submitted:</span>
                        <p className="font-medium">
                          {new Date(data.applicationData.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Application Fee:</span>
                        <p className="font-medium">${data.applicationFee}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Income Information:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>Monthly Income:</strong> ${data.applicationData.incomeInfo.monthlyIncome.toLocaleString()}</p>
                        <p><strong>Primary Income Source:</strong> {data.applicationData.incomeInfo.primaryIncomeSource}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Employment Details 1:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>Company:</strong> {data.applicationData.employmentDetails1.companyName}</p>
                        <p><strong>Position:</strong> {data.applicationData.employmentDetails1.position}</p>
                        <p><strong>Duration:</strong> {data.applicationData.employmentDetails1.duration}</p>
                        <p><strong>Supervisor Contact:</strong> {data.applicationData.employmentDetails1.supervisorContact}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Employment Details 2:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>Company:</strong> {data.applicationData.employmentDetails2.companyName}</p>
                        <p><strong>Position:</strong> {data.applicationData.employmentDetails2.position}</p>
                        <p><strong>Duration:</strong> {data.applicationData.employmentDetails2.duration}</p>
                        <p><strong>Client Contact:</strong> {data.applicationData.employmentDetails2.clientContact}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Previous Rental History 1:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>Landlord:</strong> {data.applicationData.rentalHistory1.landlordName}</p>
                        <p><strong>Phone:</strong> {data.applicationData.rentalHistory1.landlordPhone}</p>
                        <p><strong>Period:</strong> {data.applicationData.rentalHistory1.period}</p>
                        <p><strong>Rent Amount:</strong> ${data.applicationData.rentalHistory1.rentAmount}/month</p>
                        <p><strong>Reason for Leaving:</strong> {data.applicationData.rentalHistory1.reasonForLeaving}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Previous Rental History 2:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>Landlord:</strong> {data.applicationData.rentalHistory2.landlordName}</p>
                        <p><strong>Phone:</strong> {data.applicationData.rentalHistory2.landlordPhone}</p>
                        <p><strong>Period:</strong> {data.applicationData.rentalHistory2.period}</p>
                        <p><strong>Rent Amount:</strong> ${data.applicationData.rentalHistory2.rentAmount}/month</p>
                        <p><strong>Reason for Leaving:</strong> {data.applicationData.rentalHistory2.reasonForLeaving}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">References:</span>
                      <div className="mt-1 space-y-2">
                        {data.applicationData.references.map((ref: any, index: number) => (
                          <div key={index} className="p-3 bg-slate-50 rounded">
                            <p><strong>{ref.name}</strong> - {ref.relationship}</p>
                            <p className="text-sm text-slate-600">{ref.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-600">Emergency Contact:</span>
                      <div className="mt-1 p-3 bg-slate-50 rounded">
                        <p><strong>{data.applicationData.emergencyContact.name}</strong> - {data.applicationData.emergencyContact.relationship}</p>
                        <p className="text-sm text-slate-600">{data.applicationData.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}