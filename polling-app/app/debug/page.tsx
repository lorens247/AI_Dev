"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setLoading(true)
    addResult("🔍 Testing Supabase connection...")
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`)
        addResult(`🔍 Error details: ${JSON.stringify(error, null, 2)}`)
      } else {
        addResult(`✅ Connection successful: ${data?.length || 0} profiles found`)
      }
    } catch (err: any) {
      addResult(`❌ Connection error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    addResult("🔍 Testing authentication...")
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        addResult(`❌ Auth error: ${error.message}`)
      } else if (user) {
        addResult(`✅ User authenticated: ${user.id}`)
        addResult(`📧 User email: ${user.email}`)
        addResult(`👤 User metadata: ${JSON.stringify(user.user_metadata, null, 2)}`)
      } else {
        addResult("❌ No user found")
      }
    } catch (err: any) {
      addResult(`❌ Auth test error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testPollCreation = async () => {
    if (!user) {
      addResult("❌ Cannot test poll creation: No user authenticated")
      return
    }

    setLoading(true)
    addResult("🔍 Testing poll creation...")
    
    try {
      // Try to create a test poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: 'Debug Test Poll',
          description: 'This is a test poll for debugging',
          created_by: user.id,
          status: 'active'
        })
        .select()
        .single()

      if (pollError) {
        addResult(`❌ Poll creation failed: ${pollError.message}`)
        addResult(`🔍 Error details: ${JSON.stringify(pollError, null, 2)}`)
      } else {
        addResult(`✅ Poll created successfully: ${poll.id}`)
        
        // Try to create poll options
        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert([
            { poll_id: poll.id, text: 'Option 1', order_index: 1 },
            { poll_id: poll.id, text: 'Option 2', order_index: 2 }
          ])

        if (optionsError) {
          addResult(`❌ Options creation failed: ${optionsError.message}`)
        } else {
          addResult(`✅ Poll options created successfully`)
        }

        // Clean up test data
        await supabase.from('poll_options').delete().eq('poll_id', poll.id)
        await supabase.from('polls').delete().eq('id', poll.id)
        addResult(`🧹 Test data cleaned up`)
      }
    } catch (err: any) {
      addResult(`❌ Poll creation test error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkEnvironment = () => {
    addResult("🔍 Checking environment variables...")
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl) {
      addResult("❌ NEXT_PUBLIC_SUPABASE_URL is missing")
    } else {
      addResult(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`)
    }
    
    if (!supabaseKey) {
      addResult("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
    } else {
      addResult(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              🐛 Debug & Testing Page
            </CardTitle>
            <CardDescription>
              Use this page to diagnose connection issues and test functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button onClick={checkEnvironment} disabled={loading}>
                🔍 Check Environment
              </Button>
              <Button onClick={testConnection} disabled={loading}>
                🔌 Test Connection
              </Button>
              <Button onClick={testAuth} disabled={loading}>
                👤 Test Auth
              </Button>
              <Button onClick={testPollCreation} disabled={loading || !user}>
                📊 Test Poll Creation
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              <Button onClick={clearResults} variant="outline" size="sm">
                🗑️ Clear Results
              </Button>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-2 font-mono text-sm">
                    {result}
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Current Status:</h4>
              <div className="space-y-2 text-sm">
                <div>🔐 Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
                <div>👤 User: {user ? `Authenticated (${user.id})` : 'Not authenticated'}</div>
                <div>🔌 Supabase Client: {supabase ? 'Created' : 'Failed'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
