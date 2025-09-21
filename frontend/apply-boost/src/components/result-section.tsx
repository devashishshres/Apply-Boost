"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import {
    CheckCircle,
    Copy,
    Download,
    FileText,
    HelpCircle,
    Mail,
    MessageSquare,
    Shield,
    ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

const sampleResults = {
    recruiterMessage: `Hi [Recruiter Name],

I'm excited about the Senior Frontend Developer position at [Company]. With 5+ years of React experience and a proven track record of building scalable web applications, I believe I'd be a great fit for your team.

My recent work includes leading the development of a customer portal that increased user engagement by 40% and implementing a design system that reduced development time by 30%. I'm particularly drawn to [Company]'s focus on innovation and user experience.

I'd love to discuss how my expertise in modern JavaScript frameworks and passion for creating exceptional user interfaces can contribute to your team's success.

Best regards,
Precious Nyaupane`,

    screeningQuestions: [
        "Can you walk me through your experience with React and modern JavaScript frameworks?",
        "How do you approach responsive design and cross-browser compatibility?",
        "Describe a challenging technical problem you solved in a recent project.",
        "How do you stay updated with the latest frontend development trends and best practices?",
        "Tell me about a time when you had to collaborate with designers and backend developers.",
    ],

    coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at [Company Name]. With over five years of experience in React development and a passion for creating exceptional user experiences, I am excited about the opportunity to contribute to your innovative team.

In my current role, I have successfully led the development of multiple high-impact projects, including a customer portal that increased user engagement by 40% and a comprehensive design system that streamlined our development process. My expertise in modern JavaScript frameworks, combined with my collaborative approach to working with cross-functional teams, has consistently delivered results that exceed expectations.

I am particularly drawn to [Company Name]'s commitment to innovation and user-centric design. I would welcome the opportunity to discuss how my technical skills and passion for frontend development can help drive your team's continued success.

Sincerely,
Precious Nyaupane`,

    fraudDetection: {
        is_suspicious: false,
        reason: "Job posting appears legitimate with specific requirements, clear company information, and professional language.",
        confidence_score: 0.15,
    },
};

export function ResultsSection() {
    const [results, setResults] = useState<any>(null);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);

    useEffect(() => {
        // Check for generated results in localStorage on mount
        const storedResults = localStorage.getItem("applyBoostResults");
        if (storedResults) {
            try {
                setResults(JSON.parse(storedResults));
            } catch (error) {
                console.error("Failed to parse stored results:", error);
            }
        }

        // Listen for new results
        const handleResultsGenerated = (event: CustomEvent) => {
            setResults(event.detail);
        };

        window.addEventListener(
            "resultsGenerated",
            handleResultsGenerated as EventListener
        );

        return () => {
            window.removeEventListener(
                "resultsGenerated",
                handleResultsGenerated as EventListener
            );
        };
    }, []);

    const copyToClipboard = async (text: string, itemName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItem(itemName);
            setTimeout(() => setCopiedItem(null), 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    };

    const downloadCoverLetterPDF = () => {
        const doc = new jsPDF();

        // Set font
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        // Use the actual cover letter data (generated or sample)
        const coverLetterText = displayData.coverLetter;

        // Split text into lines that fit the page width
        const splitText = doc.splitTextToSize(coverLetterText, 170);

        // Add the cover letter text
        doc.text(splitText, 20, 20);

        // Save the PDF
        doc.save("cover-letter.pdf");
    };

    // Use generated results if available, otherwise show sample data
    const displayData = results || sampleResults;
    const isGenerated = !!results;

    return (
        <section
            id="results"
            className="py-24 px-4 bg-gradient-to-b from-background to-card/20"
        >
            <div className="container max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                        Your <span className="text-primary">AI-Powered</span>{" "}
                        Application Suite
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Four essential pieces, perfectly tailored to land your
                        dream job
                    </p>
                </div>

                {/* Fraud Detection Section */}
                {displayData.fraudDetection && (
                    <div className="mb-8">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            {displayData.fraudDetection
                                                .is_suspicious ? (
                                                <ShieldAlert className="w-5 h-5 text-primary" />
                                            ) : (
                                                <Shield className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">
                                                {displayData.fraudDetection
                                                    .is_suspicious
                                                    ? "⚠️ Potential Fraud Detected"
                                                    : "✅ Job Posting Verified"}
                                            </CardTitle>
                                            <CardDescription>
                                                Fraud Meter:{" "}
                                                {Math.round(
                                                    displayData.fraudDetection
                                                        .confidence_score * 100
                                                )}
                                                %
                                                {displayData.fraudDetection
                                                    .is_suspicious &&
                                                    " - Please verify carefully"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-background/50 p-6 rounded-xl text-sm leading-relaxed border border-primary/10">
                                    <p className="mb-4">
                                        {displayData.fraudDetection.reason}
                                    </p>
                                    {displayData.fraudDetection
                                        .is_suspicious && (
                                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                            <p className="text-sm">
                                                <strong className="text-primary">
                                                    Recommendation:
                                                </strong>{" "}
                                                Please verify this job posting
                                                carefully. Check the company's
                                                official website, verify contact
                                                information, and be cautious of
                                                any requests for personal
                                                financial information.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Recruiter Message
                                        </CardTitle>
                                        <CardDescription>
                                            120-150 words to grab attention
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            displayData.recruiterMessage,
                                            "recruiterMessage"
                                        )
                                    }
                                    className="border-primary/20 hover:bg-primary/10 cursor-pointer"
                                >
                                    {copiedItem === "recruiterMessage" ? (
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    {copiedItem === "recruiterMessage"
                                        ? "Copied!"
                                        : "Copy"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-background/50 p-6 rounded-xl text-sm leading-relaxed whitespace-pre-line border border-primary/10">
                                {displayData.recruiterMessage}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Screening Questions
                                        </CardTitle>
                                        <CardDescription>
                                            Likely questions to prepare for
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            (
                                                displayData.screeningQuestions ||
                                                sampleResults.screeningQuestions
                                            ).join("\n\n"),
                                            "screeningQuestions"
                                        )
                                    }
                                    className="border-primary/20 hover:bg-primary/10 cursor-pointer"
                                >
                                    {copiedItem === "screeningQuestions" ? (
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    {copiedItem === "screeningQuestions"
                                        ? "Copied!"
                                        : "Copy"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(
                                    displayData.screeningQuestions ||
                                    sampleResults.screeningQuestions
                                ).map((question: string, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-background/50 p-4 rounded-xl text-sm border border-primary/10"
                                    >
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold mr-3">
                                            {index + 1}
                                        </span>
                                        {question}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Cover Letter
                                        </CardTitle>
                                        <CardDescription>
                                            Professional 3-paragraph cover
                                            letter
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                displayData.coverLetter,
                                                "coverLetter"
                                            )
                                        }
                                        className="border-primary/20 hover:bg-primary/10 cursor-pointer"
                                    >
                                        {copiedItem === "coverLetter" ? (
                                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 mr-2" />
                                        )}
                                        {copiedItem === "coverLetter"
                                            ? "Copied!"
                                            : "Copy"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 hover:bg-primary/10 bg-transparent cursor-pointer"
                                        onClick={downloadCoverLetterPDF}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-background/50 p-6 rounded-xl text-sm leading-relaxed whitespace-pre-line border border-primary/10">
                                {displayData.coverLetter}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Tailored Resume Feedback
                                        </CardTitle>
                                        <CardDescription>
                                            Optimized to match the job
                                            description
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 hover:bg-primary/10 bg-transparent cursor-pointer"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 hover:bg-primary/10 bg-transparent cursor-pointer"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-background/50 p-8 rounded-xl border border-primary/10">
                                <div className="text-center">
                                    <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center mb-6">
                                        <div className="text-center">
                                            <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                                            <div className="text-lg font-medium text-foreground">
                                                Your Resume Feedback
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {isGenerated
                                                    ? "Optimized with job-specific keywords"
                                                    : "Sample preview - upload content to generate"}
                                            </div>
                                        </div>
                                    </div>
                                    {isGenerated && results?.tailoredResume && (
                                        <div className="bg-background/50 p-6 rounded-xl border border-primary/10 mb-6 text-left">
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-sm text-primary mb-2">
                                                    Updated Summary:
                                                </h4>
                                                <p className="text-sm leading-relaxed">
                                                    {results.tailoredResume
                                                        .summary ||
                                                        "No summary available"}
                                                </p>
                                            </div>
                                            {results.tailoredResume.bullets &&
                                                results.tailoredResume.bullets
                                                    .length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-primary mb-2">
                                                            Key Bullet Points:
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {results.tailoredResume.bullets.map(
                                                                (
                                                                    bullet: string,
                                                                    index: number
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="text-sm leading-relaxed flex items-start"
                                                                    >
                                                                        <span className="text-primary mr-2">
                                                                            •
                                                                        </span>
                                                                        {bullet}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                    <p className="text-muted-foreground">
                                        {isGenerated
                                            ? `Resume has been restructured and optimized with job-specific keywords to highlight your most relevant experience and increase ATS compatibility.`
                                            : `Resume will be restructured and optimized with job-specific keywords to highlight your most relevant experience and increase ATS compatibility.`}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-16">
                    <Button
                        size="lg"
                        className="text-lg px-12 py-4 bg-primary hover:bg-primary/90 glow-effect cursor-pointer"
                    >
                        Generate New Application Suite
                    </Button>
                </div>
            </div>
        </section>
    );
}
