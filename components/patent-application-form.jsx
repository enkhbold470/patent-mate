"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { submitPatentApplication } from "@/lib/actions/submit-patent-application";
import { useRouter } from "next/navigation";

export function PatentApplicationForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    inventionStage: "",
    priorArtSearch: "",
    novelty: "",
    publicDisclosure: "",
    patentGoals: [],
    otherGoal: "",
    protectionRegions: "",
    timeline: "",
    budget: "",
    disclosureProcessFamiliarity: "",
    needDisclosureExplanation: "",
    needDisclosureAssistance: "",
    needConfidentialityAgreement: "",
    ndaAgreed: false,
    patentDescription: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        updateFormData("patentDescription", content);
      };
      reader.readAsText(file);
    }
  };

  const steps = [
    {
      title: "Invention Stage",
      description: "What stage is your invention in?",
      content: (
        <RadioGroup
          value={formData.inventionStage}
          onValueChange={(value) => updateFormData("inventionStage", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="idea" id="idea" />
            <Label htmlFor="idea">Idea only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prototype" id="prototype" />
            <Label htmlFor="prototype">Prototype developed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="market" id="market" />
            <Label htmlFor="market">Product in market</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.inventionStage !== "",
    },
    {
      title: "Prior Art Search",
      description: "Have you conducted any prior art searches?",
      content: (
        <RadioGroup
          value={formData.priorArtSearch}
          onValueChange={(value) => updateFormData("priorArtSearch", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="self" id="self" />
            <Label htmlFor="self">I have conducted searches myself.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professional" id="professional" />
            <Label htmlFor="professional">
              Yes, but with professional help.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No, I need assistance with this.</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.priorArtSearch !== "",
    },
    {
      title: "Novelty",
      description: "Do you believe your invention is novel, and why?",
      content: (
        <Textarea
          placeholder="Explain why you believe your invention is novel..."
          value={formData.novelty}
          onChange={(e) => updateFormData("novelty", e.target.value)}
        />
      ),
      isValid: () => formData.novelty !== "",
    },
    {
      title: "Public Disclosure",
      description: "Have you disclosed your invention publicly in any form?",
      content: (
        <RadioGroup
          value={formData.publicDisclosure}
          onValueChange={(value) => updateFormData("publicDisclosure", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes-disclosure" />
            <Label htmlFor="yes-disclosure">Yes (Provide details)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no-disclosure" />
            <Label htmlFor="no-disclosure">No</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.publicDisclosure !== "",
    },
    {
      title: "Patent Goals",
      description: "What are your main goals for patenting the invention?",
      content: (
        <div className="space-y-2">
          <Label>Select all that apply:</Label>
          <div className="space-y-2">
            {[
              "Protecting intellectual property",
              "Attracting investors or funding",
              "Licensing opportunities",
              "Other",
            ].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={formData.patentGoals.includes(goal)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFormData("patentGoals", [
                        ...formData.patentGoals,
                        goal,
                      ]);
                    } else {
                      updateFormData(
                        "patentGoals",
                        formData.patentGoals.filter((g) => g !== goal)
                      );
                    }
                  }}
                />
                <Label htmlFor={goal}>{goal}</Label>
              </div>
            ))}
          </div>
          {formData.patentGoals.includes("Other") && (
            <Input
              placeholder="Please specify other goals"
              value={formData.otherGoal}
              onChange={(e) => updateFormData("otherGoal", e.target.value)}
            />
          )}
        </div>
      ),
      isValid: () => formData.patentGoals.length > 0,
    },
    {
      title: "Protection Regions",
      description:
        "Are you interested in patent protection in specific countries or regions?",
      content: (
        <RadioGroup
          value={formData.protectionRegions}
          onValueChange={(value) => updateFormData("protectionRegions", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="domestic" id="domestic" />
            <Label htmlFor="domestic">Domestic only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="international" id="international" />
            <Label htmlFor="international">International</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.protectionRegions !== "",
    },
    {
      title: "Timeline",
      description: "What is your timeline for filing a patent application?",
      content: (
        <RadioGroup
          value={formData.timeline}
          onValueChange={(value) => updateFormData("timeline", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="immediate" id="immediate" />
            <Label htmlFor="immediate">Immediate (within 1-3 months)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="short-term" id="short-term" />
            <Label htmlFor="short-term">Short-term (within 4-6 months)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-timeline" id="no-timeline" />
            <Label htmlFor="no-timeline">No specific timeline</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.timeline !== "",
    },
    {
      title: "Budget",
      description: "What is your budget for obtaining a patent?",
      content: (
        <Input
          type="text"
          placeholder="Enter your budget range"
          value={formData.budget}
          onChange={(e) => updateFormData("budget", e.target.value)}
        />
      ),
      isValid: () => formData.budget !== "",
    },
    {
      title: "Disclosure Process Familiarity",
      description: "Are you familiar with the invention disclosure process?",
      content: (
        <RadioGroup
          value={formData.disclosureProcessFamiliarity}
          onValueChange={(value) =>
            updateFormData("disclosureProcessFamiliarity", value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="familiar" id="familiar" />
            <Label htmlFor="familiar">Yes, I am familiar.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="somewhat" id="somewhat" />
            <Label htmlFor="somewhat">
              Somewhat familiar, but need more details.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-familiar" id="not-familiar" />
            <Label htmlFor="not-familiar">Not familiar at all.</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.disclosureProcessFamiliarity !== "",
    },
    {
      title: "Disclosure Explanation",
      description:
        "Would you like a detailed explanation of how invention disclosure can impact your patent application?",
      content: (
        <RadioGroup
          value={formData.needDisclosureExplanation}
          onValueChange={(value) =>
            updateFormData("needDisclosureExplanation", value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes-explanation" />
            <Label htmlFor="yes-explanation">
              Yes, please provide details.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no-explanation" />
            <Label htmlFor="no-explanation">
              No, I understand the implications.
            </Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.needDisclosureExplanation !== "",
    },
    {
      title: "Disclosure Assistance",
      description:
        "Would you like assistance in preparing a comprehensive invention disclosure document?",
      content: (
        <RadioGroup
          value={
            formData.needDisclosureAssistance === null
              ? ""
              : formData.needDisclosureAssistance.toString()
          }
          onValueChange={(value) =>
            updateFormData("needDisclosureAssistance", value === "true")
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="yes-assistance" />
            <Label htmlFor="yes-assistance">
              Yes, I need help with documentation.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="no-assistance" />
            <Label htmlFor="no-assistance">No, I will prepare it myself.</Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.needDisclosureAssistance !== null,
    },
    {
      title: "Confidentiality Agreement",
      description:
        "Do you require confidentiality agreements before disclosing details of your invention?",
      content: (
        <RadioGroup
          value={
            formData.needConfidentialityAgreement === null
              ? ""
              : formData.needConfidentialityAgreement.toString()
          }
          onValueChange={(value) =>
            updateFormData("needConfidentialityAgreement", value === "true")
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="yes-nda" />
            <Label htmlFor="yes-nda">Yes, I need an NDA in place.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="no-nda" />
            <Label htmlFor="no-nda">
              No, I am ready to disclose without an NDA.
            </Label>
          </div>
        </RadioGroup>
      ),
      isValid: () => formData.needConfidentialityAgreement !== null,
    },
    {
      title: "Non-Disclosure Agreement",
      description:
        "Please review and agree to the following Non-Disclosure Agreement:",
      content: (
        <div className="space-y-4">
          <ScrollArea className="h-[300px] w-full border border-gray-200 rounded-md p-4">
            <pre className="text-sm whitespace-pre-wrap">
              {`PATENT (INVENTION) CONFIDENTIALITY AGREEMENT

This Agreement, effective this ____ day of ______________________________, 20___, by and between ______________________________, an individual, with the address of __________________________________________________ (hereinafter "INVENTOR")  and __________________________________________________, with the address __________________________________________________ (hereinafter "RECIPIENT") confirms the terms under which the INVENTOR may disclose proprietary information and materials possessed, developed or acquired by INVENTOR with respect to one or more inventions of INVENTOR. RECIPIENT wishes to receive from INVENTOR such proprietary information and materials as INVENTOR desires to disclose for the sole purpose of evaluating INVENTOR's inventions.

INVENTOR shall mark as "confidential" all written materials it regards as embodying proprietary information and materials so RECIPIENT is aware that its receipt of such materials is governed by the terms of this Agreement. Oral disclosure of proprietary information to RECIPIENT will be reduced to writing within thirty (30) days of oral disclosure by the INVENTOR and clearly marked as "confidential". RECIPIENT agrees that any such information and materials shall be maintained in secrecy and shall not, except to the extent authorized by the INVENTOR in writing, knowingly use such information and materials for any purpose other than the use contemplated hereby; and RECIPIENT will use all reasonable diligence to prevent unauthorized use or disclosure by RECIPIENT for a period of five (5) years from the signing of this Agreement; provided, that RECIPIENT shall have the right to disclose such information and materials to its necessary personnel, which shall include employees, and to independent searchers, consultants, subcontractors and patent office personnel who have agreed to maintain the confidential nature of such information and materials.

RECIPIENT shall have the right to challenge any claim of proprietary right and obligation of confidentiality of such information and materials claimed to constitute a proprietary right by showing that such information and materials are already in its or its affiliates possession prior to receipt thereof from the INVENTOR hereunder.  No obligation of confidentiality shall exist as to information and materials that:

1.	are in the public domain by public use, publication, general knowledge or the like, or after disclosure hereunder become general or public knowledge, through no fault of RECIPIENT, or

2.	are properly obtained by RECIPIENT from a third party for use or disclosure.

Any and all proprietary written materials or other information or samples in tangible form received by RECIPIENT from INVENTOR shall, upon request, be immediately returned, except for one single copy which may be retained to establish a record of what was received.

This Agreement shall be interpreted and enforced under the laws of the State of ____________________. Both parties hereby consent to the jurisdiction of the federal and state courts located in the State of ____________________ with respect to the subject matter hereof.

This Agreement constitutes the full understanding of the parties and a complete and exclusive statement of the terms of their agreement with respect to the subject matter hereof. If any part of this Agreement shall be held invalid or unenforceable in any application, such invalidity and/or unenforceability shall not affect such provision in any other application or any other provision of any application. No modification or alteration of this Agreement shall be effective unless in writing and signed by the respective parties.

It is understood that no patent right or license is hereby granted to RECIPIENT by this Agreement and that the disclosure of proprietary information and materials shall not result in any obligation to grant RECIPIENT any rights in and to the subject matter of INVENTOR.`}
            </pre>
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nda-agreement"
              checked={formData.ndaAgreed}
              onCheckedChange={(checked) =>
                updateFormData("ndaAgreed", checked)
              }
            />
            <Label htmlFor="nda-agreement">
              I agree to the terms of the Non-Disclosure Agreement
            </Label>
          </div>
        </div>
      ),
      isValid: () => formData.ndaAgreed,
    },
    {
      title: "Patent Description",
      description:
        "Please provide a detailed description of your patent/invention:",
      content: (
        <div className="space-y-4">
          <Textarea
            placeholder="Describe your patent/invention in detail..."
            value={formData.patentDescription}
            onChange={(e) =>
              updateFormData("patentDescription", e.target.value)
            }
            className="h-[200px]"
          />
          <div>
            <p className="text-sm text-gray-500 mb-2">Or upload a text file:</p>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
              <span className="text-sm">
                {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      ),
      isValid: () => formData.patentDescription.trim().length > 0,
    },
  ];

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const router = useRouter();

  const handleNext = () => {
    if (step < steps.length - 1 && steps[step].isValid()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (steps[step].isValid()) {
      setSubmitting(true);
      try {
        const result = await submitPatentApplication(formData);
        localStorage.setItem("patentReport", JSON.stringify(result.report));
        localStorage.setItem("patentFormData", JSON.stringify(formData));
        if (result.success && result.report) {
          localStorage.setItem("patentReport", JSON.stringify(result.report));
          router.push("/patent-ability-report");
        } else {
          setSubmitResult(result);
        }
      } catch (error) {
        setSubmitResult({
          success: false,
          message: "An error occurred while submitting the form.",
          report: null,
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardDescription>
          Step {step + 1} of {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{steps[step].title}</h3>
        <p className="text-sm text-gray-500 mb-4">{steps[step].description}</p>
        {steps[step].content}
        {submitResult && (
          <div
            className={`mt-4 p-4 rounded ${
              submitResult.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-semibold">{submitResult.message}</p>
            {submitResult.report && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Patent Ability Report:</h4>
                <div className="whitespace-pre-wrap text-sm">
                  {submitResult.report}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 0 || submitting}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        {step < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!steps[step].isValid() || submitting}
          >
            Next <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!steps[step].isValid() || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}{" "}
            <CheckIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
