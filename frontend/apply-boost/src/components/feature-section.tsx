import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, HelpCircle, FileText, Mail } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Recruiter Messages",
    description:
      "Generate personalized 120-150 word messages that grab recruiters' attention and highlight your best qualities.",
  },
  {
    icon: HelpCircle,
    title: "Screening Questions",
    description:
      "Get five likely recruiter screening questions tailored to your target role, so you can prepare winning answers.",
  },
  {
    icon: FileText,
    title: "Tailored Resume",
    description:
      "Automatically optimize your resume to match job descriptions, highlighting relevant skills and experience.",
  },
  {
    icon: Mail,
    title: "Cover Letters",
    description: "Create compelling 3-paragraph cover letters that tell your story and connect with hiring managers.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Our AI analyzes your resume and target job to create personalized content that makes you stand out from the
            competition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
