import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
        >
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Privacy Policy
                    </h1>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p className="text-muted-foreground text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                        <p className="text-muted-foreground mb-4">
                            When you use Resume Flow, we collect information that you provide directly to us:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Account Information:</strong> Email address, name, and authentication data when you create an account or sign in via social providers (Google, GitHub, LinkedIn).</li>
                            <li><strong>Resume Data:</strong> Personal information, work experience, education, skills, and other details you enter while building your resume.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our service, including pages visited and features used.</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Provide, maintain, and improve our resume building service</li>
                            <li>Process and store your resume data securely</li>
                            <li>Authenticate your identity and manage your account</li>
                            <li>Generate AI-powered suggestions for your resume content</li>
                            <li>Send you service-related communications</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Storage and Security</h2>
                        <p className="text-muted-foreground">
                            Your resume data is stored securely in our database. We implement industry-standard security measures to protect your information, including encryption in transit and at rest. Your authentication is handled by Supabase, a trusted authentication provider with enterprise-grade security.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Third-Party Services</h2>
                        <p className="text-muted-foreground mb-4">We use the following third-party services:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Supabase:</strong> Authentication and user management</li>
                            <li><strong>Google Gemini AI:</strong> AI-powered content suggestions</li>
                            <li><strong>Social Login Providers:</strong> Google, GitHub, and LinkedIn for optional social authentication</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Your Rights</h2>
                        <p className="text-muted-foreground mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Access your personal data stored in our service</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Export your resume data at any time</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookies and Local Storage</h2>
                        <p className="text-muted-foreground">
                            We use local storage and cookies to maintain your session, remember your preferences (like theme settings), and improve your experience. These are essential for the proper functioning of the service.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy or our data practices, please contact us through our GitHub repository or reach out to the development team.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicy;
