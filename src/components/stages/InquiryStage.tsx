import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Building2, User, Phone, Mail, Calendar, PawPrint, Eye } from 'lucide-react'
import { OnboardingData } from '../OnboardingStepper'

interface InquiryStageProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  isReadOnly?: boolean
}

const properties = [
  'Sunset Apartments - Unit 2A',
  'Downtown Loft - Unit 5B',
  'Garden View Condos - Unit 12C',
  'Riverside Towers - Unit 8A',
  'Metro Heights - Unit 15D'
]

export default function InquiryStage({ data, updateData, isReadOnly = false }: InquiryStageProps) {
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

      {/* Property Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Property Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="property">Select Property</Label>
            <Select
              value={data.selectedProperty}
              onValueChange={(value) => updateData({ selectedProperty: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a property..." />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prospect Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Prospect Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => updateData({ fullName: e.target.value })}
                placeholder="Enter full name"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder="Enter email address"
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={data.phoneNumber}
              onChange={(e) => updateData({ phoneNumber: e.target.value })}
              placeholder="Enter phone number"
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Method of Contact</Label>
            <RadioGroup
              value={data.contactPreference}
              onValueChange={(value) => updateData({ contactPreference: value })}
              className="flex gap-6"
              disabled={isReadOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-contact" disabled={isReadOnly} />
                <Label htmlFor="email-contact">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone-contact" disabled={isReadOnly} />
                <Label htmlFor="phone-contact">Phone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text-contact" disabled={isReadOnly} />
                <Label htmlFor="text-contact">Text Message</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveInDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ideal Move-in Date
            </Label>
            <Input
              id="moveInDate"
              type="date"
              value={data.moveInDate}
              onChange={(e) => updateData({ moveInDate: e.target.value })}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <PawPrint className="w-4 h-4" />
              Do you have pets?
            </Label>
            <RadioGroup
              value={data.hasPets.toString()}
              onValueChange={(value) => updateData({ hasPets: value === 'true' })}
              className="flex gap-6"
              disabled={isReadOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no-pets" disabled={isReadOnly} />
                <Label htmlFor="no-pets">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes-pets" disabled={isReadOnly} />
                <Label htmlFor="yes-pets">Yes</Label>
              </div>
            </RadioGroup>

            {data.hasPets && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="petType">Pet Type</Label>
                    <Select value={data.petType || ''} onValueChange={(value) => updateData({ petType: value })} disabled={isReadOnly}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="rabbit">Rabbit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="petBreed">Breed</Label>
                    <Input
                      id="petBreed"
                      placeholder="e.g., Golden Retriever"
                      value={data.petBreed || ''}
                      onChange={(e) => updateData({ petBreed: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="petSize">Size</Label>
                    <Select value={data.petSize || ''} onValueChange={(value) => updateData({ petSize: value })} disabled={isReadOnly}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (under 25 lbs)</SelectItem>
                        <SelectItem value="medium">Medium (25-60 lbs)</SelectItem>
                        <SelectItem value="large">Large (60-100 lbs)</SelectItem>
                        <SelectItem value="extra-large">Extra Large (over 100 lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="petWeight">Weight (lbs)</Label>
                    <Input
                      id="petWeight"
                      type="number"
                      placeholder="e.g., 45"
                      value={data.petWeight || ''}
                      onChange={(e) => updateData({ petWeight: e.target.value })}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="petDetails">Additional Pet Details</Label>
                  <Textarea
                    id="petDetails"
                    value={data.petDetails}
                    onChange={(e) => updateData({ petDetails: e.target.value })}
                    placeholder="Any additional information about your pet(s)..."
                    rows={3}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalQuery">Additional Questions or Comments</Label>
            <Textarea
              id="additionalQuery"
              value={data.additionalQuery}
              onChange={(e) => updateData({ additionalQuery: e.target.value })}
              placeholder="Any additional questions or special requirements?"
              rows={3}
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}