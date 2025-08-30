"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { Plus, Users, Calendar, BarChart3, Edit, Trash2, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

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
  poll_options: Array<{
    id: string
    text: string
  }>
  total_votes?: number
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all')
  const [deletingPoll, setDeletingPoll] = useState<string | null>(null)
  
  const supabase = createClient()
  const { user } = useAuth()

  useEffect(() => {
    fetchPolls()
  }, [filter])

  const fetchPolls = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('polls')
        .select(`
          *,
          poll_options (*),
          profiles!polls_created_by_fkey (name)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate total votes for each poll
      const pollsWithVotes = await Promise.all(
        data.map(async (poll) => {
          const { count } = await supabase
            .from('votes')
            .select('*', { count: 'exact', head: true })
            .eq('poll_id', poll.id)
          
          return {
            ...poll,
            total_votes: count || 0
          }
        })
      )

      setPolls(pollsWithVotes)
    } catch (err: any) {
      setError(err.message || "Failed to fetch polls")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingPoll(pollId)
      
      // Delete votes first (due to foreign key constraints)
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .eq('poll_id', pollId)

      if (votesError) throw votesError

      // Delete poll options
      const { error: optionsError } = await supabase
        .from('poll_options')
        .delete()
        .eq('poll_id', pollId)

      if (optionsError) throw optionsError

      // Delete the poll
      const { error: pollError } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId)

      if (pollError) throw pollError

      // Remove from local state
      setPolls(polls.filter(poll => poll.id !== pollId))
    } catch (err: any) {
      setError(err.message || "Failed to delete poll")
    } finally {
      setDeletingPoll(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const isPollOwner = (poll: Poll) => {
    return user && poll.created_by === user.id
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading polls...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 All Polls</h1>
              <p className="text-gray-600 mt-2">
                Discover and vote on polls created by the community
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild className="btn-success">
                <Link href="/polls/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Link>
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 mt-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All Polls
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filter === 'closed' ? 'default' : 'outline'}
              onClick={() => setFilter('closed')}
              size="sm"
            >
              Closed
            </Button>
          </div>
        </div>
      </div>

      {/* Polls Grid */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="text-red-600 text-center bg-red-50 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "Be the first to create a poll!" 
                : `No ${filter} polls available.`
              }
            </p>
            {filter === 'all' && (
              <Button asChild>
                <Link href="/polls/create">Create Your First Poll</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {polls.map((poll) => (
              <Card key={poll.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {poll.title}
                      </CardTitle>
                      {poll.description && (
                        <CardDescription className="text-gray-600">
                          {poll.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(poll.status)}`}>
                        {poll.status}
                      </span>
                      {isPollOwner(poll) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Your Poll
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Poll Options Preview */}
                  <div className="space-y-2 mb-4">
                    {poll.poll_options.slice(0, 3).map((option) => (
                      <div key={option.id} className="text-sm text-gray-600">
                        • {option.text}
                      </div>
                    ))}
                    {poll.poll_options.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{poll.poll_options.length - 3} more options
                      </div>
                    )}
                  </div>

                  {/* Poll Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {poll.total_votes} votes
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        {poll.poll_options.length} options
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(poll.created_at)}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="text-sm text-gray-500 mb-4">
                    Created by: {poll.profiles?.name || 'Unknown User'}
                  </div>

                  {/* Expiration Warning */}
                  {poll.expires_at && isExpired(poll.expires_at) && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg mb-4">
                      ⏰ This poll has expired
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* View/Vote Button */}
                    <Button asChild className="flex-1">
                      <Link href={`/polls/${poll.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        {poll.status === 'active' ? 'Vote Now' : 'View Results'}
                      </Link>
                    </Button>

                    {/* Owner Actions */}
                    {isPollOwner(poll) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/polls/${poll.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePoll(poll.id)}
                          disabled={deletingPoll === poll.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingPoll === poll.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
