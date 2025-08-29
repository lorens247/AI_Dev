import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Create Polls,{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Get Answers
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Build interactive polls, gather opinions, and make data-driven decisions with our modern polling platform. 
              Simple, powerful, and beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" asChild className="btn-success text-lg px-10 py-4 text-lg font-bold">
                <Link href="/polls">🚀 Browse Polls</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-outline text-lg px-10 py-4 text-lg font-bold border-white text-gray-900 hover:bg-white hover:text-blue-600">
                <Link href="/polls/create">✨ Create Poll</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PollApp?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create engaging polls and gather valuable insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover card-gradient text-center group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">📊</span>
                </div>
                <CardTitle className="text-2xl text-gray-900">Easy to Create</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Create polls in seconds with our intuitive interface. Add multiple options, set expiration dates, and customize as needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover card-gradient text-center group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">🗳️</span>
                </div>
                <CardTitle className="text-2xl text-gray-900">Real-time Results</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  See results update in real-time as people vote. Visual charts and percentages make data easy to understand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover card-gradient text-center group">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">🔒</span>
                </div>
                <CardTitle className="text-2xl text-gray-900">Secure & Private</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Secure and private. Control who can vote and ensure fair, tamper-proof results for your polls.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="text-5xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-gray-600 text-lg">Active Users</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-gray-600 text-lg">Polls Created</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                1M+
              </div>
              <div className="text-gray-600 text-lg">Votes Cast</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-gray-600 text-lg">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of users who are already creating and voting on polls. 
              Start building your first poll in under 2 minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" asChild className="btn-success text-lg px-10 py-4 text-lg font-bold">
                <Link href="/auth/register">🚀 Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-outline text-lg px-10 py-4 text-lg font-bold border-white text-gray-900 hover:bg-white hover:text-blue-600">
                <Link href="/polls">🔍 Explore Polls</Link>
              </Button>
            </div>
            <p className="text-gray-400 mt-6 text-sm">
              No credit card required • Free forever plan • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
