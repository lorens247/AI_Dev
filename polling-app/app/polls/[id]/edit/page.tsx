"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { createClient } from "@/lib/supabase"
import { Plus, X, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PollOption {
  id: string
  text: string
}

interface Poll {
  id: string
  title: string
  description: string | null
  status: 'active' | 'closed' | 'draft'
  expires_at: string | null
  created_by: string
  poll_options: PollOption[]
}

export default function EditPollPage() {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState<PollOption[]>([])
  const [expiresAt, setExpiresAt] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const router = useRouter()
  const params = useParams()
  const pollId = params.id as string
  const supabase = createClient()

  useEffect(() => {
    fetchPoll()
  }, [pollId])

  const fetchPoll = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      // Fetch poll with options
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (*)
        `)
        .eq('id', pollId)
        .single()

      if (pollError) throw pollError

      // Check if user owns this poll
      if (pollData.created_by !== user.id) {
        throw new Error("You can only edit your own polls")
      }

      setPoll(pollData)
      setTitle(pollData.title)
      setDescription(pollData.description || "")
      setOptions(
        pollData.poll_options.map((opt: any) => ({ id: opt.id, text: opt.text }))
      )
      setExpiresAt(
        pollData.expires_at
          ? new Date(pollData.expires_at).toISOString().slice(0, 16)
          : ""
      )
    } catch (err: any) {
      setError((err as Error).message || "Failed to fetch poll")
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    const newId = `new-${Date.now()}`
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
    setSaving(true)
    setError("")
    setSuccess("")

    // Validation
    if (!title.trim()) {
      setError("Poll title is required")
      setSaving(false)
      return
    }

    const validOptions = options.filter(option => option.text.trim())
    if (validOptions.length < 2) {
      setError("At least 2 options are required")
      setSaving(false)
      return
    }

    // Check if poll data is loaded
    if (!poll) {
      setError("Poll data not loaded. Please refresh the page.")
      setSaving(false)
      return
    }

    try {
      console.log("Starting poll update...")
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Update operation timed out after 15 seconds")), 15000)
      )

      // Update poll
      console.log("Updating poll with data:", {
        title: title.trim(),
        description: description.trim() || null,
        expires_at: expiresAt || null
      })

      const pollUpdatePromise = supabase
        .from('polls')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          expires_at: expiresAt || null
        })
        .eq('id', pollId)

      const { error: pollError } = await Promise.race([pollUpdatePromise, timeoutPromise]) as any

      if (pollError) {
        console.error("Poll update error:", pollError)
        throw pollError
      }

      console.log("Poll updated successfully")

      // Handle poll options
      const existingOptions = poll.poll_options || []
      const newOptions = validOptions.filter((opt: PollOption) => opt.id.startsWith('new-'))
      const updatedOptions = validOptions.filter((opt: PollOption) => !opt.id.startsWith('new-'))

      console.log("Processing options:", {
        existing: existingOptions.length,
        new: newOptions.length,
        updated: updatedOptions.length
      })

      // Delete removed options
      const optionsToDelete = existingOptions.filter((existing: PollOption) => 
        !validOptions.some((valid: PollOption) => valid.id === existing.id)
      )
      
      if (optionsToDelete.length > 0) {
        console.log("Deleting options:", optionsToDelete.map(opt => opt.id))
        const { error: deleteError } = await supabase
          .from('poll_options')
          .delete()
          .in('id', optionsToDelete.map((opt: PollOption) => opt.id))

        if (deleteError) {
          console.error("Delete options error:", deleteError)
          throw deleteError
        }
        console.log("Options deleted successfully")
      }

      // Update existing options
      for (const option of updatedOptions) {
        console.log("Updating option:", option.id, option.text)
        const { error: updateError } = await supabase
          .from('poll_options')
          .update({ text: option.text.trim() })
          .eq('id', option.id)

        if (updateError) {
          console.error("Update option error:", updateError)
          throw updateError
        }
      }
      console.log("Existing options updated successfully")

      // Add new options
      if (newOptions.length > 0) {
        const newOptionsData = newOptions.map((option: PollOption, index: number) => ({
          poll_id: pollId,
          text: option.text.trim(),
          order_index: existingOptions.length + index + 1
        }))

        console.log("Adding new options:", newOptionsData)
        const { error: insertError } = await supabase
          .from('poll_options')
          .insert(newOptionsData)

        if (insertError) {
          console.error("Insert options error:", insertError)
          throw insertError
        }
        console.log("New options added successfully")
      }

      // Show success message
      setSuccess("✅ Poll updated successfully! Redirecting to polls page...")
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/polls')
      }, 2000)
    } catch (err: any) {
      console.error("Error in handleSubmit:", err)
      setError(err.message || "Failed to update poll")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading poll...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && !poll) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-red-600 text-6xl mb-4">❌</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Poll</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button asChild>
                  <Link href="/polls">← Back to Polls</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/polls">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Polls
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                ✏️ Edit Poll
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your poll details and options
              </CardDescription>
            </CardHeader>
            <CardContent>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? "Updating Poll..." : "💾 Update Poll"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
