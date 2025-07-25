import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  FileCheck, 
  FileX, 
  Shield, 
  CreditCard, 
  AlertTriangle, 
  Home, 
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Plus
} from 'lucide-react'
import { OnboardingData } from '../OnboardingStepper'
import { useToast } from '@/hooks/use-toast'

interface VerificationStageProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  isReadOnly?: boolean
}

const mockDocuments = [
  { id: 1, name: 'Driver\'s License', type: 'ID', status: 'uploaded', verified: null, rejectionReason: '' },
  { id: 2, name: 'Pay Stub (Recent)', type: 'Income', status: 'uploaded', verified: null, rejectionReason: '' },
  { id: 3, name: 'Bank Statement', type: 'Financial', status: 'uploaded', verified: null, rejectionReason: '' },
  { id: 4, name: 'Previous Rental Reference', type: 'Reference', status: 'uploaded', verified: null, rejectionReason: '' }
]

const mockBackgroundCheck = {
  creditScore: 742,
  criminalHistory: 'Clean - No criminal records found',
  evictionHistory: 'Clean - No eviction records found',
  incomeVerification: 'Verified - Income matches provided documentation'
}

export default function VerificationStage({ data, updateData, isReadOnly = false }: VerificationStageProps) {
  const { toast } = useToast()
  const [documents, setDocuments] = useState(mockDocuments)
  const [rejectionReasons, setRejectionReasons] = useState<{[key: number]: string}>({})
  const [backgroundCheckLoaded, setBackgroundCheckLoaded] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{id: number, name: string, file: File | null}>>([])
  const [newDocumentName, setNewDocumentName] = useState('')

  const handleIndividualDocumentVerification = (docId: number, approved: boolean) => {
    const reason = rejectionReasons[docId] || ''
    
    if (!approved && !reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this document.",
        variant: "destructive"
      })
      return
    }

    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, verified: approved, rejectionReason: approved ? '' : reason }
        : doc
    ))

    toast({
      title: approved ? "Document Approved" : "Document Rejected",
      description: approved 
        ? "Document has been verified and approved."
        : "Document has been rejected with reason recorded.",
      variant: approved ? "default" : "destructive"
    })

    // Update overall verification status
    const updatedDocs = documents.map(doc => 
      doc.id === docId 
        ? { ...doc, verified: approved, rejectionReason: approved ? '' : reason }
        : doc
    )
    
    const allVerified = updatedDocs.every(doc => doc.verified === true)
    const anyRejected = updatedDocs.some(doc => doc.verified === false)
    
    updateData({ 
      documentsVerified: allVerified ? true : (anyRejected ? false : null),
      documentDetails: updatedDocs
    })
  }

  const updateRejectionReason = (docId: number, reason: string) => {
    setRejectionReasons(prev => ({ ...prev, [docId]: reason }))
  }

  const handleDocumentUpload = (file: File) => {
    if (!newDocumentName.trim()) {
      toast({
        title: "Document Name Required",
        description: "Please enter a name for the document before uploading.",
        variant: "destructive"
      })
      return
    }

    const newDoc = {
      id: Date.now(),
      name: newDocumentName,
      file: file
    }

    setUploadedDocuments(prev => [...prev, newDoc])
    setNewDocumentName('')

    toast({
      title: "Document Uploaded",
      description: `${newDocumentName} has been uploaded successfully.`,
    })
  }

  const removeUploadedDocument = (docId: number) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId))
    toast({
      title: "Document Removed",
      description: "Document has been removed from uploads.",
    })
  }

  const loadBackgroundCheck = () => {
    setBackgroundCheckLoaded(true)
    updateData({
      creditScore: mockBackgroundCheck.creditScore,
      criminalHistory: mockBackgroundCheck.criminalHistory,
      evictionHistory: mockBackgroundCheck.evictionHistory,
      incomeVerification: mockBackgroundCheck.incomeVerification
    })

    toast({
      title: "Background Check Complete",
      description: "Third-party background check results have been loaded.",
    })
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 650) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent'
    if (score >= 700) return 'Good'
    if (score >= 650) return 'Fair'
    return 'Poor'
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

      {/* Upload Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  placeholder="e.g., Additional Income Proof"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="documentFile">Select File</Label>
                <Input
                  id="documentFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleDocumentUpload(file)
                      e.target.value = '' // Reset file input
                    }
                  }}
                  disabled={isReadOnly}
                />
              </div>
            </div>
            
            {uploadedDocuments.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                <div className="space-y-2">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{doc.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.file?.name}
                        </Badge>
                      </div>
                      {!isReadOnly && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeUploadedDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Document Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Uploaded
                    </Badge>
                    {doc.verified === true && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {doc.verified === false && (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>

                {doc.verified === null && !isReadOnly && (
                  <div className="space-y-3 border-t pt-3">
                    <div className="space-y-2">
                      <Label htmlFor={`rejection-reason-${doc.id}`}>Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id={`rejection-reason-${doc.id}`}
                        value={rejectionReasons[doc.id] || ''}
                        onChange={(e) => updateRejectionReason(doc.id, e.target.value)}
                        placeholder="Enter reason for rejection..."
                        rows={2}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleIndividualDocumentVerification(doc.id, true)}
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={isReadOnly}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleIndividualDocumentVerification(doc.id, false)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={isReadOnly}
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {doc.verified === false && doc.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center gap-2 text-red-800 mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium text-sm">Rejection Reason:</span>
                    </div>
                    <p className="text-red-700 text-sm">{doc.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Verification Status:</span>
              <Badge variant={
                data.documentsVerified === true ? "default" : 
                data.documentsVerified === false ? "destructive" : "secondary"
              }>
                {data.documentsVerified === true ? "All Approved" : 
                 data.documentsVerified === false ? "Some Rejected" : "Pending Review"}
              </Badge>
            </div>

            {data.documentsVerified === true && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">All Documents Approved</span>
                </div>
                <p className="text-green-700 mt-1">All submitted documents have been individually verified and approved.</p>
              </div>
            )}

            {data.documentsVerified === false && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800">
                  <FileX className="w-5 h-5" />
                  <span className="font-medium">Some Documents Rejected</span>
                </div>
                <p className="text-red-700 mt-1">One or more documents have been rejected. Please review individual rejection reasons above.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Background Check Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Background Check Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!backgroundCheckLoaded ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Background check results from third-party provider</p>
              <Button 
                onClick={loadBackgroundCheck} 
                className="flex items-center gap-2"
                disabled={isReadOnly}
              >
                <Shield className="w-4 h-4" />
                Load Background Check Results
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Credit Score */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Credit Score</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getCreditScoreColor(data.creditScore)}`}>
                    {data.creditScore}
                  </div>
                  <div>
                    <Badge variant="outline" className={getCreditScoreColor(data.creditScore)}>
                      {getCreditScoreLabel(data.creditScore)}
                    </Badge>
                    <Progress 
                      value={(data.creditScore / 850) * 100} 
                      className="w-32 mt-2" 
                    />
                  </div>
                </div>
              </div>

              {/* Criminal History */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Criminal History</h4>
                </div>
                <p className="text-slate-700">{data.criminalHistory}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-2">
                  Clear
                </Badge>
              </div>

              {/* Eviction History */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Eviction History</h4>
                </div>
                <p className="text-slate-700">{data.evictionHistory}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-2">
                  Clear
                </Badge>
              </div>

              {/* Income Verification */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Income Verification</h4>
                </div>
                <p className="text-slate-700">{data.incomeVerification}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-2">
                  Verified
                </Badge>
              </div>

              {/* Overall Assessment */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Background Check Complete</span>
                </div>
                <p className="text-green-700 mt-1">
                  All background checks have been completed successfully. The prospect meets the qualification criteria.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}