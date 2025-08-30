"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createClient } from "@/lib/supabase"
import { Plus, X, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface PollOption {
  id: string
  text: string
}

export default function CreatePollPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" }
  ])
  const [expiresAt, setExpiresAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()

  const testConnection = async () => {
    try {
      console.log("Testing Supabase connection...")
      setError("")
      
      // Test basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (error) {
        console.error("Connection test failed:", error)
        setError(`Connection test failed: ${error.message}`)
      } else {
        console.log("Connection test successful:", data)
        setError("✅ Connection test successful!")
        setTimeout(() => setError(""), 3000)
      }
    } catch (err: any) {
      console.error("Connection test error:", err)
      setError(`Connection test error: ${err.message}`)
    }
  }

  const addOption = () => {
    const newId = (options.length + 1).toString()
    setOptions([...options, { id: newId, text: "" }])
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id))
    }
  }

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Check if user is loaded
    if (!user) {
      setError("Please wait while we load your account...")
      setLoading(false)
      return
    }

    // Validation
    if (!title.trim()) {
      setError("Poll title is required")
      setLoading(false)
      return
    }

    const validOptions = options.filter(option => option.text.trim())
    if (validOptions.length < 2) {
      setError("At least 2 options are required")
      setLoading(false)
      return
    }

    try {
      console.log("Starting poll creation process...")
      
      // Use the user from auth context instead of calling supabase.auth.getUser()
      if (!user) {
        throw new Error("User not authenticated")
      }
      
      console.log("User authenticated:", user.id)

      // Create poll
      console.log("Creating poll with data:", {
        title: title.trim(),
        description: description.trim() || null,
        created_by: user.id,
        expires_at: expiresAt || null
      })

      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          created_by: user.id,
          expires_at: expiresAt || null
        })
        .select()
        .single()

      if (pollError) {
        console.error("Poll creation error:", pollError)
        throw pollError
      }

      console.log("Poll created successfully:", poll)

      // Create poll options
      const optionsData = validOptions.map((option, index) => ({
        poll_id: poll.id,
        text: option.text.trim(),
        order_index: index + 1
      }))

      console.log("Creating poll options:", optionsData)

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsData)

      if (optionsError) {
        console.error("Options creation error:", optionsError)
        throw optionsError
      }

      console.log("Poll options created successfully")

      // Show success message
      setSuccess("🎉 Poll created successfully! Redirecting to polls page...")
      
      // Redirect after 2 seconds to let user see the success message
      setTimeout(() => {
        router.push('/polls')
      }, 2000)
    } catch (err: any) {
      console.error("Error in handleSubmit:", err)
      setError(err.message || "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                ✨ Create New Poll
              </CardTitle>
              <CardDescription className="text-gray-600">
                Build an engaging poll for your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authLoading && (
                <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-blue-600">Loading your account...</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poll Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What would you like to ask?"
                    required
                    className="w-full"
                  />
                </div>

                {/* Poll Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more context to your poll..."
                    className="w-full"
                  />
                </div>

                {/* Poll Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Poll Options * (Minimum 2)
                  </label>
                  <div className="space-y-3">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(option.id, e.target.value)}
                          placeholder={`Option ${option.id}`}
                          required
                          className="flex-1"
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(option.id)}
                            className="px-3"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {/* Expiration Date */}
                <div>
                  <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Expiration Date (Optional)
                  </label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty for polls that never expire
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Success Display */}
                {success && (
                  <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                    {success}
                  </div>
                )}

                {/* Test Connection Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  className="w-full mb-4"
                  disabled={loading || authLoading}
                >
                  🔍 Test Database Connection
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || authLoading}
                >
                  {authLoading ? "Loading..." : loading ? "Creating Poll..." : "🚀 Create Poll"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
