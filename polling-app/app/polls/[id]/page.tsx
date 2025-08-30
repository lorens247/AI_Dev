"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Users, Calendar, BarChart3, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface PollOption {
  id: string
  text: string
  votes?: number
  percentage?: number
}

interface Poll {
  id: string
  title: string
  description: string | null
  status: 'active' | 'closed' | 'draft'
  expires_at: string | null
  created_at: string
  created_by: string
  profiles: {
    name: string
  } | null
  poll_options: PollOption[]
}

interface Vote {
  id: string
  option_id: string
  user_id: string
}

export default function PollDetailPage() {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState("")
  const [userVote, setUserVote] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const params = useParams()
  const router = useRouter()
  const pollId = params.id as string
  const supabase = createClient()
  const { user } = useAuth()

  useEffect(() => {
    fetchPoll()
  }, [pollId])

  const fetchPoll = async () => {
    try {
      setLoading(true)
      
      // Fetch poll with options
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (*),
          profiles!polls_created_by_fkey (name)
        `)
        .eq('id', pollId)
        .single()

      if (pollError) throw pollError

      setPoll(pollData)

      // Check if user has already voted
      if (user) {
        const { data: voteData } = await supabase
          .from('votes')
          .select('option_id')
          .eq('poll_id', pollId)
          .eq('user_id', user.id)
          .single()

        if (voteData) {
          setUserVote(voteData.option_id)
          setHasVoted(true)
          setShowResults(true)
        }
      }

      // Calculate vote counts and percentages
      await calculateVoteResults(pollData)
    } catch (err: any) {
      setError(err.message || "Failed to fetch poll")
    } finally {
      setLoading(false)
    }
  }

  const calculateVoteResults = async (pollData: Poll) => {
    try {
      // Get vote counts for each option
      const { data: votes } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId)

      const voteCounts = votes?.reduce((acc, vote) => {
        acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)

      // Update poll options with vote data
      const updatedOptions = pollData.poll_options.map(option => ({
        ...option,
        votes: voteCounts[option.id] || 0,
        percentage: totalVotes > 0 ? Math.round((voteCounts[option.id] || 0) / totalVotes * 100) : 0
      }))

      setPoll({
        ...pollData,
        poll_options: updatedOptions
      })
    } catch (err) {
      console.error('Error calculating vote results:', err)
    }
  }

  const handleVote = async (optionId: string) => {
    if (!user) {
      setError("You must be logged in to vote")
      return
    }

    try {
      setVoting(true)
      setError("")

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ option_id: optionId })
          .eq('id', existingVote.id)

        if (updateError) throw updateError
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
          })

        if (insertError) throw insertError
      }

      setUserVote(optionId)
      setHasVoted(true)
      setShowResults(true)

      // Refresh vote results
      await calculateVoteResults(poll!)
    } catch (err: any) {
      setError(err.message || "Failed to submit vote")
    } finally {
      setVoting(false)
    }
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const canVote = () => {
    if (!poll) return false
    if (poll.status !== 'active') return false
    if (poll.expires_at && isExpired(poll.expires_at)) return false
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading poll...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Poll</h3>
              <p className="text-gray-600 mb-6">{error || "Poll not found"}</p>
              <Button asChild>
                <Link href="/polls">← Back to Polls</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/polls">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Polls
            </Link>
          </Button>
        </div>

        {/* Poll Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                poll.status === 'active' ? 'bg-green-100 text-green-800' :
                poll.status === 'closed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {poll.status}
              </span>
              {poll.expires_at && isExpired(poll.expires_at) && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Expired
                </span>
              )}
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              {poll.title}
            </CardTitle>
            {poll.description && (
              <CardDescription className="text-xl text-gray-600">
                {poll.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {poll.poll_options.reduce((sum, opt) => sum + (opt.votes || 0), 0)} total votes
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                {poll.poll_options.length} options
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Created {new Date(poll.created_at).toLocaleDateString()}
              </div>
            </div>
            {poll.profiles && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Created by: {poll.profiles.name}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voting Section */}
        {canVote() && !hasVoted && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                🗳️ Cast Your Vote
              </CardTitle>
              <CardDescription>
                Select your preferred option below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {poll.poll_options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={option.id}
                      name="vote"
                      value={option.id}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={option.id} className="flex-1 text-lg text-gray-700 cursor-pointer">
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mt-4">
                  {error}
                </div>
              )}

              <Button
                onClick={() => {
                  const selectedOption = document.querySelector('input[name="vote"]:checked') as HTMLInputElement
                  if (selectedOption) {
                    handleVote(selectedOption.value)
                  } else {
                    setError("Please select an option to vote")
                  }
                }}
                className="w-full mt-6"
                disabled={voting}
              >
                {voting ? "Submitting Vote..." : "Submit Vote"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {(hasVoted || !canVote()) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {hasVoted ? "🎉 Thank You for Voting!" : "📊 Poll Results"}
              </CardTitle>
              <CardDescription>
                {hasVoted 
                  ? "Your vote has been recorded. Here are the current results:" 
                  : "This poll is no longer accepting votes. Here are the final results:"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {poll.poll_options.map((option) => {
                  const isUserVote = userVote === option.id
                  const totalVotes = poll.poll_options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
                  
                  return (
                    <div key={option.id} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {isUserVote && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          <span className="text-lg font-medium text-gray-900">
                            {option.text}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {option.votes || 0} votes
                          </div>
                          <div className="text-sm text-gray-500">
                            {option.percentage || 0}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isUserVote ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${option.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {hasVoted && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your vote has been recorded successfully!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cannot Vote Message */}
        {!canVote() && !hasVoted && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Voting Not Available</h3>
              <p className="text-gray-600 mb-6">
                {poll.status === 'closed' ? 'This poll is closed and no longer accepting votes.' :
                 poll.expires_at && isExpired(poll.expires_at) ? 'This poll has expired and is no longer accepting votes.' :
                 'This poll is not currently active.'}
              </p>
              <Button asChild>
                <Link href="/polls">← Back to Polls</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
