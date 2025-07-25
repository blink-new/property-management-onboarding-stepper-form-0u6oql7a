import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Calendar, DollarSign, FileText, Calculator, Download, CheckCircle, Eye, Upload } from 'lucide-react'
import { OnboardingData } from '../OnboardingStepper'
import { useToast } from '@/hooks/use-toast'

interface AgreementStageProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  isReadOnly?: boolean
}

export default function AgreementStage({ data, updateData, isReadOnly = false }: AgreementStageProps) {
  const { toast } = useToast()
  const [leaseGenerated, setLeaseGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedLeaseFile, setUploadedLeaseFile] = useState<File | null>(null)

  const calculateTotalUpfront = () => {
    return data.securityDeposit + data.firstMonthRent + data.petDeposit + data.otherCharges
  }

  const calculateProratedRent = () => {
    if (!data.leaseStartDate || !data.rentAmount) return 0
    
    const startDate = new Date(data.leaseStartDate)
    const year = startDate.getFullYear()
    const month = startDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const dayOfMonth = startDate.getDate()
    const remainingDays = daysInMonth - dayOfMonth + 1
    
    return (data.rentAmount / daysInMonth) * remainingDays
  }

  const handleUploadLeaseAgreement = (file: File) => {
    setUploadedLeaseFile(file)
    updateData({ uploadedLeaseAgreement: file.name })
    
    toast({
      title: "Lease Agreement Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    })
  }

  const handleGenerateLeaseAgreement = async () => {
    setIsGenerating(true)
    
    // Simulate lease generation process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLeaseGenerated(true)
    setIsGenerating(false)
    
    updateData({ leaseAgreementGenerated: true })
    
    toast({
      title: "Lease Agreement Generated!",
      description: "The lease agreement has been successfully generated and is ready for download.",
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

      {/* Lease Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Lease Terms Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseStartDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Lease Start Date
              </Label>
              <Input
                id="leaseStartDate"
                type="date"
                value={data.leaseStartDate}
                onChange={(e) => updateData({ leaseStartDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseEndDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Lease End Date
              </Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={data.leaseEndDate}
                onChange={(e) => updateData({ leaseEndDate: e.target.value })}
                min={data.leaseStartDate || new Date().toISOString().split('T')[0]}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Late Fee Configuration</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Late Fee Type</Label>
                <RadioGroup
                  value={data.lateFeeType}
                  onValueChange={(value: 'percentage' | 'flat') => updateData({ lateFeeType: value })}
                  className="flex gap-6"
                  disabled={isReadOnly}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage-fee" disabled={isReadOnly} />
                    <Label htmlFor="percentage-fee">Percentage (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flat" id="flat-fee" disabled={isReadOnly} />
                    <Label htmlFor="flat-fee">Flat Amount ($)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lateFeeAmount">
                    Late Fee {data.lateFeeType === 'percentage' ? 'Percentage' : 'Amount'}
                  </Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    value={data.lateFeeAmount}
                    onChange={(e) => updateData({ lateFeeAmount: parseFloat(e.target.value) || 0 })}
                    placeholder={data.lateFeeType === 'percentage' ? '5' : '50'}
                    min="0"
                    step={data.lateFeeType === 'percentage' ? '0.1' : '1'}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={data.gracePeriod}
                    onChange={(e) => updateData({ gracePeriod: parseInt(e.target.value) || 0 })}
                    placeholder="5"
                    min="0"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Payment Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <Select
                  value={data.paymentFrequency}
                  onValueChange={(value) => updateData({ paymentFrequency: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentDueOn">Rent Due On (day of month)</Label>
                <Input
                  id="rentDueOn"
                  type="number"
                  value={data.rentDueOn}
                  onChange={(e) => updateData({ rentDueOn: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="31"
                  placeholder="1"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly Rent Amount ($)</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  value={data.rentAmount}
                  onChange={(e) => updateData({ rentAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="1500"
                  min="0"
                  step="0.01"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Financial Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prorated Rent Calculator */}
          {data.leaseStartDate && data.rentAmount > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Calculator className="w-4 h-4" />
                <span className="font-medium">Prorated First Month Rent Calculator</span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>Lease starts on: <strong>{new Date(data.leaseStartDate).toLocaleDateString()}</strong></p>
                <p>Monthly rent: <strong>${data.rentAmount.toFixed(2)}</strong></p>
                <p>Prorated amount: <strong>${calculateProratedRent().toFixed(2)}</strong></p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                  onClick={() => updateData({ firstMonthRent: calculateProratedRent() })}
                  disabled={isReadOnly}
                >
                  Use Prorated Amount
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={data.securityDeposit}
                onChange={(e) => updateData({ securityDeposit: parseFloat(e.target.value) || 0 })}
                placeholder="1500"
                min="0"
                step="0.01"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstMonthRent">First Month Rent ($)</Label>
              <Input
                id="firstMonthRent"
                type="number"
                value={data.firstMonthRent}
                onChange={(e) => updateData({ firstMonthRent: parseFloat(e.target.value) || 0 })}
                placeholder="1500"
                min="0"
                step="0.01"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="petDeposit">Pet Deposit ($)</Label>
              <Input
                id="petDeposit"
                type="number"
                value={data.petDeposit}
                onChange={(e) => updateData({ petDeposit: parseFloat(e.target.value) || 0 })}
                placeholder="300"
                min="0"
                step="0.01"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCharges">Other Charges ($)</Label>
              <Input
                id="otherCharges"
                type="number"
                value={data.otherCharges}
                onChange={(e) => updateData({ otherCharges: parseFloat(e.target.value) || 0 })}
                placeholder="100"
                min="0"
                step="0.01"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <Separator />

          {/* Financial Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-3">
              <Calculator className="w-5 h-5" />
              <span className="font-medium">Financial Summary</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Security Deposit:</span>
                <span className="font-medium text-blue-900">${data.securityDeposit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">First Month Rent:</span>
                <span className="font-medium text-blue-900">${data.firstMonthRent.toFixed(2)}</span>
              </div>
              {data.petDeposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Pet Deposit:</span>
                  <span className="font-medium text-blue-900">${data.petDeposit.toFixed(2)}</span>
                </div>
              )}
              {data.otherCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Other Charges:</span>
                  <span className="font-medium text-blue-900">${data.otherCharges.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-medium text-blue-800">Total Upfront Cost:</span>
                <span className="font-bold text-blue-900">${calculateTotalUpfront().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Monthly Payment Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border">
            <h4 className="font-medium text-slate-900 mb-3">Monthly Payment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Rent:</span>
                <span className="font-medium">${data.rentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Due Date:</span>
                <span className="font-medium">{data.rentDueOn}{data.rentDueOn === 1 ? 'st' : data.rentDueOn === 2 ? 'nd' : data.rentDueOn === 3 ? 'rd' : 'th'} of each month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Frequency:</span>
                <span className="font-medium capitalize">{data.paymentFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Late Fee:</span>
                <span className="font-medium">
                  {data.lateFeeType === 'percentage' 
                    ? `${data.lateFeeAmount}% after ${data.gracePeriod} days`
                    : `$${data.lateFeeAmount} after ${data.gracePeriod} days`
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Lease Agreement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Lease Agreement Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!leaseGenerated ? (
            <div className="text-center py-6">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="font-medium text-slate-900 mb-2">Ready to Generate Lease Agreement</h4>
              <p className="text-slate-600 mb-6">
                All lease terms and financial details have been configured. Generate the official lease agreement document.
              </p>
              <Button 
                onClick={handleGenerateLeaseAgreement}
                disabled={isReadOnly || isGenerating}
                className="flex items-center gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Agreement...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Lease Agreement
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Lease Agreement Generated Successfully</span>
                </div>
                <p className="text-green-700 text-sm">
                  The lease agreement has been generated with all the configured terms and is ready for download and signature.
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex items-center gap-2" disabled={isReadOnly}>
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled={isReadOnly}>
                  <FileText className="w-4 h-4" />
                  Preview Agreement
                </Button>
              </div>
              
              <Separator />
              
              {/* Upload Alternative Lease Agreement */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Upload Custom Lease Agreement</h4>
                <p className="text-sm text-slate-600">
                  Alternatively, you can upload your own lease agreement document.
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleUploadLeaseAgreement(file)
                      }
                    }}
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={isReadOnly}
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                      fileInput?.click()
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Lease Agreement
                  </Button>
                </div>
                
                {uploadedLeaseFile && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Uploaded: {uploadedLeaseFile.name}</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      Custom lease agreement has been uploaded successfully.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-medium text-slate-900 mb-3">Agreement Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Property:</span>
                    <p className="font-medium">{data.selectedProperty}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Tenant:</span>
                    <p className="font-medium">{data.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Lease Term:</span>
                    <p className="font-medium">
                      {data.leaseStartDate} to {data.leaseEndDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Monthly Rent:</span>
                    <p className="font-medium">${data.rentAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Security Deposit:</span>
                    <p className="font-medium">${data.securityDeposit.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Total Upfront:</span>
                    <p className="font-medium">${calculateTotalUpfront().toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}