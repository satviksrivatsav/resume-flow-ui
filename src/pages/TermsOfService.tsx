import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Terms of Service
                    </h1>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <p className="text-muted-foreground text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using Resume Flow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
                        <p className="text-muted-foreground">
                            Resume Flow is an AI-powered resume building platform that allows users to create, edit, and export professional resumes. The Service includes features such as resume templates, AI-assisted content generation, PDF export, and cloud storage of resume data.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
                        <p className="text-muted-foreground mb-4">To use certain features of the Service, you must:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Create an account with accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Be at least 13 years of age (or the minimum age in your jurisdiction)</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Content</h2>
                        <p className="text-muted-foreground mb-4">You retain ownership of all content you create using the Service, including your resume data. By using the Service, you grant us a limited license to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Store and process your content to provide the Service</li>
                            <li>Generate AI suggestions based on your input</li>
                            <li>Create backups for data recovery purposes</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            You are solely responsible for ensuring the accuracy and legality of your resume content.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Acceptable Use</h2>
                        <p className="text-muted-foreground mb-4">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Use the Service for any unlawful purpose</li>
                            <li>Create false or misleading resume content</li>
                            <li>Attempt to gain unauthorized access to the Service</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use automated systems to access the Service without permission</li>
                            <li>Share your account credentials with others</li>
                        </ul>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. AI-Generated Content</h2>
                        <p className="text-muted-foreground">
                            The Service uses artificial intelligence to generate content suggestions. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. You are responsible for reviewing and verifying all AI-generated suggestions before including them in your resume. We do not guarantee that AI suggestions will result in job offers or interviews.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            The Service, including its design, features, and underlying technology, is owned by Resume Flow and protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the Service without our written permission.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground">
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. YOUR USE OF THE SERVICE IS AT YOUR OWN RISK.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESUME FLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF EMPLOYMENT OPPORTUNITIES, OR BUSINESS INTERRUPTION.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Termination</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Service will immediately cease. You may also delete your account at any time through your account settings.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-xl p-6 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about these Terms of Service, please contact us through our GitHub repository or reach out to the development team.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default TermsOfService;
