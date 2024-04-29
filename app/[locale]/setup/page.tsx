"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId
} from "@/db/workspaces"
import {
  fetchHostedModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { MacrosStep } from "../../../components/setup/macros-step"
import { FinishStep } from "../../../components/setup/finish-step"
import { ProfileStep } from "../../../components/setup/profile-step"
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../../components/setup/step-container"
import { getSettingsById, updateSettings } from "@/db/settings"
import { PreferencesStep } from "@/components/setup/preferences-step"
import { DietProvider } from "@/types/diet"

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setEnvKeyMap,
    setAvailableHostedModels,
    setAvailableOpenRouterModels,
    setSettings
  } = useContext(ChatbotUIContext)

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [currentStep, setCurrentStep] = useState(1)

  // Profile Step
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [protein, setProtein] = useState(25)
  const [carbs, setCarbs] = useState(50)
  const [fat, setFat] = useState(25)
  const [calories, setCalories] = useState(2505)
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState("")
  const [activityLevel, setActivityLevel] = useState(0)
  const [workouts, setWorkouts] = useState(0)
  const [allergies, setAllergies] = useState<string[]>([])
  const [diet, setDiet] = useState("")
  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        const user = session.user

        const profile = await getProfileByUserId(user.id)
        setProfile(profile)
        setUsername(profile.username)

        if (!profile.has_onboarded) {
          setLoading(false)
        } else {
          const data = await fetchHostedModels(profile)

          if (!data) return

          setEnvKeyMap(data.envKeyMap)
          setAvailableHostedModels(data.hostedModels)

          if (profile["openrouter_api_key"] || data.envKeyMap["openrouter"]) {
            const openRouterModels = await fetchOpenRouterModels()
            if (!openRouterModels) return
            setAvailableOpenRouterModels(openRouterModels)
          }

          const homeWorkspaceId = await getHomeWorkspaceByUserId(
            session.user.id
          )
          return router.push(`/${homeWorkspaceId}/chat`)
        }
      }
    })()
  }, [])

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === SETUP_STEP_COUNT) {
        handleSaveSetupSetting()
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveSetupSetting = async () => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      return router.push("/login")
    }

    const user = session.user
    const profile = await getProfileByUserId(user.id)
    const settings = await getSettingsById(user.id)
    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,

      has_onboarded: true,
      display_name: displayName,
      username
    }
    const updatedProfile = await updateProfile(profile.id, updateProfilePayload)

    // updaate local and db settings
    const settingsUpdate: TablesUpdate<"settings"> = {
      ...settings,
      protein,
      carbs,
      fat,
      calories,
      workouts,
      allergies,
      diet: diet as DietProvider
    }
    const updatedSettings = await updateSettings(settings.id, settingsUpdate)
    setSettings(updatedSettings)

    setProfile(updatedProfile)

    const workspaces = await getWorkspacesByUserId(profile.user_id)
    const homeWorkspace = workspaces.find(w => w.is_home)

    // There will always be a home workspace
    setSelectedWorkspace(homeWorkspace!)
    setWorkspaces(workspaces)

    return router.push(`/${homeWorkspace?.id}/chat`)
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to Fitpal"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!(username && usernameAvailable)}
            showBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
              onUsernameAvailableChange={setUsernameAvailable}
              onUsernameChange={setUsername}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        )

      // API Step
      case 2:
        return (
          <StepContainer
            stepDescription="Enter your macros(you can edit this later)."
            stepNum={currentStep}
            stepTitle="Set your macros"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <MacrosStep
              protein={protein}
              setProtein={setProtein}
              carbs={carbs}
              setCarbs={setCarbs}
              fat={fat}
              setFat={setFat}
              calories={calories}
              setCalories={setCalories}
              height={height}
              setHeight={setHeight}
              weight={weight}
              setWeight={setWeight}
              age={age}
              setAge={setAge}
              gender={gender}
              setGender={setGender}
              activityLevel={activityLevel}
              setActivityLevel={setActivityLevel}
            />
          </StepContainer>
        )

      case 3:
        return (
          <StepContainer
            stepDescription="Enter your preferences!"
            stepNum={currentStep}
            stepTitle="Preferences"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <PreferencesStep
              allergies={allergies}
              setAllergies={setAllergies}
              diet={diet}
              setDiet={setDiet}
              workouts={workouts}
              setWorkouts={setWorkouts}
            />
          </StepContainer>
        )
      case 4:
        return (
          <StepContainer
            stepDescription="You are all set up!"
            stepNum={currentStep}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        )

      default:
        return null
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  )
}
