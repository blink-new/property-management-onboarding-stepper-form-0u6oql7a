import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Building2, 
  User, 
  Calendar, 
  FileText, 
  Shield, 
  DollarSign,
  Download,
  Mail
} from 'lucide-react'
import { OnboardingData } from '../OnboardingStepper'

interface CompleteStageProps {
  data: OnboardingData
}

export default function CompleteStage({ data }: CompleteStageProps) {
  const calculateTotalUpfront = () => {
    return data.securityDeposit + data.firstMonthRent + data.petDeposit + data.otherCharges
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Completion Header */}
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Onboarding Complete!</h2>
        <p className="text-slate-600">
          All stages have been completed successfully. Here's a comprehensive summary of the prospect onboarding process.
        </p>
      </div>

      {/* Stage 1: Inquiry Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Stage 1: Inquiry Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Selected Property:</span>
              <p className="font-medium">{data.selectedProperty || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Prospect Name:</span>
              <p className="font-medium">{data.fullName || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Email:</span>
              <p className="font-medium">{data.email || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Phone:</span>
              <p className="font-medium">{data.phoneNumber || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Preferred Contact:</span>
              <p className="font-medium capitalize">{data.contactPreference}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Move-in Date:</span>
              <p className="font-medium">{formatDate(data.moveInDate)}</p>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-slate-600">Pets:</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={data.hasPets ? "default" : "secondary"}>
                {data.hasPets ? 'Yes' : 'No'}
              </Badge>
              {data.hasPets && data.petDetails && (
                <span className="text-sm text-slate-700">- {data.petDetails}</span>
              )}
            </div>
          </div>

          {data.additionalQuery && (
            <div>
              <span className="text-sm text-slate-600">Additional Questions:</span>
              <p className="text-sm text-slate-700 mt-1 p-2 bg-slate-50 rounded">{data.additionalQuery}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage 2: Showing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Stage 2: Property Tour Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Tour Date:</span>
              <p className="font-medium">{formatDate(data.preferredDate)}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Tour Time:</span>
              <p className="font-medium">{data.preferredTime || 'Not specified'}</p>
            </div>
          </div>
          
          {data.tourRemarks && (
            <div>
              <span className="text-sm text-slate-600">Tour Remarks:</span>
              <p className="text-sm text-slate-700 mt-1 p-2 bg-slate-50 rounded">{data.tourRemarks}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage 3: Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Stage 3: Application Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Application Fee:</span>
              <p className="font-medium">${data.applicationFee}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Application Status:</span>
              <Badge variant={data.applicationSubmitted ? "default" : "secondary"}>
                {data.applicationSubmitted ? 'Submitted' : 'Pending'}
              </Badge>
            </div>
          </div>

          {data.applicationSubmitted && data.applicationData && (
            <div>
              <span className="text-sm text-slate-600">Employment Details:</span>
              <div className="mt-1 p-2 bg-slate-50 rounded text-sm">
                <p><strong>Employer:</strong> {data.applicationData.employmentInfo.employer}</p>
                <p><strong>Position:</strong> {data.applicationData.employmentInfo.position}</p>
                <p><strong>Annual Salary:</strong> ${data.applicationData.employmentInfo.salary.toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage 4: Verification Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Stage 4: Verification Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Documents Status:</span>
              <Badge variant={data.documentsVerified ? "default" : "destructive"}>
                {data.documentsVerified ? 'Approved' : 'Rejected'}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-slate-600">Credit Score:</span>
              <p className="font-medium">{data.creditScore || 'Not available'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Criminal History:</span>
              <p className="text-sm text-slate-700">{data.criminalHistory || 'Not checked'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Eviction History:</span>
              <p className="text-sm text-slate-700">{data.evictionHistory || 'Not checked'}</p>
            </div>
          </div>

          <div>
            <span className="text-sm text-slate-600">Income Verification:</span>
            <p className="text-sm text-slate-700">{data.incomeVerification || 'Not verified'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stage 5: Agreement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Stage 5: Lease Agreement Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Lease Start Date:</span>
              <p className="font-medium">{formatDate(data.leaseStartDate)}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Lease End Date:</span>
              <p className="font-medium">{formatDate(data.leaseEndDate)}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Monthly Rent:</span>
              <p className="font-medium">${data.rentAmount.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Payment Due:</span>
              <p className="font-medium">{data.rentDueOn}{data.rentDueOn === 1 ? 'st' : data.rentDueOn === 2 ? 'nd' : data.rentDueOn === 3 ? 'rd' : 'th'} of each month</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-slate-900 mb-3">Financial Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Security Deposit:</span>
                <span className="font-medium">${data.securityDeposit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">First Month Rent:</span>
                <span className="font-medium">${data.firstMonthRent.toFixed(2)}</span>
              </div>
              {data.petDeposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Pet Deposit:</span>
                  <span className="font-medium">${data.petDeposit.toFixed(2)}</span>
                </div>
              )}
              {data.otherCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Other Charges:</span>
                  <span className="font-medium">${data.otherCharges.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium">Total Upfront Cost:</span>
                <span className="font-bold text-blue-600">${calculateTotalUpfront().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded">
            <span className="text-sm text-slate-600">Late Fee Policy:</span>
            <p className="text-sm text-slate-700">
              {data.lateFeeType === 'percentage' 
                ? `${data.lateFeeAmount}% of rent after ${data.gracePeriod} day grace period`
                : `$${data.lateFeeAmount} flat fee after ${data.gracePeriod} day grace period`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button className="flex items-center gap-2 flex-1">
          <Download className="w-4 h-4" />
          Generate Lease Agreement
        </Button>
        <Button variant="outline" className="flex items-center gap-2 flex-1">
          <Mail className="w-4 h-4" />
          Send Summary to Prospect
        </Button>
      </div>

      {/* Success Message */}
      <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <h3 className="font-medium text-green-800 mb-2">Onboarding Process Complete</h3>
        <p className="text-green-700 text-sm">
          The prospect has successfully completed all onboarding stages. You can now proceed with lease signing and move-in coordination.
        </p>
      </div>
    </div>
  )
}