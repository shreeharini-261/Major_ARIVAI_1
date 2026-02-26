import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Calendar, Activity, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface OnboardingData {
  lastPeriodDate: string;
  typicalCycleLength: string;
  pregnancyStatus: string;
  lifeStage: string;
  healthConditions: string[];
  showBufferDays: boolean;
  stressLevel: string;
  sleepPattern: string;
  healthNotes: string;
}

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    lastPeriodDate: "",
    typicalCycleLength: "",
    pregnancyStatus: "none",
    lifeStage: "reproductive",
    healthConditions: [],
    showBufferDays: true,
    stressLevel: "medium",
    sleepPattern: "regular",
    healthNotes: "",
  });

  const saveMutation = useMutation({
    mutationFn: async (onboardingData: OnboardingData) => {
      const response = await apiRequest("POST", "/api/onboarding", onboardingData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
      toast({
        title: "Welcome to ARIVAI!",
        description: "Your profile is set up. Let's start your wellness journey!",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save your preferences",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      saveMutation.mutate(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "healthConditions", item: string) => {
    setData((prev) => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;
  const stepIcons = [Calendar, Activity, Heart, Sparkles, Activity, Check];
  const StepIcon = stepIcons[(currentStep - 1)];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-card-border shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <StepIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="font-serif text-2xl text-foreground">
            Let's personalize your experience
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </CardDescription>
          <Progress value={progress} className="mt-4 h-2" />
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">When did your last period start?</h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-xs space-y-2">
                      <Label htmlFor="lastPeriod">First day of your last period</Label>
                      <Input
                        id="lastPeriod"
                        type="date"
                        value={data.lastPeriodDate}
                        onChange={(e) => updateData("lastPeriodDate", e.target.value)}
                        className="bg-background border-border text-center text-lg"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">What's your usual cycle length?</h3>
                  </div>
                  <RadioGroup
                    value={data.typicalCycleLength}
                    onValueChange={(value) => updateData("typicalCycleLength", value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { value: "21-25", label: "21-25 days" },
                      { value: "26-30", label: "26-30 days" },
                      { value: "31-35", label: "31-35 days" },
                      { value: "36-40", label: "36-40 days" },
                      { value: "irregular", label: "Very irregular" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${data.typicalCycleLength === option.value ? "bg-primary/10 border-primary" : "border-border"}`}
                        onClick={() => updateData("typicalCycleLength", option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">What is your current pregnancy status?</h3>
                  </div>
                  <RadioGroup
                    value={data.pregnancyStatus}
                    onValueChange={(value) => updateData("pregnancyStatus", value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "none", label: "Not pregnant" },
                      { value: "pregnant", label: "Currently pregnant" },
                      { value: "trying", label: "Trying to conceive" },
                      { value: "postpartum", label: "Postpartum" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${data.pregnancyStatus === option.value ? "bg-primary/10 border-primary" : "border-border"}`}
                        onClick={() => updateData("pregnancyStatus", option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">Which life stage best describes you?</h3>
                  </div>
                  <RadioGroup
                    value={data.lifeStage}
                    onValueChange={(value) => updateData("lifeStage", value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "puberty", label: "Puberty" },
                      { value: "reproductive", label: "Reproductive" },
                      { value: "perimenopause", label: "Perimenopause" },
                      { value: "menopause", label: "Menopause" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${data.lifeStage === option.value ? "bg-primary/10 border-primary" : "border-border"}`}
                        onClick={() => updateData("lifeStage", option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">Do you have any conditions?</h3>
                  </div>
                  <div className="space-y-3">
                    {["pcos", "hormonal_imbalance"].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${data.healthConditions.includes(option) ? "bg-primary/10 border-primary" : "border-border"}`}
                        onClick={() => toggleArrayItem("healthConditions", option)}
                      >
                        <Checkbox checked={data.healthConditions.includes(option)} />
                        <Label className="cursor-pointer capitalize">{option.replace("_", " ")}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl text-foreground mb-2">Show flexible buffer days?</h3>
                  </div>
                  <RadioGroup
                    value={data.showBufferDays ? "true" : "false"}
                    onValueChange={(v) => updateData("showBufferDays", v === "true")}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { value: "true", label: "Yes, show buffers" },
                      { value: "false", label: "No, exact dates" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer ${String(data.showBufferDays) === option.value ? "bg-primary/10 border-primary" : "border-border"}`}
                        onClick={() => updateData("showBufferDays", option.value === "true")}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleNext} disabled={saveMutation.isPending}>
              {currentStep === TOTAL_STEPS ? (
                <> <Check className="w-4 h-4 mr-2" /> Complete </>
              ) : (
                <> Next <ArrowRight className="w-4 h-4 ml-2" /> </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
