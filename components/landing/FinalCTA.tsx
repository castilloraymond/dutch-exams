import { EmailCapture } from "./EmailCapture";

export function FinalCTA() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-2xl mx-auto px-8 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--landing-navy)] mb-4">
                    Your Permanent Residence<br />Starts Here
                </h2>
                <p className="font-sans-landing text-gray-500 mb-10">
                    Join thousands of expats who chose practice over courses.
                </p>
                <EmailCapture variant="footer" />
            </div>
        </section>
    );
}

