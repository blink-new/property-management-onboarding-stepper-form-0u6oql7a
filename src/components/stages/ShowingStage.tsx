import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, Send, CheckCircle, SkipForward } from 'lucide-react'
import { OnboardingData } from '../OnboardingStepper'
import { useToast } from '@/hooks/use-toast'

interface ShowingStageProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  isReadOnly?: boolean
}

export default function ShowingStage({ data, updateData, isReadOnly = false }: ShowingStageProps) {
  const { toast } = useToast()

  const handleSendRequest = () => {
    if (data.skipShowing) {
      toast({
        title: "Showing Skipped",
        description: "Property showing has been skipped as requested.",
      })
      return
    }

    if (!data.preferredDate || !data.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the property tour.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Tour Request Sent!",
      description: "The prospect has been notified about the property tour schedule.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Skip Showing Option */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipShowing"
              checked={data.skipShowing || false}
              onCheckedChange={(checked) => updateData({ skipShowing: checked as boolean })}
              disabled={isReadOnly}
            />
            <Label htmlFor="skipShowing" className="flex items-center gap-2 cursor-pointer">
              <SkipForward className="w-4 h-4 text-orange-600" />
              Skip Showing - Proceed directly to application
            </Label>
          </div>
          {data.skipShowing && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm">
                Property showing will be skipped. The prospect will proceed directly to the application stage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Tour Scheduling */}
      {!data.skipShowing && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Property Tour Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={data.preferredDate}
                    onChange={(e) => updateData({ preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Preferred Time
                  </Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={data.preferredTime}
                    onChange={(e) => updateData({ preferredTime: e.target.value })}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {data.preferredDate && data.preferredTime && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Tour Scheduled</span>
                  </div>
                  <p className="text-blue-700 mt-1">
                    {new Date(data.preferredDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {data.preferredTime}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tour Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Remarks & Special Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tourRemarks">Remarks</Label>
                <Textarea
                  id="tourRemarks"
                  value={data.tourRemarks}
                  onChange={(e) => updateData({ tourRemarks: e.target.value })}
                  placeholder="Add any special instructions, access codes, or notes for the property tour..."
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>

              {!isReadOnly && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendRequest}
                    className="flex items-center gap-2"
                    disabled={!data.preferredDate || !data.preferredTime}
                  >
                    <Send className="w-4 h-4" />
                    Send Tour Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Tour Summary */}
      {data.selectedProperty && (
        <Card>
          <CardHeader>
            <CardTitle>Tour Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Property:</span>
                <span className="font-medium">{data.selectedProperty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Prospect:</span>
                <span className="font-medium">{data.fullName || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Contact:</span>
                <span className="font-medium">{data.email || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Phone:</span>
                <span className="font-medium">{data.phoneNumber || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Preferred Contact:</span>
                <span className="font-medium capitalize">{data.contactPreference}</span>
              </div>
              {data.skipShowing && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Showing Status:</span>
                  <span className="font-medium text-orange-600">Skipped</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}