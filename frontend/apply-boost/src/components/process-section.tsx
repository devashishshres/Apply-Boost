import { Upload, Brain, Download, CheckCircle } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Info & Job Description",
      description: "Upload your resume, paste the job description, and add any personal notes",
      color: "text-blue-400",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our tool extracts key must-haves from the JD and map them to your resume to show matches and gaps.",
      color: "text-primary",
    },
    {
      icon: CheckCircle,
      title: "Generate the Essentials",
      description: "Get recruiter messages, screening questions, tailored resume, and cover letter",
      color: "text-green-400",
    },
    {
      icon: Download,
      title: "Apply with Confidence",
      description: "Download your materials and apply with AI-optimized content",
      color: "text-purple-400",
    },
  ]

  return (
    <section className="py-24 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            How <span className="text-primary">ApplyBoost</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four quick steps from Job Description to application-ready materials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-card p-8 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 h-full">
                <div
                  className={`w-16 h-16 rounded-2xl bg-background border-2 border-current ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-8 h-8" />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
